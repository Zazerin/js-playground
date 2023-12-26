const express = require('express');
const cors = require('cors');
const path =require('path');

const planetsRouter = require('./routes/planets/planets.router');

const app = express();

const CLIENT_SPA_APP_PATH = path.join(__dirname, '..', 'public');

// app.use(cors({
//   origin: 'http://localhost:3000',
// }));
app.use(express.json());
app.use(express.static(CLIENT_SPA_APP_PATH));
app.get('/', (req, res) => {
  return res.sendFile(path.join(CLIENT_SPA_APP_PATH, 'index.html'));
})

app.use('/planets', planetsRouter);

module.exports = app;