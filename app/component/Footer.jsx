"use client";

import { useGlobalContext } from "../context/context";
import { pick } from "../utils/language";

// One line, on every page. The nav links that used to live here duplicated the
// top navigation, and the copyright line said nothing a villager needs.
const Footer = () => {
  const { language } = useGlobalContext();

  return (
    <footer className="w-full border-t border-line py-8 px-4">
      <p className="mx-auto max-w-xl text-center text-xs leading-5 text-muted">
        {pick(language, {
          en: "A government-sponsored digital initiative, built for the betterment of rural citizens.",
          mr: "ग्रामीण नागरिकांच्या हितासाठी उभारलेला शासनपुरस्कृत डिजिटल उपक्रम.",
          hi: "ग्रामीण नागरिकों के कल्याण के लिए बनाई गई एक सरकार-प्रायोजित डिजिटल पहल।",
        })}
      </p>
    </footer>
  );
};

export default Footer;
