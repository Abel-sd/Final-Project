const { Auth } = require("../../models/Auth");
const {Sign}=require("../../utils/Jwtutils")
const bcrypt = require("bcrypt");
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
