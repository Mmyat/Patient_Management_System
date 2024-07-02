import {useEffect, useState} from 'react'
import WelcomeBanner from '../partials/dashboard/WelcomeBanner'
import TableComponent from '../components/TableComponent';
import axios from 'axios';
import { format } from "date-fns";

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
      Header: "Reminder-1",
      accessor: "reminder_1",
    },
    {
      Header: "Reminder-2",
      accessor: "reminder_2",
    },
    {
      Header: "Action",
      accessor: "actions",
      Cell: ({ row }) => (  
        <div className="flex gap-2">  
          <button onClick={() =>{}} className={`px-4 py-1 text-white text-sm font-medium rounded-full ${reminderDoneCheck(row.reminder_1,row.reminder_2) ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`} disabled={false}> 
          Done </button>        
        </div>
      ),
    },
  ];
  const [dataList,setDataList] = useState([]);
  const [total,setTotal] = useState([]);

  const getFollowUpList = async () => {
    try {  
        const response = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/followUp/followUpDateSearch`);
        console.log("dashboard:", response);
      if (response.data.code === '200') { 
        const list = response.data.data.list;
        console.log("list log:", list);
        setDataList(list);
        const data_total = response.data.data.total;
        setTotal(data_total);
      } else {
        setDataList(null);
        setTotal(null);
      }
    } catch (error) {
      console.log("Error:", error);
      return;
    }
  }
  const reminderDoneCheck = (reminder_1,reminder_2)=>{
    let todayDate = new Date();
    const twoDaysLater = new Date(todayDate);
    twoDaysLater.setDate(todayDate.getDate() + 2);
    const formatTodayDate = format(todayDate, "yyyy/MM/dd");  
    const formatTwoDaysLater = format(twoDaysLater, "yyyy/MM/dd");  
    if (reminder_1 !== null || reminder_2 !== null){
      if (reminder_1 == formatTwoDaysLater || reminder_2 == formatTodayDate){
        return false ;
      }else{
        return true
      }
    }else{
      return true
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
        </div>{
          dataList ? 
          (<TableComponent data={dataList} columns={columns} total={total}/>) :
          (<p className='text-orange-300 justify-center items-center'>There are no Task Today</p>)
        }       
    </div>
  )
}

export default Dashboard;