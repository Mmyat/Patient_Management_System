import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom';
import './css/style.css';
// Import pages
import Main from './pages/Main';
import PatientInputForm from './partials/PatientForm/PatientInputForm';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientDetails from './pages/PatientDetail';
import MedicalHistory from './partials/medical_history/MedicalHistory';
import SurgicalHistory from './partials/surgical_history/SurgicalHistory';
import SocialHistory from './partials/social_history/SocialHistory';
import FamailyMedicalHistory from './partials/family_medical_history/FamailyMedicalHistory';
import PartnerInputForm from './partials/PartnerForm/PartnerInputForm';

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
        <Route exact path="/admin" element={<Main />}>
          <Route index element={<Dashboard/>} />
          <Route path="patient" element={<Patients/>}/>           
            <Route path="patient/patientform/:id" element={<PatientInputForm/>}/> 
            <Route path="patient/partnerform/:id" element={<PartnerInputForm/>}/> 
            <Route path="patient/patientdetail/:id" element={<PatientDetails/>}>   
              <Route index path="medical" element={<MedicalHistory/>}/>
              <Route path="surgical" element={<SurgicalHistory/>}/>
              <Route path="social" element={<SocialHistory/>}/>
              <Route path="familymedical" element={<FamailyMedicalHistory/>}/>
            </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
