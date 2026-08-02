/**
 * The script for the hero demo: what it shows, in what order, and for how long.
 *
 * Kept apart from both the markup and the GSAP code so the sequence can be
 * retimed or reordered without touching either. Times are seconds on the master
 * timeline; the whole loop is LOOP_SECONDS long.
 *
 * The cursor is not scripted here. It aims at the real bounding box of whatever
 * it is about to click, so it always lands on the button rather than at a
 * coordinate that has to be re-guessed whenever the layout moves.
 */

export const LOOP_SECONDS = 45;

export const SCENES = {
  intro: 0,
  toAbout: 2.6,
  about: 4.7,
  toFunds: 9.2,
  funds: 11.2,
  toComplaint: 16.2,
  typeTitle: 18.4,
  typeDetail: 21.2,
  addPhoto: 25.0,
  submit: 27.4,
  success: 28.8,
  toTracking: 31.4,
  statusFlow: 34.0,
  outro: 40.0,
  reset: 42.5,
};

/**
 * Real figures for Chandgaon, 2025-2026, as published in the funds section.
 * The demo shows the product's actual data rather than invented numbers — the
 * whole point of the site is that these are verifiable.
 */
export const DEMO_FUNDS = [
  {
    _id: "demo-1",
    scheme: "XV Finance Commission [1769]",
    component: "Center Schemes/ Grants",
    expectedFund: 759810,
    actualFundReceived: 742203,
    previousYearBalance: 0,
    revertedFund: 0,
    actualExpenditure: 65032,
  },
  {
    _id: "demo-2",
    scheme: "XV Finance Commission [1769]",
    component: "Center Schemes/ Grants",
    expectedFund: 506540,
    actualFundReceived: 1112665,
    previousYearBalance: 0,
    revertedFund: 0,
    actualExpenditure: 768300,
  },
];

/** Totals strip above the cards, counted up rather than simply appearing. */
export const DEMO_TOTALS = [
  { key: "expected", en: "Expected", mr: "अपेक्षित", hi: "अपेक्षित", value: 1866350 },
  { key: "received", en: "Received", mr: "मिळालेली", hi: "प्राप्त", value: 1854868 },
  { key: "spent", en: "Spent", mr: "खर्च", hi: "व्यय", value: 833332 },
];

/** The elected body, shown as the tree that the About page draws. */
export const DEMO_TEAM = {
  sarpanch: { name: "Manisha Ganesh Thengde", en: "Sarpanch", mr: "सरपंच", hi: "सरपंच" },
  upSarpanch: { name: "Lahanu Haribhau Tribhuvan", en: "Up-Sarpanch", mr: "उप सरपंच", hi: "उप सरपंच" },
  members: [
    "Archana Ramhari Rahane",
    "Aarti Govind Rahane",
    "Varsha Babasaheb Jadhav",
    "Surekha Kacharu Gaikwad",
    "Ganesh Namdev Rahane",
  ],
};

export const DEMO_AMENITIES = [
  { en: "Schools", mr: "विद्यालय", hi: "विद्यालय" },
  { en: "Banks", mr: "बँका", hi: "बैंक" },
  { en: "Anganwadis", mr: "अंगणवाडी", hi: "आंगनवाड़ी" },
  { en: "Bus Stand", mr: "बस स्थानक", hi: "बस स्टैंड" },
];

/** Typed one character at a time in the complaint dialog. */
export const DEMO_COMPLAINT = {
  title: {
    en: "Street light not working near the school",
    mr: "शाळेजवळचा पथदिवा बंद आहे",
    hi: "स्कूल के पास की स्ट्रीट लाइट बंद है",
  },
  detail: {
    en: "Dark for two weeks. Children walk home this way after evening class.",
    mr: "दोन आठवड्यांपासून अंधार आहे. संध्याकाळच्या वर्गानंतर मुले याच वाटेने घरी जातात.",
    hi: "दो हफ़्ते से अंधेरा है। शाम की कक्षा के बाद बच्चे इसी रास्ते से घर जाते हैं।",
  },
};

export const DEMO_COMPLAINT_ID = "CMP-2026-000043";

/** A photograph really taken in Chandgaon, so the attachment is not a grey box. */
export const DEMO_PHOTO = "/panchayat/office-rear.jpeg";

/**
 * The complaint's journey once the office has it. Each step replaces the one
 * before in the tracking table, which is the point the demo is making: a
 * villager can watch their complaint move.
 */
export const DEMO_STATUS_FLOW = [
  { status: "submitted", at: 0 },
  { status: "acknowledged", at: 1.5, note: { en: "Electrician assigned", mr: "वीजतंत्रज्ञ नेमला", hi: "बिजली मिस्त्री नियुक्त" } },
  { status: "in_progress", at: 3.0, note: { en: "Pole repair started", mr: "खांबाची दुरुस्ती सुरू", hi: "खंभे की मरम्मत शुरू" } },
  { status: "resolved", at: 4.5, note: { en: "Light working again", mr: "दिवा पुन्हा सुरू", hi: "लाइट फिर से चालू" } },
];
