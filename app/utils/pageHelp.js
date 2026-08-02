/**
 * Plain-language help for each page, shown by the "?" button in the header.
 *
 * Written for someone using this site for the first time, on a phone, who may
 * never have used a government website before. Short sentences, no jargon, and
 * every entry says what the page is FOR before it says how to use it.
 */

const HELP = {
  "/": {
    en: {
      title: "Home",
      what: "The starting point. It explains what PanchayatX is and why it was built.",
      steps: [
        "Tap 'Go to my Panchayat' to open your village's own page — the team, facilities, records and the office helpline.",
        "Read below the button to understand what this website does for you.",
        "Use the menu at the top (or the ☰ button on a phone) to move between sections at any time.",
        "Switch between English and Hindi any time using the EN button at the top right.",
      ],
      note: "You can read everything here without logging in. You only need an account to comment, vote or raise a complaint.",
    },
    hi: {
      title: "मुख्य पृष्ठ",
      what: "यहीं से शुरुआत होती है। यह बताता है कि PanchayatX क्या है और इसे क्यों बनाया गया।",
      steps: [
        "'मेरी पंचायत देखें' पर टैप करके अपने गाँव का पृष्ठ खोलें — कार्यकारिणी, सुविधाएँ, अभिलेख और कार्यालय हेल्पलाइन।",
        "बटन के नीचे पढ़ें कि यह वेबसाइट आपके लिए क्या करती है।",
        "ऊपर के मेन्यू (फ़ोन पर ☰ बटन) से कभी भी एक भाग से दूसरे भाग में जाएँ।",
        "ऊपर दाईं ओर EN बटन से कभी भी अंग्रेज़ी और हिंदी बदल सकते हैं।",
      ],
      note: "यहाँ सब कुछ बिना लॉग इन किए पढ़ा जा सकता है। टिप्पणी करने, मत देने या शिकायत दर्ज करने के लिए ही खाता चाहिए।",
    },
  },

  "/community": {
    en: {
      title: "Community",
      what: "Official news from your Panchayat — new work, meetings and announcements. New posts stay on the feed for seven days.",
      steps: [
        "Scroll to read the updates. Tap a photo or video to see it properly.",
        "Tap Like if the update is useful to you. Nobody can see who liked a post, only how many did.",
        "Write in the comment box at the bottom of a post to ask a question or reply.",
        "Tap a commenter's name or photo to see who they are.",
        "If a post has a poll, tap your choice. Tap it again to take your vote back.",
        "Use 'Posted within' and 'Sort by' at the top to find older updates.",
      ],
      note: "Only the Panchayat office can publish posts here. Any villager can like, comment and vote.",
    },
    hi: {
      title: "समुदाय",
      what: "आपकी पंचायत की आधिकारिक ख़बरें — नए काम, बैठकें और घोषणाएँ। नई पोस्ट सात दिन तक दिखती हैं।",
      steps: [
        "स्क्रॉल करके अपडेट पढ़ें। फ़ोटो या वीडियो पर टैप करके उसे ठीक से देखें।",
        "अपडेट काम का लगे तो लाइक पर टैप करें। किसने लाइक किया यह कोई नहीं देख सकता, केवल कितनों ने किया यह दिखता है।",
        "पोस्ट के नीचे टिप्पणी बॉक्स में लिखकर प्रश्न पूछें या उत्तर दें।",
        "टिप्पणी करने वाले के नाम या फ़ोटो पर टैप करके देखें कि वे कौन हैं।",
        "पोस्ट में मतदान हो तो अपना विकल्प चुनें। दोबारा टैप करने पर मत वापस हो जाता है।",
        "ऊपर 'कब की पोस्ट' और 'क्रम' से पुरानी पोस्ट ढूँढें।",
      ],
      note: "यहाँ केवल पंचायत कार्यालय पोस्ट कर सकता है। लाइक, टिप्पणी और मतदान कोई भी ग्रामवासी कर सकता है।",
    },
  },

  "/documents": {
    en: {
      title: "Documents",
      what: "Two things live here: guides for documents you need to obtain, and circulars the Panchayat office has published.",
      steps: [
        "Tap the box at the top if you need an Aadhaar, ration card, voter ID, birth or death certificate, or a property tax receipt.",
        "Each guide tells you which papers to carry, what it costs, how long it takes, and gives the official website link.",
        "Below that are the office's own published records. Tap one to open or download it.",
      ],
      note: "Every link in the guides is a real government website. Never pay an agent for a service that is free.",
    },
    hi: {
      title: "दस्तऐवज",
      what: "यहाँ दो चीज़ें हैं: जो दस्तऐवज आपको बनवाने हैं उनका मार्गदर्शन, और पंचायत कार्यालय द्वारा प्रकाशित परिपत्र।",
      steps: [
        "आधार, राशन कार्ड, मतदाता पहचान पत्र, जन्म या मृत्यु प्रमाणपत्र, या संपत्ति कर रसीद चाहिए तो ऊपर वाले बॉक्स पर टैप करें।",
        "हर मार्गदर्शन बताता है कि कौन-से कागज़ ले जाएँ, कितना खर्च होगा, कितना समय लगेगा, और आधिकारिक वेबसाइट का लिंक देता है।",
        "उसके नीचे कार्यालय के प्रकाशित अभिलेख हैं। किसी पर टैप करके उसे खोलें या डाउनलोड करें।",
      ],
      note: "मार्गदर्शन में दिया हर लिंक असली सरकारी वेबसाइट का है। निःशुल्क सेवा के लिए किसी एजेंट को पैसे न दें।",
    },
  },

  "/documents/apply": {
    en: {
      title: "Document guides",
      what: "Step-by-step help for the six documents villagers ask about most.",
      steps: [
        "Tap the document you need.",
        "Read 'Papers to keep ready' first and gather everything before you start.",
        "Then follow either the online steps or the in-person steps — whichever suits you.",
        "If anything is unclear, call the Panchayat office using the button at the bottom of the guide.",
      ],
      note: "Most of these services are free. Registering a birth or death within 21 days costs nothing at all.",
    },
    hi: {
      title: "दस्तऐवज मार्गदर्शन",
      what: "जिन छह दस्तऐवजों के बारे में ग्रामवासी सबसे ज़्यादा पूछते हैं, उनका चरण-दर-चरण मार्गदर्शन।",
      steps: [
        "जो दस्तऐवज चाहिए उस पर टैप करें।",
        "पहले 'कौन-से कागज़ तैयार रखें' पढ़ें और शुरू करने से पहले सब इकट्ठा कर लें।",
        "फिर ऑनलाइन या कार्यालय वाले चरणों में से जो सुविधाजनक हो, वह अपनाएँ।",
        "कुछ समझ न आए तो मार्गदर्शन के नीचे दिए बटन से पंचायत कार्यालय को कॉल करें।",
      ],
      note: "इनमें से अधिकांश सेवाएँ निःशुल्क हैं। जन्म या मृत्यु का पंजीकरण 21 दिनों के भीतर पूरी तरह मुफ़्त है।",
    },
  },

  "/complaints": {
    en: {
      title: "My complaints",
      what: "Everything you have reported to the Panchayat, and what has happened to it since.",
      steps: [
        "Each row shows a complaint number like CMP-2026-000042. Quote that number when you visit the office.",
        "The status tells you where it stands: Submitted, Acknowledged, In progress, Resolved or Rejected.",
        "Tap a photo to see it full size.",
        "While a complaint still says 'Submitted' you can edit or withdraw it.",
        "Once the office acknowledges it, it locks — so the staff working on it always see what you first reported.",
        "Use + New complaint, or the button in the corner of any page, to report something else.",
      ],
      note: "Only you can see your complaints. Panchayat staff see them on their own dashboard.",
    },
    hi: {
      title: "मेरी शिकायतें",
      what: "आपने पंचायत को जो भी बताया है, और उसका अब तक क्या हुआ — सब यहाँ है।",
      steps: [
        "हर पंक्ति में CMP-2026-000042 जैसा शिकायत क्रमांक होता है। कार्यालय जाते समय वही क्रमांक बताएँ।",
        "स्थिति बताती है कि काम कहाँ तक पहुँचा: दर्ज, स्वीकृत, कार्यवाही सुरू, निराकरण या अस्वीकृत।",
        "फ़ोटो पर टैप करके उसे पूरे आकार में देखें।",
        "जब तक शिकायत 'दर्ज' दिखती है, आप उसे बदल या वापस ले सकते हैं।",
        "कार्यालय के स्वीकार करते ही वह बंद हो जाती है — ताकि काम करने वालों को वही दिखे जो आपने पहले बताया था।",
        "कुछ और बताना हो तो '+ नई शिकायत' या किसी भी पृष्ठ के कोने वाले बटन का उपयोग करें।",
      ],
      note: "आपकी शिकायतें केवल आप देख सकते हैं। पंचायत कर्मचारी उन्हें अपने डैशबोर्ड पर देखते हैं।",
    },
  },

  "/admin/complaints": {
    en: {
      title: "Complaints dashboard",
      what: "Every complaint raised by villagers, with the contact details needed to follow one up.",
      steps: [
        "The tiles at the top show the whole workload. Tap one to filter by that status.",
        "Search by complaint number, title or the villager's email.",
        "Each row carries the villager's name, username, mobile number and email — tap the number to call them.",
        "Tap the thumbnails to see the photos or videos they attached.",
        "Use 'Change status' to move a complaint along and leave a note the villager will see.",
        "A note is required when rejecting, so the villager knows why.",
      ],
      note: "Every status change is recorded with your name and the time, and cannot be erased.",
    },
    hi: {
      title: "शिकायत डैशबोर्ड",
      what: "ग्रामवासियों की सभी शिकायतें, और आगे बात करने के लिए ज़रूरी संपर्क जानकारी।",
      steps: [
        "ऊपर की टाइलें कुल काम दिखाती हैं। किसी पर टैप करके उस स्थिति के अनुसार छाँटें।",
        "शिकायत क्रमांक, शीर्षक या ग्रामवासी के ईमेल से खोजें।",
        "हर पंक्ति में ग्रामवासी का नाम, उपयोगकर्ता नाम, मोबाइल नंबर और ईमेल है — नंबर पर टैप करके कॉल करें।",
        "उनके लगाए फ़ोटो या वीडियो देखने के लिए छोटी तस्वीरों पर टैप करें।",
        "'स्थिति बदलें' से शिकायत आगे बढ़ाएँ और ऐसी टिप्पणी लिखें जो ग्रामवासी को दिखेगी।",
        "अस्वीकार करते समय कारण लिखना अनिवार्य है, ताकि ग्रामवासी को पता चले क्यों।",
      ],
      note: "हर स्थिति परिवर्तन आपके नाम और समय के साथ दर्ज होता है और मिटाया नहीं जा सकता।",
    },
  },

  "/panchayat_funds": {
    en: {
      title: "Panchayat funds",
      what: "Scheme-wise fund receipt and expenditure — the same figures the Panchayat reports to the Government.",
      steps: [
        "Pick a financial year at the top, for example 2025-2026.",
        "Choose where the money came from: Govt. of India, State Govt. or Other.",
        "The five boxes show that year's totals; each card below is one scheme.",
        "Every card lists Expected Fund, Actual Fund Received, Previous Year Balance, Reverted / Surrendered Fund and Actual Expenditure.",
        "Where the office has added notes or papers, tap 'Details and documents'.",
        "Use Funds Charts to see the same numbers as pictures.",
      ],
      note: "These figures match the Government's Meri Panchayat app for Chandgaon (LGD code 170972). ₹0 means nothing was received or spent under that head that year. You do not need to log in.",
    },
    hi: {
      title: "पंचायत निधि",
      what: "योजना अनुसार निधि प्राप्ति व व्यय — वही आँकड़े जो पंचायत सरकार को देती है।",
      steps: [
        "ऊपर वित्तीय वर्ष चुनें, जैसे 2025-2026।",
        "चुनें कि पैसा कहाँ से आया: भारत सरकार, राज्य सरकार या अन्य।",
        "पाँच बॉक्स उस वर्ष का कुल जोड़ दिखाते हैं; नीचे हर कार्ड एक योजना है।",
        "हर कार्ड में अपेक्षित निधि, प्रत्यक्ष प्राप्त निधि, पिछले वर्ष का शेष, वापस/समर्पित निधि और प्रत्यक्ष व्यय दिया है।",
        "जहाँ कार्यालय ने टिप्पणी या कागज़ जोड़े हैं, वहाँ 'विवरण और दस्तऐवज' पर टैप करें।",
        "वही आँकड़े चित्रों में देखने के लिए 'निधि तक्ते' खोलें।",
      ],
      note: "ये आँकड़े चांदगांव (LGD कोड 170972) के लिए सरकार के मेरी पंचायत ऐप से मेल खाते हैं। ₹0 का अर्थ है उस वर्ष उस मद में कुछ प्राप्त या खर्च नहीं हुआ। लॉग इन की ज़रूरत नहीं।",
    },
  },

  "/panchayat_funds/charts": {
    en: {
      title: "Funds charts",
      what: "The same fund information as the Funds page, drawn as charts so trends are easier to see.",
      steps: [
        "Each chart compares spending across years or categories.",
        "Touch or hover on any bar or slice to see the exact amount.",
        "Go back to the Funds page for the detailed list of individual works.",
      ],
      note: "The figures come from the same records the office publishes — nothing here is an estimate.",
    },
    hi: {
      title: "निधि तक्ते",
      what: "निधि पृष्ठ वाली जानकारी ही, तक्तों के रूप में — ताकि रुझान आसानी से समझ आएँ।",
      steps: [
        "हर तक्ता वर्षों या श्रेणियों के बीच खर्च की तुलना करता है।",
        "किसी भी पट्टी या हिस्से को छूकर सही राशि देखें।",
        "अलग-अलग कामों की विस्तृत सूची के लिए निधि पृष्ठ पर लौटें।",
      ],
      note: "आँकड़े उन्हीं अभिलेखों से आते हैं जो कार्यालय प्रकाशित करता है — यहाँ कुछ भी अनुमान नहीं है।",
    },
  },

  "/nearby_services": {
    en: {
      title: "Nearby services",
      what: "A map of useful places around the village — schools, banks, ATMs, police, bus stand and more.",
      steps: [
        "Pick a category to show only that kind of place on the map.",
        "Tap a marker to see the name, distance and details.",
        "Pinch to zoom in and out, and drag to move the map.",
      ],
      note: "If a place is missing or wrong, tell the office using the complaint button so it can be corrected.",
    },
    hi: {
      title: "नज़दीकी सेवाएँ",
      what: "गाँव के आसपास की उपयोगी जगहों का नक्शा — विद्यालय, बैंक, एटीएम, पुलिस, बस स्टैंड और अन्य।",
      steps: [
        "कोई श्रेणी चुनकर नक्शे पर केवल उसी तरह की जगहें देखें।",
        "किसी चिह्न पर टैप करके नाम, दूरी और विवरण देखें।",
        "बड़ा-छोटा करने के लिए दो उंगलियों से खींचें, और नक्शा सरकाने के लिए उसे खिसकाएँ।",
      ],
      note: "कोई जगह छूट गई हो या ग़लत हो तो शिकायत बटन से कार्यालय को बताएँ, ताकि सुधार हो सके।",
    },
  },

  "/about": {
    en: {
      title: "About",
      what: "Details of your own village — who runs the Panchayat, the facilities available here, and how to contact the office.",
      steps: [
        "The village details and the Panchayat team are listed at the top.",
        "The facilities list shows what exists locally — toilets, schools, banks and so on.",
        "Below that, the three boxes open the village records — funds, documents and nearby services.",
        "At the bottom, tap the helpline number to call the Panchayat office directly.",
      ],
      note: "What this website itself is for is explained on the Home page.",
    },
    hi: {
      title: "पंचायत बद्दल",
      what: "आपके अपने गाँव की जानकारी — पंचायत कौन चलाता है, यहाँ कौन-सी सुविधाएँ हैं, और कार्यालय से कैसे संपर्क करें।",
      steps: [
        "गाँव की जानकारी और पंचायत कार्यकारिणी सबसे ऊपर दी गई है।",
        "सुविधाओं की सूची बताती है कि स्थानीय स्तर पर क्या उपलब्ध है — शौचालय, विद्यालय, बैंक इत्यादि।",
        "उसके नीचे तीन बॉक्स गाँव के अभिलेख खोलते हैं — निधि, दस्तऐवज और नज़दीकी सेवाएँ।",
        "सबसे नीचे हेल्पलाइन नंबर पर टैप करके सीधे पंचायत कार्यालय को कॉल करें।",
      ],
      note: "यह वेबसाइट स्वयं किसलिए है, यह मुख्य पृष्ठ पर बताया गया है।",
    },
  },

  "/login": {
    en: {
      title: "Log in",
      what: "Signing in lets you comment, vote in polls and raise complaints. Reading the site does not need an account.",
      steps: [
        "Type the email address you used when you created your account.",
        "Type your password. Tap the eye icon to check what you typed.",
        "Tap Login.",
        "No account yet? Use the Sign up link below the form.",
        "Forgotten your password? Use the 'Forgot password' link and follow the steps sent to your email.",
      ],
      note: "If you were signed in before and things stopped working, log out and log in once more.",
    },
    hi: {
      title: "लॉग इन",
      what: "लॉग इन करने पर आप टिप्पणी कर सकते हैं, मतदान में भाग ले सकते हैं और शिकायत दर्ज कर सकते हैं। केवल पढ़ने के लिए खाता ज़रूरी नहीं।",
      steps: [
        "वही ईमेल पता लिखें जो खाता बनाते समय दिया था।",
        "अपना पासवर्ड लिखें। आँख के चिह्न पर टैप करके जाँचें कि क्या लिखा है।",
        "'Login' दबाएँ।",
        "खाता नहीं है? नीचे दिए 'साइन अप' लिंक का उपयोग करें।",
        "पासवर्ड भूल गए? 'Forgot password' लिंक पर जाएँ और ईमेल पर आए चरणों का पालन करें।",
      ],
      note: "पहले लॉग इन थे और अब कुछ काम नहीं कर रहा, तो एक बार लॉग आउट करके फिर लॉग इन करें।",
    },
  },

  "/signup": {
    en: {
      title: "Create an account",
      what: "A free account, needed only to comment, vote or raise a complaint.",
      steps: [
        "Enter your full name and a working email address.",
        "Choose a username — 3 to 20 lowercase letters, numbers or underscores. It is checked as you type.",
        "Add a profile photo if you wish. This is optional.",
        "Choose a password you will remember.",
        "Tap to send the OTP, then type the six-digit code sent to your email.",
        "Submit. You can then log in with your email and password.",
      ],
      note: "Use an email you can open, since the OTP is sent there. Your mobile number can be added later from your profile page.",
    },
    hi: {
      title: "खाता बनाएँ",
      what: "निःशुल्क खाता, जो केवल टिप्पणी करने, मतदान करने या शिकायत दर्ज करने के लिए चाहिए।",
      steps: [
        "अपना पूरा नाम और चालू ईमेल पता भरें।",
        "उपयोगकर्ता नाम चुनें — 3 से 20 छोटे अक्षर, अंक या अंडरस्कोर। लिखते ही जाँच हो जाती है।",
        "चाहें तो प्रोफ़ाइल फ़ोटो जोड़ें। यह वैकल्पिक है।",
        "ऐसा पासवर्ड चुनें जो आपको याद रहे।",
        "OTP भेजने के लिए टैप करें, फिर ईमेल पर आया छह अंकों का कोड लिखें।",
        "जमा करें। इसके बाद ईमेल और पासवर्ड से लॉग इन करें।",
      ],
      note: "ऐसा ईमेल दें जिसे आप खोल सकें, क्योंकि OTP वहीं आता है। मोबाइल नंबर बाद में प्रोफ़ाइल पृष्ठ से जोड़ा जा सकता है।",
    },
  },

  "/edit": {
    en: {
      title: "Your profile",
      what: "Your name, photo and mobile number, as other villagers and the office see them.",
      steps: [
        "Tap the photo to change it.",
        "Correct your name or mobile number in the boxes.",
        "Tap Update to save. Your mobile number is how the office reaches you about a complaint.",
      ],
      note: "Your mobile number is shown only to Panchayat staff, never to other villagers.",
    },
    hi: {
      title: "आपकी प्रोफ़ाइल",
      what: "आपका नाम, फ़ोटो और मोबाइल नंबर, जैसा अन्य ग्रामवासी और कार्यालय देखते हैं।",
      steps: [
        "फ़ोटो बदलने के लिए उस पर टैप करें।",
        "बॉक्स में अपना नाम या मोबाइल नंबर सुधारें।",
        "सहेजने के लिए 'अपडेट' दबाएँ। शिकायत के बारे में कार्यालय आपसे इसी मोबाइल नंबर पर संपर्क करता है।",
      ],
      note: "आपका मोबाइल नंबर केवल पंचायत कर्मचारियों को दिखता है, अन्य ग्रामवासियों को कभी नहीं।",
    },
  },
};

