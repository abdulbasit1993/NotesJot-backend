const dotenv = require("dotenv");
dotenv.config();

const express = require("express");

const app = express();

const PORT = process.env.PORT || 3005;

const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const option = {
  socketTimeoutMS: 30000,
};

const mongoURI = process.env.MONGODB_URI;

mongoose
  .connect(mongoURI, option)
  .then(function () {
    console.log("Connected to Database");
  })
  .catch(function (error) {
    console.log(`Error Connecting to Database: ${error}`);
  });

require("./src/models/userModel");
require("./src/models/notesModel");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const userRoutes = require("./src/routes/userRoutes");
const notesRoutes = require("./src/routes/notesRoutes");
userRoutes(app);
notesRoutes(app);

app.use(function (req, res) {
  res.status(404).json({
    message: `url ${req.originalUrl} not found`,
  });
});

app.listen(PORT, function () {
  console.log(`Server is running on port ${PORT}...`);
});

module.exports = app;
