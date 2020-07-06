import "@babel/polyfill";
const dotenv = require("dotenv");
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
const { ApolloServer } = require("apollo-server-koa");
dotenv.config();
const typeDefs = require("../schema");
const resolvers = require("../resolvers");
import graphQLProxy, { ApiVersion } from "@shopify/koa-shopify-graphql-proxy";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
import session from "koa-session";
const SettingsAPI = require("../datasources/settings");
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const mongo = require("koa-mongo");
const {
  receiveWebhook,
  registerWebhook,
} = require("@shopify/koa-shopify-webhooks");

const nextjs = next({
  dev,
});
const handle = nextjs.getRequestHandler();
const { SHOPIFY_API_KEY, SHOPIFY_API_SECRET_KEY, HOST } = process.env;

nextjs.prepare().then(() => {
  const app = new Koa();
  const router = new Router();
  app.use(
    session(
      {
        sameSite: "none",
        secure: true,
      },
      app
    )
  );
  app.keys = [SHOPIFY_API_KEY];
  app.use(mongo());
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => {
      return {
        settingsAPI: new SettingsAPI(),
      };
    },
    context: ({ ctx }) => ctx,
  });

  server.applyMiddleware({ app });

  app.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET_KEY,
      scopes: ["read_products", "write_products"],

      async afterAuth(ctx) {
        const { shop, accessToken } = ctx.session;
        ctx.cookies.set("shopOrigin", shop, {
          httpOnly: false,
          secure: true,
          sameSite: "none",
        });

        const registration = await registerWebhook({
          address: `${HOST}/webhooks/app/uninstalled`,
          topic: "APP_UNINSTALLED",
          accessToken,
          shop,
          apiVersion: ApiVersion.October19,
        });

        if (registration.success) {
          console.log("Successfully registered webhook!");
        } else {
          console.log("Failed to register webhook", registration.result);
        }
        ctx.redirect("/");
      },
    })
  );

  const webhook = receiveWebhook({ secret: SHOPIFY_API_SECRET_KEY });

  router.post("/webhooks/app/uninstalled", webhook, async (ctx) => {
    await SettingsAPI.removeSetting(ctx.state.webhook.payload.id);
  });

  app.use(
    graphQLProxy({
      version: ApiVersion.October19,
    })
  );
  router.get("*", verifyRequest(), async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  });
  app.use(router.allowedMethods());
  app.use(router.routes());
  app.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
