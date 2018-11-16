'use strict';

var cov_1jtdyj8168 = function () {
  var path = 'C:\\Users\\Kingsley\\Desktop\\SendIT\\server\\routes\\index.js',
      hash = '6f372c8acd38bfdf3cbdfc904af4552e454047ca',
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = '__coverage__',
      coverageData = {
    path: 'C:\\Users\\Kingsley\\Desktop\\SendIT\\server\\routes\\index.js',
    statementMap: {
      '0': {
        start: {
          line: 4,
          column: 15
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

var _authRoutes = require('./authRoutes');

var _authRoutes2 = _interopRequireDefault(_authRoutes);

var _parcelRoutes = require('./parcelRoutes');

var _parcelRoutes2 = _interopRequireDefault(_parcelRoutes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var routes = (cov_1jtdyj8168.s[0]++, {
  authRoutes: _authRoutes2.default,
  parcelRoutes: _parcelRoutes2.default
});

exports.default = routes;