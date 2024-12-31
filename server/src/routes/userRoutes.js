const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Define static routes first
router.get('/profile', async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1]; // Extract the token
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded || !decoded.id) {
        return res.status(403).json({ message: 'Invalid token' });
      }
  
      console.log('Decoded ID:', decoded.id);
  
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
      });
    } catch (error) {
      console.error('Error in /profile route:', error);
      if (error.name === 'JsonWebTokenError') {
        return res.status(403).json({ message: 'Invalid token' });
      }
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  

module.exports = router;
