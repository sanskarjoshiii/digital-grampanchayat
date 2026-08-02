"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useGlobalContext } from "../../../context/context";
import FundForm from "../../../component/FundForm";

const Page = ({ params }) => {
  const { userData, setOpenSidebar } = useGlobalContext();
  const [fund, setFund] = useState(null);
  const [state, setState] = useState("loading");

  useEffect(() => {
    (async () => {
      const response = await fetch(`/api/funds/${params.id}`);
      if (!response.ok) return setState("missing");
      setFund(await response.json());
      setState("ready");
    })();
  }, [params.id]);

  if (userData?.userType !== "admin")
    return (
      <div className="w-full min-h-[calc(100vh-4rem)] bg-cream px-4 py-16">
        <div className="mx-auto max-w-md rounded-card border border-line bg-paper px-6 py-12 text-center">
          <h1 className="text-xl font-semibold text-ink">Office access only</h1>
          <p className="mt-2 text-sm text-muted">
            Only the Panchayat office can edit fund records.
          </p>
          <Link href="/panchayat_funds" className="btn-primary mt-6 text-sm">
            View fund records
          </Link>
        </div>
      </div>
    );

  return (
    <div
      className="w-full min-h-[calc(100vh-4rem)] bg-cream px-4 sm:px-6 lg:px-8 py-10"
      onClick={() => setOpenSidebar(false)}
    >
      {state === "loading" && (
        <div className="mx-auto h-96 w-full max-w-2xl animate-pulse rounded-card bg-mist" />
      )}
      {state === "missing" && (
        <div className="mx-auto max-w-md rounded-card border border-line bg-paper px-6 py-12 text-center">
          <h1 className="text-xl font-semibold text-ink">Fund record not found</h1>
          <Link href="/panchayat_funds" className="btn-primary mt-6 text-sm">
            Back to funds
          </Link>
        </div>
      )}
      {state === "ready" && <FundForm fund={fund} id={params.id} />}
    </div>
  );
};

export default Page;
