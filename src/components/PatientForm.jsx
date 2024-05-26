import {useEffect,useState,useRef} from 'react';
import {useParams,useNavigate} from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { format } from 'date-fns';
import nrc_data from '../partials/PatientForm/nrc_data.json'
import DefaultImage from "../images/upload-photo-here.png";
import EditIcon from "../images/edit.svg";
import UploadingAnimation from "../images/uploading.gif";

const PatientForm = () => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState('');
  const [NRCCodeSelect, setNRCCodeSelect] = useState(1);
  const [NRCPlaceSelect, setNRCPlaceSelect] = useState(nrc_data[0].name_en);
  const [NRCTypeSelect, setNRCTypeSelect] = useState("N");
  const [NRCCode, setNRCCode] = useState();
  const [gender, setGender] = useState('Male');
  const [townshipList,setTownshipList] = useState([])
  const [file,setFile] = useState(null)
  const nrcStateCode = [1,2,3,4,5,6,7,8,9,10,11,12,13,14]
  const nrcType = [
    { en: "N", mm: "နိုင်" },
    { en: "E", mm: "ဧည့်" },
    { en: "P", mm: "ပြု" },
    { en: "T", mm: "သာသနာ" },
    { en: "R", mm: "ယာယီ" },
    { en: "S", mm: "စ" },
  ];
  const {id} = useParams()
  console.log("id:",id);
  const navigate = useNavigate();
  const isNew = id === 'null';
  console.log("new",isNew);
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
  
  const handleDobChange = (newDate) => {
    console.log("new dob :",newDate);
    if (newDate) {
      const formattedDate = format(newDate, 'yyyy/MM/dd');
      console.log(`Selected date: ${formattedDate}`);
      setDob(formattedDate)
      console.log("format dob",formattedDate);
      const ageDiff = new Date().getFullYear() - newDate.getFullYear();
      setAge(ageDiff);
    }    
  };

  const getNrcByCode = ()=>{
    const townshipCode = nrc_data.filter(item => item.nrc_code ==NRCCodeSelect)
    console.log("townshipCode :",townshipCode);
    setTownshipList(townshipCode);
  }

  const [avatarURL, setAvatarURL] = useState(DefaultImage);
  const fileUploadRef = useRef();

  const handleImageUpload = (event) => {
    event.preventDefault();
    const uploadedFile = fileUploadRef.current.files[0];    
    setFile(uploadedFile)
  }
  // const uploadImageDisplay = async () => {
  //   try {
  //     setAvatarURL(UploadingAnimation);
  //     const uploadedFile = fileUploadRef.current.files[0];
      
      
  //     // const cachedURL = URL.createObjectURL(uploadedFile);
  //     // setAvatarURL(cachedURL);

  //     const response = await fetch("https://api.escuelajs.co/api/v1/files/upload", {
  //       method: "post",
  //       body: formData
  //     });

  //     if (response.status === 201) {
  //       const data = await response.json();
  //       setAvatarURL(data?.location);
  //     }

  //   } catch(error) {
  //     console.error(error);
  //     setAvatarURL(DefaultImage);
  //   }
  // }

  const savePatientData=async()=> {
    const formData = new FormData();
      formData.append("name", name);
      formData.append("dob", dob);
      formData.append("nrc", `${NRCCodeSelect}/${NRCPlaceSelect}(${NRCTypeSelect})${NRCCode}`);
      formData.append("gender", gender);
      formData.append("file", file);
    // const formData={
    //   "name" : name,
    //   "dob" : dob ,
    //   "nrc" : `${NRCCodeSelect}/${NRCPlaceSelect}(${NRCTypeSelect})${NRCCode}`,
    //   "gender" : gender
    // }
    console.log("form data :",formData);
    const response= await axios.post("http://localhost:3000/patient/patientCreateWithPic",formData)
    console.log(response.data);
    if(response.data.code == 200){
        Toast.fire({
            icon: "success",
            title: "New Patient is registered successfully",
        });
        navigate(-1)
        console.log("response data",response.data);  
    } 
    else{
        Toast.fire({
            icon: "error",
            title: "Failed to register",
        });
        navigate(-1)
    }     
}
// 
const updatePatientData=async ()=> {
  const formData={
    "name" : name,
    "dob" : dob ,
    "nrc" : `${NRCCodeSelect}/${NRCPlaceSelect}(${NRCTypeSelect})${NRCCode}`,
    "gender" : gender
  }    
  const response= await axios.put(`http://localhost:3000/patient/patientUpdate/${id}`,formData,{
    headers:{ "content-type": "multipart/form-data",}
  })
  console.log("update",response.data);
  if(response.data.code == 200){
      Toast.fire({
          icon: "success",
          title: "Paatient's info is updated successfully",
      });
      navigate(-1)
      console.log("response pre data",response.data);  
  } 
  else{
      Toast.fire({
          icon: "error",
          title: "Failed to update",
      });
      navigate(-1)
  }     
}
  //
  const getDataById = async()=>{
    if(!isNew){
        const response = await axios.post(`http://localhost:3000/patient/patientIdSearch/${id}`)
        const data = response.data.data.result[0]
        console.log("edit data",data);
        setName(data.name)
        setDob(data.dob)
        setGender(data.gender)
        //NRC region code destructure
        const state_code = data.nrc.split('/', 1)
        console.log("state code",state_code[0]);
        setNRCCodeSelect(state_code[0])
        //NRC place destructure
        let match = data.nrc.split(/[/()]/)
        console.log("town code",match[1]);
        setNRCPlaceSelect(match[1])
        //NRC type destructure
        const parts = data.nrc.split('(');
        const subParts = parts[1].split(')');
        setNRCTypeSelect(subParts[0])
        //NRC code destructure
        const code = data.nrc.split("(N)")
        console.log("code",code[1]);
        setNRCCode(code[1])
    }
  }
  //
  useEffect(()=>{
    getNrcByCode()
  },[NRCCodeSelect])
  useEffect(()=>{
    getDataById()
  },[])
  return (
    <div className="flex w-full items-center justify-center">
      <form className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker value={dob} onChange={handleDobChange} format='yyyy/MM/dd' maxDate={Date.now()}/>
            </DemoContainer>
          </LocalizationProvider>
        </div>
        <div className="mb-4">
          <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
          <input
            type="text"
            id="age"
            value={age}
            readOnly
            className="mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="nrc" className="block text-sm font-medium text-gray-700">NRC Number</label>
          <div className="flex">
            <select value={NRCCodeSelect} onChange={(e) => setNRCCodeSelect(e.target.value)} className="text-gray-900 bg-gray-50 border-s-2 rounded-s-lg border border-gray-300">
              {nrcStateCode?.map((item,index)=>(
                <option value={item}>{item}</option>
              ))}
            </select>
            <select value={NRCPlaceSelect} onChange={(e) => setNRCPlaceSelect(e.target.value)} className="text-gray-900 bg-gray-50 border border-gray-300">
              {townshipList?.map((item,index)=>(
                <option value={item.name_en}>{item.name_en}</option>
              ))}
            </select>
            <select value={NRCTypeSelect} onChange={(e) => setNRCTypeSelect(e.target.value)} className="text-gray-900 bg-gray-50 border border-gray-300">
              {nrcType?.map((item,index)=>(
                <option value={item.en}>{item.en}</option>
              ))}
            </select>
            
              <input
              type="number"
              id="search-dropdown"
              className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
              placeholder="Enter code..."
              value={NRCCode}
              maxLength={6}
              minLength={6}
              onChange={(event) => {
                setNRCCode(event.target.value);
              }}
              required/>
            
          </div>
        </div>
        <div className="w-1/3 mb-4">
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className='mb-4'>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
          <input type="file" id="file" ref={fileUploadRef} onChange={handleImageUpload}/>
        </div>
        <div className="mt-6">
          <button onClick={()=>navigate(-1)} className='shadow-sm text-sm font-medium outline outline-indigo-600 outline-2 outline-offset-2 py-1 px-4 mr-4 rounded-md focus:ring-indigo-500'>Cancel</button>
          <button
            type="submit"
            onClick={()=>{isNew ? savePatientData() : updatePatientData()}}
            className="bg-indigo-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isNew ? 'Save' : 'Update'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PatientForm