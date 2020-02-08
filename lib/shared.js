'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRenderedComponentSize = exports.httpGet = void 0;

require("whatwg-fetch");

var _reactDom = _interopRequireDefault(require("react-dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var dictToSortedQueryStr = function dictToSortedQueryStr(dict) {
  var keys = Object.keys(dict);
  keys.sort();
  var paramList = [];

  for (var idx = 0; idx < keys.length; ++idx) {
    var k = keys[idx];
    var v = dict[k];
    paramList.push(k + "=" + encodeURIComponent(v));
  }

  return paramList.join('&');
};

var httpGet = function httpGet(url, paramsDict) {
  if (!paramsDict || Object.keys(paramsDict).length == 0) return fetch(url, {
    credentials: 'same-origin'
  });
  var concatenated = url + "?" + dictToSortedQueryStr(paramsDict);
  return fetch(concatenated, {
    credentials: 'same-origin'
  });
};

exports.httpGet = httpGet;

var getRenderedComponentSize = function getRenderedComponentSize(ref) {
  // NOTE: This function could ONLY be applied to MOUNTED COMPONENT!!!
  if (undefined === ref || null === ref) return null;

  var domElement = _reactDom["default"].findDOMNode(ref);

  return {
    width: domElement.clientWidth,
    height: domElement.clientHeight
  };
};

exports.getRenderedComponentSize = getRenderedComponentSize;

