import _ from 'lodash';
import Validator from 'validator';
import collections from '../collections';
import UtilityService from '../services/utilityService';

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
  static validateRegistration() {
    return (req, res, next) => {
      let message;
      const { 
        email, password, firstname, lastname, gender, address, city, state, phone
      } = this.trimAttr(req.body);

      if (Validator.isEmpty(email)) {
        message = 'Email address cannot be empty!';
      } else if (!Validator.isEmail(email)) {
        message = 'Please, enter a valid email address!';
      } else if (Validator.isEmpty(password)) {
        message = 'Password cannot be empty!';
      } else if (password.length < 8) {
        message = 'Password must be at least 8 characters long!';
      } else if (Validator.isEmpty(firstname)) {
        message = 'Firstname cannot be empty!';
      } else if (Validator.isEmpty(lastname)) {
        message = 'lastname cannot be empty!';
      } else if (Validator.isEmpty(gender)) {
        message = 'Gender cannot be empty!';
      } else if (Validator.isEmpty(address)) {
        message = 'Address cannot be empty!';
      } else if (Validator.isEmpty(city)) {
        message = 'City cannot be empty!';
      } else if (Validator.isEmpty(state)) {
        message = 'State cannot be empty!';
      } else if (Validator.isEmpty(phone)) {
        message = 'Phone number cannot be empty!';
      }

      if (_.isEmpty(message)) {
        req.body = { 
          email, password, firstname, lastname, gender, address, city, state, phone
        };
        return next();
      }

      return this.errorResponse(res, 400, message);
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

      if (isUnique) {
        return next();
      }
      return this.errorResponse(res, 409, (message || `${string} has been used`));
    };
  }

  /**
   * Validates required fields
   * 
   * @static
   * @returns {function} Returns an express middleware function that handles the validation for required fields
   * @memberof UserValidations
   */
  static isRequired() {
    return (req, res, next) => {
      let attr;
      const { 
        email, password, firstname, lastname, gender, address, city, state, phone 
      } = req.body;
      if (_.isUndefined(email)) {
        attr = 'Email address';
      } else if ( _.isUndefined(password)) {
        attr = 'Password';
      } else if ( _.isUndefined(firstname)) {
        attr = 'Firstname';
      } else if ( _.isUndefined(lastname)) {
        attr = 'Lastname';
      } else if ( _.isUndefined(gender)) {
        attr = 'Gender';
      } else if ( _.isUndefined(address)) {
        attr = 'Address';
      } else if ( _.isUndefined(city)) {
        attr = 'City or town';
      } else if ( _.isUndefined(state)) {
        attr = 'State';
      } else if ( _.isUndefined(phone)) {
        attr = 'Phone number';
      }

      if (_.isEmpty(attr)) {
        return next();
      }

      return this.errorResponse(res, 400, `${attr} is required!`);
    };
  }

  /**
   * Validates email
   * @static
   * @return {function} Returns an express middleware function that does the validation
   * @memberof UserValidations
   */
  static isValidEmail() {
    return (req, res, next) => {
      if (Validator.isEmail(req.body.email)) {
        return next();
      }
      return this.errorResponse(res, 400, 'Please, enter a valid email address');
    };
  }
}