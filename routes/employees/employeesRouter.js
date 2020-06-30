require('es6-promise').polyfill();
require('isomorphic-fetch');
const fs = require('fs');
var Router = require('koa-router');
const verifyRequest = require('../../verifyRequest');;
var Models = require('../../handlers/models');

const employeesRouter = new Router()
    .post('/employees/crawl', verifyRequest, async (ctx, next) => {
        fetch('http://dummy.restapiexample.com/api/v1/employees')
            .then(async response => {
                const jsonData = await response.json();
                await Models.crawlData(ctx, jsonData.data);
            })
            .catch(function (error) {
                console.log('error', error);
            });
    })
    .get('/employees', verifyRequest, async (ctx, next) => {
        var { name } = ctx.request.query;
        let data = await Models.getEmployees(ctx, name);
        ctx.set('Content-Type', 'application/json');
        ctx.body = JSON.stringify(data);
    })

module.exports = employeesRouter;
