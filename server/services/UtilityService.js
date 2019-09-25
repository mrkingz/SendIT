import _ from "lodash";

/**
 * @export
 * @class UtilityService
 * @extends {ValidationService}
 */
export default class UtilityService {
  /**
   * @description Capitalizes the first character of an object's string porperty
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
   * @returns {Object} An object with converted string attributes
   */
  static ucFirstObj(attributes, options) {
    let attr = null;
    const { bool, skip, seperator } = this.getDefaults(options);
    if (_.isObject(attributes)) {
      attr = {};
      for (let key in attributes) {
        if (!_.isUndefined(key)) {
          if (_.isString(attributes[key])) {
            if (bool) {
              const array = attributes[key].split(seperator);
              attr[key] = array
                .map(str => {
                  str = str ? str.toString().trim() : "";
                  return skip.includes(str)
                    ? str
                    : str.charAt(0).toUpperCase() + str.substr(1);
                })
                .join(" ");
            } else {
              const str = attributes[key]
                ? attributes[key].toString().trim()
                : "";
              attr[key] = skip.includes(str)
                ? str
                : str.charAt(0).toUpperCase() + str.substr(1);
            }
          } else attr[key] = attributes[key];
        }
      }
    } else attr = attributes;
    return attr;
  }

  /**
   * @description Capitalizes the first character of a string
   *
   * @static
   * @method ucFirstStr
   * @memberof UtilityService
   * @param {String} string The object whose string properties
   * is or the string to be converted
   * @param {Boolean} options
   * Note: options.bool: if true, first character of every string will be
   * 		 	 capitalize; if false (default), only the first character of the sentence
   * 		   will be capitalize
   *       options.skip: array of strings to skip
   * @returns {string} The converted string
   */
  static ucFirstStr(string, options) {
    const { bool, skip, seperator } = this.getDefaults(options);
    let str;
    if (bool && string) {
      const array = string.split(seperator);
      str = array
        .map(s => {
          s = s.toString().trim();
          return skip.includes(s)
            ? s
            : this.cleanString(s.charAt(0).toUpperCase() + s.substr(1));
        })
        .join(" ");
    } else if (string) {
      str = string ? string.toString().trim() : "";
      str = skip.includes(str)
        ? str
        : str.charAt(0).toUpperCase() + str.substr(1);
    }
    return str;
  }

  /**
   * @description Helper method to get defauls values for method ucFirstStr and ucFirstObj
   *
   * @static
   * @param {object} options
   * @returns {object} An object contaning the defaults
   * @method getDefaults
   * @memberof UtilityService
   */
  static getDefaults(options) {
    const bool = options && !_.isUndefined(options.bool) ? options.bool : false;
    const skip = options && !_.isUndefined(options.skip) ? options.skip : [];
    const seperator =
      options && !_.isUndefined(options.seperator) ? options.seperator : " ";
    return { bool, skip, seperator };
  }

  /**
   * @description Removes any leading/trialing white space character from object's attributes
   *
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
   * @description Removes all white space character, if any
   *
   * @static
   * @method cleanString
   * @memberof UtilityService
   * @param {Strng} string The string to remove white space(s)
   * @param {Boolean} removeAll:  if false, multiple white space will reduced to single;
   * otherwise all white space(s) will be removed
   * @returns {Object} An object with trimed attributes
   */
  static cleanString(string, removeAll) {
    let all = !_.isUndefined(removeAll) ? removeAll : true;
    return all
      ? string.trim().replace(/[ ]+/g, "")
      : string.trim().replace(/[ ]+/g, " ");
  }

  /**
   * @description Strip dashes from a string
   *
   * @static
   * @param {string} string
   * @param {String} seperator
   * @returns {string} a string with the dashes removed
   * @memberof UtilityService
   */
  static stripDashes(string, seperator) {
    return string.replace(/[-]+/g, seperator ? seperator : "");
  }

  /**
   * @description Convert string to camel case
   *
   * @static
   * @param {string} string
   * @param {string} delimeter
   * @param {String} seperator
   * @returns {string} the converted string in camel case
   * @memberof UtilityService
   */
  static toCammelCase(string, delimeter, seperator) {
    return this.cleanString(string)
      .split(delimeter || "-")
      .map((str, index) => {
        return index === 0 ? str : this.ucFirstStr(str);
      })
      .join(seperator ? seperator : "");
  }
}
