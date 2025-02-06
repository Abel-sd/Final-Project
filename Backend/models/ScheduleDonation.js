const mongoose = require('mongoose');
const joi = require('joi');

const Schema = mongoose.Schema;

const ScheduleDonationSchema = new Schema({
    donor: {
        type: Schema.Types.ObjectId,
        ref: 'Donor',
        required: true
    },
   
    date: {
        type: Date,
        required: true
    },
    Iscollected: {
        type: Boolean,
        default: false
    },
    VolumeCollected: {
        type: Number,
        default: 0
    },
    location: {
        type: String,
        required: true
    }
});

const ScheduleDonation = mongoose.model('ScheduleDonation', ScheduleDonationSchema);

const joischema = joi.object({
    donor: joi.string(),
    date: joi.date().required(),
    Iscollected: joi.boolean(),
    VolumeCollected: joi.number(),
    location: joi.string()
});

const validate = (obj) => {
    return joischema.validate(obj);
}

module.exports = { ScheduleDonation
    , validate };
