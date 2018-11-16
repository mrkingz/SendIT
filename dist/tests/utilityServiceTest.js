'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _UtilityService = require('../helpers/UtilityService');

var _UtilityService2 = _interopRequireDefault(_UtilityService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var expect = _chai2.default.expect;

describe('Test class UtilityService', function () {
	describe('Test method cleanString of UtilityService', function () {
		it('It should remove trailing/leading white space', function () {
			expect(_UtilityService2.default.cleanString(' Fan')).to.equal('Fan');
		});
		it('It should collapse multiple white space to a single white space', function () {
			expect(_UtilityService2.default.cleanString('Binatone    Fan', false)).to.equal('Binatone Fan');
		});
	});

	describe('Test method trimAttr of UtilityService', function () {
		var user = _UtilityService2.default.trimAttr({
			firstdescription: ' John',
			lastdescription: ' Okon ',
			email: 'something@gmail.com'
		});

		it('It should remove trailing  and leading white spaces from the object string property', function () {
			expect(user).to.be.an('object');
			expect(user).to.have.own.property('firstdescription').to.be.a('string').that.is.equal('John');
			expect(user).to.have.own.property('lastdescription').to.be.a('string').that.is.equal('Okon');
			expect(user).to.have.own.property('email').to.be.a('string').that.is.equal('something@gmail.com');
		});
	});

	describe('Test method upperCaseFirst of UtilityService', function () {
		var parcel = _UtilityService2.default.upperCaseFirst({ description: 'office chair' });
		it('It should capitalize the first character of the value of description', function () {
			expect(parcel).to.be.an('object');
			expect(parcel).to.have.own.property('description').to.be.a('string').that.is.equal('Office chair');
		});
	});

	describe('Test method upperCaseFirst of UtilityService', function () {
		var parcel = _UtilityService2.default.upperCaseFirst({
			description: 'office chair'
		}, { bool: true });
		it('It should capitalize the first character of every word', function () {
			expect(parcel).to.be.an('object');
			expect(parcel).to.have.own.property('description').to.be.a('string').that.is.equal('Office Chair');
		});
	});

	describe('Test method upperCaseFirst of UtilityService', function () {
		var description = 'office chair';
		description = _UtilityService2.default.upperCaseFirst(description);
		it('It should capitalize the first character in the string argument', function () {
			expect(description).to.be.a('string');
			expect(description).to.be.equal('Office chair');
		});
	});

	describe('Test method upperCaseFirst of UtilityService', function () {
		var description = 'office chair';
		description = _UtilityService2.default.upperCaseFirst(description, { bool: true });
		it('It should capitalize the first character of every word in the string argument', function () {
			expect(description).to.be.a('string');
			expect(description).to.be.equal('Office Chair');
		});
	});

	describe('Test method upperCaseFirst of UtilityService', function () {
		var parcel = _UtilityService2.default.upperCaseFirst({
			description: 'fan and blender'
		}, { bool: true, skip: ['and'] });
		it('It should capitalize the first character of every word\n\t\t\t  in the value of title excluding the string in the array', function () {
			expect(parcel).to.be.an('object');
			expect(parcel).to.have.own.property('description').to.be.a('string').that.is.equal('Fan and Blender');
		});
	});
});