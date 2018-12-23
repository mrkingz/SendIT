import path from 'path';

/**
 *
 *
 * @export
 * @class PageController
 */
export default class PageController {
	/**
	 * Get the index page
	 *
	 * @static
	 * @returns {function} An express middleware that handles the GET request
	 * @method getIndex
	 * @memberof PageController
	 */
	static getIndex() {
		return (req, res) => {
			return res.sendFile(this.getHTMLPath('index'));
		};
	}

	/**
	 * Get the signup page
	 *
	 * @static
	 * @returns {function} An express middleware that handles the GET request
	 * @method getSignup
	 * @memberof PageController
	 */
	static getSignup() {
		return (req, res) => {
			return res.sendFile(this.getHTMLPath('registration'));
		};
	}

	/**
	 * Get the sign in page
	 *
	 * @static
	 * @returns {function} An express middleware that handles the GET request
	 * @method getLogin
	 * @memberof PageController
	 */
	static getLogin() {
		return (req, res) => {
			return res.sendFile(this.getHTMLPath('login'));
		};
	}

	/**
	 * Get the dashboard page
	 *
	 * @static
	 * @returns {function} An express middleware that handles the GET request
	 * @method getDashboard
	 * @memberof PageController
	 */
	static getDashboard() {
		return (req, res) => {
			return res.sendFile(this.getHTMLPath('dashboard'));
		};
	}

	/**
	 * Get the create order page
	 *
	 * @static
	 * @returns {function} An express middleware that handles the GET request
	 * @method getCreate
	 * @memberof PageController
	 */
	static getCreate() {
		return (req, res) => {
			return res.sendFile(this.getHTMLPath('create'));
		};
	}

	/**
	 * Get the orders page
	 *
	 * @static
	 * @returns {function} An express middleware that handles the GET request
	 * @method getOrders
	 * @memberof PageController
	 */
	static getOrders() {
		return (req, res) => {
			return res.sendFile(this.getHTMLPath('orders'));
		};
	}

	/**
	 * Get user orders page
	 *
	 * @static
	 * @returns {function} An express middleware that handles the GET request
	 * @method getUserOrders
	 * @memberof PageController
	 */
	static getUserOrders() {
		return (req, res) => {
			return res.sendFile(this.getHTMLPath('user-orders'));
		};
	}

	/**
	 * Get the profile page
	 *
	 * @static
	 * @returns {function} An express middleware that handles the GET request
	 * @method getProfile
	 * @memberof PageController
	 */
	static getProfile() {
		return (req, res) => {
			return res.sendFile(this.getHTMLPath('profile'));
		};
	}

	/**
	 * Get the details page
	 *
	 * @static
	 * @returns {function} An express middleware that handles the GET request
	 * @method getDetails
	 * @memberof PageController
	 */
	static getDetails() {
		return (req, res) => {
			return res.sendFile(this.getHTMLPath('details'));
		};
	}

	/**
	 * Get the password page
	 *
	 * @static
	 * @returns {function} An express middleware that handles the GET request
	 * @method getPassword
	 * @memberof PageController
	 */
	static getPassword() {
		return (req, res) => {
			return res.sendFile(this.getHTMLPath('password'));
		};
	}

	/**
	 * Get path to a HTML file
	 *
	 * @static
	 * @param {string} page the HTML file name;
	 * @returns {string} the path to the HTML file
	 * @method getHTMLPath
	 * @memberof PageController
	 */
	static getHTMLPath(page) {
		return path.resolve(`./public/views/${page}.html`);
	}
}