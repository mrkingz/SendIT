'use strict';

var cov_12y410ihn0 = function () {
  var path = 'C:\\Users\\Kingsley\\Desktop\\SendIT\\server\\routes\\authRoutes.js',
      hash = '8ec50f61c402d64d7bf3f38603dfb1b1ebec7d5d',
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = '__coverage__',
      coverageData = {
    path: 'C:\\Users\\Kingsley\\Desktop\\SendIT\\server\\routes\\authRoutes.js',
    statementMap: {
      '0': {
        start: {
          line: 5,
          column: 27
        },
        end: {
          line: 5,
          column: 38
        }
      },
      '1': {
        start: {
          line: 6,
          column: 28
        },
        end: {
          line: 6,
          column: 39
        }
      },
      '2': {
        start: {
          line: 7,
          column: 19
        },
        end: {
          line: 7,
          column: 35
        }
      },
      '3': {
        start: {
          line: 9,
          column: 0
        },
        end: {
          line: 13,
          column: 29
        }
      },
      '4': {
        start: {
          line: 15,
          column: 2
        },
        end: {
          line: 16,
          column: 27
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
      '4': 0
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

var _ref = (cov_12y410ihn0.s[0]++, _controllers2.default),
    UserController = _ref.UserController;

var _ref2 = (cov_12y410ihn0.s[1]++, _validations2.default),
    UserValidations = _ref2.UserValidations;

var authRouter = (cov_12y410ihn0.s[2]++, _express2.default.Router());

cov_12y410ihn0.s[3]++;
authRouter.post('/api/v1/auth/signup', UserValidations.isRequired(), UserValidations.validateRegistration(), UserValidations.isUnique('Email', 'E-mail address has been used!'), UserController.register());

cov_12y410ihn0.s[4]++;
authRouter.post('/api/v1/auth/login', UserController.signin());

exports.default = authRouter;