'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = parseVariables;

var _nodeSass = require('node-sass');

var _nodeSass2 = _interopRequireDefault(_nodeSass);

var _lodash = require('lodash.camelcase');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function constructSassString(variables) {
  var asVariables = variables.map(function (variable) {
    return '$' + variable.name + ': ' + variable.value + ';';
  }).join('\n');
  var asClasses = variables.map(function (variable) {
    return '.' + variable.name + ' { value: ' + variable.value + ' }';
  }).join('\n');

  return asVariables + '\n' + asClasses;
}

function parseVariables(variables) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var result = _nodeSass2.default.renderSync({
    data: constructSassString(variables),
    outputStyle: 'compact'
  }).css.toString();

  var parsedVariables = result.split(/\n/).filter(function (line) {
    return line && line.length;
  }).map(function (variable) {
    var _$exec = /\.(.+) { value: (.+); }/.exec(variable),
        _$exec2 = _slicedToArray(_$exec, 3),
        name = _$exec2[1],
        value = _$exec2[2];

    var obj = {};

    if (opts.preserveVariableNames) {
      obj[name] = value;
      return obj;
    }

    obj[(0, _lodash2.default)(name)] = value;
    return obj;
  });

  if (!parsedVariables.length) {
    return {};
  }
  return Object.assign.apply(this, parsedVariables);
}