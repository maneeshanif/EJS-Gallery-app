require("dotenv").config()
const mongoose = require("mongoose")

async function testConnection() {
  try {
    console.log("Testing MongoDB connection...")
    console.log("MONGO_URL type:", typeof process.env.MONGO_URL)
    console.log("MONGO_URL length:", process.env.MONGO_URL?.length)

    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log("MongoDB connected successfully!")
    process.exit(0)
  } catch (error) {
    console.error("MongoDB connection error:", error)
    process.exit(1)
  }
}

testConnection()

