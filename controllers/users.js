const User = require('../models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const getAllUser = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};
const newUser = async (req, res, next) => {
  try {
    const newUser = new User(req.body);
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Generate a password hash (salt + hash)
    const passwordHashed = await bcrypt.hash(newUser.password, salt);
    // Re-assign password hashed
    const newPassword = passwordHashed;
    newUser.password = newPassword;
    await newUser.save();
    res.status(200).json({ newUser });
  } catch (error) {
    next(error);
  }
};
const getUser = async (req, res, next) => {
  try {
    const id = req.params.userID;
    const users = await User.findOne({ _id: id });
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};
const updateUser = async (req, res, next) => {
  try {
    const id = req.params.userID;
    const newUser = req.body;
    const result = await User.findByIdAndUpdate(id, newUser);
    return res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
const replaceUser = async (req, res, next) => {
  try {
    const id = req.params.userID;
    const newUser = req.body;
    const result = await User.findByIdAndUpdate(id, newUser);
    return res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.userID;
    await User.deleteOne({ _id: id });
    return res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
const GetUserAfterLogin = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({ _id: req.payload.userId });
    if (!foundUser) {
      return res
        .status(403)
        .json({ error: { message: 'Người dùng chưa đăng nhập!!!' } });
    }
    res.status(200).send({ foundUser });
  } catch (error) {
    next(error);
  }
};
const GetUserByPhone = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({ _id: req.payload.userId });
    if (!foundUser) {
      return res
        .status(403)
        .json({ error: { message: 'Người dùng chưa đăng nhập!!!' } });
    }
    const { phone } = req.body;
    console.log('Hien nEk', phone);
    const users = await User.findOne({ phone });
    if (users) {
      return res.status(200).json({ users });
    }
    return res
      .status(400)
      .json({ error: { message: 'Số điện thoại đã không tồn tại.' } });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getAllUser,
  newUser,
  getUser,
  updateUser,
  replaceUser,
  deleteUser,
  GetUserAfterLogin,
  GetUserByPhone,
};
