/* eslint-disable default-case */
/* eslint-disable no-fallthrough */
import db from '../database';
import UtilityService from '../services/UtilityService';
import ParcelSQLService from '../services/ParcelSQLService';
import NotificationService from '../services/NotificationService';

/**
 *
 *
 * @export
 * @class ParcelService
 * @extends {UtilityService}
 */
export default class ParcelService extends UtilityService {
  /**
   * Generate an error message for unauthorize parcel updated operation
   *
   * @static
   * @param {object} parcel parcel to update
   * @param {string} newStatus
   * @param {string} update
   * @returns {string} the generated message
   * @method checkStatus
   * @memberof ParcelService
   */
  static checkStatus(parcel, newStatus, update) {
    const oldStatus = parcel.deliveryStatus;
    let msg = `Parcel already ${oldStatus.toLowerCase()}, `;
    const message = msg, str = ':text cannot be updated';
    const status = ['Cancelled', 'Delivered', 'Placed', 'Transiting'];
    switch (update) {
      case 'delivery-status':
      case 'cancel': msg = this.getStatusErrorMessage({
        parcel, newStatus, update, msg, str
      });
        break;
      case 'destination':
      case 'location': if ([status[0], status[1]].includes(oldStatus)) {
        msg += `${str.replace(':text', update).trim()}`;
      }
        break;
      default: if (oldStatus !== 'Placed') {
        msg += `${str.replace(':text', '').trim()}`;
      }
    }
    const hasError = message !== msg;
    return { hasError, messageBag: hasError ? msg : null };
  }

  /**
   * Compute delivery price
   *
   * @static
   * @param {int|float} weight
   * @param {number} [distance=1] the total distance
   * @returns {number} the computed delivery price
   * @memberof ParcelService
   */
  static computePrice(weight, distance = 1) {
    return (Number(weight) * 1000 * Number(distance));
  }

  /**
   * Get the total numbers of orders in the system
   *
   * @static
   * @returns {object} object containing the breakdown of total orders as properties
   * @memberof ParcelService
   */
  static countOrders() {
    return db.sqlQuery(ParcelSQLService.selectCounts())
      .then((result) => {
        return (!result.rows[0])
          ? { statusCode: 404, message: 'No delivery order found' }
          : {
            statusCode: 200,
            message: 'Total parcel delivery orders',
            data: { count: result.rows[0] }
          };
      });
  }

  /**
   * Create a parcel deliveery order
   *
   * @static
   * @param {object} data
   * @returns {object} object with statusCode, message and parcel details as properties
   * @memberof ParcelService
   */
  static createParcel(data) {
    const moment = new Date(), {
      weight, description, deliveryMethod, pickUpAddress, pickUpLGAId, pickUpStateId,
      pickUpDate, destinationAddress, destinationLGAId, destinationStateId,
      receiverName, receiverPhone, decoded
    } = data;
    const trackingNo = moment.getTime();
    const values = [
      weight, description === '' ? null : description, deliveryMethod,
      this.ucFirstStr(pickUpAddress, { bool: true }), pickUpLGAId, pickUpStateId,
      pickUpDate, this.ucFirstStr(destinationAddress, { bool: true }), destinationLGAId,
      destinationStateId, trackingNo, this.computePrice(weight), decoded.userId,
      this.ucFirstStr(receiverName, { bool: true }), receiverPhone, moment, moment
    ];
    return db.sqlQuery(ParcelSQLService.insertParcel(values))
      .then((result) => {
        const parcel = result.rows[0];
        const { email, firstname, lastname } = decoded;
        const sender = { email, name: `${firstname} ${lastname}` };
        this.dispatchEmail(this.getEmailPayload(sender, parcel));
        return { 
          statusCode: 201, 
          message: 'Delivery order successfully created',
          data: { parcel: this.formatParcel({ parcel, sender }) }
        };
      });
  }

