import _ from 'lodash';
import Joi from 'joi';
import Controller from "../controllers/Controller";

/**
 *
 *
 * @export
 * @class Validator
 * @extends {Controller}
 */
export default class Validator extends Controller {
	/**
	 * Validate an incoming request
	 *
	 * @static
	 * @param {dataect} req HTTP request object
	 * @param {dataect} res HTTP response object
	 * @param {function} next HTTP callback to transfer request to the next function
	 * @param {dataect} schema validation schema
	 * @param {function} callback a callback function to run (optional)
	 * @returns {object} HTTP response
	 * @method validate
	 * @memberof Validator
	 */
	static validate(req, res, next, schema, callback) {
		return Joi.validate(this.trimAttr(req.body), schema, (err, data) => {
			if (err) {
				const message = this.ucFirstStr(err.details[0].message.replace(/['"]/g, ''));
				this.errorResponse({ res, statusCode: 400, message });
			}
			req.body = _.isFunction(callback) ? _.merge(data, callback()) : data;
			return next();
		});
	}
}