import _ from 'lodash';
import Joi from 'joi';
import UtilityService from "../helpers/UtilityService";

/**
 *
 *
 * @export
 * @class Validation
 * @extends {UtilityService}
 */
export default class Validation extends UtilityService {
	/**
	 * Validate an incoming request
	 *
	 * @static
	 * @param {object} req the request object
	 * @param {object} res the response object
	 * @param {function} next callback
	 * @param {object} schema the validation schema
	 * @param {function} callback a callback (optional)
	 * @returns {object} response
	 * @memberof Validation
	 */
	static validate(req, res, next, schema, callback = undefined) {
		return Joi.validate(this.trimAttr(req.body), schema, (err, obj) => {
			if (err) {
				return this.errorResponse(
					res, 422, this.ucFirstStr(err.details[0].message.replace(/['"]/g, ''))
				);
			}
			if (_.isFunction(callback)) {
				callback();
			}
			req.body = obj;
			return next();
		});
	}
}