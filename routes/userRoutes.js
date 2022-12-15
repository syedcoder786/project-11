const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  fetchUsers,
} = require("../controllers/userController");

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/fetchUsers", fetchUsers);

module.exports = router;
