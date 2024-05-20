const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    phoneNumber: { type: Number, required: true, },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    address: {
        state: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        localAddress: { type: String, required: true, trim: true }
    },
    profileImgUrl: { type: String, required: true, trim: true },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ad" }],
    ads: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ad" }]
})

const UserModel = mongoose.model("User", userSchema)

module.exports = UserModel;

