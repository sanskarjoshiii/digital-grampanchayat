/**
 * The Panchayat this deployment serves.
 *
 * Signup collects village, district and state as real fields, pre-filled from
 * here. Today there is one village, so they are shown read-only; when a second
 * Panchayat is added these become a chooser and nothing else has to change.
 */
export const DEFAULT_PANCHAYAT = {
  village: "Chandgaon",
  district: "Ahilyanagar",
  state: "Maharashtra",
  lgdCode: "170972",
};

// Enquiry helpline villagers can call for information about the Panchayat.
export const ENQUIRY_NUMBER = "9673338564";
export const ENQUIRY_HOURS_EN = "Mon – Sat, 10:00 AM – 5:00 PM";
export const ENQUIRY_HOURS_HI = "सोम – शनि, सुबह 10:00 – शाम 5:00";

/**
 * The elected body of Chandgaon Gram Panchayat.
 *
 * This is the one place to edit when a term ends or a member changes — the
 * tree on the About page is drawn from it. Dates are ISO so they can be
 * formatted for either language and compared against today.
 *
 * `rank` shapes the tree: 1 Sarpanch, 2 Up-Sarpanch, 3 members.
 * Members are reachable by phone only — the office address is the route for
 * anything written.
 * `photo` is optional — leave it empty to show the placeholder frame.
 */
export const PANCHAYAT_TEAM = [
  {
    rank: 1,
    name: "Manisha Ganesh Thengde",
    gender: "F",
    role_en: "Sarpanch",
    role_hi: "सरपंच",
    from: "2022-12-23",
    to: "2027-12-22",
    mobile: "9673338564",
    photo: "",
  },
  {
    rank: 2,
    name: "Lahanu Haribhau Tribhuvan",
    gender: "M",
    role_en: "Up-Sarpanch",
    role_hi: "उप सरपंच",
    from: "2022-12-01",
    to: "2027-11-30",
    mobile: "7620592353",
    photo: "",
  },
  {
    rank: 3,
    name: "Archana Ramhari Rahane",
    gender: "F",
    role_en: "Gram Panchayat Member",
    role_hi: "ग्रामपंचायत सदस्य",
    from: "2022-12-01",
    to: "2027-11-30",
    mobile: "9595322341",
    photo: "",
  },
  {
    rank: 3,
    name: "Aarti Govind Rahane",
    gender: "F",
    role_en: "Gram Panchayat Member",
    role_hi: "ग्रामपंचायत सदस्य",
    from: "2022-12-23",
    to: "2027-12-22",
    mobile: "9545616125",
    photo: "",
  },
  {
    rank: 3,
    name: "Varsha Babasaheb Jadhav",
    gender: "F",
    role_en: "Gram Panchayat Member",
    role_hi: "ग्रामपंचायत सदस्य",
    from: "2022-12-01",
    to: "2027-11-30",
    mobile: "9356476263",
    photo: "",
  },
  {
    rank: 3,
    name: "Surekha Kacharu Gaikwad",
    gender: "F",
    role_en: "Gram Panchayat Member",
    role_hi: "ग्रामपंचायत सदस्य",
    from: "2022-12-23",
    to: "2027-12-22",
    mobile: "9881766547",
    photo: "",
  },
  {
    rank: 3,
    name: "Ganesh Namdev Rahane",
    gender: "M",
    role_en: "Gram Panchayat Member",
    role_hi: "ग्रामपंचायत सदस्य",
    from: "2022-12-23",
    to: "2027-12-22",
    mobile: "9673956309",
    photo: "",
  },
];

export const CURRENT_SARPANCH =
  PANCHAYAT_TEAM.find((member) => member.rank === 1)?.name || "";

/**
 * Photographs of the Gram Panchayat office building, shown on the About page.
 *
 * Put the image files in `public/panchayat/` using the names below. Any entry
 * whose file is missing is dropped from the grid at runtime, so a half-filled
 * folder never leaves broken images on the page.
 */
export const PANCHAYAT_PHOTOS = [
  {
    src: "/panchayat/office-front.jpeg",
    alt_en: "Front of the Gram Panchayat office, with the entrance and stone steps",
    alt_hi: "ग्राम पंचायत कार्यालयाचा दर्शनी भाग, प्रवेशद्वार आणि दगडी पायऱ्या",
  },
  {
    src: "/panchayat/office-back.jpeg",
    alt_en: "Corner of the office building and the courtyard wall",
    alt_hi: "कार्यालयाच्या इमारतीचा कोपरा आणि अंगणाची भिंत",
  },
  {
    src: "/panchayat/office-rear.jpeg",
    alt_en: "Rear of the office, seen from the village path",
    alt_hi: "गावातील वाटेवरून दिसणारा कार्यालयाचा मागील भाग",
  },
];

// Stamped on the photographs by the camera that took them.
export const PANCHAYAT_PHOTO_META = {
  lat: "19.96",
  lng: "74.70",
  place: "Chandgaon, India",
  takenOn: "2025-05-17",
};
