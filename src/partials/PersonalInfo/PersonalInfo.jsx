import {useNavigate,useParams} from "react-router-dom";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";
import { personal_json } from "./personal_info_json";
import Swal from "sweetalert2";
import customTheme from './survey_theme.json';
import { useEffect, useState } from "react";
import { api } from "../../components/api";
const PersonalInfo = () => {
  const navigate = useNavigate();
  const survey = new Model(personal_json);
  const { id } = useParams();
  const [isNew, setIsNew] = useState(true);
  const [formId, setFormId] = useState(null);
  const [isNavigate,setIsNavigate] = useState(false)
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
  const saveSurveyData = async (survey) => {
    const data = survey.data;
    delete data.age;
    const personal_data = {
      patient_id: id,
      data: {
        personal_info: data,
      },
    };
    const response = await api.post(`/formData/formDataCreate`,personal_data);
    if (response.data.code == 200) {
      Toast.fire({
        icon: "success",
        title: "New Patient's personal information is saved successfully",
      });
      navigate(`/admin/patient/patientdetail/${id}/personalinfo`);
      setIsNavigate(true)
    } else {
      Toast.fire({
        icon: "error",
        title: "Failed to save new patient's personal information",
      });
    }
  };
  //
  const updateSurveyData = async (survey) => {
    const data = survey.data;
    delete data.age;
    const personal_data = {
      patient_id: id,
      data: {
        personal_info: data,
      },
    };
    const response = await api.put(`/formData/formDataUpdate/${formId}`,personal_data);
    if (response.data.code == 200) {
      Toast.fire({
        icon: "success",
        title: "Patient's personal information is updated successfully",
      });
      navigate(`/admin/patient/patientdetail/${id}/personalinfo`);
      setIsNavigate(true)    
    } else {
      Toast.fire({
        icon: "error",
        title: "Failed to update Patient's personal information",
      });
    }
  };
  survey.applyTheme(customTheme)
  survey.completeText = isNew ? "Save" : "Update";
  survey.addNavigationItem({
    id: "cancel",
    title: "Cancel",
    action: () => {
      navigate(`/admin/patient/patientdetail/${id}`);
    },
  });
  survey.onComplete.add(function (sender, options) {
    isNew ? saveSurveyData(sender) : updateSurveyData(sender);
  });

  survey.showQuestionNumbers = false;
  survey.sendResultOnPageNext = true;
  //Get Data
  const getData = async () => {
    const response = await api.post(
      `/formData/formDataSearchPatient/`,
      { patient_id: id, history: "personal_info" }
    );
    if (response.data.code == 200 && response.data.data.length !== 0) {
      const prevData = response.data.data[0].data.personal_info;
      survey.data = prevData;
      const form_id = response.data.data[0].id;
      setFormId(form_id);
      setIsNew(false);
    } else {
      setIsNew(true);
      return;
    }
  };
  useEffect(() => {
    getData();
  }, [formId,isNavigate]);
  return <Survey model={survey}/>;
}

export default PersonalInfo