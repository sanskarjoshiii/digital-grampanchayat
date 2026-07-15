"use client";
import React from "react";
import WorkForm from "@/app/component/WorkForm";

const Page = () => {
  return (
    <div className="w-full min-h-[91vh] bg-cream py-10 px-4">
      <div className="ds-card w-full max-w-2xl mx-auto py-8 px-6 sm:px-8">
        <h1 className="text-center font-semibold text-2xl mb-1 text-ink">
          Add Work / Scheme
        </h1>
        <p className="text-center text-sm text-muted mb-8">
          Work ID and Scheme Name are required.
        </p>
        <WorkForm mode="add" />
      </div>
    </div>
  );
};

export default Page;
