import {useNavigate,useParams} from "react-router-dom";
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
    console.log("patient_id", id);
    const med_data = {
      patient_id: id,
      data: {
        objectives_concerns: data,
      },
    };
    console.log("history:", med_data);
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_DOMAIN}/formData/formDataCreate`,
      med_data
    );
    console.log("objecitves :", response.data);
    if (response.data.code == 200) {
      Toast.fire({
        icon: "success",
        title: "New Patient's objectives/concerns is saved successfully",
      });
      navigate(`/admin/patient/patientdetail/${id}`);
    } else {
      Toast.fire({
        icon: "error",
        title: "Failed to save new patient's objectives/concerns",
      });
    }
  };
  //
  const updateSurveyData = async (survey) => {
    const data = survey.data;
    delete data.age;
    console.log("update_data", data);
    const soc_data = {
      patient_id: id,
      data: {
        objectives_concerns: data,
      },
    };
    const response = await axios.put(
      `${import.meta.env.VITE_SERVER_DOMAIN}/formData/formDataUpdate/${formId}`,
      soc_data
    );
    console.log("update", response.data);
    if (response.data.code == 200) {
      Toast.fire({
        icon: "success",
        title: "Patient's objectives/concerns is updated successfully",
      });
      navigate(`/admin/patient/patientdetail/${id}`);
      console.log("response data", response.data);
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
      console.log("Cancel button clicked!");
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
    console.log("Id :",id);
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_DOMAIN}/formData/formDataSearchPatient/`,
      { patient_id: id, history: "objectives_concerns" }
    );
    console.log(response.data);
    if (response.data.code == 200 && response.data.data.length !== 0) {
      const prevData = response.data.data[0].data.objectives_concerns;
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
    console.log("id :",id);
  }, [formId]);
  return <Survey model={survey}/>;
};

export default Objective;
