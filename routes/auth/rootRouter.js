require('es6-promise').polyfill();
require('isomorphic-fetch');
var Router = require('koa-router');

const rootRouter = new Router()
    .get('/', (ctx, next) => {
        ctx.body = 'Hello World';
    })
    .post('/login', async (ctx, next) => {
        if (ctx.request.body.username == 'admin' && ctx.request.body.password == '123') {
            ctx.session.user = ctx.request.body.username;
            ctx.body = 'Login successfully';
        } else {
            ctx.body = 'Unauthorized';
        }
    })
    .get('/logout', (ctx, next) => {
        ctx.session = null
        ctx.redirect('/api')
    })

module.exports = rootRouter;
