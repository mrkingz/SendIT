'use strict';

var cov_1qijqhyvbk = function () {
  var path = 'C:\\Users\\Kingsley\\Desktop\\SendIT\\server\\app.js',
      hash = '81823a2c3f6646d60aed195d13be125aeb7a886f',
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = '__coverage__',
      coverageData = {
    path: 'C:\\Users\\Kingsley\\Desktop\\SendIT\\server\\app.js',
    statementMap: {
      '0': {
        start: {
          line: 8,
          column: 0
        },
        end: {
          line: 8,
          column: 16
        }
      },
      '1': {
        start: {
          line: 9,
          column: 12
        },
        end: {
          line: 9,
          column: 21
        }
      },
      '2': {
        start: {
          line: 11,
          column: 0
        },
        end: {
          line: 11,
          column: 23
        }
      },
      '3': {
        start: {
          line: 13,
          column: 0
        },
        end: {
          line: 13,
          column: 44
        }
      },
      '4': {
        start: {
          line: 14,
          column: 0
        },
        end: {
          line: 14,
          column: 67
        }
      },
      '5': {
        start: {
          line: 15,
          column: 0
        },
        end: {
          line: 15,
          column: 24
        }
      },
      '6': {
        start: {
          line: 16,
          column: 0
        },
        end: {
          line: 16,
          column: 27
        }
      },
      '7': {
        start: {
          line: 17,
          column: 0
        },
        end: {
          line: 17,
          column: 29
        }
      },
      '8': {
        start: {
          line: 19,
          column: 0
        },
        end: {
          line: 24,
          column: 3
        }
      },
      '9': {
        start: {
          line: 20,
          column: 2
        },
        end: {
          line: 23,
          column: 5
        }
      },
      '10': {
        start: {
          line: 26,
          column: 0
        },
        end: {
          line: 31,
          column: 3
        }
      },
      '11': {
        start: {
          line: 27,
          column: 2
        },
        end: {
          line: 30,
          column: 5
        }
      },
      '12': {
        start: {
          line: 33,
          column: 0
        },
        end: {
          line: 40,
          column: 1
        }
      },
      '13': {
        start: {
          line: 34,
          column: 15
        },
        end: {
          line: 34,
          column: 39
        }
      },
      '14': {
        start: {
          line: 35,
          column: 2
        },
        end: {
          line: 37,
          column: 5
        }
      },
      '15': {
        start: {
          line: 36,
          column: 4
        },
        end: {
          line: 36,
          column: 51
        }
      }
    },
    fnMap: {
      '0': {
        name: '(anonymous_0)',
        decl: {
          start: {
            line: 19,
            column: 16
          },
          end: {
            line: 19,
            column: 17
          }
        },
        loc: {
          start: {
            line: 19,
            column: 30
          },
          end: {
            line: 24,
            column: 1
          }
        },
        line: 19
      },
      '1': {
        name: '(anonymous_1)',
        decl: {
          start: {
            line: 26,
            column: 13
          },
          end: {
            line: 26,
            column: 14
          }
        },
        loc: {
          start: {
            line: 26,
            column: 27
          },
          end: {
            line: 31,
            column: 1
          }
        },
        line: 26
      },
      '2': {
        name: '(anonymous_2)',
        decl: {
          start: {
            line: 35,
            column: 19
          },
          end: {
            line: 35,
            column: 20
          }
        },
        loc: {
          start: {
            line: 35,
            column: 25
          },
          end: {
            line: 37,
            column: 3
          }
        },
        line: 35
      }
    },
    branchMap: {
      '0': {
        loc: {
          start: {
            line: 34,
            column: 15
          },
          end: {
            line: 34,
            column: 39
          }
        },
        type: 'binary-expr',
        locations: [{
          start: {
            line: 34,
            column: 15
          },
          end: {
            line: 34,
            column: 31
          }
        }, {
          start: {
            line: 34,
            column: 35
          },
          end: {
            line: 34,
            column: 39
          }
        }],
        line: 34
      }
    },
    s: {
      '0': 0,
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0,
      '6': 0,
      '7': 0,
      '8': 0,
      '9': 0,
      '10': 0,
      '11': 0,
      '12': 0,
      '13': 0,
      '14': 0,
      '15': 0
    },
    f: {
      '0': 0,
      '1': 0,
      '2': 0
    },
    b: {
      '0': [0, 0]
    },
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

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

cov_1qijqhyvbk.s[0]++;


_dotenv2.default.config();
var app = (cov_1qijqhyvbk.s[1]++, (0, _express2.default)());

cov_1qijqhyvbk.s[2]++;
app.use((0, _morgan2.default)('dev'));

cov_1qijqhyvbk.s[3]++;
app.use(_bodyParser2.default.json({ limit: '10mb' }));
cov_1qijqhyvbk.s[4]++;
app.use(_bodyParser2.default.urlencoded({ limit: '10mb', extended: false }));
cov_1qijqhyvbk.s[5]++;
app.use((0, _cookieParser2.default)());
cov_1qijqhyvbk.s[6]++;
app.use(_routes2.default.authRoutes);
cov_1qijqhyvbk.s[7]++;
app.use(_routes2.default.parcelRoutes);

cov_1qijqhyvbk.s[8]++;
app.all('/api', function (req, res) {
  cov_1qijqhyvbk.f[0]++;
  cov_1qijqhyvbk.s[9]++;

  res.status('200').send({
    status: 'Success',
    message: 'Connection ok'
  });
});

cov_1qijqhyvbk.s[10]++;
app.all('*', function (req, res) {
  cov_1qijqhyvbk.f[1]++;
  cov_1qijqhyvbk.s[11]++;

  res.status('400').json({
    status: 'Fail',
    message: 'Sorry, there is nothing here!'
  });
});

cov_1qijqhyvbk.s[12]++;
try {
  var port = (cov_1qijqhyvbk.s[13]++, (cov_1qijqhyvbk.b[0][0]++, process.env.PORT) || (cov_1qijqhyvbk.b[0][1]++, 8000));
  cov_1qijqhyvbk.s[14]++;
  app.listen(port, function () {
    cov_1qijqhyvbk.f[2]++;
    cov_1qijqhyvbk.s[15]++;

    console.log('Server running on port: ' + port);
  });
} catch (err) {
  //
}

exports.default = app;