const jwt = require("jsonwebtoken");
require("dotenv").config();

const { SECRET } = process.env;

const generateToken = ({ _id: id, email, subscription }) => {
    const payload = {
        id,
        email,
        subscription,
    };
    return jwt.sign(payload, SECRET, { expiresIn: "24h" });
};

module.exports = generateToken;
