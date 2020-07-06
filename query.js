import { gql } from "apollo-boost";

export const GET_SETTINGS = gql`
  {
    settings(id_shop: 1) {
      emailSubject
      emailTemplate
      senderName
      senderEmail
      hostName
      hostPort
    }
  }
`;

export const SAVE_SETTINGS = gql`
  mutation updateSetting(
    $id_shop: Int
    $emailSubject: String
    $emailTemplate: String
    $senderName: String
    $senderEmail: String
    $hostName: String
    $hostPort: String
  ) {
    updateSetting(
      id_shop: $id_shop
      emailSubject: $emailSubject
      emailTemplate: $emailTemplate
      senderName: $senderName
      senderEmail: $senderEmail
      hostName: $hostName
      hostPort: $hostPort
    )
  }
`;
