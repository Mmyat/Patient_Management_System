import React from 'react'
import folderIcon from '../images/folder-icon.png'
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
  return (
    <div className="container mx-auto px-4 py-8">
      <button className="text-xl bg-white p-1 mb-2 border-dashed border-1 border-gray-300 stroke-1 rounded-md" onClick={() => navigate(`/admin/patient/`)}>
        New      
      </button>
      <div className="flex flex-col w-full h-fit bg-white grid-cols-1 sm:grid-cols-2 gap-2 shadow-md">
        <input value={"Main>Samitiveij"} readOnly/>
        <div className='flex flex-row items-center'>
          <img className="w-8 h-8" src={folderIcon}/>
          <div className=''>Hi_How</div>
        </div>       
      </div>
    </div>
  )
}

export default FileManager