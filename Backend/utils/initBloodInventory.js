const mongoose = require('mongoose');
const { BloodInventory } = require('../models/Invetory');
const config = require('../config/config');
 // Adjust path as needed

// MongoDB URI - Adjust your connection string
console.log(config.dburl);
const dbUri = "mongodb+srv://andifab23:tNgwwixDs0Bo5aUj@cluster0.xka9c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const initializeBloodInventory = async () => {
    try {
      // Connect to the MongoDB database
      await mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
  
      // Blood groups array
      const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  
      // Insert blood groups with 0 units if not already present
      for (const bloodGroup of bloodGroups) {
        const existingBloodGroup = await BloodInventory.findOne({ bloodGroup });
  
        if (!existingBloodGroup) {
          const newBloodGroup = new BloodInventory({
            bloodGroup,
            units: 0
          });
  
          await newBloodGroup.save();
          console.log(`Initialized blood group: ${bloodGroup}`);
        } else {
          console.log(`${bloodGroup} already exists.`);
        }
      }
  
      // Close the database connection
      mongoose.connection.close();
    } catch (error) {
      console.error('Error initializing blood inventory:', error);
      mongoose.connection.close();
    }
  };
  
  initializeBloodInventory();