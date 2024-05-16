import { useEffect, useState,useRef} from "react";
import { AiOutlineEdit, AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import Swal from "sweetalert2";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
// import DropdownFilter from "../components/DropdownFilter";
// import Select from "react-dropdown-select";
const Table = () => {
  const [patientList, setPatientList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState('Name');
  const searchInput = useRef(null);
  const [isSearh, setIsSearch] = useState(false);
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [message, setMessage] = useState("No patient's information has been searched yet!")
  const columns = [
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Date of Birth",
      accessor: "dob",
    },
    {
      Header: "Age",
      accessor: "age",
    },
    {
      Header: "NRC(No)",
      accessor: "nrc",
    },
    {
      Header: "Gender",
      accessor: "gender",
    },
    // {
    //   Header: "Phone",
    //   accessor: "phone",
    // },
    {
      Header: "Actions",
      accessor: "detail",
      Cell: ({ row }) => (
        <div className="flex gap-2">
          <Link
            to={`patientdetail/${row.id}`}
            className="font-medium text-blue-600 dark:text-blue-500"
          >
            Detail
          </Link>
          <Link to={`patientform/${row.id}`}>
            <AiOutlineEdit className="text-2xl text-orange-600 dark:text-orange-500 cursor-pointer" />
          </Link>
          <AiFillDelete
            className="text-2xl text-red-400 dark:text-red-500 cursor-pointer"
            onClick={() => {
              deletePatient(row.id);
            }}
          />
        </div>
      ),
    },
  ];
  //
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  //
  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };
  //
  const calculateAge = (dateOfBirth) => {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    const ageDiffInMs = today.getTime() - dob.getTime();
    const ageInYears = Math.floor(ageDiffInMs / (1000 * 60 * 60 * 24 * 365.25));
    return ageInYears;
  };
  //
  const swalWithButtons = Swal.mixin({
    customClass: {
      confirmButton: "bg-blue-500 text-white px-2 py-1 rounded shadow-lg",
      cancelButton: "bg-red-500 text-white px-5 py-1 rounded shadow-lg mr-6",
    },
    buttonsStyling: false,
  });

  //Delete patient
  const deletePatient = async (id) => {
    swalWithButtons
      .fire({
        title: "Are you sure to delete?",
        // text: "You won't be able to revert this!",
        // icon: 'warning',
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const response = await axios.delete(
            `http://localhost:3000/patient/patientDelete/${id}`
          );
          console.log("deleting patient code", response.data);
          if (response.data.code == 200) {
            swalWithButtons.fire(
              "Deleted!",
              "Your patient's data has been deleted.",
              "success"
            );
            getData();
          } else {
            swalWithButtons.fire(
              "Cancelled",
              "Your patient's data cannot not delete",
              "error"
            );
          }
        } else {
          swalWithButtons.fire(
            'Cancelled',
            'Your patient\'s data cannot not delete',
            'error'
          )
        }
      });
  };


  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const getData = async () => {
    try {
      if (searchTerm !== '' && searchTerm !== null)
      {
        switch(searchType){
          case "Name":
            const response = await axios.post(
              `http://localhost:3000/patient/patientNameSearch/${page}`,
              { name: searchTerm } // Pass offset and limit parameters
            );
            if (response.data.code == 200) {
              const list = response.data.data.result;
              console.log("list",list);
              list?.map((patient) => {
                const patient_age = calculateAge(patient.dob);
                patient.age = patient_age;
              });
              const total_patient = response.data.data.total[0].total;
              setPatientList(list);
              setTotal(total_patient);
              toggleState();
            }
            else {
              const err_msg= response.data.message
              console.log("res",err_msg);
              setMessage(response.data.message)
              setIsSearch(false);
            }
            break;
          case "NRC":
            const nrc_response = await axios.post(
              `http://localhost:3000/patient/patientNrcSearch`,
              { nrc: searchTerm } // Pass offset and limit parameters
            );
            console.log("nrc res:", nrc_response);
            if (nrc_response.data.code == 200) {
              const list = nrc_response.data.data.result;
              console.log("list",list);
              list?.map((patient) => {
                const patient_age = calculateAge(patient.dob);
                patient.age = patient_age;
              });
              const total_patient = nrc_response.data.data.total[0].total;
              setPatientList(list);
              setTotal(total_patient);
              toggleState();
            }
            else {
              const err_msg= nrc_response.data.message
              console.log("res",err_msg);
              setMessage(nrc_response.data.message)
              setIsSearch(false);
            }
            break;
        }
      }
      else{
        setIsSearch(false)
        setMessage("No patient's information has been searched yet!")
      }
    } catch (error) {
      setMessage(error);
    }
  };


  const toggleState = async () => {
    // Check if partner data exists
    console.log(patientList.length);
    if (patientList.length > 0) {
      setIsSearch(true);  
    } else {      
      setIsSearch(false); // Set isSearh to false if partner data doesn't exist     
    }
  };

  useEffect(() => {
    searchInput.current.focus();
    getData();
    console.log("isSearh:", isSearh);
  }, [page, total, isSearh,searchTerm]);
  return (
    <>
     <div className="flex">
        <select
          value={searchType}
          onChange={handleSearchTypeChange}
          className="px-8 py-1 bg-white border border-gray-300 rounded-lg"
        >
          <option value="Name">Name</option>
          <option value="NRC">NRC</option>
          <option value="ID">ID</option>
        </select>
        <div className="relative flex mb-2 ml-2">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </div>
          <input type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Names..." ref={searchInput} onChange={(event) => { handleSearchChange(event) }}
            required />
        </div>
      </div>
      {isSearh ?
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 overflow-x-auto">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                {columns.map((column) => (
                  <th key={column.Header} scope="col" className="px-6 py-3">
                    {column.Header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {patientList?.map((item, index) => (
                <tr
                  key={index}
                  className={
                    index % 2 === 0
                      ? "bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                      : "bg-white dark:bg-gray-800"
                  }
                >
                  {columns.map((column) => (
                    <td key={column.accessor} className="px-6 py-4">
                      {column.accessor === "detail" ? (
                        <column.Cell row={{ ...item }} />
                      ) : (
                        item[column.accessor]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="relative flex items-center justify-between border-t border-gray-200 bg-white dark:bg-gray-900 px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <a
                href="#"
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Previous
              </a>
              <a
                href="#"
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Next
              </a>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-400">
                  Total:
                  <span className="font-medium text-gray-500 dark:text-gray-400">{total}</span>
                </p>
              </div>
              <div>
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <a
                    href="#"
                    onClick={() => { page > 1 ? setPage(page - 1) : setPage(1) }}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  >
                    <span className="sr-only">Previous</span>
                    <AiOutlineLeft className="h-5 w-5" aria-hidden="true" />
                  </a>
                  <a
                    href="#"
                    aria-current="page"
                    className="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    {page}
                  </a>
                  <a
                    href="#"
                    onClick={() => setPage( total >page*10 ? page + 1 : page)}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  >
                    <span className="sr-only">Next</span>
                    <AiOutlineRight className="h-5 w-5" aria-hidden="true" />
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>
        :
        <div className="w-96">
          <p className="text-center text-red-300 mt-8">{message}</p>
        </div>
      }
    </>
  );
};

export default Table;
