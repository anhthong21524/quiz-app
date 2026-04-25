/**
 * One-time migration: backfill null for missing optional fields in the users collection.
 * Run from repo root: node apps/api/scripts/migrate-users-structure.mjs
 * Requires MONGODB_URI set in apps/api/.env (or as an env var).
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "../../node_modules/mongoose/dist/mongoose.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const envPath = resolve(__dirname, "../.env");
try {
  const lines = readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, "");
  }
} catch {
  // rely on environment variables
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.DATABASE_NAME ?? "quiz_app";

if (!uri) {
  console.error("MONGODB_URI is not set. Aborting.");
  process.exit(1);
}

await mongoose.connect(uri, { dbName });
const db = mongoose.connection.db;
const users = db.collection("users");

const optionalFields = ["passwordHash", "passwordSalt", "googleSub", "avatarUrl"];

const result = await users.updateMany(
  { $or: optionalFields.map((field) => ({ [field]: { $exists: false } })) },
  [
    {
      $set: Object.fromEntries(
        optionalFields.map((field) => [field, { $ifNull: [`$${field}`, null] }])
      ),
    },
  ]
);

console.log(
  `Migration complete: ${result.modifiedCount} document(s) updated out of ${result.matchedCount} matched.`
);

await mongoose.disconnect();
