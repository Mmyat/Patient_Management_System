import React from "react";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";
import $ from "jquery";
import * as SurveyCore from "survey-core";
import Inputmask from "inputmask";
import { inputmask } from "surveyjs-widgets";

const surveyJSON = {
    "elements": [
      {
        "name": "date",
        "type": "text",
        "title": "Your favorite date:",
        "inputMask": "datetime",
        "inputFormat": "yyyy/mm/dd",
        "isRequired": true
      }
    ]
  };
  inputmask(SurveyCore);
const DateTest = () => {
  const survey = new Model(surveyJSON);
  survey.completedHtml = "";
  survey.onComplete.add((sender, options) => {
      console.log(JSON.stringify(sender.data, null, 3));
  });
    return <Survey model={survey} />;
}

export default DateTest