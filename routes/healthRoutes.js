
const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');
const { authenticateToken } = require('../middleware/auth');

router.get('/health-data', authenticateToken, healthController.getHealthData);
router.post('/health-conditions', authenticateToken, healthController.addHealthConditions);
router.post('/allergic-foods', authenticateToken, healthController.addAllergicFoods);
router.post('/food-reactions', authenticateToken, healthController.addFoodReactions);

module.exports = router;