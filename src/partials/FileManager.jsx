import { useEffect } from 'react'
import folderIcon from '../images/folder-icon.png'
import { AiOutlineEdit, AiFillDelete } from "react-icons/ai";
import { MdDownload } from "react-icons/md";
import { param } from 'jquery';
import axios from 'axios';
const FileManager = () => {
  const columns = [
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Date Modified",
      accessor: "upload_dateTime",
    },
    {
      Header: "Type",
      accessor: "type",
    },
    {
      Header: "Size",
      accessor: "size",
    },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => (
        
        <div className="flex gap-2">  
          <MdDownload className="text-2xl text-cyan-500 dark:text-red-500 cursor-pointer"/>
          {/* <AiOutlineEdit onClick={() => { handleEdit(row.id);}} className="text-2xl text-orange-600 dark:text-orange-500 cursor-pointer" /> */}
          <AiFillDelete
            className="text-2xl text-red-500 dark:text-red-500 cursor-pointer"
            onClick={() => {
              handleDelete(row.id);
            }}
          />
        </div>
      ),
    },
  ];

  const data = [
    {
      id: 42,
      patient_id: 1201,
      name: "Information",
      path: "path path",
      size: "0 MB",
      upload_dateTime: "2024-06-21T04:36:57.000Z",
      type: "folder"
    },
    {
      id : 41,
      patient_id : 1201,
      name : "Medical History",
      path : "path path",
      size : "0 MB",
      upload_dateTime : "2024-06-21T04:59:57.000Z",
      type : "folder"
    }
  ]

  const baseURL = 'http://localhost:3000';

  const getMainFolderList = async()=>{
    try{
      const response = await axios.get(`${baseURL}/fileUpload/mainfFolderSearch`, {
        params :{
          "id": 1991, 
          "path": "Main" 
        }
      });
      console.log("data :",response.data);
    }
    catch{
      return;
    }
  }
  const handleDelete=(rowId)=>{
    console.log("delete",rowId);
  }

  useEffect(()=>{
    getMainFolderList();
  },[])
  return (
    <div className="container mx-auto px-4 py-8">
      <button className="text-md bg-white p-1 mb-2 border-dashed border-1 border-gray-300 stroke-1 rounded-md" onClick={() =>{}}>
        New Folder     
      </button>
      <div className="flex flex-col w-full h-fit bg-white grid-cols-1 sm:grid-cols-2 gap-2 shadow-md">
        <input className='border-gray-400' value={"Main>"} readOnly/>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 overflow-x-auto">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {columns.map((column) => (
              <th key={column.accessor}  className="flex-row items-center justify-center py-2 px-4 border-b">
                 
               { column.accessor !=="actions" ?(
                  <div className="flex items-center justify-center">
                    {column.Header}
                    {/* <svg onClick={() => handleSort(column.accessor)} xmlns="http://www.w3.org/2000/svg" className={`flex-end h-5 w-5 cursor-pointer ${sortConfig.direction === 'ascending' ? "rotate-0" : "rotate-180"}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 0 1 .707.293l4 4a1 1 0 0 1-1.414 1.414L11 6.414V16a1 1 0 1 1-2 0V6.414l-2.293 2.293a1 1 0 1 1-1.414-1.414l4-4A1 1 0 0 1 10 3z" clipRule="evenodd" /></svg> */}
                  </div>
               ) :(
                  column.Header
               )}
              </th>
            ))}
            {/* <th className="py-2 px-4 border-b">Actions</th> */}
          </tr>
        </thead>
        <tbody >
          {data.map((row, index) => (
            <tr key={index}
            className={
              index % 2 === 0
                ? "bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                : "bg-white dark:bg-gray-800"
            }>
              {columns.map((column) => (
                <td key={column.accessor} className="py-2 px-4 border-b">
                 {column.accessor === "name" ? (
                      <div className="flex items-center">
                        <img className="w-8 h-8 mr-2" src={folderIcon} alt="Folder Icon" />
                        {row[column.accessor]}
                      </div>
                    ) : column.accessor === "actions" ? (
                      <column.Cell row={{ ...row }} />
                    ) : (
                      row[column.accessor]
                    )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}
// <img className="w-8 h-8" src={folderIcon}/>

export default FileManager