import Joi from 'joi';
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
	 * 
   * @static
	 * @method validateParcel
   * @returns {function} Returns an express middleware function that handles the validation
   * @memberof ParcelValidations
   */
  static validateParcel() {
		return (req, res, next) => {
			const { decoded, ...body } = req.body;
			return Joi.validate(this.trimAttr(body), this.getParcelSchema(), (err, data) => {
        if (err) {
						return this.errorResponse(
							res, 422, this.ucFirstStr(err.details[0].message.replace(/['"]/g, ''))
						);
				}
				req.body = data;
				req.body.decoded = decoded;
				return next();
			});
		};
	}
	
	/**
	 * Create parcel validation schema
	 *
	 * @static
	 * @method getParcelSchema
	 * @returns {object} the parcel validation schema
	 * @memberof ParcelValidations
	 */
	static getParcelSchema() {
		const phoneExp = /(^([\+]{1}[1-9]{1,3}|[0]{1})[7-9]{1}[0-1]{1}[0-9]{8})$/;
		return Joi.object().keys({
			weight: Joi.alternatives().try([
				Joi.number().integer().greater(0).positive(), 
				Joi.number().precision(2).greater(0).positive()
			]).required(),
			description: Joi.string(),
			deliveryMethod: Joi.string().valid('Fast', 'Normal').required().label('Delivery method'),
			pickupAddress: Joi.string().required().label('Pickup address'),
			pickupCity: Joi.string().required().label('Pickup city'), 
			pickupState: Joi.string().required().label('Pickup state'),  
			pickupDate: Joi.string().required().label('Pickup date'), 
			pickupTime: Joi.string().required().label('Pickup time'), 
			destinationAddress: Joi.string().required().label('Destination address'), 
			destinationCity: Joi.string().required().label('Destination city'),
			destinationState: Joi.string().required().label('Destination state'), 
			receiverName: Joi.string().required().label(`Receiver name`),
			receiverPhone: Joi.string().required().regex(phoneExp)
				.label(`Receiver phone number`).error((errors) => {
				const err = errors[0];
				switch (err.type) {
					case 'string.regex.base': return 'Receiver phone number is inavlid';
					default: return err;
				}
			}), 
		});
	}
}