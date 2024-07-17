import React, { useEffect, useRef, useState } from "react";

import Datepicker from "../components/Datepicker";
import TableComponent from "../components/TableComponent";
import axios from "axios";
import { AiFillDelete, AiOutlineEdit } from "react-icons/ai";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

const Report = () => {
  const [dataList, setDataList] = useState([]);
  const [total, setTotal] = useState(0);
  const flatpickrRef = useRef(null);
  const [getDate, setGetDate] = useState(false);
  const [start_date, setStart_date] = useState(null);
  const [end_date, setEnd_date] = useState(null);
  const [message, setMessage] = useState("No Hospital & Lab Report has been searched yet!");
  const [data, setData] = useState({"location_name":"Samitevij"});
  const columns = [
    {
      Header: "Patient ID",
      accessor: "patient_id",
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "NRC",
      accessor: "nrc",
    },
    {
      Header: "Passport",
      accessor: "passport",
    },
    {
      Header: "Date",
      accessor: "date",
    },
    {
      Header: "Location",
      accessor: "location",
    },
    {
      Header: "Remark",
      accessor: "remark",
    },
  ];

  const getHosAndLabList = async () => {
    if (start_date == null || end_date == null || data == null) {
      Toast.fire({
        icon: "error",
        title: "You must choose Hospital & Lab and Dates.",
      });
      setDataList("");
      setTotal("");
      setGetDate(false);
      return;
    }
    let response = await axios.post(
      `${import.meta.env.VITE_SERVER_DOMAIN}/followup/HosAndLabDateSearch`,
      {
        start_date: start_date,
        end_date: end_date,
        location_name: data.location_name,
      }
    );
    if (response.data.code === "200") {
      let list = response.data.data.list;
      if (list.length == 0){
        setMessage("There is no data for the selected date at this hospital");
        return;
      }
      setDataList(list);
      let total = response.data.data.total;
      setTotal(total);
      setGetDate(true);
    } else {
      setMessage("An error occurs for this data searching")
      setDataList("");
      setTotal("");
      setGetDate(false);
    }
  };

  const exportToExcel = () => {
    try {
      // Check if dataList is an array and not empty
      if (!Array.isArray(dataList) || dataList.length === 0) {
        Swal.fire({
          title: "No data to export",
          showConfirmButton: true,
        });
        return;
      }
      const fileName = "hospital_lab_report";
      const worksheet = XLSX.utils.json_to_sheet(dataList);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });
      saveAs(blob, `${fileName}.xlsx`);
      // Show success message
      Swal.fire({
        icon: "success",
        title: "Export successful",
        showConfirmButton: true,
      });
    } catch (error) {
      // Log error and show error message
      console.error("Error exporting to Excel:", error);
      Swal.fire({
        icon: "error",
        title: "Export failed",
        text: error.message,
        showConfirmButton: true,
      });
    }
  };

  const handleChange = (e) => {
    setData({ [e.target.name]: e.target.value });
    console.log(data);
  };

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  const handleDateChange = async () => {
    if (flatpickrRef.current) {
      const selectedDates = flatpickrRef.current.flatpickr.selectedDates;

      // Log selected dates (optional)
      console.log("Selected Dates:", selectedDates);

      if (selectedDates.length >= 2) {
        const get_start_date = formatDate(selectedDates[0]);
        const get_end_date = formatDate(selectedDates[1]);

        // Batch state updates using functional form of useState
        setStart_date(get_start_date);
        setEnd_date(get_end_date);
      }
    }
  };

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  }

  const search = async () => {
    console.log("SearchData");
    await getHosAndLabList();
  };

  useEffect(() => {}, []);

  return (
    <>
      <div className="flex flex-col items-center sm:justify-center mx-auto overflow-x-auto">
        <div className="flex px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl items-center sm:justify-center mx-auto">
          <p className="text-center text-2xl mb-4 font-semibold">
            Hospital and Lab Report
          </p>
        </div>

        <div className="flex flex-col items-centers sm:flex-row border bg-white rounded p-5 sm:p-2 mb-5s ">
          <div className="flex flex-col w-64 mx-5">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 ml-1"
            >
              Hospital & Lab Name
            </label>
            <select
              id="category"
              className="mt-1 block w-64  pl-2 pr-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={(e) => handleChange(e)}
              name="location_name"
            >
              <option value="Samitevij">Samitevij</option>
              <option value="Jetanin">Jetanin</option>
              <option value="Chaing Mai">Chaing Mai</option>
              <option value="N Health">N Health</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div className="flex items-center mt-6 xl:mx-5">
            <Datepicker
              handleDateChange={handleDateChange}
              flatpickrRef={flatpickrRef}
            />
          </div>

          <div className="mx-5 mt-6 ">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white py-1.5 px-4 rounded "
              onClick={search}
            >
              Search
            </button>
          </div>

          <div className="mx-5 mt-6">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white py-1.5 px-4 rounded"
              onClick={exportToExcel}
            >
              Export to Excel
            </button>
          </div>
        </div>

        {getDate ? (
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              <TableComponent columns={columns} data={dataList} total={total} />
          </div>
        ) : (
          <div className="text-center text-red-300 mt-8">
            {message}
          </div>
        )}
      </div>
    </>
  );
};

export default Report;
