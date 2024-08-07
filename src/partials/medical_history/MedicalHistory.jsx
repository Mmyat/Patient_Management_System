import {useNavigate,useParams} from "react-router-dom";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import { medical_json } from "./medical_json";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import * as SurveyCore from "survey-core";
import { inputmask } from "surveyjs-widgets";
import { api } from "../../components/api";

inputmask(SurveyCore);
const MedicalHistory = () => {
  const navigate = useNavigate();

  const survey = new Model(medical_json);
  const { id } = useParams();
  const [isNew, setIsNew] = useState(true);
  const [formId, setFormId] = useState(null);
  const [isNavigate,setIsNavigate] = useState(false)
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
  //Get Data
  const getData = async () => {
    const response = await api.post(`/formData/formDataSearchPatient/`,{ patient_id: id, history: "med_history" });
    if (response.data.code == 200) {
      const prevData = response.data.data[0].data.med_history;
      survey.data = prevData;
      const form_id = response.data.data[0].id;
      setFormId(form_id);
      setIsNew(false);
    } else {
      setIsNew(true);
      return;
    }
  };
  //
  survey.completeText = isNew ? "Save" : "Update";
  const saveSurveyData = async (survey) => {
    const data = survey.data;
    delete data.age;
    console.log("patient_id", id);
    const med_data = {
      patient_id: id,
      data: {
        med_history: data,
      },
    };
    const response = await api.post(`/formData/formDataCreate`,med_data);
    if (response.data.code == 200) {
      Toast.fire({
        icon: "success",
        title: "Patient's medical history is saved successfully",
      });
      navigate(`/admin/patient/patientdetail/${id}/medical`);
      setIsNavigate(true)    
    } else {
      Toast.fire({
        icon: "error",
        title: "Failed to save patient's medical history",
      });
    }
  };
  //
  const updateSurveyData = async (survey) => {
    const data = survey.data;
    delete data.age;
    const med_data = {
      patient_id: id,
      data: {
        med_history: data,
      },
    };
    const response = await api.put(`/formData/formDataUpdate/${formId}`,med_data);
    if (response.data.code == 200) {
      Toast.fire({
        icon: "success",
        title: "Patient's medical history is updated successfully",
      });
      navigate(`/admin/patient/patientdetail/${id}/medical`);
      setIsNavigate(true)
    } else {
      Toast.fire({
        icon: "error",
        title: "Failed to update Patient's medical history",
      });
    }
  };
  survey.addNavigationItem({
    id: "cancel",
    title: "Cancel",
    action: () => {
      navigate(`/admin/patient/patientdetail/${id}/personalinfo`);
    },
  });
  survey.onComplete.add(function (sender, options) {
    isNew ? saveSurveyData(sender) : updateSurveyData(sender);
  });

  survey.showQuestionNumbers = false;
  survey.sendResultOnPageNext = true;
  
  useEffect(() => {
    getData();
  }, [formId,isNavigate]);
  return <Survey model={survey} />;
};
export default MedicalHistory;