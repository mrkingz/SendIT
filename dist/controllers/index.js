'use strict';

var cov_1yaahk28d7 = function () {
  var path = 'C:\\Users\\Kingsley\\Desktop\\SendIT\\server\\controllers\\index.js',
      hash = '7603a8a188c84c4411b2791ed536f632438e9569',
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = '__coverage__',
      coverageData = {
    path: 'C:\\Users\\Kingsley\\Desktop\\SendIT\\server\\controllers\\index.js',
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

var _userController = require('./userController');

var _userController2 = _interopRequireDefault(_userController);

var _parcelController = require('./parcelController');

var _parcelController2 = _interopRequireDefault(_parcelController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var controllers = (cov_1yaahk28d7.s[0]++, {
  UserController: _userController2.default,
  ParcelController: _parcelController2.default
});
exports.default = controllers;