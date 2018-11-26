import chai from 'chai';
import supertest from 'supertest';
import app from '../../server/app';

const expect = chai.expect;
const server = supertest.agent(app);

const user = {
	firstname: 'James',
	lastname: 'Ogugayo',
	email: 'example@gmail.com',
	password: 'Password1'
};
describe('Test authentication routes', () => {
	it('It should return connection ok if server start successfully', (done) => {
		server
			.post('/api')
			.send(user)
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(200);
				expect(response.status).to.equal('Success');
				expect(response.message).to.equal('Connection ok');
				done();
			});
	});

	it('It should return eror for invalid route', (done) => {
		server
			.post('/api/v1/sign')
			.send(user)
			.end((err, res) => {
				const response = res.body;
				expect(res.statusCode).to.equal(404);
				expect(response.status).to.equal('Fail');
				expect(response.message).to.equal('Sorry, there is nothing here!');
				done();
			});
	});
});