export const createFormSchema = {
  type: "object",
  required: ["title", "fields"],
  additionalProperties: false,

  properties: {
    title: { type: "string", minLength: 1 },

    fields: {
      type: "array",
      minItems: 1,

      items: {
        type: "object",
        required: ["label", "type"],
        additionalProperties: false,

        properties: {
          label: { type: "string", minLength: 1 },

          type: {
            type: "string",
            enum: ["TEXT", "NUMBER", "DATE", "DROPDOWN", "CHECKBOX"],
          },

       
          options: {
            type: "array",
            items: { type: "string", minLength: 1 }
          },

        
          order: {
            type: "integer",
            minimum: 0
          },

        
          validations: {
            type: "object",
            additionalProperties: false,
            properties: {
              required: { type: "boolean" },
              onlyText: { type: "boolean" },
              min: { type: "number" },
              max: { type: "number" },
              minLength: { type: "number" },
              maxLength: { type: "number" },
              pattern: { type: "string" }
            }
          },

         
          condition: {
            type: "object",
            additionalProperties: false,
            required: ["fieldId", "operator", "value"],
            properties: {
              fieldId: { type: "string" },

              operator: {
                type: "string",
                enum: ["EQUALS", "NOT_EQUALS", "GT", "LT"]
              },

              value: {}
            }
          }
        },

        //  CONDITIONAL VALIDATION
        allOf: [
          {
            if: {
              properties: { type: { const: "DROPDOWN" } }
            },
            then: {
              required: ["options"],
              properties: {
                options: { minItems: 1 }
              }
            }
          },

        
          {
            if: {
              properties: { type: { const: "CHECKBOX" } }
            },
            then: {
              not: {
                required: ["options"]
              }
            }
          }
        ]
      }
    }
  }
};