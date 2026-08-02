/**
 * Loads Chandgaon's scheme-wise fund figures, transcribed from the Government
 * of India Meri Panchayat app (village Chandgaon, LGD code 170972) for the
 * financial years 2020-2021 through 2026-2027.
 *
 *   node scripts/seed-funds.cjs           # add/refresh the records
 *   node scripts/seed-funds.cjs --replace # wipe the funds collection first
 *
 * Every figure below is exactly as published there. All of them sit under the
 * "Govt. of India" source with the "Center Schemes/ Grants" component, which is
 * how the source report groups them.
 */
const fs = require("fs");
const mongoose = require("mongoose");

const XV = "XV Finance Commission [1769]";
const XVI = "XVI Finance Commission [1963]";
const VIKSIT = "Viksit Bharat-Guarantee for Rozgar and Ajeevika Mission (Gramin) [38]";
const COMPONENT = "Center Schemes/ Grants";

// [scheme, expected, received, previousYearBalance, reverted, expenditure]
const DATA = {
  "2026-2027": [
    [XVI, 561340, 0, 0, 0, 0],
    [XVI, 561340, 0, 0, 0, 0],
  ],
  "2025-2026": [
    [XV, 759810, 742203, 0, 0, 65032],
    [VIKSIT, 600000, 0, 0, 0, 0],
    [XV, 506540, 1112665, 0, 0, 768300],
  ],
  "2024-2025": [
    [XV, 759810, 376637, 0, 0, 1001202],
    [VIKSIT, 600000, 0, 0, 0, 0],
    [XV, 506540, 468153, 0, 0, 253162],
  ],
  "2023-2024": [
    [VIKSIT, 6000000, 0, 0, 0, 0],
    [XV, 759810, 709837, 282502, 0, 797050],
    [XV, 506540, 484526, 513577, 60784, 657636],
  ],
  "2022-2023": [
    [VIKSIT, 1300000, 0, 0, 0, 0],
    [XV, 759810, 988555, 237369, 0, 943422],
    [XV, 506540, 929522, 303, 0, 644751],
  ],
  "2021-2022": [
    [XV, 633180, 375997, 255306, 759817, 631000],
    [XV, 633180, 376994, 366785, 719999, 491800],
    [VIKSIT, 419577, 0, 0, 419577, 0],
  ],
  "2020-2021": [
    [VIKSIT, 633181, 0, 0, 0, 0],
    [XV, 633180, 366427, 0, 0, 111121],
    [XV, 633180, 366785, 0, 0, 0],
  ],
};

const lines = fs.readFileSync(".env.local", "utf8").split(/\r?\n/);
const env = (key) =>
  lines
    .find((line) => line.startsWith(`${key}=`))
    ?.slice(key.length + 1)
    .trim()
    .replace(/^['"]|['"]$/g, "");

const dbUrl = env("DB_URL");
const dbName = process.env.DB_NAME?.trim() || env("DB_NAME") || "panchayatX";
if (!dbUrl) {
  console.error("DB_URL is not configured in .env.local");
  process.exit(1);
}

(async () => {
  await mongoose.connect(dbUrl, { dbName, serverSelectionTimeoutMS: 10000 });
  const funds = mongoose.connection.collection("funds");

  if (process.argv.includes("--replace")) {
    const { deletedCount } = await funds.deleteMany({});
    console.log(`Cleared ${deletedCount} existing fund record(s)`);
  }

  const now = new Date();
  const rows = [];
  for (const [financialYear, entries] of Object.entries(DATA)) {
    for (const [scheme, expected, received, previous, reverted, spent] of entries) {
      rows.push({
        financialYear,
        source: "goi",
        scheme,
        component: COMPONENT,
        expectedFund: expected,
        actualFundReceived: received,
        previousYearBalance: previous,
        revertedFund: reverted,
        actualExpenditure: spent,
        description: "",
        progress: 0,
        documents: [],
        email: "",
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  await funds.insertMany(rows);

  const byYear = {};
  for (const row of rows) byYear[row.financialYear] = (byYear[row.financialYear] || 0) + 1;
  console.log(`Inserted ${rows.length} fund record(s):`);
  for (const year of Object.keys(byYear).sort().reverse())
    console.log(`  ${year}  ${byYear[year]} scheme entries`);

  await mongoose.disconnect();
})().catch(async (error) => {
  console.error(error.message);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
