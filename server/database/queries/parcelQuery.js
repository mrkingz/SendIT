/* eslint-disable default-case */
/**
 *
 *
 * @export
 * @class ParcelSQLService
 */
export default class ParcelQuery {
  /**
   * Create insert parcel sql query object
   *
   * @static
   * @param {array} values
   * @returns {object} the query object
   * @method insertParcel
   * @memberof ParcelQuery
   */
  static insertParcel(values) {
    return {
      text: `INSERT INTO parcels (
                "weight", "description", "deliveryMethod", "pickUpAddress", "pickUpLGAId", 
                "pickUpStateId", "destinationAddress", "destinationLGAId",
                "destinationStateId", "trackingNo","price", "userId", "receiverName", 
                "receiverPhone", "createdAt", "updatedAt") VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
              ) RETURNING *`,
      values
    };
  }

  /**
   * Create select all parcel query object
   *
   * @static
   * @param {object} options
   * @returns {object} the query object
   * @method getParcels
   * @memberof ParcelQuery
   */
  static selectParcels(options = {}) {
    const { filter, userId, isUserParcels } = options;
    const select = `SELECT parcels.*, CONCAT(firstname, (' '||lastname)) AS name, email, "phoneNumber"
                      FROM parcels JOIN users ON parcels."userId" = users."userId"`;
    if (filter) {
      return {
        text: `${select} WHERE "deliveryStatus" = $1 ${
          isUserParcels ? ' AND parcels."userId" = $2' : ""
        }`,
        values: isUserParcels ? [filter, userId] : [filter]
      };
    }
    return !isUserParcels
      ? { text: select }
      : {
          text: `${select} WHERE parcels."userId" = $1`,
          values: [userId]
        };
  }

  /**
   * Create select a single parcel query object
   *
   * @static
   * @param {object} options
   * @returns {object} the query object
   * @memberof ParcelQuery
   */
  static selectParcel(options) {
    const { parcelId, userId, isAdmin } = options;
    const query = {};
    const stateSelect = `SELECT states."stateId", states.state`;
    const lgaSelect = `SELECT lgas."lgaId", lgas."stateId", lgas.lga`;
    query.text = `WITH pickUpStateT AS (${stateSelect} AS "pickUpState" FROM states),
                    pickUpLGAT AS (${lgaSelect} AS "pickUpLGA" FROM lgas),
                    destinationStateT AS (${stateSelect} AS "destinationState" FROM states),
                    destinationLGAT AS (${lgaSelect} AS "destinationLGA" FROM lgas)
                    SELECT parcels.*, CONCAT(firstname, (' '||lastname)) AS name, email, "phoneNumber",
                      "pickUpState", "pickUpLGA", "destinationState", "destinationLGA", 
                    (SELECT states.state FROM states 
                      WHERE states."stateId" = parcels."locationStateId") AS "locationState",
                    (SELECT lgas.lga FROM lgas 
                      WHERE lgas."stateId" = parcels."locationStateId" 
                      AND lgas."lgaId" = parcels."locationLGAId") AS "locationLGA"
                    FROM parcels 
                    JOIN users ON users."userId" = parcels."userId"
                    JOIN pickUpStateT ON pickUpStateT."stateId" = parcels."pickUpStateId"
                    JOIN pickUpLGAT ON pickUpLGAT."lgaId" = parcels."pickUpLGAId" 
                    JOIN destinationStateT ON destinationStateT."stateId" = parcels."destinationStateId"
                    JOIN destinationLGAT ON destinationLGAT."lgaId" = parcels."destinationLGAId"
                    WHERE parcels."parcelId" = $1`;
    if (!isAdmin) {
      query.text += `AND users."userId" = $2 LIMIT 1`;
    }
    query.values = isAdmin ? [parcelId] : [parcelId, userId];
    return query;
  }

  /**
   * Create Update parcel query object
   *
   * @static
   * @param {object} options
   * @returns {object} th query object
   * @method updateParcel
   * @memberof ParcelQuery
   */
  static updateParcel(options) {
    const defaults = [
      new Date(),
      options.values.parcelId,
      options.values.userId
    ];
    const start = `UPDATE parcels SET "updatedAt" = $1`;
    const end = `WHERE "parcelId" = $2 AND "userId" = $3 RETURNING *`;
    const obj = {
      start,
      end,
      values: options.values,
      defaults
    };
    switch (options.update) {
      case "cancel":
      case "delivery-status":
        return this.getStatusUpdateQuery(obj);
      case "location":
        return this.getLocationUpdateQuery(obj);
      case "destination":
        return this.getDestinationUpdateQuery(obj);
      case "parcel":
        return this.getParcelUpdateQuery(obj);
      case "pick-up":
        return this.getPickupUpdateQuery(obj);
      case "receiver":
        return this.getReceiverUpdateQuery(obj);
    }
  }

  /**
   * Create pick up details update query object
   *
   * @static
   * @param {object} obj
   * @returns {object} the query object
   * @method getReceiverUpdateQuery
   * @memberof ParcelQuery
   */
  static getReceiverUpdateQuery(obj) {
    const { start, end, values, defaults } = obj;
    const { receiverName, receiverPhone } = values;
    return {
      text: `${start}, "receiverName" = $4, "receiverPhone" = $5 ${end}`,
      values: [...defaults, receiverName, receiverPhone]
    };
  }

