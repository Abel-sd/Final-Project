const express = require("express");
const router = express.Router();

const { verifyJWTToken } = require("../../middleware/JWT.middleware");

const hospitalcontroller = require("../../Hospitals/controllers/hospital.controller");

router.post("/create", hospitalcontroller.createHospital);
router.put("/update/:id", verifyJWTToken, hospitalcontroller.updateHospital);
router.delete("/delete", verifyJWTToken, hospitalcontroller.deleteHospital);
router.get("/get-all", verifyJWTToken, hospitalcontroller.getHospital);
router.get("/getMyHospital", verifyJWTToken,hospitalcontroller.getMyHospital);


module.exports = router;
