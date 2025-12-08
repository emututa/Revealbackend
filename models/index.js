
// ============================================
// models/index.js
// ============================================
const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize with database connection
const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/reveal_db',
  {
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// ============================================
// User Model
// ============================================
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
}, {
  timestamps: true,
  tableName: 'Users'
});

// ============================================
// HealthCondition Model
// ============================================
const HealthCondition = sequelize.define('HealthCondition', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  conditionName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255]
    }
  }
}, {
  timestamps: true,
  tableName: 'HealthConditions'
});

// ============================================
// AllergicFood Model
// ============================================
const AllergicFood = sequelize.define('AllergicFood', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  foodName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255]
    }
  }
}, {
  timestamps: true,
  tableName: 'AllergicFoods'
});

// ============================================
// FoodReaction Model
// ============================================
const FoodReaction = sequelize.define('FoodReaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  foodName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255]
    }
  },
  medicalNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'FoodReactions'
});

// ============================================
// FoodScan Model
// ============================================
const FoodScan = sequelize.define('FoodScan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  foodName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255]
    }
  },
  ingredients: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  isSafe: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  analysisResult: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  warnings: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'FoodScans'
});

// ============================================
// Define Relationships
// ============================================

// User has many HealthConditions
User.hasMany(HealthCondition, {
  foreignKey: 'userId',
  as: 'HealthConditions',
  onDelete: 'CASCADE'
});
HealthCondition.belongsTo(User, {
  foreignKey: 'userId',
  as: 'User'
});

// User has many AllergicFoods
User.hasMany(AllergicFood, {
  foreignKey: 'userId',
  as: 'AllergicFoods',
  onDelete: 'CASCADE'
});
AllergicFood.belongsTo(User, {
  foreignKey: 'userId',
  as: 'User'
});

// User has many FoodReactions
User.hasMany(FoodReaction, {
  foreignKey: 'userId',
  as: 'FoodReactions',
  onDelete: 'CASCADE'
});
FoodReaction.belongsTo(User, {
  foreignKey: 'userId',
  as: 'User'
});

// User has many FoodScans
User.hasMany(FoodScan, {
  foreignKey: 'userId',
  as: 'FoodScans',
  onDelete: 'CASCADE'
});
FoodScan.belongsTo(User, {
  foreignKey: 'userId',
  as: 'User'
});

// ============================================
// Export
// ============================================
module.exports = {
  sequelize,
  User,
  HealthCondition,
  AllergicFood,
  FoodReaction,
  FoodScan
};