const {BloodRequest,validate}=require('../../models/BloodRequest');
const { Hospital } = require('../../models/Hospital');
const { BloodInventory } = require('../../models/Invetory');
const mongoose = require('mongoose');


module.exports.createBloodRequest = async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    console.log(req.body,"req.body")
    const hospital = await Hospital.findOne({ Auth: req.user.id });
    if (!hospital) return res.status(400).send("Hospital not found");
    const bloodRequest = new BloodRequest({
      
        bloodGroup: req.body.bloodGroup,
        units: req.body.units,
        hospital: hospital._id,
        date: new Date(),
        
    });
    await bloodRequest.save();
    res.send(bloodRequest);
}
module.exports.getBloodRequest = async (req, res) => {
    const bloodRequest = await BloodRequest.find();
    res.send(bloodRequest);
}
module.exports.getMyBloodRequest = async (req, res) => {
    const hospital=await Hospital.findOne({Auth:req.user.id});
    const bloodRequest = await BloodRequest.find({ hospital: hospital._id });
    res.send(bloodRequest);
}
module.exports.getMyPendingBloodRequest = async (req, res) => {
    const bloodRequest = await BloodRequest.find({ hospital: req.user.hospital, IsApproved: false });
    res.send(bloodRequest);
}
module.exports.updateBloodRequestApproval = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log(req.body, "req.body");
    console.log(req.params.id, "req.params.id");

    // Find the blood request
    const bloodRequest = await BloodRequest.findById(req.params.id).session(session);

    // Check if the blood request is already approved
    if (bloodRequest && bloodRequest.IsApproved === "Approved") {
      await session.commitTransaction();
      session.endSession();
      return res.status(400).send("BloodRequest has already been approved.");
    }

    // Update the blood request approval status
    const updatedBloodRequest = await BloodRequest.findByIdAndUpdate(
      req.params.id,
      { IsApproved: req.body.IsApproved },
      { new: true, session }
    );

    // If the request is not approved, just commit and return
    if (!req.body.IsApproved) {
      await session.commitTransaction();
      session.endSession();
      return res.send(updatedBloodRequest);
    }

    if (!updatedBloodRequest) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).send("BloodRequest not found");
    }

    // Step 2: Decrement BloodInventory units if sufficient stock is available
    const bloodInventory = await BloodInventory.findOneAndUpdate(
      {
        bloodGroup: updatedBloodRequest.bloodGroup,
        units: { $gte: updatedBloodRequest.units },
      },
      { $inc: { units: -updatedBloodRequest.units } },
      { new: true, session }
    );

    if (!bloodInventory) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        error: "Insufficient blood units available for the requested blood group.",
      });
    }

    // Step 3: Update Hospital's AvailableBlood array
    const hospital = await Hospital.findOneAndUpdate(
      {
        _id: updatedBloodRequest.hospital,
        "AvailableBlood.bloodGroup": updatedBloodRequest.bloodGroup,
      },
      {
        $inc: { "AvailableBlood.$.units": updatedBloodRequest.units },
      },
      { new: true, session }
    );

    // If the blood group does not exist in the AvailableBlood array, add it
    if (!hospital) {
      await Hospital.findByIdAndUpdate(
        updatedBloodRequest.hospital,
        {
          $push: {
            AvailableBlood: {
              bloodGroup: updatedBloodRequest.bloodGroup,
              units: updatedBloodRequest.units,
            },
          },
        },
        { new: true, session }
      );
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

  
    res.send(updatedBloodRequest);
  } catch (error) {
   
    await session.abortTransaction();
    session.endSession();

    console.error("Transaction error:", error);
    res.status(500).send("An error occurred while processing the request.");
  }
};


module.exports.updateBloodRequestGivenToPatient = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Validate request body
  
    // Find and update blood request
    const bloodRequest = await BloodRequest.findByIdAndUpdate(
      req.params.id,
      { IsGivenToPatient: true },
      { new: true, session }
    );
    if (!bloodRequest) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).send("BloodRequest not found");
    }

    // Find hospital
    const hospital = await Hospital.findById(bloodRequest.hospital).session(session);
    if (!hospital) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).send("Hospital not found");
    }

    // Update available blood units
    let bloodUpdated = false;
    hospital.AvailableBlood.forEach((blood) => {
      if (blood.bloodGroup === bloodRequest.bloodGroup) {
        if (blood.units < bloodRequest.units) {
          throw new Error("Not enough blood units available");
        }
        blood.units -= bloodRequest.units;
        bloodUpdated = true;
      }
    });

    if (!bloodUpdated) {
      throw new Error("Blood group not found in hospital inventory");
    }

    // Save hospital update
    await hospital.save({ session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.send(bloodRequest);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error updating blood request:", error);
    res.status(500).send(error.message || "An error occurred while processing the request.");
  }
};
module.exports.deleteBloodRequest = async (req, res) => {

    const bloodRequest = await BloodRequest.findById(req.body.id);
    if (!bloodRequest) return res.status(404).send("BloodRequest not found");
    await bloodRequest.remove();
    res.send(bloodRequest);
}

module.exports.returnBlood = async (req, res) => {
    const bloodRequest = await BloodRequest.findById(req.body.id);
    if (!bloodRequest) return res.status(404).send("BloodRequest not found");
    if (bloodRequest.IsGivenToPatient) return res.status(400).send("Blood already given to patient");
    if (!bloodRequest.IsApproved) return res.status(400).send("Blood not approved yet");
    

    await Hospital.findByIdAndUpdate(bloodRequest.hospital, {
        $inc: { units: -bloodRequest.units }
    }, { new: true });
    await BloodInventory.findOneAndUpdate({ bloodGroup: bloodRequest.bloodGroup }, {
        $inc: { units: bloodRequest.units }
    }, { new: true });


    res.send(bloodRequest);
}

