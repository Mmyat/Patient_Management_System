import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { format } from "date-fns";
import nrc_data from "../data_sources/nrc_data.json";
import { parse } from "date-fns";
import { AiOutlinePlus } from "react-icons/ai";

const PatientForm = () => {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const nrcStateCode = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  const [NRCCodeSelect, setNRCCodeSelect] = useState(nrcStateCode[0]);//nrcStateCode ? nrcStateCode[0] : null
  const nrcType = [
    { en: "N", mm: "နိုင်" },
    { en: "E", mm: "ဧည့်" },
    { en: "P", mm: "ပြု" },
    { en: "T", mm: "သာသနာ" },
    { en: "R", mm: "ယာယီ" },
    { en: "S", mm: "စ" },
  ];
  const [NRCPlaceSelect, setNRCPlaceSelect] = useState(nrc_data[0].name_en);//
  const [NRCTypeSelect, setNRCTypeSelect] = useState(nrcType[0].en);//
  const [NRCCode, setNRCCode] = useState(null);
  const [passport, setPassport] = useState(null);
  const [gender, setGender] = useState("male");
  const [townshipList, setTownshipList] = useState([]);
  // const [isRequired,setIsRequired] = useState(false)
  const [file, setFile] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "null";
  const [preview, setPreview] = useState(null);
  //
  const handleImageChange = (e) => {
    e.preventDefault();
    const upload_file = fileUploadRef.current.files[0];
    if (upload_file) {
      setFile(upload_file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(upload_file);
    }
  };
  //
  const handleCodeChange = (event) => {
    const inputValue = event.target.value;
    const requiredCode = inputValue.substring(0,6)
    setNRCCode(requiredCode);
    console.log("onchange code",NRCCode);
  };
  //
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

  const handleDobChange = (newDate) => {
    if (newDate) {
      const formattedDate = format(newDate, "yyyy/MM/dd");
      setDob(formattedDate);
      CalculateAge(newDate);
    }
  };

  const CalculateAge = (newDate) => {
    const ageDiff = new Date().getFullYear() - newDate.getFullYear();
    setAge(ageDiff);
  };

  const getNrcByCode = () => {
    const townshipCode = nrc_data.filter(
      (item) => item.nrc_code == NRCCodeSelect
    );
    setTownshipList(townshipCode);
  };
  const fileUploadRef = useRef();
  //
  const savePatientData = async (e) => {
    e.preventDefault();
    let nrc ;
    if(NRCCodeSelect !== null && NRCPlaceSelect !== null && NRCTypeSelect !== null && NRCCode !== null){
      nrc = `${NRCCodeSelect}/${NRCPlaceSelect}(${NRCTypeSelect})${NRCCode}`
    }
    else{
      nrc = null
    }
      const form_data = new FormData();
      form_data.append("name", name);
      form_data.append("dob", dob);
      form_data.append("nrc",nrc);
      form_data.append("passport", passport);
      form_data.append("gender", gender);
      form_data.append("image", file);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_DOMAIN}/patient/patientPicUpload`,
        form_data
      );
      console.log("save",response.data);
      if (response.data.code == 200) {
        Toast.fire({
          icon: "success",
          title: `${name} is registered successfully`,
        });
        navigate(-1);
      } else {
        Toast.fire({
          icon: "error",
          title: "Failed to register",
        });
      }
  };
  //
  const updatePatientData = async (e) => {
    e.preventDefault();
    let nrc ;
    if(NRCCodeSelect !== null && NRCPlaceSelect !== null && NRCTypeSelect !== null && NRCCode !== null){
      nrc = `${NRCCodeSelect}/${NRCPlaceSelect}(${NRCTypeSelect})${NRCCode}`
    }
    else{
      nrc = null
    }
    const form_data = new FormData();
    form_data.append("name", name);
    const formattedDate = format(dob, "yyyy/MM/dd");
    form_data.append("dob", formattedDate);
    form_data.append("nrc",nrc);
    form_data.append("passport", passport);
    form_data.append("gender", gender);
    form_data.append("image", file);
    console.log("update form data :", form_data);
    const response = await axios.put(`${import.meta.env.VITE_SERVER_DOMAIN}/patient/patientPicUpdate/${id}`,form_data);
    console.log("errt",response.data);
    if (response.data.code == 200) {
      Toast.fire({
        icon: "success",
        title: `${name}'s information is updated successfully`,
      });
      navigate(-1)
    } else {
      Toast.fire({
        icon: "error",
        title: "Failed to update",
      });
    }
  };
  //
  const getDataById = async () => {
    if (!isNew) {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_DOMAIN}/patient/patientIdSearch/${id}`
      );
      const data = response.data.data.result[0];
      console.log("edit data", data);
      setName(data.name);
      const formatDate = parse(data.dob, "yyyy/MM/dd", new Date());
      console.log("dob edit",data.dob);
      setDob(formatDate);
      CalculateAge(formatDate);
      setPassport(data.passport);
      setGender(data.gender);
      if (data.nrc !== null){
        //NRC region code destructure
        const state_code = data.nrc.split("/", 1);
        console.log("state code", state_code[0]);
        setNRCCodeSelect(state_code[0]);
        //NRC place destructure
        let match = data.nrc.split(/[/()]/);
        console.log("town code", match[1]);
        setNRCPlaceSelect(match[1]);
        //NRC type destructure
        const parts = data.nrc.split("(");
        const subParts = parts[1].split(")");
        setNRCTypeSelect(subParts[0]);
        //NRC code destructure
        const code = data.nrc.split(")");
        console.log("code", code[1]);
        setNRCCode(code[1]);
      }
      //imageUrl
      setPreview(data.imageUrl);
      setFile(data.imageUrl)
    }
  };
  //
  useEffect(() => {
    getNrcByCode();
  }, [NRCCodeSelect]);
  useEffect(()=>{
    getDataById()
  },[])
  return (
    <div className="flex w-full items-center justify-center">
      <form onSubmit={isNew ? savePatientData : updatePatientData} className="w-full max-w-lg items-center justify-center bg-white p-6 rounded-lg shadow-md">
        <p className="text-xl">{isNew ? "New Patient" : "Edit Patient"}</p>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="dob"
            className="block text-sm font-medium text-gray-700"
          >
            Date of Birth
          </label>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                value={dob || null}
                onChange={handleDobChange}
                format="yyyy/MM/dd"
                // renderInput={(params) => <TextField {...params} />}
                slotProps={{
                  textField: {
                    required: true,
                    variant: 'outlined',
                    fullWidth: true,
                  }}
                }
              />
            </DemoContainer>
          </LocalizationProvider>
        </div>
        <div className="mb-4">
          <label
            htmlFor="age"
            className="block text-sm font-medium text-gray-700"
          >
            Age
          </label>
          <input
            type="text"
            id="age"
            value={age}
            readOnly
            className="mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <div>
            <label htmlFor="nrc" className="block text-sm font-medium text-gray-700">
              NRC Number
            </label>
            {/* <p className="text-sm text-red-300">{isRequired && "(Please fill at least 6 digits)"} </p> */}
          </div>
          <div className="flex flex-wrap gap-1 md:flex-nowrap md:gap-0">
            <select
              value={NRCCodeSelect}
              onChange={(e) => setNRCCodeSelect(e.target.value)}
              className="text-gray-900 bg-gray-50 border-s-2 md:rounded-s-lg border border-gray-300 w-full md:w-auto"
            >
              {nrcStateCode?.map((item, index) => (
                <option value={item} key={index}>{item}</option>
              ))}
            </select>
            <select
              value={NRCPlaceSelect}
              onChange={(e) => setNRCPlaceSelect(e.target.value)}
              className="text-gray-900 bg-gray-50 border border-gray-300 w-full md:w-auto"
            >
              {townshipList?.map((item, index) => (
                <option value={item.name_en} key={index}>{item.name_en}</option>
              ))}
            </select>
            <select
              value={NRCTypeSelect}
              onChange={(e) => setNRCTypeSelect(e.target.value)}
              className="text-gray-900 bg-gray-50 border border-gray-300 w-full md:w-auto"
            >
              {nrcType?.map((item, index) => (
                <option value={item.en} key={index}>{item.en}</option>
              ))}
            </select>
            <input
              type="number"
              id="search-dropdown"
              className="block p-2.5 w-full md:w-auto text-sm text-gray-900 bg-gray-50 md:rounded-e-lg md:border-s-gray-50 md:border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
              placeholder="Enter code..."
              value={NRCCode}
              maxLength={6}
              minLength={5}
              onChange={handleCodeChange}
            />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Passport</label>
          <input
            type="text"
            id="name"
            value={passport}
            onChange={(e) => setPassport(e.target.value)}
            className="mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="w-1/3 mb-4">
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-gray-700"
          >
            Gender
          </label>
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
        <div className="relative w-40 h-40">
          {preview ? (
            <img
              src={preview}
              alt="Profile Preview"
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 rounded-md">
              <AiOutlinePlus className="text-3xl text-gray-900 font-semibold object-cover" />
              <p>Upload Profile</p>
            </div>
          )}
          <input
            type="file"
            id="file"
            ref={fileUploadRef}
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleImageChange}
          />
        </div>
        <div className="mt-6">
          <button
            type="button" 
            onClick={() => navigate(-1)}
            className="shadow-sm text-sm font-medium outline outline-indigo-600 outline-2 outline-offset-2 py-1 px-4 mr-4 rounded-md focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-indigo-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isNew ? "Save" : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};
//
export default PatientForm;

