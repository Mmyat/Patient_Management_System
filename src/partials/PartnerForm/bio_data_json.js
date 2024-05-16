export const bioJson = {
  pages: [
    {
      elements: [
        {
          type: "panel",
          name: "patient_form",
          elements: [
            {
              type: "text",
              name: "name",
              inputType: "text",
              title: "Name",
              // titleLocation: "hidden",
              // placeholder: "Name",
              isRequired: true,
            },
            {
              type: "text",
              name: "dob",
              inputType: "date",
              maxValueExpression: "today()",
              title: "Date of Birth",
              dateFormat : "dd/mm/yy",
              startWithNewLine: true,
              isRequired: true,
            },
            {
              type: "expression",
              name: "age",
              title: "Age:",
              titleLocation: "left",
              expression: "age({dob})",
              isRequired: true,
            },
            {
              type: "text",
              name: "nrc",
              inputType: "text",
              title: "NRC(No)",
              // titleLocation: "hidden",
              // placeholder: "NRC No.",
              startWithNewLine: true,
              isRequired: true,
            },
            {
              type: "radiogroup",
              choices: [
                {
                  value: "male",
                  text: "Male",
                },
                {
                  value: "female",
                  text: "Female",
                },
              ],
              colCount: 0,
              isRequired: true,
              name: "gender",
              title: "Gender:",
            },
            // {
            //   type: "comment",
            //   name: "objectives",
            //   title: "objectives",
            //   placeholder: "Objectives/Concerns(specify)",
            //   titleLocation: "hidden",
            //   width: "40%",
            //   minWidth: "172px",
            //   startWithNewLine: true,
            //   isRequired: true,
            // },
          ],
        },
      ],
    },
  ],
  showQuestionNumbers: "off",
  questionErrorLocation: "bottom",
  width: "1024",
  fitToContainer: true,
};
//{"medical-his":{
//    "first period": 12,
//    "period long time": 23,
//    "injuriesbrokenbones": "regular",
//    "birthDate": "2024-03-21",
//    "haveChildren": "yes",
//    "number of children": 1,
//    "delivery methods": "natural delivery"
//  }
// }