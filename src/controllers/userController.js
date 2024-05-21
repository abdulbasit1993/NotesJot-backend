const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = mongoose.model("User");

exports.registerUser = async function (req, res) {
  try {
    const newUser = new User(req.body);
    newUser.password = bcrypt.hashSync(req.body.password, 10);

    const user = await newUser.save();

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Error Creating User",
      });
    } else {
      user.password = undefined;
      return res.status(201).json({
        success: true,
        message: "User Created Successfully",
        data: user,
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error,
    });
  }
};

exports.loginUser = async function (req, res) {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user || !user.comparePassword(req.body.password)) {
      return res.status(401).json({
        success: false,
        message: "Authentication Failed. Invalid Email or Password.",
      });
    }

    const authToken = jwt.sign(
      { email: user.email, fullName: user.fullName, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      success: true,
      message: "Logged In Successfully",
      data: {
        token: authToken,
      },
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

exports.loginRequired = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. No token provided.",
    });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }

    req.user = decoded;

    next();
  });
};

exports.getUserProfile = async function (req, res) {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User profile fetched successfully.",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching user profile",
      error: error.message,
    });
  }
};
