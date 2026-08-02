/**
 * Copy every collection from one database in the Atlas cluster to another.
 *
 *   node scripts/rename-database.cjs <from> <to>
 *   node scripts/rename-database.cjs meripanchayat panchayatX
 *
 * MongoDB has no "rename database" operation — a rename is a copy followed by
 * dropping the original. This script only does the copy and then reports the
 * document counts on both sides so they can be compared. The source database
 * is deliberately left untouched: if anything goes wrong, the old data is still
 * there and DB_NAME can simply be pointed back at it.
 *
 * Indexes are recreated as well, otherwise the unique constraints on username,
 * email and complaintId would silently not exist in the new database.
 */
const fs = require("fs");
const mongoose = require("mongoose");

const [from, to] = process.argv.slice(2);
if (!from || !to) {
  console.error("Usage: node scripts/rename-database.cjs <from> <to>");
  process.exit(1);
}

const lines = fs.readFileSync(".env.local", "utf8").split(/\r?\n/);
const env = (key) =>
  lines
    .find((line) => line.startsWith(`${key}=`))
    ?.slice(key.length + 1)
    .trim()
    .replace(/^['"]|['"]$/g, "");

const dbUrl = env("DB_URL");
if (!dbUrl) {
  console.error("DB_URL is not configured in .env.local");
  process.exit(1);
}

(async () => {
  await mongoose.connect(dbUrl, { serverSelectionTimeoutMS: 15000 });
  const client = mongoose.connection.getClient();
  const source = client.db(from);
  const target = client.db(to);

  const collections = (await source.listCollections().toArray())
    .map((c) => c.name)
    .filter((name) => !name.startsWith("system."));

  if (collections.length === 0) {
    console.error(`No collections found in "${from}" — is the name right?`);
    process.exit(1);
  }

  console.log(`Copying ${collections.length} collection(s) from "${from}" to "${to}"\n`);

  for (const name of collections) {
    const docs = await source.collection(name).find({}).toArray();
    // Start clean so re-running the script cannot double up documents.
    await target.collection(name).deleteMany({});
    if (docs.length) await target.collection(name).insertMany(docs);

    // Carry the indexes across; _id is created automatically.
    const indexes = await source.collection(name).indexes();
    for (const index of indexes) {
      if (index.name === "_id_") continue;
      const { key, name: indexName, v, ...options } = index;
      try {
        await target.collection(name).createIndex(key, { name: indexName, ...options });
      } catch (error) {
        console.log(`  ! index ${indexName} on ${name}: ${error.message}`);
      }
    }
    console.log(`  ${name.padEnd(18)} ${String(docs.length).padStart(4)} document(s), ${indexes.length - 1} index(es)`);
  }

  console.log("\nVerifying:");
  let mismatch = false;
  for (const name of collections) {
    const before = await source.collection(name).countDocuments();
    const after = await target.collection(name).countDocuments();
    if (before !== after) mismatch = true;
    console.log(`  ${name.padEnd(18)} ${from}: ${before}   ${to}: ${after}   ${before === after ? "ok" : "MISMATCH"}`);
  }

  console.log(
    mismatch
      ? "\nCounts do not match — do NOT switch DB_NAME yet."
      : `\nAll counts match. Set DB_NAME=${to} in .env.local and on your host.` +
        `\n"${from}" has been left untouched as a fallback; drop it from Atlas once you are happy.`
  );

  await mongoose.disconnect();
})().catch(async (error) => {
  console.error(error.message);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
