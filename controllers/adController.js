const uploadFileOnCloudinary = require("../utils/cloudinary.js");
const AdModel = require("../models/AdModel.js");
const UserModel = require("../models/UserModel.js");

// controller for ad
const createAd = async (req, res) => {
    try {

        const { title, description, price, category, condition, year, metal } = req.body;

        if (!title || !description || !price || !category || !condition || !year || !metal) throw new Error("All filed are required")

        const { _id: ownerId } = req.user;
        const files = req.files;

        const images = [];

        for (const file of files) {
            images.push(await uploadFileOnCloudinary(file.path, "adImages"))
        }
        // console.log(req.body, ownerId, images)

        const newAd = await AdModel.create({ title, description, price, category, owner: ownerId, images, condition, year, metal });

        // add ad to the user who created it
        const user = await UserModel.findById(ownerId);
        user.ads.push(newAd);
        await user.save();

        res.status(201).json(newAd);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server error" });
    }

}

const getAllAds = async (req, res) => {
    try {
        const page = Number(req.query.page);
        // console.log(page);
        const limit = 12;
        const skip = (page - 1) * limit;
        const category = req.query.category;
        const queryObject = {};

        if (category) {
            queryObject.category = category;
        }

        const allAds = await AdModel.find(queryObject)
            .populate({
                path: 'owner',
                select: 'name phoneNumber email profileImgUrl address',
                model: UserModel
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalResults = allAds.length;
        const hasMore = totalResults < limit ? false : true;

        return res.json({ ads: allAds, success: true, totalResults, hasMore });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server error", success: false });
    }
}


// get a single ad by id
const getAdById = async (req, res) => {
    try {
        // get adId from params
        const { adId } = req.params;

        // find ad by adId
        const ad = await AdModel.findById(adId).populate({
            path: 'owner',
            select: 'name phoneNumber email profileImgUrl address',
            model: UserModel
        });

        // if ad is not found return 404 message
        if (!ad) {
            return res.status(404).json({ message: "ad not found", success: false });
        }

        // return user info
        return res.status(200).json({ ad, success: true });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}


// delete a ad
const deleteAd = async (req, res) => {
    try {
        const { adId } = req.params;
        const { _id: userId } = req.user;


        if (!adId) return res.json({ message: "Ad id is not given", success: false });

        await AdModel.findByIdAndDelete(adId);

        const user = await UserModel.findById(userId);

        const updatedAds = user.ads.filter(ele => ele._id !== adId);

        user.ads = updatedAds;
        await user.save();

        return res.json({ message: "Ad deleted", success: true })


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}


// edit a ad
const editAd = async (req, res) => {
    try {
        const { adId } = req.params;
        const { title, description, price, year, category, condition, metal } = req.body;
        const queryObject = {};

        if (title) queryObject.title = title;
        if (description) queryObject.description = description;
        if (price) queryObject.price = price;
        if (year) queryObject.year = year;
        if (category) queryObject.category = category;
        if (condition) queryObject.condition = condition;
        if (metal) queryObject.metal = metal;

        if (req.files && req.files.length) {
            const images = [];

            for (const file of req.files) {
                images.push(await uploadFileOnCloudinary(file.path, "adImages"))
            }

            queryObject.images = images;
        }

        const updatedAd = await AdModel.findByIdAndUpdate(adId, queryObject, { new: true });

        if (!updatedAd) {
            return res.status(404).json({ message: "User not found" });
        }
        // console.log(updatedUser)

        return res.status(200).json({ updatedUser: updatedAd, success: true });


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}



const getSearchedAds = async (req, res) => {
    try {
        const { q, category, condition, minprice, maxprice } = req.query;

        const regex = new RegExp(q, 'i');

        const query = {
            $or: [
                { title: { $regex: regex } },
                { description: { $regex: regex } }
            ]
        };

        if (category) {
            query.category = category;
        }

        if (condition) {
            query.condition = condition;
        }

        if (minprice !== undefined) {
            query.price = { $gte: parseInt(minprice) };
        }

        if (maxprice !== undefined) {
            if (query.price) {
                // If price range already specified, add $lte condition
                query.price.$lte = parseInt(maxprice);
            } else {
                // If no min price specified, create new price range condition
                query.price = { $lte: parseInt(maxprice) };
            }
        }

        // Find ads that match the constructed query
        const searchedAds = await AdModel.find(query).populate({
            path: 'owner',
            select: 'name phoneNumber email profileImgUrl address',
            model: UserModel
        });

        return res.status(200).json({ ads: searchedAds, success: true, totalResults: searchedAds.length });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}


module.exports = { createAd, getAllAds, getAdById, deleteAd, editAd, getSearchedAds }