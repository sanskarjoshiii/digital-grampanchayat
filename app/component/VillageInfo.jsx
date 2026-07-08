"use client";
import { useGlobalContext } from "../context/context";

const VillageInfo = () => {
  const { language } = useGlobalContext();
  const en = language == "english";

  const stats = en
    ? [
        ["Gram Panchayat", "Chandgaon"],
        ["LGD Code", "170972"],
        ["Block", "Vaijapur"],
        ["Zilla Parishad", "Sambhaji Nagar"],
      ]
    : [
        ["ग्राम पंचायत", "चांदगांव"],
        ["एलजीडी कोड", "170972"],
        ["ब्लॉक", "वैजापुर"],
        ["जिला परिषद", "संभाजी नगर"],
      ];

  return (
    <section className="max-w-4xl mx-auto px-4">
      {/* Village at a glance */}
      <p className="text-xs uppercase tracking-wide text-muted mb-3">
        {en ? "Village at a glance" : "गाँव एक नज़र में"}
      </p>
      <div className="ds-panel-cream p-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
        {stats.map(([k, v]) => (
          <div key={k} className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-muted">
              {k}
            </span>
            <span className="text-base font-semibold text-ink">{v}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
export default VillageInfo;
