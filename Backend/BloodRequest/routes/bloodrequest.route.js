const express = require("express");
const router = express.Router();

const { verifyJWTToken } = require("../../middleware/JWT.middleware");

const bloodrequestcontroller = require("../../BloodRequest/controllers/bloodrequest.controller");

router.post("/create", verifyJWTToken, bloodrequestcontroller.createBloodRequest);
router.put("/updateApproval/:id", verifyJWTToken, bloodrequestcontroller.updateBloodRequestApproval);
router.put("/updateIsPatientgiven/:id", verifyJWTToken, bloodrequestcontroller.updateBloodRequestGivenToPatient);
router.delete("/delete", verifyJWTToken, bloodrequestcontroller.deleteBloodRequest);
router.get("/get-all", verifyJWTToken, bloodrequestcontroller.getBloodRequest);
router.get("/getMyBloodRequest", verifyJWTToken,bloodrequestcontroller.getMyBloodRequest);
router.get("/getMyPendingBloodRequest", verifyJWTToken,bloodrequestcontroller.getMyPendingBloodRequest);
module.exports = router;
