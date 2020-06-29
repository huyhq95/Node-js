const rootRouter = require('./auth/rootRouter');
const employeesRouter = require('./employees/employeesRouter');
var Router = require('koa-router');

const apiRouter = new Router({ prefix: '/api' })

const nestedRoutes = [rootRouter, employeesRouter]
for (var router of nestedRoutes) {
    apiRouter.use(router.routes(), router.allowedMethods())
}

module.exports = apiRouter;
