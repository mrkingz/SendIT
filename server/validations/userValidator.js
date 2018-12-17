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
   * @method validateUser
   * @memberof UserValidator
   */
  static validateUser() {
    return (req, res, next) => {
      return this.validate(req, res, next, this.getUserSchema());
    };
  }

    /**
   * Validates names
   * 
   * @static
   * @method validateName
   * @returns {function} Returns an express middleware function that handles the validation
   * @memberof UserValidator
   * @method validateName
   */
  static validateName() {
    return (req, res, next) => {
			const { decoded } = req.body;
			delete req.body.decoded;
      const schema = Joi.object().keys(this.getNamevalidationKeys());
      return this.validate(req, res, next, schema, () => {
        return { decoded };
      });
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
    return Joi.object()
    .keys(this.getNamevalidationKeys())
    .keys({
      email: Joi.string().required().email().max(100).label('E-mail address').lowercase(),
      password: Joi.string().required().min(8).max(60)
    });
  }
  
  /**
   * Get name validation schema
   *
   * @static
   * @returns {object} the names validation schema keys
   * @method getNamevalidationKeys
   * @memberof UserValidator
   */
  static getNamevalidationKeys() {
    const exp = /^[\w'\-,.][^0-9_¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/;
    const name = Joi.string().required().max(100).regex(exp).lowercase().error((errors) => {
      const err = errors[0];
      switch (err.type) {
        case 'string.regex.base': return `${err.path} is inavlid`;
        default: return err;
      }
    });
    return {
      firstname: name,
      lastname: name
    };
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
          : this.errorResponse({ res, code: 409, message: (message || `${string} has been used`) });
      })
      .catch(() => this.errorResponse({ res, message: db.dbError() }));
    };
  }
}
