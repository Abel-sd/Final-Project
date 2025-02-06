const { Auth } = require("../../models/Auth");
const {Sign}=require("../../utils/Jwtutils")
const bcrypt = require("bcrypt");
const sendMail = require("../../utils/sendMail");
module.exports.register = async (request, response, next) => {
    try {
        
        const user = await Auth.findOne({ email: request.body.email });
        if (user) return response.status(400).send("User already registered.");

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(request.body.password, salt);
        const newUser = new Auth({
            email: request.body.email,
            password: hashed,
            role: request.body.role,
        });
        await newUser.save();

        return response.json(newUser)
    } catch (e) {
        console.log(e);
        return response.status(500).json({
            status: false,
            message: "Something went wrong. Please try again",
            data: null,
        });
    }
};
module.exports.login = async (request, response, next) => {
    try {
        const user = await Auth.findOne({ email: request.body.email });
        if (!user) return response.status(400).send("Invalid email or password.");
        if (!user.isVerified) return response.status(400).send("Please verify your email before logging in.");

        const valid = await bcrypt.compare(request.body.password, user.password);
        if (!valid) return response.status(400).send("Invalid email or password.");
const token=Sign({
            id: user._id,
            email: user.email,
            role: user.role,
})
        return response.json({
            status: true,
            message: "You have logged in successfully",
            data: {
                token: token,
                username: user.email,
                role: user.role,
            },
        });
    } catch (e) {
        console.log(e);
        return response.status(500).json({
            status: false,
            message: "Something went wrong. Please try again",
            data: null,
        });
    }
}
module.exports.resetpassword = async (request, response, next) => {
    try {
        const user = await Auth.findOne({ email: request.body.email });
        if (!user) return response.status(400).send("Invalid email or password.");
       const randompassword=Math.random().toString(36).slice(-8);
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(randompassword, salt);
        await Auth.findByIdAndUpdate(user._id, {
            password: hashed,
        });
        console.log(randompassword);
        sendMail(user.email, "Password Reset", `Your new password is ${randompassword}`);
        return response.json({
            status: true,
            message: "Password reset successfully",
            data: null,
        });
    }
    catch (e) {
        console.log(e);
        return response.status(500).json({
            status: false,
            message: "Something went wrong. Please try again",
            data: null,
        });
    }
}
module.exports.requestresetpassword = async (request, response, next) => {
    try {
        const user = await Auth.findOne({ email: request.body.email });
        if (!user) return response.status(400).send("Invalid email or password.");
        const randomresttoken=Math.random().toString(36).slice(-8);
        await Auth.findByIdAndUpdate(user._id, {
            resetpasswordToken: randomresttoken,
        });
        console.log(randomresttoken);
        const text = `<p>Password Reset!</p>
        <p>Please click the link below to rest your password:</p>
        <a href="http://localhost:5173/resetpassword?token=${randomresttoken}">rest password</a>`;

        await sendMail(user.email, "Password Reset", text);
        return response.json({
            status: true,
            message: "Password reset link sent successfully",
            data: null,
        });
    }
    catch (e) {
        console.log(e);
        return response.status(500).json({
            status: false,
            message: "Something went wrong. Please try again",
            data: null,
        });
    }
}

module.exports.restpasswordwithtoken = async (request, response, next) => {
    try {
        console.log(request.body.token);
        const user = await Auth.findOne({
            resetpasswordToken: request.body.token,
        });
        if (!user) return response.status(400).send("Invalid token");
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(request.body.password, salt);
        await Auth.findByIdAndUpdate
            (user._id, {
                password: hashed,
            });
        return response.json({
            status: true,
            message: "Password reset successfully",
            data: null,
        });
    }
    catch (e) {
        console.log(e);
        return response.status(500).json({
            status: false,
            message: "Something went wrong. Please try again",
            data: null,
        });
    }
}