  /**
   * Dispatch email notification
   *
   * @static
   * @param {object} payload email payload
   * @method dispatchEmail
   * @memberof ParcelService
   */
  static dispatchEmail(payload) {
    NotificationService.sendEmail(payload);
  }

  /**
   * Fetch all parcel deliver orders
   *
   * @static
   * @param {object} options
   * @returns {object} object with statusCode, message and array of parcels as properties
   * @memberof ParcelService
   */
  static fetchParcels(options) {
    return db.sqlQuery(ParcelSQLService.selectParcels(options)).then((result) => {
      const parcels = result.rows;
      const { filter } = options;
      return (!parcels[0])
        ? {
            statusCode: 404,
            message: filter
              ? `No ${filter.toLowerCase()} delivery order found`
              : 'No delivery order found'
          }
        : {
            statusCode: 302,
            message: filter
              ? `${filter} parcels successfully retrieved`
              : 'Parcels successfully retrieved',
            data: { parcels: parcels.map(parcel => this.formatParcel(parcel)) }
          };
    });
  }

  /**
   * Fetch a single parcel
   *
   * @static
   * @param {object} options
   * @returns {object} object with statusCode, message and parcel details as properties
   * @memberof ParcelService
   */
  static fetchParcel(options) {
    return this.findParcel(options)
      .then((parcel) => {
        return (parcel)
          ? { 
              statusCode: 302, 
              message: 'Parcel successfully retrieved', 
              data: { parcel: this.formatParcel(parcel) } 
            }
          : { statusCode: 404, message: 'No delivery order found' };
      });
  }

  /**
   * Find a specific parcel order
   *
   * @static
   * @param {object} options
   * @returns {object} object containing parcel details as properties or null
   * @method findParcel
   * @memberof ParcelService
   */
  static findParcel(options) {
    return db.sqlQuery(ParcelSQLService.selectParcel(options))
      .then((result) => {
        const parcel = result.rows[0];
        if (parcel) {
          const {
            name, email, phoneNumber, ...details
          } = parcel || {};
          // If parcel exist and user is admin, we organize and append sender details
          // We need them to send notifications
          if (parcel && options.isAdmin) {
            details.sender = { name, email, phoneNumber };
            return details;
          }
          return parcel;
        }
        return null;
      });
  }

  /**
   * Format parcel data
   *
   * @static
   * @param {object} parcel
   * @return {object} formatted parcel 
   * @method formatParcel
   * @memberof ParcelService
   */
  static formatParcel(parcel) {
    const {
      createdAt, updatedAt, ...details
    } = parcel;
    return {
      ...this.getParcelFormat(details),
      presentLocation: this.getLocationFormat(details),
      from: this.getPickUpFormat(details),
      to: this.getDestinationFormat(details),
      createdAt,
      updatedAt
    };
  }

  /**
   * Format destination details as object properties
   *
   * @static
   * @param {object} data
   * @returns {object} object
   * @method getDestinationFormat
   * @memberof ParcelService
   */
  static getDestinationFormat(data) {
    const {
      destinationAddress, destinationLGA, destinationLGAId, 
      destinationState, destinationStateId, receiverName, receiverPhone,
    } = data;
    return {
      address: destinationAddress,
      lgaId: destinationLGAId,
      lga: destinationLGA,
      stateId: destinationStateId,
      state: destinationState,
      receiver: { name: receiverName, phone: receiverPhone }
    };
  }

