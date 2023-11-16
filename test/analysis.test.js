const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server'); //import our app
const expect = chai.expect;
chai.use(chaiHttp);
describe('stats', () => {
  it('Get data without authentication', done => {
    chai
      .request(server)
      .get('/api/v1/analysis')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res).to.have.status(401);

        done();
      });
  });
  it('Get all stats data', done => {
    chai
      .request(server)
      .get('/api/v1/analysis')
      .set('Authorization', `Bearer ${process.env.ACCESS_TOKEN}`)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal('success');
        expect(res.body.data).to.be.an('object');

        done();
      });
  });
  it('Get analysis data for non exist user ', done => {
    chai
      .request(server)
      .get('/api/v1/hardwares/10000')
      .set('Authorization', `Bearer ${process.env.ACCESS_TOKEN}`)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res).to.have.status(404);

        done();
      });
  });
  it('Get analysis data for user ', done => {
    chai
      .request(server)
      .get('/api/v1/hardwares/1')
      .set('Authorization', `Bearer ${process.env.ACCESS_TOKEN}`)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal('success');
        expect(res.body.data).to.be.an('object');

        done();
      });
  });
});
