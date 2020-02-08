'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SinglePicker = exports.SinglePickerItem = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

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

var magicCellWidthPx = 128;
var magicCellHeightPx = 32;

var SinglePickerItem =
/*#__PURE__*/
function (_React$Component) {
  _inherits(SinglePickerItem, _React$Component);

  function SinglePickerItem(props) {
    _classCallCheck(this, SinglePickerItem);

    return _possibleConstructorReturn(this, _getPrototypeOf(SinglePickerItem).call(this, props));
  }

  _createClass(SinglePickerItem, [{
    key: "render",
    value: function render() {
      var widgetRef = this;
      var props = widgetRef.props;
      var toInheritProps = {
        onClick: function onClick(evt) {
          props.preOnClickTrigger(function () {
            if (null == props.onPress) return;
            props.onPress(_react["default"].createElement('div', {
              style: {// TODO
              }
            }, props.children));
          });
        }
      };

      if (undefined !== props.style && null !== props.style) {
        Object.assign(toInheritProps, {
          style: props.style
        });
      }

      return _react["default"].createElement("button", toInheritProps, props.children);
    }
  }]);

  return SinglePickerItem;
}(_react["default"].Component);

exports.SinglePickerItem = SinglePickerItem;

var SinglePicker =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(SinglePicker, _React$Component2);

  function SinglePicker(props) {
    var _this;

    _classCallCheck(this, SinglePicker);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SinglePicker).call(this, props));
    _this.state = {
      expanded: false,
      selectedIdx: null
    };
    return _this;
  }

  _createClass(SinglePicker, [{
    key: "componentDidCatch",
    value: function componentDidCatch(error, info) {
      console.log(error, info);
    }
  }, {
    key: "render",
    value: function render() {
      var widgetRef = this;
      var props = widgetRef.props;
      var toInheritProps = {
        id: props.id,
        style: {
          position: 'relative',
          width: magicCellWidthPx + 'px',
          height: magicCellHeightPx + 'px'
        }
      };

      if (props.style) {
        Object.assign(toInheritProps.style, props.style);
      }

      var titleEle = _react["default"].createElement("button", {
        key: "dropdown-title",
        onClick: function onClick(evt) {
          widgetRef.setState({
            expanded: !widgetRef.state.expanded
          });
        },
        style: {
          position: 'relative',
          width: '100%'
        }
      }, props.title);

      if (widgetRef.state.expanded) {
        var children = [];
        props.children.map(function (element, idx) {
          var wrappedChild = _react["default"].cloneElement(element, {
            key: 'dropdown-item-' + idx,
            preOnClickTrigger: function preOnClickTrigger(cb) {
              widgetRef.setState({
                selectedIdx: idx,
                expanded: !widgetRef.state.expanded
              }, cb);
            },
            style: {
              position: 'relative',
              padding: 2 + 'px',
              width: '100%',
              color: idx == widgetRef.state.selectedIdx ? 'blue' : 'black'
            }
          });

          children.push(wrappedChild);
        });

        var childrenSection = _react["default"].createElement("div", {
          style: {
            position: 'absolute',
            width: '100%'
          }
        }, children);

        return _react["default"].createElement("div", toInheritProps, titleEle, childrenSection);
      } else {
        return _react["default"].createElement("div", toInheritProps, titleEle);
      }
    }
  }]);

  return SinglePicker;
}(_react["default"].Component);

exports.SinglePicker = SinglePicker;

