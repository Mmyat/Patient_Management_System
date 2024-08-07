import React, { useEffect, useRef, useState } from "react";

import Datepicker from "../components/Datepicker";
import TableComponent from "../components/TableComponent";
import axios from "axios";
import { AiFillDelete, AiOutlineEdit } from "react-icons/ai";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { api } from "../components/api";

const Report = () => {
  const [dataList, setDataList] = useState([]);
  const [total, setTotal] = useState(0);
  const flatpickrRef = useRef(null);
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
    try{
    if (start_date == null || end_date == null || data == null) {
      Toast.fire({
        icon: "error",
        title: "You must choose Hospital & Lab and Dates.",
      });
      setDataList("");
      setTotal("");
      return;
    }
    let response = await api.post(`/followup/HosAndLabDateSearch`,
      {
        start_date: start_date,
        end_date: end_date,
        location_name: data.location_name,
      }
    );
    if (response.data.code === "404") {
      setMessage(response.data.message)
      setDataList([])
    }
    if (response.data.code === "200") {
      let list = response.data.data.list;
      if (list.length == 0){
        setMessage("There is no data for the selected date at this hospital");
        return;
      }
      setDataList(list);
      let total = response.data.data.total;
      setTotal(total);
      return;
    }
  }
  catch (error){
    setMessage(error.message)
    setDataList([])
  }
  };

  const exportToExcel = () => {
    try {
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
      Swal.fire({
        icon: "success",
        title: "Export successful",
        showConfirmButton: true,
      });
    } catch (error) {
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
  };

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  const handleDateChange = async () => {
    if (flatpickrRef.current) {
      const selectedDates = flatpickrRef.current.flatpickr.selectedDates;
      if (selectedDates.length >= 2) {
        const get_start_date = formatDate(selectedDates[0]);
        const get_end_date = formatDate(selectedDates[1]);
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
    await getHosAndLabList();
  };

  return (
    <>
      <div className="flex flex-col flex-wrap h-screen sm:justify-start md:justify-start mx-auto overflow-x-auto mt-4">
        <div className="flex sm:justify-center mx-auto">
          <p className="text-center text-2xl font-semibold">
            Hospital and Lab Report
          </p>
        </div>
        <div className="flex flex-col items-center justify-center sm:flex-row rounded p-2 sm:p-2 mb-5">
          <div className="flex flex-col mx-5">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 ml-1"
            >
              Hospital & Lab Name
            </label>
            <select
              id="category"
              className="block w-48 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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

          <div className="flex flex-col items-center relative">
          <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 ml-1"
            >
              Start Date & End Date
            </label>
            <Datepicker
              handleDateChange={handleDateChange}
              flatpickrRef={flatpickrRef}
            />
          </div>

          <div className="mx-5 mt-6">
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

        {dataList.length > 0 ? (
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              <TableComponent columns={columns} data={dataList} total={total} />
          </div>
        ) : (
          <div className="text-center text-red-300">
            {message}
          </div>
        )}
      </div>
    </>
  );
};

export default Report;
