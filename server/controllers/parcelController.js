import _ from 'lodash';
import db from '../database';
import UtilityService from '../helpers/UtilityService';


/**
 * @export
 * @class ParcelController
 * @extends { UtilityService }
 */
export default class ParcelController extends UtilityService {
	/**
	 * 
	 * @static
	 * @returns {function} A middleware function that handles the POST request
	 * @memberof ParcelController
	 */
	static createParcel() {
		return (req, res) => {
      const moment = new Date(), { 
        weight, description, deliveryMethod, pickupAddress, pickupCity, pickupState,
        pickupDate, destinationAddress, destinationCity, destinationState, 
        trackingNo, price, receiverName, receiverPhone, decoded
      } = req.body;
      const query = {
        name: 'create-parcel',
        text: `INSERT INTO parcels (
                  weight, description, deliverymethod, pickupaddress, pickupcity, pickupstate,
                  pickupdate, destinationaddress, destinationcity, destinationstate, trackingno,
                  price, userid, receivername, receiverphone, createdat, updatedat ) VALUES (
                  $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
                ) RETURNING *`,
        values: [
          weight, description, deliveryMethod, pickupAddress, pickupCity, pickupState,
          pickupDate, destinationAddress, destinationCity, destinationState, trackingNo,
          price, decoded.userid, receiverName, receiverPhone, moment, moment
        ]
      };
      db.sqlQuery(query).then((result) => {     
        return this.successResponse(res, 201, 'Parcel delivery order successfully created', {
          ...result.rows[0]
        });
      }).catch(() => { return this.errorResponse(res, 500, db.dbError()); });
		};
  }
  
  /**
   * Gets all parcels
   * @static
   * @returns {function} Returns an express middleware function that handles the GET request
   * @memberof RequestController
   */
  static getParcels() {
    return (req, res) => {
      const query = {
        name: 'all-parcels',
        text: `SELECT * FROM parcels`
      };

      db.sqlQuery(query).then((result) => {
        const parcels = result.rows;
        return (_.isEmpty(parcels))
        ? this.errorResponse(res, 404, 'No parcel found')
        : this.successResponse(res, 200, undefined, { parcels });
      }).catch(() => {
        this.errorResponse(res, 500, db.dbError());
      });
    };
	}

  /**
   * Gets a single parcel
   * @static
   * @returns {function} Returns an express middleware function that handles the GET request
   * @memberof ParcelController
   */
  static getParcel() {
    return (req, res) => {
      db.sqlQuery(this.getParcelQuery(req.params.parcelId)).then((result) => {
        const parcel = result.rows;
        return (_.isEmpty(parcel))
        ? this.errorResponse(res, 404, 'No parcel found')
        : this.successResponse(res, 200, undefined, { parcel: parcel[0] });
      }).catch(() => {
        this.errorResponse(res, 500, db.dbError());
      });
    };
	}
	
  /**
   * Gets all user's parcels
   * @static
   * @returns {function} Returns an express middleware function that handles the GET request
   * @memberof RequestController
   */
  static getUserParcels() {
    return (req, res) => {
      if (Number(req.body.decoded.userid) !== Number(req.params.userId)) {
        this.errorResponse(res, 401, 'Sorry, not a valid logged in user');
      } else {
        const query = {
          name: 'fetch-parcel',
          text: `SELECT * FROM parcels WHERE userid = $1`,
          values: [req.params.userId]
        };
        
        db.sqlQuery(query).then((result) => {
          const parcels = result.rows;
          return (_.isEmpty(parcels))
                  ? this.errorResponse(res, 404, 'No parcel found')
                  : this.successResponse(res, 200, undefined, { parcels });
        }).catch(() => {
          this.errorResponse(res, 500, db.dbError());
        });
      }
    };
  }

  /**
   * Gets a specific user parcel
   * @static
   * @returns {function} Returns an express middleware function that handles the GET request
   * @memberof RequestController
   */
  static getUserParcel() {
    return (req, res) => {
      if (Number(req.body.decoded.userid) !== Number(req.params.userId)) {
        this.errorResponse(res, 401, 'Sorry, not a valid logged in user');
      } else {
        const { userid } = req.body.decoded;
        db.sqlQuery(this.getUserParcelQueryObj(userid, req.params.parcelId)).then((result) => {
          const parcel = result.rows[0];
          return (_.isEmpty(parcel))
                  ? this.errorResponse(res, 404, 'No parcel found')
                  : this.successResponse(res, 200, undefined, { parcel });
        }).catch((e) => {
          this.errorResponse(res, 500, e.toString());
        });
      }
    };
  }
    
  /**
   * Create fetch user parcel query object
   *
   * @static
   * @param {int} userId user id
   * @param {int} parcelId parcel id
   * @returns {Object} the query object
   * @method getUserParcelQueryObj
   * @memberof ParcelController
   */
  static getUserParcelQueryObj(userId, parcelId) {
    return {
      name: 'fetch-user-parcel',
      text: `SELECT * FROM parcels WHERE userid = $1 AND parcelid = $2`,
      values: [userId, parcelId]
    };
  }

