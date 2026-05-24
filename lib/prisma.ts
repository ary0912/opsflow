import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

// Plain PrismaClient without explicit adapter; Prisma will use DATABASE_URL from prisma.config.ts
// @ts-ignore
const prismaOptions: any = {};
if (process.env.DATABASE_URL) {
  prismaOptions.datasources = { db: { url: process.env.DATABASE_URL } };
}
// @ts-ignore
const prisma = globalForPrisma.prisma ?? new PrismaClient(prismaOptions);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;