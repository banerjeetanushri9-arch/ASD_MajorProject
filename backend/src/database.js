require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const connectionString =
  process.env.NETLIFY_DB_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Database connection string is not configured");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({ adapter });

module.exports = prisma;
