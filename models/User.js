const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcryptjs');

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      default: null,
    },
    phone: {
      type: String,
      min: 3,
      max: 20,
      default: null,
    },
    password: {
      type: String,
    },
    authGoogleID: {
      type: String,
      default: null,
    },
    authFacebookID: {
      type: String,
      default: null,
    },
    authType: {
      type: String,
      enum: ['local', 'google', 'facebook'],
      default: 'local',
    },
    avatar: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      default: 'user',
    },
    active: {
      type: Boolean,
      default: false,
    },
    birthday: {
      type: Date,
    },
    gender: {
      type: Boolean,
    },
  },
  { timestamps: true }
);
UserSchema.methods.isValidPassword = async function (newPassword) {
  try {
    return await bcrypt.compare(newPassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};
const User = mongoose.model('User', UserSchema);
module.exports = User;
