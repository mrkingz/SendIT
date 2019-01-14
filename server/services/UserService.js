/* eslint-disable max-len */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import decode from 'jwt-decode';
import db from '../database';
import UtilityService from "./UtilityService";
import NotificationService from "./NotificationService";
import UserQuery from '../database/queries/userQuery';

/**
 *
 *
 * @export
 * @class UserService
 * @extends {UtilityService}
 */
export default class UserService extends UtilityService {
	/**
	 * Create user
	 *
	 * @static
	 * @param {object} data user data
	 * @returns {object} The user
	 * @method createUser
	 * @memberof UserService
	 */
	static createUser(data) {
		const moment = new Date();
		const { email, firstname, lastname } = data;
		const pass = bcrypt.hashSync(data.password, bcrypt.genSaltSync(10));
		const query = UserQuery.insertUser([
			email, this.ucFirstStr(firstname), this.ucFirstStr(lastname), pass, moment, moment
		]);
		return db.sqlQuery(query).then((result) => {
			const { password, ...user } = result.rows[0];
			return { statusCode: 201, message: 'Sign up was successfull', data: { user } };
		});
	}

	/**
	 * Sign in a user
	 *
	 * @static
	 * @param {string} data
	 * @returns {Promise} the response to send to client
	 * @method signinUser
	 * @memberof UserService
	 */
	static signinUser(data) {
		return db.sqlQuery(UserQuery.findUserBy({ email: data.email }))
			.then((result) => {
				if (result.rows[0] && bcrypt.compareSync(data.password, result.rows[0]['password'])) {
					const {
						password, createdAt, updatedAt, ...details
					} = result.rows[0];
					return {
						message: 'Successfully signed in',
						data: {
							user: { ...details, createdAt, updatedAt },
							token: this.generateToken(details)
						}
					};
				}
				return { statusCode: 401, message: 'Invalid sign in credentials' };
			});
	}

	/**
	 * Create edit user profile query object
	 *
	 * @static
	 * @param {object} options
	 * @returns {Promise} the response to send to client
	 * @method editUserProfile
	 * @memberof UserService
	 */
	static editUserProfile(options) {
		return db.sqlQuery(UserQuery.editUser({
			key: options.key.replace(/[-]+/g, ''), values: options.values
		})).then((result) => {
			const { password, ...user } = result.rows[0];
			const msg = `${this.ucFirstStr(options.key.replace(/[-]+/g, ' '))} successfully updated`;
			return { statusCode: 200, message: msg, data: { user } };
		});
	}

	/**
	 * Fetch user profile details
	 *
	 * @static
	 * @param {int} userId
	 * @returns {Promise} the response to send to client
	 * @method fetchUserProfile
	 * @memberof UserService
	 */
	static fetchUserProfile(userId) {
		return db.sqlQuery(UserQuery.getProfile(userId)).then((result) => {
			if (result.rows[0]) {
				const {
					password, cancelled, delivered, placed, transiting, total, ...user
				} = result.rows[0];
				user.orders = {
					cancelled, delivered, placed, transiting, total
				};
				const message = 'Profile details successfully retrieved';
				return { statusCode: 302, message, data: { user } };
			}
			return { statusCode: 404, message: 'User does not exist' };
		});
	}

	/**
	 * Find a user
	 *
	 * @static
	 * @param {object} decoded the credentials from user token
	 * @method findUser
	 * @returns {Promise} object containing user details, if found; otherwise null
	 * @memberof UserService
	 */
	static findUser(decoded) {
		const { email, userId, isAdmin } = decoded;
		return db.sqlQuery(UserQuery.findUser({ email, userId, isAdmin }))
			.then(result => result.rows[0]);
	}

	/**
 * Find a user. Usefull when finding an unauthenticate user
 *
 * @static
 * @param {object} option object containing the field name and value pair
 * @param {string} label optional text to use as field name in message
 * @method findUser
 * @returns {object} the response to send to client
 * @memberof UserService
 */
	static findBy(option, label) {
		const field = Object.keys(option);
		return db.sqlQuery(UserQuery.findUserBy(option))
			.then((result) => {
				if (result.rows[0]) {
					const message = `A user with ${label || field} was found`;
					const { password, ...user } = result.rows[0];
					return { statusCode: 302, message, data: { user } };
				}
				return {
					statusCode: 404, message: `No user with ${label || field} found`
				};
			});
	}

