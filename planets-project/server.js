const http = require('http');
const PORT = 3000;

const friends = [
  {
    id: 0,
    name: 'Nikola Tesla',
  },
  {
    id: 1,
    name: 'Sir Isaac Newton'
  },
  {
    id: 2,
    name: 'Albert Einstein'
  }
]

const server = http.createServer((req, res) => {
  const items = req.url.split('/');
  if (items[1] === 'friends') {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json');

    if (items.length === 3) {
      res.end(JSON.stringify(friends.filter(({ id }) => id === +items[2])));
    } else {
      res.end(JSON.stringify(friends));
    }
  } else if (items[1] === 'messages') {
    res.setHeader('Content-Type', 'text/html')
    res.write('<html>');
    res.write('<body>');
    res.write('<ul>');
    res.write('<Li>123</li>');
    res.write('</ul>');
    res.write('</body>');
    res.write('</html>');
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});