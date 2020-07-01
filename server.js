const Koa = require('koa')
const next = require('next')
const Router = require('koa-router')
const mongo = require('koa-mongo')
var routers = require('./routes');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = new Koa()
  const router = new Router()
  server.keys = ['koajs'];
  server.use(bodyParser());
  server.use(session(server));
  server.use(mongo())
  routers
    .use(session(server))
  
  router.all('/(.*)', async (ctx, next) => {
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200
    await next()
  })

  server.use(routers.routes())
  server.use(router.routes())
  
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
})
