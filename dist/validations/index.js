'use strict';

var cov_u3rd0ghl9 = function () {
	var path = 'C:\\Users\\Kingsley\\Desktop\\SendIT\\server\\validations\\index.js',
	    hash = '1617e154fdbba10e9d4712758dc1abbf942f6d23',
	    Function = function () {}.constructor,
	    global = new Function('return this')(),
	    gcv = '__coverage__',
	    coverageData = {
		path: 'C:\\Users\\Kingsley\\Desktop\\SendIT\\server\\validations\\index.js',
		statementMap: {
			'0': {
				start: {
					line: 4,
					column: 20
				},
				end: {
					line: 7,
					column: 1
				}
			}
		},
		fnMap: {},
		branchMap: {},
		s: {
			'0': 0
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

var _userValidations = require('./userValidations');

var _userValidations2 = _interopRequireDefault(_userValidations);

var _parcelValidations = require('./parcelValidations');

var _parcelValidations2 = _interopRequireDefault(_parcelValidations);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var validations = (cov_u3rd0ghl9.s[0]++, {
	UserValidations: _userValidations2.default,
	ParcelValidations: _parcelValidations2.default
});
exports.default = validations;