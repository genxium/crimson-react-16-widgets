'use strict';

require('whatwg-fetch');
var ReactDOM = require('react-dom');

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

var getRenderedComponentSize = function getRenderedComponentSize(ref) {
	// NOTE: This function could ONLY be applied to MOUNTED COMPONENT!!!
	if (undefined === ref || null === ref) return null;
	var domElement = ReactDOM.findDOMNode(ref);
	return {
		width: domElement.clientWidth,
		height: domElement.clientHeight
	};
};

exports.httpGet = httpGet;
exports.getRenderedComponentSize = getRenderedComponentSize;

