import Joi from 'joi';
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
   * Validate email address
   *
   * @static
   * @returns {function} Returns an express middleware function that handles the validation
   * @method validateEmail
   * @memberof UserValidator
   */
  static validateEmail() {
    return (req, res, next) => {
      return this.validate(req, res, next, Joi.object().keys(this.getEmailSchema()));
    };
  }

  /**
   * Validates user details update
   * 
   * @static
   * @param {string} option a string representing the validation type
   * @returns {function} Returns an express middleware function that handles the validation
   * @memberof UserValidator
   * @method validateUserUpdate
   */
  static validateUserUpdate(option) {
    return (req, res, next) => {
			const { decoded } = req.body;
      delete req.body.decoded;
      let schemas = {
        name: this.getNameSchema(),
        phoneNumber: this.getPhoneSchema(),
        password: this.getPasswordSchema(option),
        reset: this.getPasswordSchema(option),
      };
      return this.validate(req, res, next, Joi.object().keys(schemas[option]), () => {
        return { decoded };
      });
    };
  }

	/**
	 * Create user validation schema
	 *
	 * @static
	 * @returns {object} the user validation schema
   * @method getUserSchema
	 * @memberof UserValidator
	 */
	static getUserSchema() {
    return Joi.object()
    .keys(this.getNameSchema())
    .keys(this.getPhoneSchema({ isRequired: false }))
    .keys(this.getPasswordSchema())
    .keys(this.getEmailSchema());
  }

  /**
   * Create email validation schema
   *
   * @static
   * @returns {object} the email validation schema
   * @method getEmailSchema
   * @memberof UserValidator
   */
  static getEmailSchema() {
    return {
      email: Joi.string().required().email().max(100).label('E-mail address').lowercase()
    };
  }

  /**
   * Create phone number validation schema
   *
   * @static
   * @param {obj} obj 
   * @returns {object} the phone number validation schema
   * @method getPhoneSchema
   * @memberof UserValidator
   */
  static getPhoneSchema(obj = {}) {
    const { str, key, isRequired } = obj;
    const phoneExp = /(^([\+]{1}[1-9]{1,3}|[0]{1})[7-9]{1}[0-1]{1}[0-9]{8})$/;
    const label = `${str ? str.concat(' ') : ''}phone number`;
    return {
      [key || 'phoneNumber']: isRequired 
        ? Joi.string().required().max(50).regex(phoneExp).label(label).error((errors) => {
            const err = errors[0];
            switch (err.type) {
              case 'string.regex.base': return `${label} is inavlid`;
              default: return err;
            }
          })
        : Joi.string().allow()
    };
  }

  /**
   * Create password validation schema
   *
   * @static
   * @param {string} option
   * @returns {object} the password validation schema
   * @method getPasswordSchema
   * @memberof UserValidator
   */
  static getPasswordSchema(option) {
    const obj = { password: Joi.string().required().min(8).max(60) };
    // Remember users are not authenticated when recovering forgotten password
    // So, we will indentify this user with email address;
    // as such, we need to make sure we validate email address
    if (option === 'reset') {
      obj.email = this.getEmailSchema().email;
    }
    return obj;
  }
  
  /**
   * Get name validation schema
   *
   * @static
   * @returns {object} the names validation schema keys
   * @method getNameSchema
   * @memberof UserValidator
   */
  static getNameSchema() {
    const exp = /^[\w'\-,.][^0-9_¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/;
    const name = Joi.string().required().max(100).regex(exp).lowercase().error((errors) => {
      const err = errors[0];
      switch (err.type) {
        case 'string.regex.base': return `${err.path} is inavlid`;
        default: return err;
      }
    });
    return { firstname: name, lastname: name };
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
}
