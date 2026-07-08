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
    <div className="w-full min-h-[91vh] bg-paper py-8 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="border-b border-line pb-6 mb-6 text-center">
          <h1 className="text-2xl font-semibold text-ink">Nearby Services</h1>
          <p className="text-sm text-muted mt-1">
            Public amenities available around the village
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {services.map((data, index) => (
            <div
              key={index}
              className="ds-card p-5 flex flex-col items-center gap-3 hover:shadow-pop transition-shadow"
            >
              <div className="w-12 h-12 rounded-lg bg-mist border border-line flex items-center justify-center">
                <img src={data.img} width={26} height={26} alt={data.title} />
              </div>
              <p className="text-center text-sm font-medium text-ink">
                {data.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
