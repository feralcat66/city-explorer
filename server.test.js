const { server } = require('./server.js');
const request = require('supertest');

describe('/trails', () => {
    test('It should respond with an object of the correct shape',
    // get the done function to call after the test
        async(done) => {
            // feed our express app to the supertest request
            const response = await request(server)
                // and hit out express app's about route with a /GET
                .get('/trails');
            // check to see if the response is what we expect
            expect(response.body).toEqual({
                // it should have this name
                name: expect.any(String), 
                // it should have a number
                summary: expect.any(String), 
                // it should have a timestamp
                location: expect.any(String)
            });
            // it should have a status of 200
            expect(response.statusCode).toBe(200);
            // the callback has a 'done' that we can call to fix stuff :sparkle-emoji:
            done();
        });
});