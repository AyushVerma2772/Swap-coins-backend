const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadFileOnCloudinary = async (filePath, folderName) => {

    const result = await cloudinary.uploader.upload(filePath, { folder: `swapCoins/${folderName}` });

    fs.unlink(filePath, (err) => {
        if (err) console.log(err);
        else console.log("File deleted");
    });

    // console.log(result)
    return result.secure_url;
}


module.exports = uploadFileOnCloudinary;
