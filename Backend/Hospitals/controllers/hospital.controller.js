const { Auth,validate:validateAuth } = require("../../models/Auth");
const { Hospital,validate }  =require("../../models/Hospital");
const { register } = require("../../users/controllers/auth.controller");

const bcrypt = require("bcrypt");
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

module.exports.createHospital = async (req, res) => {
    const { error } = validateAuth(req.body.Auth);
    if (error) return res.status(400).send(error.details[0].message);

    const {error:err}=validate(req.body.hospital);
    if (err) return res.status(400).send(err.details[0].message);

    const  auth =await Auth.findOne({email:req.body.auth.email});
    if (auth) {
        return res.status(400).send("Email Already exist");
    }
    const salt = await bcrypt.genSalt(10);
    req.body.auth.password = await bcrypt.hash(req.body.auth.password, salt);
    
    const user = await Auth.create({
        email: req.body.auth.email,
        password: req.body.auth.password,
        role: "Hospital"
    });

   


    const hospital = new Hospital({
        name: req.body.hospital.name,
        address: req.body.hospital.address,
        phone: req.body.hospital.phone,
        email: req.body.email,
        password: req.body.password,
        AvailableBlood: bloodGroups.map(group => ({
            bloodGroup: group,
            units: 0 // Default to 0 units for each blood group
          })),
        
      
        Auth: user._id
        
    });
    await hospital.save();
    res.send(hospital);
}

module.exports.getHospital = async (req, res) => {
    const hospital = await Hospital.find().populate('Auth');
    res.send(hospital);
}
module.exports.getMyHospital = async (req, res) => {
    const hospital = await Hospital.find({ Auth: req.user.id });
    res.send(hospital);
}
module.exports.updateHospital = async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const hospital = await Hospital.findOneAndUpdate({
        _id: req.user._id
    }, {
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        email: req.body.email,
        password: req.body.password,
        bloodGroup: req.body.bloodGroup,
        location: req.body.location
    }, { new: true });

    if (!hospital) return res.status(404).send("Hospital not found");
    res.send(hospital);

}

module.exports.deleteHospital = async (req, res) => {
    const hospital = await Hospital.findOneAndDelete({ _id: req.user._id });
    if (!hospital) return res.status(404).send("Hospital not found");
    res.send(hospital);
}