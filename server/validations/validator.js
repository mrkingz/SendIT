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
	 * @param {dataect} req the request dataect
	 * @param {dataect} res the response dataect
	 * @param {function} next callback
	 * @param {dataect} schema the validation schema
	 * @param {function} callback a callback (optional)
	 * @returns {dataect} response
	 * @memberof Validation
	 */
	static validate(req, res, next, schema, callback = undefined) {
		return Joi.validate(this.trimAttr(req.body), schema, (err, data) => {
			if (err) {
				return this.errorResponse(
					res, 422, this.ucFirstStr(err.details[0].message.replace(/['"]/g, ''))
				);
			}
			req.body = _.isFunction(callback) ? _.merge(data, callback()) : data;
			return next();
		});
	}
}