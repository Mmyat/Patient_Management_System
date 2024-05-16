import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";
import { DefaultDark } from "survey-core/themes/default-dark";
import { DefaultLight } from "survey-core/themes/default-light";
import "./index.css";
import { json } from "./bio_data_json";
import {useParams,useNavigate} from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
function PatientInputForm() {
    // const {mode} = useParams()
    const {id} = useParams()
    console.log("id:",id);
    const navigate = useNavigate();
    const isNew = id === 'null';
    console.log("new",isNew);
    const survey = new Model(json);
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

    survey.completeText =isNew ? "Save" : "Update";
    //
    const browserTheme = localStorage.getItem('theme')
    // let theme = localStorage.getItem('theme') == 'light' ? DefaultLight : DefaultDark ;
    // survey.applyTheme(theme);//dark:DefaultLight
    //
    var storageName = "survey_patient_history";
    const saveSurveyData=async (survey)=> {
        const data = survey.data
        delete data.age ;
        const response= await axios.post("http://localhost:3000/patient/patientCreate",data)
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
    const updateSurveyData=async (survey)=> {
        const data = survey.data
        delete data.age ;
        console.log('update_data',data);
        const response= await axios.put(`http://localhost:3000/patient/patientUpdate/${id}`,data)
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
    survey.addNavigationItem({
        id: "cancel",
        title: "Cancel",
        action: () => {
          navigate(-1);
        },
    });
    // survey.completedHtml = "";
    survey.onComplete.add(function(sender, options){
        isNew ? saveSurveyData(sender) : updateSurveyData(sender)
        // sender.cancelComplete();
    });
         
    survey.showQuestionNumbers = false;  
    survey.sendResultOnPageNext = true;
    //Get Data
    const getBioData = async()=>{
        if(!isNew){
            const response = await axios.post(`http://localhost:3000/patient/patientIdSearch/${id}`)
            const data =response.data.data.patient
            survey.data = data;
        }
    }

    //
    useEffect(()=>{
        getBioData()
        let theme = localStorage.getItem('theme') == 'light' ? DefaultLight : DefaultDark ;
        survey.applyTheme(theme);//dark:DefaultLight
    },[])
    
    return (
        <div className='flex flex-col px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl items-center justify-center mx-auto'>
            <h1 className='text-slate-800 dark:text-slate-100 text-2xl font-bold'>{ isNew ? 'New':'Edit'} Patient</h1>
            <Survey model={survey} />
        </div>
    );
}

export default PatientInputForm;