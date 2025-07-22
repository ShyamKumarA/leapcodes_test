const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

exports.comparePasswords = async (inputPassword, userPassword) => {
  return await bcrypt.compare(inputPassword, userPassword);
};
