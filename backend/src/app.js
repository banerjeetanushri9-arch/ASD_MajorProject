require("dotenv").config();

const express = require("express");
const cors = require("cors");

const routes = require("./routes");
const authRoutes = require("./authRoute");
const userAuthRoutes = require("./userAuthRoute");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Virtual House Backend is running!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/user-auth", userAuthRoutes);
app.use("/api", routes);

module.exports = app;
