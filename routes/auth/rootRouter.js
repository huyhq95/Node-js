require('es6-promise').polyfill();
require('isomorphic-fetch');
var Router = require('koa-router');
const bcrypt = require('bcrypt');

const rootRouter = new Router()
    .get('/', (ctx, next) => {
        ctx.body = 'Hello World';
    })
    .post('/login', async (ctx, next) => {
        var { username, password } = ctx.request.body;

        await ctx.db.collection('users').findOne({
            'username': username
        }).then(async function (user) {
            if (!user) {
                return false;
            } else {
                if (bcrypt.compareSync(password, user.password) == true) {
                    ctx.session.user = ctx.request.body.username;
                    ctx.body = 'Login successfully';
                } else {
                    ctx.status = 401;
                    ctx.body = 'Unauthorized';
                }
            }
        });
    })
    .get('/logout', (ctx, next) => {
        ctx.session = null
        ctx.redirect('/api')
    })
    .post('/signup', async (ctx, next) => {
        var { username, password } = ctx.request.body;

        var checkUserExist = await ctx.db.collection('users').find({ "username": username }).toArray();
        if (checkUserExist.length == 0) {
            ctx.db.collection('users').insertOne({ "username": username, "password": bcrypt.hashSync(password, 10) });
            ctx.body = 'Signup successfully';
        } else {
            ctx.body = 'User exist';
        }
    })

module.exports = rootRouter;
