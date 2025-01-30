const express = require("express");
const router = express.Router();

const { verifyJWTToken } = require("../../middleware/JWT.middleware");

const scheduleController = require("../controllers/schedule.controller");

router.post("/create", verifyJWTToken, scheduleController.createScheduleDonation);
router.put("/update/:id", verifyJWTToken, scheduleController.updateScheduleDonation);
router.delete("/delete", verifyJWTToken, scheduleController.deleteScheduleDonation);
router.get("/get-all", verifyJWTToken, scheduleController.getScheduleDonation);
router.get("/getMySchedules", verifyJWTToken,scheduleController.getMyScheduleDonation);
router.get("/getSchedule/:id", verifyJWTToken, scheduleController.getScheduleDonationById);
router.put("/completeSchedule/:id", verifyJWTToken, scheduleController.completeScheduleDonation);
router.get("/getmycompletedSchedules", verifyJWTToken, scheduleController.getmyTotalCompletedDonation);
module.exports = router;
