import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";
import { DefaultDark } from "survey-core/themes/default-dark";
import { DefaultLight } from "survey-core/themes/default-light";
import "./index.css";
import { bioJson } from "./bio_data_json";
import {useParams,useNavigate} from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
function PartnerInputForm() {
    // const {mode} = useParams()
    const {id} = useParams()
    console.log("id:",id);
    const navigate = useNavigate();
    const isNew = id === 'null';
    console.log("new",isNew);
    const survey = new Model(bioJson);
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
   
    survey.completeText ="Save";
    
    //
    const saveSurveyData=async (survey)=> {
        const data = survey.data
        delete data.age ;
        data.partner_id = id
        console.log("payload data",data);
        const response= await axios.post("http://localhost:3000/partner/partnerCreate",data)
        console.log(response.data);
        if(response.data.code == 200){
            Toast.fire({
                icon: "success",
                title: "Patient's partner is registered successfully",
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
   
    survey.addNavigationItem({
        id: "cancel",
        title: "Cancel",
        action: () => {
          navigate(-1);
        },
    });
    // survey.completedHtml = "";
    survey.onComplete.add(function(sender, options){
        saveSurveyData(sender)
        // sender.cancelComplete();
    });
         
    survey.showQuestionNumbers = false;  
    survey.sendResultOnPageNext = true;
    
    return (
        <div className='flex flex-col px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl items-center justify-center mx-auto'>
            <h1 className='text-slate-800 dark:text-slate-100 text-2xl font-bold'>Partner Form</h1>
            <Survey model={survey} />
        </div>
    );
}

export default PartnerInputForm;