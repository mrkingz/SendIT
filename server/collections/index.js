/**
 * 
 * @export
 * @class Collections
 */
class Collections {
	/**
	 * Creates an instance of Collection.
	 * @memberof Collection
	 */
	constructor() {
		this.users = [];
		this.orders = [];
	}

	/**
	 * Add new user to user collection
	 * 
	 * @param {any} user
	 * @memberof Collections
	 */
	addUsers(user) {
		this.users.push(user);
	}

	/**
	 * Get the number of users 
	 * 
	 * @returns {number} Returns the number of users
	 * @memberof Collections
	 */
	getUsersCount() {
		return this.users.length;
	}

	/**
	 * Get users collection
	 * 
	 * @returns {Array} Returns an array of users
	 * @memberof Collection
	 */
	getUsers() {
		return this.users;
	}


	/**
	 * Add new order to orders collection
	 * 
	 * @param {any} order
	 * @memberof Collections
	 */
	addOrders(order) {
		this.orders.push(order);
	}

	/**
	 * Get the number of orders 
	 * 
	 * @returns {number} Returns the number of orders
	 * @memberof Collections
	 */
	getOrdersCount() {
		return this.orders.length;
	}

	/**
	 * Get orders collection
	 * 
	 * @returns {Array} Returns an array of orders
	 * @memberof Collection
	 */
	getOrers() {
		return this.orders;
	}
}
export default new Collections();