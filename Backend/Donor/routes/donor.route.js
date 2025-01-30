const express = require("express");
const router = express.Router();

const { verifyJWTToken } = require("../../middleware/JWT.middleware");

const donorController = require("../controllers/donor.controller");

router.post("/create",  donorController.createDonor);
router.put("/update", verifyJWTToken, donorController.updateDonor);
router.delete("/delete", verifyJWTToken, donorController.deleteDonor);
router.get("/get-all", verifyJWTToken, donorController.getDonor);
router.get("/getMyDonor", verifyJWTToken,donorController.getMyDonor);


module.exports = router;
