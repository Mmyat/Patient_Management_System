import { useEffect,useState } from 'react';
import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom';
import './css/style.css';
// Import pages
import Main from './pages/Main';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientDetails from './pages/PatientDetail';
import MedicalHistory from './partials/medical_history/MedicalHistory';
import SurgicalHistory from './partials/surgical_history/SurgicalHistory';
import SocialHistory from './partials/social_history/SocialHistory';
import FamailyMedicalHistory from './partials/family_medical_history/FamailyMedicalHistory';
import Objective from './partials/Objective/Objective';
import PersonalInfo from './partials/PersonalInfo/PersonalInfo';
import PartnerConnect from './pages/PartnerConnect';
import PartnerForm from './components/PartnerForm';
import PatientForm from './components/PatientForm';
import HospitalLab from './partials/HospitalLab';
import FollowUp from './partials/FollowUp';
import FileManager from './partials/FileManager';
import Report from './pages/Report';
import Login from './pages/Login';
import Unauthorize from './pages/Unauthorize';

function App() {
  const location = useLocation();
  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change

  return (
    <>
      <Routes>
        <Route exact path="/login" element={<Login/>}/>
        <Route exact path="/admin" element={<Main />}>
          <Route exact path="unauthorize" element={<Unauthorize/>}/>
          <Route path='dashboard' element={<Dashboard/>} />
          <Route path="patient" element={<Patients/>}/>           
          <Route path="report" element={<Report/>}/>      
          <Route path="patient/patientform/:id" element={<PatientForm/>}/> 
          <Route path="patient/partnerform/:id" element={<PartnerForm/>}/> 
          <Route path="patient/partnerconnect/:id" element={<PartnerConnect/>}/>
          <Route path="patient/patientdetail/:id" element={<PatientDetails/>}>   
            <Route path="personalinfo" index element={<PersonalInfo/>}/>
            <Route path="medical" element={<MedicalHistory/>}/>
            <Route path="surgical" element={<SurgicalHistory/>}/>
            <Route path="social" element={<SocialHistory/>}/>
            <Route path="familymedical" element={<FamailyMedicalHistory/>}/>
            <Route path="objectives" element={<Objective/>}/>           
            <Route path="hospital-lab" element={<HospitalLab/>}/>           
            <Route path="follow-up" element={<FollowUp/>}/>           
            <Route path="file-manager" element={<FileManager/>}/>           
          </Route>
        </Route>
      </Routes>
      {/* <Routes>
        <Route exact path="/admin" element={<Main />}>
          <Route path='dashboard' element={<Dashboard/>} />
          <Route path="patient" element={<Patients/>}>           
            <Route path="patientform/:id" index element={<PatientForm/>}/> 
            <Route path="partnerform/:id" element={<PartnerForm/>}/> 
            <Route path="partnerconnect/:id" element={<PartnerConnect/>}/>
            <Route path="patientdetail/:id" element={<PatientDetails/>}>   
              <Route index element={<PersonalInfo/>}/>
              <Route path="medical" element={<MedicalHistory/>}/>
              <Route path="surgical" element={<SurgicalHistory/>}/>
              <Route path="social" element={<SocialHistory/>}/>
              <Route path="familymedical" element={<FamailyMedicalHistory/>}/>
              <Route path="objectives" element={<Objective/>}/>           
            </Route>
          </Route>
        </Route>
      </Routes> */}
    </>
  );
}

export default App;
