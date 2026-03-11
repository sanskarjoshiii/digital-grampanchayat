"use client";
import { useGlobalContext } from "../context/context";

const VillageInfo = () => {
  const { language } = useGlobalContext();
  return (
    <>
      <div className="py-10 px-4 mb-5">
        {language == "english" ? (
          <p className="px-4 py-4 capitalize">
            {" "}
            <span className="text-black font-semibold text-red-600 text-xl">
              Village Panchayat
            </span>
            :Chandgaon
            <br />
            <span className="text-black font-semibold text-red-600 text-xl">
              LGD Code
            </span>
            :170972
            <br />
            <span className="text-black font-semibold text-red-600 text-xl">
              Block
            </span>
            :vaijapur
            <br />
            <span className="text-black font-semibold text-red-600 text-xl">
              Zilla Parishad
            </span>
            :Sambhaji Nagar
          </p>
        ) : (
          <p className="px-4 py-4">
            {" "}
            <span className="text-black font-semibold text-red-600 text-xl">
              ग्राम पंचायत
            </span>
            : चांदगांव
            <br />
            <span className="text-black font-semibold text-red-600 text-xl">
              एलजीडी कोड
            </span>
            : 170972
            <br />
            <span className="text-black font-semibold text-red-600 text-xl">
              ब्लॉक
            </span>
            : वैजापुर
            <br />
            <span className="text-black font-semibold text-red-600 text-xl">
              जिला परिषद
            </span>
            : संभाजी नगर
          </p>
        )}
        {language == "english" ? (
          <p className="card-text px-4 ">
            <strong className="font-bold"> Sarpanch Details:-</strong><br></br>
            Name:-Manisha Ganesh Thengde<br></br>
            Mobile no :-9673338564<br></br>
            Email id :- ganstgda@gmail.com<br></br>
          </p>
        ) : (
          <p className="card-text px-4 ">
            <strong className="font-bold">सरपंच विवरण:-</strong><br></br>
            नाम:- मनीषा गणेश थेंगड़े<br></br>
            मोबाइल नंबर:- 9673338564<br></br>
            ईमेल आईडी:- ganstgda@gmail.com<br></br>
          </p>
        )}
        <hr />
      </div>
    </>
  );
};
export default VillageInfo;
