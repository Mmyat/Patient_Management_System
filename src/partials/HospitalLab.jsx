import {useEffect, useState} from 'react'
import { saveAs } from 'file-saver';
import * as XLSX from "xlsx";
import TableComponent from '../components/TableComponent';
import { AiOutlineEdit, AiFillDelete } from "react-icons/ai";
import { Link ,useParams} from "react-router-dom";
import Modal from '../components/Modal';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { format,parse } from "date-fns";
import axios from 'axios';
import Swal from "sweetalert2";

const HospitalLab = () => {
  const data = [
    { name: 'John Doe', date: 30, condition: 'Flu' },
    { name: 'Jane Smith', date: 25, condition: 'Cold' },
    { name: 'Mike Johnson', date: 40, condition: 'Covid-19' },
    { name: 'Sarah Williams', date: 35, condition: 'Allergies' },
    { name: 'Chris Brown', date: 28, condition: 'Asthma' },
    { name: 'Laura Wilson', date: 50, condition: 'Diabetes' },
    { name: 'Paul White', date: 45, condition: 'Hypertension' },
  ];
  
  const columns = [
    {
      Header: "Name",
      accessor: "location_name",
    },
    {
      Header: "Date",
      accessor: "date",
    },
    {
      Header: "Remark",
      accessor: "remark",
    },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => (
        
        <div className="flex gap-2">  
          <AiOutlineEdit onClick={() => { handleEdit(row.id);}} className="text-2xl text-orange-600 dark:text-orange-500 cursor-pointer" />
          <AiFillDelete
            className="text-2xl text-red-400 dark:text-red-500 cursor-pointer"
            onClick={() => {
              handleDelete(row.id);
            }}
          />
        </div>
      ),
    },
  ];

  const [total, setTotal] = useState(0);
  const [dataList, setDataList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [location_name,setLocation_name] = useState('')
  const [remark,setRemark] = useState('')
  const [date, setDate] = useState(null);
  const [isNew,setIsNew] = useState(true)
  const [isToDelete,setIsToDelete] = useState(false)
  const { id } = useParams();
  const [updateId,setUpdateId] = useState(null)

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

  const openModal = () => setIsModalOpen(true);
  const closeModal = () =>{ 
    setIsModalOpen(false);
    setLocation_name("")
    setDate(null)
    setRemark("")
    // setIsNew(!isNew)
  }

  const swalWithButtons = Swal.mixin({
    customClass: {
      confirmButton: "bg-blue-500 text-white px-2 py-1 rounded shadow-lg",
      cancelButton: "bg-red-500 text-white px-5 py-1 rounded shadow-lg mr-6",
    },
    buttonsStyling: false,
  });

  const exportToExcel = () => {
    const fileName = "hospital_lab_history"
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {type: 'application/octet-stream'});
    saveAs(blob, `${fileName}.xlsx`);

  }

  const handleDateChange = (newDate) => {
    if (newDate) {
      const formattedDate = format(newDate, "yyyy/MM/dd");
      console.log(formattedDate);
      setDate(formattedDate);
    }
  };

  const handleNew = ()=>{
    setIsNew(true);
    openModal()
  }

  const handleEdit =async (rowId) => {
    setIsNew(false)
    openModal()
    let response = await axios.get(`http://localhost:3000/hospAndLab/HosAndLabIdSearch/${rowId}`)
    setUpdateId(rowId);
    console.log('Edit data', response.data.data[0]);
    if (response.data.code == 200) {
      let history = response.data.data[0];
      setLocation_name(history.location_name);
      const formatDate = parse(history.date, "yyyy/MM/dd", new Date());
      console.log("edit fetch",formatDate);
      setDate(formatDate)
      setRemark(history.remark);
    } else {
      Toast.fire({
        icon: "error",
        title: "Failed to fetch patient's hospital and lab history",
      });
    }
  };

  const handleDelete =async (rowId) => {
    // const response = await axios.delete(`http://localhost:3000/hospAndLab/HosAndLabDelete/${rowId}`)
    // console.log("delete res:",response);
    // if (response.data.code == 200) {
    //   console.log("lab res",response.data);
    //   closeModal();
    //   getHistoryList();
    //   Toast.fire({
    //     icon: "success",
    //     title: "Patient's hospital and lab history is deleted successfully",
    //   });
    // } else {
    //   Toast.fire({
    //     icon: "error",
    //     title: "Failed to delete patient's hospital and lab history",
    //   });
    // }
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
          const response = await axios.delete(`http://localhost:3000/hospAndLab/HosAndLabDelete/${rowId}`)
          if (response.data.code == 200) {
            Toast.fire({
              icon: "success",
              title: "Patient's hospital and lab history is deleted successfully",
            });
            closeModal();
            getHistoryList();
          } else {
              Toast.fire({
                icon: "error",
                title: "Failed to delete patient's hospital and lab history",
              });
          }
        } else {
          closeModal();
        }
      }
    );
  }

  const saveNewHistory =async () =>{
    const formData = {
      patient_id : id,
      location_name,
      date,
      remark
    }
    let response = await axios.post("http://localhost:3000/hospAndLab/HosAndLabCreate",formData)
   
    if (response.data.code == 200) {
      closeModal();
      Toast.fire({
        icon: "success",
        title: "Patient's hospital and lab history is saved successfully",
      });
    } else {
      Toast.fire({
        icon: "error",
        title: "Failed to save patient's hospital and lab history",
      });
    }
  }

  const updateHistory = async() =>{
    const formattedDate = format(date, "yyyy/MM/dd");
    const formData = {
      patient_id : id,
      location_name,
      date : formattedDate,
      remark
    }
    let response = await axios.put(`http://localhost:3000/hospAndLab/HosAndLabUpdate/${updateId}`,formData)   
    if (response.data.code == 200) {
      closeModal();
      getHistoryList();
      Toast.fire({
        icon: "success",
        title: "Patient's hospital and lab history is updated successfully",
      });
    } else {
      Toast.fire({
        icon: "error",
        title: "Failed to update patient's hospital and lab history",
      });
    }
  }

  const getHistoryList = async ()=>{
    let response = await axios.post("http://localhost:3000/hospAndLab/HosAndLabPatientIdSearch",{
      patient_id : id,
    })
    if(response.data.code ==='200'){
      let list = response.data.data.list;
      setDataList(list)
      let total_history = response.data.data.total;
      setTotal(total_history)
    }
    else{
      setDataList(null)
      return;
    }  
  }

  useEffect(()=>{
    getHistoryList()
  },[])

  return (
    <div className='mt-8'>
      <div className="flex flex-row justify-between">
        <div className="justify-start">
            <button  onClick={handleNew} className="flex items-center bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded mb-4">
                New
                <svg className="w-4 h-4 fill-current opacity-150 shrink-0 ml-2" viewBox="0 0 16 16">
                    <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                </svg>
            </button>
        </div>           
        <div className="justify-end">               
            <button onClick={exportToExcel} className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">
                Export to Excel
            </button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <form onSubmit={isNew ? saveNewHistory : updateHistory} className="w-full max-w-lg p-6">
          <p className="text-xl">{isNew ?"New" : "Update"} Hospital & Lab History</p>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Hospital & Lab Name</label>
            <input
              type="text"
              id="name"
              value={location_name}
              onChange={(e)=>setLocation_name(e.target.value)}
              required
              className="mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker value={date} onChange={handleDateChange} format='yyyy/MM/dd' 
                  slotProps={{
                    textField: {
                      required: true,
                      variant: 'outlined',
                      fullWidth: true,
                    }
                  }} 
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
          <div className="mb-4">
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">Remark</label>
            <textarea type="text" id="remark" value={remark} onChange={(e)=>setRemark(e.target.value)} className="h-auto mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
          </div>
          <div className="mt-6">
            <button onClick={()=>closeModal()} className='shadow-sm text-sm font-medium outline outline-indigo-600 outline-2 outline-offset-2 py-1 px-4 mr-4 rounded-md focus:ring-indigo-500'>Cancel</button>
            <button
              type="submit"
              className="bg-indigo-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
            {isNew ? "Save" : "Update"}
            </button>
          </div>
        </form>
      </Modal>
      {dataList ? (
        <TableComponent columns={columns} data={dataList} total={total} onEdit={handleEdit} onDelete={handleDelete}/>) 
        :(
          null
        )   
      }
    </div>
  )
}

export default HospitalLab