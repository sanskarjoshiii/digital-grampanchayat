"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useGlobalContext } from "../../context/context";
import NoDataFound from "../../component/NoDataFound";
import Dropdown from "../../component/Dropdown";
import { money } from "../../utils/format";
import { FUND_SOURCES, sourceMeta, totalsOf } from "../../utils/funds";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Minimal, professional palette — a single desaturated slate ramp
// (validated as an ordinal ramp: monotone lightness, single hue, clears surface).
// Expected→Received→Spent are stages of one measure, so one hue, dark→light.
const C = {
  expected: "#33475a", // dark slate
  received: "#647e99", // mid slate
  spent: "#93a9c0", // light slate
  ink: "#1f1f1f",
  grid: "#e6e6e1",
  axis: "#8a8a82",
};
const SOURCE_COLORS = { goi: "#33475a", state: "#647e99", other: "#93a9c0" };

// Compact ₹ for axis ticks: ₹5L, ₹50K
const compact = (n) => {
  n = Number(n || 0);
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${Math.round(n / 1000)}K`;
  return `₹${n}`;
};

const ChartTooltip = ({ active, payload, label, isMoney = true }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-paper border border-line rounded-lg shadow-pop px-3 py-2 text-xs">
      <p className="font-semibold text-ink mb-1">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className="inline-block w-2.5 h-2.5 rounded-sm"
            style={{ background: p.color || p.payload?.fill }}
          />
          <span className="text-muted">{p.name}:</span>
          <span className="font-medium text-ink">
            {isMoney ? money(p.value) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const Card = ({ title, subtitle, children }) => (
  <div className="ds-card p-5">
    <h3 className="text-sm font-semibold text-ink">{title}</h3>
    {subtitle && <p className="text-xs text-muted mt-0.5 mb-3">{subtitle}</p>}
    {!subtitle && <div className="mb-3" />}
    {children}
  </div>
);

const Stat = ({ label, value, dot }) => (
  <div className="ds-card p-5">
    <p className="text-xs uppercase tracking-wide text-muted flex items-center gap-1.5">
      {dot && (
        <span className="inline-block w-2 h-2 rounded-full" style={{ background: dot }} />
      )}
      {label}
    </p>
    <p className="text-2xl font-semibold mt-1 text-ink">{value}</p>
  </div>
);

const Page = () => {
  const { setOpenSidebar, setLoader, language } = useGlobalContext();
  const en = language == "english";
  const [funds, setFunds] = useState([]);
  const [year, setYear] = useState("all");
  const [scheme, setScheme] = useState("all");

  useEffect(() => {
    const run = async () => {
      setLoader(true);
      const res = await fetch("/api/funds");
      if (res.status === 200) {
        const data = await res.json();
        setFunds(data.funds || []);
      }
      setLoader(false);
    };
    run();
  }, []);

  const years = useMemo(
    () => [...new Set(funds.map((f) => f.financialYear))].sort().reverse(),
    [funds]
  );
  const schemes = useMemo(
    () => [...new Set(funds.map((f) => f.scheme).filter(Boolean))].sort(),
    [funds]
  );

  const filtered = useMemo(
    () =>
      funds.filter(
        (f) =>
          (year === "all" || f.financialYear === year) &&
          (scheme === "all" || f.scheme === scheme)
      ),
    [funds, year, scheme]
  );

  const d = useMemo(() => {
    const totals = totalsOf(filtered);

    const byYear = {};
    const byScheme = {};
    const bySource = {};
    filtered.forEach((f) => {
      const y = (byYear[f.financialYear] = byYear[f.financialYear] || {
        name: f.financialYear,
        expected: 0,
        received: 0,
        spent: 0,
      });
      y.expected += Number(f.expectedFund || 0);
      y.received += Number(f.actualFundReceived || 0);
      y.spent += Number(f.actualExpenditure || 0);

      // Long scheme names would swamp the axis, so trim to the leading words.
      const shortName = f.scheme.replace(/\s*\[\d+\]\s*$/, "").slice(0, 28);
      const s = (byScheme[shortName] = byScheme[shortName] || {
        name: shortName,
        received: 0,
        spent: 0,
      });
      s.received += Number(f.actualFundReceived || 0);
      s.spent += Number(f.actualExpenditure || 0);

      bySource[f.source] = (bySource[f.source] || 0) + Number(f.actualFundReceived || 0);
    });

    return {
      totals,
      byYear: Object.values(byYear).sort((a, b) => a.name.localeCompare(b.name)),
      byScheme: Object.values(byScheme),
      bySource: Object.entries(bySource)
        .map(([key, value]) => ({
          name: en ? sourceMeta(key).label : sourceMeta(key).hi,
          key,
          value,
        }))
        .filter((x) => x.value > 0),
      count: filtered.length,
    };
  }, [filtered, en]);

  const axisProps = {
    tick: { fill: C.axis, fontSize: 12 },
    tickLine: false,
    axisLine: { stroke: C.grid },
  };

  return (
    <div
      onClick={() => setOpenSidebar(false)}
      className="w-full min-h-[calc(100vh-4rem)] bg-paper"
    >
      {funds.length === 0 ? (
        <NoDataFound />
      ) : (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-5">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-xs uppercase tracking-wide text-muted">
                {en ? "Year" : "वर्ष"}
              </label>
              <Dropdown
                value={year}
                options={[
                  { value: "all", label: en ? "All years" : "सभी वर्ष" },
                  ...years.map((y) => ({ value: y, label: y })),
                ]}
                onChange={setYear}
                ariaLabel={en ? "Year" : "वर्ष"}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs uppercase tracking-wide text-muted">
                {en ? "Scheme" : "योजना"}
              </label>
              <Dropdown
                value={scheme}
                options={[
                  { value: "all", label: en ? "All schemes" : "सभी योजनाएँ" },
                  ...schemes.map((s) => ({ value: s, label: s })),
                ]}
                onChange={setScheme}
                className="max-w-[240px]"
                ariaLabel={en ? "Scheme" : "योजना"}
              />
            </div>
            {(year !== "all" || scheme !== "all") && (
              <button
                onClick={() => {
                  setYear("all");
                  setScheme("all");
                }}
                className="text-sm font-medium text-ink hover:underline"
              >
                {en ? "Reset" : "रीसेट"}
              </button>
            )}
          </div>

          {/* Headline figures */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Stat
              label={en ? "Expected" : "अपेक्षित"}
              value={money(d.totals.expectedFund)}
              dot={C.expected}
            />
            <Stat
              label={en ? "Received" : "प्राप्त"}
              value={money(d.totals.actualFundReceived)}
              dot={C.received}
            />
            <Stat
              label={en ? "Spent" : "व्यय"}
              value={money(d.totals.actualExpenditure)}
              dot={C.spent}
            />
            <Stat label={en ? "Records" : "नोंदी"} value={d.count} />
          </div>

          <Card
            title={en ? "Year by year" : "वर्षानुसार"}
            subtitle={
              en
                ? "Expected, received and spent for each financial year."
                : "प्रत्येक वित्तीय वर्ष में अपेक्षित, प्राप्त और खर्च।"
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={d.byYear} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
                <CartesianGrid stroke={C.grid} vertical={false} />
                <XAxis dataKey="name" {...axisProps} />
                <YAxis tickFormatter={compact} {...axisProps} width={62} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="expected" name={en ? "Expected" : "अपेक्षित"} fill={C.expected} radius={[3, 3, 0, 0]} />
                <Bar dataKey="received" name={en ? "Received" : "प्राप्त"} fill={C.received} radius={[3, 3, 0, 0]} />
                <Bar dataKey="spent" name={en ? "Spent" : "व्यय"} fill={C.spent} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card
              title={en ? "By scheme" : "योजनानुसार"}
              subtitle={en ? "Received against spent." : "प्राप्त बनाम व्यय।"}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={d.byScheme}
                  layout="vertical"
                  margin={{ top: 4, right: 12, left: 8, bottom: 4 }}
                >
                  <CartesianGrid stroke={C.grid} horizontal={false} />
                  <XAxis type="number" tickFormatter={compact} {...axisProps} />
                  <YAxis type="category" dataKey="name" width={150} {...axisProps} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="received" name={en ? "Received" : "प्राप्त"} fill={C.received} radius={[0, 3, 3, 0]} />
                  <Bar dataKey="spent" name={en ? "Spent" : "व्यय"} fill={C.spent} radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card
              title={en ? "Where the money came from" : "पैसा कहाँ से आया"}
              subtitle={en ? "Funds received by source." : "स्रोत अनुसार प्राप्त निधि।"}
            >
              {d.bySource.length === 0 ? (
                <p className="text-sm text-muted py-16 text-center">
                  {en ? "Nothing received in this selection." : "इस चयन में कुछ प्राप्त नहीं हुआ।"}
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={d.bySource}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={62}
                      outerRadius={100}
                      paddingAngle={2}
                    >
                      {d.bySource.map((entry) => (
                        <Cell key={entry.key} fill={SOURCE_COLORS[entry.key] || C.received} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
