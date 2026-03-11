"use client"
import React, { useState } from "react";
import mario from "@/app/assets/mario-bg.png";
import img1 from "@/app/assets/img1.jpg";
import img2 from "@/app/assets/img2.png";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { FaArrowAltCircleLeft } from "react-icons/fa";
const Banner = () => {
  const images = [mario.src, img1.src, img2.src];
  const [slider, setSlider] = useState(0);
  const handleFront = () => {
    setSlider(slider + 1);
    if (slider == 2) {
      setSlider(0);
    }
    console.log(slider);
  };
  const handleBack = () => {
    setSlider(slider - 1);
    if (slider == 0) {
      setSlider(2);
    }
  };
  return (
    <>
      <div className="slider">
        <div className="slider-images">
          <img
            src={images[slider]}
            alt=""
            style={{ width: "100%", height: "40vh" }}
          />
          <div className="btn1" style={{ border: "none" }}>
            <button
              onClick={handleBack}
              style={{
                border: "none",
                backgroundColor: "transparent",
                fontSize: "20px",
                color: "black",
              }}
            >
              <FaArrowAltCircleLeft />
            </button>
            <button
              onClick={handleFront}
              style={{
                border: "none",
                backgroundColor: "transparent",
                fontSize: "20px",
                color: "black",
              }}
            >
              <FaArrowAltCircleRight />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Banner;
