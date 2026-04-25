/**
 * One-time migration: backfill null for missing optional fields in the users collection.
 * Run from repo root: node apps/api/scripts/migrate-users-structure.cjs
 */

const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const mongoose = require("../node_modules/mongoose");

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

async function run() {
  await mongoose.connect(uri, { dbName });
  const users = mongoose.connection.db.collection("users");

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
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
