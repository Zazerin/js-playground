const http = require('http');

require('dotenv').config();

const app = require('./app');
const { loadPlanetsData } = require('./models/planets.model');
const { syncSpaceXLaunches } = require('./models/launches.model');
const { connectMongoDB, disconnectMongoDB } = require('./services/mongodb');

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

async function onShutdown () {
  await disconnectMongoDB();

  return new Promise((res, rej) => server.close((err) => {
    err ? rej(err) : res();
  }));
}

async function startServer () {
  await connectMongoDB();
  await loadPlanetsData();
  await syncSpaceXLaunches();
  
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
  });

  process.on('SIGTERM', onShutdown);
  process.on('SIGINT', onShutdown);
}

startServer();
