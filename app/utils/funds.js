/**
 * Shape of the Panchayat's fund records, mirroring the "Scheme-wise Fund
 * Receipt & Expenditure" report in the Government of India's Meri Panchayat
 * app — the same figures the office has to publish there.
 *
 * Keeping the field names and the funding sources identical means a villager
 * can hold the two side by side and check that they match.
 */

export const FUND_SOURCES = [
  { value: "goi", en: "Govt. of India", mr: "भारत सरकार", hi: "भारत सरकार", label: "Govt. of India" },
  { value: "state", en: "State Govt.", mr: "राज्य शासन", hi: "राज्य सरकार", label: "State Govt." },
  { value: "other", en: "Other", mr: "इतर", hi: "अन्य", label: "Other" },
];

export const SOURCE_VALUES = FUND_SOURCES.map((source) => source.value);

export const sourceMeta = (value) =>
  FUND_SOURCES.find((source) => source.value === value) || FUND_SOURCES[0];

/** "2025-2026" — an Indian financial year runs April to March. */
export const isFinancialYear = (value) => /^\d{4}-\d{4}$/.test(String(value || ""));

/** The financial year a date falls in: April 2025 → "2025-2026". */
export const financialYearOf = (date = new Date()) => {
  const d = new Date(date);
  const start = d.getMonth() >= 3 ? d.getFullYear() : d.getFullYear() - 1;
  return `${start}-${start + 1}`;
};

/** Years to offer in the picker, newest first. */
export const financialYearOptions = (count = 8) => {
  const [start] = financialYearOf().split("-").map(Number);
  return Array.from({ length: count }, (_, i) => `${start - i}-${start - i + 1}`);
};

/**
 * Totals across a set of records, for the summary strip and the charts.
 *
 * Only the five published figures are summed. No "closing balance" is derived:
 * in several years the reverted amount exceeds what was received, so subtracting
 * one from the other produces a negative number that looks like a bug in this
 * site rather than a feature of the source data.
 */
export const totalsOf = (funds = []) =>
  funds.reduce(
    (sum, fund) => ({
      expectedFund: sum.expectedFund + Number(fund.expectedFund || 0),
      actualFundReceived: sum.actualFundReceived + Number(fund.actualFundReceived || 0),
      previousYearBalance: sum.previousYearBalance + Number(fund.previousYearBalance || 0),
      revertedFund: sum.revertedFund + Number(fund.revertedFund || 0),
      actualExpenditure: sum.actualExpenditure + Number(fund.actualExpenditure || 0),
    }),
    {
      expectedFund: 0,
      actualFundReceived: 0,
      previousYearBalance: 0,
      revertedFund: 0,
      actualExpenditure: 0,
    }
  );
