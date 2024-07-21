const request = require('supertest');
const app = require('../../app');
const { loadPlanetsData } = require('../../models/planets.model');
const { syncSpaceXLaunches } = require('../../models/launches.model');
const { connectMongoDB, disconnectMongoDB } = require('../../services/mongodb');

describe('Launches API', () => {

  beforeAll(async () => {
    await connectMongoDB();
    await loadPlanetsData();
    await syncSpaceXLaunches();
  })

  afterAll(async () => {
    await disconnectMongoDB();
  })

  describe('Test GET /launches', () => {
    test('It should respond with 200 success', async () => {
      const response = await request(app)
        .get('/v1/launches')
        .expect('Content-Type', /json/)
        .expect(200);
    });
  });
  
  describe('Test POST /launches', () => {
    const completeLaunchData = {
      mission: 'New mission',
      rocket: 'NCC 1701-D',
      target: 'Kepler-1652 b',
      launchDate: 'January 4, 2028',
    }
  
    const launchDataWithoutDate = {
      mission: 'New mission',
      rocket: 'NCC 1701-D',
      target: 'Kepler-1652 b',
    }
  
    test('It should respond with 201 success', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(completeLaunchData)
        .expect('Content-Type', /json/)
        .expect(201);
  
        const requestDate = new Date(completeLaunchData.launchDate).valueOf();
        const responseDate = new Date(response.body.launchDate).valueOf();
  
        expect(responseDate).toBe(requestDate);
        expect(response.body).toMatchObject(launchDataWithoutDate);
    });
  
    test('It should catch missing required properties', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithoutDate)
        .expect('Content-Type', /json/)
        .expect(400);
  
      expect(response.body).toStrictEqual({
        error: 'Body is not valid',
      })
    });
  
    test('It should catch invalid dates', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send({
          ...launchDataWithoutDate,
          launchDate: 'not valid'
        })
        .expect('Content-Type', /json/)
        .expect(400);
  
      expect(response.body).toStrictEqual({
        error: 'launchDate is not valid',
      })
    });
  });
  
  describe('Test DELETE /launches/:id', () => {
    const launchData = {
      mission: 'Test delete',
      rocket: 'NCC 1701-D',
      target: 'Kepler-1652 b',
      launchDate: 'January 4, 2028',
    }
  
    test('It should respond with 200 success', async () => {
      const testLaunchResponse = await request(app)
        .post('/v1/launches')
        .send(launchData);
  
      const response = await request(app)
        .delete(`/v1/launches/${testLaunchResponse.body.flightNumber}`);
  
      expect(response.body).toMatchObject({ isAborted: true });
    });
  });  
});
