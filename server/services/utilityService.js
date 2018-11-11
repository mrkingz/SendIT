import _ from 'lodash';

/**
 * @exports
 * @description
 * @class UtilityService
 */
export default class UtilityService {
	/**
	 * Converts the first character of a string to upper case
	 * If an object is passed, the method only convert its string 
	 * propeties
   * 
	 * @static
	 * @method upperCaseFirst
	 * @memberof UtilityService
	 * @param {(Object|String)} attributes The object whose string properties
	 * is or the string to be converted
	 * @param {Boolean} options
	 * Note: options.bool: if true, first character of every word will be
	 * 		 	 capitalize; if false (default), only the first character of the sentence 
	 * 		   will be capitalize
	 *       options.skip: array of words to skip
	 * @returns {(Object|String)} An object with converted string attributes or a 
	 * converted string
	 */
  static upperCaseFirst(attributes, options) {
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
                return (skip.includes(str))
                  ? str
                  : str.charAt(0).toUpperCase() + str.substr(1);
              }).join(' ');
            } else {
              const str = attributes[key].toString().trim();
              attr[key] = (skip.includes(str))
                ? str
                : str.charAt(0).toUpperCase() + str.substr(1);
            }
          } else attr[key] = attributes[key];
        }
      }
    } else if (_.isString(attributes)) {
      if (bool) {
        const array = attributes.split(' ');
        attr = array.map((str) => {
          str = str.toString().trim();
          return (skip.includes(str))
            ? str
            : this.cleanString(str.charAt(0).toUpperCase() + str.substr(1));
        }).join(' ');
      } else {
        const str = attributes.toString().trim();
        attr = (skip.includes(str))
          ? str
          : str.charAt(0).toUpperCase() + str.substr(1);
      }
    } else attr = attributes;
    return attr;
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
      data: {
        ...data
      }
    });
  }
}