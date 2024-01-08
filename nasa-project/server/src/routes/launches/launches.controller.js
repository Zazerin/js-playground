const {
  getAllLaunches,
  addNewLaunch,
  isExistsLaunch,
  abortLaunchById,  
} = require('../../models/launches.model');

async function httpGetAllLaunches (req, res) {
  return res.status(200).json(await getAllLaunches());
};

async function httpAddNewLaunch (req, res) {
  const launch = req.body;

  if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
    return res.status(400).json({
      error: 'Body is not valid',
    });
  }

  launch.launchDate = new Date(launch.launchDate);

  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: 'launchDate is not valid',
    });
  }

  try {
    await addNewLaunch(launch);
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }


  return res.status(201).json(launch);
}

async function httpAbortLaunch (req, res) {
  const launchId = Number(req.params.id);

  const isExists = await isExistsLaunch(launchId);

  if (!isExists) {
    return res.status(404).json({
      error: 'Launch not found',
    });
  }

  const isAborted = await abortLaunchById(launchId);

  if (!isAborted) {
    return res.status(400).json({
      error: 'Launch hot aborted',
    });
  }
  
  return res.status(200).json({
    isAborted
  });
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
}
