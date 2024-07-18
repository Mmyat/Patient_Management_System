import {useEffect, useState} from 'react'
import TableComponent from '../components/TableComponent';
import { format } from "date-fns";
import { api } from '../components/api';

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
      Header: "Reminder-3",
      accessor: "reminder_3",
    },
    {
      Header: "Action",
      accessor: "actions",
      Cell: ({ row }) => (  
        <div className="flex gap-2">  
          <button onClick={() =>handleReminder(row.id)} className={`px-4 py-1 text-white text-sm font-medium rounded-full ${isReminderActive(row.date_time,row.reminder_1,row.reminder_2,row.reminder_3) ? 'bg-blue-500 focus:bg-blue-400' : 'bg-gray-400 cursor-not-allowed'}`} disabled={!isReminderActive(row.date_time,row.reminder_1,row.reminder_2,row.reminder_3)}> 
          Done </button>        
        </div>
      ),
    },
  ];
  const [dataList,setDataList] = useState([]);
  const [total,setTotal] = useState([]);
  const [message,setMessage] = useState("There is no Task Today");
  const [reLoad,setReLoad] = useState(false);

  const getFollowUpList = async () => {
    try {  
        const response = await api.get(`/followUp/followUpDateSearch`);
        if (response.data.code === '404') {
          setMessage("There is no Task Today")
        }
      if (response.data.code === '200') { 
        const list = response.data.data.list;
        setDataList(list);
        const data_total = response.data.data.total;
        setTotal(data_total);
      } else {
        setDataList(null);
        setTotal(null);
      }
    } catch (error) {
      setMessage(error.message)
      return;
    }
  }
  const isReminderActive  = (date_time,reminder_1,reminder_2,reminder_3)=>{
    if (reminder_1 === null && reminder_2 === null && reminder_3 === null) {
      return true;
    }
    let todayDate = new Date();
    const setupDate = new Date(date_time);
    const twoDayBefore = new Date(date_time);
    twoDayBefore.setDate(setupDate.getDate() - 2);
    const oneDayBefore = new Date(date_time);
    oneDayBefore.setDate(setupDate.getDate() - 1); 
    const formattedToDay = format(todayDate,"yyyy/MM/dd")
    const formattedSetupDate = format(setupDate,"yyyy/MM/dd")
    const formattedOneDayBefore = format(oneDayBefore, "yyyy/MM/dd"); 
    const formattedTwoDayBefore = format(twoDayBefore, "yyyy/MM/dd"); 
    if(reminder_1 == formattedTwoDayBefore && formattedOneDayBefore == formattedToDay && reminder_2 == null){
      return true;
    }else if(reminder_2 ==formattedOneDayBefore && formattedSetupDate == formattedToDay && reminder_3 == null){
      return true;
    }else{
      return false;
    }
  }

  const handleReminder =async(reminderId)=>{
    try {  
    const response = await api.get(`/followUp/updateReminder/${reminderId}`);
        if (response.data.code === '200') { 
          setReLoad(true);
          return;
        }
    } catch (error) {
      setMessage(error.message)
        return;
      }
  }
     
  useEffect(()=>{
    getFollowUpList()
  },[reLoad])
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div>
          <h2 className='text-2xl font-semibold'>Today's Task</h2>
        </div>
        {
          dataList ? 
          (<TableComponent data={dataList} columns={columns} total={total}/>) :
          (<p className='text-orange-300 justify-center items-center'>{message}</p>)
        }       
    </div>
  )
}

export default Dashboard;