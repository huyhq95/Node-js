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
                ctx.db.collection('employees').bulkWrite(jsonData.data.map((obj) => {
                    const { id, ...update } = obj;
                    return {
                        updateOne: {
                            filter: { _id: id },
                            update: {
                                $setOnInsert: { _id: id },
                                $set: update,
                            },
                            upsert: true,
                        },
                    };
                }));
                ctx.db.collection('employees').createIndex( { employee_name: "text" } )
            })
            .catch(function (error) {
                console.log('error', error);
            });
    })
    .get('/employees', verifyRequest, async (ctx, next) => {
        var { name } = ctx.request.query;
        let data = name ? await ctx.db.collection('employees').find( { $text: { $search: name } } ).toArray() : await ctx.db.collection('employees').find().toArray();
        ctx.set('Content-Type', 'application/json');
        ctx.body = JSON.stringify(data);
    })

module.exports = employeesRouter;
