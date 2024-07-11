import { useNavigate, useParams } from "react-router-dom";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import { objective_json } from "./objective_json";
import axios from "axios";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

const Objective = () => {
  const navigate = useNavigate();
  const survey = new Model(objective_json);
  const { id } = useParams();
  const [isNew, setIsNew] = useState(true);
  const [formId, setFormId] = useState(null);
  const [surveyKey, setSurveyKey] = useState(Date.now());
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

  const resetSurvey = () => {
    survey.clear();
    setSurveyKey(Date.now());
  };

  const saveSurveyData = async (survey) => {
    const data = survey.data;
    delete data.age;
    const form_data = {
      patient_id: id,
      data: {
        "objectives_concerns": data,
      },
    };
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_DOMAIN}/formData/formDataCreate`,
      form_data
    );
    console.log("save res--",response);
    if (response.data.code === '200') {
      Toast.fire({
        icon: "success",
        title: "New Patient's objectives/concerns is saved successfully",
      });
      navigate(`/admin/patient/patientdetail/${id}/objectives`);
      setIsNavigate(true)
    } else {
      Toast.fire({
        icon: "error",
        title: "Failed to save new patient's objectives/concerns",
      });
    }
  };

  const updateSurveyData = async (survey) => {
    const data = survey.data;
    delete data.age;
    const form_data = {
      patient_id: id,
      data: {
        "objectives_concerns": data,
      },
    };
    const response = await axios.put(
      `${import.meta.env.VITE_SERVER_DOMAIN}/formData/formDataUpdate/${formId}`,
      form_data
    );
    if (response.data.code === '200') {
      Toast.fire({
        icon: "success",
        title: "Patient's objectives/concerns is updated successfully",
      });
      navigate(`/admin/patient/patientdetail/${id}/objectives`);
      setIsNavigate(true)
    } else {
      Toast.fire({
        icon: "error",
        title: "Failed to update Patient's objectives/concerns",
      });
    }
  };

  survey.completeText = isNew ? "Save" : "Update";
  survey.addNavigationItem({
    id: "cancel",
    title: "Cancel",
    action: () => {
      navigate(`/admin/patient/patientdetail/${id}`);
    },
  });

  survey.onComplete.add(function (sender) {
    isNew ? saveSurveyData(sender) : updateSurveyData(sender);
  });

  survey.showQuestionNumbers = false;
  survey.sendResultOnPageNext = true;

  const getData = async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_DOMAIN}/formData/formDataSearchPatient/`,
      { patient_id: id, history: "objectives_concerns" }
    );
    if (response.data.code === '200' && response.data.data.length > 0) {
      const prevData = response.data.data[0].data.objectives_concerns;
      survey.data = prevData;
      const form_id = response.data.data[0].id;
      setFormId(form_id);
      setIsNew(false);
    } else {
      setIsNew(true);
    }
  };

  useEffect(() => {
    getData();
  }, [formId,isNavigate]);

  return <Survey model={survey} key={surveyKey} />;
};

export default Objective;
