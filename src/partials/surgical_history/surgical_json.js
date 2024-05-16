export const surgical_json = {
  pages: [
    {
      elements: [
        {
          type: "panel",
          name: "patient_form",
          elements: [
            {
              type: "matrixdynamic",
              name: "history_list",
              title: "Recent shots from a doctor or pharmacist",
              titleLocation: "hidden",
              columns: [
                {
                  name: "date",
                  title: "Date",
                  inputType: "date",
                  isRequired: true,
                },
                {
                  name: "procedure",
                  title: "Procedure:",
                  inputType: "comment",
                  isRequired: true,
                },
              ],
              cellType: "text",
              rowCount: 1,
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
