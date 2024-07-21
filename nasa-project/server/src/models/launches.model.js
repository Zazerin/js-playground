const launchesModel = require('./launches.mongo');
const { getPlanetByName } = require('./planets.model');
const { getSpaceXLaunches } = require('../services/spacex-api');

const DEFAULT_FLIGHT_NUMBER = 100;

async function saveLaunch (launch) {
  return await launchesModel.updateOne(
    {
      flightNumber: launch.flightNumber
    },
    launch,
    {
      upsert: true
    }
  );
}

async function syncSpaceXLaunches () {

  const firstLaunch = await isExistsLaunch(1);

  if (firstLaunch) {
    return;
  }

  const launches = await getSpaceXLaunches();

  const launchDocs = launches.map((launch) => {
    const customers = launch.payloads.flatMap((payload) => payload.customers);

    return ({
      flightNumber: launch.flight_number,
      mission: launch.name,
      rocket: launch.rocket.name,
      launchDate: launch.date_local,
      customers,
      upcoming: launch.upcoming,
      success: launch.success,
    })
  })

  for (const launchDoc of launchDocs) {
    try {
      await saveLaunch(launchDoc);
    } catch (error) {
      console.log('error', error.message);
    }
  }
}

async function getAllLaunches () {
  return await launchesModel.find({}, { _id: 0, __v: 0 });
}

async function getLastFlightNumber () {
  const launch = await launchesModel.findOne({}, "flightNumber").sort('-flightNumber');

  return launch?.flightNumber;
}

async function addNewLaunch (launch) {
  const latestFlightNumber = (await getLastFlightNumber()) + 1;
  const isPlanetExist = await getPlanetByName(launch.target);

  if (!isPlanetExist) {
    throw new Error(`The planet doesn't exist`)
  }

  const newLaunch = Object.assign(
    launch,
    {
      flightNumber: latestFlightNumber || DEFAULT_FLIGHT_NUMBER,
      customers: ['ZTM', 'NASA'],
      upcoming: true,
      success: true,
    }
  );

  saveLaunch(newLaunch);
}

async function isExistsLaunch (launchId) {
  const launch = await launchesModel.findOne({ flightNumber: launchId });

  return !!launch;
}

async function abortLaunchById (launchId) {
  const aborted = await saveLaunch({
    flightNumber: launchId,
    upcoming: false,
    success: false,
  })

  return aborted.modifiedCount === 1;
}

module.exports = {
  syncSpaceXLaunches,
  getAllLaunches,
  addNewLaunch,
  isExistsLaunch,
  abortLaunchById,
}
