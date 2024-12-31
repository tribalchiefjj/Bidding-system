// // File: src/models/User.js

// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//     username: {
//         type: String,
//         required: true,
//         // trim: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//         // trim: true,
//         // lowercase: true,
//     },
//     password: {
//         type: String,
//         required: true,
//     },
// }, {
//     timestamps: true, // Automatically adds createdAt and updatedAt fields
// });

// module.exports = mongoose.model('User', userSchema);


const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bids: [
    {
      auctionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auction' },
      bidAmount: { type: Number, required: true },
      placedAt: { type: Date, default: Date.now },
    },
  ],
});

const User = mongoose.model('User', userSchema);

module.exports = User;

