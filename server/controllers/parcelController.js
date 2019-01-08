import ParcelService from '../services/ParcelService';
import Controller from './Controller';

/**
 * @export
 * @class ParcelController
 * @extends { Controller }
 */
export default class ParcelController extends Controller {
	/** 
	 * Create a parcel
   * 
	 * @static
	 * @returns {function} A middleware function that handles the POST request
   * @method createParcel
	 * @memberof ParcelController
	 */
  static createParcel() {
    return (req, res) => {
      return ParcelService.createParcel(req.body)
        .then(result => this.response(res, result))
        .catch(error => this.serverError(res, error));
    };
  }

  /**
   * Gets all parcels
   * 
   * @static
   * @returns {function} Returns an express middleware function that handles the GET request
   * @method getParcels
   * @memberof RequestController
   */
  static getParcels() {
    return (req, res, next) => {
      if (req.query.filter) {
        return next();
      }
      const { userId } = req.body.decoded;
      // If URL contains user id
      // Then we know we are fetching a specific user parcels
      const isUserParcels = typeof req.params.userId !== 'undefined';
      if (isUserParcels && Number(userId) !== Number(req.params.userId)) {
        const message = 'Sorry, not a valid logged in user';
        return this.response( res, { statusCode: 401, message });
      }
      return ParcelService.fetchParcels({
        userId, isUserParcels
      }).then(result => this.response(res, result))
        .catch(error => this.serverError(res, error));
    };
  }

  /**
   * Gets a single parcel
   * 
   * @static
   * @returns {function} Returns an express middleware function that handles the GET request
   * @method getParcel
   * @memberof ParcelController
   */
  static getParcel() {
    return (req, res) => {
      const { userId, isAdmin } = req.body.decoded;
      if (req.params.userId && Number(userId) !== Number(req.params.userId)) {
        const message = 'Sorry, not a valid logged in user';
        return this.response(res, { statusCode: 401, message });
      } 
      return ParcelService.fetchParcel({
        parcelId: req.params.parcelId, userId, isAdmin
      }).then(result => this.response(res, result))
        .catch(error => this.serverError(res, error));
    };
  }

  /**
   * Get states or lgas
   *
   * @static
   * @param {string} text
   * @returns {function} An express middleware function that handles the get request
   * @memberof getPlaces
   * @memberof ParcelController
   */
  static getPlaces(text) {
    return (req, res) => {
      const stateId = req.params.stateId || null;
      ParcelService.fetchPlaces(stateId ? { stateId, text } : { text })
      .then(result => this.response(res, result))
      .catch(error => this.serverError(res, error));
    };
  }

  /**
   * Filter parcels
   *
   * @static
   * @returns {function} Returns an express middleware function that handles the GET request
   * @memberof ParcelController
   */
  static filterParcels() {
    return (req, res) => {
      const { isAdmin, userId } = req.body.decoded;
      // If URL contains user id
      // Then we know we are filtering a specific user parcels
      const isUserParcels = typeof req.params.userId !== 'undefined';
      if (isUserParcels && !isAdmin && (Number(userId) !== Number(req.params.userId))) {
        const message = 'Sorry, not a valid logged in user';
        return this.response(res, { statusCode: 401, message });
      }
      const filter = this.ucFirstStr(req.query.filter);
      return ParcelService.fetchParcels({ filter, isUserParcels, userId })
        .then(result => this.response(res, result))
        .catch(error => this.serverError(res, error));
    };
  }

  /**
   * Cancel parcel deivery order
   * @static
   * @param {string} update specify the update operation
   * @returns {function} Returns an express middleware function that handles the PUT request
   * @method cancelParcelOrder
   * @memberof RequestController
   */
  static updateParcel(update) {
    return (req, res) => {
      return ParcelService.updateParcel({ 
        requestBody: req.body, update, parcelId: req.params.parcelId
      }).then(result => this.response(res, result))
        .catch(error => this.serverError(res, error));
    };
  }

  /**
   *
   *
   * @static
   * @returns {function} An express middleware function that handle the GET request
   * @memberof ParcelController
   */
  static getAreas() {
    return (req, res) => {
      return ParcelService.getAreas({
        stateId: req.params.stateId,
        lgaId: req.params.lgaId
      }).then(result => this.response(res, result))
        .catch(error => this.serverError(res, error));
    };
  }

  /**
   * Get the total count of all parcel delivery orders
   *
   * @static
   * @returns {function} An express middleware function that handles the GET request
   * @method countOrders
   * @memberof ParcelController
   */
  static countOrders() {
    return (req, res) => {
      const userId = req.body.decoded.userId;
      // If URL contains user id
      // Then we know we are fetching a specific user parcels
      const isUserParcels = typeof req.params.userId !== 'undefined';
      if (isUserParcels && Number(userId) !== Number(req.params.userId)) {
        const message = 'Sorry, not a valid logged in user';
        return this.response( res, { statusCode: 401, message });
      }
      return ParcelService.countOrders(isUserParcels ? userId : null)
        .then(result => this.response(res, result))
        .catch(error => this.serverError(res, error));
    };
  }
}
