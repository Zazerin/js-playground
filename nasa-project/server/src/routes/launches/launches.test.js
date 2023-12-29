const request = require('supertest');
const app = require('../../app');

describe('Test GET /launches', () => {
  test('It should respond with 200 success', async () => {
    const response = await request(app)
    .get('/launches')
    .expect('Content-Type', /json/)
    .expect(200);
  });
});

describe('Test POST /launches', () => {
  const completeLaunchData = {
    mission: 'New mission',
    rocket: 'NCC 1701-D',
    target: 'Kepler-186 f',
    launchDate: 'January 4, 2028',
  }

  const launchDataWithoutDate = {
    mission: 'New mission',
    rocket: 'NCC 1701-D',
    target: 'Kepler-186 f',
  }

  test('It should respond with 201 success', async () => {
    const response = await request(app)
      .post('/launches')
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
      .post('/launches')
      .send(launchDataWithoutDate)
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body).toStrictEqual({
      error: 'Body is not valid',
    })
  });

  test('It should catch invalid dates', async () => {
    const response = await request(app)
      .post('/launches')
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
    target: 'Kepler-186 f',
    launchDate: 'January 4, 2028',
  }

  test('It should respond with 200 success', async () => {
    const testLaunchResponse = await request(app)
      .post('/launches')
      .send(launchData);

    const response = await request(app)
      .delete(`/launches/${testLaunchResponse.body.flightNumber}`);

    expect(response.body).toMatchObject({
      upcoming: false,
      success: false,
    });
  });
});
