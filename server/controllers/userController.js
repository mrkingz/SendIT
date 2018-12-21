import _ from 'lodash';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import decode from 'jwt-decode';
import db from '../database';
import UtilityService from '../helpers/UtilityService';

dotenv.load();

/**
 * @export
 * @class UserController
 * @extends { UtilityService }
 */
export default class UserController extends UtilityService {
	/**
   * Register new user
	 * 
	 * @static
	 * @returns {function} An express middleware function that handles the POST request
   * @method register
	 * @memberof UserController
	 */
  static register() {
    return (req, res) => {
      const moment = new Date();
      let { 
        email, firstname, lastname, phoneNumber 
      } = req.body;
      const pass = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
      const query = {
        text: `INSERT INTO 
                users (email, firstname, lastname, password, phonenumber, createdat, updatedat) 
               VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        values: [
          email, this.ucFirstStr(firstname), this.ucFirstStr(lastname), 
          pass, phoneNumber, moment, moment
        ]
      };
      db.sqlQuery(query)
        .then((result) => {
          const { password, ...user } = result.rows[0];
          return this.successResponse({ 
            res, code: 201, message: 'Sign up was successfull', data: { user } 
          });
        })
        .catch(() => this.errorResponse({ res, message: db.dbError() }));
    };
  }

	/**
	 * Sign in a user with email and password
	 * 
	 * @static 
	 * @returns {function} Returns an express middleware function that handles the POST 
	 * request to signup a user
	 * @memberof UserController
	 */
  static signin() {
    return (req, res) => {
      const query = {
        text: `SELECT * FROM users WHERE email = $1`,
        values: [req.body.email]
      };
      db.sqlQuery(query)
        .then((result) => {
          if (!_.isEmpty(result.rows)) {
            if (bcrypt.compareSync(req.body.password, result.rows[0].password)) {
              const { 
                password, firstname, lastname, createdat, updatedat, ...details 
              } = result.rows[0];
              return this.successResponse({
                res, 
                message: 'Successfully signed in',
                data: { 
                  user: { firstname, lastname, ...details },
                  token: this.generateToken(details)
                 } 
              });
            }
          }
          return this.errorResponse({ res, code: 401, message: 'Invalid sign in credentials' });
        })
        .catch(() => this.errorResponse({ res, message: db.dbError() }));
    };
  }

  /**
   * Edit profile details
   *
   * @static
   * @param {string} option the edit operation to perform
   * @returns {function} An express middleware function that handles the PUT request
   * @method editProfileDetails
   * @memberof UserController
   */
  static editProfileDetails(option) {
    return (req, res) => {
      const { 
        firstname, lastname, phoneNumber, decoded 
      } = req.body;
      const queries = {
        name: {
          text: `UPDATE users SET firstname = $1, lastname = $2, updatedat = $3
                 WHERE userid = $4 RETURNING *`,
          values: [
            this.ucFirstStr(firstname), this.ucFirstStr(lastname), new Date(), decoded.userid
          ]
        },
        phonenumber: {
          text: `UPDATE users SET phonenumber = $1, updatedat = $2
                 WHERE userid = $3 RETURNING *`,
          values: [phoneNumber, new Date(), decoded.userid]
        }
      };
      db.sqlQuery(queries[option.replace(/[-]+/g, '')]).then((result) => {
        const { password, ...user } = result.rows[0];
        const message = `${this.ucFirstStr(option.replace(/[-]+/g, ' '))} successfully updated`;
        this.successResponse({
          res, code: 200, message, data: { user } 
        });
      })
      .catch(() => this.errorResponse({ res, message: db.dbError() }));
    };
  }

  /**
   * Get profile details
   *
   * @static
   * @returns {function} An express middleware function that handles the GET request
   * @method getProfileDetails
   * @memberof UserController
   */
  static getProfileDetails() {
    return (req, res) => {
      const query = {
        text: `SELECT * FROM users WHERE userid = $1 LIMIT 1`,
        values: [req.body.decoded.userid]
      };
      db.sqlQuery(query).then((result) => {
        const { password, ...user } = result.rows[0];
        const message = 'Profile details successfully retrieved';
        return _.isEmpty(user)
                ? this.errorResponse({ res, code: 404, message: 'User does not exist' })
                : this.successResponse({ 
                  res, code: 302, message, data: { user } 
                });
      })
      .catch(() => this.errorResponse({ res, message: db.dbError() }));
    };
  }

  /**
   * Generate a JWT for authenticated user
   *
   * @param {object} credentials
   * @returns {string} the generated token
   * @memberof UserController
   */
  static generateToken(credentials) {
    return jwt.sign({
      ...credentials
    }, process.env.SECRET_KEY, {
        issuer: process.env.ISSUER,
        subject: process.env.SUBJECT,
        expiresIn: process.env.EXPIRATION
      });
  }

	/**
	 * Authenticate users
	 * @static
	 * @returns {function} Returns an expresss middleware function that handles user authentication
	 * @memberof UserController
	 */
  static authenticateUser() {
    return (req, res, next) => {
      let message = 'Access denied! Token not provided';
      let token = req.cookies.token || req.getAuthorization || req.query.token ||
        req.body.token || req.headers.token;
      if (token) {
        const regex = new RegExp('/^Bearer (\S+)$/');
        const match = regex.exec(token);
        token = (match) ? match[1] : token;
        try {
          const decoded = jwt.verify(token, process.env.SECRET_KEY, {
            issuer: process.env.ISSUER
          });
          if (decoded) {
            return this.findUser(decoded).then((user) => {
              if (user) {
                req.body.decoded = decoded;
                return next();
              }
              this.errorResponse({ res, code: 401, message: 'Sorry, user does not exist' });
            });
          }
        } catch (error) {
          message = (error.message === 'jwt expired')
            ? 'Access denied! Token has expired'
            : 'Access denied! Invalid authentication token';
        }
      }
      return this.errorResponse({ res, code: 401, message });
    };
  }

  /**
   * Find a user
   *
   * @static
   * @param {object} credentials the credentials from user token
   * @method findUser
   * @returns {object} the user details, if found; otherwise null
   * @memberof UserController
   */
  static findUser(credentials) {
    const { userid, email, isadmin } = credentials;
    const query = {
      text: `SELECT * FROM users WHERE userid = $1 AND email = $2 AND isadmin = $3`,
      values: [userid, email, isadmin]
    };
    return db.sqlQuery(query)
      .then((result) => {
        const { password, ...user } = result.rows[0];
        return _.isEmpty(result.rows) ? null : user;
      })
      .catch(() => db.dbError());
  }

  /**
   * Authorize a user
   * @static
   * @returns {function} Returns an express middleware that handles the authorization
   * @memberof UserController
   */
  static authorizeUser() {
    return (req, res, next) => {
      return (req.body.decoded.isadmin)
        ? next()
        : this.errorResponse({ 
            res, code: 401, message: 'You do not have the privilege for this operation' 
          });
    };
  }

  /**
	 * Check if a user is signed in
	 *
	 * @static
	 * @returns {function} An express middleware that handles the GET request
	 * @method checkAuth
	 * @memberof UserController
	 */
  static checkAuth() {
    return (req, res) => {
      const { token } = req.body;
      if (this.validateToken(token)) {
        const decoded = decode(token);
        return this.findUser(decoded)
          .then(user => this.successResponse({ res, code: 302, data: { user } }))
          .catch(() => {});
      }
    };
  }

  /**
  * Validate token
  * 
  * @static
  * @param {string} token
  * @returns {boolean} boolean
  * @method validateToken
  * @memberof UserController
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
   * Check if a field exist
   *
   * @static
   * @param {string} field the field to check for
   * @param {string} msg the message to send back to client (Optional)
   * @returns {function} An express middleware that handles the GET request
   * @memberof UserController
   */
  static checkExist(field, msg) {
    return (req, res) => {
      const query = {
        text: `SELECT ${field} FROM users WHERE ${field} = $1`,
        values: [req.body[field]]
      };
      db.sqlQuery(query).then((result) => {
        if (_.isEmpty(result.rows)) {
          return this.successResponse({
            res, code: 404, message: (msg || `${this.ucFirstStr(field)} does not exist`) 
          });
        }
        const message = (message || `${this.ucFirstStr(field)} has been used`);
        this.successResponse({ 
          res, code: 302, message, data: { ...result.rows[0] } 
        });
      }).catch(() => this.errorResponse({ res, message: db.dbError() }));
    };
  }

  /**
   * Verify password
   *
   * @static
   * @returns {function} An expresss middleware function that handles the POST request
   * @method verifyPassword
   * @memberof UserController
   */
  static verifyPassword() {
    return (req, res) => {
      if (!req.body.password) {
        return this.errorResponse({
          res, code: 422, message: 'Password is required'
        });
      }
      const query = {
        text: `SELECT * FROM users WHERE userid = $1`,
        values: [req.body.decoded.userid]
      };
      db.sqlQuery(query).then((result) => {
        const { password, ...user } = result.rows[0];
        if (bcrypt.compareSync(req.body.password, password)) {
          return this.successResponse({
            res, code: 200, message: 'Password is valid', data: { user } 
          });
        } 
        this.errorResponse({ res, code: 406, message: 'Sorry, incorrect password' });
      })
      .catch(() => this.errorResponse({ res, message: db.dbError() }));
    };
  }

  /**
   * Update password
   *
   * @static
   * @returns {function} An express middleware function that hanmdles the PUT request
   * @method changePassword
   * @memberof UserController
   */
  static changePassword() {
    return (req, res) => {
      const pass = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
      const query = {
        text: `UPDATE users SET password = $1, updatedat =$2 
              WHERE userid = $3 RETURNING *`,
        values: [pass, new Date(), req.body.decoded.userid]
      };
      db.sqlQuery(query).then((result) => {
        const { password, ...user } = result.rows[0];
        this.successResponse({ res, message: 'New password saved successfuly', data: { user } });
      })
      .catch(() => this.errorResponse({ res, message: db.dbError() }));
    };
  }
}