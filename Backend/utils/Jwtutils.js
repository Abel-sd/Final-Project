const config = require("../config/config");
const jwt = require("jsonwebtoken");

const Sign = (payload) => {
    return jwt.sign(payload, config.JWT_AUTH_TOKEN, {
        expiresIn: "1h",
    });
    }

const Verify = (token) => {
    return jwt.verify(token, config.JWT_AUTH_TOKEN);
}

module.exports = {
    Sign,
    Verify
}