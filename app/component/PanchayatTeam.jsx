"use client";
import { useGlobalContext } from "../context/context";
import { CURRENT_SARPANCH } from "../config/panchayat";

// Each member can carry a real photo URL in `photo` (e.g. "/team/ramesh.jpg"
// placed in /public, or an uploaded image URL). Leave empty to show the frame.
const team = {
  sarpanch: {
    photo: "",
    name: CURRENT_SARPANCH,
    role_en: "Sarpanch",
    role_hi: "सरपंच",
    mobile: "9673338564",
    email: "ganstgda@gmail.com",
  },
  upSarpanch: {
    photo: "",
    name: "Ramesh Patil",
    role_en: "Up-Sarpanch",
    role_hi: "उप-सरपंच",
  },
  members: [
    { photo: "", name: "Sunita More", role_en: "Ward Member (Panch)", role_hi: "वार्ड सदस्य (पंच)" },
    { photo: "", name: "Anil Jadhav", role_en: "Ward Member (Panch)", role_hi: "वार्ड सदस्य (पंच)" },
    { photo: "", name: "Kavita Shinde", role_en: "Ward Member (Panch)", role_hi: "वार्ड सदस्य (पंच)" },
    { photo: "", name: "Prakash Deshmukh", role_en: "Gram Panchayat Secretary", role_hi: "ग्राम पंचायत सचिव" },
  ],
};

const Frame = ({ photo, name, size = "w-20 h-20" }) => (
  <div
    className={`${size} rounded-2xl border border-line bg-mist overflow-hidden flex items-center justify-center shrink-0`}
  >
    {photo ? (
      <img src={photo} alt={name} className="w-full h-full object-cover" />
    ) : (
      <img
        src="https://img.icons8.com/ios/100/b7b7b0/user-male-circle.png"
        alt=""
        width={40}
        height={40}
      />
    )}
  </div>
);

const Connector = () => <div className="w-px h-8 bg-line" />;

const PanchayatTeam = () => {
  const { language } = useGlobalContext();
  const en = language == "english";
  const role = (m) => (en ? m.role_en : m.role_hi);

  return (
    <section className="max-w-4xl mx-auto px-4 mt-14">
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-wide text-muted">
          {en ? "Who runs the Panchayat" : "पंचायत कौन चलाता है"}
        </p>
        <h2 className="text-2xl sm:text-3xl font-semibold text-ink mt-2">
          {en ? "Panchayat Members" : "पंचायत सदस्य"}
        </h2>
      </div>

      <div className="flex flex-col items-center">
        {/* Sarpanch — top of the hierarchy */}
        <div className="ds-card p-6 w-full max-w-sm flex flex-col items-center text-center gap-3">
          <Frame photo={team.sarpanch.photo} name={team.sarpanch.name} size="w-24 h-24" />
          <div>
            <span className="ds-pill">{role(team.sarpanch)}</span>
            <h3 className="text-lg font-semibold text-ink mt-2">
              {team.sarpanch.name}
            </h3>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <a
              href={`tel:${team.sarpanch.mobile}`}
              className="flex items-center gap-2 text-sm text-muted hover:text-ink"
            >
              <img width="14" height="14" src="https://img.icons8.com/ios/50/8a8a82/phone.png" alt="" />
              {team.sarpanch.mobile}
            </a>
            <a
              href={`mailto:${team.sarpanch.email}`}
              className="flex items-center gap-2 text-sm text-muted hover:text-ink"
            >
              <img width="14" height="14" src="https://img.icons8.com/ios/50/8a8a82/new-post.png" alt="" />
              {team.sarpanch.email}
            </a>
          </div>
        </div>

        <Connector />

        {/* Up-Sarpanch */}
        <div className="ds-card p-5 w-full max-w-xs flex flex-col items-center text-center gap-3">
          <Frame photo={team.upSarpanch.photo} name={team.upSarpanch.name} />
          <div>
            <span className="ds-pill">{role(team.upSarpanch)}</span>
            <h3 className="text-base font-semibold text-ink mt-2">
              {team.upSarpanch.name}
            </h3>
          </div>
        </div>

        <Connector />

        {/* Ward Members + Secretary */}
        <div className="w-full">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {team.members.map((m) => (
              <div
                key={m.name}
                className="ds-card p-4 flex flex-col items-center text-center gap-3"
              >
                <Frame photo={m.photo} name={m.name} size="w-16 h-16" />
                <div>
                  <h3 className="text-sm font-semibold text-ink leading-tight">
                    {m.name}
                  </h3>
                  <p className="text-xs text-muted mt-1">{role(m)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PanchayatTeam;
