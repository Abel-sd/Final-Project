const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 3000;
require("./config/dbConfig");
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const routes = require('./router.js');
app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});