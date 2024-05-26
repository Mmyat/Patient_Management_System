import { useNavigate } from "react-router-dom";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";
import { personal_json } from "./personal_info_json";
import axios from "axios";
import Swal from "sweetalert2";
import { useStateContext } from "../../context/ContextProvider";
import { useEffect, useState } from "react";
import { inputmask } from "surveyjs-widgets";
import * as SurveyCore from "survey-core";
inputmask(SurveyCore)
const PersonalInfo = () => {
  const navigate = useNavigate();
  const survey = new Model(personal_json);
  const { patientId } = useStateContext();
  const [isNew, setIsNew] = useState(true);
  const [formId, setFormId] = useState(null);
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
  const saveSurveyData = async (survey) => {
    const data = survey.data;
    delete data.age;
    console.log("patient_id", patientId);
    const med_data = {
      patient_id: patientId,
      data: {
        personal_info: data,
      },
    };
    console.log("history:", med_data);
    const response = await axios.post(
      "http://localhost:3000/formData/formDataCreate",
      med_data
    );
    console.log("objecitves :", response.data);
    if (response.data.code == 200) {
      Toast.fire({
        icon: "success",
        title: "New Patient's family medical history is saved successfully",
      });
      navigate(-1);
    } else {
      Toast.fire({
        icon: "error",
        title: "Failed to save new patient's family medical history",
      });
    }
  };
  //
  const updateSurveyData = async (survey) => {
    const data = survey.data;
    delete data.age;
    console.log("update_data", data);
    const soc_data = {
      patient_id: patientId,
      data: {
        personal_info: data,
      },
    };
    const response = await axios.put(
      `http://localhost:3000/formData/formDataUpdate/${formId}`,
      soc_data
    );
    console.log("update", response.data);
    if (response.data.code == 200) {
      Toast.fire({
        icon: "success",
        title: "Patient's social history is updated successfully",
      });
      navigate(-1);
      console.log("response data", response.data);
    } else {
      Toast.fire({
        icon: "error",
        title: "Failed to update Patient's social history",
      });
    }
  };
  survey.completeText = isNew ? "Save" : "Update";
  survey.addNavigationItem({
    id: "cancel",
    title: "Cancel",
    action: () => {
      console.log("Cancel button clicked!");
      navigate(-1);
    },
  });
  survey.onComplete.add(function (sender, options) {
    isNew ? saveSurveyData(sender) : updateSurveyData(sender);
  });

  survey.showQuestionNumbers = false;
  survey.sendResultOnPageNext = true;
  //Get Data
  const getData = async () => {
    console.log("Id :",patientId);
    const response = await axios.post(
      `http://localhost:3000/formData/formDataSearchPatient/`,
      { patient_id: patientId, history: "personal_info" }
    );
    console.log(response.data);
    if (response.data.code == 200 && response.data.data.length !== 0) {
      const prevData = response.data.data[0].data.personal_info;
      survey.data = prevData;
      console.log("previos data", prevData);
      const form_id = response.data.data[0].id;
      setFormId(form_id);
      console.log("formId", formId);
      setIsNew(false);
    } else {
      setIsNew(true);
      return;
    }
  };
  useEffect(() => {
    getData();
    console.log("id :",patientId);
  }, [formId]);
  return <Survey model={survey}/>;
}

export default PersonalInfo