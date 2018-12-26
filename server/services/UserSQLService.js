/* eslint-disable max-len */
/* eslint-disable default-case */
/* eslint-disable no-case-declarations */
/**
 *
 * 
 * @export
 * @class SQLService
 */
export default class UserSQLService {
	/**
	 * Create Insert user sql query object 
	 *
	 * @static
	 * @param {array} values
	 * @returns {object} the query object
	 * @memberof SQLService
	 */
	static insertUser(values) {
		return {
			text: `INSERT INTO users (email, firstname, lastname, password, createdat, updatedat) 
			 VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
			values
		};
	}

	/**
	 * Cretate find a single user query object
	 *
	 * @static
	 * @param {object} data
	 * @returns {object} the query object
	 * @memberof SQLService
	 */
	static findUserBy(data) {
		const key = Object.keys(data)[0];
		return {
			text: `SELECT * FROM users WHERE ${key} = $1`,
			values: [data[key]]
		};
	}

	/**
	 * Create edit user sql query object
	 *
	 * @static
	 * @param {object} options
	 * @returns {object} the query object 
	 * @memberof SQLService
	 */
	static editUser(options) {
		switch (options.key) {
			case 'name': return {
				text: `UPDATE users SET firstname = $1, lastname = $2, updatedat = $3
								WHERE userid = $4 RETURNING *`,
				values: [
					options.values.firstname, options.values.lastname,
					new Date(),
					options.values.decoded.userid
				]
			};
			case 'phoneNumber': return {
				text: `UPDATE users SET phonenumber = $1, updatedat = $2
							 WHERE userid = $3 RETURNING *`,
				values: [options.values.phoneNumber, new Date(), options.values.decoded.userid]
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
	 * @memberof SQLService
	 */
	static findUser(credentials) {
		const { userid, email, isadmin } = credentials;
		return {
			text: `SELECT * FROM users WHERE userid = $1 AND email = $2 AND isadmin = $3 LIMIT 1`,
			values: [userid, email, isadmin]
		};
	}

	/**
	 *	Create fetch user profile details query object
	 *
	 * @static
	 * @param {int} userId user id
	 * @returns {object} the query object
	 * @memberof SQLService
	 */
	static getProfile(userId) {
		const count = 'SELECT COUNT(parcelid) AS';
		const from = 'FROM parcels WHERE deliverystatus';
		return {
			text: `WITH placedT AS (${count} placed ${from} = $2 AND userid = $1),
							cancelledT AS (${count} cancelled ${from} = $3 AND userid = $1),
							deliveredT AS (${count} delivered ${from} = $4 AND userid = $1),
							transitingT AS (${count} transiting ${from} = $5 AND userid = $1),
							totalT AS (SELECT SUM(cancelled + delivered + placed + transiting) AS total
								FROM cancelledT 
								JOIN deliveredT ON delivered IS NOT NULL
								JOIN placedT ON placed IS NOT NULL
								JOIN transitingT ON transiting IS NOT NULL
							)
							SELECT * FROM users 
							JOIN placedT ON userid = $1
							JOIN cancelledT ON userid = $1 
							JOIN deliveredT ON userid = $1
							JOIN transitingT ON userid = $1
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
	 * @memberof SQLService
	 */
	static updatePassword(options) {
		const { password, userid, email } = options.values;
		return {
			text: `UPDATE users SET password = $1, updatedat =$2 
						WHERE ${options.isAuthenticated ? 'userid' : 'email'} = $3 RETURNING *`,
			values: [
				password, new Date(), options.isAuthenticated ? userid : email
			]
		};
	}
}
