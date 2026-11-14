const express = require("express");
const cors = require("cors");

const routes = require("./src/routes");
const authRoutes = require("./src/authRoute");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Virtual House Backend is running!" });
});

app.use("/api/auth", authRoutes);
app.use("/api", routes);

const PORT = 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});