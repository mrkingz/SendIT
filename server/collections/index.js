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
		this.parcels = [];
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
	 * Add new order to parcels collection
	 * 
	 * @param {any} parcel
	 * @memberof Collections
	 */
	addParcels(parcel) {
		this.parcels.push(parcel);
	}

	/**
	 * Get the number of parcels 
	 * 
	 * @returns {number} Returns the number of parcels
	 * @memberof Collections
	 */
	getParcelsCount() {
		return this.parcels.length;
	}

	/**
	 * Get parcels collection
	 * 
	 * @returns {Array} Returns an array of parcels
	 * @memberof Collection
	 */
	getParcels() {
		return this.parcels;
	}
}
export default new Collections();