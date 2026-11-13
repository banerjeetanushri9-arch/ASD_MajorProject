
const express = require("express");
const cors = require("cors");
const routes = require("./src/routes");

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Virtual House Backend is running!" });
});

// API routes
app.use("/api", routes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
