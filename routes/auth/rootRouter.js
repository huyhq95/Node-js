require('es6-promise').polyfill();
require('isomorphic-fetch');
var Router = require('koa-router');
var Models = require('../../handlers/models');

const rootRouter = new Router()
    .get('/', (ctx, next) => {
        ctx.body = 'Hello World';
    })
    .post('/login', async (ctx, next) => {
        var { username, password } = ctx.request.body;
        var user = await Models.logIn(ctx, username, password);
        if (user == true) {
            ctx.session.user = username;
            ctx.body = JSON.stringify({ 'status': true, 'msg': 'Login succesfully' });
        } else {
            ctx.status = 401;
            ctx.body = JSON.stringify({ 'status': false, 'msg': 'Unauthorized' });
        }
    })
    .get('/logout', (ctx, next) => {
        ctx.session = null
        ctx.redirect('/api')
    })
    .post('/signup', async (ctx, next) => {
        var { username, password } = ctx.request.body;
        var checkUserExist = await Models.checkUserExist(ctx, username);

        if (!checkUserExist) {
            await Models.signUp(ctx, username, password);
            ctx.body = 'Signup successfully';
        } else {
            ctx.body = 'User exist';
        }
    })
    .get('/getSession', (ctx, next) => {
        ctx.body = JSON.stringify({ 'session': ctx.session.user });
    })

module.exports = rootRouter;
