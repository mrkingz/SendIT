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
   * Return an error message from the server
   * @static
   * @param {object} obj - the object containing the response detail
   * @return {object} Returns the error response
   * @memberof Controller
   */
  static errorResponse(obj) {
    return obj.res.status(obj.statusCode || 500).json({
      status: 'Fail',
      message: obj['message']
    });
  }

  /**
   * 
   * 
   * Return an error message from the server
   * @static
   * @param {object} obj - the object containing the response detail
   * @return {object} Returns the response
   * @memberof Controller
   */
  static successResponse(obj) {
    const {
      res, statusCode, message, data
    } = obj;
    return res.status(statusCode || 200).json({
      status: 'Success',
      message,
      data
    });
  }
}