'use strict';

require('babel-polyfill');

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _jwt = require('./jwt');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hostname = '127.0.0.1';
var port = 3000;
var app = (0, _express2.default)();
// setup express application
var server = _http2.default.createServer(app);

app.use((0, _morgan2.default)('dev'));

app.use((0, _compression2.default)());
app.use((0, _helmet2.default)());

// log requests to the console
// Parse incoming requests data app.use(bodyParser.json());
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));

// For Passport

_passport2.default.use(_jwt.strategy);
app.use(_passport2.default.initialize());

(0, _routes2.default)(app);
server.listen(port, hostname, function () {
  console.log('Server running at http://' + hostname + ':' + port + '/');
});