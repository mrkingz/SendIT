import chai from 'chai';
import supertest from 'supertest';
import app from '../../server/app';

const expect = chai.expect;
const server = supertest.agent(app);
let token, adminToken;

const parcel = {
	weight: 23,
	description: 'Binatone Standing fan',
	deliveryMethod: 'Fast',
	pickupAddress: '23, Bola Ige Street',
	pickupCity: 'Ikeja',
	pickupState: 'Lagos',
	pickupDate: '22/12/2018',
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
				expect(res.statusCode).to.equal(201);
				expect(response.status).to.equal('Success');
				expect(response.message).to.equal('Delivery order successfully created');
				expect(response.data).to.be.an('object');
				expect(response.data.parcel).to.have.own.property('parcelid')
					.to.be.a('number');
				expect(response.data.parcel).to.have.own.property('weight')
					.to.be.a('number').that.is.equal(parcel.weight);
				expect(response.data.parcel).to.have.own.property('description')
					.to.be.a('string').that.is.equal(parcel.description);
				expect(response.data.parcel).to.have.own.property('deliverymethod')
					.to.be.a('string').that.is.equal(parcel.deliveryMethod);
				expect(response.data.parcel).to.have.own.property('pickupaddress')
					.to.be.a('string').that.is.equal(parcel.pickupAddress);
				expect(response.data.parcel).to.have.own.property('pickupcity')
					.to.be.a('string').that.is.equal(parcel.pickupCity);
				expect(response.data.parcel).to.have.own.property('pickupstate')
					.to.be.a('string').that.is.equal(parcel.pickupState);
				expect(response.data.parcel).to.have.own.property('pickupdate')
					.to.be.a('string').that.is.equal(parcel.pickupDate);
				expect(response.data.parcel).to.have.property('userid')
					.to.be.a('number');
				expect(response.data.parcel).to.have.own.property('price')
					.to.be.a('number');
				expect(response.data.parcel).to.have.own.property('presentlocation')
					.to.be.a('string');
				expect(response.data.parcel).to.have.own.property('deliverystatus')
					.to.be.a('string');
				expect(response.data.parcel).to.have.own.property('receivername')
					.to.be.a('string').that.is.equal(parcel.receiverName);
				expect(response.data.parcel).to.have.own.property('receiverphone')
					.to.be.a('string').that.is.equal(parcel.receiverPhone);
				expect(response.data.parcel).to.have.property('createdat');
				expect(response.data.parcel).to.have.property('updatedat');
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
				expect(res.statusCode).to.equal(422);
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
				expect(res.statusCode).to.equal(422);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Delivery method is required');
				done();
			});
	});

	it('It should not create a parcel order if pickup address is undefined', (done) => {
		const { pickupAddress, ...noPAddress } = parcel;
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
				expect(res.statusCode).to.equal(422);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Pickup address is required');
				done();
			});
	});

	it('It should not create a parcel order if pickup city is undefined', (done) => {
		const { pickupCity, ...noPCity } = parcel;
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
				expect(res.statusCode).to.equal(422);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Pickup city is required');
				done();
			});
	});

	it('It should not create a parcel order if pickup state is undefined', (done) => {
		const { pickupState, ...noPState } = parcel;
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
				expect(res.statusCode).to.equal(422);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Pickup state is required');
				done();
			});
	});

	it('It should not create a parcel order if pickup date is undefined', (done) => {
		const { pickupDate, ...noPDate } = parcel;
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
				expect(res.statusCode).to.equal(422);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Pickup date is required');
				done();
			});
	});

	it('It should not create a parcel order if destination address is undefined', (done) => {
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
				expect(res.statusCode).to.equal(422);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Destination address is required');
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
				expect(res.statusCode).to.equal(422);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Destination city is required');
				done();
			});
	});

	it('It should not create a parcel order if destination state is undefined', (done) => {
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
				expect(res.statusCode).to.equal(422);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Destination state is required');
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
				expect(res.statusCode).to.equal(422);
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
				expect(res.statusCode).to.equal(422);
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
				expect(res.statusCode).to.equal(422);
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
				expect(res.statusCode).to.equal(422);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Delivery method is not allowed to be empty');
				done();
			});
	});

	it('It should not create a parcel order if pickup address is empty', (done) => {
		server
			.post('/api/v1/parcels')
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', token)
			.send({ ...parcel, pickupAddress: '' })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(422);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Pickup address is not allowed to be empty');
				done();
			});
	});

	it('It should not create a parcel order if pickup city is empty', (done) => {
		server
			.post('/api/v1/parcels')
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', token)
			.send({ ...parcel, pickupCity: '' })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(422);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Pickup city is not allowed to be empty');
				done();
			});
	});

	it('It should not create a parcel order if pickup state is empty', (done) => {
		server
			.post('/api/v1/parcels')
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', token)
			.send({ ...parcel, pickupState: '' })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(422);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Pickup state is not allowed to be empty');
				done();
			});
	});

	it('It should not create a parcel order if pickup date is empty', (done) => {
		server
			.post('/api/v1/parcels')
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', token)
			.send({ ...parcel, pickupDate: '' })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(422);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Pickup date is not allowed to be empty');
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
				expect(res.statusCode).to.equal(422);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Destination address is not allowed to be empty');
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
				expect(res.statusCode).to.equal(422);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Destination city is not allowed to be empty');
				done();
			});
	});

	it('It should not create a parcel order if destination state is empty', (done) => {
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
				expect(res.statusCode).to.equal(422);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Destination state is not allowed to be empty');
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
				expect(res.statusCode).to.equal(422);
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
				expect(res.statusCode).to.equal(422);
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
				expect(res.statusCode).to.equal(422);
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
				expect(res.statusCode).to.equal(422);
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
				expect(res.statusCode).to.equal(422);
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
				expect(response.data.parcels[0]).to.have.own.property('parcelid')
					.to.be.a('number');
				expect(response.data.parcels[0]).to.have.own.property('weight')
					.to.be.a('number').that.is.equal(parcel.weight);
				expect(response.data.parcels[0]).to.have.own.property('description')
					.to.be.a('string').that.is.equal(parcel.description);
				expect(response.data.parcels[0]).to.have.own.property('deliverymethod')
					.to.be.a('string').that.is.equal(parcel.deliveryMethod);
				expect(response.data.parcels[0]).to.have.own.property('pickupaddress')
					.to.be.a('string').that.is.equal(parcel.pickupAddress);
				expect(response.data.parcels[0]).to.have.own.property('pickupcity')
					.to.be.a('string').that.is.equal(parcel.pickupCity);
				expect(response.data.parcels[0]).to.have.own.property('pickupstate')
					.to.be.a('string').that.is.equal(parcel.pickupState);
				expect(response.data.parcels[0]).to.have.own.property('pickupdate')
					.to.be.a('string').that.is.equal(parcel.pickupDate);
				expect(response.data.parcels[0]).to.have.property('userid')
					.to.be.a('number');
				expect(response.data.parcels[0]).to.have.own.property('price')
					.to.be.a('number');
				expect(response.data.parcels[0]).to.have.own.property('presentlocation')
					.to.be.a('string');
				expect(response.data.parcels[0]).to.have.own.property('deliverystatus')
					.to.be.a('string');
				expect(response.data.parcels[0]).to.have.own.property('receivername')
					.to.be.a('string').that.is.equal(parcel.receiverName);
				expect(response.data.parcels[0]).to.have.own.property('receiverphone')
					.to.be.a('string').that.is.equal(parcel.receiverPhone);
				expect(response.data.parcels[0]).to.have.property('createdat');
				expect(response.data.parcels[0]).to.have.property('updatedat');
				done();
			});
	});

	it('It should not get a specific parcel if user is not an admin', (done) => {
		server
			.get('/api/v1/parcels/1')
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
			.get('/api/v1/parcels/1')
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', adminToken)
			.end((err, res) => {
				const response = res.body;
				// expect(res.statusCode).to.equal(302);
				// expect(response.status).to.equal('Success');
				expect(response.message).to.equal('Parcel successfully retrieved');
				expect(response.data).to.be.an('object');
				expect(response.data.parcel).to.have.own.property('parcelid')
					.to.be.a('number');
				expect(response.data.parcel).to.have.own.property('weight')
					.to.be.a('number').that.is.equal(parcel.weight);
				expect(response.data.parcel).to.have.own.property('description')
					.to.be.a('string').that.is.equal(parcel.description);
				expect(response.data.parcel).to.have.own.property('deliverymethod')
					.to.be.a('string').that.is.equal(parcel.deliveryMethod);
				expect(response.data.parcel).to.have.own.property('pickupaddress')
					.to.be.a('string').that.is.equal(parcel.pickupAddress);
				expect(response.data.parcel).to.have.own.property('pickupcity')
					.to.be.a('string').that.is.equal(parcel.pickupCity);
				expect(response.data.parcel).to.have.own.property('pickupstate')
					.to.be.a('string').that.is.equal(parcel.pickupState);
				expect(response.data.parcel).to.have.own.property('pickupdate')
					.to.be.a('string').that.is.equal(parcel.pickupDate);
				expect(response.data.parcel).to.have.property('userid')
					.to.be.a('number');
				expect(response.data.parcel).to.have.own.property('price')
					.to.be.a('number');
				expect(response.data.parcel).to.have.own.property('presentlocation')
					.to.be.a('string');
				expect(response.data.parcel).to.have.own.property('deliverystatus')
					.to.be.a('string');
				expect(response.data.parcel).to.have.own.property('receivername')
					.to.be.a('string').that.is.equal(parcel.receiverName);
				expect(response.data.parcel).to.have.own.property('receiverphone')
					.to.be.a('string').that.is.equal(parcel.receiverPhone);
				expect(response.data.parcel).to.have.property('createdat');
				expect(response.data.parcel).to.have.property('updatedat');
				done();
			});
	});

	it('It should get all users\'s parcels', (done) => {
		server
			.get('/api/v1/users/2/parcels')
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
				expect(response.data.parcels[0]).to.have.own.property('parcelid')
					.to.be.a('number');
				expect(response.data.parcels[0]).to.have.own.property('weight')
					.to.be.a('number').that.is.equal(parcel.weight);
				expect(response.data.parcels[0]).to.have.own.property('description')
					.to.be.a('string').that.is.equal(parcel.description);
				expect(response.data.parcels[0]).to.have.own.property('deliverymethod')
					.to.be.a('string').that.is.equal(parcel.deliveryMethod);
				expect(response.data.parcels[0]).to.have.own.property('pickupaddress')
					.to.be.a('string').that.is.equal(parcel.pickupAddress);
				expect(response.data.parcels[0]).to.have.own.property('pickupcity')
					.to.be.a('string').that.is.equal(parcel.pickupCity);
				expect(response.data.parcels[0]).to.have.own.property('pickupstate')
					.to.be.a('string').that.is.equal(parcel.pickupState);
				expect(response.data.parcels[0]).to.have.own.property('pickupdate')
					.to.be.a('string').that.is.equal(parcel.pickupDate);
				expect(response.data.parcels[0]).to.have.property('userid')
					.to.be.a('number');
				expect(response.data.parcels[0]).to.have.own.property('price')
					.to.be.a('number');
				expect(response.data.parcels[0]).to.have.own.property('presentlocation')
					.to.be.a('string');
				expect(response.data.parcels[0]).to.have.own.property('deliverystatus')
					.to.be.a('string');
				expect(response.data.parcels[0]).to.have.own.property('receivername')
					.to.be.a('string').that.is.equal(parcel.receiverName);
				expect(response.data.parcels[0]).to.have.own.property('receiverphone')
					.to.be.a('string').that.is.equal(parcel.receiverPhone);
				expect(response.data.parcels[0]).to.have.property('createdat');
				expect(response.data.parcels[0]).to.have.property('updatedat');
				done();
			});
	});

	it('It should get a user specific parcel', (done) => {
		server
			.get('/api/v1/users/2/parcels/1')
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
				expect(response.data.parcel).to.have.own.property('parcelid')
					.to.be.a('number');
				expect(response.data.parcel).to.have.own.property('weight')
					.to.be.a('number').that.is.equal(parcel.weight);
				expect(response.data.parcel).to.have.own.property('description')
					.to.be.a('string').that.is.equal(parcel.description);
				expect(response.data.parcel).to.have.own.property('deliverymethod')
					.to.be.a('string').that.is.equal(parcel.deliveryMethod);
				expect(response.data.parcel).to.have.own.property('pickupaddress')
					.to.be.a('string').that.is.equal(parcel.pickupAddress);
				expect(response.data.parcel).to.have.own.property('pickupcity')
					.to.be.a('string').that.is.equal(parcel.pickupCity);
				expect(response.data.parcel).to.have.own.property('pickupstate')
					.to.be.a('string').that.is.equal(parcel.pickupState);
				expect(response.data.parcel).to.have.own.property('pickupdate')
					.to.be.a('string').that.is.equal(parcel.pickupDate);
				expect(response.data.parcel).to.have.property('userid')
					.to.be.a('number');
				expect(response.data.parcel).to.have.own.property('price')
					.to.be.a('number');
				expect(response.data.parcel).to.have.own.property('presentlocation')
					.to.be.a('string');
				expect(response.data.parcel).to.have.own.property('deliverystatus')
					.to.be.a('string');
				expect(response.data.parcel).to.have.own.property('receivername')
					.to.be.a('string').that.is.equal(parcel.receiverName);
				expect(response.data.parcel).to.have.own.property('receiverphone')
					.to.be.a('string').that.is.equal(parcel.receiverPhone);
				expect(response.data.parcel).to.have.property('createdat');
				expect(response.data.parcel).to.have.property('updatedat');
				done();
			});
	});

	it(`It should not get a user specific parcel
		  if userId from decoded token and params mismatch`, (done) => {
			server
				.get('/api/v1/users/1/parcels/1')
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

	it(`It should not update the destination of a parcel
	    if all required fields are not provided`, (done) => {
			server
				.put('/api/v1/parcels/1/destination')
				.set('Connection', 'keep alive')
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json')
				.type('form')
				.set('token', token)
				.send({})
				.end((err, res) => {
					const response = res.body;
					expect(res.statusCode).to.equal(422);
					expect(response.status).to.equal('Fail');
					expect(response.message).to.equal('Destination address is required');
					done();
				});
		});

	it(`It should not update the destination of a parcel
		  if all required fields are not provided`, (done) => {
			server
				.put('/api/v1/parcels/1/destination')
				.set('Connection', 'keep alive')
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json')
				.type('form')
				.set('token', token)
				.send({ destinationAddress: '16, Ajayi Crowter Street' })
				.end((err, res) => {
					const response = res.body;
					expect(res.statusCode).to.equal(422);
					expect(response.status).to.equal('Fail');
					expect(response.message).to.equal('Destination city is required');
					done();
				});
		});

	it(`It should not update the destination of a parcel
	    if all required fields are not provided`, (done) => {
			server
				.put('/api/v1/parcels/1/destination')
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
					expect(res.statusCode).to.equal(422);
					expect(response.status).to.equal('Fail');
					expect(response.message).to.equal('Destination state is required');
					done();
				});
		});

	it('It should update the destination of a parcel', (done) => {
		server
			.put('/api/v1/parcels/1/destination')
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
				expect(response.message).to.equal('Parcel destination successfully updated');
				done();
			});
	});

	it('It should not update the destination of a parcel address is empty', (done) => {
		server
			.put('/api/v1/parcels/1/destination')
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
				expect(res.statusCode).to.equal(422);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Destination address is not allowed to be empty');
				done();
			});
	});

	it('It should not update the destination of a parcel address is empty', (done) => {
		server
			.put('/api/v1/parcels/1/destination')
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
				expect(res.statusCode).to.equal(422);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Destination city is not allowed to be empty');
				done();
			});
	});

	it('It should not update the destination of a parcel address is empty', (done) => {
		server
			.put('/api/v1/parcels/1/destination')
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
				expect(res.statusCode).to.equal(422);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Destination state is not allowed to be empty');
				done();
			});
	});

	it(`It should not update the present location 
	of a pacel if location is not provided`, (done) => {
			server
				.put('/api/v1/parcels/1/presentLocation')
				.set('Connection', 'keep alive')
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json')
				.type('form')
				.set('token', adminToken)
				.send({ })
				.end((err, res) => {
					const response = res.body;
					expect(res.statusCode).to.equal(422);
					expect(response.status).to.equal('Fail');
					expect(response.message)
						.to.equal('Present location is required');
					done();
				});
		});

	it(`It should not update the present location 
	    of a pacel if not transitin`, (done) => {
			server
				.put('/api/v1/parcels/1/presentLocation')
				.set('Connection', 'keep alive')
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json')
				.type('form')
				.set('token', adminToken)
				.send({ presentLocation: '' })
				.end((err, res) => {
					const response = res.body;
					expect(res.statusCode).to.equal(422);
					expect(response.status).to.equal('Fail');
					expect(response.message)
						.to.equal('Present location is not allowed to be empty');
					done();
				});
		});


		it(`It should not update the present location 
		of a pacel if user is not an admin`, (done) => {
		server
			.put('/api/v1/parcels/1/presentLocation')
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

	it('It should not update the status of an order if new status is not provided', (done) => {
		server
			.put('/api/v1/parcels/1/status')
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
					.to.equal('Delivery order status successfully updated');
				expect(response.data.parcel).to.have.own.property('deliverystatus')
					.to.be.a('string').that.is.equal('Transiting');
				done();
			});
	});

	it(`It should update the present location`, (done) => {
		server
			.put('/api/v1/parcels/1/presentLocation')
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', adminToken)
			.send({ presentLocation: 'Lagos' })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(200);
				expect(response.status).to.equal('Success');
				expect(response.message)
					.to.equal('Present location successfully updated');
				done();
			});
	});

	it('It should cancel the destination of a parcel', (done) => {
		server
			.put('/api/v1/parcels/1/cancel')
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
				expect(response.data.parcel).to.have.own.property('parcelid')
					.to.be.a('number');
				expect(response.data.parcel).to.have.own.property('weight')
					.to.be.a('number').that.is.equal(parcel.weight);
				expect(response.data.parcel).to.have.own.property('description')
					.to.be.a('string').that.is.equal(parcel.description);
				expect(response.data.parcel).to.have.own.property('deliverymethod')
					.to.be.a('string').that.is.equal(parcel.deliveryMethod);
				expect(response.data.parcel).to.have.own.property('pickupaddress')
					.to.be.a('string').that.is.equal(parcel.pickupAddress);
				expect(response.data.parcel).to.have.own.property('pickupcity')
					.to.be.a('string').that.is.equal(parcel.pickupCity);
				expect(response.data.parcel).to.have.own.property('pickupstate')
					.to.be.a('string').that.is.equal(parcel.pickupState);
				expect(response.data.parcel).to.have.own.property('pickupdate')
					.to.be.a('string').that.is.equal(parcel.pickupDate);
				expect(response.data.parcel).to.have.property('userid')
					.to.be.a('number');
				expect(response.data.parcel).to.have.own.property('price')
					.to.be.a('number');
				expect(response.data.parcel).to.have.own.property('presentlocation')
					.to.be.a('string');
				expect(response.data.parcel).to.have.own.property('deliverystatus')
					.to.be.a('string').that.is.equal('Cancelled');
				expect(response.data.parcel).to.have.own.property('receivername')
					.to.be.a('string').that.is.equal(parcel.receiverName);
				expect(response.data.parcel).to.have.own.property('receiverphone')
					.to.be.a('string').that.is.equal(parcel.receiverPhone);
				expect(response.data.parcel).to.have.property('createdat');
				expect(response.data.parcel).to.have.property('updatedat');
				done();
			});
	});

	it('It should not update the status of an order if user is not an admin', (done) => {
		server
			.put('/api/v1/parcels/1/status')
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

	it('It should not update the status of an order if new status is not provided', (done) => {
		server
			.put('/api/v1/parcels/1/status')
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', adminToken)
			.send({})
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(422);
				expect(response.status).to.equal('Fail');
				expect(response.message)
					.to.equal('Delivery status is required');
				done();
			});
	});

	it('It should not update the status of an order if new status is not provided', (done) => {
		server
			.put('/api/v1/parcels/1/status')
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', adminToken)
			.send({ deliveryStatus: '' })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(422);
				expect(response.status).to.equal('Fail');
				expect(response.message)
					.to.equal('Delivery status is not allowed to be empty');
				done();
			});
	});

	it('It should not update the status of an order if new status is not provided', (done) => {
		server
			.put('/api/v1/parcels/1/status')
			.set('Connection', 'keep alive')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.type('form')
			.set('token', adminToken)
			.send({ deliveryStatus: 'Whatever' })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(422);
				expect(response.status).to.equal('Fail');
				expect(response.message)
					.to.equal('Delivery status must be one of [Transiting, Delivered]');
				done();
			});
	});

	it('It should not update the destination of a parcel if cancelled', (done) => {
		server
			.put('/api/v1/parcels/1/destination')
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
					.to.equal('Parcel has been cancelled, destination cannot be updated');
				done();
			});
	});
});