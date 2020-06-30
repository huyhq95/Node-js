var koa = require('koa');
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');
const mongo = require('koa-mongo')

var app = new koa();
var router = require('./routes');

app.keys = ['koajs'];
app.use(bodyParser());
app.use(session(app));
app.use(mongo())

router
   .use(session(app))
app
   .use(router.routes())
   .use(router.allowedMethods());

app.listen(3000, function () {
   console.log('Server running on https://localhost:3000')
});