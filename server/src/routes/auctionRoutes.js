const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const Auction = require('../models/auctionModel');
const User = require('../models/User');
const router = express.Router();

// Helper function to fetch auction and validate status
async function getAuctionById(id) {
    const auction = await Auction.findById(id)
        .populate('createdBy', 'username email')
        .populate('bids.user', 'username email');

    if (!auction) {
        throw new Error('Auction not found');
    }
    return auction;
}

// Helper function to check if auction is closed
function isAuctionClosed(auction) {
    return auction.isClosed || new Date() > new Date(auction.endTime);
}

// Create an auction
router.post('/', protect, async (req, res) => {
    const { title, description, startingPrice, endTime } = req.body;

    if (!title || !description || !startingPrice || !endTime) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const auction = await Auction.create({
            title,
            description,
            startingPrice,
            currentBid: startingPrice,
            endTime,
            createdBy: req.user.id,
        });

        const io = req.app.get('io'); // Socket.IO instance
        const timeout = new Date(endTime) - new Date();
        if (timeout > 0) {
            setTimeout(async () => {
                auction.isClosed = true;
                await auction.save();
                io.to(auction._id.toString()).emit('auctionClosed', {
                    auctionId: auction._id,
                    message: 'Auction has ended',
                });
            }, timeout);
        }

        res.status(201).json(auction);
    } catch (error) {
        res.status(500).json({ message: 'Error creating auction', error: error.message });
    }
});

// Fetch all auctions
router.get('/', async (req, res) => {
    try {
        const auctions = await Auction.find()
            .populate('createdBy', 'username email')
            .populate('bids.user', 'username email');

        res.status(200).json(auctions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching auctions', error: error.message });
    }
});

// Get auction by ID
router.get('/:id', async (req, res) => {
    try {
        const auction = await Auction.findById(req.params.id);
        if (!auction) {
            return res.status(404).json({ message: 'Auction not found' });
        }
        res.json(auction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Fetch user profile
router.get('/profile', protect, async (req, res) => {
    try {
        const userProfile = await User.findById(req.user.id).select('-password');
        if (!userProfile) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(userProfile);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
});

module.exports = router;

// Place a bid
router.post('/:id/bid', protect, async (req, res) => {
    const { amount } = req.body;

    if (!amount) {
        return res.status(400).json({ message: 'Bid amount is required' });
    }

    try {
        const auction = await getAuctionById(req.params.id);

        if (isAuctionClosed(auction)) {
            return res.status(400).json({ message: 'Auction has ended' });
        }

        if (amount <= auction.currentBid) {
            return res.status(400).json({ message: 'Bid must be higher than the current bid' });
        }

        auction.bids.push({ user: req.user.id, amount });
        auction.currentBid = amount;

        await auction.save();

        const io = req.app.get('io');
        io.to(auction._id.toString()).emit('bidPlaced', {
            auctionId: auction._id,
            bid: amount,
            user: req.user.id,
        });

        res.status(201).json({ message: 'Bid placed successfully', auction });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
