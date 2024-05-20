const express = require("express");
const upload = require("../middlewares/multer.middleware.js");
const { signupUser, loginUser } = require("../controllers/authController.js");

const router = express.Router();

router.post("/signup", upload.single("profileImg"), signupUser);
router.post("/login", loginUser);

module.exports = router;
