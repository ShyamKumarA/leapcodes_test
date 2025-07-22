const jwt = require('jsonwebtoken');
const User = require("../db/models/user.js");
const ApiError = require("../utils/apiError.js");

exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return next(new ApiError(401, 'Unauthorized - No token provided'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id); // Sequelize version
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed: User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    return next(new ApiError(401, 'Unauthorized - Invalid token'));
  }
};
