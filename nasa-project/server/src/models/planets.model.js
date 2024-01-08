
const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', '..', 'data', 'kepler_data.csv');

const planetsModel = require('./planets.mongo');

const findProjectionProperty = { _id: 0, __v: 0 }

function isHabitablePlanet(planet) {
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6; 
}

async function getAllPlanets () {
  return await planetsModel.find({}, findProjectionProperty);
}

async function getPlanetByName (name) {
  return await planetsModel.findOne({ keplerName: name }, findProjectionProperty);
}

async function savePlanet (planet) {
  try {
    await planetsModel.updateOne({
      keplerName: planet.kepler_name
    },{
      keplerName: planet.kepler_name
    },{
      upsert: true
    });
  } catch (err) {
    console.error('error saving a planet: ', err);
  }
}

function loadPlanetsData () {
  return new Promise((res, rej) => {
    fs.createReadStream(filePath)
      .pipe(parse({
        comment: '#',
        columns: true,
      }))
      .on('data', async (planet) => {
        if (isHabitablePlanet(planet)) {
          await savePlanet(planet)
        }
      })
      .on('error', (error) => {
        rej(error);
      })
      .on('end', async () => {
        const countPlanets = (await getAllPlanets()).length;
        console.log('found planets', countPlanets);
        res();
      });
  });
}

module.exports = {
  getAllPlanets,
  getPlanetByName,
  loadPlanetsData,
};
