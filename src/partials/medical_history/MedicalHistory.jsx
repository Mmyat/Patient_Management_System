import { useNavigate } from "react-router-dom";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import { medical_json } from "./medical_json";
import axios from "axios";
import Swal from "sweetalert2";
import { useStateContext } from "../../context/ContextProvider";
import { useEffect, useState } from "react";

const MedicalHistory = () => {
  const navigate = useNavigate();

  const survey = new Model(medical_json);
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
  survey.completeText = isNew ? "Save" : "Update";
  const saveSurveyData = async (survey) => {
    const data = survey.data;
    delete data.age;
    console.log("patient_id", patientId);
    const med_data = {
      patient_id: patientId,
      data: {
        med_history: data,
      },
    };
    console.log("history:", med_data);
    const response = await axios.post(
      "http://localhost:3000/formData/formDataCreate",
      med_data
    );
    console.log("med_history", response.data);
    if (response.data.code == 200) {
      Toast.fire({
        icon: "success",
        title: "New Patient's medical history is saved successfully",
      });
      navigate(-1);
    } else {
      Toast.fire({
        icon: "error",
        title: "Failed to save new patient's medical history",
      });
    }
  };
  //
  const updateSurveyData = async (survey) => {
    const data = survey.data;
    delete data.age;
    console.log("update_data", data);
    const med_data = {
      patient_id: patientId,
      data: {
        med_history: data,
      },
    };
    const response = await axios.put(
      `http://localhost:3000/formData/formDataUpdate/${formId}`,
      med_data
    );
    console.log("update", response.data);
    if (response.data.code == 200) {
      Toast.fire({
        icon: "success",
        title: "Patient's medical history is updated successfully",
      });
      navigate(-1);
      console.log("response data", response.data);
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
    const response = await axios.post(
      `http://localhost:3000/formData/formDataSearchPatient/`,
      { patient_id: patientId, history: "med_history" }
    );
    console.log(response.data);
    if (response.data.code == 200) {
      console.log("get",response.data.data[0].data);
      const prevData = response.data.data[0].data.med_history;
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
  }, [formId]);
  return <Survey model={survey} />;
};

export default MedicalHistory;
// {
//   first_period: 3;
//   haveChildren: "no";
//   infertility_issue_year: 8;
//   lmp_date: "2023-04-21";
//   menstrual_pattern: "regular";
//   period_long_time: 5;
// }
