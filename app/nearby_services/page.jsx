import React from "react";

const Page = () => {
  const services = [
    {
      img: "https://img.icons8.com/?size=100&id=2539&format=png&color=000000",
      title: "Toilets",
    },
    {
      img: "https://img.icons8.com/?size=100&id=10726&format=png&color=000000",
      title: "Parkings",
    },
    {
      img: "https://img.icons8.com/?size=100&id=1954&format=png&color=000000",
      title: "Schools",
    },
    {
      img: "https://img.icons8.com/?size=100&id=2539&format=png&color=000000",
      title: "Anganwadis",
    },
    {
      img: "https://img.icons8.com/?size=100&id=12449&format=png&color=000000",
      title: "Common Service Center",
    },
    {
      img: "https://img.icons8.com/?size=100&id=23043&format=png&color=000000",
      title: "ATMs",
    },
    {
      img: "https://img.icons8.com/?size=100&id=5035&format=png&color=000000",
      title: "Police Station",
    },
    {
      img: "https://img.icons8.com/?size=100&id=wEgBU9peD99C&format=png&color=000000",
      title: "Banks",
    },
    {
      img: "https://img.icons8.com/?size=100&id=4192&format=png&color=000000",
      title: "Petrol Pump",
    },
    {
      img: "https://img.icons8.com/?size=100&id=3675&format=png&color=000000",
      title: "Railway Station",
    },
    {
      img: "https://img.icons8.com/?size=100&id=241&format=png&color=000000",
      title: "Bus Stand",
    },
  ];

  return (
    <div className="w-full h-auto py-4 px-6">
      <div className="w-full mb-5 h-auto py-2 px-0 border-2 border-gray-500 text-black flex flex-row justify-center items-center">
        Nearby Services
      </div>
      <div className="grid" style={{gridTemplateColumns:"auto auto auto"}}>

      {services.map((data, index) => {
          return (
              <div key={index} className="w-30 h-auto flex flex-col my-4 items-center gap-2" >
            <img src={data.img} width={60} height={60} className="p-2 rounded-sm" />
            <p className="text-center">{data.title}</p>
          </div>
        );
    })}
    </div>
    </div>
  );
};

export default Page;
