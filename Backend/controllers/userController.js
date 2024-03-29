const User = require("../models/User");
const bcrypt = require("bcrypt");
const ApiFeature = require("../utils/ApiFeature");

const userControllers = {
  getAllUser: async (req, res) => {
    try {
      const userFeature = new ApiFeature(User.find(), req.query)
        .search()
        .filter();
      const user = await userFeature.query;
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const { password, ...others } = user._doc;
      res.status(200).json(others);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  updateUser: async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      (user.name = req.body.name || user.name),
        (user.email = req.body.email || user.email);
      user.phone = req.body.phone || user.phone;
      user.role = req.body.role || user.role;
      user.isAdmin = req.body.isAdmin || user.isAdmin;
      const updatedUser = await user.save();
      res.status(200).json({
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  },
  deleteUser: async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found !!!",
      });
    }
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted...");
    } catch (error) {
      res.status(500).json(err);
    }
  },
  getUserProfile: async (req, res) => {
    const user = await User.findById(req.user.id);
    if (user) {
      res.status(200).json({
        name: user.username,
        email: user.email,
        profilePic: user.profilePic,
        phone: user.phone,
        role: user.role,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(404).json("User not found");
    }
  },

  updateStatusUser: async (req, res) => {
    const user = await User.findById(req.user.id);
    if (user) {
      user.isOnline = req.body.isOnline;
      const updatedUser = await user.save();
      res.status(200).json({
        username: updatedUser.username,
        email: updatedUser.email,
        profilePic: updatedUser.profilePic,
        phone: updatedUser.phone,
        isAdmin: updatedUser.isAdmin,
        role: updatedUser.role,
        isOnline: updatedUser.isOnline,
      });
    } else {
      res.status(404).json("User not found !!!");
    }
  },

  updateProfile: async (req, res) => {
    const user = await User.findById(req.user.id);
    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      user.profilePic = req.body.profilePic || user.profilePic;
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }
      user.password = req.body.password || user.password;
      const updatedUser = await user.save();
      res.status(200).json({
        username: updatedUser.username,
        email: updatedUser.email,
        profilePic: updatedUser.profilePic,
        phone: updatedUser.phone,
        isAdmin: updatedUser.isAdmin,
        role: user.role,
        isOnline: updatedUser.isOnline,
      });
    } else {
      res.status(404).json("User not found !!!");
    }
  },
};

module.exports = userControllers;
