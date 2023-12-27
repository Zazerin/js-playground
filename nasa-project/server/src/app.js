const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

const planetsRouter = require('./routes/planets/planets.router');
const launchesRouter = require('./routes/launches/launches.router');

const app = express();

const CLIENT_SPA_APP_PATH = path.join(__dirname, '..', 'public');

app.use(cors({
  origin: 'http://localhost:3000',
}));
app.use(morgan('combined'));

app.use(express.json());
app.use(express.static(CLIENT_SPA_APP_PATH));

app.use('/planets', planetsRouter);
app.use('/launches', launchesRouter);

app.get('/*', (req, res) => {
  return res.sendFile(path.join(CLIENT_SPA_APP_PATH, 'index.html'));
})

module.exports = app;