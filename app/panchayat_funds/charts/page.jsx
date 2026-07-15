"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useGlobalContext } from "../../context/context";
import NoDataFound from "../../component/NoDataFound";
import { money, statusLabel, yearOf } from "../../utils/format";
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
// Sanctioned→Received→Utilized are stages of one measure, so one hue, dark→light.
const C = {
  sanctioned: "#33475a", // dark slate
  received: "#647e99", // mid slate
  utilized: "#93a9c0", // light slate
  ink: "#1f1f1f",
  grid: "#e6e6e1",
  axis: "#8a8a82",
};
// Status reads as progression: light (pending) → dark (completed).
const STATUS_COLORS = {
  pending: "#93a9c0",
  ongoing: "#647e99",
  completed: "#33475a",
};

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
            {isMoney ? money(p.value) : `${p.value}%`}
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
        <span
          className="inline-block w-2 h-2 rounded-full"
          style={{ background: dot }}
        />
      )}
      {label}
    </p>
    <p className="text-2xl font-semibold mt-1 text-ink">{value}</p>
  </div>
);

const Page = () => {
  const { setOpenSidebar, setLoader, language } = useGlobalContext();
  const en = language == "english";
  const [works, setWorks] = useState([]);
  const [year, setYear] = useState("all");
  const [scheme, setScheme] = useState("all");

  useEffect(() => {
    const run = async () => {
      setLoader(true);
      const res = await fetch("/api/works");
      if (res.status === 200) setWorks(await res.json());
      setLoader(false);
    };
    run();
  }, []);

  // Filter options derived from all works
  const years = useMemo(() => {
    const s = new Set();
    works.forEach((w) => {
      const y = yearOf(w.startDate || w.createdAt);
      if (y) s.add(String(y));
    });
    return Array.from(s).sort();
  }, [works]);

  const schemes = useMemo(() => {
    const s = new Set();
    works.forEach((w) => w.schemeName && s.add(w.schemeName));
    return Array.from(s).sort();
  }, [works]);

  const filtered = useMemo(
    () =>
      works.filter((w) => {
        const y = String(yearOf(w.startDate || w.createdAt));
        return (
          (year === "all" || y === year) &&
          (scheme === "all" || w.schemeName === scheme)
        );
      }),
    [works, year, scheme]
  );

  const d = useMemo(() => {
    const totals = { sanctioned: 0, received: 0, utilized: 0, remaining: 0 };
    const statusCount = { pending: 0, ongoing: 0, completed: 0 };
    const scheme = {};
    const year = {};
    filtered.forEach((w) => {
      totals.sanctioned += Number(w.sanctionedAmount || 0);
      totals.received += Number(w.receivedAmount || 0);
      totals.utilized += Number(w.amountUtilized || 0);
      totals.remaining += Number(w.remainingBalance || 0);
      statusCount[w.status] = (statusCount[w.status] || 0) + 1;

      const s = w.schemeName || "—";
      scheme[s] = scheme[s] || { name: s, sanctioned: 0, received: 0, utilized: 0 };
      scheme[s].sanctioned += Number(w.sanctionedAmount || 0);
      scheme[s].received += Number(w.receivedAmount || 0);
      scheme[s].utilized += Number(w.amountUtilized || 0);

      const y = yearOf(w.startDate || w.createdAt) || "—";
      year[y] = year[y] || { name: String(y), sanctioned: 0, received: 0 };
      year[y].sanctioned += Number(w.sanctionedAmount || 0);
      year[y].received += Number(w.receivedAmount || 0);
    });

    return {
      totals,
      statusData: ["pending", "ongoing", "completed"]
        .map((k) => ({ name: statusLabel(k, en), key: k, value: statusCount[k] || 0 }))
        .filter((x) => x.value > 0),
      byScheme: Object.values(scheme),
      byYear: Object.values(year).sort((a, b) => a.name.localeCompare(b.name)),
      progress: filtered.map((w) => ({
        name: w.workId,
        progress: Number(w.progress || 0),
      })),
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
      className="w-full min-h-[91vh] bg-paper"
    >
      <div className="border-b border-line px-6 py-6 text-center">
        <h1 className="text-2xl font-semibold text-ink">
          {en ? "Funds at a Glance" : "एक नज़र में निधि"}
        </h1>
        <p className="text-sm text-muted mt-1">
          {en
            ? "How public funds are sanctioned, received and spent across all works."
            : "सभी कामों में सार्वजनिक निधि कैसे मंज़ूर, प्राप्त और खर्च की जाती है।"}
        </p>
      </div>

      {works.length === 0 ? (
        <NoDataFound />
      ) : (
        <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-5">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-xs uppercase tracking-wide text-muted">
                {en ? "Year" : "वर्ष"}
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="h-9 px-3 rounded-lg border border-line bg-paper text-sm text-ink outline-none focus:border-ink transition-colors"
              >
                <option value="all">{en ? "All years" : "सभी वर्ष"}</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs uppercase tracking-wide text-muted">
                {en ? "Scheme" : "योजना"}
              </label>
              <select
                value={scheme}
                onChange={(e) => setScheme(e.target.value)}
                className="h-9 px-3 rounded-lg border border-line bg-paper text-sm text-ink outline-none focus:border-ink transition-colors max-w-[220px]"
              >
                <option value="all">{en ? "All schemes" : "सभी योजनाएँ"}</option>
                {schemes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            {(year !== "all" || scheme !== "all") && (
              <button
                onClick={() => {
                  setYear("all");
                  setScheme("all");
                }}
                className="text-sm text-muted hover:text-ink underline underline-offset-2"
              >
                {en ? "Reset" : "रीसेट"}
              </button>
            )}
            <span className="ml-auto text-sm text-muted">
              {d.count} {en ? "works" : "कामे"}
            </span>
          </div>

          {d.count === 0 ? (
            <div className="py-16 text-center text-muted text-sm">
              {en
                ? "No works match this filter."
                : "इस फ़िल्टर से कोई काम मेल नहीं खाता।"}
            </div>
          ) : (
            <>
          {/* KPI row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Stat
              label={en ? "Total Sanctioned" : "कुल मंज़ूर"}
              value={money(d.totals.sanctioned)}
              dot={C.sanctioned}
            />
            <Stat
              label={en ? "Total Received" : "कुल प्राप्त"}
              value={money(d.totals.received)}
              dot={C.received}
            />
            <Stat
              label={en ? "Total Utilized" : "कुल उपयोग"}
              value={money(d.totals.utilized)}
              dot={C.utilized}
            />
            <Stat
              label={en ? "Remaining Balance" : "शेष राशि"}
              value={money(d.totals.remaining)}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Status donut */}
            <Card
              title={en ? "Works by Status" : "स्थिति अनुसार कामे"}
              subtitle={`${d.count} ${en ? "works in total" : "कुल कामे"}`}
            >
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={d.statusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={2}
                      stroke="#ffffff"
                      strokeWidth={2}
                      label={({ name, value }) => `${name}: ${value}`}
                      labelLine={false}
                    >
                      {d.statusData.map((e) => (
                        <Cell key={e.key} fill={STATUS_COLORS[e.key]} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={<ChartTooltip isMoney={false} />}
                      formatter={(v) => v}
                    />
                    <Legend
                      iconType="circle"
                      wrapperStyle={{ fontSize: 12, color: C.axis }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Progress by work */}
            <Card
              title={en ? "Progress by Work" : "काम अनुसार प्रगति"}
              subtitle={en ? "Completion %" : "पूर्णता %"}
            >
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={d.progress}
                    layout="vertical"
                    margin={{ left: 8, right: 24 }}
                  >
                    <CartesianGrid
                      horizontal={false}
                      stroke={C.grid}
                      strokeDasharray="3 3"
                    />
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      unit="%"
                      {...axisProps}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={90}
                      {...axisProps}
                    />
                    <Tooltip
                      content={<ChartTooltip isMoney={false} />}
                      cursor={{ fill: "rgba(31,31,31,0.04)" }}
                    />
                    <Bar
                      dataKey="progress"
                      name={en ? "Progress" : "प्रगति"}
                      fill={C.ink}
                      radius={[0, 4, 4, 0]}
                      barSize={16}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Funds by scheme */}
          <Card
            title={en ? "Funds by Scheme" : "योजना अनुसार निधि"}
            subtitle={
              en
                ? "Sanctioned vs Received vs Utilized"
                : "मंज़ूर बनाम प्राप्त बनाम उपयोग"
            }
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={d.byScheme} barCategoryGap="22%">
                  <CartesianGrid
                    vertical={false}
                    stroke={C.grid}
                    strokeDasharray="3 3"
                  />
                  <XAxis dataKey="name" {...axisProps} />
                  <YAxis tickFormatter={compact} {...axisProps} width={54} />
                  <Tooltip
                    content={<ChartTooltip />}
                    cursor={{ fill: "rgba(31,31,31,0.04)" }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, color: C.axis }} />
                  <Bar dataKey="sanctioned" name={en ? "Sanctioned" : "मंज़ूर"} fill={C.sanctioned} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="received" name={en ? "Received" : "प्राप्त"} fill={C.received} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="utilized" name={en ? "Utilized" : "उपयोग"} fill={C.utilized} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Funds by year */}
          <Card
            title={en ? "Funds by Year" : "वर्ष अनुसार निधि"}
            subtitle={
              en ? "Sanctioned vs Received per year" : "प्रति वर्ष मंज़ूर बनाम प्राप्त"
            }
          >
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={d.byYear} barCategoryGap="30%">
                  <CartesianGrid
                    vertical={false}
                    stroke={C.grid}
                    strokeDasharray="3 3"
                  />
                  <XAxis dataKey="name" {...axisProps} />
                  <YAxis tickFormatter={compact} {...axisProps} width={54} />
                  <Tooltip
                    content={<ChartTooltip />}
                    cursor={{ fill: "rgba(31,31,31,0.04)" }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, color: C.axis }} />
                  <Bar dataKey="sanctioned" name={en ? "Sanctioned" : "मंज़ूर"} fill={C.sanctioned} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="received" name={en ? "Received" : "प्राप्त"} fill={C.received} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Page;
