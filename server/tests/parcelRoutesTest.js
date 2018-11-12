import chai from 'chai';
import supertest from 'supertest';
import app from '../../server/app';

const expect = chai.expect;
const server = supertest.agent(app);
let token;

const parcels = [{
	weight: 23,
	description: 'Binatone Standing fan',
	deliveryMethod: 'Fast',
	pickupAddress: '23, Bola Ige Street',
	pickupCity: 'Ikeja',
	pickupState: 'Lagos',
	pickupDate: '2018-11-10',
	pickupTime: '10:30: AM',
	destinationAddress: '23, Bola Ige Street',
	destinationCity: 'Ikeja',
	destinationState: 'Lagos',
	receiverName: 'Obiebi Michael',
	receiverPhone: '08054329076'
}, {
	description: 'Binatone Standing fan',
	deliveryMethod: 'Fast',
	pickupAddress: '23, Bola Ige Street',
	pickupCity: 'Ikeja',
	pickupState: 'Lagos',
	pickupDate: '2018-11-10',
	pickupTime: '10:30: AM',
	destinationAddress: '23, Bola Ige Street',
	destinationCity: 'Ikeja',
	destinationState: 'Lagos',
	receiverName: 'Obiebi Michael',
	receiverPhone: '08054329076'
}, {
	weight: 23,
	description: 'Binatone Standing fan',
	pickupAddress: '23, Bola Ige Street',
	pickupCity: 'Ikeja',
	pickupState: 'Lagos',
	pickupDate: '2018-11-10',
	pickupTime: '10:30: AM',
	destinationAddress: '23, Bola Ige Street',
	destinationCity: 'Ikeja',
	destinationState: 'Lagos',
	receiverName: 'Obiebi Michael',
	receiverPhone: '08054329076'
}, {
	weight: 23,
	description: 'Binatone Standing fan',
	deliveryMethod: 'Fast',
	pickupCity: 'Ikeja',
	pickupState: 'Lagos',
	pickupDate: '2018-11-10',
	pickupTime: '10:30: AM',
	destinationAddress: '23, Bola Ige Street',
	destinationCity: 'Ikeja',
	destinationState: 'Lagos',
	receiverName: 'Obiebi Michael',
	receiverPhone: '08054329076'
}, {
	weight: 23,
	description: 'Binatone Standing fan',
	deliveryMethod: 'Fast',
	pickupAddress: '23, Bola Ige Street',
	pickupState: 'Lagos',
	pickupDate: '2018-11-10',
	pickupTime: '10:30: AM',
	destinationAddress: '23, Bola Ige Street',
	destinationCity: 'Ikeja',
	destinationState: 'Lagos',
	receiverName: 'Obiebi Michael',
	receiverPhone: '08054329076'
}, {
	weight: 23,
	description: 'Binatone Standing fan',
	deliveryMethod: 'Fast',
	pickupAddress: '23, Bola Ige Street',
	pickupCity: 'Ikeja',
	pickupDate: '2018-11-10',
	pickupTime: '10:30: AM',
	destinationAddress: '23, Bola Ige Street',
	destinationCity: 'Ikeja',
	destinationState: 'Lagos',
	receiverName: 'Obiebi Michael',
	receiverPhone: '08054329076'
}, {
	weight: 23,
	description: 'Binatone Standing fan',
	deliveryMethod: 'Fast',
	pickupAddress: '23, Bola Ige Street',
	pickupCity: 'Ikeja',
	pickupState: 'Lagos',
	pickupTime: '10:30: AM',
	destinationAddress: '23, Bola Ige Street',
	destinationCity: 'Ikeja',
	destinationState: 'Lagos',
	receiverName: 'Obiebi Michael',
	receiverPhone: '08054329076'
}, {
	weight: 23,
	description: 'Binatone Standing fan',
	deliveryMethod: 'Fast',
	pickupAddress: '23, Bola Ige Street',
	pickupCity: 'Ikeja',
	pickupState: 'Lagos',
	pickupDate: '2018-11-10',
	destinationAddress: '23, Bola Ige Street',
	destinationCity: 'Ikeja',
	destinationState: 'Lagos',
	receiverName: 'Obiebi Michael',
	receiverPhone: '08054329076'
}, {
	weight: 23,
	description: 'Binatone Standing fan',
	deliveryMethod: 'Fast',
	pickupAddress: '23, Bola Ige Street',
	pickupCity: 'Ikeja',
	pickupState: 'Lagos',
	pickupDate: '2018-11-10',
	pickupTime: '10:30: AM',
	destinationCity: 'Ikeja',
	destinationState: 'Lagos',
	receiverName: 'Obiebi Michael',
	receiverPhone: '08054329076'
}, {
	weight: 23,
	description: 'Binatone Standing fan',
	deliveryMethod: 'Fast',
	pickupAddress: '23, Bola Ige Street',
	pickupCity: 'Ikeja',
	pickupState: 'Lagos',
	pickupDate: '2018-11-10',
	pickupTime: '10:30: AM',
	destinationAddress: '23, Bola Ige Street',
	destinationState: 'Lagos',
	receiverName: 'Obiebi Michael',
	receiverPhone: '08054329076'
}, {
	weight: 23,
	description: 'Binatone Standing fan',
	deliveryMethod: 'Fast',
	pickupAddress: '23, Bola Ige Street',
	pickupCity: 'Ikeja',
	pickupState: 'Lagos',
	pickupDate: '2018-11-10',
	pickupTime: '10:30: AM',
	destinationAddress: '23, Bola Ige Street',
	destinationCity: 'Oyo',
	receiverName: 'Obiebi Michael',
	receiverPhone: '08054329076'
}, {
	weight: 23,
	description: 'Binatone Standing fan',
	deliveryMethod: 'Fast',
	pickupAddress: '23, Bola Ige Street',
	pickupCity: 'Ikeja',
	pickupState: 'Lagos',
	pickupDate: '2018-11-10',
	pickupTime: '10:30: AM',
	destinationAddress: '23, Bola Ige Street',
	destinationCity: 'Ibadan',
	destinationState: 'Lagos',
	receiverPhone: '08054329076'
}, {
	weight: 23,
	description: 'Binatone Standing fan',
	deliveryMethod: 'Fast',
	pickupAddress: '23, Bola Ige Street',
	pickupCity: 'Ikeja',
	pickupState: 'Lagos',
	pickupDate: '2018-11-10',
	pickupTime: '10:30: AM',
	destinationAddress: '23, Bola Ige Street',
	destinationCity: 'Ibadan',
	destinationState: 'Lagos',
	receiverName: 'Obiebi Michael',
}];

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
    .send(parcels[0])
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
			.send({ ...parcels[0], token })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(201);
				expect(response.status).to.equal('Success');
				expect(response.message).to.equal('Parcel delivery order successfully created');
				expect(response.data).to.be.an('object');
				expect(response.data).to.have.own.property('parcelId')
				.to.be.a('number');
				expect(response.data).to.have.own.property('weight')
				.to.be.a('number').that.is.equal(parcels[0].weight);
				expect(response.data).to.have.own.property('description')
				.to.be.a('string').that.is.equal(parcels[0].description);
				expect(response.data).to.have.own.property('deliveryMethod')
				.to.be.a('string').that.is.equal(parcels[0].deliveryMethod);
				expect(response.data).to.have.own.property('pickupAddress')
				.to.be.a('string').that.is.equal(parcels[0].pickupAddress);				
				expect(response.data).to.have.own.property('pickupCity')
				.to.be.a('string').that.is.equal(parcels[0].pickupCity);
				expect(response.data).to.have.own.property('pickupState')
				.to.be.a('string').that.is.equal(parcels[0].pickupState);
				expect(response.data).to.have.own.property('pickupDate')
				.to.be.a('string').that.is.equal(parcels[0].pickupDate);
				expect(response.data).to.have.own.property('pickupTime')
				.to.be.a('string').that.is.equal(parcels[0].pickupTime);
				expect(response.data).to.have.property('userId')
					.to.be.a('number');
				expect(response.data).to.have.own.property('price')
				.to.be.a('number');
				expect(response.data).to.have.own.property('presentLocation')
				.to.be.a('string');
				expect(response.data).to.have.own.property('deliveryStatus')
				.to.be.a('string');
				expect(response.data).to.have.own.property('deliveryDuration')
				.to.be.a('string');
				expect(response.data).to.have.own.property('receiverName')
				.to.be.a('string').that.is.equal(parcels[0].receiverName);
				expect(response.data).to.have.own.property('receiverPhone')
				.to.be.a('string').that.is.equal(parcels[0].receiverPhone);
				expect(response.data).to.have.property('createdAt');
				expect(response.data).to.have.property('updatedAt');
				done();
			});
	});

	it('It should not create a order if weight is undefined', (done) => {
		server
			.post('/api/v1/parcels')
			.send({ ...parcels[1], token })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Weight is required!');
				done();
			});
	});

	it('It should not create a parcel order if delivery method is undefined', (done) => {
		server
			.post('/api/v1/parcels')
			.send({ ...parcels[2], token })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Delivery method is required!');
				done();
			});
	});

	it('It should not create a parcel order if pickup address is undefined', (done) => {
		server
			.post('/api/v1/parcels')
			.send({ ...parcels[3], token })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Pickup address is required!');
				done();
			});
	});

	it('It should not create a parcel order if pickup city is undefined', (done) => {
		server
			.post('/api/v1/parcels')
			.send({ ...parcels[4], token })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Pickup city is required!');
				done();
			});
	});

	it('It should not create a parcel order if pickup state is undefined', (done) => {
		server
			.post('/api/v1/parcels')
			.send({ ...parcels[5], token })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Pickup state is required!');
				done();
			});
	});

	it('It should not create a parcel order if pickup date is undefined', (done) => {
		server
			.post('/api/v1/parcels')
			.send({ ...parcels[6], token })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Pickup date is required!');
				done();
			});
	});

	it('It should not create a parcel order if pickup time is undefined', (done) => {
		server
			.post('/api/v1/parcels')
			.send({ ...parcels[7], token })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Pickup time is required!');
				done();
			});
	});

	it('It should not create a parcel order if destination address is undefined', (done) => {
		server
			.post('/api/v1/parcels')
			.send({ ...parcels[8], token })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Address to deliver parcel is required!');
				done();
			});
	});

	it('It should not create a parcel order if destination city is undefined', (done) => {
		server
			.post('/api/v1/parcels')
			.send({ ...parcels[9], token })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('City to deliver parcel is required!');
				done();
			});
	});

	it('It should not create a parcel order if destination state is undefined', (done) => {
		server
			.post('/api/v1/parcels')
			.send({ ...parcels[10], token })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('State to deliver parcel is required!');
				done();
			});
	});

	it('It should not create a parcel order if receiver name is undefined', (done) => {
		server
			.post('/api/v1/parcels')
			.send({ ...parcels[11], token })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Receiver name is required!');
				done();
			});
	});

	it('It should not create a parcel order if receiver phone is undefined', (done) => {
		server
			.post('/api/v1/parcels')
			.send({ ...parcels[12], token })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Receiver\'s phone number is required!');
				done();
			});
	});

	it('It should not create a parcel order if destination state is undefined', (done) => {
		server
			.post('/api/v1/parcels')
			.send({ ...parcels[10], token })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('State to deliver parcel is required!');
				done();
			});
	});

	it('It should not create a parcel order if delivery method is empty', (done) => {
		parcels[0].weight = 45;
		parcels[0].deliveryMethod = '';
		server
			.post('/api/v1/parcels')
			.send({ ...parcels[0], token })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Delivery method cannot be empty!');
				done();
			});
	});

	it('It should not create a parcel order if pickup address is empty', (done) => {
		parcels[0].deliveryMethod = 'Fast';
		parcels[0].pickupAddress = '';
		server
			.post('/api/v1/parcels')
			.send({ ...parcels[0], token })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Pickup address cannot be empty!');
				done();
			});
	});

	it('It should not create a parcel order if pickup city is empty', (done) => {
		parcels[0].pickupAddress = '23, Bola Ige Street';
		parcels[0].pickupCity = '';
		server
			.post('/api/v1/parcels')
			.send({ ...parcels[0], token })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Pickup city cannot be empty!');
				done();
			});
	});

	it('It should not create a parcel order if pickup state is empty', (done) => {
		parcels[0].pickupCity = '23, Bola Ige Street';
		parcels[0].pickupState = '';
		server
			.post('/api/v1/parcels')
			.send({ ...parcels[0], token })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Pickup state cannot be empty!');
				done();
			});
	});

	it('It should not create a parcel order if pickup date is empty', (done) => {
		parcels[0].pickupState = 'Oyo';
		parcels[0].pickupDate = '';
		server
			.post('/api/v1/parcels')
			.send({ ...parcels[0], token })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Pickup date cannot be empty!');
				done();
			});
	});

	it('It should not create a parcel order if pickup time is empty', (done) => {
		parcels[0].pickupDate = '2018-12-02';
		parcels[0].pickupTime = '';
		server
			.post('/api/v1/parcels')
			.send({ ...parcels[0], token })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Pickup time cannot be empty!');
				done();
			});
	});

	it('It should not create a parcel order if destination city is empty', (done) => {
		parcels[0].pickupTime = '12:30 PM';
		parcels[0].destinationAddress = '';
		server
			.post('/api/v1/parcels')
			.send({ ...parcels[0], token })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Address to deliver parcel cannot be empty!');
				done();
			});
	});

	it('It should not create a parcel order if destination city is empty', (done) => {
		parcels[0].destinationAddress = '43, Awolowo close';
		parcels[0].destinationCity = '';
		server
			.post('/api/v1/parcels')
			.send({ ...parcels[0], token })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('City to deliver parcel cannot be empty!');
				done();
			});
	});

	it('It should not create a parcel order if destination state is empty', (done) => {
		parcels[0].destinationCity = 'Oron';
		parcels[0].destinationState = '';
		server
			.post('/api/v1/parcels')
			.send({ ...parcels[0], token })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('State to deliver parcel cannot be empty!');
				done();
			});
	});

	it('It should not create a parcel order if name of receiver is empty', (done) => {
		parcels[0].destinationState = 'Rivers';
		parcels[0].receiverName = '';
		server
			.post('/api/v1/parcels')
			.send({ ...parcels[0], token })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Receiver name cannot be empty!');
				done();
			});
	});

	it('It should not create a parcel order if phone number of receiver is empty', (done) => {
		parcels[0].receiverName = 'Juliet Ogbonna';
		parcels[0].receiverPhone = '';
		server
			.post('/api/v1/parcels')
			.send({ ...parcels[0], token })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Receiver\'s phone number cannot be empty!');
				done();
			});
	});

	it('It should not create a parcel order if weight is invalid', (done) => {
		parcels[0].receiverPhone = '080345610095';
		parcels[0].weight = 'foo';
		server
			.post('/api/v1/parcels')
			.send({ ...parcels[0], token })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Invalid entry for parcel weight');
				done();
			});
	});

	it('It should not create a parcel order if delivery method is invalid', (done) => {
		parcels[0].weight = 2.3;
		parcels[0].deliveryMethod = 'High';
		server
			.post('/api/v1/parcels')
			.send({ ...parcels[0], token })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message)
					.to.equal('Invalid entry for delivery method. Must be Fast or Normal');
				done();
			});
	});

	it('It should not create a parcel order if phone number is invalid', (done) => {
		parcels[0].deliveryMethod = 'Normal';
		parcels[0].receiverPhone = '0805678tyyuy7';
		server
			.post('/api/v1/parcels')
			.send({ ...parcels[0], token })
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(400);
				expect(response.status).to.equal('Fail');
				expect(response.message)
					.to.equal('Invalid entry for receiver\'s phone number');
				done();
			});
	});
});