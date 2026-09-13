import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

let connectionString = process.env.DATABASE_URL || "";
if (connectionString.startsWith("prisma+postgres://")) {
  const url = new URL(connectionString);
  const apiKey = url.searchParams.get("api_key");
  if (apiKey) {
    const decoded = JSON.parse(Buffer.from(apiKey, "base64url").toString("utf-8"));
    connectionString = decoded.databaseUrl;
  }
}

// On Vercel build without DATABASE_URL, export a lazy null to avoid crashing
export const prisma = connectionString
  ? new PrismaClient({ adapter: new PrismaPg(new Pool({ connectionString })) })
  : (null as unknown as PrismaClient);
