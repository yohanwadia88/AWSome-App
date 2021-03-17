// Hello World sample app.
const http = require('http');

const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(`Hello World. This processor's architecture is ${process.arch} and the current platform is ${process.platform}`);
});

server.listen(port, () => {
  console.log(`Server running on processor architecture ${process.arch}`);
});

