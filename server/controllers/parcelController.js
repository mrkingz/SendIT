import db from '../database';
import collections from '../dummyData';
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
   * Gets a single parcel
   * @static
   * @returns {function} Returns an express middleware function that handles the GET request
   * @memberof ParcelController
   */
  static getParcel() {
    return (req, res) => {
      let parcel;
      const parcelId = req.params.parcelId;
      const length = collections.getParcelsCount();
      for (let i = 0; i < length; i++) {
        if (parseInt(collections.getParcels()[i].parcelId, 10) === parseInt(parcelId, 10)) {
          parcel = collections.getParcels()[i];
          break;
        }
			}
			
      return (parcel) 
				? this.successResponse(res, 200, undefined, parcel)
				: this.errorResponse(res, 404, 'Parcel not found');
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
      const { userId } = req.body.decoded;
      const parcels = [];
      const length = collections.getParcelsCount();
      for (let i = 0; i < length; i++) {
        if (parseInt(collections.getParcels()[i].userId, 10) === parseInt(userId, 10)) {
          parcels.push(collections.getParcels()[i]);
        }
      }

      return (parcels.length > 0)
        ? this.successResponse(res, 200, undefined, { parcels })
        : this.errorResponse(res, 404, 'No parcel found');
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
      return (collections.getParcelsCount() > 0)
        ? this.successResponse(res, 200, undefined, { parcels: collections.getParcels() })
        : this.errorResponse(res, 404, 'No parcel found');
    };
	}
	
  /**
   * Cancel parcel deivery order
   * @static
   * @returns {function} Returns an express middleware function that handles the PUT request
   * @memberof RequestController
   */
  static cancelParcelOrder() {
    return (req, res) => {
			const parcelId = req.params.parcelId;
			const { userId } = req.body.decoded;
			const length = collections.getParcelsCount();

      let parcel;
      for (let i = 0; i < length; i++) {
				if (parseInt(collections.getParcels()[i].userId, 10) === parseInt(userId, 10) 
					&& parseInt(collections.getParcels()[i].parcelId, 10) === parseInt(parcelId, 10)) {
          parcel = collections.getParcels()[i];
          break;
        }
      }

			if (parcel) {
        const status = 'Cancelled';
				if (parcel.deliveryStatus === 'Delivered') {
					return this.errorResponse(
            res, 404, 'Already delivered parcel cannot be cancelled', undefined
            );
        }
        
        if (parcel.deliveryStatus === status) {
          return this.errorResponse(
            res, 200, 'Parcel has already been cancelled'
            );
        }

				parcel.deliveryStatus = status;
				return this.successResponse(
          res, 200, 'Parcel delivery order successfully cancelled', parcel
          );
			}

			return this.errorResponse(res, 404, 'No parcel found');
    };
  }
}