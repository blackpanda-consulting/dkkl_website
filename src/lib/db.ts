import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";
import { PrismaClient } from "@/generated/prisma/client";

// Neon's serverless driver talks over WebSockets. In a Node runtime (next start,
// route handlers) there is no global WebSocket, so provide one. Harmless on
// platforms that already have it.
if (!neonConfig.webSocketConstructor) {
  neonConfig.webSocketConstructor = ws;
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set. See .env.example / README.");
}

const createPrisma = () =>
  new PrismaClient({ adapter: new PrismaNeon({ connectionString }) });

// Reuse the client across hot reloads in dev to avoid exhausting connections.
const globalForPrisma = globalThis as unknown as {
  prisma?: ReturnType<typeof createPrisma>;
};

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
