const fs = require("fs");
const mongoose = require("mongoose");

const [email, password, name = "System Head"] = process.argv.slice(2);
if (!email || !password) {
  console.error("Usage: node scripts/seed-system-head.cjs <email> <password> [name]");
  process.exit(1);
}

const envLines = fs.readFileSync(".env.local", "utf8").split(/\r?\n/);
const readEnv = (key) =>
  envLines
    .find((line) => line.startsWith(`${key}=`))
    ?.slice(key.length + 1)
    .trim()
    .replace(/^['"]|['"]$/g, "");

const dbUrl = readEnv("DB_URL");
// Must match app/utils/connection.js, or the seeded admin lands in the wrong database.
const dbName = process.env.DB_NAME?.trim() || readEnv("DB_NAME") || "meripanchayat";

if (!dbUrl) {
  console.error("DB_URL is not configured in .env.local");
  process.exit(1);
}

(async () => {
  console.log(`Seeding into database: ${dbName}`);
  await mongoose.connect(dbUrl, {
    dbName,
    serverSelectionTimeoutMS: 10000,
  });

  const result = await mongoose.connection.collection("users").updateOne(
    { email },
    { $set: { email, password, name, userType: "admin" } },
    { upsert: true }
  );

  console.log(
    JSON.stringify({
      matched: result.matchedCount,
      modified: result.modifiedCount,
      created: Boolean(result.upsertedId),
      role: "admin",
    })
  );
  await mongoose.disconnect();
})().catch(async (error) => {
  console.error(error.message);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
