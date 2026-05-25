import prisma from "./lib/prisma"

async function seed() {
  try {
    await prisma.user.upsert({
      where: { id: "public" },
      update: {},
      create: {
        id: "public",
        email: "public@opsflow.local",
        password: "none"
      }
    })
    console.log("Public user seeded!")
  } catch (err) {
    console.error("Error seeding:", err)
  }
}

seed()
