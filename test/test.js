
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app').default;


chai.should();
chai.use(chaiHttp);

describe('Requests API', () => {
    describe("GET /TACTIV/login", () => {
        it('Response is a booléan', () => {
            chai.request(app)
                .get("/TACTIV/login")
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('boolean');
                });
        });
    });
});