import chai from 'chai';
import supertest from 'supertest';
import app from '../../server/app';

const expect = chai.expect;
const server = supertest.agent(app);

const users = [{
	firstname: 'James',
	lastname: 'Ogugayo',
	gender: 'Male',
	address: '23, Bola Ige Street',
	city: 'Ikeja',
	state: 'Lagos',
	phone: '08035610915',
	email: 'example@gmail.com',
	password: 'Password1'
}, {
	lastname: 'Ogugayo',
	gender: 'Male',
	address: '23, Bola Ige Street',
	city: 'Ikeja',
	state: 'Lagos',
	phone: '08035610915',
	email: 'example@gmail.com',
	password: 'Password1'
}, {
	firstname: 'James',
	gender: 'Male',
	address: '23, Bola Ige Street',
	city: 'Ikeja',
	state: 'Lagos',
	phone: '08035610915',
	email: 'example@gmail.com',
	password: 'Password1'
}, {
	firstname: 'James',
	lastname: 'Ogugayo',
	address: '23, Bola Ige Street',
	city: 'Ikeja',
	state: 'Lagos',
	phone: '08035610915',
	email: 'example@gmail.com',
	password: 'Password1'
}, {
	firstname: 'James',
	lastname: 'Ogugayo',
	gender: 'Male',
	city: 'Ikeja',
	state: 'Lagos',
	phone: '08035610915',
	email: 'example@gmail.com',
	password: 'Password1'
}, {
	firstname: 'James',
	lastname: 'Ogugayo',
	gender: 'Male',
	address: '23, Bola Ige Street',
	state: 'Lagos',
	phone: '08035610915',
	email: 'example@gmail.com',
	password: 'Password1'
}, {
	firstname: 'James',
	lastname: 'Ogugayo',
	gender: 'Male',
	address: '23, Bola Ige Street',
	city: 'Ikeja',
	phone: '08035610915',
	email: 'example@gmail.com',
	password: 'Password1'
}, {
	firstname: 'James',
	lastname: 'Ogugayo',
	gender: 'Male',
	address: '23, Bola Ige Street',
	city: 'Ikeja',
	state: 'Lagos',
	email: 'example@gmail.com',
	password: 'Password1'
}, {
	firstname: 'James',
	lastname: 'Ogugayo',
	gender: 'Male',
	address: '23, Bola Ige Street',
	city: 'Ikeja',
	state: 'Lagos',
	phone: '08035610915',
	password: 'Password1'
}, {
	firstname: 'James',
	lastname: 'Ogugayo',
	gender: 'Male',
	address: '23, Bola Ige Street',
	city: 'Ikeja',
	state: 'Lagos',
	phone: '08035610915',
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
						.to.be.a('number').that.is.equal(1);
					expect(response.data).to.have.own.property('firstname')
						.to.be.a('string').that.is.equal(users[0].firstname);
					expect(response.data).to.have.own.property('lastname')
						.to.be.a('string').that.is.equal(users[0].lastname);
					expect(response.data).to.have.own.property('gender')
						.to.be.a('string').that.is.equal(users[0].gender);
					expect(response.data).to.have.own.property('address')
						.to.be.a('string').that.is.equal(users[0].address);
					expect(response.data).to.have.own.property('city')
						.to.be.a('string').that.is.equal(users[0].city);
					expect(response.data).to.have.own.property('state')
						.to.be.a('string').that.is.equal(users[0].state);
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
					expect(res.statusCode).to.equal(400);
					expect(response.status).to.equal('Fail');
					expect(response.message).to.equal('Firstname is required!');
					done();
				});
		});

		it('It should not create a user if lastname is undefined', (done) => {
			server
				.post('/api/v1/auth/signup')
				.send(users[2])
				.end((err, res) => {
					const response = res.body;
					expect(res.statusCode).to.equal(400);
					expect(response.status).to.equal('Fail');
					expect(response.message).to.equal('Lastname is required!');
					done();
				});
		});

		it('It should not create a user if gender is undefined', (done) => {
			server
				.post('/api/v1/auth/signup')
				.send(users[3])
				.end((err, res) => {
					const response = res.body;
					expect(res.statusCode).to.equal(400);
					expect(response.status).to.equal('Fail');
					expect(response.message).to.equal('Gender is required!');
					done();
				});
		});

		it('It should not create a user if address is undefined', (done) => {
			server
				.post('/api/v1/auth/signup')
				.send(users[4])
				.end((err, res) => {
					const response = res.body;
					expect(res.statusCode).to.equal(400);
					expect(response.status).to.equal('Fail');
					expect(response.message).to.equal('Address is required!');
					done();
				});
		});

		it('It should not create a user if city is undefined', (done) => {
			server
				.post('/api/v1/auth/signup')
				.send(users[5])
				.end((err, res) => {
					const response = res.body;
					expect(res.statusCode).to.equal(400);
					expect(response.status).to.equal('Fail');
					expect(response.message).to.equal('City or town is required!');
					done();
				});
		});

		it('It should not create a user state is undefined', (done) => {
			server
				.post('/api/v1/auth/signup')
				.send(users[6])
				.end((err, res) => {
					const response = res.body;
					expect(res.statusCode).to.equal(400);
					expect(response.status).to.equal('Fail');
					expect(response.message).to.equal('State is required!');
					done();
				});
		});

		it('It should not create a user if phone number is undefined', (done) => {
			server
				.post('/api/v1/auth/signup')
				.send(users[7])
				.end((err, res) => {
					const response = res.body;
					expect(res.statusCode).to.equal(400);
					expect(response.status).to.equal('Fail');
					expect(response.message).to.equal('Phone number is required!');
					done();
				});
		});

		it('It should not create a user if email address is undefined', (done) => {
			server
				.post('/api/v1/auth/signup')
				.send(users[8])
				.end((err, res) => {
					const response = res.body;
					expect(res.statusCode).to.equal(400);
					expect(response.status).to.equal('Fail');
					expect(response.message).to.equal('E-mail address is required!');
					done();
				});
		});

		it('It should not create a user if password is undefined', (done) => {
			server
				.post('/api/v1/auth/signup')
				.send(users[9])
				.end((err, res) => {
					const response = res.body;
					expect(res.statusCode).to.equal(400);
					expect(response.status).to.equal('Fail');
					expect(response.message).to.equal('Password is required!');
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
					expect(response.message).to.equal('E-mail address has been used!');
					done();
				});
		});

		it('It should not create a user if phone number has been used', (done) => { 
			users[0].email = 'example1@gmail.com';
			server
				.post('/api/v1/auth/signup')
				.send(users[0])
				.end((err, res) => {
					const response = res.body;
					expect(res.statusCode).to.equal(409);
					expect(response.status).to.equal('Fail');
					expect(response.message).to.equal('Phone number has been used!');
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
					expect(res.statusCode).to.equal(400);
					expect(response.status).to.equal('Fail');
					expect(response.message).to.equal('Firstname cannot be empty!');
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
					expect(res.statusCode).to.equal(400);
					expect(response.status).to.equal('Fail');
					expect(response.message).to.equal('Lastname cannot be empty!');
					done();
				});
		});

		it('It should not create a user if gender is empty', (done) => { 
			users[0].lastname = 'Ogugayo';
			users[0].gender = '';
			server
				.post('/api/v1/auth/signup')
				.send(users[0])
				.end((err, res) => {
					const response = res.body;
					expect(res.statusCode).to.equal(400);
					expect(response.status).to.equal('Fail');
					expect(response.message).to.equal('Gender cannot be empty!');
					done();
				});
		});

		it('It should not create a user if address is empty', (done) => { 
			users[0].gender = 'Male';
			users[0].address = '';
			server
				.post('/api/v1/auth/signup')
				.send(users[0])
				.end((err, res) => {
					const response = res.body;
					expect(res.statusCode).to.equal(400);
					expect(response.status).to.equal('Fail');
					expect(response.message).to.equal('Address cannot be empty!');
					done();
				});
		});

		it('It should not create a user if city is empty', (done) => { 
			users[0].address = '23, Bola Ige Street';
			users[0].city = '';
			server
				.post('/api/v1/auth/signup')
				.send(users[0])
				.end((err, res) => {
					const response = res.body;
					expect(res.statusCode).to.equal(400);
					expect(response.status).to.equal('Fail');
					expect(response.message).to.equal('City or town cannot be empty!');
					done();
				});
		});

		it('It should not create a user if state is empty', (done) => { 
			users[0].city = 'Ikeja';
			users[0].state = '';
			server
				.post('/api/v1/auth/signup')
				.send(users[0])
				.end((err, res) => {
					const response = res.body;
					expect(res.statusCode).to.equal(400);
					expect(response.status).to.equal('Fail');
					expect(response.message).to.equal('State cannot be empty!');
					done();
				});
		});

		it('It should not create a user if phone number is empty', (done) => { 
			users[0].state = 'Lagos';
			users[0].phone = '';
			server
				.post('/api/v1/auth/signup')
				.send(users[0])
				.end((err, res) => {
					const response = res.body;
					expect(res.statusCode).to.equal(400);
					expect(response.status).to.equal('Fail');
					expect(response.message).to.equal('Phone number cannot be empty!');
					done();
				});
		});

		it('It should not create a user if email address is empty', (done) => { 
			users[0].phone = '08035610915';
			users[0].email = '';
			server
				.post('/api/v1/auth/signup')
				.send(users[0])
				.end((err, res) => {
					const response = res.body;
					expect(res.statusCode).to.equal(400);
					expect(response.status).to.equal('Fail');
					expect(response.message).to.equal('E-mail address cannot be empty!');
					done();
				});
		});

		it('It should not create a user for invalid email address', (done) => { 
			users[0].phone = '08035610915';
			users[0].email = 'example@gmail';
			server
				.post('/api/v1/auth/signup')
				.send(users[0])
				.end((err, res) => {
					const response = res.body;
					expect(res.statusCode).to.equal(400);
					expect(response.status).to.equal('Fail');
					expect(response.message).to.equal('Please, enter a valid email address!');
					done();
				});
		});

		it('It should not create a user for invalid phone number', (done) => { 
			users[0].phone = '08035610';
			users[0].email = 'example@gmail';
			server
				.post('/api/v1/auth/signup')
				.send(users[0])
				.end((err, res) => {
					const response = res.body;
					expect(res.statusCode).to.equal(400);
					expect(response.status).to.equal('Fail');
					expect(response.message).to.equal('Please, enter a valid email address!');
					done();
				});
		});

		it('It should not create a user if password is empty', (done) => { 
			users[0].email = 'example@gmail.com';
			users[0].password = '';
			server
				.post('/api/v1/auth/signup')
				.send(users[0])
				.end((err, res) => {
					const response = res.body;
					expect(res.statusCode).to.equal(400);
					expect(response.status).to.equal('Fail');
					expect(response.message).to.equal('Password cannot be empty!');
					done();
				});
		});

		it('It should not create a user if password is less than eight characters', (done) => { 
			users[0].phone = '08035610651';
			users[0].email = 'example@gmail.com';
			users[0].password = 'Pass';
			server
				.post('/api/v1/auth/signup')
				.send(users[0])
				.end((err, res) => {
					const response = res.body;
					expect(res.statusCode).to.equal(400);
					expect(response.status).to.equal('Fail');
					expect(response.message).to.equal('Password must be at least 8 characters long!');
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
        expect(response.message).to.equal('E-mail address and password are required!');
        done();
      });
    });
  });
});