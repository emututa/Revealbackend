

const userService = require('../services/userService');

exports.getProfile = async (req, res) => {
  try {
    const profile = await userService.getUserProfile(req.userId);
    res.json(profile);
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const updatedUser = await userService.updateUserProfile(req.userId, {
      name,
      email
    });

    res.json(updatedUser);
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'Email already in use') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};