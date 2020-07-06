module.exports = {
  Query: {
    settings: async (_, { id_shop }, { dataSources }) => {
      const settings = await dataSources.settingsAPI.getSettings(id_shop);
      if (settings) return settings;
    },
  },
  Mutation: {
    updateSetting: async (
      _,
      {
        id_shop,
        emailSubject,
        emailTemplate,
        senderName,
        senderEmail,
        hostName,
        hostPort,
      },
      { dataSources }
    ) => {
      const setting = await dataSources.settingsAPI.saveSetting({
        id_shop,
        emailSubject,
        emailTemplate,
        senderName,
        senderEmail,
        hostName,
        hostPort,
      });
      if (setting) {
        return {
          status: true,
          msg: "Update succesfully",
        };
      } else {
        return {
          status: false,
          msg: "Update fail",
        };
      }
    },
  },
};
