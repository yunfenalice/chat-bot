const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server'); //import our app
const expect = chai.expect;
chai.use(chaiHttp);
describe('mining hardware data', () => {
  it('Failed load data as without authentication', done => {
    chai
      .request(server)
      .get('/api/v1/hardwares')
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });
  it('Get all hardware data', done => {
    chai
      .request(server)
      .get('/api/v1/hardwares')
      .set('Authorization', `Bearer ${process.env.ACCESS_TOKEN}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal('success');
        expect(res.body.data).to.be.an('array');

        done();
      });
  });
  it('Add one hardware with invalid data', done => {
    chai
      .request(server)
      .post('/api/v1/hardwares')
      .set('Authorization', `Bearer ${process.env.ACCESS_TOKEN}`)
      .send({ name: 'test', location: 'Canada', hashRate: 123 })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });
  it('Add one hardware data', done => {
    chai
      .request(server)
      .post('/api/v1/hardwares')
      .set('Authorization', `Bearer ${process.env.ACCESS_TOKEN}`)
      .send({ name: 'test', location: 'Canada', hashRate: '12.7897' })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.status).to.equal('success');
        expect(res.body.data).to.be.an('object');

        done();
      });
  });
  it('Delete non exist data', done => {
    chai
      .request(server)
      .delete('/api/v1/hardwares/10000')
      .set('Authorization', `Bearer ${process.env.ACCESS_TOKEN}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
  it('Delete one hardware data', done => {
    chai
      .request(server)
      .delete('/api/v1/hardwares/1')
      .set('Authorization', `Bearer ${process.env.ACCESS_TOKEN}`)
      .end((err, res) => {
        expect(res).to.have.status(204);

        done();
      });
  });
  it('Update non exist data', done => {
    chai
      .request(server)
      .patch('/api/v1/hardwares/1000')
      .set('Authorization', `Bearer ${process.env.ACCESS_TOKEN}`)
      .send({ id: 1000, name: 'test', location: 'Canada', hashRate: '12.7897' })
      .end((err, res) => {
        expect(res).to.have.status(404);

        done();
      });
  });
  it('Update one hardware data', done => {
    chai
      .request(server)
      .patch('/api/v1/hardwares/2')
      .set('Authorization', `Bearer ${process.env.ACCESS_TOKEN}`)
      .send({ id: 2, name: 'test', location: 'Canada', hashRate: '12.7897' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal('success');
        expect(res.body.data).to.be.an('object');

        done();
      });
  });
});
