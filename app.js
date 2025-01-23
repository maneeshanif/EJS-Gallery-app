const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const userModel = require("./models/user");



mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB successfully!");
})
.catch((error) => {
  console.error("Error connecting to MongoDB:", error.message);
});

// console.log(process.env.MONGO_URL);

require("dotenv").config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.render("index");
});
app.get("/read", async function (req, res) {
  let users = await userModel.find();
  res.render("view", {
    users,
  });
});

app.post("/create", async function (req, res) {
    let { name, image, email } = req.body;
  
    let createdUser = await userModel.create({
      name,
      email,
      image,
    });
    // console.log(createdUser);
    res.redirect("/read");
  });

app.get("/edit/:id", async function (req, res) {
  let user = await userModel.findOne({ _id: req.params.id });
  res.render("edit", { user });
});
app.post("/update/:id", async function (req, res) {
  let { name, image, email } = req.body;
  let user = await userModel.findOneAndUpdate(
    { _id: req.params.id },
    { name, image, email },
    { new: true }
  );
  res.redirect("/read");
});

app.get("/delete/:id", async function (req, res) {
  let users = await userModel.findOneAndDelete({ _id: req.params.id });
  res.redirect("/read");
});


app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack || err.message);
  res.status(500).send("Internal Server Error");
});


module.exports = app;

// app.listen(process.env.PORT || 3000).addListener("listening", () => {
//   console.log("Server is running on port 3000");
// });
