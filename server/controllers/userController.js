import decode from "jwt-decode";
import Controller from "./Controller";
import UserService from "../services/UserService";
import UploadService from '../services/UploadService';

/**
 * @export
 * @class UserController
 * @extends { Controller }
 */
export default class UserController extends Controller {
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
      UserService.createUser(req.body)
        .then(result => this.response(res, result))
        .catch(error => this.serverError(res, error));
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
      UserService.signinUser(req.body)
        .then(result => this.response(res, result))
        .catch(error => this.serverError(res, error));
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
      UserService.editUserProfile({
        key: option,
        values: this.ucFirstObj(req.body)
      })
        .then(result => this.response(res, result))
        .catch(error => this.serverError(res, error));
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
      UserService.fetchUserProfile(req.body.decoded.userId)
        .then(result => this.response(res, result))
        .catch(error => this.serverError(res, error));
    };
  }

  /**
   * Authenticate users
   * @static
   * @returns {function} Returns an expresss middleware function that handles user authentication
   * @memberof UserController
   */
  static authenticateUser() {
    return (req, res, next) => {
      let token = this.extractToken(req);
      UserService.authenticate(token)
        .then((result) => {
          if (result.statusCode !== 401) {
            req.body.decoded = result;
            return next();
          }
          this.response(res, result);
        })
        .catch(error => this.serverError(res, error));
    };
  }

  /**
   * Authorize a user
   * @static
   * @returns {function} Returns an express middleware that handles the authorization
   * @method authorizeUser
   * @memberof UserController
   */
  static authorizeUser() {
    return (req, res, next) => {
      return req.body.decoded.isAdmin
        ? next()
        : this.response(res, {
            statusCode: 401,
            message: "You do not have the privilege for this operation"
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
      const token = this.extractToken(req);
      if (UserService.validateToken(token)) {
        return UserService.findUser(decode(token))
          .then((result) => {
            const { password, ...user } = result;
            this.response(res, { statusCode: 302, data: { user } });
          })
          .catch(error => this.serverError(res, error));
      }
    };
  }

  /**
   * Check if a field exist
   *
   * @static
   * @param {string} field the field to check for
   * @param {string} label text to use as field name (optional)
   * @returns {function} An express middleware that handles the GET request
   * @method checkIfExist
   * @memberof UserController
   */
  static checkIfExist(field, label) {
    return (req, res) => {
      UserService.findBy({ email: req.body[field] }, label)
        .then(result => this.response(res, result))
        .catch(error => this.serverError(res, error));
    };
  }

  /**
   * Extract user token from request object
   *
   * @static
   * @param {Object} req HTTP request object
   * @returns {string} token
   * @method extractToken
   * @memberof UserController
   */
  static extractToken(req) {
    return req.cookies.token || req.getAuthorization || req.query.token || req.headers.token 
      || req.body.token;    
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
        return this.response(res, {
          statusCode: 400,
          message: "Password is required"
        });
      }
      UserService.verifyPassword(req.body)
        .then(result => this.response(res, result))
        .catch(error => this.serverError(res, error));
    };
  }

  /**
   * Update password
   *
   * @static
   * @param {object} auth
   * @returns {function} An express middleware function that hanmdles the PUT request
   * @method changePassword
   * @memberof UserController
   */
  static changePassword(auth) {
    return (req, res) => {
      return UserService.resetPassword(req.body, auth.isAuthenticated)
        .then(result => this.response(res, result))
        .catch(error => this.serverError(res, error));
    };
  }

  /**
   * Validates if a user sign up credential has been used
   *
   * @param {string} field the property name
   * @param {string} label text to use as field name (optional)
   * @static
   * @returns {function} Returns an express middleswar function that does the validation
   * @method isUnique
   * @memberof UserController
   */
  static isUnique(field, label) {
    return (req, res, next) => {
      field = field.toLowerCase();
      UserService.checkIfUnique({ [field]: req.body[field] }, label)
        .then((result) => {
          return result.statusCode === 409
            ? this.response(res, result)
            : next();
        })
        .catch(error => this.serverError(res, error));
    };
  }

  /**
   * Upload profile photo
   *
   * @static
   * @returns {function} An express middleware that handles the PUT request
   * @method uploadPhoto
   * @memberof UserController
   */
  static updatePhotoURL() {
    return (req, res) => {
      if (!req.file) {
        return this.response(res, { statusCode: 400, message: 'No photo was uploaded' });
      }
      UserService.updatePhotoURL({
        photoURL: decodeURIComponent(req.file.secure_url),
        decoded: req.body.decoded,
        option: 'upload'
      })
        .then(result => this.response(res, result))
        .catch(error => this.serverError(res, error));
    };
  }

  /**
   * Upload photo to cloudinary
   *
   * @static
   * @returns {function} An express middleware function that handles the request
   * @memberof UserController
   */
  static uploadPhoto() {
    return (req, res, next) => {
      const uploader = UploadService.uploadTocloudinary(req.body.decoded);
      uploader(req, res, (err) => {
        return next(err || null);
      });
    };
  }

  /**
   *
   *
   * @static
   * @returns {function} an express middleware function that handles the request
   * @memberof UserController
   */
  static removePhoto() {
    return (req, res) => {
      UserService.updatePhotoURL({
        photoURL: null, decoded: req.body.decoded, option: 'remove'
      })
        .then((result) => {
          UploadService.deleteCloudinaryImage(req.body.decoded);
          return this.response(res, result);
        })
        .catch(error => this.serverError(res, error));
    };
  }
}