  /**
   * Send location update email notification
   *
   * @static
   * @param {object} sender object containing the parcel sender details as properties
   * @param {object} parcel the parcel being updated
   * @param {string} update specify the update operation
   * @returns {object} object containing the sender details and message as properties
   * @method getEmailPayload
   * @memberof ParcelService
   */
  static getEmailPayload(sender, parcel, update) {
    let message, str;
    switch (update) {
      case 'location': message = `<p>Your parcel with tracking number: <b>${parcel.trackingNo}</b>
        is currently at ${parcel.presentLocation}</p>`;
        break;
      case 'delivery-status': str = (parcel.deliveryStatus === 'Transiting')
        ? ' is now '.concat(parcel.deliveryStatus.toLowerCase())
        : ' was successfully '.concat(parcel.deliveryStatus.toLowerCase());
        message = `<p>Your parcel with tracking number:<b> ${parcel.trackingNo}</b>${str}</p>`;
      default: message = `<p>Your delivery order was succe</p>
        <p>Below is your order details:</p>
        <p><b>Weight:</b> ${parcel.weight} kgs<br>
        <b>Description:</b> ${parcel.description ? parcel.description : 'N/A'}<br>
        <b>Delivery cost: &#8358; </b>${parcel.price}<br>
        <b>Delivery method</b> ${parcel.deliveryMethod} delivery<br>
        <b>Delivery status:</b> ${parcel.deliveryStatus}<br>
        <b>Tracking number:</b> ${parcel.trackingNo}</p>
        <p>You will be notified once processing begins.</p>`;
    }
    return { receiver: { email: sender.email, name: sender.name }, message };
  }

  /**
   * Format location details as object properties
   *
   * @static
   * @param {object} data
   * @returns {object} object
   * @method getLocationFormat
   * @memberof ParcelService
   */
  static getLocationFormat(data) {
    const { 
      locationStateId, locationState, locationLGAId, locationLGA
    } = data;
    return locationStateId && locationLGAId
      ? { 
          locationStateId, 
          state: locationState, 
          locationLGAId, 
          lga: locationLGA
        }
      : null;
  }

  /**
   * Get messages
   *
   * @static
   * @param {string} status the new delivery status
   * @returns {object} object containing messages as properties
   * @method getMessages
   * @memberof ParcelService
   */
  static getMessages(status) {
    return {
      cancel: 'Parcel delivery order successfully cancelled',
      destination: 'Parcel destination successfully updated',
      location: 'Present location successfully updated',
      deliverystatus: `Delivery status successfully updated to ${status}`,
      parcel: 'Parcel details successfully updated',
      pickup: 'Pick up details successfully updated',
      receiver: 'Receiver details successfully updated'
    };
  }

  /**
   * Format parcel details as object properties
   *
   * @static
   * @param {object} data
   * @returns {object} object
   * @method getParcelFormat
   * @memberof ParcelService
   */
  static getParcelFormat(data) {
    return {
      parcelId: data.parcelId,
      weight: data.weight,
      description: data.description,
      deliveryMethod: data.deliveryMethod,
      deliveryStatus: data.deliveryStatus,
      trackingNo: data.trackingNo,
      price: data.price,
      sentOn: data.sentOn,
      deliveredOn: data.deliveredOn,
      userId: data.userId
    };
  }

   /**
   * Get destination updates
   *
   * @static
   * @param {object} fields new updates from request object
   * @returns {object} object containing new destiation details as properties
   * @method getDestinationUpdates
   * @memberof ParcelService
   */
  static getDestinationUpdates(fields) {
    const { destinationAddress, destinationLGAId, destinationStateId } = fields;
    return {
      destinationAddress, destinationLGAId, destinationStateId
    };
  }

  /**
   * Get parcel details updates
   *
   * @static
   * @param {object} fields new updates from request object
   * @returns {object} object containing new destiation details as properties
   * @method getParcelDetailsUpdates
   * @memberof ParcelService
   */
  static getParcelUpdates(fields) {
    const { weight, description, deliveryMethod } = fields;
    return {
      weight, description, deliveryMethod, price: this.computePrice(weight)
    };
  }

  /**
   * Format pick up details as object properties
   *
   * @static
   * @param {object} data
   * @returns {object} object
   * @method getPickUpFormat
   * @memberof ParcelService
   */
  static getPickUpFormat(data) {
    const {
      pickUpAddress, pickUpLGAId, pickUpStateId, sender,
      pickUpLGA, pickUpState
    } = data;
    return {
      address: pickUpAddress,
      lgaId: pickUpLGAId,
      lga: pickUpLGA,
      stateId: pickUpStateId,
      state: pickUpState,
      sender: sender || {
        name: data.name, 
        email: data.email, 
        phoneNumber: data.phoneNumber
      }
    };
  }

