const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// FIX 7: MongoDB URI environment variable se lo, fallback local
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/cityfix"

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err))

// Routes
const problemRoutes = require("./routes/problems")
app.use("/api/problems", problemRoutes)

// Test route
app.get("/", (req, res) => {
  res.send("API is working 🚀")
})

// Server start
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log("Server running on port " + PORT)
})