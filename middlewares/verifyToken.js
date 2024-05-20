const jwt = require('jsonwebtoken');

// verify the user
const verifyUser = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) return res.status(403).res.json({ msg: "Not authorized" });

    jwt.verify(token, process.env.JWT_SECRETE_KEY, (err, data) => {
        if (err) return res.status(403).json({ msg: "Wrong or expired token" });

        else {
            // data = { id: existingUser._id, isAdmin: existingUser.isAdmin }
            req.user = data;
            next();
        }
    })
}

module.exports = verifyUser;
