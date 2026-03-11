"use client";

import { useGlobalContext } from "../context/context";

const AboutUsPara = () => {
  const { language } = useGlobalContext();
  return (
    <>
      <div className="w-full h-auto">
        <div className="w-[90%] mx-auto">
          <h5 className="w-full text-center py-4  ">
            <span className="border-b-2 border-black text-2xl">About Us</span>
          </h5>

          {language == "english" ? (
            <div className="w-full bg-gray-100 p-6">
              <h1 className="text-3xl font-bold text-center mb-4">
                Chandgaon Grampanchayat
              </h1>
              <p className="text-lg mb-6">
                The Grampanchayat of Chandgaon is a progressive rural
                administrative body dedicated to improving the quality of life
                for its residents. Committed to providing essential services and
                infrastructure, the Grampanchayat offers a wide range of
                facilities that cater to the diverse needs of the community. Key
                amenities include:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li className="mb-2">
                  <strong>Toilets:</strong> Clean and accessible public
                  restrooms are available at various locations throughout the
                  village, ensuring hygiene and convenience for all.
                </li>
                <li className="mb-2">
                  <strong>Parking Facilities:</strong> Designated parking areas
                  provide safe and organized spaces for vehicles, reducing
                  congestion and enhancing road safety.
                </li>
                <li className="mb-2">
                  <strong>Schools:</strong> The village hosts several
                  educational institutions, providing quality education and
                  fostering a bright future for the younger generation.
                </li>
                <li className="mb-2">
                  <strong>Anganwadis:</strong> These centers support early
                  childhood education and development, offering nutritional
                  meals, healthcare, and pre-school education for young
                  children.
                </li>
                <li className="mb-2">
                  <strong>Common Service Center:</strong> A hub for accessing
                  various government services and digital resources, making it
                  easier for residents to complete official tasks.
                </li>
                <li className="mb-2">
                  <strong>ATMs:</strong> Multiple ATMs are strategically located
                  across the village, providing convenient access to banking
                  services.
                </li>
                <li className="mb-2">
                  <strong>Police Station:</strong> The local police station
                  ensures law and order, providing a safe and secure environment
                  for the community.
                </li>
                <li className="mb-2">
                  <strong>Banks:</strong> The presence of banks facilitates
                  financial transactions and services, supporting economic
                  activities in the village.
                </li>
                <li className="mb-2">
                  <strong>Petrol Pump:</strong> A conveniently located petrol
                  pump provides fuel services for vehicles, supporting
                  transportation needs.
                </li>
                <li className="mb-2">
                  <strong>Railway Station:</strong> The nearby railway station
                  offers connectivity to various regions, facilitating travel
                  and trade.
                </li>
                <li className="mb-2">
                  <strong>Bus Stand:</strong> The bus stand serves as a central
                  point for public transportation, making commuting easy and
                  accessible.
                </li>
              </ul>
              <h2 className="text-2xl font-bold text-center mb-4">
                Digital Initiative: Mobile App Launch
              </h2>
              <p className="text-lg mb-6">
                In a bid to improve accessibility and convenience, the
                Grampanchayat of Chandgaon is launching a new mobile app. This
                app will provide comprehensive information about the village&apos;s
                facilities, including locations and details of toilets, parking
                areas, schools, Anganwadis, the Common Service Center, ATMs, the
                police station, banks, the petrol pump, the railway station, and
                the bus stand. The app will also offer updates on local events,
                announcements, and essential services, making it a valuable tool
                for residents and visitors alike.
              </p>
              <p className="text-lg">
                With this digital initiative, the Grampanchayat aims to promote
                transparency, improve communication, and make it easier for
                everyone to access vital information and services.
              </p>
            </div>
          ) : (
            <div className="w-full bg-gray-100 p-6">
              <h1 className="text-3xl font-bold text-center mb-4">
                चंदगांव ग्रामपंचायत
              </h1>
              <p className="text-lg mb-6">
                चंदगांव ग्रामपंचायत एक प्रगतिशील ग्रामीण प्रशासनिक संस्था है जो
                अपने निवासियों के जीवन की गुणवत्ता में सुधार के लिए समर्पित है।
                आवश्यक सेवाओं और अवसंरचना को प्रदान करने के प्रति प्रतिबद्ध,
                ग्रामपंचायत विविध समुदाय की आवश्यकताओं को पूरा करने वाली
                सुविधाओं की एक विस्तृत श्रृंखला प्रदान करती है। प्रमुख सुविधाओं
                में शामिल हैं:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li className="mb-2">
                  <strong>शौचालय:</strong> गाँव के विभिन्न स्थानों पर स्वच्छ और
                  सुलभ सार्वजनिक शौचालय उपलब्ध हैं, जो सभी के लिए स्वच्छता और
                  सुविधा सुनिश्चित करते हैं।
                </li>
                <li className="mb-2">
                  <strong>पार्किंग सुविधाएँ:</strong> निर्दिष्ट पार्किंग
                  क्षेत्रों में वाहनों के लिए सुरक्षित और संगठित स्थान प्रदान
                  किए जाते हैं, जिससे ट्रैफिक जाम कम होता है और सड़क सुरक्षा
                  बढ़ती है।
                </li>
                <li className="mb-2">
                  <strong>विद्यालय:</strong> गाँव में कई शैक्षिक संस्थान हैं, जो
                  गुणवत्तापूर्ण शिक्षा प्रदान करते हैं और युवा पीढ़ी के उज्जवल
                  भविष्य को बढ़ावा देते हैं।
                </li>
                <li className="mb-2">
                  <strong>आंगनवाड़ी:</strong> ये केंद्र प्रारंभिक बचपन की शिक्षा
                  और विकास का समर्थन करते हैं, पोषण युक्त भोजन, स्वास्थ्य
                  देखभाल, और प्री-स्कूल शिक्षा प्रदान करते हैं।
                </li>
                <li className="mb-2">
                  <strong>सामान्य सेवा केंद्र:</strong> विभिन्न सरकारी सेवाओं और
                  डिजिटल संसाधनों तक पहुँच के लिए एक केंद्र, जो निवासियों के लिए
                  आधिकारिक कार्यों को पूरा करना आसान बनाता है।
                </li>
                <li className="mb-2">
                  <strong>एटीएम:</strong> गाँव के विभिन्न स्थानों पर कई एटीएम
                  रणनीतिक रूप से स्थित हैं, जो बैंकिंग सेवाओं तक सुलभता प्रदान
                  करते हैं।
                </li>
                <li className="mb-2">
                  <strong>पुलिस स्टेशन:</strong> स्थानीय पुलिस स्टेशन कानून और
                  व्यवस्था सुनिश्चित करता है, जिससे समुदाय के लिए सुरक्षित और
                  सुरक्षित वातावरण प्रदान होता है।
                </li>
                <li className="mb-2">
                  <strong>बैंकों:</strong> बैंकों की उपस्थिति वित्तीय लेनदेन और
                  सेवाओं को सुगम बनाती है, गाँव में आर्थिक गतिविधियों का समर्थन
                  करती है।
                </li>
                <li className="mb-2">
                  <strong>पेट्रोल पंप:</strong> एक सुविधाजनक स्थिति में स्थित
                  पेट्रोल पंप वाहनों के लिए ईंधन सेवाएँ प्रदान करता है, परिवहन
                  की आवश्यकताओं का समर्थन करता है।
                </li>
                <li className="mb-2">
                  <strong>रेलवे स्टेशन:</strong> पास के रेलवे स्टेशन विभिन्न
                  क्षेत्रों के लिए कनेक्टिविटी प्रदान करता है, यात्रा और व्यापार
                  को सुगम बनाता है।
                </li>
                <li className="mb-2">
                  <strong>बस स्टैंड:</strong> बस स्टैंड सार्वजनिक परिवहन के लिए
                  एक केंद्रीय बिंदु के रूप में कार्य करता है, जिससे यात्रा करना
                  आसान और सुलभ होता है।
                </li>
              </ul>
              <h2 className="text-2xl font-bold text-center mb-4">
                डिजिटल पहल: मोबाइल ऐप लॉन्च
              </h2>
              <p className="text-lg mb-6">
                पहुँच और सुविधा में सुधार के लिए, चंदगांव ग्रामपंचायत एक नया
                मोबाइल ऐप लॉन्च कर रही है। यह ऐप गाँव की सुविधाओं के बारे में
                व्यापक जानकारी प्रदान करेगी, जिसमें शौचालय, पार्किंग क्षेत्र,
                विद्यालय, आंगनवाड़ी, सामान्य सेवा केंद्र, एटीएम, पुलिस स्टेशन,
                बैंक, पेट्रोल पंप, रेलवे स्टेशन, और बस स्टैंड के स्थान और विवरण
                शामिल हैं। ऐप स्थानीय घटनाओं, घोषणाओं और आवश्यक सेवाओं पर अपडेट
                भी प्रदान करेगा, जिससे निवासियों और आगंतुकों के लिए एक मूल्यवान
                उपकरण बन जाएगा।
              </p>
              <p className="text-lg">
                इस डिजिटल पहल के साथ, ग्रामपंचायत पारदर्शिता को बढ़ावा देने,
                संचार में सुधार करने, और सभी के लिए महत्वपूर्ण जानकारी और सेवाओं
                तक पहुँच को आसान बनाने का लक्ष्य रखती है।
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default AboutUsPara;
