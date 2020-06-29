const http = require('http');
var crawl = require('./crawl');
var data = require('./data');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer(function (req, res) {
  res.statusCode = 200;
  var url = req.url;
  var method = req.method;

  if (method == 'GET' && url === '/') {
    data.helloWorld(res)
  } else if (method == 'POST' && url === '/employees/crawl') {
    crawl.crawlData(res)
  } else if (method == 'GET' && url == '/employees') {
    data.employees(res)
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
