const UserModel = require("../models/UserModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uploadFileOnCloudinary = require("../utils/cloudinary.js");


// Signup user controller
const signupUser = async (req, res) => {
    try {
        const { name, phoneNumber, email, state, city, localAddress } = req.body;

        // check all filed are given or not
        if (!name || !phoneNumber || !email || !state || !city || !localAddress) return res.json({ message: "All fields are required", success: false });

        // check if user already exist or not
        const isExistingUser = await UserModel.findOne({ email });
        if (isExistingUser) return res.json({ message: "User already exists with this email", success: false });

        // upload image on cloudinary and generating link
        const filePath = req.file.path;
        const profileImgUrl = await uploadFileOnCloudinary(filePath, "profileImages");

        // generating a hashed password using bcrypt
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // create a new user in user model
        const newUser = await UserModel.create({
            name, phoneNumber, email, password: hashedPassword, profileImgUrl,
            address: { state, city, localAddress }
        })

        // creating token using jwt
        const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRETE_KEY, { expiresIn: '5h' });
        // getting userData
        const { password, ...userData } = newUser._doc;

        // sending response to the client
        return res.status(201).json({ token, userData, success: true })


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message, success: false })
    }

}


const loginUser = async (req, res) => {
    try {
        // if email or password is not given
        if (!req.body.email || !req.body.password) return res.json({ message: "All fields are required", success: false });

        // check user already exist or not
        const existingUser = await UserModel.findOne({ email: req.body.email });

        // if user not exist throw error
        if (!existingUser) return res.json({ message: "Invalid email or password", success: false });;

        // compare user password with hashed password
        const comparedPassword = await bcrypt.compare(req.body.password, existingUser.password);

        // if password does not match
        if (!comparedPassword) return res.json({ message: "Invalid email or password", success: false });;

        // generate token
        const token = jwt.sign({ _id: existingUser._id }, process.env.JWT_SECRETE_KEY, { expiresIn: '5h' });
        // getting userData
        const { password, ...userData } = existingUser._doc;

        // send data to user
        return res.status(200).json({ token, userData, success: true })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}





module.exports = { signupUser, loginUser }