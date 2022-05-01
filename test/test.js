
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.js';

chai.should();
chai.use(chaiHttp);

describe('Requests API', () => {
    describe("GET /TACTIV/login", () => {
        it('Response is a booléan', () => {
            chai.request(app)
                .get("/TACTIV/login")
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.loggedIn.should.be.a('boolean');
                });
        });
    });

    describe("GET /TACTIV/logout", () => {
        it('Response is a booléan', () => {
            chai.request(app)
                .get("/TACTIV/logout")
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.loggedIn.should.be.a('boolean');
                });
        });
    });

    describe("GET /TACTIV/historic-measure-global", () => {
        it('Response is a booléan', () => {
            chai.request(app)
                .get("/TACTIV/historic-measure-global")
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                });
        });
    });

    describe("GET /TACTIV/historic-goal-global", () => {
        it('Response is a booléan', () => {
            chai.request(app)
                .get("/TACTIV/historic-goal-global")
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                });
        });
    });


    describe("GET /TACTIV/activity-list", () => {
        it('Response is an array', () => {
            chai.request(app)
                .get("/TACTIV/activity-list")
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                });
        });
    });

});
