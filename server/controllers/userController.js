import _ from 'lodash';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import collections from '../dummyData';
import UtilityService from '../helpers/UtilityService';

dotenv.load();

/**
 * @export
 * @class UserController
 * @extends { UtilityService }
 */
export default class UserController extends UtilityService {
	/**
	 * 
	 * @static
	 * @returns {function} aA middleware function that handles the POST request
	 * @memberof UserController
	 */
	static register() {
		return (req, res) => {
			const hashSalt = bcrypt.genSaltSync(10);
			req.body.password = bcrypt.hashSync(req.body.password, hashSalt);
			req.body.userId = collections.getUsersCount() + 1;
			req.body.isAdmin = _.isUndefined(req.body.isAdmin) ? false : Boolean(req.body.isAdmin);

			collections.addUsers(req.body);

			const { password, ...data } = req.body;
			data.createdAt = new Date();
			return this.successResponse(res, 201, 'Registration was successfull', data );
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
      const { email, password } = req.body;
      let message = 'Invalid sign in credentials';

      if ((_.isUndefined(email)) || _.isUndefined(password)) {
        message = 'E-mail address and password are required';
      } else {
        const length = collections.getUsersCount();
        for (let i = 0; i < length; i++) {
          if (collections.getUsers()[i].email === email) {
            if (!bcrypt.compareSync(password, collections.getUsers()[i].password)) {
              message = 'Invalid sign in credentials';
            } else {
              const { userId, isAdmin } = collections.getUsers()[i];
              return this.successResponse(res, 200, 'Successfully signed in', {
                  token: this.generateToken({ userId, isAdmin, email })
                }
              );
            }
            break;
          }
        }
      }
      return this.errorResponse(res, 401, message);
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
        let decoded;
        try {
          decoded = jwt.verify(token, process.env.SECRET_KEY, {
            issuer: process.env.ISSUER
          });
          if (decoded) {
            const length = collections.getUsersCount();
            for (let i = 0; i < length; i++) {
              if (parseInt(collections.getUsers()[i].userId, 10) === parseInt(decoded.userId, 10)) {
                req.body.decoded = decoded;
                return next();
              }
            }
            message = 'Sorry, user does not exist';
          }
        } catch (error) {
          if (error.message === 'jwt expired') {
            message = 'Access denied! Token has expired';
          } else {
            message = 'Access denied! Invalid authentication token';
          }
        }
      }
      return this.errorResponse(res, 401, message);
    };
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