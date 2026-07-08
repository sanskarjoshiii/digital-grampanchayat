"use client";

import { useGlobalContext } from "../context/context";

const AboutUsPara = () => {
  const { language } = useGlobalContext();
  const en = language == "english";

  const copy = en
    ? {
        eyebrow: "About the project",
        heading: "What is MeriPanchayat?",
        intro:
          "MeriPanchayat is the digital face of Chandgaon Gram Panchayat — one place where every resident can see how public funds are used, read official documents, and find nearby services, all in their own language.",
        storyTitle: "Why we built this",
        story:
          "For years, information about village funds, schemes and records stayed locked inside the Panchayat office, and residents had to visit in person just to ask a simple question. MeriPanchayat was built to change that — to make local governance open and to put the Panchayat in every villager's pocket.",
        amenitiesTitle: "Village amenities",
        gov: "A government-sponsored digital initiative, built for the betterment of rural citizens.",
      }
    : {
        eyebrow: "परियोजना के बारे में",
        heading: "मेरी पंचायत क्या है?",
        intro:
          "मेरी पंचायत चांदगांव ग्राम पंचायत का डिजिटल चेहरा है — एक ऐसी जगह जहाँ हर नागरिक अपनी भाषा में देख सकता है कि सार्वजनिक निधि का उपयोग कैसे होता है, आधिकारिक दस्तऐवज पढ़ सकता है और नज़दीकी सेवाएँ खोज सकता है।",
        storyTitle: "हमने यह क्यों बनाया",
        story:
          "वर्षों तक गाँव की निधि, योजनाओं और अभिलेखों की जानकारी पंचायत कार्यालय तक सीमित रही, और नागरिकों को एक साधारण प्रश्न पूछने के लिए भी वहाँ जाना पड़ता था। मेरी पंचायत इसी को बदलने के लिए बनाई गई — ताकि स्थानीय शासन पारदर्शी बने और पंचायत हर ग्रामीण की जेब में हो।",
        amenitiesTitle: "गाँव की सुविधाएँ",
        gov: "ग्रामीण नागरिकों के कल्याण के लिए बनाई गई एक सरकार-प्रायोजित डिजिटल पहल।",
      };

  const pillars = en
    ? [
        {
          img: "https://img.icons8.com/ios/50/1f1f1f/checkmark--v1.png",
          title: "Transparency",
          desc: "Every rupee received and spent — published openly, grouped by scheme and year.",
        },
        {
          img: "https://img.icons8.com/ios/50/1f1f1f/smartphone-tablet.png",
          title: "Accessibility",
          desc: "Funds, documents and services available anytime, from any phone. No office queue.",
        },
        {
          img: "https://img.icons8.com/ios/50/1f1f1f/language.png",
          title: "Inclusion",
          desc: "Fully bilingual, so language is never a barrier to information.",
        },
      ]
    : [
        {
          img: "https://img.icons8.com/ios/50/1f1f1f/checkmark--v1.png",
          title: "पारदर्शिता",
          desc: "प्राप्त और खर्च किया गया हर रुपया — योजना और वर्ष अनुसार खुले तौर पर प्रकाशित।",
        },
        {
          img: "https://img.icons8.com/ios/50/1f1f1f/smartphone-tablet.png",
          title: "सुलभता",
          desc: "निधि, दस्तऐवज और सेवाएँ कभी भी, किसी भी फ़ोन से। कार्यालय की कतार नहीं।",
        },
        {
          img: "https://img.icons8.com/ios/50/1f1f1f/language.png",
          title: "समावेशिता",
          desc: "पूरी तरह द्विभाषी, ताकि भाषा जानकारी में कभी बाधा न बने।",
        },
      ];

  const amenities = [
    { img: "https://img.icons8.com/?size=100&id=2539&format=png&color=1f1f1f", en: "Toilets", hi: "शौचालय" },
    { img: "https://img.icons8.com/?size=100&id=10726&format=png&color=1f1f1f", en: "Parking", hi: "पार्किंग" },
    { img: "https://img.icons8.com/?size=100&id=1954&format=png&color=1f1f1f", en: "Schools", hi: "विद्यालय" },
    { img: "https://img.icons8.com/?size=100&id=12449&format=png&color=1f1f1f", en: "Anganwadis", hi: "आंगनवाड़ी" },
    { img: "https://img.icons8.com/?size=100&id=23043&format=png&color=1f1f1f", en: "ATMs", hi: "एटीएम" },
    { img: "https://img.icons8.com/?size=100&id=5035&format=png&color=1f1f1f", en: "Police", hi: "पुलिस" },
    { img: "https://img.icons8.com/?size=100&id=wEgBU9peD99C&format=png&color=1f1f1f", en: "Banks", hi: "बैंक" },
    { img: "https://img.icons8.com/?size=100&id=4192&format=png&color=1f1f1f", en: "Petrol Pump", hi: "पेट्रोल पंप" },
    { img: "https://img.icons8.com/?size=100&id=3675&format=png&color=1f1f1f", en: "Railway", hi: "रेलवे" },
    { img: "https://img.icons8.com/?size=100&id=241&format=png&color=1f1f1f", en: "Bus Stand", hi: "बस स्टैंड" },
    { img: "https://img.icons8.com/?size=100&id=12442&format=png&color=1f1f1f", en: "Service Center", hi: "सेवा केंद्र" },
  ];

  return (
    <section className="max-w-4xl mx-auto px-4 mt-14">
      {/* What is MeriPanchayat */}
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-xs uppercase tracking-wide text-muted">
          {copy.eyebrow}
        </p>
        <h2 className="text-2xl sm:text-3xl font-semibold text-ink mt-2">
          {copy.heading}
        </h2>
        <p className="text-muted mt-4 leading-relaxed">{copy.intro}</p>
      </div>

      {/* Purpose pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        {pillars.map((p) => (
          <div key={p.title} className="ds-card p-5">
            <div className="w-10 h-10 rounded-lg bg-mist border border-line flex items-center justify-center mb-3">
              <img src={p.img} width={20} height={20} alt="" />
            </div>
            <h3 className="text-base font-semibold text-ink">{p.title}</h3>
            <p className="text-sm text-muted mt-1 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>

      {/* Why we built this */}
      <div className="ds-panel-cream p-6 sm:p-8 mt-6">
        <h3 className="text-lg font-semibold text-ink mb-2">
          {copy.storyTitle}
        </h3>
        <p className="text-ink/80 leading-relaxed">{copy.story}</p>
      </div>

      {/* Village amenities */}
      <div className="mt-12">
        <p className="text-xs uppercase tracking-wide text-muted mb-3">
          {copy.amenitiesTitle}
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {amenities.map((a) => (
            <div
              key={a.en}
              className="ds-card px-2 py-4 flex flex-col items-center gap-2 text-center"
            >
              <img src={a.img} width={24} height={24} alt="" />
              <span className="text-xs font-medium text-ink">
                {en ? a.en : a.hi}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Government note */}
      <p className="text-center text-xs text-muted mt-10 max-w-xl mx-auto">
        {copy.gov}
      </p>
    </section>
  );
};
export default AboutUsPara;
