'use strict';

var cov_277koohw77 = function () {
	var path = 'C:\\Users\\Kingsley\\Desktop\\SendIT\\server\\routes\\parcelRoutes.js',
	    hash = 'fbdcc5ef4a73e7f92b7aeaecde4ada4ecca0a0dd',
	    Function = function () {}.constructor,
	    global = new Function('return this')(),
	    gcv = '__coverage__',
	    coverageData = {
		path: 'C:\\Users\\Kingsley\\Desktop\\SendIT\\server\\routes\\parcelRoutes.js',
		statementMap: {
			'0': {
				start: {
					line: 8,
					column: 4
				},
				end: {
					line: 8,
					column: 15
				}
			},
			'1': {
				start: {
					line: 9,
					column: 30
				},
				end: {
					line: 9,
					column: 41
				}
			},
			'2': {
				start: {
					line: 11,
					column: 21
				},
				end: {
					line: 11,
					column: 37
				}
			},
			'3': {
				start: {
					line: 13,
					column: 0
				},
				end: {
					line: 20,
					column: 32
				}
			},
			'4': {
				start: {
					line: 22,
					column: 0
				},
				end: {
					line: 25,
					column: 32
				}
			},
			'5': {
				start: {
					line: 27,
					column: 0
				},
				end: {
					line: 29,
					column: 36
				}
			},
			'6': {
				start: {
					line: 31,
					column: 0
				},
				end: {
					line: 33,
					column: 39
				}
			}
		},
		fnMap: {},
		branchMap: {},
		s: {
			'0': 0,
			'1': 0,
			'2': 0,
			'3': 0,
			'4': 0,
			'5': 0,
			'6': 0
		},
		f: {},
		b: {},
		_coverageSchema: '43e27e138ebf9cfc5966b082cf9a028302ed4184'
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

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _controllers = require('../controllers');

var _controllers2 = _interopRequireDefault(_controllers);

var _validations = require('../validations');

var _validations2 = _interopRequireDefault(_validations);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ref = (cov_277koohw77.s[0]++, _controllers2.default),
    ParcelController = _ref.ParcelController,
    UserController = _ref.UserController;

var _ref2 = (cov_277koohw77.s[1]++, _validations2.default),
    ParcelValidations = _ref2.ParcelValidations;

var parcelRouter = (cov_277koohw77.s[2]++, _express2.default.Router());

cov_277koohw77.s[3]++;
parcelRouter.route('/api/v1/parcels').all(UserController.authenticateUser()).post(ParcelValidations.isRequired(), ParcelValidations.isEmpty(), ParcelValidations.isValid(), ParcelController.createParcel()).get(UserController.authorizeUser(), ParcelController.getParcels());

cov_277koohw77.s[4]++;
parcelRouter.get('/api/v1/parcels/:parcelId', UserController.authenticateUser(), UserController.authorizeUser(), ParcelController.getParcel());

cov_277koohw77.s[5]++;
parcelRouter.get('/api/v1/users/:userId/parcels', UserController.authenticateUser(), ParcelController.getUserParcels());

cov_277koohw77.s[6]++;
parcelRouter.put('/api/v1/parcels/:parcelId/cancel', UserController.authenticateUser(), ParcelController.cancelParcelOrder());

exports.default = parcelRouter;