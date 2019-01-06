import chai from 'chai';
import supertest from 'supertest';
import app from '../../server/app';

const expect = chai.expect;
const server = supertest.agent(app);
let token, adminToken, user, parcel1, parcel2;

const parcel = {
	weight: 23,
	description: 'Binatone Standing fan',
	deliveryMethod: 'Fast',
	pickUpAddress: '23, Bola Ige Street',
	pickUpCity: 'Ikeja',
	pickUpState: 'Lagos',
	pickUpDate: '22/12/2018',
	destinationAddress: '23, Bola Ige Street',
	destinationCity: 'Ikeja',
	destinationState: 'Lagos',
	receiverName: 'Obiebi Michael',
	receiverPhone: '08054329076'
};

describe('Test parcel routes', () => {
	before((done) => {
		server
			.post('/api/v1/auth/login')
			.send({
				email: 'example@gmail.com',
				password: 'Password1'
			})
			.end((err, res) => {
				const response = res.body;
				user = res.body.data.user;
				token = response.data.token;
				done();
			});
	});

	before((done) => {
		server
			.post('/api/v1/auth/login')
			.send({
				email: 'admin@gmail.com',
				password: 'Password1'
			})
			.end((err, res) => {
				const response = res.body;
				adminToken = response.data.token;
				done();
			});
	});

	it('It not create maintenance request for token not provided', (done) => {
		server
			.post('/api/v1/parcels')
			.send(parcel)
			.end((err, res) => {
				const response = res.body;
				expect(response).to.be.an('object');
				expect(res.statusCode).to.equal(401);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Access denied! Token not provided');
				done();
			});
	});

	it('It should create a parcel delivery order', (done) => {
		server
			.post('/api/v1/parcels')
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', token)
			.send(parcel)
			.end((err, res) => {
				const response = res.body;
				parcel1 = res.body.data.parcel;
				expect(res.statusCode).to.equal(201);
				expect(response.status).to.equal('Success');
				expect(response.message).to.equal('Delivery order successfully created');
				expect(response.data).to.be.an('object');
				expect(response.data.parcel).to.have.own.property('parcelId')
					.to.be.a('number');
				expect(response.data.parcel).to.have.own.property('weight')
					.to.be.a('number').that.is.equal(parcel.weight);
				expect(response.data.parcel).to.have.own.property('description')
					.to.be.a('string').that.is.equal(parcel.description);
				expect(response.data.parcel).to.have.own.property('deliveryMethod')
					.to.be.a('string').that.is.equal(parcel.deliveryMethod);
				expect(response.data.parcel).to.have.own.property('pickUpAddress')
					.to.be.a('string').that.is.equal(parcel.pickUpAddress);
				expect(response.data.parcel).to.have.own.property('pickUpcity')
					.to.be.a('string').that.is.equal(parcel.pickUpCity);
				expect(response.data.parcel).to.have.own.property('pickUpState')
					.to.be.a('string').that.is.equal(parcel.pickUpState);
				expect(response.data.parcel).to.have.own.property('pickUpDate')
					.to.be.a('string').that.is.equal(parcel.pickUpDate);
				expect(response.data.parcel).to.have.property('userId')
					.to.be.a('number');
				expect(response.data.parcel).to.have.own.property('price')
					.to.be.a('number');
				expect(response.data.parcel).to.have.own.property('presentLocation')
					.to.be.a('string');
				expect(response.data.parcel).to.have.own.property('deliveryStatus')
					.to.be.a('string');
				expect(response.data.parcel).to.have.own.property('receiverName')
					.to.be.a('string').that.is.equal(parcel.receiverName);
				expect(response.data.parcel).to.have.own.property('receiverPhone')
					.to.be.a('string').that.is.equal(parcel.receiverPhone);
				expect(response.data.parcel).to.have.property('createdAt');
				expect(response.data.parcel).to.have.property('updatedAt');
				done();
			});
	});

	it('It should not create a order if weight is undefined', (done) => {
		const { weight, ...noWeight } = parcel;
		server
			.post('/api/v1/parcels')
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', token)
			.send(noWeight)
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Weight is required');
				done();
			});
	});

	it('It should not create a parcel order if delivery method is undefined', (done) => {
		const { deliveryMethod, ...noMethod } = parcel;
		server
			.post('/api/v1/parcels')
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', token)
			.send(noMethod)
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Delivery method is required');
				done();
			});
	});

	it('It should not create a parcel order if pickUp Address is undefined', (done) => {
		const { pickUpAddress, ...noPAddress } = parcel;
		server
			.post('/api/v1/parcels')
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', token)
			.send(noPAddress)
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('pickUp Address is required');
				done();
			});
	});

	it('It should not create a parcel order if pickUp city is undefined', (done) => {
		const { pickUpCity, ...noPCity } = parcel;
		server
			.post('/api/v1/parcels')
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', token)
			.send(noPCity)
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('pickUp city is required');
				done();
			});
	});

	it('It should not create a parcel order if pickUp State is undefined', (done) => {
		const { pickUpState, ...noPState } = parcel;
		server
			.post('/api/v1/parcels')
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', token)
			.send(noPState)
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('pickUp State is required');
				done();
			});
	});

	it('It should not create a parcel order if pickUp Date is undefined', (done) => {
		const { pickUpDate, ...noPDate } = parcel;
		server
			.post('/api/v1/parcels')
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', token)
			.send(noPDate)
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('pickUp Date is required');
				done();
			});
	});

	it('It should not create a parcel order if destination Address is undefined', (done) => {
		const { destinationAddress, ...noDAddress } = parcel;
		server
			.post('/api/v1/parcels')
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', token)
			.send(noDAddress)
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Destination Address is required');
				done();
			});
	});

	it('It should not create a parcel order if destination city is undefined', (done) => {
		const { destinationCity, ...noDCity } = parcel;
		server
			.post('/api/v1/parcels')
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', token)
			.send(noDCity)
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Destination city is required');
				done();
			});
	});

	it('It should not create a parcel order if destination State is undefined', (done) => {
		const { destinationState, ...noDState } = parcel;
		server
			.post('/api/v1/parcels')
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', token)
			.send(noDState)
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Destination State is required');
				done();
			});
	});

	it('It should not create a parcel order if receiver name is undefined', (done) => {
		const { receiverName, ...noRName } = parcel;
		server
			.post('/api/v1/parcels')
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', token)
			.send(noRName)
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal(`Receiver name is required`);
				done();
			});
	});

	it('It should not create a parcel order if receiver phone is undefined', (done) => {
		const { receiverPhone, ...noRPhone } = parcel;
		server
			.post('/api/v1/parcels')
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', token)
			.send(noRPhone)
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal(`Receiver phone number is required`);
				done();
			});
	});

	it('It should not create a parcel order if weight is empty', (done) => {
		server
			.post('/api/v1/parcels')
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', token)
			.send({ ...parcel, weight: '' })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Weight must be a number');
				done();
			});
	});

	it('It should not create a parcel order if delivery method is empty', (done) => {
		server
			.post('/api/v1/parcels')
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', token)
			.send({ ...parcel, deliveryMethod: '' })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Delivery method is not allowed to be empty');
				done();
			});
	});

	it('It should not create a parcel order if pickUp Address is empty', (done) => {
		server
			.post('/api/v1/parcels')
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', token)
			.send({ ...parcel, pickUpAddress: '' })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('pickUp Address is not allowed to be empty');
				done();
			});
	});

	it('It should not create a parcel order if pickUp city is empty', (done) => {
		server
			.post('/api/v1/parcels')
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', token)
			.send({ ...parcel, pickUpCity: '' })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('pickUp city is not allowed to be empty');
				done();
			});
	});

	it('It should not create a parcel order if pickUp State is empty', (done) => {
		server
			.post('/api/v1/parcels')
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', token)
			.send({ ...parcel, pickUpState: '' })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('pickUp State is not allowed to be empty');
				done();
			});
	});

	it('It should not create a parcel order if pickUp Date is empty', (done) => {
		server
			.post('/api/v1/parcels')
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', token)
			.send({ ...parcel, pickUpDate: '' })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('pickUp Date is not allowed to be empty');
				done();
			});
	});

	it('It should not create a parcel order if destination city is empty', (done) => {
		server
			.post('/api/v1/parcels')
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', token)
			.send({ ...parcel, destinationAddress: '' })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Destination Address is not allowed to be empty');
				done();
			});
	});

	it('It should not create a parcel order if destination city is empty', (done) => {
		server
			.post('/api/v1/parcels')
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', token)
			.send({ ...parcel, destinationCity: '' })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Destination city is not allowed to be empty');
				done();
			});
	});

	it('It should not create a parcel order if destination State is empty', (done) => {
		server
			.post('/api/v1/parcels')
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', token)
			.send({ ...parcel, destinationState: '' })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Destination State is not allowed to be empty');
				done();
			});
	});

	it('It should not create a parcel order if name of receiver is empty', (done) => {
		server
			.post('/api/v1/parcels')
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', token)
			.send({ ...parcel, receiverName: '' })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Receiver name is not allowed to be empty');
				done();
			});
	});

	it('It should not create a parcel order if phone number of receiver is empty', (done) => {
		server
			.post('/api/v1/parcels')
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', token)
			.send({ ...parcel, receiverPhone: '' })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Receiver phone number is not allowed to be empty');
				done();
			});
	});

	it('It should not create a parcel order if weight is invalid', (done) => {
		server
			.post('/api/v1/parcels')
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', token)
			.send({ ...parcel, weight: 'foo' })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Weight must be a number');
				done();
			});
	});

	it('It should not create a parcel order if delivery method is invalid', (done) => {
		server
			.post('/api/v1/parcels')
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', token)
			.send({ ...parcel, deliveryMethod: 'Quick' })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message)
					.to.equal('Delivery method must be one of [Fast, Normal]');
				done();
			});
	});

	it('It should not create a parcel order if phone number is invalid', (done) => {
		server
			.post('/api/v1/parcels')
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', token)
			.send({ ...parcel, receiverPhone: '080865tghghff7i87' })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message)
					.to.equal('Receiver phone number is inavlid');
				done();
			});
	});

	it('It should not get all parcels if user is not an admin', (done) => {
		server
			.get('/api/v1/parcels')
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', token)
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(401);
				expect(response.status).to.equal('Fail');
				expect(response.message)
					.to.equal('You do not have the privilege for this operation');
				done();
			});
	});

	it('It should get all parcels if user is admin', (done) => {
		server
			.get('/api/v1/parcels')
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', adminToken)
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(302);
				expect(response.status).to.equal('Success');
				expect(response.message).to.equal('Parcels successfully retrieved');
				expect(response.data).to.be.an('object');
				expect(response.data.parcels).to.be.a('array');
				expect(response.data.parcels[0]).to.have.own.property('parcelId')
					.to.be.a('number');
				expect(response.data.parcels[0]).to.have.own.property('weight')
					.to.be.a('number').that.is.equal(parcel.weight);
				expect(response.data.parcels[0]).to.have.own.property('description')
					.to.be.a('string').that.is.equal(parcel.description);
				expect(response.data.parcels[0]).to.have.own.property('deliveryMethod')
					.to.be.a('string').that.is.equal(parcel.deliveryMethod);
				expect(response.data.parcels[0]).to.have.own.property('pickUpAddress')
					.to.be.a('string').that.is.equal(parcel.pickUpAddress);
				expect(response.data.parcels[0]).to.have.own.property('pickUpcity')
					.to.be.a('string').that.is.equal(parcel.pickUpCity);
				expect(response.data.parcels[0]).to.have.own.property('pickUpState')
					.to.be.a('string').that.is.equal(parcel.pickUpState);
				expect(response.data.parcels[0]).to.have.own.property('pickUpDate')
					.to.be.a('string').that.is.equal(parcel.pickUpDate);
				expect(response.data.parcels[0]).to.have.property('userId')
					.to.be.a('number');
				expect(response.data.parcels[0]).to.have.own.property('price')
					.to.be.a('number');
				expect(response.data.parcels[0]).to.have.own.property('presentLocation')
					.to.be.a('string');
				expect(response.data.parcels[0]).to.have.own.property('deliveryStatus')
					.to.be.a('string');
				expect(response.data.parcels[0]).to.have.own.property('receiverName')
					.to.be.a('string').that.is.equal(parcel.receiverName);
				expect(response.data.parcels[0]).to.have.own.property('receiverPhone')
					.to.be.a('string').that.is.equal(parcel.receiverPhone);
				expect(response.data.parcels[0]).to.have.property('createdAt');
				expect(response.data.parcels[0]).to.have.property('updatedAt');
				done();
			});
	});

	it('It should not get a specific parcel if user is not an admin', (done) => {
		server
			.get(`/api/v1/parcels/${parcel1.parcelId}`)
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', token)
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(401);
				expect(response.status).to.equal('Fail');
				expect(response.message)
					.to.equal('You do not have the privilege for this operation');
				done();
			});
	});

	it('It should get a specific parcel if user is admin', (done) => {
		server
			.get(`/api/v1/parcels/${parcel1.parcelId}`)
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', adminToken)
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(302);
				expect(response.status).to.equal('Success');
				expect(response.message).to.equal('Parcel successfully retrieved');
				expect(response.data).to.be.an('object');
				expect(response.data.parcel).to.have.own.property('parcelId')
					.to.be.a('number');
				expect(response.data.parcel).to.have.own.property('weight')
					.to.be.a('number').that.is.equal(parcel.weight);
				expect(response.data.parcel).to.have.own.property('description')
					.to.be.a('string').that.is.equal(parcel.description);
				expect(response.data.parcel).to.have.own.property('deliveryMethod')
					.to.be.a('string').that.is.equal(parcel.deliveryMethod);
				expect(response.data.parcel).to.have.own.property('pickUpAddress')
					.to.be.a('string').that.is.equal(parcel.pickUpAddress);
				expect(response.data.parcel).to.have.own.property('pickUpcity')
					.to.be.a('string').that.is.equal(parcel.pickUpCity);
				expect(response.data.parcel).to.have.own.property('pickUpState')
					.to.be.a('string').that.is.equal(parcel.pickUpState);
				expect(response.data.parcel).to.have.own.property('pickUpDate')
					.to.be.a('string').that.is.equal(parcel.pickUpDate);
				expect(response.data.parcel).to.have.property('userId')
					.to.be.a('number');
				expect(response.data.parcel).to.have.own.property('price')
					.to.be.a('number');
				expect(response.data.parcel).to.have.own.property('presentLocation')
					.to.be.a('string');
				expect(response.data.parcel).to.have.own.property('deliveryStatus')
					.to.be.a('string');
				expect(response.data.parcel).to.have.own.property('receiverName')
					.to.be.a('string').that.is.equal(parcel.receiverName);
				expect(response.data.parcel).to.have.own.property('receiverPhone')
					.to.be.a('string').that.is.equal(parcel.receiverPhone);
				expect(response.data.parcel).to.have.property('createdAt');
				expect(response.data.parcel).to.have.property('updatedAt');
				done();
			});
	});

	it('It should get all users\'s parcels', (done) => {
		server
			.get(`/api/v1/users/${user.userId}/parcels`)
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', token)
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(302);
				expect(response.status).to.equal('Success');
				expect(response.message).to.equal('Parcels successfully retrieved');
				expect(response.data).to.be.an('object');
				expect(response.data.parcels).to.be.a('array');
				expect(response.data.parcels[0]).to.have.own.property('parcelId')
					.to.be.a('number');
				expect(response.data.parcels[0]).to.have.own.property('weight')
					.to.be.a('number').that.is.equal(parcel.weight);
				expect(response.data.parcels[0]).to.have.own.property('description')
					.to.be.a('string').that.is.equal(parcel.description);
				expect(response.data.parcels[0]).to.have.own.property('deliveryMethod')
					.to.be.a('string').that.is.equal(parcel.deliveryMethod);
				expect(response.data.parcels[0]).to.have.own.property('pickUpAddress')
					.to.be.a('string').that.is.equal(parcel.pickUpAddress);
				expect(response.data.parcels[0]).to.have.own.property('pickUpcity')
					.to.be.a('string').that.is.equal(parcel.pickUpCity);
				expect(response.data.parcels[0]).to.have.own.property('pickUpState')
					.to.be.a('string').that.is.equal(parcel.pickUpState);
				expect(response.data.parcels[0]).to.have.own.property('pickUpDate')
					.to.be.a('string').that.is.equal(parcel.pickUpDate);
				expect(response.data.parcels[0]).to.have.property('userId')
					.to.be.a('number');
				expect(response.data.parcels[0]).to.have.own.property('price')
					.to.be.a('number');
				expect(response.data.parcels[0]).to.have.own.property('presentLocation')
					.to.be.a('string');
				expect(response.data.parcels[0]).to.have.own.property('deliveryStatus')
					.to.be.a('string');
				expect(response.data.parcels[0]).to.have.own.property('receiverName')
					.to.be.a('string').that.is.equal(parcel.receiverName);
				expect(response.data.parcels[0]).to.have.own.property('receiverPhone')
					.to.be.a('string').that.is.equal(parcel.receiverPhone);
				expect(response.data.parcels[0]).to.have.property('createdAt');
				expect(response.data.parcels[0]).to.have.property('updatedAt');
				done();
			});
	});

	it('It should get a user specific parcel', (done) => {
		server
			.get(`/api/v1/users/${user.userId}/parcels/${parcel1.parcelId}`)
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', token)
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(302);
				expect(response.status).to.equal('Success');
				expect(response.message).to.equal('Parcel successfully retrieved');
				expect(response.data).to.be.an('object');
				expect(response.data.parcel).to.have.own.property('parcelId')
					.to.be.a('number');
				expect(response.data.parcel).to.have.own.property('weight')
					.to.be.a('number').that.is.equal(parcel.weight);
				expect(response.data.parcel).to.have.own.property('description')
					.to.be.a('string').that.is.equal(parcel.description);
				expect(response.data.parcel).to.have.own.property('deliveryMethod')
					.to.be.a('string').that.is.equal(parcel.deliveryMethod);
				expect(response.data.parcel).to.have.own.property('pickUpAddress')
					.to.be.a('string').that.is.equal(parcel.pickUpAddress);
				expect(response.data.parcel).to.have.own.property('pickUpcity')
					.to.be.a('string').that.is.equal(parcel.pickUpCity);
				expect(response.data.parcel).to.have.own.property('pickUpState')
					.to.be.a('string').that.is.equal(parcel.pickUpState);
				expect(response.data.parcel).to.have.own.property('pickUpDate')
					.to.be.a('string').that.is.equal(parcel.pickUpDate);
				expect(response.data.parcel).to.have.property('userId')
					.to.be.a('number');
				expect(response.data.parcel).to.have.own.property('price')
					.to.be.a('number');
				expect(response.data.parcel).to.have.own.property('presentLocation')
					.to.be.a('string');
				expect(response.data.parcel).to.have.own.property('deliveryStatus')
					.to.be.a('string');
				expect(response.data.parcel).to.have.own.property('receiverName')
					.to.be.a('string').that.is.equal(parcel.receiverName);
				expect(response.data.parcel).to.have.own.property('receiverPhone')
					.to.be.a('string').that.is.equal(parcel.receiverPhone);
				expect(response.data.parcel).to.have.property('createdAt');
				expect(response.data.parcel).to.have.property('updatedAt');
				done();
			});
	});

	it(`It should not get a user specific parcel
		  if userId from decoded token and params mismatch`, (done) => {
			server
				.get(`/api/v1/users/20/parcels/${parcel1.parcelId}`)
				.set('Connection', 'keep alive')
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json')
				.type('form')
				.set('token', token)
				.end((err, res) => {
					const response = res.body;
					expect(res.statusCode).to.equal(401);
					expect(response.status).to.equal('Fail');
					expect(response.message).to.equal('Sorry, not a valid logged in user');
					done();
				});
		});

	it(`It should not upDate the destination of a parcel
	    if all required fields are not provided`, (done) => {
			server
				.put(`/api/v1/parcels/${parcel1.parcelId}/destination`)
				.set('Connection', 'keep alive')
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json')
				.type('form')
				.set('token', token)
				.send({})
				.end((err, res) => {
					const response = res.body;
					expect(res.statusCode).to.equal(400);
					expect(response.status).to.equal('Fail');
					expect(response.message).to.equal('Destination Address is required');
					done();
				});
		});

	it(`It should not upDate the destination of a parcel
		  if all required fields are not provided`, (done) => {
			server
				.put(`/api/v1/parcels/${parcel1.parcelId}/destination`)
				.set('Connection', 'keep alive')
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json')
				.type('form')
				.set('token', token)
				.send({ destinationAddress: '16, Ajayi Crowter Street' })
				.end((err, res) => {
					const response = res.body;
					expect(res.statusCode).to.equal(400);
					expect(response.status).to.equal('Fail');
					expect(response.message).to.equal('Destination city is required');
					done();
				});
		});

	it(`It should not upDate the destination of a parcel
	    if all required fields are not provided`, (done) => {
			server
				.put(`/api/v1/parcels/${parcel1.parcelId}/destination`)
				.set('Connection', 'keep alive')
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json')
				.type('form')
				.set('token', token)
				.send({
					destinationAddress: '16, Ajayi Crowter Street',
					destinationCity: 'Ikeja'
				})
				.end((err, res) => {
					const response = res.body;
					expect(res.statusCode).to.equal(400);
					expect(response.status).to.equal('Fail');
					expect(response.message).to.equal('Destination State is required');
					done();
				});
		});

	it('It should upDate the destination of a parcel', (done) => {
		server
			.put(`/api/v1/parcels/${parcel1.parcelId}/destination`)
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', token)
			.send({
				destinationAddress: '16, Ajayi Crowter Street',
				destinationCity: 'Ikeja',
				destinationState: 'Lagos'
			})
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(200);
				expect(response.status).to.equal('Success');
				expect(response.message).to.equal('Parcel destination successfully upDated');
				done();
			});
	});

	it('It should not upDate the destination of a parcel Address is empty', (done) => {
		server
			.put(`/api/v1/parcels/${parcel1.parcelId}/destination`)
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', token)
			.send({
				destinationAddress: '',
				destinationCity: 'Ikeja',
				destinationState: 'Lagos'
			})
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Destination Address is not allowed to be empty');
				done();
			});
	});

	it('It should not upDate the destination of a parcel Address is empty', (done) => {
		server
			.put(`/api/v1/parcels/${parcel1.parcelId}/destination`)
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', token)
			.send({
				destinationAddress: '18, Oba Oluwole Close',
				destinationCity: '',
				destinationState: 'Lagos'
			})
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Destination city is not allowed to be empty');
				done();
			});
	});

	it('It should not upDate the destination of a parcel Address is empty', (done) => {
		server
			.put(`/api/v1/parcels/${parcel1.parcelId}/destination`)
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', token)
			.send({
				destinationAddress: '18, Oba Oluwole Close',
				destinationCity: 'Ikeja',
				destinationState: ''
			})
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Destination State is not allowed to be empty');
				done();
			});
	});

	it(`It should not upDate the present location 
	of a pacel if location is not provided`, (done) => {
			server
				.put(`/api/v1/parcels/${parcel1.parcelId}/presentLocation`)
				.set('Connection', 'keep alive')
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json')
				.type('form')
				.set('token', adminToken)
				.send({ deliveryStatus: 'Transiting' })
				.end((err, res) => {
					const response = res.body;
					expect(res.statusCode).to.equal(400);
					expect(response.status).to.equal('Fail');
					expect(response.message)
						.to.equal('Present location is required');
					done();
				});
		});

	it(`It should not upDate the present location 
	    of a pacel if not transitin`, (done) => {
			server
				.put(`/api/v1/parcels/${parcel1.parcelId}/presentLocation`)
				.set('Connection', 'keep alive')
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json')
				.type('form')
				.set('token', adminToken)
				.send({ presentLocation: '', deliveryStatus: 'Transiting' })
				.end((err, res) => {
					const response = res.body;
					expect(res.statusCode).to.equal(400);
					expect(response.status).to.equal('Fail');
					expect(response.message)
						.to.equal('Present location is not allowed to be empty');
					done();
				});
		});


	it(`It should not upDate the present location 
		of a pacel if user is not an admin`, (done) => {
			server
				.put(`/api/v1/parcels/${parcel1.parcelId}/presentLocation`)
				.set('Connection', 'keep alive')
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json')
				.type('form')
				.set('token', token)
				.send({ presentLocation: '' })
				.end((err, res) => {
					const response = res.body;
					expect(res.statusCode).to.equal(401);
					expect(response.status).to.equal('Fail');
					expect(response.message)
						.to.equal('You do not have the privilege for this operation');
					done();
				});
		});

	it('It should not upDate the status of an order if new status is not provided', (done) => {
		server
			.put(`/api/v1/parcels/${parcel1.parcelId}/status`)
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', adminToken)
			.send({ deliveryStatus: 'Transiting' })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(200);
				expect(response.status).to.equal('Success');
				expect(response.message)
					.to.equal('Delivery order status successfully upDated');
				expect(response.data.parcel).to.have.own.property('deliveryStatus')
					.to.be.a('string').that.is.equal('Transiting');
				done();
			});
	});

	it(`It should upDate the present location`, (done) => {
		server
			.put(`/api/v1/parcels/${parcel1.parcelId}/presentLocation`)
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', adminToken)
			.send({ presentLocation: 'Lagos', deliveryStatus: 'Transiting' })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(200);
				expect(response.status).to.equal('Success');
				expect(response.message)
					.to.equal('Present location successfully upDated');
				done();
			});
	});

	before((done) => {
		server
			.post('/api/v1/parcels')
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', token)
			.send(parcel)
			.end((err, res) => {
				parcel2 = res.body.data.parcel;
				done();
			});
	});

	it('It should cancel the destination of a parcel', (done) => {
		server
			.put(`/api/v1/parcels/${parcel2.parcelId}/cancel`)
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', token)
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(200);
				expect(response.status).to.equal('Success');
				expect(response.message).to.equal('Parcel delivery order successfully cancelled');
				expect(response.data).to.be.an('object');
				expect(response.data.parcel).to.have.own.property('parcelId')
					.to.be.a('number');
				expect(response.data.parcel).to.have.own.property('weight')
					.to.be.a('number').that.is.equal(parcel.weight);
				expect(response.data.parcel).to.have.own.property('description')
					.to.be.a('string').that.is.equal(parcel.description);
				expect(response.data.parcel).to.have.own.property('deliveryMethod')
					.to.be.a('string').that.is.equal(parcel.deliveryMethod);
				expect(response.data.parcel).to.have.own.property('pickUpAddress')
					.to.be.a('string').that.is.equal(parcel.pickUpAddress);
				expect(response.data.parcel).to.have.own.property('pickUpcity')
					.to.be.a('string').that.is.equal(parcel.pickUpCity);
				expect(response.data.parcel).to.have.own.property('pickUpState')
					.to.be.a('string').that.is.equal(parcel.pickUpState);
				expect(response.data.parcel).to.have.own.property('pickUpDate')
					.to.be.a('string').that.is.equal(parcel.pickUpDate);
				expect(response.data.parcel).to.have.property('userId')
					.to.be.a('number');
				expect(response.data.parcel).to.have.own.property('price')
					.to.be.a('number');
				expect(response.data.parcel).to.have.own.property('presentLocation')
					.to.be.a('string');
				expect(response.data.parcel).to.have.own.property('deliveryStatus')
					.to.be.a('string').that.is.equal('Cancelled');
				expect(response.data.parcel).to.have.own.property('receiverName')
					.to.be.a('string').that.is.equal(parcel.receiverName);
				expect(response.data.parcel).to.have.own.property('receiverPhone')
					.to.be.a('string').that.is.equal(parcel.receiverPhone);
				expect(response.data.parcel).to.have.property('createdAt');
				expect(response.data.parcel).to.have.property('updatedAt');
				done();
			});
	});

	it('It should not upDate the status of an order if user is not an admin', (done) => {
		server
			.put(`/api/v1/parcels/${parcel1.parcelId}/status`)
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', token)
			.send({})
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(401);
				expect(response.status).to.equal('Fail');
				expect(response.message)
					.to.equal('You do not have the privilege for this operation');
				done();
			});
	});

	it('It should not upDate the status of an order if new status is not provided', (done) => {
		server
			.put(`/api/v1/parcels/${parcel1.parcelId}/status`)
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', adminToken)
			.send({})
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message)
					.to.equal('Delivery status is required');
				done();
			});
	});

	it('It should not upDate the status of an order if new status is not provided', (done) => {
		server
			.put(`/api/v1/parcels/${parcel1.parcelId}/status`)
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', adminToken)
			.send({ deliveryStatus: '' })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message)
					.to.equal('Delivery status is not allowed to be empty');
				done();
			});
	});

	it('It should not upDate the status of an order if new status is not provided', (done) => {
		server
			.put(`/api/v1/parcels/${parcel1.parcelId}/status`)
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', adminToken)
			.send({ deliveryStatus: 'Whatever' })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message)
					.to.equal('Delivery status must be one of [Transiting, Delivered]');
				done();
			});
	});

	it('It should not upDate the destination of a parcel if cancelled', (done) => {
		server
			.put(`/api/v1/parcels/${parcel2.parcelId}/destination`)
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', token)
			.send({
				destinationAddress: '16, Ajayi Crowter Street',
				destinationCity: 'Ikeja',
				destinationState: 'Lagos'
			})
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(403);
				expect(response.status).to.equal('Fail');
				expect(response.message)
					.to.equal('Parcel already cancelled, destination cannot be upDated');
				done();
			});
	});
});