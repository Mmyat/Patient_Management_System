import {useNavigate,useParams} from "react-router-dom";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import { surgical_json } from "./surgical_json";
import Swal from 'sweetalert2';
import { useEffect,useState} from "react";
import { inputmask } from "surveyjs-widgets";
import * as SurveyCore from "survey-core";
import { api } from "../../components/api";
inputmask(SurveyCore);
const SurgicalHistory = () => {
  const navigate = useNavigate();
  const survey = new Model(surgical_json);
  const { id } = useParams();
  const [formId,setFormId] =useState()
  const [isNew,setIsNew] = useState(true)
  const [isNavigate,setIsNavigate] = useState(false)
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
//
  survey.completeText =isNew ? "Save" : "Update"
  const saveSurveyData=async (survey)=> {
    const data = survey.data
    delete data.age ;
    console.log("patient_id",id);
    const med_data = {
        patient_id : id,
        data : {
            surgical_history : data
        }
    }
    const response= await api.post(`/formData/formDataCreate`,med_data)
    if(response.data.code == 200){
        Toast.fire({
            icon: "success",
            title: "New Patient's surgical history is saved successfully",
        });
        navigate(`/admin/patient/patientdetail/${id}/surgical`)
        setIsNavigate(true)
        } 
    else{
        Toast.fire({
            icon: "error",
            title: "Failed to save new patient's surgical history",
        });
    }     
  }
// 
  const updateSurveyData=async (survey)=> {
    const data = survey.data
    delete data.age ;
    const med_data = {
      patient_id : id,
      data : {
          surgical_history : data
      }
    }
    const response= await api.put(`/formData/formDataUpdate/${formId}`,med_data)
    if(response.data.code == 200){
        Toast.fire({
            icon: "success",
            title: "Patient's surgical history is updated successfully",
        });
        navigate(`/admin/patient/patientdetail/${id}/surgical`)
        setIsNavigate(true)
    } 
    else
    {
      Toast.fire({
          icon: "error",
          title: "Failed to update Patient's surgical history",
      });
    }     
  }
  survey.width = "100%";
  survey.addNavigationItem({
    id: "cancel",
    title: "Cancel",
    action: () => {
      navigate(`/admin/patient/patientdetail/${id}/personalinfo`);
    },
  });
  survey.onComplete.add(function (sender, options) {
    isNew ? saveSurveyData(sender) : updateSurveyData(sender)
  });
  survey.showQuestionNumbers = false;
  survey.sendResultOnPageNext = true;
  //Get Data
  const getData=async()=>{
    const response= await api.post(`/formData/formDataSearchPatient/`,{patient_id : id,history : "surgical_history"})   
    if(response.data.code == 200){
      const form_id= response.data.data[0].id
      setFormId(form_id)
      const prevData=response.data.data[0].data.surgical_history
      survey.data = prevData
      setIsNew(false)
    }
    else{
        setIsNew(true)
        return;
    }
 }
  useEffect(()=>{
    getData()
 },[formId,isNavigate])
  return <Survey model={survey} />;
};

export default SurgicalHistory;