const mongoose = require('mongoose');
const joi = require('joi');

const Schema = mongoose.Schema;

const DonorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    Auth: {
        type: Schema.Types.ObjectId,
        ref: 'Auth',
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    bloodGroup: {
        type: String,
        required: true,
        enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
    },
    age: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    lastDonationDate: {
        type: Date,
       
    },
    gender:{
        type: String,
        required: true,
        enum: ["male","female"]
    }
});

const joischema = joi.object({
    name: joi.string().required(),
    Auth: joi.string(),
    phone: joi.string().required(),
    gender: joi.string(),
    age: joi.number().required(),

    bloodGroup: joi.string().valid('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-').required(),
    address: joi.string().required(),
    lastDonationDate: joi.date()
});

const validate = (obj) => {
    return joischema.validate(obj);
}

const Donor = mongoose.model('Donor', DonorSchema);

module.exports = { Donor, validate };
