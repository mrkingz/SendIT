import _ from 'lodash';
import Validator from 'validator';
import UtilityService from '../services/utilityService';

/**
 * @export
 * @class OrderValidations
 * @extends {UtilityService}
 */
export default class OrderValidations extends UtilityService {
  /**
   * Validate for required parcel delivery order details
   * @static
   * @returns {function} Returns an express middleware function that handles the validation
   * @memberof OrderValidations
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

			if (_.isEmpty(message)) {
				return next();
			}

			return this.errorResponse(res, 400, `${message} is required!`);
		};
	}

	/**
	 * Validate for none empty parcel delivery order details
	 *
	 * @static
	 * @returns {function} Returns an express middleware function that handles the validation
	 * @memberof OrderValidations
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
			if (_.isUndefined(weight)) {
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

			if (_.isEmpty(message)) {
				return next();
			}

			return this.errorResponse(res, 400, `${message} cannot be empty!`);
		};
	}

	/**
	 *Validate parcel delivery order details
	 *
	 * @static
	 * @returns {function} Returns an express middleware function that handles the validation
	 * @memberof OrderValidations
	 */
	static isValid() {
		return (req, res, next) => {
			let message;
			const {
				weight, deliveryMethod, pickupAddress, pickupCity, pickupState, pickupDate, pickupTime,
				destinationAddress, destinationCity, destinationState, receiverName, receiverPhone
			} = this.trimAttr(req.body);		
			
			if (!_.isUndefined(weight) && !Validator.isNumeric(weight)) {
				message = 'Invalid entry for parcel weight';
			} else if (!_.isUndefined(deliveryMethod) && (deliveryMethod != 'Fast' || deliveryMethod != 'Normal')) {
				message = 'Invalid entry for delivery method. Must be Fast or Normal';
			} else if (!_.isUndefined(pickupDate) && !_.isDate(pickupDate)) {
				message = 'Invalid entry for pickup date';
			} else if (!_.isUndefined(pickupTime) && !_.isDate(pickupTime)) {
				message = 'Invalid entry for pickup time';
			}	else if (!_.isUndefined(receiverName) && !_.isString(receiverName)) {
				message = 'Invalid entry for receiver\'s name';
			} else if (!_.isUndefined(receiverPhone) && !Validator.isMobilePhone(receiverPhone)) {
				message = 'Invalid entry for receiver\'s phone number';
			}
		};
	}
}