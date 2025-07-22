const User = require("../db/models/user.js");
const catchAsync = require("../middleware/catchAsync.js");
const ApiError = require("../utils/apiError.js");
const { comparePasswords, generateToken } = require("../utils/auth.js");

exports.signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ApiError(400, 'Email and password are required'));
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return next(new ApiError(401, 'Invalid credentials'));
  }

  const isPasswordValid = await comparePasswords(password, user.password);
  if (!isPasswordValid) {
    return next(new ApiError(401, 'Invalid credentials'));
  }

  const token = generateToken(user.id); // Sequelize ID

  // Exclude password from response
  const { password: _, ...userData } = user.toJSON();

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    token,
    data: userData,
  });
});


exports.createAdmin = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next(new ApiError(400, "All fields are required"));
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return next(new ApiError(409, "User already exists with this email"));
  }

  const admin = await User.create({
    username,
    email,
    password,
    role: "admin",
  });

  const { password: _, ...adminData } = admin.toJSON();

  res.status(201).json({
    success: true,
    message: "Admin created successfully",
    data: adminData,
  });
});


