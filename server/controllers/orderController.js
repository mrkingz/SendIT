import _ from 'lodash';
import collections from '../collections';
import UtilityService from '../services/utilityService';


/**
 * @export
 * @class OrderController
 * @extends { UtilityService }
 */
export default class OrderController extends UtilityService {
	/**
	 * 
	 * @static
	 * @returns {function} A middleware function that handles the POST order
	 * @memberof UserController
	 */
	static createOrder() {
		return (req, res) => {
			const { decoded, ...orderDetails } = req.body;
			const moment = new Date();
			orderDetails.orderId = collections.getOrders().length + 1;
			orderDetails.userId = decoded.userId;
			orderDetails.createdAt = moment;
			orderDetails.updatedAt = moment;
			collections.setOrders(orderDetails);
			return this.successResponse(res, 201, 'Parcel delivery order successfully created', {
					...collections.getOrders()[collections.getOrders().length - 1],
				});
		};
	}
}