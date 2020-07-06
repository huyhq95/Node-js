const { gql } = require("apollo-server-koa");

const typeDefs = gql`
  scalar JSON
  type Query {
    settings(id_shop: Int): Settings
  }
  type Mutation {
    updateSetting(
      id_shop: Int
      emailSubject: String
      emailTemplate: String
      senderName: String
      senderEmail: String
      hostName: String
      hostPort: String
    ): JSON
  }

  type Settings {
    emailSubject: String
    emailTemplate: String
    senderName: String
    senderEmail: String
    hostName: String
    hostPort: String
  }
`;
module.exports = typeDefs;
