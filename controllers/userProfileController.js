// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const UserProfile = require("../models/userProfileModel");

// @desc    Create profile
// @route   POST /api/userProfile/create
// @access  Private
const createProfile = asyncHandler(async (req, res) => {
  const { name, imageUrl, gender } = req.body;


  if (!name || !imageUrl || !gender) {
    res.status(400).json({message: "Please add all fields"});
    throw new Error("Please add all fields");
  }

    // Check if user exists
    const profileExists = await UserProfile.findOne({ user:req.user.id });

    if (profileExists) {
      res.status(400).json({message: "Profile already exists"});
      throw new Error("Profile already exists");
    }
  

  // create profile
  try {
    const createdUser = await UserProfile.create({
      user: req.user.id,
      name,
      imageUrl,
      gender,
    });
    res.status(200).json(createdUser)
  } catch (error) {
    console.log(error)
    res.status(400).json({message: "User not created!"});
    throw new Error("Can't create User");
  }
  

});


// @desc    Edit proflie
// @route   POST /api/userProfile/edit
// @access  Private
const editProfile = asyncHandler(async (req, res) => {
  const { name, imageUrl, gender } = req.body;


  if (!name || !imageUrl || !gender) {
    res.status(400).json({message: "Please add all fields"});
    throw new Error("Please add all fields");
  }

  // edit profile
  try {
    await UserProfile.findOneAndUpdate({user:req.user.id}, { name, imageUrl, gender });
    const editedUser = await UserProfile.findOne({ user:req.user.id })
    res.status(200).json(editedUser)
  } catch (error) {
    res.status(400).json({message: "User not updated!"});
    throw new Error("Can't Updated");
  }
  

});

module.exports = {
  createProfile,
  editProfile,
};
