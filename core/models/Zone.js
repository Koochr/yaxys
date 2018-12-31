module.exports = {
  schema: {
    title: "Zone",
    defaultProperties: ["id", "name", "description"],
    properties: {
      id: {
        type: "integer",
      },
      name: {
        title: "Name",
        type: "string",
      },
      description: {
        title: "Description",
        type: "string",
      },
      accessPoints: {
        title: "Access points",
        type: "array",
        virtual: true,
        connection: {
          type: "1:m",
          relatedModel: "accesspoint",
          relatedModelAttribute: "zoneTo",
        },
      },
      doors: {
        title: "Doors",
        type: "array",
        virtual: true,
        connection: {
          type: "m:m",
          linkerModel: "accesspoint",
          linkerMyAttribute: "zoneTo",
          linkerRelatedAttribute: "door",
        },
      },
    },
  },

  api: RestService.buildStandardAPI("zone"),
}
