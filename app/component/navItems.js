// Shared navigation modules used by the desktop navbar, the module search,
// and the mobile sidebar drawer.
export const navItems = [
  {
    en: "Home",
    hi: "मुख्य पृष्ठ",
    href: "/",
    img: "https://img.icons8.com/ios/50/1f1f1f/home--v1.png",
  },
  {
    en: "About",
    hi: "पंचायत बद्दल",
    href: "/about",
    img: "https://img.icons8.com/material-outlined/24/1f1f1f/about.png",
  },
  {
    en: "Funds",
    hi: "पंचायत निधी",
    href: "/panchayat_funds",
    img: "https://img.icons8.com/ios/50/1f1f1f/coins--v1.png",
  },
  {
    en: "Income / Expenditure",
    hi: "उत्पन्न / खर्च",
    href: "/panchayat_funds/income_funds",
    img: "https://img.icons8.com/ios/50/1f1f1f/economic-improvement.png",
  },
  {
    en: "Documents",
    hi: "दस्तऐवज",
    href: "/documents",
    img: "https://img.icons8.com/ios/50/1f1f1f/document--v1.png",
  },
  {
    en: "Nearby Services",
    hi: "जवळच्या सेवा",
    href: "/nearby_services",
    img: "https://img.icons8.com/ios/50/1f1f1f/services--v1.png",
  },
];

export const label = (item, language) =>
  language == "english" ? item.en : item.hi;
