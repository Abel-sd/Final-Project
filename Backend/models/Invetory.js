const mongoose = require('mongoose');
const joi = require('joi');

const Schema = mongoose.Schema;

const BloodInventorySchema = new Schema({
    bloodGroup: {
        type: String,
        required: true,
        unique: true,
        enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
    },
    units: {
        type: Number,
        required: true
    }
});

const BloodInventory = mongoose.model('BloodInventory', BloodInventorySchema);

const joischema = joi.object({
    bloodGroup: joi.string().valid('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-').required(),
    units: joi.number().required()
});

const validate = (obj) => {
    return joischema.validate(obj);
}

module.exports = { BloodInventory, validate };