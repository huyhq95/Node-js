const fs = require('fs');

module.exports = {
    helloWorld: function (res) {
        res.end('Hello World');
    },
    employees: function (res) {
        fs.readFile('employees.json', "utf8", function read(err, data) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
        });
    },
}