  /**
   * Get present location updates
   *
   * @static
   * @param {object} fields new update from request object
   * @returns {object} object containing new location as properties
   * @method getLocationUpdates
   * @memberof ParcelService
   */
  static getLocationUpdates(fields) {
    return {
      locationLGAId: fields.locationLGAId,
      locationStateId: fields.locationStateId
    };
  }

  /**
   * Get Delivery status updates
   *
   * @static
   * @param {object} fields new updates from request object
   * @returns {object} object containing new details as properties
   * @method getpickUpUpdates
   * @memberof ParcelService
   */
  static getPickUpUpdates(fields) {
    const {
      pickUpAddress, pickUpLGAId, pickUpStateId, pickUpDate
    } = fields;
    return {
      pickUpAddress, pickUpLGAId, pickUpStateId, pickUpDate
    };
  }

  /**
   * Get receiver details updates
   *
   * @static
   * @param {object} fields new updates from request object
   * @returns {object} object containing new details as properties
   * @method getReceiverpUpdates
   * @memberof ParcelService
   */
  static getReceiverUpdates(fields) {
    return {
      receiverName: fields.receiverName,
      receiverPhone: fields.receiverPhone
    };
  }

  /**
   * Get Delivery status updates
   *
   * @static
   * @param {object} fields new updates from request object
   * @param {object} parcel parcel to update
   * @param {string} update specify the update operation
   * @returns {object} object containing new details as properties
   * @method getStatusUpdates
   * @memberof ParcelService
   */
  static getStatusUpdates(fields, parcel, update) {
    const { deliveryStatus } = fields;
    return update === 'cancel'
      ? { deliveryStatus: 'Cancelled' }
      : {
        sentOn: deliveryStatus === 'Transiting' ? new Date() : parcel.sentOn,
        deliveredOn: deliveryStatus === 'Delivered' ? new Date() : parcel.deliveredOn,
        deliveryStatus
      };
  }

  /**
   *
   *
   * @static
   * @param {object} options
   * @param {object} parcel 
   * @returns {object} object containing update values and options
   * @memberof ParcelService
   */
  static getUpdates(options, parcel) {
    let values;
    const { fields, update } = options;
    // eslint-disable-next-line default-case
    switch (update) {
      case 'delivery-status':
      case 'cancel': values = this.getStatusUpdates(fields, parcel, update);
        break;
      case 'location': values = this.getLocationUpdates(fields);
        break;
      case 'destination': values = this.getDestinationUpdates(fields);
        break;
      case 'parcel': values = this.getParcelUpdates(fields);
        break;
      case 'pick-up': values = this.getPickUpUpdates(fields);
        break;
      case 'receiver': values = this.getReceiverUpdates(fields);
    }
    // Remember options.values contains user id, parcel id and isAdmin
    return { update, values: { ...options.values, ...values } };
  }

  /**
	 *
	 *
	 * @static
	 * @param {object} options
	 * @returns {object} object
	 * @method mapFieldsToKeys
	 * @memberof ParcelService
	 */
	static mapFieldsToKeys(options) {
		const { pickUpStateId, destinationStateId, locationStateId } = options;
		return {
			'pick-up-state': { stateId: pickUpStateId },
			'destination-state': { stateId: destinationStateId },
			'location-state': { stateId: locationStateId },
			'pick-up-lga': { stateId: pickUpStateId, lgaId: options.pickUpLGAId },
			'destination-lga': { stateId: destinationStateId, lgaId: options.destinationLGAId },
			'location-lga': { stateId: locationStateId, lgaId: options.locationLGAId }
		};
	}

