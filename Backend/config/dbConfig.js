const mongoose = require('mongoose');
const config = require('./config');

mongoose.connect(config.dburl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to the database');
}).catch((err) => {
  console.error('Database connection error:', err);
});