const { DataSource } = require("apollo-datasource");

class SettingsAPI extends DataSource {
  constructor() {
    super();
  }

  initialize(config) {
    this.context = config.context;
  }

  async getSettings(id_shop) {
    return await this.context.db
      .collection("settings")
      .findOne({ id_shop: id_shop });
  }

  async saveSetting(data) {
    const { id_shop, ...update } = data;
    return await this.context.db.collection("settings").bulkWrite([
      {
        updateOne: {
          filter: { id_shop: id_shop },
          update: {
            $setOnInsert: { id_shop: id_shop },
            $set: update,
          },
          upsert: true,
        },
      },
    ]);
  }

  async removeSetting(id) {
    return await db.collection("settings").deleteOne({ id_shop: id });
  }
}

module.exports = SettingsAPI;