	/**
	 * Authenticate user token
	 *
	 * @static
	 * @param {object} token
	 * @returns {Promise} decoded token or error object
	 * @method authenticate
	 * @memberof UserService
	 */
	static authenticate(token) {
		let msg = 'Access denied! Token not provided';
		if (token) {
			const match = new RegExp('/^Bearer (\S+)$/').exec(token);
			token = match ? match[1] : token;
			try {
				const decoded = jwt.verify(token, process.env.SECRET_KEY, {
					issuer: process.env.ISSUER
				});
				if (decoded) {
					return this.findUser(decoded).then((user) => {
						return user ? decoded : { statusCode: 401, message: 'User does not exist' };
					});
				}
				msg = 'Access denied! Invalid token provided';
			} catch (err) {
				msg = (err.message === 'jwt expired')
					? 'Access denied! Expired token provided'
					: 'Access denied! Invalid authentication token';
			}
		}
		return Promise.resolve({ statusCode: 401, message: msg });
	}

	/**
	 * Generate a JWT for authenticated user
	 *
	 * @param {object} credentials
	 * @returns {string} the generated token
	 * @method generateToken
	 * @memberof UserService
	 */
	static generateToken(credentials) {
		return jwt.sign({ ...credentials }, process.env.SECRET_KEY, {
			issuer: process.env.ISSUER,
			subject: process.env.SUBJECT,
			expiresIn: process.env.EXPIRATION
		});
	}

	/**
	* Validate user token
	* 
	* @static
	* @param {string} token the user token
	* @returns {boolean} boolean
	* @method validateToken
	* @memberof UserService
	*/
	static validateToken(token) {
		if (token) {
			const currentTime = Date.now();
			const tokenExp = decode(token).exp * 1000;
			return currentTime < tokenExp;
		}
		return false;
	}

	/**
	 * Save the cloudinary photo url in database
	 *
	 * @static
	 * @param {object} options
	 * @returns {Promise} a promise
	 * @method savePhotoURL
	 * @memberof UserService
	 */
	static savePhotoURL(options) {
		return db.sqlQuery(UserQuery.editUser({ values: options, key: 'photo' }))
		.then((result) => { 
			if (result.rows[0]) {
				const { password, ...user } = result.rows[0];
				return {
					statusCode: 200, message: 'Photo uploaded successfully', data: { user }
				};
			}
			//return { statusCode: 400, message: 'Something went wrong, could not upload photo' };
		});
	}

	/**
	 * Verify a user password
	 *
	 * @static
	 * @param {object} data
	 * @returns {object} the response to send to client
	 * @method verifyPassword
	 * @memberof UserService
	 */
	static verifyPassword(data) {
		return this.findUser(data.decoded).then((result) => {
			const { password, ...user } = result;
			return (bcrypt.compareSync(data.password, password))
				? { statusCode: 200, message: 'Password is valid', data: { user } }
				: { statusCode: 406, message: 'Sorry, incorrect password' };
		});
	}

	/**
	 * Change user password
	 *
	 * @static
	 * @param {object} data
	 * @param {boolean} auth set to true for authenticated user
	 * @return {object} the response to send to client
	 * @method updatePassword
	 * @memberof UserService
	 */
	static resetPassword(data, auth) {
		const { email, userId } = auth ? data.decoded : data;
		const pass = bcrypt.hashSync(data.password, bcrypt.genSaltSync(10));
		return db.sqlQuery(UserQuery.updatePassword({
			isAuthenticated: auth,
			values: { password: pass, email, userId }
		})).then((result) => {
			if (!auth) {
				this.sendNewPasswordEmail(result.rows[0], data.password);
			}
			return { message: 'New password saved successfuly' };
		});
	}

	/**
	 * Send new password email notification to user
	 *
	 * @static
	 * @param {object} user object with properties containing user data
	 * @param {string} password new password
	 * @method sendNewPasswordEmail
	 * @memberof UserService
	 */
	static sendNewPasswordEmail(user, password) {
		const { firstname, lastname, email } = user;
		NotificationService.sendEmail({
			subject: 'New Password',
			receiver: { email, name: firstname.concat(` ${lastname}`) },
			message: `<p>
						 In response to your forgotten password, 
						 we have generated a new password for you<
					 /p>
					 <p>Below are your new sign in credentials</p>
					 <p><b>E-mail address:</b> ${email}<br>
					 <b>Password:</b> ${password}<br>
					 <h3>
						 After you sign in successfully, 
					 	 we advice you change it to a password of your choice!
					 </h3>`
		});
	}

	/**
	 * Check if a field is unique
	 *
	 * @static
	 * @param {object} option the
	 * @param {string} label optional text to use as field name in message
	 * @returns {Promise} the response to send to client
	 * @method checkIfUnique
	 * @memberof UserService
	 */
	static checkIfUnique(option, label) {
		const key = Object.keys(option)[0];
		return this.findBy(option).then((result) => {
			// Remember, findBy returns an object with property statusCode
			// So, we need to check the statusCode returned 
			return (result.statusCode === 302)
				? { statusCode: 409, message: `${label || key} has been used` }
				: Promise.resolve({ statusCode: 200 });
		});
	}
}