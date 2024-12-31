const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const Auction = require('../models/auctionModel');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();


// Create an auction
router.post('/', protect, async (req, res) => {
    const { title, description, startingPrice, endTime } = req.body;

    // Validate inputs
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
            createdBy: req.user.id, // `req.user.id` should be set by `protect` middleware
        });

        // Schedule auction closure
        const io = req.app.get('io'); // Get Socket.IO instance
        const timeout = new Date(endTime) - new Date();

        if (timeout > 0) {
            setTimeout(async () => {
                auction.isClosed = true;
                await auction.save();

                // Emit auctionClosed event
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
        // Fetch auctions and populate both createdBy and bids.user fields
        const auctions = await Auction.find()
            .populate('createdBy', 'username email')  // Populate creator's username and email
            .populate('bids.user', 'username email')  // Populate bidder's username and email
            .exec();

        console.log('Auctions fetched:', auctions); // Add this log for debugging
        res.status(200).json(auctions);
    } catch (error) {
        console.error('Error fetching auctions:', error); // Log the error
        res.status(500).json({ message: 'Error fetching auctions', error: error.message });
    }
});



// Get auction by ID
router.get('/:id', async (req, res) => {
    try {
        const auction = await Auction.findById(req.params.id); // Fetch auction by ID
        if (!auction) {
            return res.status(404).json({ message: 'Auction not found' });
        }
        res.json(auction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// In auctionRoutes.js
router.post('/:id/bid', async (req, res) => {
    try {
      const { id } = req.params;
      const { bid } = req.body;
  
      const auction = await Auction.findById(id);
      if (!auction) {
        return res.status(404).json({ message: "Auction not found" });
      }
  
      if (bid <= auction.currentBid) {
        return res.status(400).json({ message: "Bid must be higher than current bid." });
      }
  
      auction.currentBid = bid;
      await auction.save();
  
      res.json(auction);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
    
  });

  router.post('/place-bid', async (req, res) => {
    try {
      const token = req.header('Authorization').replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const { auctionId, bidAmount } = req.body;
  
      // Ensure bid amount is greater than the current highest bid (or starting price)
      const auction = await Auction.findById(auctionId);
      if (!auction) {
        return res.status(404).json({ message: 'Auction not found' });
      }
  
      const highestBid = auction.bids.length > 0 ? auction.bids[auction.bids.length - 1].bidAmount : auction.startPrice;
  
      if (bidAmount <= highestBid) {
        return res.status(400).json({ message: 'Bid must be higher than the current highest bid' });
      }
  
      // Place the bid
      auction.bids.push({ userId: user._id, bidAmount });
      await auction.save();
  
      // Update the user's bids
      user.bids.push({ auctionId: auction._id, bidAmount });
      await user.save();
  
      // Return the updated user profile
      res.status(200).json({ message: 'Bid placed successfully', user });
  
    } catch (error) {
      console.error('Error placing bid:', error.message);
      res.status(500).json({ message: 'Error placing bid', error: error.message });
    }
  });
  

// Place a bid on an auction
router.post('/:id/bid', protect, async (req, res) => {
    const { amount } = req.body;

    if (!amount) {
        return res.status(400).json({ message: 'Bid amount is required' });
    }

    try {
        const auction = await Auction.findById(req.params.id);

        if (!auction) {
            return res.status(404).json({ message: 'Auction not found' });
        }

        if (auction.isClosed) {
            return res.status(400).json({ message: 'Auction has ended' });
        }

        if (amount <= auction.currentBid) {
            return res.status(400).json({ message: 'Bid must be higher than the current bid' });
        }

        if (new Date() > new Date(auction.endTime)) {
            auction.isClosed = true;
            await auction.save();
            return res.status(400).json({ message: 'Auction has ended' });
        }

        // Add the bid to the auction
        auction.bids.push({
            user: req.user.id,
            amount,
        });

        // Update the current bid
        auction.currentBid = amount;

        await auction.save();

        // Emit bidPlaced event
        const io = req.app.get('io');
        io.to(auction._id.toString()).emit('bidPlaced', {
            auctionId: auction._id,
            bid: amount,
            user: req.user.id,
        });

        res.status(201).json({ message: 'Bid placed successfully', auction });
    } catch (error) {
        res.status(500).json({ message: 'Error placing bid', error: error.message });
    }
});

    // Profile route
router.get('/profile', async (req, res) => {
    try {
        const userProfile = await User.findById(req.user.id); // Replace with your logic
        res.json(userProfile);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching profile' });
    }
});


module.exports = router;
