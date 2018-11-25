import Joi from 'joi';
import Validator from './validator';

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
	 * @method validateParcel
   * @returns {function} Returns an express middleware function that handles the validation
   * @memberof ParcelValidator
   */
  static validateParcel() {
		return (req, res, next) => {
			const { decoded } = req.body;
			delete req.body.decoded;
			return this.validate(req, res, next, this.getParcelSchema(), () => {
				return {
					price: Number(req.body.weight) * 100,
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
	 * @method getParcelSchema
	 * @returns {object} the parcel validation schema
	 * @memberof ParcelValidator
	 */
	static getParcelSchema() {
		const phoneExp = /(^([\+]{1}[1-9]{1,3}|[0]{1})[7-9]{1}[0-1]{1}[0-9]{8})$/;
		return Joi.object().keys({
			weight: Joi.alternatives().try([
				Joi.number().integer().greater(0).positive(), 
				Joi.number().precision(2).greater(0).positive()
			]).required(),
			description: Joi.string().max(255),
			deliveryMethod: Joi.string().valid('Fast', 'Normal').required()
				.max(20).label('Delivery method'),
			pickupAddress: Joi.string().required().max(150).label('Pickup address'),
			pickupCity: Joi.string().required().max(100).label('Pickup city'), 
			pickupState: Joi.string().required().max(100).label('Pickup state'),  
			pickupDate: Joi.string().required().label('Pickup date'), 
			destinationAddress: Joi.string().required().max(150).label('Destination address'), 
			destinationCity: Joi.string().required().max(100).label('Destination city'),
			destinationState: Joi.string().required().max(100).label('Destination state'), 
			receiverName: Joi.string().required().max(200).label(`Receiver name`),
			receiverPhone: Joi.string().required().max(50).regex(phoneExp)
				.label(`Receiver phone number`).error((errors) => {
				const err = errors[0];
				switch (err.type) {
					case 'string.regex.base': return 'Receiver phone number is inavlid';
					default: return err;
				}
			}), 
		});
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

  /**
   * Validate present location
	 * 
   * @static
	 * @param {update} updateType the type of update operation
	 * @method validateLocation
   * @returns {function} Returns an express middleware function that handles the validation
   * @memberof ParcelValidator
   */
	static validateDestination() {
		return (req, res, next) => {
			const { decoded } = req.body;
			delete req.body.decoded;
			const schema = Joi.object().keys({
				destinationAddress: Joi.string().required().max(150).label('Destination address'), 
				destinationCity: Joi.string().required().max(100).label('Destination city'),
				destinationState: Joi.string().required().max(100).label('Destination state'),
			});
			return this.validate(req, res, next, schema, () => {
				return { decoded };
			});
		};
	}	
}