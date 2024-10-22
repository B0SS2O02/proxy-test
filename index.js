const http = require('http');
const httpProxy = require('http-proxy');

// Создаем прокси-сервер
const proxy = httpProxy.createProxyServer({});

// Создаем сервер
const server = http.createServer((req, res) => {
  const targetUrl = 'http://example.com'; // Указываем целевой сервер

  proxy.web(req, res, { target: targetUrl }, (err) => {
    console.error('Proxy error:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Something went wrong.');
  });
});

server.listen(3000, () => {
  console.log('Proxy server is running on port 3000');
});
