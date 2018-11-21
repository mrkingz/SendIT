import _ from 'lodash';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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
	 * @returns {function} aA middleware function that handles the POST request
   * @method register
	 * @memberof UserController
	 */
	static register() {
		return (req, res) => {
      const moment = new Date();
      let {
          email, firstname, lastname, isAdmin 
      } = req.body;
			const pass = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
      isAdmin = _.isUndefined(isAdmin) ? false : Boolean(req.body.isAdmin);
      
      const query = {
        name: 'insert-user',
        text: `INSERT INTO 
                  users (email, firstname, lastname, password, isadmin, createdat, updatedat) 
                  VALUES($1, $2, $3, $4, $5, $6, $7) 
                  RETURNING userId`,
        values: [email, firstname, lastname, pass, isAdmin, moment, moment]
      };

      db.sqlQuery(query)
      .then((client) => {     
        return this.successResponse(res, 201, 'Sign up was successful', {
          userId: client.rows[0].userid, firstname, lastname, email, isAdmin, createdAt: moment
        });
      })
      .catch(() => {
          return this.errorResponse(res, 500, db.dbError());
      });
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
      let { email, password } = req.body;
      const query = {
        name: 'signin-user',
        text: `SELECT userid, isadmin, password FROM users WHERE email = $1`,
        values: [email]
      };
      db.sqlQuery(query)
      .then((result) => {
        if (!_.isEmpty(result.rows)) {
          if (bcrypt.compareSync(password, result.rows[0].password)) {
            const { userid, isadmin } = result.rows[0];
            return this.successResponse(res, 200, 'Successfully signed in', {
              token: this.generateToken({ userid, isadmin, email })
            });
          }
        }
        return this.errorResponse(res, 401, 'Invalid sign in credentials');
      })
      .catch(() => { this.errorResponse(res, 500, db.dbError()); });
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
            return this.findUser(decoded.userid).then((user) => {
              if (user) {
                req.body.decoded = decoded;
                return next();
              }
              this.errorResponse(res, 401, 'Sorry, user does not exist');
            });            
          }  
        } catch (error) {
          message = (error.message === 'jwt expired')
                      ? 'Access denied! Token has expired'
                      : 'Access denied! Invalid authentication token';
        }
      }
      return this.errorResponse(res, 401, message);
    };
  }

  /**
   * Find a user
   *
   * @static
   * @param {int} id the user id
   * @method findUser
   * @returns {object} the user details, if found; otherwise null
   * @memberof UserController
   */
  static findUser(id) {
    const query = {
      name: 'find-user',
      text: `SELECT userid, firstname, lastname, isadmin FROM users WHERE userid = $1`,
      values: [id]
    };
    return db.sqlQuery(query)
            .then((result) => {
              return _.isEmpty(result.rows) ? null : result.rows[0];
            })
            .catch(() => { return db.dbError(); });
  }

  /**
   * Authorize a user
   * @static
   * @returns {function} Returns an express middleware that handles the authorization
   * @memberof UserController
   */
  static authorizeUser() {
    return (req, res, next) => {
      return (req.body.decoded.isAdmin) 
        ? next()
        : this.errorResponse(res, 401, 'You do not have the privilege for this operation');
    };
  }
}