const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const app = express()
const userModel = require("./models/user")

// Load environment variables first
require("dotenv").config()

// Validate MongoDB URL
if (!process.env.MONGO_URL) {
  throw new Error("MONGO_URL environment variable is not defined")
}

// Improved MongoDB connection with validation
const connectToDatabase = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection
    }

    // Ensure MONGO_URL is a string and properly formatted
    const mongoUrl = process.env.MONGO_URL
    if (typeof mongoUrl !== "string") {
      throw new Error("MONGO_URL must be a string")
    }

    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    })

    console.log("MongoDB Connected Successfully")
    return mongoose.connection
  } catch (error) {
    console.error("MongoDB Connection Error:", error)
    throw error
  }
}

// Configure express with absolute paths
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use("/public", express.static(path.join(__dirname, "public")))

// Add request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`)
  next()
})

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" })
})

// Wrap all route handlers with error handling
const asyncHandler = (fn) => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch(next)
}

app.get("/", async (req, res) => {
  try {
    await connectToDatabase()
    res.render("index", { error: null })
  } catch (error) {
    console.error("Error:", error)
    res.status(500).render("error", {
      error: "Database connection failed. Please check your configuration.",
    })
  }
})

app.get(
  "/read",
  asyncHandler(async (req, res) => {
    await connectToDatabase()
    const users = await userModel.find().lean()
    res.render("view", { users, error: null })
  }),
)

app.post(
  "/create",
  asyncHandler(async (req, res) => {
    await connectToDatabase()
    const { name, image, email } = req.body

    // Validate input
    if (!name || !email) {
      return res.render("index", { error: "Name and email are required" })
    }

    await userModel.create({
      name,
      email,
      image: image || "", // Make image optional
    })

    res.redirect("/read")
  }),
)

app.get(
  "/edit/:id",
  asyncHandler(async (req, res) => {
    await connectToDatabase()
    const user = await userModel.findById(req.params.id).lean()

    if (!user) {
      return res.status(404).render("error", { error: "User not found" })
    }

    res.render("edit", { user, error: null })
  }),
)

app.post(
  "/update/:id",
  asyncHandler(async (req, res) => {
    await connectToDatabase()
    const { name, image, email } = req.body

    // Validate input
    if (!name || !email) {
      return res.render("edit", {
        user: { _id: req.params.id, name, image, email },
        error: "Name and email are required",
      })
    }

    await userModel.findByIdAndUpdate(req.params.id, {
      name,
      email,
      image: image || "",
    })

    res.redirect("/read")
  }),
)

app.get(
  "/delete/:id",
  asyncHandler(async (req, res) => {
    await connectToDatabase()
    await userModel.findByIdAndDelete(req.params.id)
    res.redirect("/read")
  }),
)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err)
  res.status(500).render("error", {
    error: process.env.NODE_ENV === "production" ? "An unexpected error occurred" : err.message,
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).render("error", { error: "Page not found" })
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
