import _ from 'lodash';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import collections from '../collections';
import UtilityService from '../services/utilityService';

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
			req.body.isAdmin = _.isUndefined(req.body.isAdmin) ? false : req.body.isAdmin;

			collections.addUsers(req.body);

			const { password, ...data } = req.body;
			data.createdAt = new Date();
			return this.successResponse(res, 201, 'Registration was successful', data );
			// res.status(201).json({
			// 	status: 'Success',
			// 	message: 'Registration was successful',
			// 	data: {
			// 		...data
			// 	}
			// });
		};
	}
}