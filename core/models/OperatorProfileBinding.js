module.exports = {
  schema: {
    properties: {
      id: {
        type: "integer",
      },
      operator: {
        title: "Operator",
        type: "integer",
        model: "Operator",
      },
      operatorProfile: {
        title: "Operator Profile",
        type: "integer",
        model: "OperatorProfile",
      },
    },
    required: [],
  },

  api: {

  },
}