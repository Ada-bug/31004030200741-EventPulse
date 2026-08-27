const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const appConfig = require('../config/appConfig');

// Sign up
const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email is already registered', 400));
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email,
    password,
    role: 'attendee',
  });

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    appConfig.jwtSecret,
    { expiresIn: appConfig.jwtExpiresIn }
  );

  res.status(201).json({
    status: 'success',
    token,
    data: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

// Login
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new AppError('Invalid email or password', 401));
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return next(new AppError('Invalid email or password', 401));
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    appConfig.jwtSecret,
    { expiresIn: appConfig.jwtExpiresIn }
  );

  res.status(200).json({
    status: 'success',
    token,
  });
});

module.exports = {
    register,
    login
}