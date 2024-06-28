import {useEffect, useState} from 'react'
import WelcomeBanner from '../partials/dashboard/WelcomeBanner'
import TableComponent from '../components/TableComponent';
import axios from 'axios';
import { AiOutlineEdit, AiFillDelete } from "react-icons/ai";
import { format,parse } from "date-fns";

const Dashboard = () => {

  const columns = [   
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "NRC",
      accessor: "nrc",
    },
    {
      Header: "Date & Time",
      accessor: "date_time",
    },
    {
      Header: "Category",
      accessor: "category",
    },
    {
      Header: "Remark",
      accessor: "remark",
    },
    {
      Header: "Status",
      accessor: "actions",
      Cell: ({ row }) => (  
        <div className="flex gap-2">  
          {/* <AiOutlineEdit onClick={() => {handleEdit(row)}} className="text-2xl text-orange-600 dark:text-orange-500 cursor-pointer" /> */}
          <input type="checkbox" id="scales" name="Done" />
          {/* <AiFillDelete
            className="text-2xl text-red-500 dark:text-red-500 cursor-pointer"
            onClick={() => {
              handleDelete(row.id);
            }}
          /> */}
        </div>
      ),
    },
  ];
  const [dataList,setDataList] = useState([]);
  const [total,setTotal] = useState([]);
  const baseURL = 'http://localhost:3000';

  const handleEdit =(data)=>{

  }
  const getFollowUpList = async () => {
    try {
      let todayDate = new Date();
      const formattedDate = format(todayDate, "yyyy/MM/dd");  
      let local_data = localStorage.getItem(formattedDate);
      let local_total = localStorage.getItem("total");  
      if (local_data === null || local_total === null) {
        console.log("store data:", formattedDate);
  
        const response = await axios.post(`http://localhost:3000/followUp/followUpDateSearch`, { "date": formattedDate });
        console.log("dashboard:", response);
  
        const list = response.data.data.list;
        console.log("list log:", list);
        setDataList(list);
  
        let Data = {
          "patientList": list
        };
        const jsonData = JSON.stringify(Data);
        localStorage.setItem(formattedDate, jsonData);
  
        const data_total = response.data.data.total;
        localStorage.setItem("total", data_total);
        setTotal(data_total);
      } else {
        let parseData = JSON.parse(local_data);
        let localList = parseData.patientList;
        setDataList(localList);
        setTotal(local_total);
      }
    } catch (error) {
      console.log("Error:", error);
      return;
    }
  }
  
  useEffect(()=>{
    getFollowUpList()
  },[])
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <WelcomeBanner/>
        <div>
          <h2 className='text-2xl font-semibold'>Today's Task</h2>
        </div>
        <TableComponent data={dataList} columns={columns} total={total}/>
    </div>
  )
}

export default Dashboard;