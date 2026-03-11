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
    <div className="w-full h-full bg-gray-200">
      <div className="w-[80%] h-auto py-10 px-6 box-shadow bg-white mx-auto">
        <form onSubmit={handleSubmit}>
          <h1 className="w-full text-center h-8 font-semibold text-xl mb-6">
            Add Funds
          </h1>
          <div className="mb-5">
            <label
              htmlFor="scheme"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Scheme Name
            </label>
            <input
              type="text"
              id="scheme"
              value={formData.scheme}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-200 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter Text"
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="component"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Component Name
            </label>
            <input
              type="text"
              id="component"
              value={formData.component}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-200 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter Text"
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="expected_funds"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Expected Funds
            </label>
            <input
              type="number"
              id="expected_funds"
              value={formData.expected_funds}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-200 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter Amount"
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="actual_funds"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Actual Funds Received
            </label>
            <input
              type="number"
              id="actual_funds"
              value={formData.actual_funds}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-200 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter Amount"
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="reverted_funds"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Reverted Funds
            </label>
            <input
              type="number"
              id="reverted_funds"
              value={formData.reverted_funds}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-200 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter Amount"
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="actual_expenditure"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Actual Expenditure
            </label>
            <input
              type="number"
              id="actual_expenditure"
              value={formData.actual_expenditure}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-200 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter Amount"
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="date"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-200 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-5">
            <button className="bg-green-700 text-white w-40 rounded-md h-10">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
