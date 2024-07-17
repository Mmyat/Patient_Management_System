import { useEffect, useState,useRef} from 'react'
import folderIcon from '../images/folder-icon.png'
import fileIcon from '../images/file-icon.png'
import { AiOutlineEdit, AiFillDelete } from "react-icons/ai";
import { MdDownload } from "react-icons/md";
import { BsArrowLeft} from "react-icons/bs";
import axios from 'axios';
import Modal from '../components/Modal';
import {useParams,useNavigate} from "react-router-dom";
import Swal from "sweetalert2";
import fileDownload from 'js-file-download'
import Tooltip from '../components/Tooltip';

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
          {row.type === "file" ? (
            <Tooltip text="Download file">
              <MdDownload onClick={() => {downloadFile(row.nameURL)}} className="text-2xl text-cyan-500 dark:text-red-500 cursor-pointer"/>
            </Tooltip>)
          :(
            <Tooltip text="Rename">
              <AiOutlineEdit onClick={() => {handleRename(row)}} className="text-2xl text-orange-600 dark:text-orange-500 cursor-pointer" />
            </Tooltip>)}
          <Tooltip text="Delete">
            <AiFillDelete className="text-2xl text-red-500 dark:text-red-500 cursor-pointer z-100" onClick={() => {handleDelete(row);}}/>        
          </Tooltip>
        </div>
      ),
    },
  ];

  const { id } = useParams();
  const [dataList,setDataList] = useState([]);
  const [isFolder,setIsFolder] = useState(false);
  const [isNew,setIsNew] = useState(true);
  const [isModalOpen,setIsModalOpen] = useState(false);
  const [name,setName] = useState('')
  const [updateId,setUpdateId] = useState(null)
  const [path,setPath] = useState('main')
  const [type,setType] = useState('folder')
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProgress, setIsProgress] = useState(false);

  const openModal = () => {setIsModalOpen(true);  }
  const closeModal = () =>{setIsModalOpen(false); }
  const fileUploadRef = useRef();

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

  const swalWithButtons = Swal.mixin({
    customClass: {
      confirmButton: "bg-blue-500 text-white px-2 py-1 rounded shadow-lg",
      cancelButton: "bg-red-500 text-white px-5 py-1 rounded shadow-lg mr-6",
    },
    buttonsStyling: false,
  });

  const getMainFolderList = async()=>{
    try{
      const response = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/fileUpload/mainfFolderSearch`, {
        params :{
          "patient_id": id, 
          path 
        }
      });
      let list = response.data.data;
      setDataList(list)
     
    }
    catch{
      return;
    }
  }

  const downloadFile =async (url)=>{
    setIsProgress(true)
    let modifiedName=url.split("/",5)
    let filename = modifiedName[4]
    await axios.get(url, {
      responseType: 'blob', // important
      onDownloadProgress: (progressEvent) => {
        let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Download Progress: ${percentCompleted}%`);
        setUploadProgress(percentCompleted);
      }
    })
    .then((res) => {
      setIsProgress(false)
      fileDownload(res.data, filename)
    })   
  }
  const handleOpenForm = (value)=>{
    openModal()
    setIsNew(true)
    setIsFolder(value)
    if(value == true){
      setType("folder")
    }else{
      setType("file")
    }
  }
  const handleFileChange =(e)=>{
    e.preventDefault();
    const upload_file = fileUploadRef.current.files[0];
    setName(upload_file)
    const reader = new FileReader();
    reader.readAsDataURL(upload_file);
  }

  const handleRename = async(data)=>{
    openModal();
    setIsNew(false)
    setIsFolder(true)
    setUpdateId(data.id)
    setName(data.name)
    setPath(data.path)
    setType(data.type)
  }

  

  const saveNewFolder = async() => {
    try{
      if(name == ""){
        return;
      }
      closeModal();
      setIsProgress(true)
      const formData = new FormData();
      formData.append("patient_id", id);
      formData.append("name", name);
      formData.append("path", path);
      formData.append("type", type);
      const response = await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/file/fileCreate`,formData,{
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }});
      console.log("response new save",response);
      if (response.data.code === '200') {
        setIsProgress(false)
        Toast.fire({
          icon: "success",
          title: "Patient's hospital and lab history is saved successfully",
        });
        getMainFolderList();
        setName('')
      } else {
        Toast.fire({
          icon: "error",
          title: "Failed to save patient's hospital and lab history",
        });
      }
    }
    catch{
      return;
    }
  }

  const updateFolderName =async()=>{
    try{
      if(name == ""){
        return;
      }
      const formData = {
        "patient_id": id,
        "name": name,
        path,
        type
      }
      const response = await axios.put(`${import.meta.env.VITE_SERVER_DOMAIN}/file/fileUpdate/${updateId}`,formData);
      console.log("rsponse updt:",response);
      if (response.data.code === '200') {
        closeModal();
        Toast.fire({
          icon: "success",
          title: "Patient's hospital and lab history is saved successfully",
        });
        getMainFolderList();
        setName('')
      } else {
        Toast.fire({
          icon: "error",
          title: "Failed to save patient's hospital and lab history",
        });
      }
    }
    catch{
      return;
    }
  }

  const handleSubmit =async (e) =>{
    e.preventDefault();
    if (isNew) {
      await saveNewFolder();
    } else {
      await updateFolderName();
    }
  }

  const handleDelete =async (row) => {
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
          const response = await axios.delete(`${import.meta.env.VITE_SERVER_DOMAIN}/file/fileDelete/${row.id}`)
          console.log("delete res:",response.data);
          if (response.data.code === '403') {
            Toast.fire({
              icon: "error",
              title: `${response.data.message}`,
            });
            return;
          }
          if (response.status === 200 && response.data.code === '200') {
            Toast.fire({
              icon: "success",
              title: `${row.type} is deleted successfully`,
            });
            closeModal();
            getMainFolderList();
          } else {
              Toast.fire({
                icon: "error",
                title: `Failed to delete this ${row.type}`,
              });
          }
        } else {
          closeModal();
        }
      }
    );
  }

  const openFolder = (folderName)=>{
    setPath((prev)=>prev+">"+folderName)
  }

  const backFolder =(path)=>{
    let pathArray = path.split(">") 
    if (pathArray.length <=1 ){
      return;
    }
    let StrLength = pathArray.length-1
    let back_path = pathArray.slice(0 , StrLength).join('>')
    setPath(back_path)
  }

  useEffect(()=>{
    getMainFolderList();
  },[path])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className='flex'>
        <BsArrowLeft className='text-2xl cursor-pointer' onClick={()=>backFolder(path)}/>
        <button className="text-md bg-white p-1 mb-2 border-dashed border-1 border-gray-300 stroke-1 ml-2 rounded-md" onClick={()=>handleOpenForm(true)}>
          New Folder     
        </button>
        <button className="text-md bg-white p-1 mb-2 border-dashed border-1 border-gray-300 stroke-1 ml-2 rounded-md" onClick={()=>handleOpenForm(false)}>
          New File     
        </button>
      </div>      
      <div className="flex flex-col w-full h-fit bg-white grid-cols-1 sm:grid-cols-2 gap-2 shadow-md overflow-x-auto">
        <input className='w-full border-gray-400' value={path} readOnly/>
        <Modal isOpen={isProgress} onClose={()=>setIsProgress(false)}>
          <p className='text-sm text-gray-700'>Downloading {uploadProgress}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5"> 
            <div className="bg-blue-500 h-2.5 items-center justify-center rounded-full" style={{ width: `${uploadProgress}%` }}>    
            </div>
          </div>
        </Modal>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 overflow-x-auto">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {columns.map((column) => (
              <th key={column.accessor}  className="flex-row py-2 px-4 border-b">
                 
               { column.accessor !=="actions" ?(
                  <div className="flex items-center justify-start">
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
          {dataList?.map((row, index) => (
            <tr key={index}
            
            className={"items-center justify-start bg-white border-b dark:bg-gray-800 dark:border-gray-700"}>
              {columns?.map((column) => (
                <td key={column.accessor} className="py-2 px-4 border-b">
                 {
                  column.accessor === "name" ? (
                      <div onClick={()=>{row.type == "folder" ? (openFolder(row.name)) : (null)}} className="flex items-center cursor-pointer">
                        {row.type == "folder" ? (<img className="w-8 h-8 mr-2" src={folderIcon} alt="Folder Icon" />) :(
                          <img className="w-8 h-8 mr-2" src={fileIcon} alt="File Icon" />
                        )}
                        {row[column.accessor]}
                      </div>
                    ) : column.accessor === "actions" ? (
                      <column.Cell row={{ ...row }} />
                    ) : (
                      row[column.accessor]
                    )
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen ? (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="w-full max-w-lg p-6">           
            {isFolder ? (
              <div className="mb-4">
                <label htmlFor="folder-name" className="block text-sm font-medium text-gray-700">Folder Name</label>
                <input type="text" id="folder-name" value={name} onChange={(e)=>setName(e.target.value)} className="h-auto mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
              </div>
            ) :(
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">Upload File</label>
                <input type="file" id="file" ref={fileUploadRef} className="" onChange={handleFileChange}/>
              </div>
            )}
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
        </Modal>) : (
          null
        )
      }
      </div>
    </div>
  )
}
export default FileManager