const express = require('express');
const verifyUser = require('../middlewares/verifyToken');
const { getUserInfo, editUserInfo, addToWishlist, getWishlist, removeFromWishlist } = require('../controllers/userController');
const upload = require("../multer.middleware.js")
const router = express.Router();


// get user info
router.get("/userinfo/:userId", verifyUser, getUserInfo);

// edit user info 
router.patch("/userinfo/edit/:userId", verifyUser, upload.single("profileImg"), editUserInfo);

// add ad to wishlist
router.patch("/wishlist/add/:adId", verifyUser, addToWishlist);

// remove from wishlist
router.patch("/wishlist/remove/:adId", verifyUser, removeFromWishlist);

// get wishlist
router.get("/wishlist", verifyUser, getWishlist);


module.exports = router;
