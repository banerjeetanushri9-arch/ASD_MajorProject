
const express = require("express");
const router = express.Router();
const prisma = require("./database");
const verifyAdmin = require("./authMiddleware");

// GET all house types
router.get("/house-types", async (req, res) => {
  try {
    const houseTypes = await prisma.houseType.findMany();
    res.json(houseTypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all materials
router.get("/materials", async (req, res) => {
  try {
    const materials = await prisma.material.findMany();
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET state rates
router.get("/rates", async (req, res) => {
  try {
    const { state } = req.query;

    if (state) {
      const result = await prisma.state.findUnique({
        where: { name: state },
      });

      if (!result) {
        return res.status(404).json({ error: "State not found" });
      }

      return res.json(result);
    }

    const rates = await prisma.state.findMany();
    res.json(rates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADD a state rate
router.post("/rates", verifyAdmin, async (req, res) => {
  try {
    const { state, baseRate } = req.body;

    if (!state || !Number.isInteger(baseRate) || baseRate <= 0) {
      return res.status(400).json({ error: "Valid state and baseRate are required" });
    }

    const result = await prisma.state.create({
      data: { name: state, baseRate },
    });

    res.status(201).json(result);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "State already exists" });
    }
    res.status(500).json({ error: error.message });
  }
});

// UPDATE a state rate
router.put("/rates/:id", verifyAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { baseRate } = req.body;

    if (!Number.isInteger(id) || id <= 0 ||
        !Number.isInteger(baseRate) || baseRate <= 0) {
      return res.status(400).json({ error: "Valid id and baseRate are required" });
    }

    const result = await prisma.state.update({
      where: { id },
      data: { baseRate },
    });

    res.json(result);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "State not found" });
    }
    res.status(500).json({ error: error.message });
  }
});

// CALCULATE construction estimate
router.post("/estimate", async (req, res) => {
  try {
    const { houseType, wall, roof, state } = req.body;

    if (!houseType || !wall || !roof || !state) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const [house, wallMaterial, roofMaterial, stateRate] = await Promise.all([
      prisma.houseType.findUnique({ where: { code: houseType } }),
      prisma.material.findUnique({
        where: { category_code: { category: "wall", code: wall } },
      }),
      prisma.material.findUnique({
        where: { category_code: { category: "roof", code: roof } },
      }),
      prisma.state.findUnique({ where: { name: state } }),
    ]);

    if (!house || !wallMaterial || !roofMaterial || !stateRate) {
      return res.status(404).json({
        error: "Invalid house type, material, or state",
      });
    }

    const total = Math.round(
      house.areaSqFt *
      stateRate.baseRate *
      wallMaterial.multiplier *
      roofMaterial.multiplier
    );

    const foundation = Math.round(total * 0.20);
    const walls = Math.round(total * 0.35);
    const roofCost = Math.round(total * 0.25);
    const finishing = total - foundation - walls - roofCost;

    res.json({
      houseType,
      areaSqFt: house.areaSqFt,
      total,
      stages: {
        foundation,
        walls,
        roof: roofCost,
        finishing,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// OPTIONAL: GET quantities by house type
router.get("/quantities", async (req, res) => {
  try {
    const { houseType } = req.query;

    if (!houseType) {
      return res.status(400).json({ error: "houseType is required" });
    }

    const house = await prisma.houseType.findUnique({
      where: { code: houseType },
    });

    if (!house) {
      return res.status(404).json({ error: "House type not found" });
    }

    res.json({
      houseType: house.code,
      areaSqFt: house.areaSqFt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
