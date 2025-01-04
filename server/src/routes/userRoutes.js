const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');
const router = express.Router();

// Fetch user profile
router.get('/profile', protect, async (req, res) => {
    try {
        const userProfile = await User.findById(req.user.id, 'username email'); // Fetch username and email only
        if (!userProfile) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(userProfile);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching profile', error: err.message });
    }
});



module.exports = router;
