
require("dotenv").config();

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("./database");

const router = express.Router();

// ADMIN REGISTRATION (initial setup)
router.post("/register", async (req, res) => {
  try {
    const setupKey = req.headers["x-admin-setup-key"];

    if (!setupKey || setupKey !== process.env.ADMIN_SETUP_KEY) {
      return res.status(403).json({
        error: "Invalid admin setup key",
      });
    }

    const { name, email, password } = req.body;

    if (
      !email ||
      !password ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      password.length < 8
    ) {
      return res.status(400).json({
        error: "Valid email and password of at least 8 characters are required",
      });
    }

    const existingAdminCount = await prisma.admin.count();

    if (existingAdminCount > 0) {
      return res.status(403).json({
        error: "Admin account already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const admin = await prisma.admin.create({
      data: {
        name: typeof name === "string" ? name : null,
        email: email.trim().toLowerCase(),
        passwordHash,
      },
    });

    res.status(201).json({
      message: "Admin registered successfully",
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        error: "Email already registered",
      });
    }

    res.status(500).json({ error: "Registration failed" });
  }
});

// ADMIN LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const admin = await prisma.admin.findUnique({
      where: {
        email: email.trim().toLowerCase(),
      },
    });

    if (!admin) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      admin.passwordHash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { role: "admin" },
      process.env.JWT_SECRET,
      {
        subject: admin.id.toString(),
        expiresIn: "2h",
      }
    );

    res.json({
      message: "Login successful",
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
