"use strict";
'use-strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

if (undefined === String.prototype.trim) {
  String.prototype.trim = function () {
    return String(this).replace(/^\s+|\s+$/g, '');
  };
}

var KeywordListView =
/*#__PURE__*/
function (_React$Component) {
  _inherits(KeywordListView, _React$Component);

  function KeywordListView(props) {
    _classCallCheck(this, KeywordListView);

    return _possibleConstructorReturn(this, _getPrototypeOf(KeywordListView).call(this, props));
  }

  _createClass(KeywordListView, [{
    key: "_createSingleExistingKeywordView",
    value: function _createSingleExistingKeywordView(idx, singleKeyword) {
      var widgetRef = this;
      var props = widgetRef.props;
      var shouldDisable = props.shouldDisable;
      var View = props.View;
      var Button = props.Button;
      var deleteButtonSymbol = props.deleteButtonSymbol;
      var backgroundColor = props.backgroundColor;
      var fontColor = props.fontColor;
      var deleteButtonStyle = {
        display: shouldDisable() ? 'none' : 'inline-block',
        borderRadius: 20,
        border: 'none',
        paddingTop: 0,
        paddingLeft: 0,
        paddingBottom: 0,
        paddingRight: 5,
        width: 20,
        height: 20,
        backgroundColor: backgroundColor,
        color: fontColor
      };

      if (undefined !== props.deleteButtonStyle && null !== props.deleteButtonStyle) {
        Object.assign(deleteButtonStyle, props.deleteButtonStyle);
      }

      var keywordList = props.keywordList;
      var onSingleKeywordDeleteTriggeredBridge = props.onSingleKeywordDeleteTriggeredBridge;

      var deleteButton = _react["default"].createElement(Button, {
        disabled: shouldDisable(),
        style: deleteButtonStyle,
        onPress: function onPress(evt) {
          onSingleKeywordDeleteTriggeredBridge(idx);
        }
      }, deleteButtonSymbol);

      return _react["default"].createElement(View, {
        key: idx,
        style: {
          display: 'inline-block',
          borderRadius: 15,
          margin: 5,
          backgroundColor: backgroundColor,
          color: fontColor
        }
      }, _react["default"].createElement(View, {
        style: {
          display: 'inline-block',
          padding: 5,
          wordBreak: 'break-word'
        }
      }, singleKeyword), deleteButton);
    }
  }, {
    key: "render",
    value: function render() {
      var widgetRef = this;
      var props = widgetRef.props;
      var View = props.View;
      var Input = props.Input;
      var Button = props.Button;
      var deleteButtonSymbol = props.deleteButtonSymbol;
      var backgroundColor = props.backgroundColor;
      var fontColor = props.fontColor;
      var terminationHint = props.terminationHint;
      var maxCount = props.maxCount;
      var cachedNewKeyword = props.cachedNewKeyword;
      var onTextChangedBridge = props.onTextChangedBridge;
      var shouldDisable = props.shouldDisable;
      var keywordList = props.keywordList;
      var regexForEach = props.regexForEach;
      var onNewKeywordAddTriggeredBridge = props.onNewKeywordAddTriggeredBridge;
      var onRegexViolationBridge = props.onRegexViolationBridge;
      var existingKeywordList = [];

      if (undefined !== keywordList && null !== keywordList && 0 < keywordList.length) {
        for (var i = 0; i < keywordList.length; ++i) {
          existingKeywordList.push(widgetRef._createSingleExistingKeywordView(i, keywordList[i]));
        }
      }

      var shouldDisableInput = shouldDisable() || existingKeywordList.length >= maxCount;

      var newKeywordInput = _react["default"].createElement(Input, {
        key: "new-keyword-input",
        disabled: shouldDisableInput,
        value: cachedNewKeyword,
        placeholder: terminationHint,
        style: {
          display: shouldDisableInput ? 'none' : 'inline-block',
          outline: 'none',
          paddingTop: 3,
          paddingBottom: 3,
          paddingLeft: 6,
          paddingRight: 6,
          borderRadius: '15px',
          borderStyle: 'solid',
          borderColor: 'gray',
          borderWidth: '1px',
          margin: 5
        },
        onChange: function onChange(evt) {
          onTextChangedBridge(evt.target.value);
        },
        onCut: function onCut(evt) {
          onTextChangedBridge(evt.target.value);
        },
        onPaste: function onPaste(evt) {
          onTextChangedBridge(evt.target.value);
        },
        onKeyDown: function onKeyDown(evt) {
          if (evt.keyCode != 13
          /* magic number for RETURN key*/
          && evt.keyCode != 9
          /* magic number for TAB key */
          ) return;
          evt.preventDefault();

          if (regexForEach.test(evt.target.value)) {
            onNewKeywordAddTriggeredBridge(evt.target.value.trim());
          } else {
            onRegexViolationBridge();
          }
        }
      });

      return _react["default"].createElement(View, {
        style: {
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 0,
          paddingRight: 0
        }
      }, existingKeywordList, newKeywordInput);
    }
  }]);

  return KeywordListView;
}(_react["default"].Component);

var _default = KeywordListView;
exports["default"] = _default;

