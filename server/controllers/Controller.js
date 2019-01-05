import UtilityService from '../services/UtilityService';

/**
 *
 *
 * @export
 * @class Controller
 * @extends {UtilityService}
 */
export default class Controller extends UtilityService {
  /**
   * 
   * 
   * Return an error message from the server
   * @static
   * @param {object} res HTTP response object
   * @param {object} dataObj - the object containing the response detail
   * @return {object} Returns the response
   * @memberof Controller
   */
  static response(res, dataObj) {
    let { statusCode, message, data } = dataObj;
    statusCode = statusCode || 200;
    return res.status(statusCode).json({
      status: statusCode >= 400 ? 'Fail' : 'Success',
      message,
      data
    });
  }

  /**
   * 
   * @static
   * @param {object} res HTTP response object
   * @param {object} error error object
   * @returns {string} Returns the error message
   * @method serverError
   * @memberof Controller
   */
  static serverError(res, error) {
    return res.status(500).json({
      status: 'Fail',
      message: error && process.env.NODE_ENV.trim() === 'development'
        ? error.message 
        : `Sorry, internal error occured, try again later!`
    });
  }
}