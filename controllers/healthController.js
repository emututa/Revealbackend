
const healthService = require('../services/healthService');
const { 
  healthConditionsSchema, 
  allergicFoodsSchema, 
  foodReactionsSchema 
} = require('../schemas/healthSchemas');

exports.addHealthConditions = async (req, res) => {
  try {
    const { error, value } = healthConditionsSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: error.details[0].message 
      });
    }

    const { conditions } = value;
    const result = await healthService.updateHealthConditions(req.userId, conditions);
    res.json(result);
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.addAllergicFoods = async (req, res) => {
  try {
    const { error, value } = allergicFoodsSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: error.details[0].message 
      });
    }

    const { foods } = value;
    const result = await healthService.updateAllergicFoods(req.userId, foods);
    res.json(result);
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.addFoodReactions = async (req, res) => {
  try {
    const { error, value } = foodReactionsSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: error.details[0].message 
      });
    }

    const { reactions } = value;
    const result = await healthService.updateFoodReactions(req.userId, reactions);
    res.json(result);
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.getHealthData = async (req, res) => {
  try {
    const healthData = await healthService.getUserHealthData(req.userId);
    res.json(healthData);
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};