/* eslint-disable no-case-declarations */
/* eslint-disable default-case */
/* eslint-disable no-fallthrough */
import moment from "moment";
import db from "../database";
import UtilityService from "./UtilityService";
import ParcelQuery from "../database/queries/parcelQuery";
import NotificationService from "./NotificationService";

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
    const message = msg,
      str = ":text cannot be updated";
    const status = ["Cancelled", "Delivered", "Placed", "Transiting"];
    switch (this.toCammelCase(update)) {
      case "deliveryStatus":
      case "cancel":
        msg = this.getStatusErrorMessage({
          parcel,
          newStatus,
          update,
          msg,
          str
        });
        break;
      case "destination":
      case "location":
        if ([status[0], status[1]].includes(oldStatus)) {
          msg += `${str.replace(":text", update).trim()}`;
        }
        break;
      default:
        if (oldStatus !== "Placed") {
          msg += `${str.replace(":text", "").trim()}`;
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
    return Number(weight) * 1000 * Number(distance);
  }

  /**
   * Get the total numbers of orders in the system
   *
   * @static
   * @param {int} userId
   * @returns {object} object containing the breakdown of total orders as properties
   * @memberof ParcelService
   */
  static countOrders(userId) {
    return db.sqlQuery(ParcelQuery.selectCounts(userId)).then(result => {
      return !result.rows[0]
        ? { statusCode: 404, message: "No delivery order found" }
        : {
            statusCode: 200,
            message: "Total parcel delivery orders",
            count: result.rows[0]
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
    const date = new Date(),
      {
        weight,
        description,
        deliveryMethod,
        pickUpAddress,
        pickUpLGAId,
        pickUpStateId,
        destinationAddress,
        destinationLGAId,
        destinationStateId,
        receiverName,
        receiverPhone,
        decoded
      } = data;
    const trackingNo = date.getTime();
    const values = [
      weight,
      description,
      deliveryMethod,
      this.ucFirstStr(pickUpAddress, { bool: true }),
      pickUpLGAId,
      pickUpStateId,
      this.ucFirstStr(destinationAddress, { bool: true }),
      destinationLGAId,
      destinationStateId,
      trackingNo,
      this.computePrice(weight),
      decoded.userId,
      this.ucFirstStr(receiverName, { bool: true }),
      receiverPhone,
      date,
      date
    ];
    return db.sqlQuery(ParcelQuery.insertParcel(values)).then(result => {
      const parcel = result.rows[0];
      const { email, firstname, lastname } = decoded;
      const sender = { name: `${firstname} ${lastname}`, email };
      this.dispatchEmail(this.getEmailPayload(sender, parcel));
      return {
        statusCode: 201,
        message: "Delivery order successfully created",
        parcel: this.formatParcel({ ...parcel, sender })
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
   *
   *
   * @static
   * @param {*} stateId
   * @param {*} lgaId
   * @memberof ParcelService
   */
  static getPresentLocation(stateId, lgaId) {
    db.sqlQuery(ParcelQuery.fetchPlace({ stateId, lgaId })).then(
      result => result.rows[0]
    );
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
    return db.sqlQuery(ParcelQuery.selectParcels(options)).then(result => {
      const parcels = result.rows;
      const { filter } = options;
      return !parcels[0]
        ? {
            statusCode: 404,
            message: filter
              ? `No ${filter.toLowerCase()} delivery order found`
              : "No delivery order found"
          }
        : {
            statusCode: 302,
            message: filter
              ? `${filter} parcels successfully retrieved`
              : "Parcels successfully retrieved",
            parcels: parcels.map(parcel => this.formatParcel(parcel))
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
    return this.findParcel(options).then(parcel => {
      return parcel
        ? {
            statusCode: 302,
            message: "Parcel successfully retrieved",
            parcel: this.formatParcel(parcel)
          }
        : { statusCode: 404, message: "No delivery order found" };
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
    return db.sqlQuery(ParcelQuery.selectParcel(options)).then(result => {
      const parcel = result.rows[0];
      if (parcel) {
        const { name, email, phoneNumber, ...details } = parcel || {};
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
    const { createdAt, updatedAt, ...details } = parcel;
    return {
      ...this.getParcelFormat(details),
      presentLocation: this.getLocationFormat(details),
      from: this.getPickUpFormat(details),
      to: this.getDestinationFormat(details),
      createdAt: moment(createdAt).format("MMM Do, YYYY h:s A"),
      updatedAt: moment(updatedAt).format("MMM Do, YYYY h:s A")
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
      destinationAddress,
      destinationLGA,
      destinationLGAId,
      destinationState,
      destinationStateId,
      receiverName,
      receiverPhone
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
      // eslint-disable-next-line no-case-declarations
      case "location":
        let loc,
          string = `Your parcel with tracking number:`;
        loc = `${parcel.locationLGA}, ${parcel.locationState}`;
        message = `<p>${string}<b>${
          parcel.trackingNo
        }</b>is currently at ${loc}</p>`;
        break;
      case "deliveryStatus":
        str =
          parcel.deliveryStatus === "Transiting"
            ? " is now ".concat(parcel.deliveryStatus.toLowerCase())
            : " was successfully ".concat(parcel.deliveryStatus.toLowerCase());
        message = `<p>Your parcel with tracking number:<b> ${
          parcel.trackingNo
        }</b>${str}</p>`;
      default:
        message = `<p>Your delivery order was successfully placed</p>
        <p>Below is your order details:</p>
        <p><b>Weight:</b> ${parcel.weight} kgs<br>
        <b>Description:</b> ${
          parcel.description ? parcel.description : "N/A"
        }<br>
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
    const { locationStateId, locationState, locationLGAId, locationLGA } = data;
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
      cancel: "Parcel delivery order successfully cancelled",
      destination: "Parcel destination successfully updated",
      location: "Present location successfully updated",
      deliveryStatus: `Delivery status successfully updated to ${status}`,
      parcel: "Parcel details successfully updated",
      pickUp: "Pick up details successfully updated",
      receiver: "Receiver details successfully updated"
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
      sentOn: data.sentOn ? moment(data.sentOn).format("MMMM Do, YYYY") : null,
      deliveredOn: data.deliveredOn
        ? moment(data.deliveredOn).format("MMMM Do, YYYY")
        : null,
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
      destinationAddress,
      destinationLGAId,
      destinationStateId
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
      weight,
      description,
      deliveryMethod,
      price: this.computePrice(weight)
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
      pickUpAddress,
      pickUpLGAId,
      pickUpStateId,
      sender,
      pickUpLGA,
      pickUpState
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
    const { pickUpAddress, pickUpLGAId, pickUpStateId } = fields;
    return {
      pickUpAddress,
      pickUpLGAId,
      pickUpStateId
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
   *
   * @param {object} options
   * @static
   * @returns {Promise} a promise
   * @memberof ParcelService
   */
  static getAreas(options) {
    const { stateId, lgaId } = options;
    return db
      .sqlQuery(ParcelQuery.fetchPlace({ stateId, lgaId }))
      .then(result => {
        const area = result.rows[0];
        return area
          ? {
              statusCode: 302,
              message: "State and L.G.A. successfully retreived",
              area
            }
          : {
              statusCode: 404,
              message: "State and L.G.A combination does not exist"
            };
      });
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
    return update === "cancel"
      ? { deliveryStatus: "Cancelled" }
      : {
          sentOn: deliveryStatus === "Transiting" ? new Date() : parcel.sentOn,
          deliveredOn:
            deliveryStatus === "Delivered" ? new Date() : parcel.deliveredOn,
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
    switch (this.toCammelCase(update)) {
      case "deliveryStatus":
      case "cancel":
        values = this.getStatusUpdates(fields, parcel, update);
        break;
      case "location":
        values = this.getLocationUpdates(fields);
        break;
      case "destination":
        values = this.getDestinationUpdates(fields);
        break;
      case "parcel":
        values = this.getParcelUpdates(fields);
        break;
      case "pickUp":
        values = this.getPickUpUpdates(fields);
        break;
      case "receiver":
        values = this.getReceiverUpdates(fields);
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
      pickUpState: { stateId: pickUpStateId },
      destinationState: { stateId: destinationStateId },
      locationState: { stateId: locationStateId },
      pickUpLga: { stateId: pickUpStateId, lgaId: options.pickUpLGAId },
      destinationLga: {
        stateId: destinationStateId,
        lgaId: options.destinationLGAId
      },
      locationLga: { stateId: locationStateId, lgaId: options.locationLGAId }
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
    let { update, parcelId } = options,
      { userId, isAdmin } = decoded;
    return this.findParcel({ userId, isAdmin, parcelId }).then(data => {
      if (!data) return { statusCode: 404, message: "No delivery order found" };
      const error = this.checkStatus(data, fields.deliveryStatus, update);
      if (error.hasError) return { statusCode: 403, message: error.messageBag };
      // Notice we get the id of the user who creatd the found parcel
      // The goal is to optimize database operation by updating with user and parcel id
      options = {
        update,
        fields,
        values: { userId: data.userId, parcelId, isAdmin }
      };
      return db
        .sqlQuery(ParcelQuery.updateParcel(this.getUpdates(options, data)))
        .then(result => {
          const parcel = result.rows[0],
            sender = data.sender;
          update = this.toCammelCase(update);
          if (update === "deliveryStatus") {
            this.dispatchEmail(this.getEmailPayload(sender, parcel, update));
          } else if (update === "location") {
            parcel.locationLGA = fields.location.lga;
            parcel.locationState = fields.location.state;
            this.dispatchEmail(this.getEmailPayload(sender, parcel, update));
          }
          return {
            statusCode: 200,
            message: this.getMessages(parcel.deliveryStatus)[update],
            parcel: this.formatParcel({ ...parcel, sender })
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
    const { parcel, newStatus, update, str } = options;
    const oldStatus = parcel.deliveryStatus;
    const status = ["Cancelled", "Delivered", "Transiting"];
    const hasLocation = !!(parcel.locationLGAId && parcel.locationStateId);
    switch (update) {
      case "cancel":
        if ([status[1], status[2]].includes(oldStatus)) {
          options.msg += `${str.replace(":text", "").trim()}`;
        } else if (oldStatus === status[0]) {
          options.msg = "Parcel delivery order is already cancelled";
        }
        break;
      default:
        if (status[0].includes(oldStatus)) {
          options.msg += `${str
            .replace(":text", update.replace(/[-]+/g, " "))
            .trim()}`;
        } else if (
          oldStatus === status[1] ||
          (oldStatus === status[2] && newStatus === status[2])
        ) {
          options.msg = `Delivery status is already updated to ${oldStatus}`;
        } else if (
          hasLocation &&
          oldStatus === "Placed" &&
          newStatus === status[1]
        ) {
          options.msg = `Parcel not yet transiting, cannot update status to ${
            status[1]
          }`;
        } else if (!hasLocation) {
          options.msg = `No record of present location found, cannot update status to ${
            status[2]
          }`;
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
    return db.sqlQuery(ParcelQuery.fetchPlaces(options)).then(result => {
      const states = result.rows;
      return states[0]
        ? {
            statusCode: 302,
            message: `${options.text} retrieved successfully`,
            [options.text === "States" ? "states" : "lgas"]: states
          }
        : { statusCode: 404, message: "No state found" };
    });
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
    return db
      .sqlQuery(ParcelQuery.fetchPlace(options))
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
    return this.fetchPlace(
      this.mapFieldsToKeys(options)[this.toCammelCase(options.text)]
    ).then(result => {
      let text = this.ucFirstStr(options.text.replace(/[-]+/g, " "));
      const message = `${text.replace(
        "lga",
        "Local Government Area"
      )} does not exist`;
      return result || { statusCode: 404, message };
    });
  }
}
