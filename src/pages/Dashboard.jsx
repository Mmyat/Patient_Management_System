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
          <button onClick={() =>handleReminder(row.id)} className={`px-4 py-1 text-white text-sm font-medium rounded-full ${isReminderActive(row.reminder_1,row.reminder_2) ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`} disabled={!isReminderActive(row.reminder_1,row.reminder_2)}> 
          Done </button>        
        </div>
      ),
    },
  ];
  const [dataList,setDataList] = useState([]);
  const [total,setTotal] = useState([]);
  const [isActive,setIsActive] = useState(true);

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
  const isReminderActive  = (reminder_1,reminder_2)=>{
    if (reminder_1 === null && reminder_2 === null) {
      return true;
    }
    let todayDate = new Date();
    const twoDaysLater = new Date(todayDate);
    twoDaysLater.setDate(todayDate.getDate() + 2);
    const formattedToday = format(todayDate, "yyyy/MM/dd");  
    const formattedTwoDaysLater = format(twoDaysLater, "yyyy/MM/dd");  
    return (reminder_1 === formattedTwoDaysLater || reminder_2 === formattedToday);
  }

  const handleReminder =async(reminderId)=>{
    try {  
    const response = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/followUp/updateReminder/${reminderId}`);
        if (response.data.code === '200') { 
          getFollowUpList()
        } else {
          return;
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
        </div>{
          dataList ? 
          (<TableComponent data={dataList} columns={columns} total={total}/>) :
          (<p className='text-orange-300 justify-center items-center'>There are no Task Today</p>)
        }       
    </div>
  )
}

export default Dashboard;