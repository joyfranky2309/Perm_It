const User = require('../model/user.model');
const bcrypt = require('bcryptjs');

const getAllUsers = async (filters) => {
  const query = {};

  // Apply filters
  if (filters.role) {
    query.role = filters.role;
  }
  if (filters.status) {
    query.status = filters.status;
  }
  if (filters.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: 'i' } },
      { email: { $regex: filters.search, $options: 'i' } }
    ];
  }

  // Pagination
  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 10;
  const skip = (page - 1) * limit;

  const total = await User.countDocuments(query);
  const users = await User.find(query).select('-password -refreshToken').populate('createdBy', 'name role').populate('updatedBy', 'name role').skip(skip).limit(limit);

  return {
    data: users,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
};

const getMe = async (userId) => {
  const user = await User.findById(userId).select('-password -refreshToken').populate('createdBy', 'name role').populate('updatedBy', 'name role');
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

const updateMe = async (userId, updateData) => {
  // Prevent updating sensitive fields
  const allowedFields = ['name'];
  const filteredData = {};

  Object.keys(updateData).forEach(key => {
    if (allowedFields.includes(key)) {
      filteredData[key] = updateData[key];
    }
  });

  // Handle password update
  if (updateData.password) {
    filteredData.password = await bcrypt.hash(updateData.password, 12);
  }

  const user = await User.findByIdAndUpdate(userId, filteredData, { new: true }).select('-password -refreshToken').populate('createdBy', 'name role').populate('updatedBy', 'name role');
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password -refreshToken').populate('createdBy', 'name role').populate('updatedBy', 'name role');
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

const createUser = async (userData, createdBy) => {
  const { name, email, password, role = 'user', status = 'active' } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role,
    status,
    createdBy,
  });

  await newUser.save();

  // Return user without password
  const user = await User.findById(newUser._id).select('-password -refreshToken').populate('createdBy', 'name role').populate('updatedBy', 'name role');
  return user;
};

const updateUser = async (userId, updateData, updatedBy, requesterRole) => {
  // Check if target user exists
  const targetUser = await User.findById(userId);
  if (!targetUser) {
    throw new Error('User not found');
  }

  // Role restriction: manager cannot update admin
  if (requesterRole === 'manager' && targetUser.role === 'admin') {
    const error = new Error('Managers cannot update admin users');
    error.statusCode = 403;
    throw error;
  }

  // Handle password update
  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 12);
  }

  // Add updatedBy
  updateData.updatedBy = updatedBy;

  const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password -refreshToken').populate('createdBy', 'name role').populate('updatedBy', 'name role');
  return user;
};

const deleteUser = async (userId) => {
  const user = await User.findByIdAndUpdate(userId, { status: 'inactive' })
  if (!user) {
    throw new Error('User not found');
  }
  return { message: 'User deleted successfully' };
};

module.exports = {
  getAllUsers,
  getMe,
  updateMe,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};