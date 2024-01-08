const launchesModel = require('./launches.mongo');
const { getPlanetByName } = require('./planets.model');

const DEFAULT_FLIGHT_NUMBER = 100;

async function getAllLaunches () {
  return await launchesModel.find({}, { _id: 0, __v: 0 })
}

async function getLastFlightNumber () {
  const launch = await launchesModel.findOne({}, "flightNumber").sort('-flightNumber');

  return launch?.flightNumber;
}

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
  getAllLaunches,
  addNewLaunch,
  isExistsLaunch,
  abortLaunchById,
}
