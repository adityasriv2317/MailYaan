const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./auth");

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("MailYaan API running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
