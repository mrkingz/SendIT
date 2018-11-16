import bcrypt from 'bcrypt';

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
		this.users = [{
			userId: 1,
			firstname: 'Kingsley',
			lastname: 'Frank-Demesi',
			email: 'kingsley@gmail.com',
			isAdmin: true,
			password: bcrypt.hashSync('Password1', bcrypt.genSaltSync(10))
		}, {
			userId: 2,
			firstname: 'James',
			lastname: 'Layemi',
			email: 'james@gmail.com',
			password: bcrypt.hashSync('Password1', bcrypt.genSaltSync(10))
		}];
		this.parcels = [{
			pickupAddress: '3, Obiora street',
			pickupCity: 'Aba',
			pickupState: 'Imo',
			pickupDate: '2018-11-10',
			pickupTime: '10:30: AM',
			destinationAddress: '16, Ogoni close',
			destinationCity: 'Ibadan',
			destinationState: 'Oyo',
			receiverName: 'Obiebi Michael',
			receiverPhone: '08054329076',
			weight: 45,
			deliveryMethod: 'Normal',
			description: 'Binatone standing fan',
			parcelId: 1,
			userId: 1,
			price: 4500,
			deliveryStatus: 'Pending',
			presentLocation: 'Not available',
			trackingId: '1542330812129',
			deliveryDuration: '7 days',
			createdAt: '2018-11-16T01:13:32.129Z',
			updatedAt: '2018-11-16T01:13:32.129Z',
		}];
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