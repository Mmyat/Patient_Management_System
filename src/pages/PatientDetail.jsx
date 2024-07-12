import { useEffect, useState } from "react";
import axios from "axios";
import {NavLink,useLocation,Outlet,useParams,useNavigate} from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import Swal from "sweetalert2";
import DefaultProfile from "../images/defaultprofile.jpg";
import { BsArrowLeft } from "react-icons/bs";
import { AiOutlineEdit } from "react-icons/ai";
import Tooltip from "../components/Tooltip";
import PersonalIcon from "../images/personal_icon.png";
import ObjectiveIcon from "../images/concern.png";
import MedicalIcon from "../images/medical-history.png";
import SurgicalIcon from "../images/surgery-room.png";
import SocialHistoryIcon from "../images/social-media.png";
import FamilyMedicalIcon from "../images/family_medial_history.png";
import HospitalIcon from "../images/hospital.png";
import FollowUpIcon from "../images/follow_up_icon.png";
import FileManagerIcon from "../images/file-manager.png";

const PatientDetails = () => {
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
  const location = useLocation();
  const { patientId, setPatientId } = useStateContext();
  const [patient, setPatient] = useState({});
  const [partner, setPartner] = useState({});
  const [isTrue, setIsTrue] = useState(false);
  const [gender, setGender] = useState('male');
  const [showModal, setShowModal] = useState(false);
  const [profile, setProfile] = useState(DefaultProfile);
  const [partnerProfile, setPartnerProfile] = useState(DefaultProfile);
  const { id } = useParams();
  const getDataById = async () => {
    console.log("id--",id);
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_DOMAIN}/patient/patientIdSearch/${id}`
    );
    console.log("id pa--",response);
    const data = response.data.data.result[0];
    console.log("patient data:",data);
    setPatient(data);
    setGender(data.gender)
    setPatientId(id);
    setProfile(data.imageUrl);
  };

  const getRelation = async () => {
    const requestData = { patient_id: id };
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_DOMAIN}/partner/partnerSearch`,
      requestData
    );
    if (response.data.code == 200) {
      const data = response.data.data.data.result[0];
      console.log(data);
      setPartner(data);
      setPartnerProfile(data.imageUrl);
      toggleState();
    }
  };
  //
  const toggleState = () => {
    if (partner) {
      setIsTrue(true);
    } else {
      setIsTrue(false);
    }
  };

  const handleViewDetail = () => {
    setPatient(partner);
    setPartner(patient);
    setPatientId(partner.id);
    setProfile(partnerProfile);
    setPartnerProfile(profile);
    navigate(`/admin/patient/patientdetail/${partner.id}`);
  };
  const changeToEdit = (Id) => {
    navigate(`/admin/patient/patientform/${Id}`);
  };
  const addNewPartner = async (patientId) => {
    setShowModal(false);
    navigate(`/admin/patient/partnerform/${patientId}`);
  };
  //
  const connectPartner = () => {
    setShowModal(false);
    navigate(`/admin/patient/partnerconnect/${patientId}`);
  };
  //
  let Links = [
    { name: "Personal Information", link: "personalinfo", icon: PersonalIcon },
    { name: "Objectives Concerns", link: "objectives", icon: ObjectiveIcon },
    { name: "Medical History", link: "medical", icon: MedicalIcon },
    { name: "Surgical History", link: "surgical", icon: SurgicalIcon },
    { name: "Social History", link: "social", icon: SocialHistoryIcon },
    {name: "Family Medical History",link: "familymedical",icon: FamilyMedicalIcon},
    { name: "Hospital & Lab", link: "hospital-lab", icon: HospitalIcon },
    { name: "Follow Up", link: "follow-up", icon: FollowUpIcon },
    { name: "File Manager", link: "file-manager", icon: FileManagerIcon },
  ];
  useEffect(() => {
    // if (location.state) {
    //   const { info } = location.state;
    //   setPatient(info);
    //   setPatientId(info.id);
    //   setProfile(info.imageUrl);
    //   getRelation();
    // } else {
      getDataById();
      getRelation();
    // }
  }, []);
  return (
    <div className="container mx-auto px-4 py-8 sm:py-0">
      <button
        className="text-3xl bg-white p-1 mb-2 border-dashed border-1 border-gray-300 stroke-1 rounded-md"
        onClick={() => navigate(`/admin/patient/`, { state: location.state })}
      >
        <BsArrowLeft />
      </button>
      <div className="grid bg-white lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-2 shadow-md">
        <div className="md:flex-col lg:flex-row">
          <h3 className="text-xl text-slate-800 ml-1 mt-2">
            Patient's Details
          </h3>
          <div className="flex px-4 py-5 sm:py-2">
            <div className="relative inline-block">
              <img
                src={profile ? profile : DefaultProfile}
                alt="Profile Preview"
                className="w-36 h-36 mr-4 md:mr-18 rounded-md mt-1 object-cover"
              />
              <button
                onClick={() => changeToEdit(patient.id)}
                className="absolute bottom-5 right-0 m-2 text-white bg-blue-500 hover:bg-blue-700 p-2 rounded-full"
              >
                <AiOutlineEdit />
              </button>
            </div>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-2">
              <dt className="text-gray-700 font-medium">Patient's ID:</dt>
              <dd className="text-gray-900">{patient.id}</dd>
              <dt className="text-gray-700 font-medium">Name:</dt>
              <dd className="text-gray-900">{patient.name}</dd>
              <dt className="text-gray-700 font-medium">Date of Birth:</dt>
              <dd className="text-gray-900">{patient.dob}</dd>
              <dt className="text-gray-700 font-medium">NRC:</dt>
              <dd className="text-gray-900">{patient.nrc}</dd>
              <dt className="text-gray-700 font-medium">Passport:</dt>
              <dd className="text-gray-900">{patient.passport}</dd>
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
            <div className="flex px-4 py-5 sm:py-2">
              <div className="relative inline-block">
                <img
                  src={partnerProfile ? partnerProfile : DefaultProfile}
                  alt="Profile"
                  className="w-36 h-36 mr-4 md:mr-18 rounded-md mt-1 object-cover"
                />
                <button
                  onClick={() => changeToEdit(partner.id)}
                  className="absolute bottom-14 right-0 m-2 text-white bg-blue-500 hover:bg-blue-700 p-2 rounded-full"
                >
                  <AiOutlineEdit />
                </button>
              </div>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-2">
                <dt className="text-gray-700 font-medium">Partner's ID:</dt>
                <dd className="text-gray-900">{partner.id}</dd>
                <dt className="text-gray-700 font-medium">Name:</dt>
                <dd className="text-gray-900">{partner.name}</dd>
                <dt className="text-gray-700 font-medium">Date of Birth:</dt>
                <dd className="text-gray-900">{partner.dob}</dd>
                <dt className="text-gray-700 font-medium">NRC:</dt>
                <dd className="text-gray-900">{partner.nrc}</dd>
                <dt className="text-gray-700 font-medium">Passport:</dt>
                <dd className="text-gray-900">{partner.passport}</dd>
                <dt className="text-gray-700 font-medium">Gender:</dt>
                <dd className="text-gray-900">{partner.gender} </dd>
                <button
                  className=" rounded bg-indigo-500 hover:bg-indigo-600 text-white text-center mt-1"
                  onClick={handleViewDetail}
                >
                  <span className="ml-2">View Detail</span>
                </button>
              </dl>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center border-solid border-gray-400 border-l">
            <button
              onClick={() => {
                setShowModal(true);
              }}
              className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
            >
              <svg
                className="w-4 h-4 fill-current opacity-50 shrink-0"
                viewBox="0 0 16 16"
              >
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
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
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
      {/* <div className="relative flex items-center justify-around text-gray-500 dark:text-gray-400 bg-white shadow-md sm:rounded-lg py-2 md:py-8 mt-2"> */}
      <ul className="relative flex items-center justify-start md:justify-around bg-white mt-4 py-8 md:mt-4 overflow-x-auto flex-nowrap">
        {Links.map((link) => (
          link.name === "Medical History" ? (
            patient.gender === "male" ? null : (
              <li key={link.name} className="mx-4">
                <NavLink
                  to={link.link}
                  className={({ isActive }) =>
                    isActive
                      ? "bg-blue-200 pt-4 p-1 md:pt-5 md:p-2 rounded-md"
                      : "text-gray-600 pb-3 p-1 md:pt-5 md:p-2 rounded-md"
                  }
                >
                  <Tooltip text={link.name}>
                    <img
                      src={link.icon}
                      alt="icon"
                      className="w-8 h-8 mr-2"
                    />
                  </Tooltip>
                </NavLink>
              </li>
            )
          ) : (
            <li key={link.name} className="mx-4">
              <NavLink
                to={link.link}
                className={({ isActive }) =>
                  isActive
                    ? "bg-blue-200 pt-4 p-1 md:pt-5 md:p-2 rounded-md"
                    : "text-gray-600 pb-3 p-1 md:pt-5 md:p-2 rounded-md"
                }
              >
                <Tooltip text={link.name}>
                  <img
                    src={link.icon}
                    alt="icon"
                    className="w-8 h-8 mr-2"
                  />
                </Tooltip>
              </NavLink>
            </li>
          )
        ))}
      </ul>
      <Outlet />
    </div>
  );
};
export default PatientDetails;
