const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const authApi = require("./APIs/authApi");
const userApi = require("./APIs/userApi");
const adApi = require("./APIs/adApi");
const otpApi = require("./APIs/otpApi");
const cors = require("cors");
const AdModel = require('./models/AdModel');
const UserModel = require('./models/UserModel');


// create express app
const app = express();

app.use(express.urlencoded());
app.use(express.json());
app.use(cors());


// connect with mongoose
mongoose.connect(process.env.MONGODB_URL)
    .then(() => { console.log("DB connected successfully") })
    .catch((error) => { console.log(error) })


// routes for auth
app.use(authApi);
app.use(userApi);
app.use(adApi);
app.use(otpApi);




const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})




