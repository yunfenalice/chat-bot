const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server'); //import our app
const expect = chai.expect;
chai.use(chaiHttp);

describe('login', () => {
  it('login in with username and password', done => {
    chai
      .request(server)
      .post('/api/v1/users/login')
      .send({ userName: 'dmg', password: '123456' })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal('success');
        expect(res.body.data.user).to.be.an('object');

        done();
      });
  });
  it('failed login', done => {
    chai
      .request(server)
      .post('/api/v1/users/login')
      .send({ userName: 'dmg', password: '12345' })
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });
});
