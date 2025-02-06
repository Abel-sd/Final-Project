const { Auth } = require("../../models/Auth");
const { Donor, validate } = require("../../models/Donor");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const sendMail = require("../../utils/sendMail");


async function sendVerificationEmail(email, token) {
    const text = `<p>Thank you for registering with us!</p>
                  <p>Please click the link below to verify your email address:</p>
                  <a href="http://localhost:5173/verify?token=${token}">Verify Email</a>`;
    await sendMail(email, "Verify Your Email Address", text);
}

module.exports.createDonor = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { auth, donor } = req.body;
        console.log(auth.email, "req.body.auth");

        const { error } = validate(donor);
        if (error) return res.status(400).send(error.details[0].message);

        const existingAuth = await Auth.findOne({ email: auth.email }).session(session);
        if (existingAuth) return res.status(400).send("Email already exists");

        const salt = await bcrypt.genSalt(10);
        auth.password = await bcrypt.hash(auth.password, salt);
        const verificationToken = Math.random().toString(36).substr(2, 12);

        const user = await Auth.create([{ 
            email: auth.email, 
            password: auth.password, 
            role: "Doner",
            isVerified: false,
            verificationToken
        }], { session });
        
        const newDonor = new Donor({
            ...donor,
            address: donor.address || "Ethiopia",
            Auth: user[0]._id
        });
        await newDonor.save({ session });

        await sendVerificationEmail(auth.email, verificationToken);

        await session.commitTransaction();
        session.endSession();
        res.status(201).send({ message: "Donor created. Please verify your email." });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).send({ message: "Error creating donor", error: error.message });
    }
};

module.exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;
        const user = await Auth.findOne({ verificationToken: token });
        if (!user) return res.status(400).send({ message: "Invalid or expired token" });

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.send({ message: "Email verified successfully" });
    } catch (error) {
        res.status(500).send({ message: "Error verifying email", error: error.message });
    }
};

module.exports.getDonor = async (req, res) => {
    try {
        const donors = await Donor.find().populate("Auth");
        res.send(donors);
    } catch (error) {
        res.status(500).send({ message: "Error retrieving donors", error: error.message });
    }
};

module.exports.getMyDonor = async (req, res) => {
    try {
        const donor = await Donor.findOne({ Auth: req.user.id }).populate("Auth");
        if (!donor) return res.status(404).send({ message: "Donor not found" });
        res.send(donor);
    } catch (error) {
        res.status(500).send({ message: "Error retrieving donor", error: error.message });
    }
};

module.exports.updateDonor = async (req, res) => {
    try {
        const updates = req.body;
        if (Object.keys(updates).length === 0) return res.status(400).send({ message: "No fields provided for update" });

        const donor = await Donor.findOneAndUpdate({ Auth: req.user.id }, updates, { new: true });
        if (!donor) return res.status(404).send({ message: "Donor not found" });

        res.send(donor);
    } catch (error) {
        res.status(500).send({ message: "Error updating donor", error: error.message });
    }
};

module.exports.deleteDonor = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const donor = await Donor.findById(req.body.id).session(session);
        if (!donor) return res.status(404).send("Donor not found");

        await Auth.findByIdAndDelete(donor.Auth, { session });
        await donor.deleteOne({ session });

        await session.commitTransaction();
        session.endSession();
        res.send({ message: "Donor deleted successfully" });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).send({ message: "Error deleting donor", error: error.message });
    }
};

module.exports.deleteIndividualDonor = async (req, res) => {
    console.log(req.params.id, "req.params.id");
    const session = await mongoose.startSession(); // Start a transaction session
    session.startTransaction();
  
    try {
        console.log(req.params.id, "req.params.id");
      const donor = await Donor.findById(req.params.id).session(session);
      if (!donor) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).send("donor not found");
      }
  
      const auth = await Auth.findById(donor.Auth).session(session);
      if (auth) {
        await auth.deleteOne({ session });
      }
  
      await donor.deleteOne({ session });
  
      await session.commitTransaction(); // Commit if everything succeeds
      session.endSession();
  
      res.send("donor deleted successfully");
    } catch (error) {
      await session.abortTransaction(); // Rollback if something fails
      session.endSession();
      console.error("Error deleting donor:", error);
      res.status(500).send("An error occurred while deleting the hospital.");
    }
  };
