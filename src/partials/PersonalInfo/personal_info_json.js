export const personal_json = {
    pages: [
      {
        elements: [
          {
            type: "panel",
            name: "patient_form",
            elements: [
              
              {
                "name": "decimal",
                "type": "text",
                "title": "Weight(lb):",
                "inputMask": "decimal"
              },
              {
                "name": "phone",
                "type": "text",
                "title": "Phone:",
                "inputMask": "phone",
                "inputFormat": "99999999999",
                "startWithNewLine": true
             },
             {
                "name": "email",
                "type": "text",
                "title": "Email address:",
                "inputMask": "email",
                "startWithNewLine": true
             }
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
