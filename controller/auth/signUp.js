const { User } = require("../../models");
const gravatar = require("gravatar");
const { v4: uuidv4 } = require('uuid');
const { RequestError, sendEmail } = require("../../helpers");
require("dotenv").config();

const { BASE_URL } = process.env;

const signUp = async (req, res) => {
    const { name, email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
        throw RequestError(409, "Email in use");
    }

    const avatarURL = gravatar.url(email, { protocol: "https" });
    const verificationCode = uuidv4();

    const newUser = new User({ name, email, avatarURL, verificationCode });
    newUser.setPassword(password);
    await newUser.save();

    const msg = {
        to: email,
        subject: "Email verify",
        html: `<a href="${BASE_URL}/api/auth/verify/${newUser.verificationToken}" target="_blank">Verify email</a>`,
    };

    await sendEmail(msg);

    res.status(201).json({
        status: "success",
        code: 201,
        data: {
            user: {
                name: newUser.name,
                email: newUser.email,
                subscription: newUser.subscription,
                avatarURL: newUser.avatarURL,
            },
        },
    });
};

module.exports = signUp;
