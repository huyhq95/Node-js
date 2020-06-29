require('es6-promise').polyfill();
require('isomorphic-fetch');
const fs = require('fs');
var Router = require('koa-router');
const verifyRequest = require('../../verifyRequest');;

const router = new Router({ prefix: '/api' })
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
    .post('/employees/crawl', verifyRequest.mw, async (ctx, next) => {
        fetch('http://dummy.restapiexample.com/api/v1/employees')
            .then(async response => {
                const jsonData = await response.json();
                await fs.writeFile("employees.json", JSON.stringify(jsonData.data), function (err) {
                });
            })
            .catch(function (error) {
                console.log('error', error);
            });
    })
    .get('/employees', verifyRequest.mw, async (ctx, next) => {
        let data = fs.readFileSync('employees.json', 'utf8')
        ctx.set('Content-Type', 'application/json');
        ctx.body = JSON.stringify(data);
    })

module.exports = router;
