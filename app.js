const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const app = express()
const userModel = require("./models/user")

// Load environment variables first
require("dotenv").config()

// Improved MongoDB connection with error handling
const connectToDatabase = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection
    }

    const conn = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    })

    console.log("MongoDB Connected")
    return conn
  } catch (error) {
    console.error("MongoDB connection error:", error)
    throw error
  }
}

// Configure express
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))

// Wrap route handlers in try-catch
app.get("/", async (req, res) => {
  try {
    await connectToDatabase()
    res.render("index")
  } catch (error) {
    console.error("Error in / route:", error)
    res.status(500).render("error", { error: "Failed to load page" })
  }
})

app.get("/read", async (req, res) => {
  try {
    await connectToDatabase()
    const users = await userModel.find()
    res.render("view", { users })
  } catch (error) {
    console.error("Error in /read route:", error)
    res.status(500).render("error", { error: "Failed to load users" })
  }
})

app.post("/create", async (req, res) => {
  try {
    await connectToDatabase()
    const { name, image, email } = req.body
    await userModel.create({ name, email, image })
    res.redirect("/read")
  } catch (error) {
    console.error("Error in /create route:", error)
    res.status(500).render("error", { error: "Failed to create user" })
  }
})

app.get("/edit/:id", async (req, res) => {
  try {
    await connectToDatabase()
    const user = await userModel.findById(req.params.id)
    if (!user) {
      return res.status(404).render("error", { error: "User not found" })
    }
    res.render("edit", { user })
  } catch (error) {
    console.error("Error in /edit route:", error)
    res.status(500).render("error", { error: "Failed to load user" })
  }
})

app.post("/update/:id", async (req, res) => {
  try {
    await connectToDatabase()
    const { name, image, email } = req.body
    await userModel.findByIdAndUpdate(req.params.id, { name, image, email })
    res.redirect("/read")
  } catch (error) {
    console.error("Error in /update route:", error)
    res.status(500).render("error", { error: "Failed to update user" })
  }
})

app.get("/delete/:id", async (req, res) => {
  try {
    await connectToDatabase()
    await userModel.findByIdAndDelete(req.params.id)
    res.redirect("/read")
  } catch (error) {
    console.error("Error in /delete route:", error)
    res.status(500).render("error", { error: "Failed to delete user" })
  }
})

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err)
  res.status(500).render("error", { error: "An unexpected error occurred" })
})

module.exports = app















// const express = require("express");
// const mongoose = require("mongoose");
// const path = require("path");
// const app = express();
// const userModel = require("./models/user");



// mongoose.connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// }).then(() => {
//   console.log("Connected to MongoDB successfully!");
// })
// .catch((error) => {
//   console.error("Error connecting to MongoDB:", error.message);
// });

// // console.log(process.env.MONGO_URL);

// require("dotenv").config();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.set("view engine", "ejs");
// app.set(express.static(path.join(__dirname, "public")));

// app.get("/", function (req, res) {
//   res.render("index");
// });
// app.get("/read", async function (req, res) {
//   let users = await userModel.find();
//   res.render("view", {
//     users,
//   });
// });

// app.post("/create", async function (req, res) {
//     let { name, image, email } = req.body;
  
//     let createdUser = await userModel.create({
//       name,
//       email,
//       image,
//     });
//     // console.log(createdUser);
//     res.redirect("/read");
//   });

// app.get("/edit/:id", async function (req, res) {
//   let user = await userModel.findOne({ _id: req.params.id });
//   res.render("edit", { user });
// });
// app.post("/update/:id", async function (req, res) {
//   let { name, image, email } = req.body;
//   let user = await userModel.findOneAndUpdate(
//     { _id: req.params.id },
//     { name, image, email },
//     { new: true }
//   );
//   res.redirect("/read");
// });

// app.get("/delete/:id", async function (req, res) {
//   let users = await userModel.findOneAndDelete({ _id: req.params.id });
//   res.redirect("/read");
// });


// app.use((err, req, res, next) => {
//   console.error("Unhandled error:", err.stack || err.message);
//   res.status(500).send("Internal Server Error");
// });


// module.exports = app;

// // app.listen(process.env.PORT || 3000).addListener("listening", () => {
// //   console.log("Server is running on port 3000");
// // });
