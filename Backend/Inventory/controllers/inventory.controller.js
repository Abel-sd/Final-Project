const { Donor } = require("../../models/Donor");
const {BloodInventory,validate}=require("../../models/Invetory");
const sendMail = require("../../utils/sendMail");

module.exports.getInventory = async (req, res) => {
    const inventory = await BloodInventory.find();
    const totalUnits = inventory.reduce((acc, item) => acc + item.units, 0);
    res.send({
        inventory,
        totalUnits
    });
}
module.exports.AlertLowInventory = async (req, res) => {
    try {
        // Retrieve all blood inventories
        const inventory = await BloodInventory.find();

        // Filter blood groups with less than 10 units
        const lowInventory = inventory.filter(item => item.units < 10);

        // Check if there are any low inventory items
        if (lowInventory.length === 0) {
            return res.status(200).send("No low inventory items.");
        }
        const ss = lowInventory.map(item => item.bloodGroup);
        const donors = await Donor.find({
            bloodGroup: { $in: ss }
        }).populate("Auth");
        
        console.log(lowInventory.map(item => item.bloodGroup));

        console.log(donors);

        const failedEmails = []; // To track donors for whom emails failed

        // Map each donor to their specific email content and handle errors individually
        const sendEmails = donors.map(async donor => {
            try {
                console.log(donor);
                const matchingBloodGroup = lowInventory.find(item => item.bloodGroup === donor.bloodGroup);
                if (matchingBloodGroup) {
                    const text = `<p>Dear ${donor.name},</p>
                                  <p>Blood group <strong>${matchingBloodGroup.bloodGroup}</strong> is urgently needed. Current stock: ${matchingBloodGroup.units} units.</p>
                                  <p>Your donation can save lives. Please consider donating today.</p>`;
                    await sendMail(donor.Auth.email, "Urgent: Blood Donation Needed", text);
                }
            } catch (emailError) {
                console.error(`Failed to send email to ${donor.email}:`, emailError.message);
                failedEmails.push(donor.email); // Log failed email
            }
        });

        // Await all email sending promises
        await Promise.all(sendEmails);

        // Log if any emails failed
        if (failedEmails.length > 0) {
            console.warn("Failed to send emails to the following donors:", failedEmails);
        }

        res.status(200).send({
            message: "Emails sent successfully to relevant donors.",
            failedEmails,
        });
    } catch (error) {
        console.error("Error sending low inventory alerts:", error);
        res.status(500).send("Error sending email alerts.");
    }
};
