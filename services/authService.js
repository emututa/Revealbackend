
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = '7d';

class AuthService {
  async register(name, email, password) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      name,
      email,
      passwordHash
    });

    const token = this.generateToken(user.id);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };
  }

  async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user.id);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };
  }

  generateToken(userId) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}

module.exports = new AuthService();