import chai from 'chai';
import UtilityService from '../helpers/UtilityService';

const expect = chai.expect;

describe('Test class UtilityService', () => {
	describe('Test method cleanString of UtilityService', () => {
		it('It should remove trailing/leading white space', () => {
			expect(UtilityService.cleanString(' Fan')).to.equal('Fan');
		});
		it('It should collapse multiple white space to a single white space', () => {
			expect(UtilityService.cleanString('Binatone    Fan', false))
			.to.equal('Binatone Fan');
		});
	});

	describe('Test method trimAttr of UtilityService', () => {
		const user = UtilityService.trimAttr({
			firstdescription: ' John',
			lastdescription: ' Okon ', 
			email: 'something@gmail.com'
		});

		it('It should remove trailing  and leading white spaces from the object string property', () => {
			expect(user).to.be.an('object');
			expect(user).to.have.own.property('firstdescription').to.be.a('string')
			.that.is.equal('John');
			expect(user).to.have.own.property('lastdescription').to.be.a('string')
			.that.is.equal('Okon');
			expect(user).to.have.own.property('email').to.be.a('string')
			.that.is.equal('something@gmail.com');
		});
	});

	describe('Test method ucFirst of UtilityService', () => {
		const parcel = UtilityService.ucFirstObj({ description: 'office chair' });
		it('It should capitalize the first character of the value of description', () => {
			expect(parcel).to.be.an('object');
			expect(parcel).to.have.own.property('description').to.be.a('string')
			.that.is.equal('Office chair');
		});
	});

	describe('Test method ucFirst of UtilityService', () => {
		const parcel = UtilityService.ucFirstObj({
			description: 'office chair' 
		}, { bool: true });
		it('It should capitalize the first character of every word', () => {
			expect(parcel).to.be.an('object');
			expect(parcel).to.have.own.property('description').to.be.a('string')
			.that.is.equal('Office Chair');
		});
	});

	describe('Test method ucFirst of UtilityService', () => {
		let description = 'office chair';
		description = UtilityService.ucFirstStr(description);
		it('It should capitalize the first character in the string argument', () => {
			expect(description).to.be.a('string');
			expect(description).to.be.equal('Office chair');
		});
	});

	describe('Test method ucFirst of UtilityService', () => {
		let description = 'office chair';
		description = UtilityService.ucFirstStr(description, { bool: true });
		it('It should capitalize the first character of every word in the string argument', () => {
			expect(description).to.be.a('string');
			expect(description).to.be.equal('Office Chair');
		});
	});

	describe('Test method ucFirst of UtilityService', () => {
		const parcel = UtilityService.ucFirstObj({
			description: 'fan and blender' 
		}, 
			{ bool: true, skip: ['and'] });
		it(`It should capitalize the first character of every word
			  in the value of title excluding the string in the array`, () => {
			expect(parcel).to.be.an('object');
			expect(parcel).to.have.own.property('description').to.be.a('string')
			.that.is.equal('Fan and Blender');
		});
	});
});