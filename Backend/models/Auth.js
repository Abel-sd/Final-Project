const mongoose = require('mongoose');
const joi = require('joi');
const { resetpassword } = require('../users/controllers/auth.controller');
const Schema = mongoose.Schema;


const AuthSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Admin', 'Doner','Hospital'],
        default: 'Doner'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetpasswordToken: {
        type: String
    },
    verificationToken: {
        type: String
    },
    });
const joischema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
    role: joi.string().valid('Admin', 'Doner','Hospital')
});
const validate = (obj) => {
    return joischema.validate(obj);
}


const Auth = mongoose.model('Auth', AuthSchema);
module.exports = { Auth, validate };