"use client";
import React from "react";
import { useGlobalContext } from "../context/context";

const Name = ({ breaks }) => {
  const { language } = useGlobalContext();
  return (
    <div className="leading-tight">
      {language == "english" ? (
        <>
          <span className="font-semibold text-ink">MeriPanchayat</span>
          {breaks ? <br /> : " "}
          <span className="text-xs text-muted">Digital Gram Panchayat</span>
        </>
      ) : (
        <>
          <span className="font-semibold text-ink">मेरी पंचायत</span>
          {breaks ? <br /> : " "}
          <span className="text-xs text-muted">डिजिटल ग्राम पंचायत</span>
        </>
      )}
    </div>
  );
};

export default Name;
