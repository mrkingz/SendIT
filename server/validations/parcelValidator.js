import Joi from 'joi';
import Validator from './validator';
import UserValidator from './userValidator';

/**
 * @export
 * @class ParcelValidator
 * @extends {UtilityService}
 */
export default class ParcelValidator extends Validator {
	/**
	 * Validate parcel delivery order details
	 * 
	 * @static
	 * @param {string} option
	 * @returns {function} Returns an express middleware function that handles the validation
	 * @method validateParcelDetails
	 * @memberof ParcelValidator
	 */
	static validateParcelUpdate(option) {
		return (req, res, next) => {
			const { decoded } = req.body;
			delete req.body.decoded;
			const schemas = {
				parcel: this.getParcelDetailsSchema(),
				pickup: this.getPickupDetailsSchema(),
				destination: this.getDestinationDetailsSchema(),
				receiver: this.getReceiverDetailsSchema()
			};
			return this.validate(req, res, next, Joi.object().keys(schemas[option]), () => {
				return { decoded };
			});
		};
	}

	/**
	 * Validate parcel delivery order details
	 * 
	 * @static
	 * @method validateParcel
	 * @returns {function} Returns an express middleware function that handles the validation
	 * @memberof ParcelValidator
	 */
	static validateCreateParcel() {
		return (req, res, next) => {
			const { decoded } = req.body;
			delete req.body.decoded;
			return this.validate(req, res, next, this.getParcelSchema(), () => {
				return {
					price: Number(req.body.weight) * 1000,
					trackingNo: new Date().getTime(),
					decoded
				};
			});
		};
	}

	/**
	 * Create parcel validation schema
	 *
	 * @static
	 * @returns {object} the parcel validation schema
	 * @method getParcelSchema
	 * @memberof ParcelValidator
	 */
	static getParcelSchema() {
		return Joi.object()
			.keys(this.getParcelDetailsSchema())
			.keys(this.getPickupDetailsSchema())
			.keys(this.getDestinationDetailsSchema())
			.keys(this.getReceiverDetailsSchema());
	}

	/**
	 *	Create parcel details validation schema keys
	 *
	 * @static
	 * @returns {object} the parcel details validation schema keys
	 * @method getParcelDetailsSchema
	 * @memberof ParcelValidator
	 */
	static getParcelDetailsSchema() {
		return {
			weight: Joi.alternatives().try([
				Joi.number().integer().greater(0).positive(),
				Joi.number().precision(2).greater(0).positive()
			]).required(),
			description: Joi.string().max(255).default('N/A'),
			deliveryMethod: Joi.string().valid('Fast', 'Normal').required()
				.max(20).label('Delivery method'),
		};
	}

	/**
	 *	Create parcel destination details validation schema keys
	 *
	 * @static
	 * @returns {object} the parcel destination details validation schema keys
	 * @method getPickupDetailsSchema
	 * @memberof ParcelValidator
	 */
	static getPickupDetailsSchema() {
		return {
			pickupAddress: Joi.string().required().max(150).label('Pickup address'),
			pickupCity: Joi.string().required().max(100).label('Pickup city'),
			pickupState: Joi.string().required().max(100).label('Pickup state'),
			pickupDate: Joi.string().required().label('Pickup date')
		};
	}

	/**
	 *	Create parcel destination details validation schema keys
	 *
	 * @static
	 * @returns {object} the parcel destination details validation schema keys
	 * @method getDestinationDetailsSchema
	 * @memberof ParcelValidator
	 */
	static getDestinationDetailsSchema() {
		return {
			destinationAddress: Joi.string().required().max(150).label('Destination address'),
			destinationCity: Joi.string().required().max(100).label('Destination city'),
			destinationState: Joi.string().required().max(100).label('Destination state'),
		};
	}

	/**
	 *	Create parcel receiver details validation schema keys
	 *
	 * @static
	 * @returns {object} the parcel receiver details validation schema keys
	 * @method getReceiverDetailsSchema
	 * @memberof ParcelValidator
	 */
	static getReceiverDetailsSchema() {
		return {
			receiverName: Joi.string().required().max(200).label(`Receiver name`),
			receiverPhone: UserValidator.getPhoneSchema({ 
				key: 'receiverPhone', str: 'Receiver' 
			}).receiverPhone
		};
	}

	/**
	 * Validate present location
	 * 
	 * @static
	 * @param {update} updateType the type of update operation
	 * @method validateLocation
	 * @returns {function} Returns an express middleware function that handles the validation
	 * @memberof ParcelValidator
	 */
	static validateAdminUpdate(updateType) {
		return (req, res, next) => {
			const { decoded, deliveryStatus, presentLocation } = req.body;
			delete req.body.decoded;
			if (deliveryStatus) {
				req.body.deliveryStatus = this.ucFirstStr(deliveryStatus.toLowerCase());
			} else if (presentLocation) {
				req.body.presentLocation = this.ucFirstStr(presentLocation.toLowerCase(), true);
			}
			const schema = {
				location: Joi.object().keys({
					deliveryStatus: Joi.string().required().valid('Transiting', 'Delivered')
						.max(100).label('Delivery status'),
					presentLocation: Joi.string().required().max(100).label('Present location')
				}),
				status: Joi.object().keys({
					deliveryStatus: Joi.string().required().valid('Transiting', 'Delivered')
						.max(100).label('Delivery status')
				})
			};
			return this.validate(req, res, next, schema[updateType], () => {
				return { decoded };
			});
		};
	}
}