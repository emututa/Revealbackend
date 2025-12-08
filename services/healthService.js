
const { HealthCondition, AllergicFood, FoodReaction, User } = require('../models');
const { sequelize } = require('../models');

class HealthService {
  async updateHealthConditions(userId, conditions) {
    const transaction = await sequelize.transaction();

    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      await HealthCondition.destroy({ 
        where: { userId },
        transaction 
      });

      if (conditions && conditions.length > 0) {
        const conditionRecords = conditions.map(condition => ({
          userId,
          conditionName: condition.trim()
        }));
        await HealthCondition.bulkCreate(conditionRecords, { transaction });
      }

      await transaction.commit();
      return { message: 'Health conditions updated successfully' };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateAllergicFoods(userId, foods) {
    const transaction = await sequelize.transaction();

    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      await AllergicFood.destroy({ 
        where: { userId },
        transaction 
      });

      if (foods && foods.length > 0) {
        const foodRecords = foods.map(food => ({
          userId,
          foodName: food.trim()
        }));
        await AllergicFood.bulkCreate(foodRecords, { transaction });
      }

      await transaction.commit();
      return { message: 'Allergic foods updated successfully' };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateFoodReactions(userId, reactions) {
    const transaction = await sequelize.transaction();

    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      await FoodReaction.destroy({ 
        where: { userId },
        transaction 
      });

      if (reactions && reactions.length > 0) {
        const reactionRecords = reactions.map(reaction => ({
          userId,
          foodName: reaction.foodName.trim(),
          medicalNotes: reaction.medicalNotes || null
        }));
        await FoodReaction.bulkCreate(reactionRecords, { transaction });
      }

      await transaction.commit();
      return { message: 'Food reactions updated successfully' };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }



async getUserHealthData(userId) {
  const user = await User.findByPk(userId, {
    include: [
      { model: HealthCondition, as: 'HealthConditions' },
      { model: AllergicFood, as: 'AllergicFoods' },
      { model: FoodReaction, as: 'FoodReactions' }
    ]
  });

  if (!user) throw new Error('User not found');

  return {
    success: true,
    data: {
      healthConditions: user.HealthConditions.map(hc => hc.conditionName),
      allergicFoods: user.AllergicFoods.map(af => af.foodName),
      foodReactions: user.FoodReactions.map(fr => ({
        food: fr.foodName,
        notes: fr.medicalNotes
      }))
    }
  };
}


}

module.exports = new HealthService();