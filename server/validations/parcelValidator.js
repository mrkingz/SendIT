import Joi from 'joi';
import Validator from './validator';
import UserValidator from './userValidator';
import ParcelService from '../services/ParcelService';

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
			description: Joi.string().max(255).allow(''),
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
			pickUpAddress: Joi.string().required().max(150).label('Pickup address'),
			pickUpLGAId: Joi.string().required().max(100).label('Pickup LGA id'),
			pickUpStateId: Joi.string().required().max(100).label('Pickup state Id'),
			pickUpDate: Joi.string().required().label('Pickup date')
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
			destinationLGAId: Joi.string().required().max(100).label('Destination L.G.A. Id'),
			destinationStateId: Joi.string().required().max(100).label('Destination state Id'),
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
	 * @param {string} option
	 * @returns {function} Returns an express middleware function that handles the validation
	 * @method validateAdminUpdate
	 * @memberof ParcelValidator
	 */
	static validateAdminUpdate(option) {
		return (req, res, next) => {
			const { decoded, deliveryStatus } = req.body;
			delete req.body.decoded;
			const schema = {
				status: {
					deliveryStatus: Joi.string().insensitive().required()
						.valid('Transiting', 'Delivered').max(100).label('Delivery status')
				},
				location: {
					locationStateId: Joi.number().integer().greater(0).positive().required()
						.label('Location state Id'),
					locationLGAId: Joi.number().integer().greater(0).positive().required()
						.label('Location L.G.A. Id')
				}
			};
			return this.validate(req, res, next, schema[option], () => {
				return { decoded, deliveryStatus: this.ucFirstStr(deliveryStatus) };
			});
		};
	}

		/**
	 * Check if a place exist
	 *
	 * @static
	 * @param {string} text
	 * @returns {function} An express middleware function that handles the GET Req 
	 * @memberof ParcelValidator
	 */
	static findPlace(text) {
		return (req, res, next) => {
			const { decoded, ...data } = req.body;
			ParcelService.findPlace({ ...data, text })
				.then((result) => {
					return result.statusCode === 404
						? this.response(res, result)
						: next();
				})
				.catch(error => this.serverError(res, error));
		};
	}
}