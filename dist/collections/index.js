"use strict";

var cov_1bf02dzaix = function () {
	var path = "C:\\Users\\Kingsley\\Desktop\\SendIT\\server\\collections\\index.js",
	    hash = "aeaad8d138b41c61cd4ecbe55cfe38174764d680",
	    Function = function () {}.constructor,
	    global = new Function('return this')(),
	    gcv = "__coverage__",
	    coverageData = {
		path: "C:\\Users\\Kingsley\\Desktop\\SendIT\\server\\collections\\index.js",
		statementMap: {
			"0": {
				start: {
					line: 12,
					column: 2
				},
				end: {
					line: 12,
					column: 18
				}
			},
			"1": {
				start: {
					line: 13,
					column: 2
				},
				end: {
					line: 13,
					column: 20
				}
			},
			"2": {
				start: {
					line: 23,
					column: 2
				},
				end: {
					line: 23,
					column: 24
				}
			},
			"3": {
				start: {
					line: 33,
					column: 2
				},
				end: {
					line: 33,
					column: 27
				}
			},
			"4": {
				start: {
					line: 43,
					column: 2
				},
				end: {
					line: 43,
					column: 20
				}
			},
			"5": {
				start: {
					line: 54,
					column: 2
				},
				end: {
					line: 54,
					column: 28
				}
			},
			"6": {
				start: {
					line: 64,
					column: 2
				},
				end: {
					line: 64,
					column: 29
				}
			},
			"7": {
				start: {
					line: 74,
					column: 2
				},
				end: {
					line: 74,
					column: 22
				}
			}
		},
		fnMap: {
			"0": {
				name: "(anonymous_0)",
				decl: {
					start: {
						line: 11,
						column: 1
					},
					end: {
						line: 11,
						column: 2
					}
				},
				loc: {
					start: {
						line: 11,
						column: 15
					},
					end: {
						line: 14,
						column: 2
					}
				},
				line: 11
			},
			"1": {
				name: "(anonymous_1)",
				decl: {
					start: {
						line: 22,
						column: 1
					},
					end: {
						line: 22,
						column: 2
					}
				},
				loc: {
					start: {
						line: 22,
						column: 16
					},
					end: {
						line: 24,
						column: 2
					}
				},
				line: 22
			},
			"2": {
				name: "(anonymous_2)",
				decl: {
					start: {
						line: 32,
						column: 1
					},
					end: {
						line: 32,
						column: 2
					}
				},
				loc: {
					start: {
						line: 32,
						column: 17
					},
					end: {
						line: 34,
						column: 2
					}
				},
				line: 32
			},
			"3": {
				name: "(anonymous_3)",
				decl: {
					start: {
						line: 42,
						column: 1
					},
					end: {
						line: 42,
						column: 2
					}
				},
				loc: {
					start: {
						line: 42,
						column: 12
					},
					end: {
						line: 44,
						column: 2
					}
				},
				line: 42
			},
			"4": {
				name: "(anonymous_4)",
				decl: {
					start: {
						line: 53,
						column: 1
					},
					end: {
						line: 53,
						column: 2
					}
				},
				loc: {
					start: {
						line: 53,
						column: 20
					},
					end: {
						line: 55,
						column: 2
					}
				},
				line: 53
			},
			"5": {
				name: "(anonymous_5)",
				decl: {
					start: {
						line: 63,
						column: 1
					},
					end: {
						line: 63,
						column: 2
					}
				},
				loc: {
					start: {
						line: 63,
						column: 19
					},
					end: {
						line: 65,
						column: 2
					}
				},
				line: 63
			},
			"6": {
				name: "(anonymous_6)",
				decl: {
					start: {
						line: 73,
						column: 1
					},
					end: {
						line: 73,
						column: 2
					}
				},
				loc: {
					start: {
						line: 73,
						column: 14
					},
					end: {
						line: 75,
						column: 2
					}
				},
				line: 73
			}
		},
		branchMap: {},
		s: {
			"0": 0,
			"1": 0,
			"2": 0,
			"3": 0,
			"4": 0,
			"5": 0,
			"6": 0,
			"7": 0
		},
		f: {
			"0": 0,
			"1": 0,
			"2": 0,
			"3": 0,
			"4": 0,
			"5": 0,
			"6": 0
		},
		b: {},
		_coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
	},
	    coverage = global[gcv] || (global[gcv] = {});

	if (coverage[path] && coverage[path].hash === hash) {
		return coverage[path];
	}

	coverageData.hash = hash;
	return coverage[path] = coverageData;
}();

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 
 * @export
 * @class Collections
 */
var Collections = function () {
	/**
  * Creates an instance of Collection.
  * @memberof Collection
  */
	function Collections() {
		_classCallCheck(this, Collections);

		cov_1bf02dzaix.f[0]++;
		cov_1bf02dzaix.s[0]++;

		this.users = [];
		cov_1bf02dzaix.s[1]++;
		this.parcels = [];
	}

	/**
  * Add new user to user collection
  * 
  * @param {any} user
  * @memberof Collections
  */


	_createClass(Collections, [{
		key: "addUsers",
		value: function addUsers(user) {
			cov_1bf02dzaix.f[1]++;
			cov_1bf02dzaix.s[2]++;

			this.users.push(user);
		}

		/**
   * Get the number of users 
   * 
   * @returns {number} Returns the number of users
   * @memberof Collections
   */

	}, {
		key: "getUsersCount",
		value: function getUsersCount() {
			cov_1bf02dzaix.f[2]++;
			cov_1bf02dzaix.s[3]++;

			return this.users.length;
		}

		/**
   * Get users collection
   * 
   * @returns {Array} Returns an array of users
   * @memberof Collection
   */

	}, {
		key: "getUsers",
		value: function getUsers() {
			cov_1bf02dzaix.f[3]++;
			cov_1bf02dzaix.s[4]++;

			return this.users;
		}

		/**
   * Add new order to parcels collection
   * 
   * @param {any} parcel
   * @memberof Collections
   */

	}, {
		key: "addParcels",
		value: function addParcels(parcel) {
			cov_1bf02dzaix.f[4]++;
			cov_1bf02dzaix.s[5]++;

			this.parcels.push(parcel);
		}

		/**
   * Get the number of parcels 
   * 
   * @returns {number} Returns the number of parcels
   * @memberof Collections
   */

	}, {
		key: "getParcelsCount",
		value: function getParcelsCount() {
			cov_1bf02dzaix.f[5]++;
			cov_1bf02dzaix.s[6]++;

			return this.parcels.length;
		}

		/**
   * Get parcels collection
   * 
   * @returns {Array} Returns an array of parcels
   * @memberof Collection
   */

	}, {
		key: "getParcels",
		value: function getParcels() {
			cov_1bf02dzaix.f[6]++;
			cov_1bf02dzaix.s[7]++;

			return this.parcels;
		}
	}]);

	return Collections;
}();

exports.default = new Collections();