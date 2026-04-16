const userService = require('../services/user.service');

const getAllUsers = async (req, res, next) => {
  try {
    const filters = req.query;
    const result = await userService.getAllUsers(filters);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await userService.getMe(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const updateMe = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateMe(req.user.id, req.body);
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const newUser = await userService.createUser(req.body, req.user.id);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body, req.user.id, req.user.role);
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const result = await userService.deleteUser(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
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
