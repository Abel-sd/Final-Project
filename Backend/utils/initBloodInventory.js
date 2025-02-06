const mongoose = require("mongoose");
const readline = require("readline");
const bcrypt = require("bcrypt");
const { BloodInventory } = require("../models/Invetory");
const { Auth } = require("../models/Auth");
const config = require("../config/config"); // Adjust path as needed

const dbUri = "mongodb+srv://andifab23:tNgwwixDs0Bo5aUj@cluster0.xka9c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const promptUser = (query) => {
  return new Promise((resolve) => rl.question(query, resolve));
};

const initializeBloodInventory = async () => {
  try {
    await mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });

    const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

    for (const bloodGroup of bloodGroups) {
      const existingBloodGroup = await BloodInventory.findOne({ bloodGroup });

      if (!existingBloodGroup) {
        const newBloodGroup = new BloodInventory({
          bloodGroup,
          units: 0,
        });

        await newBloodGroup.save();
        console.log(`Initialized blood group: ${bloodGroup}`);
      } else {
        console.log(`${bloodGroup} already exists.`);
      }
    }
  } catch (error) {
    console.error("Error initializing blood inventory:", error);
  }
};

const createAuthUser = async (email, password) => {
  try {
    const existingUser = await Auth.findOne({ email });
    if (existingUser) {
      console.log("User already exists with this email.");
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new Auth({
      email,
      password: hashedPassword,
      role: "Admin",
      isVerified: true,
    });

    await newUser.save();
    console.log("User created successfully!");
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

const main = async () => {
  try {
    await mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });

    const email = await promptUser("Enter email: ");
    const password = await promptUser("Enter password: ");
    rl.close();

    await createAuthUser(email, password);
    await initializeBloodInventory();

    mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error);
    mongoose.connection.close();
  }
};

main();