  /**
   * Create pick up details update query object
   *
   * @static
   * @param {object} obj
   * @returns {object} the query object
   * @method getPickupUpdateQuery
   * @memberof ParcelQuery
   */
  static getPickupUpdateQuery(obj) {
    const { start, end, values, defaults } = obj;
    const { pickUpAddress, pickUpLGAId, pickUpStateId } = values;
    return {
      text: `${start}, "pickUpAddress" = $4, "pickUpLGAId" = $5, "pickUpStateId" = $6 ${end}`,
      values: [...defaults, pickUpAddress, pickUpLGAId, pickUpStateId]
    };
  }

  /**
   * Create parcel details update query object
   *
   * @static
   * @param {object} obj
   * @returns {object} the query object
   * @method getLocationUpdateQuery
   * @memberof ParcelQuery
   */
  static getLocationUpdateQuery(obj) {
    const { start, end, values, defaults } = obj;
    return {
      text: `${start}, "locationLGAId" = $4, "locationStateId" = $5 ${end}`,
      values: [...defaults, values.locationLGAId, values.locationStateId]
    };
  }

  /**
   * Create destination details update query object
   *
   * @static
   * @param {object} obj
   * @returns {object} the query object
   * @method getDestinationUpdateQuery
   * @memberof ParcelQuery
   */
  static getDestinationUpdateQuery(obj) {
    const { start, end, values, defaults } = obj;
    const { destinationAddress, destinationLGAId, destinationStateId } = values;
    return {
      text: `${start}, "destinationAddress" = $4, "destinationLGAId" = $5,
              "destinationStateId" = $6 ${end}`,
      values: [
        ...defaults,
        destinationAddress,
        destinationLGAId,
        destinationStateId
      ]
    };
  }

  /**
   * Create delivery status update query object
   *
   * @static
   * @param {object} obj
   * @returns {object} the query object
   * @method getStatusUpdateQuery
   * @memberof ParcelQuery
   */
  static getStatusUpdateQuery(obj) {
    const { start, end, values, defaults } = obj;
    const { deliveryStatus, sentOn, deliveredOn } = values;
    return {
      text: `${start}, "deliveryStatus" = $4, "sentOn" = $5, "deliveredOn" = $6 ${end}`,
      values: [...defaults, deliveryStatus, sentOn, deliveredOn]
    };
  }

  /**
   * Create parcel details update query object
   *
   * @static
   * @param {object} obj
   * @returns {object} the query object
   * @method getParcelUpdateQuery
   * @memberof ParcelQuery
   */
  static getParcelUpdateQuery(obj) {
    const { start, end, values, defaults } = obj;
    const { weight, description, deliveryMethod, price } = values;
    return {
      text: `${start}, "weight" = $4, "description" = $5, "deliveryMethod" = $6,
              "price" = $7 ${end}`,
      values: [
        ...defaults,
        weight,
        description === "" ? null : description,
        deliveryMethod,
        price
      ]
    };
  }

  /**
   * Count delivery orders in the system
   *
   * @static
   * @param {int} userId
   * @returns {object} the query object
   * @method selectCounts
   * @memberof ParcelQuery
   */
  static selectCounts(userId) {
    const select = `SELECT COUNT("parcelId") AS`;
    const from = `FROM parcels WHERE ${
      userId ? '"userId" = $5 AND ' : ""
    } "deliveryStatus"`;
    const query = {
      text: `WITH cancelledT AS (${select} cancelled ${from} = $1),
        deliveredT AS (${select} delivered ${from} = $2),
        placedT AS (${select} placed ${from} = $3),
        transitingT AS (${select} transiting ${from} = $4),
        totalT AS (SELECT SUM(cancelled + delivered + placed + transiting) AS total
          FROM cancelledT 
          JOIN deliveredT ON delivered IS NOT NULL
          JOIN placedT ON placed IS NOT NULL
          JOIN transitingT ON transiting IS NOT NULL
        )
        SELECT * FROM placedT
        JOIN cancelledT ON cancelled IS NOT NULL 
        JOIN deliveredT ON delivered IS NOT NULL
        JOIN transitingT ON transiting IS NOT NULL
        JOIN totalT ON total IS NOT NULL`,
      values: ["Cancelled", "Delivered", "Placed", "Transiting"]
    };
    if (userId) {
      query.values.push(userId);
      return query;
    }
    return query;
  }

  /**
   *
   *
   * @static
   * @param {object} options
   * @returns {object} the query object
   * @method fetchPlace
   * @memberof ParcelQuery
   */
  static fetchPlace(options) {
    const { stateId, lgaId } = options;
    const query = {};
    if (lgaId) {
      query.text = `SELECT states."stateId", states.state, "lgaId", lga 
                        FROM states 
                        JOIN lgas ON states."stateId" = lgas."stateId"
                        WHERE states."stateId" = $1 AND lgas."lgaId" = $2`;
      query.values = [stateId, lgaId];
    } else {
      query.text = `SELECT * FROM states WHERE "stateId" = $1`;
      query.values = [stateId];
    }
    return query;
  }

  /**
   * Fetch places
   *
   * @static
   * @param {object} options
   * @returns {object} the query object
   * @memberof ParcelQuery
   */
  static fetchPlaces(options) {
    return options.stateId
      ? {
          text: `SELECT * FROM lgas WHERE "stateId" = $1`,
          values: [options.stateId]
        }
      : { text: `SELECT * FROM states` };
  }
}
