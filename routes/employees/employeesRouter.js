require('es6-promise').polyfill();
require('isomorphic-fetch');
const fs = require('fs');
var Router = require('koa-router');
const verifyRequest = require('../../verifyRequest');;

const employeesRouter = new Router()
    .post('/employees/crawl', verifyRequest, async (ctx, next) => {
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
    .get('/employees', verifyRequest, async (ctx, next) => {
        let data = fs.readFileSync('employees.json', 'utf8')
        ctx.set('Content-Type', 'application/json');
        ctx.body = JSON.stringify(data);
    })

module.exports = employeesRouter;
