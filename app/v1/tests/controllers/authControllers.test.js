import assert from "assert";
import request from "supertest";
import { app } from "../../../../index.js"
process.env.NODE_ENV = "test";

describe("Authentication  && Get Profile Details", () => {
    let token;
    let server;
    before(function (done) {
        // Start the server before running the tests
        server = app.listen(3000, function (err) {
            if (err) return done(err);
            done();
        });
    });

    describe('POST /api/v1/auth/signIn', () => {
        it('should return a valid authentication token', (done) => {
            const credentials = {
                email: 'Ashin@test.com',
                password: '1234',
            };

            request(server)
                .post('/api/v1/auth/signIn')
                .send(credentials)
                .expect(200)
                .end((err, res) => {
                    assert.ok(res.body.token);
                    token = res.body.token; // Store the token for subsequent requests
                    done(err);
                });
        });
    });

    describe('GET api/v1/services/profile-details', () => {
        it('should return profile details json', (done) => {
            request(server)
                .get('/api/v1/services/profile-details')
                .set('Authorization', `Bearer ${token}`)
                .expect(2000)
                .end((err, res) => {
                    assert.ok(res.body.subscription);
                    assert.ok(res.body.info);
                    done(err);
                });
        });

        it('should return unauthorized without an authentication token', (done) => {
            request(server)
                .get('/api/v1/services/profile-details')
                .expect(401, done);
        });
    });

    describe('POST /api/v1/auth/signUp', () => {
        it('should return user already exists', (done) => {
            const credentials = {
                email: 'Ashin@test.com',
                password: '1234',
            };

            request(server)
                .post('/api/v1/auth/signIn')
                .send(credentials)
                .expect(401, done);
        });
    });


    after(function (done) {
        // Close the server after running the tests
        server.close(function (err) {
            if (err) return done(err);
            done();
        });
    });
});

