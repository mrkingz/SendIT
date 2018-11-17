import chai from 'chai';
import supertest from 'supertest';
import app from '../../server/app';

const expect = chai.expect;
const server = supertest.agent(app);

const users = [{
	firstname: 'James',
	lastname: 'Ogugayo',
	email: 'example@gmail.com',
	password: 'Password1'
}, {
	lastname: 'Ogugayo',
	email: 'example@gmail.com',
	password: 'Password1'
}, {
	firstname: 'James Ogugayo',
	email: 'example@gmail.com',
	password: 'Password1'
}, {
	firstname: 'James Ogugayo',
	lastname: 'Ogugayo',
	password: 'Password1'
}, {
	firstname: 'James Ogugayo',
	lastname: 'Ogugayo',
	email: 'example@gmail.com',
}];

describe('Test authentication routes', () => {
	describe('Test sign up route', () => {
		it('It should create a user and return user details', (done) => {
			server
				.post('/api/v1/auth/signup')
				.send(users[0])
				.end((err, res) => {
					const response = res.body;
					expect(res.statusCode).to.equal(201);
					expect(response.status).to.equal('Success');
					expect(response.message).to.equal('Registration was successfull');
					expect(response.data).to.be.an('object');
					expect(response.data).to.have.own.property('userId')
						.to.be.a('number');
					expect(response.data).to.have.own.property('firstname')
						.to.be.a('string').that.is.equal(users[0].firstname);
					expect(response.data).to.have.own.property('lastname')
						.to.be.a('string').that.is.equal(users[0].lastname);
					expect(response.data).to.have.own.property('email')
						.to.be.a('string').that.is.equal(users[0].email);
					expect(response.data).to.have.own.property('isAdmin')
						.to.be.a('boolean').that.is.equal(false);
					expect(response.data).to.have.property('createdAt');
					done();
				});
		});

		it('It should not create a user if firstname is undefined', (done) => {
			server
				.post('/api/v1/auth/signup')
				.send(users[1])
				.end((err, res) => {
					const response = res.body;
					expect(res.statusCode).to.equal(422);
					expect(response.status).to.equal('Fail');
					expect(response.message).to.equal('Firstname is required');
					done();
				});
		});

		it('It should not create a user if lastname is undefined', (done) => {
			server
				.post('/api/v1/auth/signup')
				.send(users[2])
				.end((err, res) => {
					const response = res.body;
					expect(res.statusCode).to.equal(422);
					expect(response.status).to.equal('Fail');
					expect(response.message).to.equal('Lastname is required');
					done();
				});
		});


		it('It should not create a user if email address is undefined', (done) => {
			server
				.post('/api/v1/auth/signup')
				.send(users[3])
				.end((err, res) => {
					const response = res.body;
					expect(res.statusCode).to.equal(422);
					expect(response.status).to.equal('Fail');
					expect(response.message).to.equal('E-mail address is required');
					done();
				});
		});

		it('It should not create a user if password is undefined', (done) => {
			server
				.post('/api/v1/auth/signup')
				.send(users[4])
				.end((err, res) => {
					const response = res.body;
					expect(res.statusCode).to.equal(422);
					expect(response.status).to.equal('Fail');
					expect(response.message).to.equal('Password is required');
					done();
				});
		});

		it('It should not create a user if email has been used', (done) => {
			server
				.post('/api/v1/auth/signup')
				.send(users[0])
				.end((err, res) => {
					const response = res.body;
					expect(res.statusCode).to.equal(409);
					expect(response.status).to.equal('Fail');
					expect(response.message).to.equal('E-mail address has been used');
					done();
				});
		});


		it('It should not create a user if firstname is empty', (done) => {
			users[0].firstname = '';
			server
				.post('/api/v1/auth/signup')
				.send(users[0])
				.end((err, res) => {
					const response = res.body;
					expect(res.statusCode).to.equal(422);
					expect(response.status).to.equal('Fail');
					expect(response.message).to.equal('Firstname is not allowed to be empty');
					done();
				});
		});

		it('It should not create a user if lastname is empty', (done) => {
			users[0].firstname = 'James';
			users[0].lastname = '';
			server
				.post('/api/v1/auth/signup')
				.send(users[0])
				.end((err, res) => {
					const response = res.body;
					expect(res.statusCode).to.equal(422);
					expect(response.status).to.equal('Fail');
					expect(response.message).to.equal('Lastname is not allowed to be empty');
					done();
				});
		});

		it('It should not create a user if email address is empty', (done) => {
			server
				.post('/api/v1/auth/signup')
				.send({
					firstname: 'James',
					lastname: 'Ogugayo',
					email: '',
					password: 'Password1'
				})
				.end((err, res) => {
					const response = res.body;
					expect(res.statusCode).to.equal(422);
					expect(response.status).to.equal('Fail');
					expect(response.message).to.equal('E-mail address is not allowed to be empty');
					done();
				});
		});

		it('It should not create a user for invalid email address', (done) => { 
			server
				.post('/api/v1/auth/signup')
				.send({
					firstname: 'James',
					lastname: 'Ogugayo',
					email: 'example@',
					password: 'Password1'
				})
				.end((err, res) => {
					const response = res.body;
					expect(res.statusCode).to.equal(422);
					expect(response.status).to.equal('Fail');
					expect(response.message).to.equal('E-mail address must be a valid email');
					done();
				});
		});

		it('It should not create a user if password is empty', (done) => {
			server
				.post('/api/v1/auth/signup')
				.send({
					firstname: 'James',
					lastname: 'Ogugayo',
					email: 'example@gmail.com',
					password: ' '
				})
				.end((err, res) => {
					const response = res.body;
					expect(res.statusCode).to.equal(422);
					expect(response.status).to.equal('Fail');
					expect(response.message).to.equal('Password is not allowed to be empty');
					done();
				});
		});

		it('It should not create a user if password is less than eight characters', (done) => {
			server
				.post('/api/v1/auth/signup')
				.send({
					firstname: 'James',
					lastname: 'Ogugayo',
					email: 'example@gmail.com',
					password: 'Pass'
				})
				.end((err, res) => {
					const response = res.body;
					expect(res.statusCode).to.equal(422);
					expect(response.status).to.equal('Fail');
					expect(response.message).to.equal('Password length must be at least 8 characters long');
					done();
				});
		});
	});

	describe('Test sign in route', () => {
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
					expect(res.statusCode).to.equal(401);
					expect(response.status).to.equal('Fail');
					expect(response.message).to.equal('E-mail address and password are required');
					done();
				});
		});
	});
});