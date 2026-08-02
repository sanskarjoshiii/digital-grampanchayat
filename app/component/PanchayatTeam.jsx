"use client";

import { useGlobalContext } from "../context/context";
import { PANCHAYAT_TEAM } from "../config/panchayat";

const sarpanch = PANCHAYAT_TEAM.find((m) => m.rank === 1);
const upSarpanch = PANCHAYAT_TEAM.find((m) => m.rank === 2);
const members = PANCHAYAT_TEAM.filter((m) => m.rank === 3);

const Frame = ({ photo, name, size }) => (
  <div
    className={`${size} rounded-2xl border border-line bg-mist overflow-hidden flex items-center justify-center shrink-0`}
  >
    {photo ? (
      <img src={photo} alt={name} className="w-full h-full object-cover" />
    ) : (
      <img
        src="https://img.icons8.com/ios/100/b7b7b0/user-male-circle.png"
        alt=""
        width={32}
        height={32}
      />
    )}
  </div>
);

// Phone only. The addresses that came with this roster were the data-entry
// operator's, not the members' own, so publishing them would have sent
// villagers' mail nowhere.
const Contact = ({ member }) => (
  <a
    href={`tel:${member.mobile}`}
    className="mt-2 flex items-center gap-1.5 text-sm font-medium text-ink hover:underline"
  >
    <img width="13" height="13" src="https://img.icons8.com/ios/50/8a8a82/phone.png" alt="" />
    {member.mobile}
  </a>
);

const Person = ({ member, en, size = "w-16 h-16", compact = false }) => (
  <div className="ds-card flex w-full flex-col items-center gap-2 p-4 text-center">
    <Frame photo={member.photo} name={member.name} size={size} />
    <span className="ds-pill">{en ? member.role_en : member.role_hi}</span>
    <h3 className={`font-semibold leading-tight text-ink ${compact ? "text-sm" : "text-base"}`}>
      {member.name}
      <span className="ml-1 align-middle text-xs font-normal text-muted">({member.gender})</span>
    </h3>
    <Contact member={member} />
  </div>
);

/** The single line joining one level of the tree to the next. */
const Trunk = () => <div className="h-8 w-px bg-line" aria-hidden />;

const PanchayatTeam = () => {
  const { language } = useGlobalContext();
  const en = language == "english";
  // Members were sworn in on two different dates, so the heading gives the
  // years the body as a whole serves rather than any one person's exact term.
  const years = PANCHAYAT_TEAM.flatMap((m) => [
    new Date(m.from).getFullYear(),
    new Date(m.to).getFullYear(),
  ]);
  const term = `${Math.min(...years)} — ${Math.max(...years)}`;

  return (
    <section className="max-w-4xl mx-auto px-4 mt-14">
      <div className="mb-8 text-center">
        <p className="text-xs uppercase tracking-wide text-muted">
          {en ? "Who runs the Panchayat" : "पंचायत कौन चलाता है"}
        </p>
        <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-ink">
          {en ? "Panchayat Members" : "पंचायत सदस्य"}
        </h2>
        <p className="mt-2 text-sm text-muted">
          {en
            ? `Elected body, ${term}`
            : `निर्वाचित मंडळ, ${term}`}
        </p>
      </div>

      <div className="flex flex-col items-center">
        <div className="w-full max-w-xs">
          <Person member={sarpanch} en={en} size="w-20 h-20" />
        </div>

        <Trunk />

        <div className="w-full max-w-xs">
          <Person member={upSarpanch} en={en} size="w-16 h-16" />
        </div>

        <Trunk />

        {/*
          On a wide screen the members sit in one row, joined by a horizontal
          bar with a stub dropping into each card — a proper tree. Once they
          wrap onto several rows that bar would cut across empty space, so
          below lg the branch lines are hidden and the cards simply stack.
        */}
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3">
          {members.map((member, index) => (
            <div key={member.mobile} className="relative flex flex-col lg:pt-8">
              <span
                aria-hidden
                className={`absolute top-0 hidden h-px bg-line lg:block ${
                  index === 0
                    ? "left-1/2 right-0"
                    : index === members.length - 1
                      ? "left-0 right-1/2"
                      : "left-0 right-0"
                }`}
              />
              <span
                aria-hidden
                className="absolute left-1/2 top-0 hidden h-8 w-px bg-line lg:block"
              />
              <Person member={member} en={en} compact />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PanchayatTeam;
