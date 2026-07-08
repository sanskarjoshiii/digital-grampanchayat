"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const [formData, setFormData] = useState({
    scheme: "",
    component: "",
    expected_funds: "",
    actual_funds: "",
    reverted_funds: "",
    actual_expenditure: "",
    date: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/admin/panchayat_funds`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData   }),
    });
    if (response.status == 200) {
      toast.success("Funds Added");
    } else {
      toast.error("Something Went Wrong");
    }
  };
  return (
    <div className="w-full min-h-[91vh] bg-cream py-10 px-4">
      <div className="ds-card w-full max-w-xl py-10 px-6 sm:px-8 mx-auto">
        <form onSubmit={handleSubmit}>
          <h1 className="w-full text-center font-semibold text-xl mb-6 text-ink">
            Add Funds
          </h1>
          <div className="mb-5">
            <label
              htmlFor="scheme"
              className="ds-label"
            >
              Scheme Name
            </label>
            <input
              type="text"
              id="scheme"
              value={formData.scheme}
              onChange={handleChange}
              className="ds-input"
              placeholder="Enter Text"
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="component"
              className="ds-label"
            >
              Component Name
            </label>
            <input
              type="text"
              id="component"
              value={formData.component}
              onChange={handleChange}
              className="ds-input"
              placeholder="Enter Text"
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="expected_funds"
              className="ds-label"
            >
              Expected Funds
            </label>
            <input
              type="number"
              id="expected_funds"
              value={formData.expected_funds}
              onChange={handleChange}
              className="ds-input"
              placeholder="Enter Amount"
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="actual_funds"
              className="ds-label"
            >
              Actual Funds Received
            </label>
            <input
              type="number"
              id="actual_funds"
              value={formData.actual_funds}
              onChange={handleChange}
              className="ds-input"
              placeholder="Enter Amount"
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="reverted_funds"
              className="ds-label"
            >
              Reverted Funds
            </label>
            <input
              type="number"
              id="reverted_funds"
              value={formData.reverted_funds}
              onChange={handleChange}
              className="ds-input"
              placeholder="Enter Amount"
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="actual_expenditure"
              className="ds-label"
            >
              Actual Expenditure
            </label>
            <input
              type="number"
              id="actual_expenditure"
              value={formData.actual_expenditure}
              onChange={handleChange}
              className="ds-input"
              placeholder="Enter Amount"
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="date"
              className="ds-label"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={handleChange}
              className="ds-input"
              required
            />
          </div>
          <div className="mb-1">
            <button className="btn-primary w-full">Add funds</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
