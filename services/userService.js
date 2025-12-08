


const { User, HealthCondition, AllergicFood, FoodReaction } = require('../models');

class UserService {
  
  // Get all users with optional health data
  async getAllUsers(options = {}) {
    const { limit = 100, offset = 0, includeHealthData = false } = options;
    
    const queryOptions = {
      limit,
      offset,
      order: [['id', 'ASC']],
      attributes: ['id', 'name', 'email', 'createdAt', 'updatedAt']
    };

    // Include health data with correct aliases
    if (includeHealthData) {
      queryOptions.include = [
        { model: HealthCondition, as: 'HealthConditions', attributes: ['conditionName'] },
        { model: AllergicFood, as: 'AllergicFoods', attributes: ['foodName'] },
        { model: FoodReaction, as: 'FoodReactions', attributes: ['foodName', 'medicalNotes'] }
      ];
    }

    const users = await User.findAll(queryOptions);
    const totalUsers = await User.count();

    return {
      users: users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        ...(includeHealthData && {
          healthConditions: (user.HealthConditions || []).map(hc => hc.conditionName),
          allergicFoods: (user.AllergicFoods || []).map(af => af.foodName),
          foodReactions: (user.FoodReactions || []).map(fr => ({
            food: fr.foodName,
            notes: fr.medicalNotes
          }))
        })
      })),
      totalUsers,
      limit,
      offset
    };
  }

  // Get user profile with all health data
  async getUserProfile(userId) {
    const user = await User.findByPk(userId, {
      include: [
        { model: HealthCondition, as: 'HealthConditions' },  // ✅ Added 'as'
        { model: AllergicFood, as: 'AllergicFoods' },        // ✅ Added 'as'
        { model: FoodReaction, as: 'FoodReactions' }         // ✅ Added 'as'
      ]
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      healthConditions: (user.HealthConditions || []).map(hc => hc.conditionName),
      allergicFoods: (user.AllergicFoods || []).map(af => af.foodName),
      foodReactions: (user.FoodReactions || []).map(fr => ({
        food: fr.foodName,
        notes: fr.medicalNotes
      }))
    };
  }

  // Get user by ID (basic info only)
  async getUserById(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  // Update user profile
  async updateUserProfile(userId, updates) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const { name, email } = updates;
    
    // Check if email is being changed and if it's already in use
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new Error('Email already in use');
      }
    }

    // Update user fields
    await user.update({
      ...(name && { name }),
      ...(email && { email })
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email
    };
  }
}

module.exports = new UserService();