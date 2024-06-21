import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import Datepicker from "../components/Datepicker";

const Report = () => {
  return (
    <>
      <div className="flex  flex-col items-center sm:justify-center mx-auto ">
        <div className="flex px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl items-center sm:justify-center mx-auto">
          <p className="text-center text-2xl mb-4 font-semibold">
            Hospital and Lab Report
          </p>
        </div>

        <div className="flex border bg-white rounded px-12 py-10">
          <div className="flex flex-row ">
            <div className="w-full mb-4">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <select
                id="category"
                className="mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="online">Online</option>
                <option value="hospital">Hospital</option>
                <option value="other">Others</option>
              </select>
            </div>

            <div>
            <Datepicker />
            </div>
            {/* <div className="w-full mb-4">
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700"
              >
                Start Date
              </label>
              <Datepicker />
            </div>
            <div className="w-full mb-4">
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700"
              >
                End Date
              </label>
              <Datepicker />
            </div> */}
            <div className="item-end">
              <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded mb-4">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Report;