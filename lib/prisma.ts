import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

/**
 * Simple mock Prisma client that returns empty results for any model.
 * It uses a Proxy to dynamically handle any property access (e.g., activityLog, user, task, ...)
 * and provides async methods (`findMany`, `findUnique`, `findFirst`, `create`, `update`, `delete`)
 * that resolve to harmless empty values. This ensures the build process can collect page data
 * without requiring a real DATABASE_URL.
 */
class MockPrismaClient {
  constructor() {
    return new Proxy(this, {
      get(_target, model) {
        // Return a proxy representing the model (e.g., prisma.activityLog)
        return new Proxy(
          {},
          {
            get(_modelTarget, method) {
              // Common async query methods return empty arrays or nulls
              if (method === "findMany" || method === "findFirst" || method === "findUnique") {
                return async () => [];
              }
              // Mutating methods return a simple empty object
              if (method === "create" || method === "update" || method === "delete") {
                return async () => ({ });
              }
              // Default fallback returns undefined
              return async () => undefined;
            },
          }
        );
      },
    });
  }
}

const createPrismaClient = () => {
  if (!process.env.DATABASE_URL) {
    return new MockPrismaClient() as unknown as PrismaClient;
  }
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

const prismaInstance = global.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prismaInstance;
}

export default prismaInstance;