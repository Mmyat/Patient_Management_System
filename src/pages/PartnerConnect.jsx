import { useEffect, useState, useRef } from "react";
import { useParams,useNavigate} from "react-router-dom";
import Swal from "sweetalert2";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { api } from "../components/api";

const PartnerConnect = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patientList, setPatientList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("Name");
  const searchInput = useRef(null);
  const [isSearh, setIsSearch] = useState(false);
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
          <button className="text-blue-400 background-transparent font-bold px-3 py-2 text-sm outline focus:outline-none mr-2 mb-1 ease-linear transition-all duration-150 rounded-lg" type="button" onClick={()=>{PartnerConnecting(row.id)}}>
            Connect
          </button>
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
  const PartnerConnecting =async(partner_id)=>{
    const data= {
      patient_id_1 : id ,
      patient_id_2 : partner_id
    }
    const response= await api.post(`/partner/partnerJoin`,data)
    if(response.data.code == 200){
        Toast.fire({
            icon: "success",
            title: "Patient is connected successfully with partner",
        });
        navigate(`/admin/patient/patientdetail/${id}/personalinfo`)
    } 
    else{
        Toast.fire({
            icon: "error",
            title: "Failed to connect",
        });
    }     
  }
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
  //
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  //
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        getData();
    }
  }; 
  //
  const getData = async () => {
    if (!searchTerm) {
      setIsSearch(false);
      setMessage("No patient's information has been searched yet!");
      return;
    }
  
    try {
      let endpoint, requestData;
  
      switch (searchType) {
        case "Name":
          endpoint = `${import.meta.env.VITE_SERVER_DOMAIN}/patient/patientNameSearch/${page}`;
          requestData = { name: searchTerm };
          break;
        case "NRC":
          endpoint = `${import.meta.env.VITE_SERVER_DOMAIN}/patient/patientNrcSearch`;
          requestData = { nrc: searchTerm };
          break;
        case "ID":
          endpoint = `${import.meta.env.VITE_SERVER_DOMAIN}/patient/patientIdSearch/${searchTerm}`;
          requestData = {};
          break;
        default:
          setIsSearch(false);
          setMessage("Invalid search type");
          return;
      }
  
      const response = await api.post(endpoint, requestData);
  
      if (response.data.code === '200') {
        const list = response.data.data.result;
        list.forEach(patient => {
          patient.age = calculateAge(patient.dob);
        });
        const total_patient = response.data.data.total[0]?.total || 0;
        setPatientList(list);
        setTotal(total_patient);
        toggleState();
      } else {
        setMessage(response.data.message);
        setIsSearch(false);
      }
    } catch (error) {
      setMessage(error.message);
      setIsSearch(false);
    }
  };
  

  const toggleState = async () => {
    if (patientList.length > 0) {
      setIsSearch(true);
    } else {
      setIsSearch(false);
    }
  };

  useEffect(() => {
    getData();
  }, [page, total,isSearh]);
  return (
    <div className="w-full flex flex-col items-center sm:items-center justify-center md:justify-center items-center mb-8 overflow-x-auto">
      <h3 className='text-center text-2xl mb-4 font-semibold '>Conect With Partner</h3>
      <div className="flex">
        <select
          value={searchType}
          onChange={handleSearchTypeChange}
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
            onChange={(event) => {handleSearchChange(event);}}
            onKeyDown={(event) => {handleKeyDown(event)}} 
            required
          />
          <button type="submit" onClick={(event) => {getData()}} className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
              <span className="sr-only">Search</span>
          </button>
        </div>
      </div>
      {isSearh ? (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-4">
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
                    onClick={() => setPage(total > page * 10 ? page + 1 : page)}
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
      ) : (
        <div className="w-96">
          <p className="text-center text-red-300 mt-8">{message}</p>
        </div>
      )}
    </div>
  )
}

export default PartnerConnect
