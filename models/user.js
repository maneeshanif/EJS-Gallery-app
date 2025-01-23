const mongoose = require("mongoose");
require("dotenv").config();



const userSchema = mongoose.Schema({
    name: String,
    image: String,
    email: String,
});

module.exports = mongoose.model("users", userSchema)