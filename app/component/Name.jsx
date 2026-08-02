"use client";
import React from "react";
import { useGlobalContext } from "../context/context";
import { pick } from "../utils/language";

// Brand lock-up for the sign-in pages: the name, with the descriptor on its own
// line in brackets underneath. Side by side the two ran together and read as
// one long title.
const Name = () => {
  const { language } = useGlobalContext();
  return (
    <div className="text-center leading-tight">
      <p className="font-semibold text-ink">PanchayatX</p>
      <p className="mt-0.5 text-xs text-muted">
        (
        {pick(language, {
          en: "Digital Gram Panchayat",
          mr: "डिजिटल ग्रामपंचायत",
          hi: "डिजिटल ग्राम पंचायत",
        })}
        )
      </p>
    </div>
  );
};

export default Name;
