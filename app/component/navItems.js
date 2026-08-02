import { pick } from "../utils/language";

// Shared navigation modules used by the desktop navbar, the module search,
// and the mobile sidebar drawer.
const home = {
  en: "Home",
  mr: "मुख्यपृष्ठ",
  hi: "मुख्य पृष्ठ",
  href: "/",
  img: "https://img.icons8.com/ios/50/1f1f1f/home--v1.png",
};

const about = {
  en: "About",
  mr: "पंचायतीविषयी",
  hi: "पंचायत के बारे में",
  href: "/about",
  img: "https://img.icons8.com/material-outlined/24/1f1f1f/about.png",
};

const community = {
  en: "Community",
  mr: "गावकारभार",
  hi: "समुदाय",
  href: "/community",
  img: "https://img.icons8.com/ios/50/1f1f1f/conference-call--v1.png",
};

const funds = {
  en: "Funds",
  mr: "पंचायत निधी",
  hi: "पंचायत निधि",
  href: "/panchayat_funds",
  img: "https://img.icons8.com/ios/50/1f1f1f/coins--v1.png",
};

const fundsCharts = {
  en: "Funds Charts",
  mr: "निधी तक्ते",
  hi: "निधि तालिका",
  href: "/panchayat_funds/charts",
  img: "https://img.icons8.com/ios/50/1f1f1f/combo-chart--v1.png",
};

const documents = {
  en: "Documents",
  mr: "कागदपत्रे",
  hi: "दस्तावेज़",
  href: "/documents",
  img: "https://img.icons8.com/ios/50/1f1f1f/document--v1.png",
};

const nearbyServices = {
  en: "Nearby Services",
  mr: "जवळच्या सेवा",
  hi: "नज़दीकी सेवाएँ",
  href: "/nearby_services",
  img: "https://img.icons8.com/ios/50/1f1f1f/services--v1.png",
};

// Complaints are split by role: villagers track their own submissions, the
// office works from the dashboard. Neither sees the other's page in the nav.
const villagerComplaints = {
  en: "My Complaints",
  mr: "माझ्या तक्रारी",
  hi: "मेरी शिकायतें",
  href: "/complaints",
  img: "https://img.icons8.com/ios/50/1f1f1f/complaint.png",
};

const officeComplaints = {
  en: "Complaints",
  mr: "तक्रारी",
  hi: "शिकायतें",
  href: "/admin/complaints",
  img: "https://img.icons8.com/ios/50/1f1f1f/complaint.png",
};

export const navItems = [
  home,
  about,
  community,
  funds,
  fundsCharts,
  documents,
  nearbyServices,
];

/**
 * Nav modules for this visitor. Signed-out users see the public modules only.
 * Complaints sits between Documents and Nearby Services, so the order stays the
 * same whether or not someone is signed in.
 */
export const navItemsFor = (userData) => {
  const complaints =
    userData?.userType === "admin"
      ? officeComplaints
      : userData?.email
        ? villagerComplaints
        : null;
  if (!complaints) return navItems;
  return [home, about, community, funds, fundsCharts, documents, complaints, nearbyServices];
};

export const label = (item, language) => pick(language, item);
