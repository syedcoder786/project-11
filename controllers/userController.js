const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// @desc    Register new user
// @route   POST /api/user
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;


  if (!email || !password) {
    res.status(400).json({message: "Please add all fields"});
    throw new Error("Please add all fields");
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({message: "User already exists"});
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({message: "Invalid user data"});
    throw new Error("Invalid user data");
  }
});

// @desc    Authenticate a user
// @route   POST /api/user/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({message: "Invalid credentials"});;
    throw new Error("Invalid credentials");
  }
});

// @desc    Get user data
// @route   GET /api/user/fetchUsers
// @access  Pubic
const fetchUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({}).select('-password')
    res.status(200).json(users)
  } catch (error) {
    console.log(error)
    res.status(400).json({message: "Failed to fetch users"});;
    throw new Error("Failed to fetch users");
  }
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, "secretKey", {
    expiresIn: "30d",
  });
};

module.exports = {
  registerUser,
  loginUser,
  fetchUsers,
};
