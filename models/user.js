const mongoose = require("mongoose");
mongoose.connect(`process.env.Mongo_Url`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const userSchema = mongoose.Schema({
    name: String,
    image: String,
    email: String,
});

module.exports = mongoose.model("users", userSchema)