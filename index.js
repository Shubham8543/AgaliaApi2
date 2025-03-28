require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Ensure MONGODB_URI is available
const mongoURL = process.env.MONGODB_URI;
if (!mongoURL) {
  console.error("❌ MONGODB_URI is not defined in the environment variables.");
  process.exit(1); // Stop execution if URI is missing
}

// Connect to MongoDB
mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => {
    console.error("❌ MongoDB Connection Failed:", err);
    process.exit(1); // Exit the process if DB connection fails
  });
console.log("Mongo URI:", mongoURL); 

app.get("/", (req, res) => {
  res.send("api Wrking fine");
});


const FormRoute = require("./Routes/FormRoute");
app.use("/api", FormRoute);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
