module.exports = {
  schema: {
    title: "User",
    i18Key: "USER",
    defaultProperties: ["id", "name"],
    properties: {
      id: {
        type: "integer",
      },
      name: {
        title: "Name",
        type: "string",
      },
      profiles: {
        title: "User profiles",
        type: "array",
        virtual: true,
        connection: {
          type: "m:m",
          linkerModel: "UserProfileBinding",
          linkerMyAttribute: "user",
          linkerRelatedAttribute: "userProfile",
        },
      },
      hasCustomRights: {
        title: "Has custom rights",
        readOnly: true,
        type: "boolean",
      },
      credentials: {
        title: "Credentials",
        type: "array",
        virtual: true,
        connection: {
          type: "1:m",
          relatedModel: "Credential",
          relatedModelAttribute: "user",
        },
      },
    },
    required: ["name"],
  },

  api: RestService.buildStandardAPI("user"),

  hooks: {
    "delete:after": async (trx, old) => {
      const relatedEntities = ["accessright", "credential", "userprofilebinding"]

      for (const entity of relatedEntities) {
        const items = await yaxys.db.find(trx, entity, { user: old.id })
        for (const item of items) {
          await yaxys.db.delete(trx, entity, item.id)
        }
      }
    },
  },
}
