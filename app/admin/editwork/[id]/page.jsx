"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import WorkForm from "@/app/component/WorkForm";

const Page = ({ params }) => {
  const router = useRouter();
  const [work, setWork] = useState(null);

  useEffect(() => {
    const fetchWork = async () => {
      const res = await fetch(`/api/works/${params.id}`);
      if (res.status === 200) setWork(await res.json());
      else router.push("/panchayat_funds");
    };
    fetchWork();
  }, []);

  return (
    <div className="w-full min-h-[91vh] bg-cream py-10 px-4">
      <div className="ds-card w-full max-w-2xl mx-auto py-8 px-6 sm:px-8">
        <h1 className="text-center font-semibold text-2xl mb-8 text-ink">
          Edit Work / Scheme
        </h1>
        {work ? (
          <WorkForm mode="edit" initialData={work} />
        ) : (
          <p className="text-center text-muted text-sm">Loading…</p>
        )}
      </div>
    </div>
  );
};

export default Page;
