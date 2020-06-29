var koa = require('koa');
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');
var app = new koa();
var router = require('./routes');

app.keys = ['koajs'];
app.use(bodyParser());
app.use(session(app));

router
   .use(session(app))
app
   .use(router.routes())
   .use(router.allowedMethods());

app.listen(3000, function () {
   console.log('Server running on https://localhost:3000')
});