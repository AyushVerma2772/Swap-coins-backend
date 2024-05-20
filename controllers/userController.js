const UserModel = require("../models/UserModel");
const uploadFileOnCloudinary = require("../utils/cloudinary");

const getUserInfo = async (req, res) => {
    try {
        // get userId from params
        const { userId } = req.params;

        // find user by userId
        const user = await UserModel.findById(userId).populate("ads");

        // if user is not found return 404 message
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // return user info
        return res.status(200).json(user);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const editUserInfo = async (req, res) => {

    try {
        const { userId } = req.params;
        const { name, phoneNumber, state, city, localAddress } = req.body;

        const queryObject = {};

        if (name) queryObject.name = name;
        if (phoneNumber) queryObject.phoneNumber = phoneNumber;

        if (state || city || localAddress) {
            queryObject.address = {};
            if (state) queryObject.address.state = state;
            if (city) queryObject.address.city = city;
            if (localAddress) queryObject.address.localAddress = localAddress;
        }

        if (req.file) {
            const filePath = req.file.path;
            const profileImgUrl = await uploadFileOnCloudinary(filePath, "profileImages");
            queryObject.profileImgUrl = profileImgUrl;
        }


        const updatedUser = await UserModel.findByIdAndUpdate(userId, queryObject, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        // console.log(updatedUser)

        return res.status(200).json({ updatedUser, success: true });


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }

}

const addToWishlist = async (req, res) => {
    try {
        const { adId } = req.params;
        const { _id: userId } = req.user;

        const user = await UserModel.findById(userId);
        if (!user.wishlist.includes(adId)) user.wishlist.push(adId);
        await user.save();

        return res.status(201).json({ updatedUser: user, success: true });


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const removeFromWishlist = async (req, res) => {
    try {
        const { adId } = req.params;
        const { _id: userId } = req.user;

        const user = await UserModel.findById(userId);
        const updatedWishlist = user.wishlist.filter(ele => ele != adId);

        // console.log(updatedWishlist)
        user.wishlist = updatedWishlist;
        await user.save();

        return res.status(201).json({ updatedUser: user, success: true });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getWishlist = async (req, res) => {
    try {
        const { adId } = req.params;
        const { _id: userId } = req.user;

        const user = await UserModel.findById(userId).populate("wishlist");
        
        const wishlist = user.wishlist;

        return res.status(201).json({ wishlist, success: true });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { getUserInfo, editUserInfo, addToWishlist, removeFromWishlist, getWishlist };