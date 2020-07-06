import React, { useEffect, useState } from "react";
import { useField, useForm, notEmpty } from "@shopify/react-form";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { isEmpty } from "lodash";
import { GET_SETTINGS, SAVE_SETTINGS } from "../query.js";

import {
  Page,
  Layout,
  FormLayout,
  Form,
  Card,
  TextField,
  Frame,
  Button,
} from "@shopify/polaris";

export default function Index(props) {
  getSettings(GET_SETTINGS);
  const [data, setData] = useState({});
  const [saveSetting] = useMutation(SAVE_SETTINGS);
  const { fields, submit } = useForm({
    fields: {
      emailSubject: useField({
        value: !isEmpty(data.emailSubject) ? data.emailSubject : "",
        validates: [notEmpty("Email subject is required")],
      }),
      emailTemplate: useField({
        value: !isEmpty(data.emailTemplate) ? data.emailTemplate : "",
        validates: [notEmpty("Email template is required")],
      }),
      senderName: useField({
        value: !isEmpty(data.senderName) ? data.senderName : "",
        validates: [notEmpty("Sender name is required")],
      }),
      senderEmail: useField({
        value: !isEmpty(data.senderEmail) ? data.senderEmail : "",
        validates: (email) => {
          if (email.length == 0) {
            return "Sender email port is required";
          } else if (
            !/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.([a-zA-Z0-9-]{1,10})$/i.test(
              email
            )
          ) {
            return "Email invalid";
          }
        },
      }),
      hostName: useField({
        value: !isEmpty(data.hostName) ? data.hostName : "",
        validates: [notEmpty("Hostname is required")],
      }),
      hostPort: useField({
        value: !isEmpty(data.hostPort) ? data.hostPort : "",
        validates: (port) => {
          if (port.length == 0) {
            return "Host port is required";
          } else if (isNaN(port)) {
            return "Host port must be a number";
          }
        },
      }),
    },
    async onSubmit(form) {
      saveSetting({
        variables: {
          id_shop: 1,
          emailSubject: form.emailSubject,
          emailTemplate: form.emailTemplate,
          senderName: form.senderName,
          senderEmail: form.senderEmail,
          hostName: form.hostName,
          hostPort: form.hostPort,
        },
      });
      return { status: "success" };
    },
  });

  async function getSettings() {
    await props.client
      .query({
        query: GET_SETTINGS,
      })
      .then(({ data }) => {
        setData(data.settings);
      });
  }

  return (
    <Frame>
      <Form onSubmit={submit}>
        <Page title="Settings" fullWidth={true}>
          <Layout>
            <Layout.Section oneHalf>
              <Card sectioned>
                <FormLayout>
                  <TextField
                    label="Email Subject"
                    value={fields.emailSubject.value}
                    {...fields.emailSubject}
                  />
                  <TextField
                    multiline
                    label="Email Template"
                    {...fields.emailTemplate}
                  />
                </FormLayout>
              </Card>
            </Layout.Section>
            <Layout.Section oneHalf>
              <Card sectioned>
                <FormLayout>
                  <TextField label="Sender name" {...fields.senderName} />
                  <TextField
                    multiline
                    label="Sender email"
                    {...fields.senderEmail}
                  />
                </FormLayout>
              </Card>
            </Layout.Section>
            <Layout.Section oneHalf>
              <Card sectioned>
                <FormLayout>
                  <TextField label="Hostname" {...fields.hostName} />
                  <TextField multiline label="Hostport" {...fields.hostPort} />
                </FormLayout>
              </Card>
            </Layout.Section>
          </Layout>
          <Button primary onClick={submit}>
            Save
          </Button>
        </Page>
      </Form>
    </Frame>
  );
}
