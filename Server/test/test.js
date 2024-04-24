// let chai = import('chai');
// let chaiHttp = import('chai-http');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
chai.use(chaiHttp);
let should = chai.should();
let expect = chai.expect;
let request = chaiHttp.request;
let have = chai.have;
let random = Math.floor((Math.random() * 100) + 1);

//Login
describe("/POST Login user", () => {
    it("it should not Login without right credentials", (done) => {
        let user = {
            username: "false",
            password: "password",
        };
        chai
            .request(server)
            .post("/login")
            .send(user)
            .end((_, res) => {
                res.should.have.status(401);
                res.body.should.be.a("object");
                res.body.should.have
                    .property("message")
                    .eql("Invalid credentials!");
                done();
            });
    });
    it("it should Login with the right credentials ", (done) => {
        let user = {
            username: "ddd",
            password: "ddd",
        };
        chai
            .request(server)
            .post("/login")
            .send(user)
            .end((_, res) => {
                res.should.have.status(200);
                res.body.should.be.a("object");
                res.body.should.have.property("token");
                done();
            });
    });
});
//Create user
describe("/POST create user", () => {
    it("it should create an user with all credentials and an unique username", (done) => {
        let user = {
            username: random,
            password: "newUser",
        };
        chai
            .request(server)
            .post("/register")
            .send(user)
            .end((_, res) => {
                res.should.have.status(201);
                res.body.should.be.a("object");
                res.body.should.have
                    .property("message")
                    .eql("User registered successfully");
                done();
            });
    });
    it("it should create an user only with unique username", (done) => {
        let user = {
            username: "ddd",
            password: "newUser",
        };
        chai
            .request(server)
            .post("/register")
            .send(user)
            .end((_, res) => {
                res.should.have.status(409);
                res.body.should.be.a("object");
                res.body.should.have
                    .property("message")
                    .eql("Username already exists");
                done();
            });
    });
    it("It should require a password and a username", (done) => {
        let user = {
            username: "",
            password: "",
        };
        chai
            .request(server)
            .post("/register")
            .send(user)
            .end((_, res) => {
                res.should.have.status(400);
                res.body.should.be.a("object");
                res.body.should.have
                    .property("message")
                    .eql("Fill out all the fields");
                done();
            });
    });
});
//Delete user
describe("/POST DELETE user", () => {
	  it("It should require a username", (done) => {
		        let user = {
		            username: "ddd",
 		        };
		        chai
		            .request(server)
		            .post("/user/remove")
		            .send(user)
		            .end((_, res) => {
		                res.should.have.status(201);
		                res.body.should.be.a("object");
		                res.body.should.have
		                    .property("message")
		                    .eql("delete successful");
		                done();
		            });
	  });
	  it("It should require a valid username", (done) => {
		let user = {
			username: "no such user",
		 };
		chai
			.request(server)
			.post("/user/remove")
			.send(user)
			.end((_, res) => {
				res.should.have.status(409);
				res.body.should.be.a("object");
				res.body.should.have
					.property("message")
					.eql("No such user");
				done();
			});
});
});