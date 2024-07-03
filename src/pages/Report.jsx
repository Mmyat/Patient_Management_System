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

  let location_name = null;

  const [data, setData] = useState(null);

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
    // {
    //   Header: "Actions",
    //   accessor: "actions",
    //   Cell: ({ row }) => (
    //     <div className="flex gap-2">
    //       <AiOutlineEdit
    //         onClick={() => {
    //           handleEdit(row.id);
    //         }}
    //         className="text-2xl text-orange-600 dark:text-orange-500 cursor-pointer"
    //       />
    //       <AiFillDelete
    //         className="text-2xl text-red-500 dark:text-red-500 cursor-pointer"
    //         onClick={() => {
    //           handleDelete(row.id);
    //         }}
    //       />
    //     </div>
    //   ),
    // },
  ];

  const getHosAndLabList = async () => {
    console.log(start_date,end_date,data);
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
      `${import.meta.env.VITE_SERVER_DOMAIN}/hospAndLab/HosAndLabDateSearch`,
      {
        start_date: start_date,
        end_date: end_date,
        location_name: data.location_name,
      }
    );
    console.log(response);
    console.log(response.data.data);
    console.log(response.data.code);

    if (response.data.code === "200") {
      let list = response.data.data.list;
      setDataList(list);
      let total = response.data.data.total;
      console.log("Total", total);
      setTotal(total);
      setGetDate(true);
    } else {
      Toast.fire({
        icon: "error",
        title:
          "There is no data available for the hospital and lab report. Please check again.",
      });
      setDataList("");
      setTotal("");
      setGetDate(false);
    }
  };

  const handleEdit = async (rowId) => {
    // setIsNew(false)
    // openModal()
    // let response = await axios.get(`http://localhost:3000/followUp/followUpIDSearch/${rowId}`)
    // setUpdateId(rowId);
    // if (response.data.code === '200') {
    //   let history = response.data.data;
    //   setCategory(history.category);
    //   const formatDate = parse(history.date_time, "yyyy/MM/dd hh:mm a", new Date());
    //   setDate(formatDate)
    //   setRemark(history.remark);
    // } else {
    //   Toast.fire({
    //     icon: "error",
    //     title: "Failed to fetch patient's hospital and lab history",
    //   });
    // }
  };

  const handleDelete = async (rowId) => {
    // swalWithButtons.fire({
    //     title: "Are you sure to delete?",
    //     showCancelButton: true,
    //     confirmButtonText: "Yes",
    //     cancelButtonText: "No",
    //     reverseButtons: true,
    //   })
    //   .then(async (result) => {
    //     if (result.isConfirmed) {
    //       const response = await axios.delete(`http://localhost:3000/followUp/followUpDelete/${rowId}`)
    //       if (response.data.code == 200) {
    //         Toast.fire({
    //           icon: "success",
    //           title: "Patient's hospital and lab history is deleted successfully",
    //         });
    //         closeModal();
    //         getHistoryList();
    //       } else {
    //           Toast.fire({
    //             icon: "error",
    //             title: "Failed to delete patient's hospital and lab history",
    //           });
    //       }
    //     } else {
    //       closeModal();
    //     }
    //   }
    // );
  };

  const exportToExcel = () => {
    try {
      console.log("list", dataList);
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
    console.log(e.target.value);
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
      <div className="flex flex-col items-center sm:justify-center mx-auto">
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
              <option value="Jetamin">Jetanin</option>
              <option value="Chaing Mai">Chaing Mai</option>
              <option value="N Health">N Health</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div className="flex items-center mt-6 mx-5">
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
          <div className="flex sm:flex-row border items-center sm:justify-center bg-white rounded p-5 sm:p-2 mb-5 w-full ">
            <div className="container mx-auto">
              <TableComponent columns={columns} data={dataList} total={total} />
            </div>
          </div>
        ) : (
          <div class="text-center text-red-300 mt-8">
            No Hospital & Lab Report has been searched yet!
          </div>
        )}
      </div>
    </>
  );
};

export default Report;
