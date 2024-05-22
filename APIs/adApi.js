const express = require("express");
const upload = require("../middlewares/multer.middleware");
const verifyUser = require("../middlewares/verifyToken.js");
const { createAd, getAllAds, getAdById, deleteAd, editAd, getSearchedAds } = require("../controllers/adController.js");

const router = express.Router();

// create a ad
router.post("/ad/create", verifyUser, upload.array("images", 5), createAd);

// get all products
router.get("/ads", getAllAds);

// search ads 
router.get("/ads/search", getSearchedAds);


// get a single ad by its id
router.get("/ads/:adId", verifyUser, getAdById );

// delete a ad by it ids
router.delete("/ad/delete/:adId", verifyUser, deleteAd );

// edit a ad by its id
router.patch("/ad/edit/:adId", verifyUser, upload.array("images", 5), editAd);



module.exports = router;