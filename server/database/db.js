const mongoose = require("mongoose");

const connection = async (USERNAME, PASSWORD) => {
  const URL = `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.ghavz.mongodb.net/`;

  try {
    await mongoose.connect(URL);
    console.log("Database connected Succesfully");
  } catch (error) {
    console.log("Error while connecting database: ", error);
  }
};

module.exports = connection;
