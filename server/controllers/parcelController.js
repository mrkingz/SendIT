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

      const query = { 
        text: `SELECT DISTINCT 
                parcels.*, CONCAT(firstname,(' '||lastname)) AS sendername 
              FROM parcels 
              INNER JOIN users 
              ON parcels.userid = users.userid` 
      };
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
            ? this.errorResponse({ res, code: 404, message: 'No delivery order found' })
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
            SET deliverystatus = $1, updatedat = $2 WHERE parcelid = $3 AND userid = $4 RETURNING *`,
      values: [status, new Date(), parcelId, userId]
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
      text: `SELECT DISTINCT
              parcels.*, CONCAT(firstname,(' '||lastname)) AS sendername 
            FROM parcels 
            INNER JOIN users 
            ON parcels.userid = users.userid AND parcelid = $1`,
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
        const status = 'Cancelled', parcel = result.rows[0];
        if (_.isEmpty(result.rows)) {
          this.errorResponse({ res, code: 404, message: 'No delivery order found' });
        } else if (['Delivered', 'Transiting'].includes(parcel.deliverystatus)) {
          const message = `${parcel.deliverystatus} parcel cannot be cancelled`;
          this.errorResponse({ res, code: 403, message });
        } else {
          db.sqlQuery(this.getCancelOrderQuery(status, userid, parcelId)).then((updated) => {
            const message = 'Parcel delivery order successfully cancelled';
            this.successResponse({
              res, message, data: { parcel: updated.rows[0] }
            });
          }).catch(() => this.errorResponse({ res, message: 'Sorry, could not cancel order' }));
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
        const parcel = result.rows[0], msg = 'location cannot be updated';
        if (_.isEmpty(result.rows)) {
          this.errorResponse({ res, code: 404, message: 'No delivery order found' });
        } else if (['Cancelled', 'Delivered'].includes(parcel.deliverystatus)) {
          const status = parcel.deliverystatus.toLowerCase();
          this.errorResponse({ res, code: 403, message: `Parcel already ${status}, ${msg}` });
        } else {
          const updateQuery = {
            text: `UPDATE parcels 
                    SET presentlocation = $1, deliverystatus = $2, updatedat = $3
                    WHERE parcelid = $4 RETURNING *`,
            values: [
              this.ucFirstStr(req.body.presentLocation, { bool: true }),
              req.body.deliveryStatus,
              new Date(),
              req.params.parcelId
            ]
          };
          db.sqlQuery(updateQuery).then((updated) => {
            const message = 'Present location successfully updated';
            this.successResponse({
              res, message, data: { parcel: updated.rows[0] }
            });
          })
          .catch(() => this.errorResponse({ res, message: 'Sorry, could not update location' }));
        }
      }).catch(() => this.errorResponse({ res, message: db.dbError() }));
    };
  }

  /**
   * Edit delivery order details
   *
   * @static
   * @param {string} type the details to edit
   * @returns {function} Returns an express middleware function that handles the PUT request
   * @method editParcel
   * @memberof ParcelController
   */
  static editParcel(type) {
    return (req, res) => {
      db.sqlQuery(this.getParcelQuery(req.params.parcelId)).then((result) => {
        const parcel = result.rows[0];
        if (_.isEmpty(parcel)) {
          this.errorResponse({ res, code: 404, message: 'No delivery order found' });
        } else if (parcel.deliverystatus !== 'Placed') {
          const msg = `Parcel already ${parcel.deliverystatus.toLowerCase()}, cannot be edited`;
          this.errorResponse({ res, code: 403, message: msg });
        } else {
          const {
            weight, description, deliveryMethod, decoded, pickupAddress, 
            pickupCity, pickupState, pickupDate, receiverName, receiverPhone
          } = req.body;
          const queries = {
            parcel: {
              text: `UPDATE parcels
                 SET weight = $1, description = $2, deliverymethod = $3, updatedat = $4
                 WHERE userid = $5 AND parcelid = $6 RETURNING *`,
              values: [
                weight, description, deliveryMethod, new Date(), decoded.userid, req.params.parcelId
              ]
            },
            pickup: {
              text: `UPDATE parcels
                    SET pickupaddress = $1, pickupcity = $2, pickupstate = $3, 
                      pickupdate = $4, updatedat = $5
                    WHERE userid = $6 AND parcelid = $7 RETURNING *`,
              values: [
                pickupAddress, pickupCity, pickupState, pickupDate,
                new Date(), decoded.userid, req.params.parcelId
              ]            
            },
            receiver: {
              text: `UPDATE parcels
                    SET receivername = $1, receiverphone = $2, updatedat = $3
                    WHERE userid = $4 AND parcelid = $5 RETURNING *`,
              values: [
                receiverName, receiverPhone, new Date(), decoded.userid, req.params.parcelId 
              ]              
            }
          };
          db.sqlQuery(queries[type.replace(/[-]+/g, '')]).then((updated) => { console.log(updated)
            const msg = `details successfully edited`;
            const message = `${this.ucFirstStr(type.replace(/[-]+/g, ' '))} ${msg}`;
            this.successResponse({
              res, message, data: { parcel: updated.rows[0] }
            });
          })
          .catch(() => this.errorResponse({ res, message: db.dbError() }));
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
        const parcel = result.rows[0], msg = 'status cannot be updated';
        if (_.isEmpty(result.rows)) {
          this.errorResponse({ res, code: 404, message: 'No delivery order found' });
        } else if (['Cancelled', 'Delivered'].includes(parcel.deliverystatus)) {
          const status = parcel.deliverystatus.toLowerCase();
          this.errorResponse({ res, code: 403, message: `Parcel already ${status}, ${msg}` });
        } else {
          const updateQuery = {
            text: `UPDATE parcels 
                  SET deliverystatus = $1, updatedat = $2 
                  WHERE parcelid = $3 RETURNING *`,
            values: [req.body.deliveryStatus, new Date(), req.params.parcelId]
          };
          db.sqlQuery(updateQuery).then((updated) => {
            const message = 'Delivery order status successfully updated';
            this.successResponse({
              res, message, data: { parcel: updated.rows[0] }
            });
          }).catch(() => this.errorResponse({ res, message: db.dbError() }));
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
        const parcel = result.rows[0], msg = 'destination cannot be updated';
        if (_.isEmpty(result.rows)) {
          this.errorResponse({ res, code: 404, message: 'No delivery order found' });
        } else if (['Cancelled', 'Delivered'].includes(parcel.deliverystatus)) {
          const status = parcel.deliverystatus.toLowerCase();
          this.errorResponse({ res, code: 403, message: `Parcel already ${status}, ${msg}` });
        } else {
          const updateQuery = {
            text: `UPDATE parcels 
                  SET destinationaddress = $1, destinationcity = $2,
                    destinationstate = $3, updatedat = $4
                  WHERE parcelid = $5 AND userid = $6 RETURNING *`,
            values: [
              destinationAddress, destinationCity, destinationState, 
              new Date(), parcelId, decoded.userid
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
      }).catch(() => this.errorResponse({ res, message: db.dbError() }));
    };
  }
}