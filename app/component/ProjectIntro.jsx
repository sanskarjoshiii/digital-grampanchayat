"use client";

import { useGlobalContext } from "../context/context";

/**
 * What PanchayatX is and why it exists — the project itself, not this
 * particular village. Lives on the Home page; anything specific to Chandgaon
 * belongs on the About page instead.
 */
const ProjectIntro = () => {
  const { language } = useGlobalContext();
  const en = language == "english";

  const copy = en
    ? {
        eyebrow: "About the project",
        heading: "What is PanchayatX?",
        intro:
          "PanchayatX is built to bring transparency to every Gram Panchayat in the country — one place where any resident can see how public funds are used, read official documents, track a complaint and find nearby services, in their own language. We have begun with Chandgaon Gram Panchayat, and the platform is designed so that any other village can be added to it.",
        storyTitle: "Why we built this",
        story:
          "For years, information about village funds, schemes and records stayed locked inside the Panchayat office, and residents had to visit in person just to ask a simple question. PanchayatX was built to change that — to make local governance open and to put the Panchayat in every villager's pocket.",
      }
    : {
        eyebrow: "परियोजना के बारे में",
        heading: "PanchayatX क्या है?",
        intro:
          "PanchayatX देश की हर ग्राम पंचायत में पारदर्शिता लाने के लिए बनाया गया है — एक ऐसी जगह जहाँ कोई भी नागरिक अपनी भाषा में देख सके कि सार्वजनिक निधि कैसे खर्च होती है, आधिकारिक दस्तावेज़ पढ़ सके, अपनी शिकायत की स्थिति देख सके और नज़दीकी सेवाएँ खोज सके। शुरुआत हमने चांदगांव ग्राम पंचायत से की है, और यह मंच ऐसा बनाया गया है कि इसमें कोई भी दूसरा गाँव जोड़ा जा सके।",
        storyTitle: "हमने यह क्यों बनाया",
        story:
          "वर्षों तक गाँव की निधि, योजनाओं और अभिलेखों की जानकारी पंचायत कार्यालय तक सीमित रही, और नागरिकों को एक साधारण प्रश्न पूछने के लिए भी वहाँ जाना पड़ता था। PanchayatX इसी को बदलने के लिए बनाया गया — ताकि स्थानीय शासन पारदर्शी बने और पंचायत हर ग्रामीण की जेब में हो।",
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

  return (
    <section className="mt-10 sm:mt-14">
      {/* What is PanchayatX */}
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-xs uppercase tracking-wide text-muted">{copy.eyebrow}</p>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-ink mt-2">{copy.heading}</h2>
        <p className="text-muted mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed">{copy.intro}</p>
      </div>

      {/* Purpose pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        {pillars.map((p) => (
          <div
            key={p.title}
            className="ds-card p-5 flex flex-col items-center text-center"
          >
            <div className="w-10 h-10 rounded-lg bg-mist border border-line flex items-center justify-center mb-3">
              <img src={p.img} width={20} height={20} alt="" />
            </div>
            <h3 className="text-base font-semibold text-ink">{p.title}</h3>
            <p className="text-[13px] sm:text-sm text-muted mt-1 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>

      {/* Why we built this */}
      <div className="ds-panel-cream p-5 sm:p-8 mt-5 sm:mt-6">
        <h3 className="text-base sm:text-lg font-semibold text-ink mb-2">{copy.storyTitle}</h3>
        <p className="text-ink/80 text-sm sm:text-base leading-relaxed">{copy.story}</p>
      </div>
    </section>
  );
};

export default ProjectIntro;
