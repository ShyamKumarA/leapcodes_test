'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Cart = sequelize.define('cart', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  timestamps: true,
  modelName: 'cart',
  freezeTableName: true,
  paranoid: true,
});

module.exports = Cart;
