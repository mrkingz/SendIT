/* eslint-disable max-len */
/* eslint-disable default-case */
/* eslint-disable no-case-declarations */
/**
 *
 * 
 * @export
 * @class SQLService
 */
export default class UserQuery {
	/**
	 * Create insert user sql query object 
	 *
	 * @static
	 * @param {array} values
	 * @returns {object} the query object
	 * @memberof UserQuery
	 */
	static insertUser(values) {
		return {
			text: `INSERT INTO users ("email", "firstname", "lastname", "password", 
				  "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
			values
		};
	}

	/**
	 * Cretate find a single user query object
	 *
	 * @static
	 * @param {object} data
	 * @returns {object} the query object
	 * @memberof UserQuery
	 */
	static findUserBy(data) {
		const key = Object.keys(data)[0];
		return {
			text: `SELECT * FROM users WHERE "${key}" = $1`,
			values: [data[key]]
		};
	}

	/**
	 * Create edit user sql query object
	 *
	 * @static
	 * @param {object} options
	 * @returns {object} the query object 
	 * @memberof UserQuery
	 */
	static editUser(options) {
		switch (options.key) {
			case 'name': return {
				text: `UPDATE users SET "firstname" = $1, "lastname" = $2, "updatedAt" = $3
								WHERE "userId" = $4 RETURNING *`,
				values: [
					options.values.firstname, options.values.lastname,
					new Date(),
					options.values.decoded.userId
				]
			};
			case 'phone': return {
				text: `UPDATE users SET "phoneNumber" = $1, "updatedAt" = $2
							 WHERE userId = $3 RETURNING *`,
				values: [options.values.phoneNumber, new Date(), options.values.decoded.userId]
			};
			case 'photo': return {
				text: `UPDATE users SET "photoURL" = $1, "updatedAt" = $2 WHERE "userId" = $3 RETURNING *`,
				values: [options.values.photoURL, new Date(), 1]
			};
		}
	}

	/**
	 * Create select user query object
	 *
	 * @static
	 * @param {object} credentials
	 * @returns {object} the query object
	 * @method findUser
	 * @memberof UserQuery
	 */
	static findUser(credentials) {
		const { userId, email, isAdmin } = credentials;
		return {
			text: `SELECT * FROM users WHERE "userId" = $1 
				  AND "email" = $2 AND "isAdmin" = $3 LIMIT 1`,
			values: [userId, email, isAdmin]
		};
	}

	/**
	 *	Create fetch user profile details query object
	 *
	 * @static
	 * @param {int} userId user id
	 * @returns {object} the query object
	 * @memberof UserQuery
	 */
	static getProfile(userId) {
		const count = 'SELECT COUNT("parcelId") AS';
		const from = 'FROM parcels WHERE "deliveryStatus"';
		return {
			text: `WITH placedT AS (${count} placed ${from} = $2 AND "userId" = $1),
							cancelledT AS (${count} cancelled ${from} = $3 AND "userId" = $1),
							deliveredT AS (${count} delivered ${from} = $4 AND "userId" = $1),
							transitingT AS (${count} transiting ${from} = $5 AND "userId" = $1),
							totalT AS (SELECT SUM(cancelled + delivered + placed + transiting) AS total
								FROM cancelledT 
								JOIN deliveredT ON delivered IS NOT NULL
								JOIN placedT ON placed IS NOT NULL
								JOIN transitingT ON transiting IS NOT NULL
							)
							SELECT * FROM users 
							JOIN placedT ON "userId" = $1
							JOIN cancelledT ON "userId" = $1 
							JOIN deliveredT ON "userId" = $1
							JOIN transitingT ON "userId" = $1
							JOIN totalT ON totalT IS NOT NULL LIMIT 1`,
			values: [userId, 'Placed', 'Cancelled', 'Delivered', 'Transiting']
		};
	}

	/**
	 * Create query object to update user password
	 *
	 * @static
	 * @param {object} options
	 * @returns {object} the query object
	 * @method updatePassword
	 * @memberof UserQuery
	 */
	static updatePassword(options) {
		const { password, userId, email } = options.values;
		return {
			text: `UPDATE users SET "password" = $1, "updatedAt" =$2 
						WHERE ${options.isAuthenticated ? '"userId"' : "email"} = $3 RETURNING *`,
			values: [
				password, new Date(), options.isAuthenticated ? userId : email
			]
		};
	}
}
