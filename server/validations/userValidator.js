import _ from 'lodash';
import Joi from 'joi';
import db from '../database';
import Validator from './validator';

/**
 * @export
 * @class UserValidator
 * @extends {UtilityService}
 */
export default class UserValidator extends Validator {
  /**
   * Validates user's sign up details
   * 
   * @static
   * @method validateUser
   * @returns {function} Returns an express middleware function that handles the validation
   * @memberof UserValidator
   */
  static validateUser() {
    return (req, res, next) => {
      return this.validate(req, res, next, this.getUserSchema());
    };
  }

	/**
	 * Create user validation schema
	 *
	 * @static
	 * @method getUserSchema
	 * @returns {object} the user validation schema
	 * @memberof UserValidator
	 */
	static getUserSchema() {
    const exp = /^[\w'\-,.][^0-9_¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/;
    const name = Joi.string().required().max(100).regex(exp).error((errors) => {
      const err = errors[0];
      switch (err.type) {
        case 'any.invalid': return `${err.path} is inavlid`;
        default: return err;
      }
    });

    return Joi.object().keys({
      firstname: name,
      lastname: name,
      isAdmin: Joi.optional().default(false),
      email: Joi.string().required().email().max(100).label('E-mail address').lowercase(),
      password: Joi.string().required().min(8).max(60)
    });
	}

  /**
   * Validate user authentication credentials
   *
   * @static
   * @returns {function} An express middleware function that handles the validation
   * @method validateSignin
   * @memberof UserValidator
   */
  static validateSignin() {
    return (req, res, next) => {
      const message = (errors) => {
        const error = errors[0];
        return (error.type === 'any.required') 
          ? 'E-mail address and password are required' 
          : error;
      };
      const schema = Joi.object().keys({
        email: Joi.string().lowercase().required().error(message),
        password: Joi.string().required().error(message)
      });
      return this.validate(req, res, next, schema);
    };
  }

  /**
   * Validates if a user sign up credential has been used
   * 
   * @param {string} string - the property name 
   * @param {string} message - the message to retun (optional)
   * @static
   * @method isUnique
   * @returns {function} Returns an express middleswar function that does the validation
   * @memberof UserValidator
   */
  static isUnique(string, message) {
    return (req, res, next) => {
      const str = string.toLowerCase();
      const query = {
        name: 'is-unique',
        text: `SELECT ${str} FROM users WHERE ${str} = $1 LIMIT 1`,
        values: [req.body[str]]
      };

      db.sqlQuery(query)
      .then((result) => {  
        return (_.isEmpty(result.rows))
          ? next()
          : this.errorResponse(res, 409, (message || `${string} has been used`));
      })
      .catch(() => {
          return this.errorResponse(res, 500, db.dbError());
      });
    };
  }
}
