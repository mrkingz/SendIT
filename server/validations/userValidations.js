import _ from 'lodash';
import Joi from 'joi';
import db from '../database';
import UtilityService from '../helpers/UtilityService';

/**
 * @export
 * @class UserValidations
 * @extends {UtilityService}
 */
export default class UserValidations extends UtilityService {
  /**
   * Validates user's sign up details
   * 
   * @static
   * @method validateUser
   * @returns {function} Returns an express middleware function that handles the validation
   * @memberof UserValidations
   */
  static validateUser() {
    return (req, res, next) => {
      return Joi.validate(this.trimAttr(req.body), this.getUserSchema(), (err, data) => {
        if (err) {
          return this.errorResponse(
            res, 422, this.ucFirstStr(err.details[0].message.replace(/['"]/g, ''))
          );
        }
        req.body = data;
        return next();
      });
    };
  }

	/**
	 * Create user validation schema
	 *
	 * @static
	 * @method getUserSchema
	 * @returns {object} the user validation schema
	 * @memberof userValidations
	 */
	static getUserSchema() {
    const exp = /^[\w'\-,.][^0-9_¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/;
    const name = Joi.string().required().regex(exp).error((errors) => {
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
      email: Joi.string().required().email().label('E-mail address').lowercase(),
      password: Joi.string().required().min(8)
    });
	}


  /**
   * Validates if a user sign up credential has been used
   * 
   * @param {string} string - the property name 
   * @param {string} message - the message to retun (optional)
   * @static
   * @method isUnique
   * @returns {function} Returns an express middleswar function that does the validation
   * @memberof UserValidations
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
