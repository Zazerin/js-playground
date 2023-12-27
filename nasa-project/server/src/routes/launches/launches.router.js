const express = require('express');
const launchesController = require('./launches.controller');

const launchesRouter = express.Router();

launchesRouter.get('/', launchesController.getAllLaunches);

module.exports = launchesRouter;