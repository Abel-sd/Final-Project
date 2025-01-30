const express = require("express");
const router = express.Router();

const { verifyJWTToken } = require("../../middleware/JWT.middleware");

const inventoryController = require("../controllers/inventory.controller");

router.get("/get-all", verifyJWTToken, inventoryController.getInventory);
router.post("/alert-low-inventory", verifyJWTToken, inventoryController.AlertLowInventory);

module.exports = router;
