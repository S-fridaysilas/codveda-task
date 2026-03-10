const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Name cannot be empty' },
      len: { args: [2, 100], msg: 'Name must be between 2 and 100 characters' }
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: { msg: 'Email already exists' },
    validate: {
      isEmail: { msg: 'Please provide a valid email' },
      notEmpty: { msg: 'Email cannot be empty' }
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Password cannot be empty' },
      len: { args: [6, 255], msg: 'Password must be at least 6 characters' }
    }
  },
  role: {
    type: DataTypes.STRING(10),
    defaultValue: 'user',
    validate: {
      isIn: { args: [['admin', 'user']], msg: 'Role must be admin or user' }
    }
  }
}, {
  tableName: 'auth_users',
  timestamps: false,
  indexes: [
    { unique: true, fields: ['email'] }
  ]
});

module.exports = User;