const FALLBACK = {
  en: {
    title: "Using this site",
    what: "This is the official website of your Gram Panchayat.",
    steps: [
      "Use the menu at the top, or the ☰ button on a phone, to move between sections.",
      "Switch between English and Hindi with the EN button at the top right.",
      "Use the complaint button in the corner of the screen to report a problem in the village.",
    ],
    note: "Most pages can be read without logging in.",
  },
  hi: {
    title: "इस वेबसाइट का उपयोग",
    what: "यह आपकी ग्राम पंचायत की आधिकारिक वेबसाइट है।",
    steps: [
      "ऊपर के मेन्यू, या फ़ोन पर ☰ बटन से एक भाग से दूसरे भाग में जाएँ।",
      "ऊपर दाईं ओर EN बटन से अंग्रेज़ी और हिंदी बदलें।",
      "गाँव की किसी समस्या की सूचना देने के लिए स्क्रीन के कोने में दिए शिकायत बटन का उपयोग करें।",
    ],
    note: "अधिकांश पृष्ठ बिना लॉग इन किए पढ़े जा सकते हैं।",
  },
};

/**
 * Help for a path. Dynamic routes (a single work, a single guide) fall back to
 * their parent section's help rather than showing nothing.
 */
export const helpForPath = (pathname, language) => {
  const en = language == "english";
  const exact = HELP[pathname];
  if (exact) return en ? exact.en : exact.hi;

  const parent = Object.keys(HELP)
    .filter((key) => key !== "/" && pathname.startsWith(key))
    .sort((a, b) => b.length - a.length)[0];
  if (parent) return en ? HELP[parent].en : HELP[parent].hi;

  return en ? FALLBACK.en : FALLBACK.hi;
};
