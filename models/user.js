const mongoose = require("mongoose");
mongoose.connect(`mongodb://localhost:27017/mongoapp`);

const userSchema = mongoose.Schema({
    name: String,
    image: String,
    email: String,
});

module.exports = mongoose.model("users", userSchema)