export const json = {
    "pages": [
      {
        "elements": [
          {
            "type": "panel",
            "name": "",
            "elements": [
              {
                "type": "multipletext",
                "name": "Patient's name",
                "title": "Patient's name",
                "titleLocation": "hidden",
                "width": "40%",
                "minWidth": "172px",
                "items": [
                    {
                      "name": "date",
                      "inputType": "text",
                      "title": "Patient's name",
                    },
                  ],
                "isRequired": true
              },
              {
                "type": "multipletext",
                "name": "patient's dob",
                "titleLocation": "hidden",
                "width": "40%",
                "minWidth": "172px",
                "startWithNewLine": false,
                "items": [
                  {
                    "name": "patient's dob",
                    "inputType": "date",
                    "maxValueExpression": "today()",
                    "title": "Patient's DOB",
                    "titleLocation": "hidden",
                  },
                ],
                "isRequired": true
              },
              {
                "type": "multipletext",
                "name": "patient's age",
                "title": "Patient's age",
                "titleLocation": "hidden",           
                "width": "40%",
                "minWidth": "172px",
                "startWithNewLine": false,
                "items": [
                    {
                      "type": "expression",
                      "setValueExpression": "23",
                      "name": "patient's age",
                      "title": "Patient's age:",
                      "display": true,
                    },
                  ],
                "isRequired": true
              },
              {
                "type": "multipletext",
                "name": "patient's weight",
                "title": "Patient's weight",
                "titleLocation": "hidden",
                "width": "40%",
                "minWidth": "172px",
                "startWithNewLine": false,
                "items": [
                    {
                      "name": "patient's weight",
                      "inputType": "number",
                      "title": "Patient's weight(lb)",
                    },
                  ],
                "isRequired": true
              },
              {
                "type": "multipletext",
                "name": "Partner's name",
                "title": "Partner's name",
                "titleLocation": "hidden",
                "width": "40%",
                "minWidth": "172px",
                "startWithNewLine": true,
                "items": [
                    {
                      "name": "partner's name",
                      "inputType": "text",
                      "title": "Partner's name",
                    },
                  ],
                "isRequired": true
              },
              {
                "type": "multipletext",
                "name": "Partner's DOB",
                "titleLocation": "hidden",
                "width": "40%",
                "minWidth": "172px",
                "startWithNewLine": false,
                "items": [
                  {
                    "name": "partner's DOB",
                    "inputType": "date",
                    "maxValueExpression": "today()",
                    "title": "Partner's DOB",
                    "titleLocation": "hidden",
                  },
                ],
                "isRequired": true
              },
              {
                "type": "multipletext",
                "name": "Partner's weight",
                "title": "Partner's weight",
                "titleLocation": "hidden",
                "width": "40%",
                "minWidth": "172px",
                "startWithNewLine": false,
                "items": [
                    {
                      "name": "partner's weight",
                      "inputType": "number",
                      "title": "Partner's weight(lb)",
                    },
                  ],
                "isRequired": true
              },
              {
                "type": "comment",
                "name": "Partner's weight",
                "title": "Partner's weight",
                "placeholder" : "Objectives/Concerns(specify)",
                "titleLocation": "hidden",
                "width": "40%",
                "minWidth": "172px",
                "startWithNewLine": true,
                "isRequired": true
              }
            ],
            "questionTitleLocation": "top",
            "title": "Basic Information"
          },
          {
            "type": "panel",
            "name": "panel2",
            "elements": [
              {
                "type": "text",
                "inputType": "number",
                "isRequired": true,
                "name": "first period",
                "startWithNewLine": true,
                "title": "How old were you at your first menstral period?(year)"
              },
              {
                "type": "text",
                "inputType": "number",
                "isRequired": true,
                "name": "period long time",
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
                "name": "injuriesbrokenbones",
                "title": "How is your menstrual pattern?"
              },
              {
                "type": "text",
                "inputType": "date",
                "isRequired": true,
                "name": "birthDate",
                "startWithNewLine": true,
                "title": "When did your last menstral period start(LMP date)?"
              },
              {
                "type": "text",
                "inputType": "number",
                "isRequired": true,
                "name": "period long time",
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
                "name": "number of children",
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
                "name": "delivery methods",
                "startWithNewLine": true,
                "title": "Refer to Q.6,what is delivery details type?",
                "titleLocation": "top",
                "visible": false,
                "visibleIf": "{haveChildren} = \"yes\""
              },
            ],
            "questionTitleLocation": "left",
            "title": "Female Medical History"
          },

          {
            "type": "panel",
            "name": "panel1",
            "elements": [
              {
                "type": "matrixdynamic",
                "name": "recent-shots",
                "title": "Recent shots from a doctor or pharmacist",
                "titleLocation": "hidden",
                "columns": [
                {
                  "name": "date",
                  "title": "Date",
                  "inputType": "date",
                },
                {
                  "name": "procedure",
                  "title": "Procedure:",
                  "inputType": "comment",
                }
                ],
                "cellType": "text",
                "rowCount": 1,
              },
            ],
            "title": "Female Surgical History"
          },
          {
            "type": "panel",
            "name": "panel5",
            "elements": [
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
                "title": "Are there medical or genetic problems in your family?",               
              },
              {
                "type": "comment",
                "inputType": "number",
                "isRequired": true,
                "name": "number of children",
                "startWithNewLine": true,
                "title": "If yes,please explain:",
                "visible": false,
                "visibleIf": "{haveChildren} = \"yes\""
              },
            ],
            "title": "Female Famaliy Medical History"
          },{
            "type": "panel",
            "name": "panel5",
            "elements": [
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
                "name": "alcohol",
                "title": "Are you drinking?",               
              },
              {
                "type": "text",
                "inputType": "number",
                "isRequired": true,
                "name": "alcohol long time",
                "startWithNewLine": true,
                "title": "If yes,how long have you been drinking?Please specify(year):",
                "visible": false,
                "visibleIf": "{haveChildren} = \"yes\""
              },
              {
                "type": "text",
                "inputType": "number",
                "isRequired": true,
                "name": "alcohol unit",
                "startWithNewLine": true,
                "title": "How many unit of alcohol do you drink per week?Please specify:",
                "visible": false,
                "visibleIf": "{haveChildren} = \"yes\""
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
                "name": "smoke",
                "title": "Are you smoking?",               
              },
              {
                "type": "text",
                "inputType": "number",
                "isRequired": true,
                "name": "smoking long time",
                "startWithNewLine": true,
                "title": "If yes,how long have you been smoking?Please specify(year):",
                "visible": false,
                "visibleIf": "{haveChildren} = \"yes\""
              },
              {
                "type": "text",
                "inputType": "number",
                "isRequired": true,
                "name": "smoke packs",
                "startWithNewLine": true,
                "title": "How many packs per day?Please specify:",
                "visible": false,
                "visibleIf": "{haveChildren} = \"yes\""
              },
            ],
            "title": "Female Social History"
          }
        ],
        "name": "introduction",
        "title": "Patient Form"
      },
      
    ],
    "showProgressBar": "hidden",
    "showQuestionNumbers": "off",
    "title": "New Patient Form",
    "questionErrorLocation": "bottom"
  };