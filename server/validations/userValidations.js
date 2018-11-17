import _ from 'lodash';
import Joi from 'joi';
import Validator from 'validator';
import collections from '../dummyData';
import UtilityService from '../helpers/UtilityService';

/**
 * @export
 * @class UserValidations
 * @extends {UtilityService}
 */
export default class UserValidations extends UtilityService {
  /**
   * Validates user's sign up details
   * @static
   * @returns {function} Returns an express middleware function that handles the validation
   * @memberof UserValidations
   */
  static validateUser() {
    return (req, res, next) => {
      const exp = /^[\w'\-,.][^0-9_¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/;
      const name = Joi.string().required().trim().regex(exp).error((errors) => {
        const err = errors[0];
        switch (err.type) {
          case 'any.invalid': return `${err.path} is inavlid`;
          default: return err;
        }
      });
      const schema = Joi.object().keys({
        firstname: name,
        lastname: name,
        isAdmin: Joi.optional().default(false),
        email: Joi.string().trim().required().email().label('E-mail address').lowercase().strict(),
        password: Joi.string().trim().required().min(8).error((error) => {
          return error[0];
        })
      });

      return Joi.validate(req.body, schema, (err, data) => {
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
   * Validates if a user sign up credential has been used
   * 
   * @param {string} string - the property name 
   * @param {string} message - the message to retun (optional)
   * @static
   * @returns {function} Returns an express middleswar function that does the validation
   * @memberof UserValidations
   */
  static isUnique(string, message) {
    return (req, res, next) => {
      let isUnique = true;
      let length = collections.getUsersCount();

      for (let i = 0; i < length; i++) {
        if (collections.getUsers()[i][string.toLowerCase()] === req.body[string.toLowerCase()]) {
          isUnique = false;
          break;
        }
      }

      return (isUnique)
        ? next()
        : this.errorResponse(res, 409, (message || `${string} has been used`));
    };
  }
}
