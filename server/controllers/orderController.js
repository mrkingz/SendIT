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
			const days = { fast: '3 days', normal: '7 days' };
			const { decoded, ...orderDetails } = req.body;
			const moment = new Date();
			orderDetails.orderId = collections.getOrders().length + 1;
			orderDetails.userId = decoded.userId;
			orderDetails.price = Number(req.body.weight) * 100;
			orderDetails.deliveryStatus = 'Pending';
			orderDetails.presentLocation = 'Not available';
			orderDetails.deliveryDuration = days[req.body.deliveryMethod.toLowerCase()];
			orderDetails.createdAt = moment;
			orderDetails.updatedAt = moment;
			collections.addOrders(orderDetails);
			return this.successResponse(res, 201, 'Parcel delivery order successfully created', {
					...collections.getOrders()[collections.getOrders().length - 1],
				});
		};
	}
}