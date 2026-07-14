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

function resolveConnectionString(): string {
  const raw = process.env.DATABASE_URL;
  if (!raw || raw.trim() === "") {
    throw new Error(
      "DATABASE_URL is not set. Add your Neon pooled connection string to the " +
        "deployment environment variables (see .env.example / README).",
    );
  }
  // Defensive: env UIs sometimes keep surrounding quotes or stray whitespace,
  // which makes the Neon driver throw a cryptic ERR_INVALID_URL.
  const cleaned = raw.trim().replace(/^["']|["']$/g, "").trim();
  try {
    // Validate early with a clear message instead of a low-level driver error.
    new URL(cleaned);
  } catch {
    throw new Error(
      "DATABASE_URL is not a valid connection URL. It must look like " +
        "postgresql://user:password@host/db?sslmode=require — with no surrounding " +
        "quotes. Check the value in your host's environment settings.",
    );
  }
  if (!/^postgres(ql)?:\/\//.test(cleaned)) {
    throw new Error(
      "DATABASE_URL must start with postgresql:// (Neon pooled connection string).",
    );
  }
  return cleaned;
}

const connectionString = resolveConnectionString();

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
