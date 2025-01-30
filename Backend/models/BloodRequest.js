const mongoose = require('mongoose');
const joi = require('joi');

const Schema = mongoose.Schema;

const BloodRequestSchema = new Schema({
    hospital: {
        type: Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    },
    bloodGroup: {
        type: String,
        required: true,
        enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
    },
    units: {
        type: Number,
        required: true
    },
    Reason: {
        type: String,
     
    }
    ,
    date: {
        type: Date,
        required: true
    },
    IsApproved: {
        type: String,
        enum: ['Approved', 'Pending', 'Rejected'],
        default: 'Pending'
    },
    IsGivenToPatient: {
        type: Boolean,
        default: false
    }
});

const BloodRequest = mongoose.model('BloodRequest', BloodRequestSchema);

const joischema = joi.object({
    hospital: joi.string(),
    bloodGroup: joi.string().valid('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-').required(),
    units: joi.number().required(),
    Reason: joi.string(),
    date: joi.date().default(Date.now()),
    IsApproved: joi.string().valid('Approved', 'Pending', 'Rejected'),
    IsGivenToPatient: joi.boolean()
});

const validate = (obj) => {
    return joischema.validate(obj);
}

module.exports = { BloodRequest, validate };



