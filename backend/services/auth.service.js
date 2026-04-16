const jwt = require('jsonwebtoken');
const User = require("../model/user.model");
const bcrypt = require('bcryptjs');
const secret = process.env.JWT_SECRET;

const register = async ({ name, email, password }) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create new user
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  await newUser.save();
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new Error("Invalid email or password");
  }
  if (user.status !== "active") {
    throw new Error("This Account is inactive, Please contact the Manager or Admin");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }
  const payload = { id: user._id, role: user.role };
  const accessToken = jwt.sign(payload, secret, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, secret, { expiresIn: '7d' });
  await User.findByIdAndUpdate(user._id, { refreshToken });

  return { accessToken, refreshToken };
};

const refresh = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error('Refresh token is required');
  }

  // Verify refresh token
  const decoded = jwt.verify(refreshToken, secret);

  // Find user with this refresh token
  const user = await User.findOne({ _id: decoded.id, refreshToken });
  if (!user) {
    throw new Error('Invalid refresh token');
  }

  // Generate new access token
  const payload = { id: user._id, role: user.role };
  const accessToken = jwt.sign(payload, secret, { expiresIn: '15m' });

  return { accessToken };
};

const logout = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error('Refresh token is required');
  }

  // Find user and remove refresh token
  const user = await User.findOneAndUpdate(
    { refreshToken },
    { refreshToken: null }
  );

  if (!user) {
    throw new Error('Invalid refresh token');
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
};