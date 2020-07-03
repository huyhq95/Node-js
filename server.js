const { ApolloServer } = require('apollo-server-koa');
const Koa = require('koa');
const mongo = require('koa-mongo')
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const EmployeesAPI = require('./datasources/employees');
const UserAPI = require('./datasources/user');
const session = require('koa-session');

const next = require('next')
const Router = require('koa-router')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const nextjs = next({ dev })
const handle = nextjs.getRequestHandler()


nextjs.prepare().then(() => {
    const app = new Koa();
    const router = new Router()
    app.keys = ['koajs'];
    app.use(mongo());
    app.use(session(app));

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        dataSources: () => {
            return {
                employeesAPI: new EmployeesAPI(),
                userAPI: new UserAPI(),
            };
        },
        context: ({ ctx }) => ctx,
    });
    
    server.applyMiddleware({ app });

    router.all('/(.*)', async (ctx, next) => {
        ctx.res.session = ctx.session;
        await handle(ctx.req, ctx.res)
        ctx.respond = false
    })

    app.use(async (ctx, next) => {
        ctx.res.statusCode = 200
        await next()
    })

    app.use(router.routes())
    app.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`)
    })
})
