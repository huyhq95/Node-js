const { ApolloServer } = require('apollo-server-koa');
const Koa = require('koa');
const mongo = require('koa-mongo')
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');
const next = require('next')
const Router = require('koa-router')
const dotenv = require('dotenv');
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
dotenv.config();
const { default: graphQLProxy } = require('@shopify/koa-shopify-graphql-proxy');
const { ApiVersion } = require('@shopify/koa-shopify-graphql-proxy');
const { receiveWebhook, registerWebhook } = require('@shopify/koa-shopify-webhooks');

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY, HOST, } = process.env;

const nextjs = next({ dev })
const handle = nextjs.getRequestHandler()


nextjs.prepare().then(() => {
    const app = new Koa();
    const router = new Router()
    app.keys = [SHOPIFY_API_SECRET_KEY];
    app.use(mongo());
    app.use(session({ secure: true, sameSite: 'none' }, app));

    // const server = new ApolloServer({
    //     typeDefs,
    //     resolvers,
    //     dataSources: () => {
    //         return {
    //             employeesAPI: new EmployeesAPI(),
    //             userAPI: new UserAPI(),
    //         };
    //     },
    //     context: ({ ctx }) => ctx,
    // });

    // server.applyMiddleware({ app });

    app.use(
        createShopifyAuth({
            apiKey: SHOPIFY_API_KEY,
            secret: SHOPIFY_API_SECRET_KEY,
            scopes: ['read_products', 'write_products'],
            async afterAuth(ctx) {
                const { shop, accessToken } = ctx.session;
                console.log('afterAuth', shop)
                ctx.cookies.set('shopOrigin', shop, {
                    httpOnly: false,
                    secure: true,
                    sameSite: 'none'
                });
                const registration = await registerWebhook({
                    address: `${HOST}/webhooks/products/create`,
                    topic: 'PRODUCTS_CREATE',
                    accessToken,
                    shop,
                    apiVersion: ApiVersion.October19
                });

                if (registration.success) {
                    console.log('Successfully registered webhook!');
                } else {
                    console.log('Failed to register webhook', registration.result);
                }
                ctx.redirect('/');
            },
        }),
    );

    const webhook = receiveWebhook({ secret: SHOPIFY_API_SECRET_KEY });

    router.post('/webhooks/products/create', webhook, (ctx) => {
        console.log('received webhook: ', ctx.state.webhook);
    });

    app.use(graphQLProxy({ version: ApiVersion.October19 }))

    router.all('/(.*)', verifyRequest(), async (ctx, next) => {
        ctx.res.session = ctx.session;
        await handle(ctx.req, ctx.res)
        ctx.respond = false;
        ctx.res.statusCode = 200;
    })

    app.use(async (ctx, next) => {
        ctx.res.statusCode = 200
        await next()
    })
    app.use(router.allowedMethods());
    app.use(router.routes())

    app.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`)
    })
})
