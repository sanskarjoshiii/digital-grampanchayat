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
    en: "Community",
    hi: "समुदाय",
    href: "/community",
    img: "https://img.icons8.com/ios/50/1f1f1f/conference-call--v1.png",
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
    en: "Funds Charts",
    hi: "निधि तक्ते",
    href: "/panchayat_funds/charts",
    img: "https://img.icons8.com/ios/50/1f1f1f/combo-chart--v1.png",
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

// Complaints are split by role: villagers track their own submissions, the
// office works from the dashboard. Neither sees the other's page in the nav.
const villagerComplaints = {
  en: "My Complaints",
  hi: "माझ्या तक्रारी",
  href: "/complaints",
  img: "https://img.icons8.com/ios/50/1f1f1f/complaint.png",
};

const officeComplaints = {
  en: "Complaints",
  hi: "तक्रारी",
  href: "/admin/complaints",
  img: "https://img.icons8.com/ios/50/1f1f1f/complaint.png",
};

/** Nav modules for this visitor. Signed-out users see the public modules only. */
export const navItemsFor = (userData) => {
  if (userData?.userType === "admin") return [...navItems, officeComplaints];
  if (userData?.email) return [...navItems, villagerComplaints];
  return navItems;
};

export const label = (item, language) =>
  language == "english" ? item.en : item.hi;
