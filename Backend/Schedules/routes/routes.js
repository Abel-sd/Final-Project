const express = require("express");
      const router = express.Router();

      // Import all your routes here. This is an example: create auth.route.js and import it here.
       const authRouter = require("./schedule.route");   
       router.use("/manage", authRouter);

       module.exports = router;