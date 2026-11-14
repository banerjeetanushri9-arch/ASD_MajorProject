
require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // Insert state rates
  const states = [
    { name: "Chhattisgarh", baseRate: 1200 },
    { name: "Madhya Pradesh", baseRate: 1150 },
    { name: "Odisha", baseRate: 1100 },
  ];

  for (const state of states) {
    await prisma.state.upsert({
      where: { name: state.name },
      update: { baseRate: state.baseRate },
      create: state,
    });
  }

  // Insert house types
  const houseTypes = [
    { code: "1BHK", areaSqFt: 270 },
    { code: "2BHK", areaSqFt: 450 },
  ];

  for (const houseType of houseTypes) {
    await prisma.houseType.upsert({
      where: { code: houseType.code },
      update: { areaSqFt: houseType.areaSqFt },
      create: houseType,
    });
  }

  // Insert materials
  const materials = [
    { category: "wall", code: "brick", multiplier: 1.0 },
    { category: "wall", code: "flyash", multiplier: 0.9 },
    { category: "wall", code: "block", multiplier: 1.1 },
    { category: "roof", code: "rcc", multiplier: 1.0 },
    { category: "roof", code: "tin", multiplier: 0.7 },
  ];

  for (const material of materials) {
    await prisma.material.upsert({
      where: {
        category_code: {
          category: material.category,
          code: material.code,
        },
      },
      update: { multiplier: material.multiplier },
      create: material,
    });
  }

  console.log("Initial database data inserted successfully!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
