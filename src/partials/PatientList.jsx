import { useEffect, useState, useRef } from "react";
import { AiOutlineEdit, AiFillDelete } from "react-icons/ai";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

const PatientList = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [patientList, setPatientList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("Name");
  const searchInput = useRef(null);
  const [isSearch, setIsSearch] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState(
    "No patient's information has been searched yet!"
  );

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
    {
      Header: "Actions",
      accessor: "detail",
      Cell: ({ row }) => (
        <div className="flex gap-2">
          <p
            onClick={()=>navigate(`patientdetail/${row.id}`,{state: {patient_Lists: patientList,search_input:searchTerm,search_type : searchType,info: row,data_total : total,pageNumber :page}})}
            className="font-medium text-blue-600 dark:text-blue-500 cursor-pointer"
          >
            Detail
          </p>
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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const calculateAge = (dateOfBirth) => {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    const ageDiffInMs = today.getTime() - dob.getTime();
    const ageInYears = Math.floor(ageDiffInMs / (1000 * 60 * 60 * 24 * 365.25));
    return ageInYears;
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        getData();
    }
  };

  const swalWithButtons = Swal.mixin({
    customClass: {
      confirmButton: "bg-blue-500 text-white px-2 py-1 rounded shadow-lg",
      cancelButton: "bg-red-500 text-white px-5 py-1 rounded shadow-lg mr-6",
    },
    buttonsStyling: false,
  });

  const getData = async () => {
    try {
      if (searchTerm !== "" && searchTerm !== null) {

        let response;
        switch (searchType) {
          case "Name":
            response = await axios.post(
              `${import.meta.env.VITE_SERVER_DOMAIN}/patient/patientNameSearch/${page}`,
              { name: searchTerm }
            );
            break;
          case "NRC":
            response = await axios.post(
              `${import.meta.env.VITE_SERVER_DOMAIN}/patient/patientNrcSearch`,
              { nrc: searchTerm }
            );
            break;
          case "ID":
            response = await axios.post(
              `${import.meta.env.VITE_SERVER_DOMAIN}/patient/patientIdSearch/${searchTerm}`
            );
            break;
          default:
            setMessage("Invalid search type");
            return;
        }
        if (response.data.code === '200') {
          console.log("res search:",response.data);
          setIsSearch(true)
          const list = response.data.data.result;
          list?.forEach((patient) => {
            const patient_age = calculateAge(patient.dob);
            patient.age = patient_age;
          });
          const total_patient = response.data.data.total[0].total;
          setPatientList(list);
          setTotal(total_patient);
          toggleState();
        } else {
          const err_msg = response.data.message;
          setMessage(err_msg);
          setIsSearch(false);
        }
      } else {
        setIsSearch(false);
        setMessage("No patient's information has been searched yet!");
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  const deletePatient = async (id) => {
    swalWithButtons
      .fire({
        title: "Are you sure to delete?",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const response = await axios.delete(
            `${import.meta.env.VITE_SERVER_DOMAIN}/patient/patientPicDelete/${id}`
          );
          if (response.data.code === 200) {
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

  const toggleState = () => {
    if (patientList.length > 0) {
      setIsSearch(true);
    } else {
      setIsSearch(false);
    }
  };
//if(location.state){
  useEffect(() => {
    if(location.state){
      const {patient_Lists,search_input,search_type,data_total,pageNumber} = location.state;
      console.log("location",location.state);
      setIsSearch(true)
      setPatientList(patient_Lists);
      setSearchTerm(search_input);
      setSearchType(search_type);
      setTotal(data_total);
      setPage(pageNumber);
    }else{
      getData();
    }
  }, [page]);

  return (
    <>
      <div className="flex">
        <select
          value={searchType}
          onChange={(e)=>setSearchType(e.target.value)}
          className="text-gray-900 bg-gray-50 border-s-2 rounded-s-lg border border-gray-300"
        >
          <option value="Name">Name</option>
          <option value="NRC">NRC</option>
          <option value="ID">ID</option>
        </select>
        <div className="relative w-full">
          <input
            type="search"
            id="search-dropdown"
            className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
            placeholder="Search ..."
            ref={searchInput}
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            required
          />
          <button type="submit" onClick={()=>getData()} className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:bg-blue-400 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
              <span className="sr-only">Search</span>
          </button>
        </div>
      </div>

      {isSearch ? (
        <div className="relative bg-white shadow-md sm:rounded-lg mt-5">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
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
                    "bg-white border-b dark:bg-gray-800 dark:border-gray-800 overflow-x-auto"
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
          <div className="relative flex items-center justify-between border-t border-gray-200 dark:bg-gray-900 px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
            <p className="relative inline-flex items-center text-sm font-medium text-gray-700 hover:bg-gray-50">Total:{total}</p>
              <button
                onClick={() => {
                  page > 1 ? setPage(page - 1) : setPage(1);
                }}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(total > page * 10 ? page + 1 : page)}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-400">
                  Total:
                  <span className="font-medium text-gray-500 dark:text-gray-400">
                    {total}
                  </span>
                </p>
              </div>
              <div>
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <a
                    href="#"
                    onClick={() => {
                      page > 1 ? setPage(page - 1) : setPage(1);
                    }}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  >
                    {/* <span className="sr-only">Previous</span> */}
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
                    onClick={() => setPage(total > page * 10 ? page + 1 : page)}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  >
                    {/* <span className="sr-only">Next</span> */}
                    <AiOutlineRight className="h-5 w-5" aria-hidden="true" />
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-96">
          <p className="text-center text-red-300 mt-8">{message}</p>
        </div>
      )}
    </>
  );
};

export default PatientList;
