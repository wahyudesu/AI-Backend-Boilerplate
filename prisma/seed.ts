/* eslint-disable no-console */
import bcrypt from "bcryptjs";
import crypto from "node:crypto";

import products from "@/dummy-data/products.dummy";

import prisma from "./db";

function generateApiKey() {
  try {
    const rand = crypto.randomBytes(32).toString("hex");
    return `sk_live_${rand}`;
  }
  catch (error) {
    console.error("Error generating API key:", error);
    throw new Error("Failed to generate API key");
  }
}

// Get current year for password generation
const currentYear = new Date().getFullYear();

async function cleanDatabase() {
  console.log("Cleaning up existing data...");
  try {
    // Use a transaction to ensure data consistency
    await prisma.$transaction(async (tx) => {
      // Delete all sessions first (if you have them)
      await tx.apiKey.deleteMany({});
      await tx.product.deleteMany({});
      await tx.user.deleteMany({});
    });
    console.log("Database cleanup completed.");
  }
  catch (error) {
    console.error("Error during cleanup:", error);
    throw error;
  }
}

async function seedDatabase() {
  try {
    console.log("Starting to seed new data...");
    // Create admin user
    console.log("Creating admin user...");
    const adminPassword = `Admin@${currentYear}`;
    const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

    const adminUser = await prisma.user.create({
      data: {
        email: "admin@admin.com",
        name: "System Admin",
        phone: "1234567890",
        isVerified: true,
        password: hashedAdminPassword,
        role: "ADMIN",
      },
    });
    // Create the Default API Key
    const apiKey = await prisma.apiKey.create({
      data: {
        name: "Default Key",
        key: generateApiKey(),
        userId: adminUser.id,
      },
    });

    console.log("User Seed completed successfully!");

    console.log("Admin credentials:", {
      email: "admin@admin.com",
      password: adminPassword,
    });
    console.log("Created APIkey:", {
      keyName: apiKey.name,
      key: apiKey.key,
    });

    await prisma.$transaction(
      products.map(product =>
        prisma.product.create({
          data: {
            name: product.name,
            slug: product.slug,
            buyingPrice:
              product.price - Math.floor(Math.random() * (product.price * 0.4)),
            price: product.price,
            image: product.image,
            userId: adminUser.id,
          },
        }),
      ),
    );

    console.log(`Database has been seeded with ${products.length} products!`);
  }
  catch (error) {
    console.error("Error during seeding:", error);
    throw error;
  }
}
async function main() {
  console.log("Starting database seed process...");

  try {
    // First clean up existing data
    await cleanDatabase();

    // Then seed new data
    await seedDatabase();

    console.log("Database seeding completed successfully!");
  }
  catch (error) {
    console.error("Error in main seed process:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Close Prisma client connection
    await prisma.$disconnect();
  });
