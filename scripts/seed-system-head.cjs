const fs = require("fs");
const mongoose = require("mongoose");

const [email, password, name = "System Head"] = process.argv.slice(2);
if (!email || !password) {
  console.error("Usage: node scripts/seed-system-head.cjs <email> <password> [name]");
  process.exit(1);
}

const envLine = fs
  .readFileSync(".env.local", "utf8")
  .split(/\r?\n/)
  .find((line) => line.startsWith("DB_URL="));
const dbUrl = envLine?.slice("DB_URL=".length).trim().replace(/^['"]|['"]$/g, "");

if (!dbUrl) {
  console.error("DB_URL is not configured in .env.local");
  process.exit(1);
}

(async () => {
  await mongoose.connect(`${dbUrl}meripanchayat`, {
    dbName: "meripanchayat",
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
