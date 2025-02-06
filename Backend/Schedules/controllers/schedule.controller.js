
const { Donor } = require("../../models/Donor");
const { BloodInventory } = require("../../models/Invetory");
const {ScheduleDonation,validate}=require("../../models/ScheduleDonation")
module.exports.getScheduleDonation = async (req, res) => {
    const scheduleDonation = await ScheduleDonation.find().populate('donor');
    res.send(scheduleDonation);
}

module.exports.getScheduleDonationById = async (req, res) => {
    const scheduleDonation = await ScheduleDonation.findById(req.params.id);
    if (!scheduleDonation) return res.status(404).send("ScheduleDonation not found");
    res.send(scheduleDonation);
}

module.exports.createScheduleDonation = async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const donor = await Donor.findOne({ Auth: req.user.id });
    if (!donor) return res.status(404).send("Donor not found");
    const iffutureSchedule = await ScheduleDonation.findOne({ donor: donor._id, date: { $gte: new Date() } ,Iscollected:false});
    if (iffutureSchedule) return res.status(400).send("You already have a future schedule donation");
    if (donor.lastDonationDate) {
        const lastDonationDate = new Date(donor.lastDonationDate);
        const currentDate = new Date();
        const diffDays = Math.ceil((currentDate - lastDonationDate) / (1000 * 60 * 60 * 24));
        if (diffDays < 40) {
            return res.status(400).send("You cannot donate blood again within 40 days of your last donation.");
        }
    }


    const scheduleDonation = new ScheduleDonation({
        donor: donor._id,
        date: req.body.date,
        location: req.body.location,
       
    });
    await scheduleDonation.save();
    res.send(scheduleDonation);
}
module.exports.updateScheduleDonation = async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const scheduleDonation = await ScheduleDonation.findByIdAndUpdate(req.params.id, {
        Iscollected: req.body.Iscollected,
        VolumeCollected: req.body.VolumeCollected
    }, { new: true });
    if (!scheduleDonation) return res.status(404).send("ScheduleDonation not found");
    res.send(scheduleDonation);
}
module.exports.deleteScheduleDonation = async (req, res) => {
    const scheduleDonation = await ScheduleDonation.findByIdAndRemove(req.params.id);
    if (!scheduleDonation) return res.status(404).send("ScheduleDonation not found");
   return res.send(scheduleDonation);
}
module.exports.getMyScheduleDonation = async (req, res) => {
    const scheduleDonation = await ScheduleDonation.find({ donor: req.user.id });

  return  res.send(scheduleDonation);
}
module.exports.completeScheduleDonation = async (req, res) => {

    const scheduleDonation = await ScheduleDonation.findByIdAndUpdate(req.params.id, {
        Iscollected: true,
        VolumeCollected: req.body.VolumeCollected
    }, { new: true }).populate('donor');
    if (!scheduleDonation) return res.status(404).send("ScheduleDonation not found");

   await BloodInventory.findOneAndUpdate({bloodGroup:scheduleDonation.donor.bloodGroup},{
        $inc:{units:req.body.VolumeCollected||0}
    },{new:true,upsert:true});
    const donor = await Donor.findByIdAndUpdate(scheduleDonation.donor._id,{
        lastDonationDate:new Date()
    },{new:true});




    
    if (!scheduleDonation) return res.status(404).send("ScheduleDonation not found");
   return res.send(scheduleDonation);
}
module.exports.getmyTotalCompletedDonation = async (req, res) => {
    console.log(req.user.id);
    const donor=await Donor.findOne({Auth:req.user.id});
    const scheduleDonation = await ScheduleDonation.find({ donor: donor._id, Iscollected: true });
    
    let total = 0;
    scheduleDonation.forEach(element => {
        total += element.VolumeCollected;
    });

    res.send({ 
        recentDonation: scheduleDonation,
        totalDonation: total
     });

}

