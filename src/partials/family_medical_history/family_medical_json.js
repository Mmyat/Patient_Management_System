export const family_medical_json = {
  pages: [
    {
      elements: [
        {
          type: "panel",
          name: "panel5",
          elements: [
            {
              type: "radiogroup",
              choices: [
                {
                  value: "no",
                  text: "No",
                },
                {
                  value: "yes",
                  text: "Yes",
                },
              ],
              colCount: 0,
              isRequired: true,
              name: "genetic_problems",
              title: "Are there medical or genetic problems in your family?",
            },
            {
              type: "comment",
              inputType: "number",
              isRequired: true,
              name: "problem_explain",
              startWithNewLine: true,
              title: "If yes,please explain:",
              visible: false,
              visibleIf: '{genetic_problems} = "yes"',
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
  fitToContainer: true,
};
