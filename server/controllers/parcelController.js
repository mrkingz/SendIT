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
        const parcel = result.rows[0];   
        this.successResponse({ 
          res, code: 201, message: 'Delivery order successfully created', data: { parcel } 
        });
      }).catch(() => this.errorResponse({ res, message: db.dbError() }));
		};
  }
  
  /**
   * Gets all parcels
   * @static
   * @returns {function} Returns an express middleware function that handles the GET request
   * @memberof RequestController
   */
  static getParcels() {
    return (req, res, next) => {
      if (req.query.filter) {
        return next();
      }

      const query = { text: `SELECT * FROM parcels` };
      db.sqlQuery(query).then((result) => {
        const parcels = result.rows;
        return (_.isEmpty(parcels))
        ? this.errorResponse({ res, code: 404, message: 'No delivery order found' })
        : this.successResponse({ 
            res, code: 302, message: 'Parcels successfully retrieved', data: { parcels } 
          });
      }).catch(() => this.errorResponse({ res, message: db.dbError() }));
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
        ? this.errorResponse({ res, code: 404, message: 'No delivery order found' })
        : this.successResponse({
            res, code: 302, message: 'Parcel successfully retrieved', data: { parcel: parcel[0] }
          });
      }).catch(() => this.errorResponse({ res, message: db.dbError() }));
    };
	}
	
  /**
   * Gets all user's parcels
   * 
   * @static
   * @returns {function} Returns an express middleware function that handles the GET request
   * @memberof RequestController
   */
  static getUserParcels() {
    return (req, res, next) => {
      if (req.query.filter) {
        return next();
      }

      if (Number(req.body.decoded.userid) !== Number(req.params.userId)) {
        this.errorResponse({ res, code: 401, message: 'Sorry, not a valid logged in user' });
      } else {
        const query = {
          text: `SELECT * FROM parcels WHERE userid = $1`,
          values: [req.params.userId]
        };        
        db.sqlQuery(query).then((result) => {
          const parcels = result.rows;
          return (_.isEmpty(parcels))
                  ? this.errorResponse({ 
                    res, code: 404, message: 'No delivery order found'
                   })
                  : this.successResponse({
                      res, code: 302, message: 'Parcels successfully retrieved', data: { parcels } 
                    });
        }).catch(() => this.errorResponse({ res, message: db.dbError() }));
      }
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
      const isadmin = req.body.decoded.isadmin;
      if (!isadmin && (Number(req.body.decoded.userid) !== Number(req.params.userId))) {
        this.errorResponse({ res, code: 401, message: 'Sorry, not a valid logged in user' });
      } else {
        const filter = this.ucFirstStr(req.query.filter);
        const where = isadmin ? `deliverystatus = $1` : `userid = $1 AND deliverystatus = $2`;
        const values = isadmin ? [filter] : [req.params.userId, filter];
        const query = { text: `SELECT * FROM parcels WHERE ${where}`, values };        
        db.sqlQuery(query).then((result) => {
          const parcels = result.rows;
          const message = `No ${filter.toLowerCase()} delivery order found`;
          const msg = `${filter} parcels successfully retrieved`;
          return (_.isEmpty(parcels))
                  ? this.errorResponse({ res, code: 404, message })
                  : this.successResponse({
                      res, code: 302, message: msg, data: { parcels } 
                    });
        }).catch(() => this.errorResponse({ res, message: db.dbError() }));
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
        this.errorResponse({ res, code: 401, message: 'Sorry, not a valid logged in user' });
      } else {
        const { userid } = req.body.decoded;
        db.sqlQuery(this.getUserParcelQuery(userid, req.params.parcelId)).then((result) => {
          const parcel = result.rows[0];
          return (_.isEmpty(parcel))
                  ? this.errorResponse({ res, code: 404, message: 'No delivery order found' })
                  : this.successResponse({ 
                      res, code: 302, message: "Parcel successfully retrieved", data: { parcel }
                    });
        }).catch(() => this.errorResponse({ res, message: db.dbError() }));
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
   * @method getUserParcelQuery
   * @memberof ParcelController
   */
  static getUserParcelQuery(userId, parcelId) {
    return {
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
   * @method getUserParcelQuery
   * @memberof ParcelController
   */
  static getCancelOrderQuery(status, userId, parcelId) {
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
      db.sqlQuery(this.getUserParcelQuery(userid, parcelId)).then((result) => {
        if (_.isEmpty(result.rows)) {
          this.errorResponse({ res, code: 404, message: 'No delivery order found' });
        } else {
          const status = 'Cancelled', parcel = result.rows[0];
          if (parcel.deliverystatus === 'Delivered') {
            this.errorResponse({ res, code: 403, message: 'Delivered parcel cannot be cancelled' });
          } else if (parcel.deliverystatus === status) {
            this.successResponse({ 
              res, message: 'Parcel has already been cancelled', data: { parcel }
           });
          } else {
            db.sqlQuery(this.getCancelOrderQuery(status, userid, parcelId)).then((updated) => {
              const message = 'Parcel delivery order successfully cancelled';
              this.successResponse({
                res, message, data: { parcel: updated.rows[0] }
              });
            }).catch(() => this.errorResponse({ res, message: 'Sorry, could not cancel order' }));
          }
        }
      }).catch(() => this.errorResponse({ res, message: db.dbError() }));
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
          this.errorResponse(res, 404, 'No delivery order found');
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
              const message = 'Present location successfully updated';
              this.successResponse({
                res, message, data: { parcel: updated.rows[0] }
              });
            })
            .catch(() => this.errorResponse({ res, message: 'Sorry, could not update location' }));
          }
        }
      }).catch(() => this.errorResponse({ res, message: db.dbError() }));
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
          this.errorResponse({ res, code: 404, message: 'No delivery order found' });
        } else {
          const parcel = result.rows[0], msg = 'status cannot be updated';
          if (parcel.deliverystatus === 'Delivered') {
            this.errorResponse({ res, code: 403, message: `Parcel already delivered, ${msg}` });
          } else if (parcel.deliverystatus === 'Cancelled') {
            this.errorResponse({ 
              res, code: 403, message: `Delivery order has been cancelled, ${msg}` 
            });
          } else if (parcel.deliverystatus === req.body.deliveryStatus) {
            this.successResponse({
              res, message: `Delivery status already set to transiting`, data: { parcel }
            });
          } else {
            const updateQuery = {
              text: `UPDATE parcels SET deliverystatus = $1 WHERE parcelid = $2 RETURNING *`,
              values: [req.body.deliveryStatus, req.params.parcelId]
            };
            db.sqlQuery(updateQuery).then((updated) => {
              const message = 'Delivery order status successfully updated';
              this.successResponse({
                res, message, data: { parcel: updated.rows[0] }
              });
            }).catch(() => this.errorResponse({ res, message: db.dbError() }));
          }
        }
      }).catch(() => this.errorResponse({ res, message: db.dbError() }));     
    };
  }

  /**
   * Update parcel destination
   * @static
   * @returns {function} Returns an express middleware function that handles the PUT request
   * @method updateDestination
   * @memberof RequestController
   */
  static updateDestination() {
    return (req, res) => {
      const parcelId = req.params.parcelId, { 
        decoded, destinationAddress, destinationCity, destinationState
       } = req.body;
      const query = {
        text: `SELECT * FROM parcels WHERE parcelid = $1 AND userid = $2`,
        values: [parcelId, decoded.userid]
      };
      db.sqlQuery(query).then((result) => {
        if (_.isEmpty(result.rows)) {
          this.errorResponse({ res, code: 404, message: 'No delivery order found' });
        } else {
          const parcel = result.rows[0], msg = 'destination cannot be updated';
          if (parcel.deliverystatus === 'Delivered') {
            this.errorResponse({ res, code: 403, message: `Parcel has been delivered, ${msg}` });
          } else if (parcel.deliverystatus === 'Cancelled') {
            this.errorResponse({ res, code: 403, message: `Parcel has been cancelled, ${msg}` });
          } else {
            const updateQuery = {
              text: `UPDATE parcels 
                    SET destinationaddress = $1, destinationcity = $2, destinationstate = $3
                    WHERE parcelid = $4 AND userid = $5 RETURNING *`,
              values: [
                destinationAddress, destinationCity, destinationState, parcelId, decoded.userid
              ]
            };
            db.sqlQuery(updateQuery).then((updated) => {
              const message = 'Parcel destination successfully updated';
              this.successResponse({
                res, message, data: { parcel: updated.rows[0] }
              });
            }).catch(() => this.errorResponse({ 
              res, message: 'Sorry, could not update destination' 
            }));
          }
        }
      }).catch(() => this.errorResponse({ res, message: db.dbError() }));
    };
  }
}