import chai from 'chai';
import supertest from 'supertest';
import app from '../../server/app';

const expect = chai.expect;
const server = supertest.agent(app);
let token;

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
				expect(response.message).to.equal('Parcel delivery order successfully created');
				expect(response.data).to.be.an('object');
				expect(response.data).to.have.own.property('parcelid')
				.to.be.a('number');
				expect(response.data).to.have.own.property('weight')
				.to.be.a('number').that.is.equal(parcel.weight);
				expect(response.data).to.have.own.property('description')
				.to.be.a('string').that.is.equal(parcel.description);
				expect(response.data).to.have.own.property('deliverymethod')
				.to.be.a('string').that.is.equal(parcel.deliveryMethod);
				expect(response.data).to.have.own.property('pickupaddress')
				.to.be.a('string').that.is.equal(parcel.pickupAddress);				
				expect(response.data).to.have.own.property('pickupcity')
				.to.be.a('string').that.is.equal(parcel.pickupCity);
				expect(response.data).to.have.own.property('pickupstate')
				.to.be.a('string').that.is.equal(parcel.pickupState);
				expect(response.data).to.have.own.property('pickupdate')
				.to.be.a('string').that.is.equal(parcel.pickupDate);
				expect(response.data).to.have.property('userid')
					.to.be.a('number');
				expect(response.data).to.have.own.property('price')
				.to.be.a('number');
				expect(response.data).to.have.own.property('presentlocation')
				.to.be.a('string');
				expect(response.data).to.have.own.property('deliverystatus')
				.to.be.a('string');
				expect(response.data).to.have.own.property('receivername')
				.to.be.a('string').that.is.equal(parcel.receiverName);
				expect(response.data).to.have.own.property('receiverphone')
				.to.be.a('string').that.is.equal(parcel.receiverPhone);
				expect(response.data).to.have.property('createdat');
				expect(response.data).to.have.property('updatedat');
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
});