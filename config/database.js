const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('codveda_db', 'root', 'Spl01dish@', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    dateStrings: true,
    typeCast: true
  },
  timezone: '+00:00',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = sequelize;