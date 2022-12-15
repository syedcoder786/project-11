const express = require("express");
const router = express.Router();
const {
  createProfile,
  editProfile,
} = require("../controllers/userProfileController");
const { protect } = require("../middleware/authMiddleware");

router.post("/create", protect, createProfile);
router.post("/edit", protect, editProfile);

module.exports = router;
