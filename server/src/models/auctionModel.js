const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  startingPrice: {
    type: Number,
    required: [true, 'Please add a starting price'],
  },
  currentBid: {
    type: Number,
    default: 0,
  },
  endTime: {
    type: Date,
    required: [true, 'Please provide an end time'],
  },
  isClosed: {
    type: Boolean,
    default: false, // Indicates if the auction is closed
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  bids: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User who placed the bid
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now, // Time when the bid was placed
      },
      status: {
        type: String,
        enum: ['active', 'closed'], // Status of the bid (active or closed)
        default: 'active',
      },
    },
  ],
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Export the Auction model
module.exports = mongoose.model('Auction', auctionSchema);