  /**
   * Create cancel parcel delivery order query object
   *
   * @static
   * @param {string} status
   * @param {int} userId user id
   * @param {int} parcelId parcel id
   * @returns {Object} the query object
   * @method getUserParcelQueryObj
   * @memberof ParcelController
   */
  static getCancelOrderQueryObj(status, userId, parcelId) {
    return {
      text: `UPDATE parcels 
            SET deliverystatus = $1 WHERE parcelid = $2 AND userid = $3 RETURNING *`,
      values: [status, parcelId, userId]
    };
  }

  /**
   * Create admin get parcel delivery order query object
   *
   * @static
   * @param {int} parcelId the parcel id
   * @returns {object} the query object
   * @method getParcelQuery
   * @memberof ParcelController
   */
  static getParcelQuery(parcelId) {
    return {
      text: `SELECT * FROM parcels WHERE parcelid = $1`,
      values: [parcelId]
    };
  }
	
  /**
   * Cancel parcel deivery order
   * @static
   * @returns {function} Returns an express middleware function that handles the PUT request
   * @method cancelParcelOrder
   * @memberof RequestController
   */
  static cancelParcelOrder() {
    return (req, res) => {
			const parcelId = req.params.parcelId, { userid } = req.body.decoded;
      db.sqlQuery(this.getUserParcelQueryObj(userid, parcelId)).then((result) => {
        if (_.isEmpty(result.rows)) {
          this.errorResponse(res, 404, 'No parcel found');
        } else {
          const status = 'Cancelled', parcel = result.rows[0];
          if (parcel.deliverystatus === 'Delivered') {
            this.errorResponse(res, 403, 'Delivered parcel cannot be cancelled');
          } else if (parcel.deliverystatus === status) {
            this.errorResponse(res, 200, 'Parcel has already been cancelled');
          } else {
            db.sqlQuery(this.getCancelOrderQueryObj(status, userid, parcelId)).then((updated) => {
              return this.successResponse(
                res, 200, 'Parcel delivery order successfully cancelled', {
                   parcel: updated.rows[0] 
                });
            }).catch(() => { 
              this.errorResponse(res, 500, 'Something went wrong! Update not successful');
            });
          }
        }
      }).catch(() => { return this.errorResponse(res, 500, db.dbError()); });
    };
  }

  /**
   * Update the current location of a parcel delivery order
   *
   * @static
   * @returns {function} Returns an express middleware function that handles the PUT request
   * @method updateLocation
   * @memberof ParcelController
   */
  static updateLocation() {
    return (req, res) => {
      db.sqlQuery(this.getParcelQuery(req.params.parcelId)).then((result) => {
        if (_.isEmpty(result.rows)) {
          this.errorResponse(res, 404, 'No parcel found');
        } else {
          const parcel = result.rows[0];
          const msg = 'location cannot be updated';
          if (parcel.deliverystatus === 'Delivered') {
            this.errorResponse(res, 403, `Parcel already delivered, ${msg}`);
          } else if (parcel.deliverystatus === 'Cancelled') {
            this.errorResponse(res, 403, `Delivery order has been cancelled, ${msg}`);
          } else if (parcel.deliverystatus === 'Placed') {
            this.errorResponse(res, 403, `Parcel not yet transiting, ${msg}`);
          } else {
            const updateQuery = {
              text: `UPDATE parcels SET presentlocation = $1 WHERE parcelid = $2 RETURNING *`,
              values: [req.body.presentLocation, req.params.parcelId]
            };
            db.sqlQuery(updateQuery).then((updated) => {
              return this.successResponse(
                res, 200, 'Present location successfully updated', {
                   parcel: updated.rows[0] 
                });
            }).catch(() => { 
              this.errorResponse(res, 500, 'Something went wrong! Update not successful');
            });
          }
        }
      }).catch(() => { this.errorResponse(res, 500, db.dbErro()); });
    };
  }

  /**
   * Update parcel delivery order status
   *
   * @static
   * @returns {function} Returns an express middleware function that handles the PUT request
   * @method updateStatus
   * @memberof ParcelController
   */
  static updateStatus() {
    return (req, res) => {
      db.sqlQuery(this.getParcelQuery(req.params.parcelId)).then((result) => {
        if (_.isEmpty(result.rows)) {
          this.errorResponse(res, 404, 'No parcel found');
        } else {
          const parcel = result.rows[0], msg = 'status cannot be updated';
          if (parcel.deliverystatus === 'Delivered') {
            this.errorResponse(res, 403, `Parcel already delivered, ${msg}`);
          } else if (parcel.deliverystatus === 'Cancelled') {
            this.errorResponse(res, 403, `Delivery order has been cancelled, ${msg}`);
          } else if (parcel.deliverystatus === req.body.deliveryStatus) {
            this.successResponse(res, 200, `Delivery order status already set to transiting`);
          } else {
            const updateQuery = {
              text: `UPDATE parcels SET deliverystatus = $1 WHERE parcelid = $2 RETURNING *`,
              values: [req.body.deliveryStatus, req.params.parcelId]
            };
            db.sqlQuery(updateQuery).then((updated) => {
              return this.successResponse(
                res, 200, 'Delivery order status successfully updated', {
                   parcel: updated.rows[0] 
                });
            }).catch((e) => { this.errorResponse(res, 500, e.toString()); });
          }
        }
      }).catch(() => { this.errorResponse(res, 500, db.dbErro()); });     
    };
  }
}