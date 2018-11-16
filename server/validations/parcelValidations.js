import _ from 'lodash';
import Validator from 'validator';
import UtilityService from '../helpers/UtilityService';

/**
 * @export
 * @class ParcelValidations
 * @extends {UtilityService}
 */
export default class ParcelValidations extends UtilityService {
  /**
   * Validate for required parcel delivery order details
   * @static
   * @returns {function} Returns an express middleware function that handles the validation
   * @memberof ParcelValidations
   */
	static isRequired() {
		return (req, res, next) => {
			let message;
			const {
				weight, deliveryMethod, pickupAddress, pickupCity, pickupState, pickupDate, pickupTime,
				destinationAddress, destinationCity, destinationState, receiverName, receiverPhone
			} = this.trimAttr(req.body);

			/**
			 * Validates for undefined, empty fields and invalid entry
			 */
			if (_.isUndefined(weight)) {
				message = 'Weight';
			} else if (_.isUndefined(deliveryMethod)) {
				message = 'Delivery method';
			} else if (_.isUndefined(pickupAddress)) {
				message = 'Pickup address';
			} else if (_.isUndefined(pickupCity)) {
				message = 'Pickup city';
			} else if (_.isUndefined(pickupState)) {
				message = 'Pickup state';
			} else if (_.isUndefined(pickupDate)) {
				message = 'Pickup date';
			} else if (_.isUndefined(pickupTime)) {
				message = 'Pickup time';
			} else if (_.isUndefined(destinationAddress)) {
				message = 'Address to deliver parcel';
			} else if (_.isUndefined(destinationCity)) {
				message = 'City to deliver parcel';
			} else if (_.isUndefined(destinationState)) {
				message = 'State to deliver parcel';
			} else if (_.isUndefined(receiverName)) {
				message = 'Receiver name';
			} else if (_.isUndefined(receiverPhone)) {
				message = 'Receiver\'s phone number';
			}

			return _.isEmpty(message)
				? next()
				: this.errorResponse(res, 400, `${message} is required!`);
		};
	}

	/**
	 * Validate for none empty parcel delivery order details
	 *
	 * @static
	 * @returns {function} Returns an express middleware function that handles the validation
	 * @memberof ParcelValidations
	 */
	static isEmpty() {
		return (req, res, next) => {
			let message;
			const {
				weight, deliveryMethod, pickupAddress, pickupCity, pickupState, pickupDate, pickupTime,
				destinationAddress, destinationCity, destinationState, receiverName, receiverPhone
			} = this.trimAttr(req.body);

			/**
			 * Validates for undefined, empty fields and invalid entry
			 */
			if (!_.isUndefined(weight) && _.isEmpty(weight)) {
				message = 'Weight';
			} else if (!_.isUndefined(deliveryMethod) && _.isEmpty(deliveryMethod)) {
				message = 'Delivery method';
			} else if (!_.isUndefined(pickupAddress) && _.isEmpty(pickupAddress)) {
				message = 'Pickup address';
			} else if (!_.isUndefined(pickupCity) && _.isEmpty(pickupCity)) {
				message = 'Pickup city';
			} else if (!_.isUndefined(pickupDate) && _.isEmpty(pickupState)) {
				message = 'Pickup state';
			} else if (!_.isUndefined(pickupDate) && _.isEmpty(pickupDate)) {
				message = 'Pickup date';
			} else if (!_.isUndefined(pickupTime) && _.isEmpty(pickupTime)) {
				message = 'Pickup time';
			} else if (!_.isUndefined(destinationAddress) && _.isEmpty(destinationAddress)) {
				message = 'Address to deliver parcel';
			} else if (!_.isUndefined(destinationCity) && _.isEmpty(destinationCity)) {
				message = 'City to deliver parcel';
			} else if (!_.isUndefined(destinationState) && _.isEmpty(destinationState)) {
				message = 'State to deliver parcel';
			} else if (!_.isUndefined(receiverName) && _.isEmpty(receiverName)) {
				message = 'Receiver name';
			} else if (!_.isUndefined(receiverPhone) && _.isEmpty(receiverPhone)) {
				message = 'Receiver\'s phone number';
			}

			return _.isEmpty(message)
				? next()
				: this.errorResponse(res, 400, `${message} cannot be empty!`);
		};
	}

	/**
	 *Validate parcel delivery order details
	 *
	 * @static
	 * @returns {function} Returns an express middleware function that handles the validation
	 * @memberof ParcelValidations
	 */
	static isValid() {
		return (req, res, next) => {
			let message;
			const {
				weight, deliveryMethod, receiverPhone
			} = this.trimAttr(req.body);

			if (!_.isUndefined(weight) && !Validator.isNumeric(weight)) {
				message = 'Invalid entry for parcel weight';
			} else if (!_.isUndefined(deliveryMethod)
				&& (deliveryMethod !== 'Fast' && deliveryMethod !== 'Normal')) {
				message = 'Invalid entry for delivery method. Must be Fast or Normal';
			} else if (!_.isUndefined(receiverPhone) && !Validator.isMobilePhone(receiverPhone)) {
				message = 'Invalid entry for receiver\'s phone number';
			}

			return _.isEmpty(message) ? next() : this.errorResponse(res, 400, message);
		};
	}
}