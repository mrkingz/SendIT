import _ from 'lodash';

/**
 * @export
 * @class UtilityService
 * @extends {ValidationService}
 */
export default class UtilityService {
	/**
	 * Capitalizes the first character of an object's string porperty 
   * 
	 * @static
	 * @method ucFirstObj
	 * @memberof UtilityService
	 * @param {(Object|String)} attributes The object whose string properties
	 * is or the string to be converted
	 * @param {Boolean} options
	 * Note: options.bool: if true, first character of every string will be
	 * 		 	 capitalize; if false (default), only the first character of the sentence 
	 * 		   will be capitalize
	 *       options.skip: array of strings to skip
	 * @returns {(Object|String)} An object with converted string attributes or a 
	 * converted string
	 */
  static ucFirstObj(attributes, options) {
    let attr = null;
    const bool = (options && !_.isUndefined(options.bool)) ? options.bool : false;
    const skip = (options && !_.isUndefined(options.skip)) ? options.skip : [];
    if (_.isObject(attributes)) {
      attr = {};
      for (let key in attributes) {
        if (!_.isUndefined(key)) {
          if (_.isString(attributes[key])) {
            if (bool) {
              const array = attributes[key].split(' ');
              attr[key] = array.map((str) => {
                str = str.toString().trim();
                return (skip.includes(str)) ? str : str.charAt(0).toUpperCase() + str.substr(1);
              }).join(' ');
            } else {
              const str = attributes[key].toString().trim();
              attr[key] = (skip.includes(str)) ? str : str.charAt(0).toUpperCase() + str.substr(1);
            }
          } else attr[key] = attributes[key];
        }
      }
    } else attr = attributes;
    return attr;
  }

	/**
	 * Capitalizes the first character of a string
   * 
	 * @static
	 * @method ucFirstStr
	 * @memberof UtilityService
	 * @param {(Object|String)} string The object whose string properties
	 * is or the string to be converted
	 * @param {Boolean} options
	 * Note: options.bool: if true, first character of every string will be
	 * 		 	 capitalize; if false (default), only the first character of the sentence 
	 * 		   will be capitalize
	 *       options.skip: array of strings to skip
	 * @returns {(Object|String)} An object with converted string attributes or a 
	 * converted string
	 */
  static ucFirstStr(string, options) {
    const bool = (options && !_.isUndefined(options.bool)) ? options.bool : false;
    const skip = (options && !_.isUndefined(options.skip)) ? options.skip : [];
  
    let str;
    if (bool) {
      const array = string.split(' ');
      str = array.map((s) => {
        s = s.toString().trim();
        return (skip.includes(s)) ? s : this.cleanString(
                  s.charAt(0).toUpperCase() + s.substr(1)
                );
      }).join(' ');
    } else {
      str = string.toString().trim();
      str = (skip.includes(str)) ? str : str.charAt(0).toUpperCase() + str.substr(1);
    }
    return str;
  }


	/**
	 * Removes any leading/trialing white space character from object's attributes
	 * @static
	 * @method trimAttr
	 * @memberof UtilityService
	 * @param {Object} attributes The object with the attributes to trim
	 * @returns {Object} An object with trimed attributes
	 */
  static trimAttr(attributes) {
    const trimed = {};
    for (let key in attributes) {
      if (attributes[key]) { 
        trimed[key] = attributes[key].toString().trim(); 
      } else {
        trimed[key] = attributes[key];
      }
    }
    return trimed;
  }

	/**
	 * Removes all white space character, if any
	 * @static
	 * @method cleanString
	 * @memberof UtilityService
	 * @param {Strng} string The string to remove white space(s)
	 * @param {Boolean} removeAll:  if false, multiple white space will reduced to single;
	 * otherwise all white space(s) will be removed
	 * @returns {Object} An object with trimed attributes
	 */
  static cleanString(string, removeAll) {
    let all = (!_.isUndefined(removeAll)) ? removeAll : true;
    return (all) ? string.trim().replace(/[ ]+/g, '') : string.trim().replace(/[ ]+/g, ' ');
  }

  /**
   * Return an error message from the server
   * @static
   * @param {any} response - the reponse object
   * @param {any} code - the error code
   * @param {any} message - the error message
   * @return {object} Returns the error response
   * @memberof UtilityService
   */
  static errorResponse(response, code, message) {
    return response.status(code).json({
      status: 'Fail',
      message
    });
  }

  /**
   * 
   * 
   * Return an error message from the server
   * @static
   * @param {object} response - the reponse object
   * @param {number} code - the error code
   * @param {string} message - the error message
   * @param {object} data - the json object to return
   * @return {object} Returns the error response
   * @memberof UtilityService
   */
  static successResponse(response, code, message, data) {
    return response.status(code).json({
      status: 'Success',
      message,
      data
    });
  }
}