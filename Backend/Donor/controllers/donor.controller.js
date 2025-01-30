const { Auth } = require("../../models/Auth");
const { Donor,validate } =require("../../models/Donor");
const bcrypt = require("bcrypt");

const { register } =require("../../users/controllers/auth.controller");

module.exports.createDonor = async (req, res) => {
    console.log(req.body.auth.email,"req.body.auth")
    const { error } = validate(req.body.donor);
    if (error) return res.status(400).send(error.details[0].message);

    const  auth =await Auth.findOne({email:req.body.auth.email});
    if (auth) {
        return res.status(400).send("Email Already exist");
    }
    const salt = await bcrypt.genSalt(10);
    req.body.auth.password = await bcrypt.hash(req.body.auth.password, salt);
    
    const user = await Auth.create({
        email: req.body.auth.email,
        password: req.body.auth.password,
        role: "Doner"
    });
    const donor = new Donor({
        name: req.body.donor.name,
        address: "Ethiopia",
        phone: req.body.donor.phone,
        password: req.body.donor.password,
        bloodGroup: req.body.donor.bloodGroup,
        gender: req.body.donor.gender,
        age: req.body.donor.age,
        Auth: user._id,
        location: req.body.donor.location
    });
    await donor.save();
    res.send(donor);
}

module.exports.getDonor = async (req, res) => {
    const donor = await Donor.find().populate("Auth");
    res.send(donor);
}
module.exports.getMyDonor = async (req, res) => {
    const donor = await Donor.find({ Auth: req.user.id }).populate("Auth");
    res.send(donor);
}
module.exports.updateDonor = async (req, res) => {
    try {
        const updates = {};
    

        if (req.body.name !== undefined) updates.name = req.body.name;
        if (req.body.phone !== undefined) updates.phone = req.body.phone;
        if (req.body.bloodGroup !== undefined) updates.bloodGroup = req.body.bloodGroup;
        if (req.body.address !== undefined) updates.address = req.body.address;
        if (req.body.age !== undefined) updates.age = req.body.age;
        if (req.body.gender !== undefined) updates.gender = req.body.gender;
        if (req.body.lastDonationDate !== undefined) updates.lastDonationDate = req.body.lastDonationDate;
    
        
        if (Object.keys(updates).length === 0) {
            return res.status(400).send({ message: "No fields provided for update" });
        }
    
    
        const donor = await Donor.findOneAndUpdate({
            Auth: req.user.id
        }, updates, { new: true });
    
        if (!donor) {
            return res.status(404).send({ message: "Donor not found" });
        }
    
        res.status(200).send(donor);
    } catch (error) {
        res.status(500).send({ message: "Error updating donor", error: error.message });
    }
    
}

module.exports.deleteDonor = async (req, res) => {
    const donor = await Donor.findById
    (req.body.id);
    if (!donor) return res.status(404).send("Donor not found");
    await donor.remove();
    res.send(donor);
}


