/* eslint-disable default-case */
/**
 *
 *
 * @export
 * @class ParcelSQLService
 */
export default class ParcelSQLService {
  /**
   * Create insert parcel sql query object 
   *
   * @static
   * @param {array} values
   * @returns {object} the query object
   * @method insertParcel
   * @memberof ParcelSQLService
   */
  static insertParcel(values) { //console.log(values)
    return {
      text: `INSERT INTO parcels (
              "weight", "description", "deliveryMethod", "pickUpAddress", "pickUpLGAId", 
              "pickUpStateId", "pickUpDate", "destinationAddress", "destinationLGAId",
              "destinationStateId", "trackingNo","price", "userId", "receiverName", 
              "receiverPhone", "createdAt", "updatedAt") VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
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
   * @memberof ParcelSQLService
   */
  static selectParcels(options = {}) {
    const { filter, userId, isUserParcels } = options;
    const select = `SELECT parcels.*, CONCAT(firstname, (' '||lastname)) AS name, email, "phoneNumber"
                    FROM parcels JOIN users ON parcels."userId" = users."userId"`;
    if (filter) {
      return {
        text: `${select} WHERE "deliveryStatus" = $1 ${isUserParcels ? ' AND parcels."userId" = $2' : ''}`,
        values: isUserParcels ? [filter, userId] : [filter]
      };
    }
    return isUserParcels
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
   * @memberof ParcelSQLService
   */
  static selectParcel(options) {
    const { parcelId, userId, isAdmin } = options;
    const query = {};
    const stateSelect = `SELECT states."stateId", states.state`;
    const lgaSelect = `SELECT lgas."lgaId", lgas."stateId", lgas.lga`;
    const fields = `"pickUpState", "pickUpLGA", "destinationState", "destinationLGA",
                    "locationLGA", "locationState"`;
    const joins = `JOIN pickUpStateT ON pickUpStateT."stateId" = parcels."pickUpStateId"
                   JOIN pickUpLGAT ON pickUpLGAT."lgaId" = parcels."pickUpLGAId" 
                   JOIN destinationStateT ON destinationStateT."stateId" = parcels."destinationStateId"
                   JOIN destinationLGAT ON destinationLGAT."lgaId" = parcels."destinationLGAId"
                   JOIN locationStateT ON locationStateT IS NOT NULL
                   JOIN locationLGAT ON locationLGAT IS NOT NULL`;
    query.text = `WITH pickUpStateT AS (${stateSelect} AS "pickUpState" FROM states),
                  pickUpLGAT AS (${lgaSelect} AS "pickUpLGA" FROM lgas),
                  destinationStateT AS (${stateSelect} AS "destinationState" FROM states),
                  destinationLGAT AS (${lgaSelect} AS "destinationLGA" FROM lgas),
                  locationStateT AS (${stateSelect} AS "locationState" FROM states),
                  locationLGAT AS (${lgaSelect} AS "locationLGA" FROM lgas)`;
    if (isAdmin) {
      query.text += `SELECT DISTINCT parcels.*, CONCAT(firstname, (' '||lastname)) AS name, 
                    email, "phoneNumber", ${fields} FROM parcels JOIN users 
                    ON parcels."userId" = users."userId"  ${joins} 
                    WHERE parcels."parcelId" = $1 LIMIT 1`;
    } else {
      query.text += `SELECT DISTINCT parcels.*, ${fields} FROM parcels ${joins} 
        AND parcels."parcelId" = $1 AND users."userId" = $2 LIMIT 1`;
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
   * @memberof ParcelSQLService
   */
  static updateParcel(options) {
    const defaults = [new Date(), options.values.parcelId, options.values.userId];
    const start = `UPDATE parcels SET "updatedAt" = $1`;
    const end = `WHERE "parcelId" = $2 AND "userId" = $3 RETURNING *`;
    const obj = { 
      start, end, values: options.values, defaults 
    };
    switch (options.update) {
      case 'cancel': 
      case 'delivery-status': return this.getStatusUpdateQuery(obj);
      case 'location': return this.getLocationUpdateQuery(obj);
      case 'destination': return this.getDestinationUpdateQuery(obj);
      case 'parcel': return this.getParcelUpdateQuery(obj);
      case 'pick-up': return this.getPickupUpdateQuery(obj);
      case 'receiver': return this.getReceiverUpdateQuery(obj);
    }
  }

  /**
   * Create pick up details update query object
   *
   * @static
   * @param {object} obj
   * @returns {object} the query object
   * @method getReceiverUpdateQuery
   * @memberof ParcelSQLService
   */
  static getReceiverUpdateQuery(obj) {
    const { 
      start, end, values, defaults
    } = obj;
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
   * @memberof ParcelSQLService
   */
  static getPickupUpdateQuery(obj) {
    const { 
      start, end, values, defaults
    } = obj;
    const {
      pickUpAddress, pickUpLGAId, pickUpStateId, pickUpDate 
    } = values;
    return {
      text: `${start}, "pickUpAddress" = $4, "pickUpLGAId" = $5, 
            "pickUpStateId" = $6, "pickUpDate" = $7 ${end}`,
      values: [...defaults, pickUpAddress, pickUpLGAId, pickUpStateId, pickUpDate]
    };
  }

  /**
   * Create parcel details update query object
   *
   * @static
   * @param {object} obj
   * @returns {object} the query object
   * @method getLocationUpdateQuery
   * @memberof ParcelSQLService
   */
  static getLocationUpdateQuery(obj) {
    const { 
      start, end, values, defaults
    } = obj;
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
   * @memberof ParcelSQLService
   */
  static getDestinationUpdateQuery(obj) {
    const { 
      start, end, values, defaults
    } = obj;
    const { 
      destinationAddress, destinationLGAId, destinationStateId
    } = values;
    return {
      text: `${start}, "destinationAddress" = $4, "destinationLGAId" = $5,
            "destinationStateId" = $6 ${end}`,
      values: [...defaults, destinationAddress, destinationLGAId, destinationStateId]
    };
  }

  /**
   * Create delivery status update query object
   *
   * @static
   * @param {object} obj
   * @returns {object} the query object
   * @method getStatusUpdateQuery
   * @memberof ParcelSQLService
   */
  static getStatusUpdateQuery(obj) {
    const { 
      start, end, values, defaults
    } = obj;
    const { 
      deliveryStatus, sentOn, deliveredOn 
    } = values;
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
   * @memberof ParcelSQLService
   */
  static getParcelUpdateQuery(obj) {
    const { 
      start, end, values, defaults
    } = obj;
    const { 
      weight, description, deliveryMethod, price 
    } = values;
    return { 
      text: `${start}, "weight" = $4, "description" = $5, "deliveryMethod" = $6,
            "price" = $7 ${end}`,
      values: [
        ...defaults, weight, description === '' ? null : description, deliveryMethod, price
      ]
    }; 
  }

  /**
   * Count delivery orders in the system
   *
   * @static
   * @returns {object} the query object
   * @method selectCounts
   * @memberof ParcelSQLService
   */
  static selectCounts() {
    const select = `SELECT COUNT("parcelId") AS`;
    const from = `FROM parcels WHERE "deliveryStatus"`;
    return {
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
      values: ['Cancelled', 'Delivered', 'Placed', 'Transiting']
    };
  }

  /**
   *
   *
   * @static
   * @param {object} options
   * @returns {object} the query object
   * @method fetchPlace
   * @memberof ParcelSQLService
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
}