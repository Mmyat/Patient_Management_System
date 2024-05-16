export const medical_json = {
    pages: [
      {
        elements: [
          {
            type: "panel",
            name: "patient_form",
            elements: [
                {
                    "type": "text",
                    "inputType": "number",
                    "isRequired": true,
                    "name": "first_period",
                    "startWithNewLine": true,
                    "title": "How old were you at your first menstral period?(year)"
                  },
                  {
                    "type": "text",
                    "inputType": "number",
                    "isRequired": true,
                    "name": "period_long_time",
                    "startWithNewLine": true,
                    "title": "How many days are between one menstral period and the next?(days)"
                  },
                  {
                    "type": "radiogroup",
                    "choices": [
                      {
                        "value": "regular",
                        "text": "Regular"
                      },
                      {
                        "value": "irregular",
                        "text": "Irregular"
                      },
                    ],
                    "colCount": 0,
                    "isRequired": true,
                    "name": "menstrual_pattern",
                    "title": "How is your menstrual pattern?"
                  },
                  {
                    "type": "text",
                    "inputType": "date",
                    "isRequired": true,
                    "name": "lmp_date",
                    "startWithNewLine": true,
                    "title": "When did your last menstral period start(LMP date)?"
                  },
                  {
                    "type": "text",
                    "inputType": "number",
                    "isRequired": true,
                    "name": "infertility_issue_year",
                    "startWithNewLine": true,
                    "title": "How long do you have infertility issue(year)?"
                  },
                  {
                    "type": "radiogroup",
                    "choices": [
                      {
                        "value": "no",
                        "text": "No"
                      },
                      {
                        "value": "yes",
                        "text": "Yes"
                      }
                    ],
                    "colCount": 0,
                    "isRequired": true,
                    "name": "haveChildren",
                    "title": "Do you have children?",               
                  },
                  {
                    "type": "text",
                    "inputType": "number",
                    "isRequired": true,
                    "name": "number_of_children",
                    "startWithNewLine": false,
                    "title": "Please specify",
                    "visible": false,
                    "visibleIf": "{haveChildren} = \"yes\""
                  },
                  {
                    "type": "radiogroup",
                    "choices": [
                      {
                        "value": "natural delivery",
                        "text": "Natural delivery"
                      },
                      {
                        "value": "cesarean section",
                        "text": "Cesarean section"
                      },
                    ],
                    "isRequired": true,
                    "name": "delivery_methods",
                    "startWithNewLine": true,
                    "title": "Refer to Q.6,what is delivery details type?",
                    "titleLocation": "top",
                    "visible": false,
                    "visibleIf": "{haveChildren} = \"yes\""
                  },
            ],
          },
        ],
      },
    ],
    showQuestionNumbers: "off",
    questionErrorLocation: "bottom",
    // completeText: "Register",
    width: "1024",
    fitToContainer: true
  };
  