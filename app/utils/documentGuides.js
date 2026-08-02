/**
 * Step-by-step guides for the documents villagers ask the Panchayat office
 * about most often.
 *
 * Every link here points at a government domain that was checked to be live.
 * Please keep it that way — fake lookalike sites (for example addresses that
 * start with a real government name but end in .co.in or .in) charge money for
 * these free services and harvest Aadhaar numbers.
 *
 * Rules and fees change, and several of these are set at state or district
 * level. Where that is true the guide says so and points to the office rather
 * than stating a number that may be wrong.
 */

export const DOCUMENT_GUIDES = [
  {
    slug: "aadhaar-card",
    icon: "https://img.icons8.com/ios/50/1f1f1f/identification-documents.png",
    en: {
      name: "Aadhaar Card",
      tagline: "12-digit identity number for every resident",
      about:
        "Aadhaar is the identity proof used for almost everything else — ration, pension, bank accounts, school admission and government schemes. Enrolling is free and can be done at any age, including for newborns.",
      whoFor:
        "Any resident of India, including infants. Children under 5 get a blue 'Baal Aadhaar' with no fingerprints, which must be updated with biometrics at age 5 and again at 15.",
      needed: [
        "Proof of identity — school ID, passport, PAN, or a certificate from the Sarpanch",
        "Proof of address — ration card, electricity bill, bank passbook, or Panchayat certificate",
        "Proof of date of birth — birth certificate, school leaving certificate",
        "For a child: the birth certificate plus one parent's Aadhaar",
      ],
      online: [
        "Find your nearest Aadhaar Seva Kendra or enrolment centre using the official centre locator.",
        "Book a free appointment on the myAadhaar portal so you do not have to wait in a queue.",
        "Carry the original documents on the appointment day — photocopies alone are not accepted.",
        "At the centre your photo, fingerprints and iris scan are taken. Check the details on screen before you approve them.",
        "Collect the acknowledgement slip. It carries a 14-digit Enrolment ID (EID) — keep it safe.",
        "Track the status with that EID, and once approved, download the e-Aadhaar PDF from myAadhaar.",
      ],
      offline: [
        "Go to the nearest Aadhaar Seva Kendra, Common Service Centre, or a bank or post office that runs an enrolment counter.",
        "Fill the enrolment form and give your documents for verification.",
        "Give your biometrics and collect the acknowledgement slip.",
      ],
      fee: "First enrolment is free. Later updates to name, address, date of birth or biometrics carry a small government fee — confirm the current amount at the centre.",
      time: "The card is usually generated within 15 to 30 days. e-Aadhaar can be downloaded as soon as it is approved.",
      tips: [
        "Link a mobile number you actually use — the OTP for every online Aadhaar service goes to it.",
        "An e-Aadhaar printout is legally valid everywhere. You do not need to pay anyone for a plastic or laminated card.",
        "Never share your Aadhaar OTP with anyone, including someone claiming to be from the bank or the government.",
      ],
    },
    hi: {
      name: "आधार कार्ड",
      tagline: "हर निवासी के लिए 12 अंकों की पहचान संख्या",
      about:
        "आधार लगभग हर काम में पहचान के प्रमाण के रूप में लगता है — राशन, पेंशन, बैंक खाता, स्कूल में प्रवेश और सरकारी योजनाएँ। नामांकन निःशुल्क है और किसी भी उम्र में, नवजात शिशु के लिए भी, हो सकता है।",
      whoFor:
        "भारत का कोई भी निवासी, शिशु भी। 5 वर्ष से छोटे बच्चों को नीला 'बाल आधार' मिलता है जिसमें उंगलियों के निशान नहीं होते — 5 और 15 वर्ष की आयु पर बायोमेट्रिक अपडेट कराना अनिवार्य है।",
      needed: [
        "पहचान का प्रमाण — स्कूल पहचान पत्र, पासपोर्ट, पैन, या सरपंच का प्रमाणपत्र",
        "पते का प्रमाण — राशन कार्ड, बिजली बिल, बैंक पासबुक, या पंचायत प्रमाणपत्र",
        "जन्म तिथि का प्रमाण — जन्म प्रमाणपत्र, स्कूल छोड़ने का प्रमाणपत्र",
        "बच्चे के लिए: जन्म प्रमाणपत्र और माता या पिता का आधार",
      ],
      online: [
        "आधिकारिक केंद्र लोकेटर से अपने नज़दीकी आधार सेवा केंद्र का पता लगाएँ।",
        "myAadhaar पोर्टल पर निःशुल्क अपॉइंटमेंट बुक करें, ताकि कतार में न लगना पड़े।",
        "अपॉइंटमेंट वाले दिन मूल दस्तऐवज साथ ले जाएँ — केवल छायाप्रति स्वीकार नहीं होती।",
        "केंद्र पर फ़ोटो, उंगलियों के निशान और आँख का स्कैन लिया जाता है। मंज़ूरी देने से पहले स्क्रीन पर सारी जानकारी जाँच लें।",
        "पावती पर्ची लें। उस पर 14 अंकों का नामांकन क्रमांक (EID) होता है — उसे संभालकर रखें।",
        "उसी EID से स्थिति देखें, और मंज़ूरी मिलने पर myAadhaar से e-आधार डाउनलोड करें।",
      ],
      offline: [
        "नज़दीकी आधार सेवा केंद्र, सामान्य सेवा केंद्र, या नामांकन काउंटर वाले बैंक या डाकघर जाएँ।",
        "नामांकन फ़ॉर्म भरें और दस्तऐवज सत्यापन के लिए दें।",
        "बायोमेट्रिक दें और पावती पर्ची लेकर आएँ।",
      ],
      fee: "पहला नामांकन निःशुल्क है। बाद में नाम, पता, जन्म तिथि या बायोमेट्रिक बदलने पर छोटा सरकारी शुल्क लगता है — वर्तमान राशि केंद्र पर पूछ लें।",
      time: "कार्ड आमतौर पर 15 से 30 दिनों में बनता है। मंज़ूरी मिलते ही e-आधार डाउनलोड किया जा सकता है।",
      tips: [
        "वही मोबाइल नंबर जोड़ें जो आप वाकई इस्तेमाल करते हैं — हर ऑनलाइन आधार सेवा का OTP उसी पर आता है।",
        "e-आधार का प्रिंटआउट हर जगह मान्य है। प्लास्टिक या लैमिनेटेड कार्ड के लिए किसी को पैसे देने की ज़रूरत नहीं।",
        "अपना आधार OTP किसी को न बताएँ — चाहे वह बैंक या सरकार का नाम ही क्यों न ले।",
      ],
    },
    links: [
      { label: "UIDAI official website", labelHi: "UIDAI आधिकारिक वेबसाइट", url: "https://uidai.gov.in" },
      { label: "myAadhaar — book appointment, download, update", labelHi: "myAadhaar — अपॉइंटमेंट, डाउनलोड, अपडेट", url: "https://myaadhaar.uidai.gov.in" },
      { label: "Locate an enrolment centre", labelHi: "नामांकन केंद्र खोजें", url: "https://bhuvan-app3.nrsc.gov.in/aadhaar/" },
    ],
  },

  {
    slug: "ration-card",
    icon: "https://img.icons8.com/ios/50/1f1f1f/shopping-basket-2.png",
    en: {
      name: "Ration Card",
      tagline: "Subsidised food grain for your household",
      about:
        "A ration card lets your family buy wheat, rice and other essentials at subsidised rates from the fair price shop. It is also accepted as address proof for many other applications. In Maharashtra it is issued by the Food, Civil Supplies and Consumer Protection Department.",
      whoFor:
        "Any household in Maharashtra that does not already hold a ration card. The category you receive — Antyodaya (AAY), Priority Household (PHH) or above-poverty-line — depends on your annual family income.",
      needed: [
        "Aadhaar of every family member — this is compulsory",
        "Proof of residence — electricity bill, rent agreement, or a Panchayat certificate",
        "Income proof or self-declaration of annual family income",
        "Passport-size photograph of the head of the household",
        "If you moved from another place: the surrender certificate for your old ration card",
      ],
      online: [
        "Open the Aaple Sarkar service portal and register with your mobile number, or log in if you already have an account.",
        "Choose the Food and Civil Supplies Department, then 'New Ration Card'.",
        "Fill in the family details exactly as they appear on each member's Aadhaar — a spelling mismatch is the most common reason for rejection.",
        "Upload scans of the documents listed above.",
        "Submit and write down the application reference number.",
        "Track progress with that number. Once approved, the card can be collected or downloaded from the RCMS portal.",
      ],
      offline: [
        "Collect the application form from the Tehsil or Taluka food office, or from the Gram Panchayat office.",
        "Attach photocopies of the documents and the photograph, and submit it at the rationing office.",
        "Keep the receipt — the local inspector will visit for verification before the card is issued.",
      ],
      fee: "Applying is free. A small charge may apply for printing the card itself.",
      time: "Usually 15 to 30 working days, including the home verification visit.",
      tips: [
        "Every member's name must match their Aadhaar letter for letter, including the surname order.",
        "A new baby or a new bride is added using the same portal — you do not need a fresh card, only a member addition.",
        "If you have moved into the village, surrender the old card first. Two active cards for one family is an offence.",
      ],
    },
    hi: {
      name: "राशन कार्ड",
      tagline: "आपके परिवार के लिए रियायती दर पर अनाज",
      about:
        "राशन कार्ड से आपका परिवार उचित मूल्य की दुकान से गेहूँ, चावल और अन्य ज़रूरी सामान रियायती दर पर ले सकता है। यह कई जगह पते के प्रमाण के रूप में भी मान्य है। महाराष्ट्र में यह अन्न, नागरी पुरवठा व ग्राहक संरक्षण विभाग जारी करता है।",
      whoFor:
        "महाराष्ट्र का कोई भी परिवार जिसके पास पहले से राशन कार्ड नहीं है। कौन-सी श्रेणी मिलेगी — अंत्योदय (AAY), प्राथमिक परिवार (PHH) या ऊपरी श्रेणी — यह आपकी वार्षिक पारिवारिक आय पर निर्भर करता है।",
      needed: [
        "परिवार के हर सदस्य का आधार — यह अनिवार्य है",
        "निवास का प्रमाण — बिजली बिल, किराया करार, या पंचायत प्रमाणपत्र",
        "आय प्रमाण या वार्षिक पारिवारिक आय का स्वयं-घोषणापत्र",
        "परिवार के मुखिया का पासपोर्ट आकार का फ़ोटो",
        "यदि आप कहीं और से आए हैं: पुराने राशन कार्ड का समर्पण प्रमाणपत्र",
      ],
      online: [
        "आपले सरकार सेवा पोर्टल खोलें और मोबाइल नंबर से पंजीकरण करें, या खाता हो तो लॉग इन करें।",
        "अन्न व नागरी पुरवठा विभाग चुनें, फिर 'नया राशन कार्ड'।",
        "परिवार की जानकारी ठीक वैसी भरें जैसी हर सदस्य के आधार पर है — वर्तनी का अंतर ही अस्वीकृति का सबसे आम कारण है।",
        "ऊपर बताए दस्तऐवजों की स्कैन प्रति अपलोड करें।",
        "जमा करें और आवेदन क्रमांक लिख लें।",
        "उसी क्रमांक से स्थिति देखें। मंज़ूरी के बाद कार्ड कार्यालय से लें या RCMS पोर्टल से डाउनलोड करें।",
      ],
      offline: [
        "तहसील या तालुका पुरवठा कार्यालय, या ग्राम पंचायत कार्यालय से आवेदन फ़ॉर्म लें।",
        "दस्तऐवजों की छायाप्रति और फ़ोटो लगाकर रेशनिंग कार्यालय में जमा करें।",
        "पावती संभालकर रखें — कार्ड जारी होने से पहले निरीक्षक सत्यापन के लिए घर आएँगे।",
      ],
      fee: "आवेदन निःशुल्क है। कार्ड छपाई का मामूली शुल्क लग सकता है।",
      time: "आमतौर पर 15 से 30 कार्यदिवस, घर सत्यापन सहित।",
      tips: [
        "हर सदस्य का नाम आधार से अक्षरशः मेल खाना चाहिए, उपनाम के क्रम सहित।",
        "नवजात शिशु या नई बहू का नाम इसी पोर्टल से जोड़ा जाता है — नया कार्ड नहीं, केवल सदस्य वृद्धि करनी होती है।",
        "गाँव में नए आए हैं तो पहले पुराना कार्ड समर्पित करें। एक परिवार के दो चालू कार्ड रखना अपराध है।",
      ],
    },
    links: [
      { label: "Aaple Sarkar service portal", labelHi: "आपले सरकार सेवा पोर्टल", url: "https://aaplesarkar.mahaonline.gov.in" },
      { label: "Maharashtra Ration Card Management (RCMS)", labelHi: "महाराष्ट्र राशन कार्ड प्रणाली (RCMS)", url: "https://rcms.mahafood.gov.in" },
      { label: "Food & Civil Supplies Department", labelHi: "अन्न व नागरी पुरवठा विभाग", url: "https://mahafood.gov.in" },
      { label: "National Food Security Portal", labelHi: "राष्ट्रीय खाद्य सुरक्षा पोर्टल", url: "https://nfsa.gov.in" },
    ],
  },

  {
    slug: "voter-id",
    icon: "https://img.icons8.com/ios/50/1f1f1f/ballot.png",
    en: {
      name: "Voter ID (EPIC)",
      tagline: "Your right to vote, and a widely accepted ID",
      about:
        "The Elector's Photo Identity Card lets you vote in Panchayat, Assembly and Lok Sabha elections. It is issued free by the Election Commission of India and is accepted as identity and address proof almost everywhere.",
      whoFor:
        "Any Indian citizen who is 18 or older on the qualifying date and normally lives in this village. You may be registered in only one constituency.",
      needed: [
        "One passport-size photograph",
        "Age proof — birth certificate, school leaving certificate, or Aadhaar",
        "Address proof — ration card, electricity bill, bank passbook, or Aadhaar",
        "Aadhaar number (optional, but it speeds up verification)",
      ],
      online: [
        "Open the Voters' Service Portal and create an account with your mobile number.",
        "Choose 'New registration for general electors' — this is Form 6.",
        "Fill in your name, date of birth, a relative's name, and your full village address.",
        "Upload the photograph and the age and address proofs.",
        "Check the preview carefully, then submit and save the reference number.",
        "The Booth Level Officer (BLO) will visit to verify. After approval you can download the e-EPIC from the same portal, and the printed card is posted to you.",
      ],
      offline: [
        "Get Form 6 from the Booth Level Officer, the Gram Panchayat office, or the Tehsil election office.",
        "Fill it in and attach the photograph with copies of your age and address proof.",
        "Hand it to the BLO or the Electoral Registration Officer and keep the acknowledgement.",
      ],
      fee: "Completely free. Nobody is authorised to charge you for a voter ID at any stage.",
      time: "About a month — roughly two weeks for BLO verification and two more for approval and dispatch. The e-EPIC is usually available within a day of approval.",
      tips: [
        "Use Form 8 to correct a spelling mistake, change your address, or replace a lost card.",
        "You can apply three months before turning 18, so that you are on the roll as soon as you are eligible.",
        "Check whether your name is already on the roll before applying again — duplicate entries get deleted.",
      ],
    },
    hi: {
      name: "मतदाता पहचान पत्र (EPIC)",
      tagline: "आपका मत देने का अधिकार, और एक मान्य पहचान पत्र",
      about:
        "मतदाता फ़ोटो पहचान पत्र से आप पंचायत, विधानसभा और लोकसभा चुनाव में मत दे सकते हैं। यह भारत निर्वाचन आयोग निःशुल्क जारी करता है और लगभग हर जगह पहचान व पते के प्रमाण के रूप में मान्य है।",
      whoFor:
        "कोई भी भारतीय नागरिक जो निर्धारित तिथि पर 18 वर्ष या उससे अधिक का हो और इसी गाँव में सामान्यतः रहता हो। आप केवल एक ही निर्वाचन क्षेत्र में पंजीकृत हो सकते हैं।",
      needed: [
        "एक पासपोर्ट आकार का फ़ोटो",
        "आयु प्रमाण — जन्म प्रमाणपत्र, स्कूल छोड़ने का प्रमाणपत्र, या आधार",
        "पते का प्रमाण — राशन कार्ड, बिजली बिल, बैंक पासबुक, या आधार",
        "आधार संख्या (वैकल्पिक, पर इससे सत्यापन जल्दी होता है)",
      ],
      online: [
        "मतदाता सेवा पोर्टल खोलें और मोबाइल नंबर से खाता बनाएँ।",
        "'सामान्य मतदाता के लिए नया पंजीकरण' चुनें — यही फ़ॉर्म 6 है।",
        "अपना नाम, जन्म तिथि, किसी परिजन का नाम और गाँव का पूरा पता भरें।",
        "फ़ोटो तथा आयु और पते के प्रमाण अपलोड करें।",
        "पूर्वावलोकन ध्यान से जाँचें, फिर जमा करें और संदर्भ क्रमांक सुरक्षित रखें।",
        "बूथ लेवल अधिकारी (BLO) सत्यापन के लिए आएँगे। मंज़ूरी के बाद उसी पोर्टल से e-EPIC डाउनलोड करें; छपा कार्ड डाक से आता है।",
      ],
      offline: [
        "फ़ॉर्म 6 बूथ लेवल अधिकारी, ग्राम पंचायत कार्यालय, या तहसील निर्वाचन कार्यालय से लें।",
        "उसे भरकर फ़ोटो और आयु व पते के प्रमाण की प्रति लगाएँ।",
        "BLO या निर्वाचक रजिस्ट्रीकरण अधिकारी को दें और पावती रखें।",
      ],
      fee: "पूरी तरह निःशुल्क। मतदाता पहचान पत्र के लिए किसी भी चरण पर शुल्क लेने का अधिकार किसी को नहीं है।",
      time: "लगभग एक महीना — करीब दो सप्ताह BLO सत्यापन और दो सप्ताह मंज़ूरी व डाक में। e-EPIC आमतौर पर मंज़ूरी के एक दिन के भीतर मिल जाता है।",
      tips: [
        "वर्तनी सुधार, पता बदलने, या खोया कार्ड फिर से पाने के लिए फ़ॉर्म 8 भरें।",
        "18 वर्ष के होने से तीन महीने पहले आवेदन कर सकते हैं, ताकि पात्र होते ही नाम सूची में आ जाए।",
        "दोबारा आवेदन से पहले देख लें कि नाम पहले से सूची में तो नहीं — दोहरी प्रविष्टियाँ हटा दी जाती हैं।",
      ],
    },
    links: [
      { label: "Voters' Service Portal (ECI)", labelHi: "मतदाता सेवा पोर्टल (ECI)", url: "https://voters.eci.gov.in" },
    ],
  },

  {
    slug: "birth-certificate",
    icon: "https://img.icons8.com/ios/50/1f1f1f/baby.png",
    en: {
      name: "Birth Certificate",
      tagline: "The first and most important record of a child",
      about:
        "A birth certificate proves a child's name, date of birth and parentage. It is required for school admission, Aadhaar, passport, and almost every government scheme. Registering a birth is compulsory by law, and for a village birth the Gram Panchayat is the registrar.",
      whoFor:
        "Every child born in the village. The parents, or the head of the household, must report the birth.",
      needed: [
        "Proof of birth from the hospital, or a declaration from the midwife or parents for a home birth",
        "Aadhaar of both parents",
        "Parents' marriage certificate, where available",
        "Address proof of the parents",
      ],
      online: [
        "Open the Civil Registration System portal and register as a general public user.",
        "Choose 'Birth' registration and select Maharashtra, this district and this Gram Panchayat.",
        "Fill in the date and place of birth, the child's name, and both parents' details.",
        "Upload the proof of birth and the parents' identity documents.",
        "Submit and note the reference number.",
        "The registrar at the Panchayat verifies it. Once approved, download the certificate from the portal or collect it from the office.",
      ],
      offline: [
        "Report the birth at the Gram Panchayat office within 21 days, with the hospital's proof of birth.",
        "Fill in the birth reporting form and give the parents' documents.",
        "Collect the certificate from the same office once the entry is registered.",
      ],
      fee: "Registration within 21 days is free. Late registration attracts a late fee, which rises the longer you wait.",
      time: "Usually about 7 to 21 days after the record is verified.",
      tips: [
        "Register within 21 days if you possibly can — after that the process gets steadily harder.",
        "Between 21 and 30 days a late fee applies; between 30 days and one year you need written permission from the district registrar and an affidavit; after one year a magistrate's order is required.",
        "You can register the birth first and add the child's name later, so do not delay while choosing a name.",
        "Check every spelling before approving. Correcting a name later is far more work than getting it right now.",
      ],
    },
    hi: {
      name: "जन्म प्रमाणपत्र",
      tagline: "बच्चे का पहला और सबसे ज़रूरी दस्तऐवज",
      about:
        "जन्म प्रमाणपत्र बच्चे का नाम, जन्म तिथि और माता-पिता का प्रमाण है। स्कूल में प्रवेश, आधार, पासपोर्ट और लगभग हर सरकारी योजना के लिए यह ज़रूरी है। जन्म का पंजीकरण कानूनन अनिवार्य है, और गाँव में हुए जन्म के लिए ग्राम पंचायत ही रजिस्ट्रार है।",
      whoFor: "गाँव में जन्मा हर बच्चा। माता-पिता या परिवार के मुखिया को जन्म की सूचना देनी होती है।",
      needed: [
        "अस्पताल से जन्म का प्रमाण, या घर पर जन्म हो तो दाई या माता-पिता का घोषणापत्र",
        "माता और पिता दोनों का आधार",
        "माता-पिता का विवाह प्रमाणपत्र, यदि उपलब्ध हो",
        "माता-पिता के पते का प्रमाण",
      ],
      online: [
        "नागरिक पंजीकरण प्रणाली (CRS) पोर्टल खोलें और सामान्य नागरिक के रूप में पंजीकरण करें।",
        "'जन्म' पंजीकरण चुनें और महाराष्ट्र, यह ज़िला तथा यह ग्राम पंचायत चुनें।",
        "जन्म की तिथि व स्थान, बच्चे का नाम, और माता-पिता का विवरण भरें।",
        "जन्म का प्रमाण और माता-पिता के पहचान दस्तऐवज अपलोड करें।",
        "जमा करें और संदर्भ क्रमांक लिख लें।",
        "पंचायत का रजिस्ट्रार सत्यापन करता है। मंज़ूरी के बाद पोर्टल से प्रमाणपत्र डाउनलोड करें या कार्यालय से लें।",
      ],
      offline: [
        "21 दिनों के भीतर अस्पताल के जन्म प्रमाण के साथ ग्राम पंचायत कार्यालय में सूचना दें।",
        "जन्म सूचना फ़ॉर्म भरें और माता-पिता के दस्तऐवज दें।",
        "प्रविष्टि दर्ज होने पर उसी कार्यालय से प्रमाणपत्र लें।",
      ],
      fee: "21 दिनों के भीतर पंजीकरण निःशुल्क है। देर से पंजीकरण पर विलंब शुल्क लगता है, जो जितनी देर उतना अधिक होता है।",
      time: "सत्यापन के बाद आमतौर पर 7 से 21 दिन।",
      tips: [
        "हो सके तो 21 दिनों के भीतर ही पंजीकरण कराएँ — उसके बाद प्रक्रिया लगातार कठिन होती जाती है।",
        "21 से 30 दिन के बीच विलंब शुल्क लगता है; 30 दिन से एक वर्ष के बीच ज़िला रजिस्ट्रार की लिखित अनुमति और शपथपत्र चाहिए; एक वर्ष के बाद दंडाधिकारी का आदेश आवश्यक है।",
        "पहले जन्म दर्ज कराकर बाद में बच्चे का नाम जुड़वाया जा सकता है — नाम तय करने के लिए देर न करें।",
        "मंज़ूरी देने से पहले हर वर्तनी जाँच लें। बाद में नाम सुधरवाना अभी सही कराने से कहीं अधिक कठिन है।",
      ],
    },
    links: [
      { label: "Civil Registration System (CRS)", labelHi: "नागरिक पंजीकरण प्रणाली (CRS)", url: "https://dc.crsorgi.gov.in/crs/" },
      { label: "Office of the Registrar General of India", labelHi: "भारत के महारजिस्ट्रार का कार्यालय", url: "https://crsorgi.gov.in" },
      { label: "Aaple Sarkar service portal", labelHi: "आपले सरकार सेवा पोर्टल", url: "https://aaplesarkar.mahaonline.gov.in" },
    ],
  },

  {
    slug: "death-certificate",
    icon: "https://img.icons8.com/ios/50/1f1f1f/certificate.png",
    en: {
      name: "Death Certificate",
      tagline: "Needed to settle property, pension and insurance",
      about:
        "A death certificate records the date, place and cause of death. The family needs it to claim insurance and pension, to transfer land or a bank account, and to update the ration card. As with births, the Gram Panchayat is the registrar for a death in the village.",
      whoFor:
        "The nearest relative of the deceased, or the head of the household. Registration is compulsory by law.",
      needed: [
        "Medical certificate of the cause of death from the hospital or doctor",
        "Aadhaar or other identity proof of the deceased",
        "Identity proof of the person applying, and their relationship to the deceased",
        "Receipt or certificate from the cremation or burial ground",
      ],
      online: [
        "Open the Civil Registration System portal and register as a general public user.",
        "Choose 'Death' registration and select Maharashtra, this district and this Gram Panchayat.",
        "Fill in the deceased's name, date and place of death, age and cause of death.",
        "Upload the medical certificate and the identity documents.",
        "Submit and note the reference number.",
        "After the registrar verifies the entry, download the certificate or collect it from the Panchayat office.",
      ],
      offline: [
        "Report the death at the Gram Panchayat office within 21 days.",
        "Submit the death reporting form with the medical certificate and identity proofs.",
        "Collect the certificate once the entry is registered.",
      ],
      fee: "Registration within 21 days is free. A late fee applies after that.",
      time: "Usually 7 to 21 days after verification.",
      tips: [
        "Ask for at least three or four certified copies at the same time — banks, insurers and the land records office each keep one.",
        "The same escalating rules as births apply for late registration: a fee after 21 days, district registrar's permission after 30 days, and a magistrate's order after one year.",
        "Once you have the certificate, remember to remove the name from the ration card and apply for any widow or family pension you are entitled to.",
      ],
    },
    hi: {
      name: "मृत्यु प्रमाणपत्र",
      tagline: "संपत्ति, पेंशन और बीमा के निपटारे के लिए आवश्यक",
      about:
        "मृत्यु प्रमाणपत्र में मृत्यु की तिथि, स्थान और कारण दर्ज होता है। बीमा और पेंशन का दावा करने, ज़मीन या बैंक खाता हस्तांतरित करने, और राशन कार्ड सुधारने के लिए परिवार को यह चाहिए। जन्म की तरह, गाँव में हुई मृत्यु के लिए ग्राम पंचायत ही रजिस्ट्रार है।",
      whoFor: "मृतक का निकटतम संबंधी या परिवार का मुखिया। पंजीकरण कानूनन अनिवार्य है।",
      needed: [
        "अस्पताल या डॉक्टर से मृत्यु के कारण का चिकित्सा प्रमाणपत्र",
        "मृतक का आधार या अन्य पहचान प्रमाण",
        "आवेदक का पहचान प्रमाण और मृतक से उसका संबंध",
        "श्मशान या कब्रिस्तान की रसीद या प्रमाणपत्र",
      ],
      online: [
        "नागरिक पंजीकरण प्रणाली (CRS) पोर्टल खोलें और सामान्य नागरिक के रूप में पंजीकरण करें।",
        "'मृत्यु' पंजीकरण चुनें और महाराष्ट्र, यह ज़िला तथा यह ग्राम पंचायत चुनें।",
        "मृतक का नाम, मृत्यु की तिथि व स्थान, आयु और मृत्यु का कारण भरें।",
        "चिकित्सा प्रमाणपत्र और पहचान दस्तऐवज अपलोड करें।",
        "जमा करें और संदर्भ क्रमांक लिख लें।",
        "रजिस्ट्रार के सत्यापन के बाद प्रमाणपत्र डाउनलोड करें या पंचायत कार्यालय से लें।",
      ],
      offline: [
        "21 दिनों के भीतर ग्राम पंचायत कार्यालय में मृत्यु की सूचना दें।",
        "मृत्यु सूचना फ़ॉर्म चिकित्सा प्रमाणपत्र और पहचान प्रमाणों के साथ जमा करें।",
        "प्रविष्टि दर्ज होने पर प्रमाणपत्र लें।",
      ],
      fee: "21 दिनों के भीतर पंजीकरण निःशुल्क। उसके बाद विलंब शुल्क लगता है।",
      time: "सत्यापन के बाद आमतौर पर 7 से 21 दिन।",
      tips: [
        "एक साथ कम से कम तीन-चार प्रमाणित प्रतियाँ माँग लें — बैंक, बीमा कंपनी और भूमि अभिलेख कार्यालय सबको एक-एक चाहिए।",
        "देर से पंजीकरण पर जन्म जैसे ही नियम लागू होते हैं: 21 दिन बाद शुल्क, 30 दिन बाद ज़िला रजिस्ट्रार की अनुमति, और एक वर्ष बाद दंडाधिकारी का आदेश।",
        "प्रमाणपत्र मिलने पर राशन कार्ड से नाम हटवाना और विधवा या पारिवारिक पेंशन के लिए आवेदन करना न भूलें।",
      ],
    },
    links: [
      { label: "Civil Registration System (CRS)", labelHi: "नागरिक पंजीकरण प्रणाली (CRS)", url: "https://dc.crsorgi.gov.in/crs/" },
      { label: "Office of the Registrar General of India", labelHi: "भारत के महारजिस्ट्रार का कार्यालय", url: "https://crsorgi.gov.in" },
      { label: "Aaple Sarkar service portal", labelHi: "आपले सरकार सेवा पोर्टल", url: "https://aaplesarkar.mahaonline.gov.in" },
    ],
  },

  {
    slug: "property-tax-receipt",
    icon: "https://img.icons8.com/ios/50/1f1f1f/home--v1.png",
    en: {
      name: "Property Tax Receipt",
      tagline: "Proof that the house tax on your property is paid",
      about:
        "In a village, property tax — gharpatti — is assessed and collected by the Gram Panchayat itself, not by any state website. The receipt proves your dues are cleared, and the Namuna 8 extract from the Panchayat's assessment register shows the property is recorded in your name. Both are commonly asked for when selling property, applying for a loan, or getting a building permission.",
      whoFor: "Anyone who owns a house or land within the Gram Panchayat limits.",
      needed: [
        "Your property or house number, from an earlier receipt if you have one",
        "Identity proof of the owner",
        "Proof of ownership — sale deed, 7/12 extract, or the earlier tax receipt",
      ],
      online: [
        "Village property tax is handled at the Panchayat office, so there is usually no separate website for it. Ask at the office first.",
        "For land ownership records, the 7/12 and 8-A extracts are available online from the Maharashtra land records portal.",
        "Be careful of private websites that offer to pay 'gram panchayat property tax' for you. Many are not government sites and charge a commission.",
      ],
      offline: [
        "Visit the Gram Panchayat office with your property or house number.",
        "The clerk will look up the assessment register and tell you what is due for the year.",
        "Pay the amount and insist on a stamped, signed receipt — take a photo of it before you leave.",
        "If you need proof of ownership, ask separately for the Namuna 8 extract.",
      ],
      fee: "The tax depends on the size, type and use of the property. A small fee may be charged for a copy of the Namuna 8 extract.",
      time: "The receipt is given the same day you pay. An extract is usually ready within a few days.",
      tips: [
        "Keep every year's receipt together. An unbroken run of receipts is strong evidence of possession.",
        "Pay before the year ends to avoid a penalty on the arrears.",
        "If the property has passed to you from a parent, get the name changed in the assessment register first, otherwise the receipt will still be in the old name.",
      ],
      contactFirst: true,
    },
    hi: {
      name: "संपत्ति कर रसीद (घरपट्टी)",
      tagline: "आपकी संपत्ति का कर चुकाने का प्रमाण",
      about:
        "गाँव में संपत्ति कर — घरपट्टी — का निर्धारण और वसूली ग्राम पंचायत स्वयं करती है, किसी राज्य वेबसाइट से नहीं। रसीद प्रमाण है कि आपका बकाया चुका है, और पंचायत के आकारणी रजिस्टर से मिलने वाला नमुना 8 उतारा दिखाता है कि संपत्ति आपके नाम दर्ज है। संपत्ति बेचते समय, ऋण लेते समय, या बांधकाम परवानगी के लिए दोनों माँगे जाते हैं।",
      whoFor: "ग्राम पंचायत की सीमा में जिसका भी घर या ज़मीन है।",
      needed: [
        "आपका संपत्ति या घर क्रमांक, पुरानी रसीद से मिल जाएगा",
        "मालिक का पहचान प्रमाण",
        "मालिकी का प्रमाण — खरेदीखत, 7/12 उतारा, या पुरानी कर रसीद",
      ],
      online: [
        "गाँव का संपत्ति कर पंचायत कार्यालय में ही देखा जाता है, इसलिए उसके लिए अलग वेबसाइट आमतौर पर नहीं होती। पहले कार्यालय में पूछें।",
        "ज़मीन की मालिकी के अभिलेख — 7/12 और 8-अ उतारा — महाराष्ट्र भूमि अभिलेख पोर्टल से ऑनलाइन मिलते हैं।",
        "'ग्राम पंचायत संपत्ति कर' भरने की सुविधा देने वाली निजी वेबसाइटों से सावधान रहें। कई सरकारी नहीं हैं और कमीशन लेती हैं।",
      ],
      offline: [
        "अपना संपत्ति या घर क्रमांक लेकर ग्राम पंचायत कार्यालय जाएँ।",
        "लिपिक आकारणी रजिस्टर देखकर बताएँगे कि इस वर्ष कितना बकाया है।",
        "राशि जमा करें और मुहर व हस्ताक्षर वाली रसीद अवश्य लें — निकलने से पहले उसका फ़ोटो ले लें।",
        "मालिकी का प्रमाण चाहिए तो नमुना 8 उतारा अलग से माँगें।",
      ],
      fee: "कर संपत्ति के आकार, प्रकार और उपयोग पर निर्भर करता है। नमुना 8 उतारे की प्रति का मामूली शुल्क लग सकता है।",
      time: "रसीद उसी दिन मिल जाती है। उतारा आमतौर पर कुछ दिनों में तैयार होता है।",
      tips: [
        "हर वर्ष की रसीद संभालकर एक साथ रखें। लगातार रसीदों की श्रृंखला कब्ज़े का मज़बूत प्रमाण है।",
        "वर्ष समाप्त होने से पहले भुगतान करें, ताकि बकाया पर दंड न लगे।",
        "संपत्ति माता-पिता से आपके नाम आई है तो पहले आकारणी रजिस्टर में नाम बदलवाएँ, वरना रसीद पुराने नाम पर ही बनती रहेगी।",
      ],
      contactFirst: true,
    },
    links: [
      { label: "Maharashtra land records (7/12, 8-A)", labelHi: "महाराष्ट्र भूमि अभिलेख (7/12, 8-अ)", url: "https://bhulekh.mahabhumi.gov.in" },
      { label: "Rural Development Department, Maharashtra", labelHi: "ग्रामविकास विभाग, महाराष्ट्र", url: "https://rdd.maharashtra.gov.in" },
      { label: "eGramSwaraj — Panchayat accounts", labelHi: "eGramSwaraj — पंचायत लेखा", url: "https://egramswaraj.gov.in" },
    ],
  },
];

export const guideBySlug = (slug) => DOCUMENT_GUIDES.find((guide) => guide.slug === slug);

/** Pick the language variant, matching the toggle used across the app. */
export const guideCopy = (guide, language) => (language == "english" ? guide.en : guide.hi);
