require('es6-promise').polyfill();
require('isomorphic-fetch');
const fs = require('fs');

module.exports = {
    crawlData: function (res) {
        fetch('http://dummy.restapiexample.com/api/v1/employees')
            .then(async response => {
                const jsonData = await response.json();
                await fs.writeFile("employees.json", JSON.stringify(jsonData.data), function (err) {
                });
                res.end('Crawl successfully');
            })
            .catch(function (error) {
                console.log('error', error);
                res.end('Crawl failed');
            });
    }
}
