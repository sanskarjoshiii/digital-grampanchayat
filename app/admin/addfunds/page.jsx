"use client";

import Link from "next/link";
import { useGlobalContext } from "../../context/context";
import FundForm from "../../component/FundForm";

const Page = () => {
  const { userData, setOpenSidebar } = useGlobalContext();

  if (userData?.userType !== "admin")
    return (
      <div className="w-full min-h-[calc(100vh-4rem)] bg-cream px-4 py-16">
        <div className="mx-auto max-w-md rounded-card border border-line bg-paper px-6 py-12 text-center">
          <h1 className="text-xl font-semibold text-ink">Office access only</h1>
          <p className="mt-2 text-sm text-muted">
            Only the Panchayat office can add fund records.
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
      <FundForm />
    </div>
  );
};

export default Page;
