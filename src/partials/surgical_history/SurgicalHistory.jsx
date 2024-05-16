import { useNavigate } from "react-router-dom";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import { surgical_json } from "./surgical_json";
import axios from 'axios'
import Swal from 'sweetalert2';
import { useStateContext } from "../../context/ContextProvider";
import { useEffect,useState} from "react";

const SurgicalHistory = () => {
  const navigate = useNavigate();
  const survey = new Model(surgical_json);
  const {patientId} = useStateContext();
  const [formId,setFormId] =useState()
  const [isNew,setIsNew] = useState(true)

  // survey.onComplete.add((sender, options) => {
  //   var navigationBar = document.querySelector(".sv_nav");
  //   if (navigationBar) {
  //     var completeButton = navigationBar.querySelector(
  //       'input[type="button"][value="Complete"]'
  //     );
  //     if (completeButton) {
  //       completeButton.value = "Save";
  //     }
  //   }
  //   console.log(JSON.stringify(sender.data, null, 3));
  // });
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
//
  survey.completeText =isNew ? "Save" : "Update"
  const saveSurveyData=async (survey)=> {
    const data = survey.data
    delete data.age ;
    console.log("patient_id",patientId);
    const med_data = {
        patient_id : patientId,
        data : {
            surgical_history : data
        }
    }
    console.log("history:",med_data);
    const response= await axios.post("http://localhost:3000/formData/formDataCreate",med_data)
    console.log("med_history",response.data);
    if(response.data.code == 200){
        Toast.fire({
            icon: "success",
            title: "New Patient's surgical history is saved successfully",
        });
        navigate(-1)
        console.log("response data",response.data);  
    } 
    else{
        Toast.fire({
            icon: "error",
            title: "Failed to save new patient's surgical history",
        });
        navigate(-1);
    }     
  }
// 
  const updateSurveyData=async (survey)=> {
    const data = survey.data
    delete data.age ;
    console.log('update_data',data);
    const med_data = {
      patient_id : patientId,
      data : {
          surgical_history : data
      }
  }
    const response= await axios.put(`http://localhost:3000/formData/formDataUpdate/${formId}`,med_data)
    console.log("update",response.data);
    if(response.data.code == 200){
        Toast.fire({
            icon: "success",
            title: "Patient's surgical history is updated successfully",
        });
        navigate(-1)
        console.log("response data",response.data);  
    } 
    else
    {
      Toast.fire({
          icon: "error",
          title: "Failed to update Patient's surgical history",
      });
      navigate(-1);
    }     
  }
  survey.width = "100%";
  // survey.onPartialSend.add(function (sender) {
  //   saveSurveyData(sender);
  // });
  survey.addNavigationItem({
    id: "cancel",
    title: "Cancel",
    action: () => {
      navigate(-1);
    },
  });
  survey.onComplete.add(function (sender, options) {
    isNew ? saveSurveyData(sender) : updateSurveyData(sender)
  });

  survey.showQuestionNumbers = false;
  survey.sendResultOnPageNext = true;

  //Get Data
  const getData=async()=>{
    const response= await axios.post(`http://localhost:3000/formData/formDataSearchPatient/`,{patient_id : patientId,history : "surgical_history"})   
    if(response.data.code == 200){
      const form_id= response.data.data[0].id
      console.log("form_id",response.data);
      setFormId(form_id)
      
        const prevData=response.data.data[0].data.surgical_history
        survey.data = prevData
        console.log("previos data",prevData);
        setIsNew(false)
    }
    else{
        setIsNew(true)
        return;
    }
 }
  useEffect(()=>{
    getData()
 },[formId,isNew])
  return <Survey model={survey} />;
};

export default SurgicalHistory;