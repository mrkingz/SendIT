import chai from 'chai';
import supertest from 'supertest';
import db from '../database/index';
import app from "../app";

const expect = chai.expect;
const server = supertest.agent(app);

const user = {
	firstname: 'James',
	lastname: 'Olodayo',
	email: 'example@gmail.com',
	password: 'Password1'
};
describe('Test authentication routes', () => {
	before((done) => {
		db.dropTables().then(() => {
			return db.createTables().then(() => {
				return db.seedInitialData().then(() => {
					return done();
				});
			});
		}).catch(() => { });
	});

	it('It should create a user and return user details', (done) => {
		server
			.post('/api/v1/auth/signup')
			.send(user)
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(201);
				expect(response.status).to.equal('Success');
				expect(response.message).to.equal('Sign up was successfull');
				expect(response.data).to.be.an('object');
				expect(response.data.user).to.be.an('object');
				expect(response.data.user).to.have.own.property('userId')
					.to.be.a('number');
				expect(response.data.user).to.have.own.property('firstname')
					.to.be.a('string').that.is.equal(user.firstname);
				expect(response.data.user).to.have.own.property('lastname')
					.to.be.a('string').that.is.equal(user.lastname);
				expect(response.data.user).to.have.own.property('email')
					.to.be.a('string').that.is.equal(user.email);
				expect(response.data.user).to.have.own.property('isAdmin')
					.to.be.a('boolean').that.is.equal(false);
				expect(response.data.user).to.have.property('createdAt');
				done();
			});
	});

	it('It should not create a user if firstname is undefined', (done) => {
		const { firstname, ...noFName } = user;
		server
			.post('/api/v1/auth/signup')
			.send(noFName)
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Firstname is required');
				done();
			});
	});

	it('It should not create a user if lastname is undefined', (done) => {
		const { lastname, ...noLName } = user;
		server
			.post('/api/v1/auth/signup')
			.send(noLName)
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Lastname is required');
				done();
			});
	});


	it('It should not create a user if email address is undefined', (done) => {
		const { email, ...noEmail } = user;
		server
			.post('/api/v1/auth/signup')
			.send(noEmail)
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('E-mail address is required');
				done();
			});
	});

	it('It should not create a user if password is undefined', (done) => {
		const { password, ...noPassword } = user;
		server
			.post('/api/v1/auth/signup')
			.send(noPassword)
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Password is required');
				done();
			});
	});

	it('It should not create a user if email has been used', (done) => {
		server
			.post('/api/v1/auth/signup')
			.send(user)
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(409);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('E-mail address has been used');
				done();
			});
	});

	it('It should not create a user if firstname is empty', (done) => {
		const { firstname, ...emptyFN } = user;
		server
			.post('/api/v1/auth/signup')
			.send({ firstname: '', ...emptyFN })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Firstname is not allowed to be empty');
				done();
			});
	});

	it('It should not create a user if lastname is empty', (done) => {
		const { lastname, ...emptyLN } = user;
		server
			.post('/api/v1/auth/signup')
			.send({ lastname: '', ...emptyLN })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Lastname is not allowed to be empty');
				done();
			});
	});

	it('It should not create a user if email address is empty', (done) => {
		server
			.post('/api/v1/auth/signup')
			.send({ ...user, email: '' })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('E-mail address is not allowed to be empty');
				done();
			});
	});

	it('It should not create a user for invalid email address', (done) => {
		server
			.post('/api/v1/auth/signup')
			.send({ ...user, email: 'example' })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('E-mail address must be a valid email');
				done();
			});
	});

	it('It should not create a user if password is empty', (done) => {
		server
			.post('/api/v1/auth/signup')
			.send({ ...user, password: ' ' })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Password is not allowed to be empty');
				done();
			});
	});

	it('It should not create a user if password is less than eight characters', (done) => {
		server
			.post('/api/v1/auth/signup')
			.send({ ...user, password: 'Pass' })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Password length must be at least 8 characters long');
				done();
			});
	});
	
	it('It should sign in a user with email and password', (done) => {
		server
			.post('/api/v1/auth/login')
			.send({
				email: 'example@gmail.com',
				password: 'Password1'
			})
			.end((err, res) => {
				const response = res.body;
				expect(response).to.be.an('object');
				expect(res.statusCode).to.equal(200);
				expect(response.status).to.equal('Success');
				expect(response.message).to.equal('Successfully signed in');
				expect(response.data).to.be.an('object')
					.to.have.own.property('token').to.be.a('string');
				done();
			});
	});

	it('It should not sign in a user with inavlid email and password', (done) => {
		server
			.post('/api/v1/auth/login')
			.send({
				email: 'mrKingz001@hotmail.com',
				password: 'Password1'
			})
			.end((err, res) => {
				const response = res.body;
				expect(response).to.be.an('object');
				expect(res.statusCode).to.equal(401);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Invalid sign in credentials');
				done();
			});
	});

	it('It should not sign in a user with inavlid email', (done) => {
		server
			.post('/api/v1/auth/login')
			.send()
			.end((err, res) => {
				const response = res.body;
				expect(response).to.be.an('object');
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('E-mail address and password are required');
				done();
			});
	});
});