import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * In‑memory mock database used when no real DATABASE_URL is provided.
 * It stores data for the duration of the serverless container lifetime,
 * allowing the app to function on Vercel without external services.
 */
class InMemoryStore<T extends Record<string, any>> {
  private records: T[] = [];

  // Helper to generate a simple unique id
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async findMany(): Promise<T[]> {
    // Return a shallow copy to avoid accidental mutation
    return [...this.records];
  }

  async findFirst(): Promise<T | null> {
    return this.records[0] ?? null;
  }

  async findUnique(where: { id: string }): Promise<T | null> {
    return this.records.find((r) => r.id === where.id) ?? null;
  }

  async create(data: Partial<T>): Promise<T> {
    const now = new Date().toISOString();
    const record = {
      ...(data as T),
      id: this.generateId(),
      createdAt: now,
      updatedAt: now,
    } as T;
    this.records.push(record);
    return record;
  }

  async update(params: { where: { id: string }; data: Partial<T> }): Promise<T> {
    const rec = this.records.find((r) => r.id === params.where.id);
    if (!rec) throw new Error("Record not found");
    Object.assign(rec, params.data, { updatedAt: new Date().toISOString() });
    return rec;
  }

  async delete(params: { where: { id: string } }): Promise<T> {
    const idx = this.records.findIndex((r) => r.id === params.where.id);
    if (idx === -1) throw new Error("Record not found");
    const [removed] = this.records.splice(idx, 1);
    return removed;
  }
}

/**
 * Mock Prisma client that mimics the real client’s API but operates on the
 * InMemoryStore. It implements only the models used by the application.
 */
class MockPrismaClient {
  private stores = {
    task: new InMemoryStore<any>(),
    workflow: new InMemoryStore<any>(),
    project: new InMemoryStore<any>(),
    activityLog: new InMemoryStore<any>(),
  };

  // Dynamically generate proxies for each model (e.g., prisma.task)
  constructor() {
    return new Proxy(this, {
      get: (target, prop: string) => {
        if (prop in target) return (target as any)[prop];
        if (prop in target.stores) {
          const store = target.stores[prop as keyof typeof target.stores];
          // Return an object with the Prisma‑like async methods
          return {
            findMany: async (args?: any) => {
              // Very simple filtering – respects a basic `where` clause if provided
              if (args?.where) {
                const entries = Object.entries(args.where);
                return (await store.findMany()).filter((item) =>
                  entries.every(([k, v]) => (item as any)[k] === v)
                );
              }
              return store.findMany();
            },
            findFirst: async (args?: any) => {
              if (args?.where) {
                const entries = Object.entries(args.where);
                return (await store.findMany()).find((item) =>
                  entries.every(([k, v]) => (item as any)[k] === v)
                ) ?? null;
              }
              return store.findFirst();
            },
            findUnique: async (args: any) => store.findUnique(args.where),
            create: async (args: any) => store.create(args.data),
            update: async (args: any) => store.update({ where: args.where, data: args.data }),
            delete: async (args: any) => store.delete({ where: args.where }),
          };
        }
        // Fallback for unexpected properties
        return undefined;
      },
    });
  }
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

/**
 * Factory that returns either a real Prisma client (when DATABASE_URL exists)
 * or the in‑memory mock client.
 */
const createPrismaClient = () => {
  if (!process.env.DATABASE_URL) {
    // No DB URL – use the mock client. This works locally and on Vercel
    // without any external configuration.
    return new MockPrismaClient() as unknown as PrismaClient;
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

const prismaInstance = global.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  // In development we keep a global reference so hot‑reloading does not create
  // multiple client instances.
  global.prisma = prismaInstance;
}

export default prismaInstance;