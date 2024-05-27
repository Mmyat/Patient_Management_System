import { useEffect, useState } from "react";
import axios from "axios";
import { Survey } from "survey-react-ui";
import { NavLink,Link,Outlet,useParams,useNavigate} from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import Swal from "sweetalert2";
import DefaultProfile from "../images/defaultprofile.jpg";

const PatientDetails = ({ name, dob, nrc, gender }) => {
  const medicalHistorySurvey = () => {
    const survey = new Survey();
    survey.onComplete = (result) => {
      console.log("Survey results:", result.data);
    };
    return survey;
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
  //
  const navigate = useNavigate();

  const { patientId, setPatientId } = useStateContext();
  const [patient, setPatient] = useState({});
  const [partner, setPartner] = useState({});
  const [isTrue, setIsTrue] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [profile,setProfile] = useState(DefaultProfile)
  const [partnerProfile,setPartnerProfile] = useState(DefaultProfile)
  const { id } = useParams();
  const getDataById = async () => {
    const response = await axios.post(
      `http://localhost:3000/patient/patientIdSearch/${id}`
    );
    console.log("response :", response);
    const data = response.data.data.result[0];
    setPatient(data);
    setPatientId(id);
    setProfile(data.imageUrl)
  };

  const getRelation = async () => {
    const requestData = { patient_id: id };
    const response = await axios.post(
      "http://localhost:3000/partner/partnerSearch",
      requestData
    );
    if (response.data.code == 200) {
      console.log(response.data.data.data);
      const data = response.data.data.data.result[0];
      console.log(data);
      setPartner(data);
      setPartnerProfile(data.imageUrl)
      toggleState();
    }
  };
  //
  const toggleState = () => {
    // Check if partner data exists
    if (partner) {
      setIsTrue(true); // Set isTrue to true if partner data exists
    } else {
      setIsTrue(false); // Set isTrue to false if partner data doesn't exist
    }
  };

  const handleViewDetail = () => {
    // Swap patient and partner data
    setPatient(partner);
    setPartner(patient);
    setPatientId(partner.id);
    setProfile(partnerProfile)
    setPartnerProfile(profile)
    navigate(`/admin/patient/patientdetail/${partner.id}`);
  };

  const addNewPartner = async (patientId) => {  
      setShowModal(false);
      navigate(`/admin/patient/partnerform/${patientId}`);  
  };
  //
  const connectPartner = ()=>{
    setShowModal(false);
    navigate(`/admin/patient/partnerconnect/${patientId}`);
  }
  //
  let Links = [
    { name: "Personal Info", link: "personalinfo" },
    { name: "Objectives Concerns", link: "objectives" },
    { name: "Medical History", link: "medical" },
    { name: "Surgical History", link: "surgical" },
    { name: "Social History", link: "social" },
    { name: "Family Medical History", link: "familymedical" },
  ];
  //get Data
  useEffect(() => {
    getDataById();
    getRelation();
  }, []);
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid bg-white grid-cols-1 sm:grid-cols-2 gap-2 shadow-md">
        <div className="flex-col">
          <h3
            className="text-xl text-slate-800 ml-4 mt-2"
          >
            Patient's Details
          </h3>
          <div className="flex px-4 py-5">
            {/* <BsFillPersonLinesFill className="text-4xl mr-4 md:mr-18" /> */}
            <img src={profile} alt="Profile Preview" className="w-16 h-16 mr-4 md:mr-18 rounded-full"/>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <dt className="text-gray-700 font-medium">Patient's ID:</dt>
              <dd className="text-gray-900">{patient.id}</dd>
              <dt className="text-gray-700 font-medium">Name:</dt>
              <dd className="text-gray-900">{patient.name}</dd>
              <dt className="text-gray-700 font-medium">Date of Birth:</dt>
              <dd className="text-gray-900">{patient.dob}</dd>
              <dt className="text-gray-700 font-medium">NRC:</dt>
              <dd className="text-gray-900">{patient.nrc}</dd>
              <dt className="text-gray-700 font-medium">Gender:</dt>
              <dd className="text-gray-900">{patient.gender}</dd>
            </dl>
          </div>
        </div>
        {isTrue ? (
          <div className="flex-col border-solid border-gray-400 border-1">
            <h3 className="text-xl text-slate-800 ml-4 mt-2">
              Partner's Details
            </h3>
            <div className="flex px-4 py-5">
              <img src={partnerProfile} alt="Profile Preview" className="w-16 h-16 mr-4 md:mr-18 rounded-full"/>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <dt className="text-gray-700 font-medium">Partner's ID:</dt>
                <dd className="text-gray-900">{partner.id}</dd>
                <dt className="text-gray-700 font-medium">Name:</dt>
                <dd className="text-gray-900">{partner.name}</dd>
                <dt className="text-gray-700 font-medium">Date of Birth:</dt>
                <dd className="text-gray-900">{partner.dob}</dd>
                <dt className="text-gray-700 font-medium">NRC:</dt>
                <dd className="text-gray-900">{partner.nrc}</dd>
                <dt className="text-gray-700 font-medium">Gender:</dt>
                <dd className="text-gray-900">{partner.gender} </dd>
                <button
                  className=" rounded bg-indigo-500 hover:bg-indigo-600 text-white text-center"
                  onClick={handleViewDetail}
                >
                  <span className="ml-2">View Detail</span>
                </button>
              </dl>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center border-solid border-gray-400 border-l">
            <button onClick={() => {setShowModal(true)}} className="btn bg-indigo-500 hover:bg-indigo-600 text-white">
              <svg className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
              </svg>
              <span className="ml-2">Add Partner</span>
            </button>
          </div>
        )}
        {showModal ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-2/4 my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-2 border-b border-solid border-blueGray-200 rounded-t">
                    <p className="text-xl font-semibold">
                      Connect with partner
                    </p>
                    <button
                      className="justify-center items-center p-1 ml-auto bg-transparent-5 border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowModal(false)}
                    >
                      <svg
                        className="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      {/* <span className="text-gray-600 h-6 w-6 text-3xl block outline-none focus:outline-none">
                        ×
                      </span> */}
                    </button>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 flex-auto">
                    <p className="my-2 text-blueGray-500 text-lg leading-relaxed">
                      Do you connect with new patient or existing ?
                    </p>
                  </div>
                  {/*footer*/}
                  <div className="flex items-center justify-end p-2 rounded-b">
                    <button
                      className="text-gray-500 background-transparent font-bold px-3 py-2 text-sm outline focus:outline-none mr-2 mb-1 ease-linear transition-all duration-150 rounded-lg"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-green-500 text-white active:bg-emerald-600 font-bold text-sm px-3 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-2 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => addNewPartner(patientId)}
                    >
                      New Patient
                    </button>
                    <button
                      className="bg-blue-500 text-white active:bg-emerald-600 font-bold text-sm px-3 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-2 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => connectPartner()}
                    >
                      Existing Patient
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
      </div>
      <div className=" relative flex items-center justify-center text-gray-500 dark:text-gray-400 bg-white md:flex shadow-md sm:rounded-lg py-1 md:py-4 mt-2 overflow-x-auto">
        {/* <h2 className="text-lg font-medium text-gray-800 mb-2">Medical History Survey</h2> */}
        <ul
          className={`flex justify-around md:items-center md:pb-0 md:z-auto z-10 left-0 w-full md:w-auto mt-4 md:mt-0 md:pl-0 pl-9`}
        >
          {Links.map((link) => (
            <li
              className="md:mr-8 mr-4 md:my-0 my-2 font-semibold"
              key={link.name}
            >
              <NavLink
                to={link.link}
                className={({ isActive }) =>
                  isActive ? "text-blue-700" : "text-gray-600"
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <Outlet />
    </div>
  );
};
export default PatientDetails;
