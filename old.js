const feedback_schema = {
  type: "object",
  properties: {
    score: {
      type: "integer",
      description: "A rating integer strictly between 1 and 10 inclusive."
    },
    feedback: {
        type: "integer",
        description: "Feedback on the person's answer"
    },
  },
  required: ["score", "feedback"]
}; 

const zode_feedback_schema=z.fromJSONSchema(feedback_schema);