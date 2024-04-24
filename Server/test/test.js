let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
chai.use(chaiHttp);
let should = chai.should();

//https://www.chaijs.com/plugins/chai-http/
//https://www.chaijs.com/guide/styles/
describe('Users', () => {
    beforeEach((done) => {
        User.remove({}, (err) => {
           done();
        });
    });
//Login
describe('/POST Login user', () => {
	it('it should not Login without pages right credentials', (done) => {
		let user = {
		"username":"false","password":"password"
		}
	  chai.request(server)
		  .post('/login')
		  .send(user)
		  .end((err, res) => {
				res.should.have.status(401);
			  res.body.should.be.a('object');
			  res.body.should.have.property('message').eql('Invalid credentials!');
			done();
		  });
	});
	it('it should Login with the right credentials ', (done) => {
		let user = {
		"username":"ddd","password":"ddd"
		}
	  chai.request(server)
		  .post('/login')
		  .send(user)
		  .end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('token');
			done();
		  });
	});
});
});