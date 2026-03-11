import React from "react";
import Banner from "@/app/component/Banner";
import AboutUsPara from "@/app/component/AboutUsPara";
import VillageInfo from "@/app/component/VillageInfo";
import Footer from "@/app/component/Footer";

const Page = () => {
  return (
    <div>
      <div className="container">
        <VillageInfo></VillageInfo>
        <div className="about-container sm:block lg:flex ">
          <Banner></Banner>
          <AboutUsPara></AboutUsPara>
        </div>
        <Footer></Footer>
      </div>
    </div>
  );
};

export default Page;
