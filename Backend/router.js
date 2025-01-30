const express = require("express");
const router = express.Router();

const userRouter = require("./users/routes/routes");
const hospitalRouter = require("./Hospitals/routes/routes");
const donorRouter = require("./Donor/routes/routes");
const inventoryRouter = require("./Inventory/routes/routes");
const scheduleRouter = require("./Schedules/routes/routes");
const bloodRequestRouter = require("./BloodRequest/routes/routes");


router.use("/user", userRouter);
router.use("/hospital", hospitalRouter);
router.use("/donor", donorRouter);
router.use("/inventory", inventoryRouter);
router.use("/schedule", scheduleRouter);
router.use("/bloodrequest", bloodRequestRouter);



module.exports = router;