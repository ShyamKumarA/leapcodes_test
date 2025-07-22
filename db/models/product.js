'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

module.exports = sequelize.define(
  'product',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Name is required',
        },
        notEmpty: {
          msg: 'Name cannot be empty',
        },
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Description is required',
        },
        notEmpty: {
          msg: 'Description cannot be empty',
        },
      },
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Price is required',
        },
        isFloat: {
          msg: 'Price must be a valid number',
        },
      },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Stock is required',
        },
        isInt: {
          msg: 'Stock must be an integer',
        },
        min: {
          args: [0],
          msg: 'Stock cannot be negative',
        },
      },
    },
    imageUrl: {
      type: DataTypes.ARRAY(DataTypes.STRING), // works with PostgreSQL
      allowNull: true,
    },
  },
  {
    modelName: 'product',
    timestamps: true,
    freezeTableName: true,
    paranoid: true, // enables soft delete (adds deletedAt)
  }
);
