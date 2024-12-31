const Auction = require('../models/auctionModel');
const { setTimeout } = require('timers/promises');

const monitorAuctions = async (io) => {
    console.log("Auction monitor started...");
    
    while (true) {
        try {
            const now = new Date();
            const auctions = await Auction.find({ status: 'active', endTime: { $lte: now } });

            for (const auction of auctions) {
                auction.status = 'closed';
                await auction.save();

                // Notify all clients about the auction closure
                io.to(auction._id.toString()).emit('auctionClosed', {
                    auctionId: auction._id,
                    message: 'This auction has ended.',
                });

                console.log(`Auction closed: ${auction._id}`);
            }
        } catch (error) {
            console.error("Error monitoring auctions:", error);
        }

        // Wait for 10 seconds before checking again
        await setTimeout(10000);
    }
};

module.exports = monitorAuctions;