  /**
   * Update parcel
   *
   * @static
   * @param {options} options
   * @returns {object} object with statusCode, message and parcel details as properties
   * @method updateParcel
   * @memberof ParcelService
   */
  static updateParcel(options) {
    const { decoded, ...fields } = options.requestBody;
    const { update, parcelId } = options, { userId, isAdmin } = decoded;
    return this.findParcel({ userId, isAdmin, parcelId }).then((data) => {
      if (!data) return { statusCode: 404, message: 'No delivery order found' };
      const error = this.checkStatus(data, fields.deliveryStatus, update);
      if (error.hasError) return { statusCode: 403, message: error.messageBag };

      // Notice we get the id of the user who creatd the found parcel 
      // The goal is to optimize database operation by updating with user and parcel id
      options = { update, fields, values: { userId: data.userId, parcelId, isAdmin } };
      return db.sqlQuery(ParcelSQLService.updateParcel(this.getUpdates(options, data)))
        .then((result) => {
          const parcel = result.rows[0], sender = data.sender;
          if (['delivery-status', 'location'].includes(options.update)) {
            this.dispatchEmail(this.getEmailPayload(sender, parcel, options.update));
          }
          return { 
            statusCode: 200, 
            message: this.getMessages(parcel.deliveryStatus)[update.replace(/[-]+/g, '')],
            data: { parcel: this.formatParcel({ ...parcel, sender }) } 
          };
        });
    });
  }

  /**
   * Get the delivery status update error message if update is not allowed
   *
   * @static
   * @param {object} options
   * @returns {string} the error mesage
   * @method getStatusErrorMessage
   * @memberof ParcelService
   */
  static getStatusErrorMessage(options) {
    const {
      parcel, newStatus, update, str
    } = options;
    const oldStatus = parcel.deliveryStatus;
    const status = ['Cancelled', 'Delivered', 'Transiting'];
    const hasLocation = !!(parcel.locationLGAId && parcel.locationStateId);
    switch (update) {
      case 'cancel': if ([status[1], status[2]].includes(oldStatus)) {
        options.msg += `${str.replace(':text', '').trim()}`;
      } else if (oldStatus === status[0]) {
        options.msg = 'Parcel delivery order is already cancelled';
      }
        break;
      default: if (status[0].includes(oldStatus)) {
        options.msg += `${str.replace(':text', update.replace(/[-]+/g, ' ')).trim()}`;
      } else if (oldStatus === status[1] || (oldStatus === status[2] && newStatus === status[2])) {
        options.msg = `Delivery status is already updated to ${oldStatus}`;
      } else if (!hasLocation && newStatus === status[1]) {
        options.msg = `Parcel not yet transiting, cannot update status to ${status[1]}`;
      } else if (!hasLocation) {
        options.msg = 'No record of present location found, status cannot be updated';
      }
    }
    return options.msg;
  }

  /**
   * Get the pickup and destination lga and state
   *
   * @static
   * @param {options} options
   * @method fetchPlaces
   * @returns {Promise} a promise
   * @memberof PlacesService
   */
	static fetchPlaces(options) {
		return db.sqlQuery(ParcelSQLService.fetchPlaces(options))
			.then(result => result.rows[0]);
	}

	/**
	 *
	 *
	 * @static
	 * @param {object} options
	 * @returns {Promise} a promise
	 * @memberof ParcelService
	 */
	static fetchPlace(options) {
		return db.sqlQuery(ParcelSQLService.fetchPlace(options))
			.then(result => result.rows[0]);
	}
	
	/**
	 * Find a place
	 *
	 * @static
	 * @param {object} options
	 * @returns {Promise} a promise
	 * @memberof ParcelService
	 */
	static findPlace(options) {
		return this.fetchPlace(this.mapFieldsToKeys(options)[options.text])
			.then((result) => {	
				let text = this.ucFirstStr(options.text.replace(/[-]+/g, ' '));
				const message = `${text.replace('lga', 'Local Government Area')} does not exist`;
				return result || { statusCode: 404, message };
			});
	}
}