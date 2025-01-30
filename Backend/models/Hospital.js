const mongoose = require('mongoose');
const joi = require('joi');

const Schema = mongoose.Schema;

const HospitalSchema = new Schema({

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
    address: {
        type: String,
        required: true
    },
AvailableBlood:[
    {
        bloodGroup: {
            type: String,
            required: true,
            enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
        },
        units: {
            type: Number,
            required: true
        }
    }
]
});

const joischema = joi.object({
    name: joi.string().required(),
    Auth: joi.string(),
    phone: joi.string().required(),
    address: joi.string().required(),
    AvailableBlood: joi.array().items(joi.object({
        bloodGroup: joi.string().valid('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-').required(),
        units: joi.number().required()
    }))
});

const validate = (obj) => {
    return joischema.validate(obj);
}

const Hospital = mongoose.model('Hospital', HospitalSchema);

module.exports = { Hospital, validate };