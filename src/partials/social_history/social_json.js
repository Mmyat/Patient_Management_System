export const social_json = {
  pages: [
    {
      elements: [
        {
          type: "panel",
          name: "patient_form",
          elements: [
            {
              type: "radiogroup",
              choices: [
                {
                  value: "yes",
                  text: "Yes",
                },
                {
                  value: "no",
                  text: "No",
                },
              ],
              colCount: 0,
              isRequired: true,
              name: "alcohol",
              title: "Are you drinking?",
            },
            {
              type: "comment",
              inputType: "text",
              // isRequired: true,
              name: "alcohol long time",
              startWithNewLine: true,
              title:
                "If yes,how long have you been drinking?Please specify(year):",
              visible: false,
              visibleIf: '{alcohol} = "yes"',
            },
            {
              type: "text",
              inputType: "text",
              isRequired: true,
              name: "alcohol unit",
              startWithNewLine: true,
              title:
                "How many unit of alcohol do you drink per week?Please specify:",
              visible: false,
              visibleIf: '{alcohol} = "yes"',
            },
            {
              type: "radiogroup",
              choices: [
                {
                  value: "yes",
                  text: "Yes",
                },
                {
                  value: "no",
                  text: "No",
                },  
              ],
              colCount: 0,
              isRequired: true,
              name: "smoke",
              title: "Are you smoking?",
            },
            {
              type: "comment",
              inputType: "text",
              isRequired: true,
              name: "smoking long time",
              startWithNewLine: true,
              title:
                "If yes,how long have you been smoking?Please specify(year):",
              visible: false,
              visibleIf: '{smoke} = "yes"',
            },
            {
              type: "text",
              inputType: "number",
              isRequired: true,
              name: "smoke packs",
              startWithNewLine: true,
              title: "How many packs per day?Please specify:",
              visible: false,
              visibleIf: '{smoke} = "yes"',
            },
          ],
        },
      ],
    },
  ],
  showQuestionNumbers: "off",
  questionErrorLocation: "bottom",
  // completeText: "Register",
  width: "100vw",
  fitToContainer: true,
};
