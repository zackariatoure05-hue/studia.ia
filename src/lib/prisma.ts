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

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });
