// const sequelize = require('sequelize');
const { sequelize, Sequelize } = require('@src/server_setup/db');

const User = sequelize.define(
  'user',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      unique: true,
      allowNull: false,
      primaryKey: true
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: [3, 45]
      }
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        len: [0, 45]
      }
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      len: [5, 255],
      validate: {
        isEmail: true
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: [5, 255]
      }
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: [10, 45]
      }
    }
  },
  {
    sequelize,
    modelName: 'user',
    tableName: 'users'
  }
);

exports.User = User;
