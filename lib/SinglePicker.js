'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var ReactDOM = require('react-dom');

var magicCellWidthPx = 128;
var magicCellHeightPx = 32;

var SinglePickerItem = function (_React$Component) {
  _inherits(SinglePickerItem, _React$Component);

  function SinglePickerItem(props) {
    _classCallCheck(this, SinglePickerItem);

    return _possibleConstructorReturn(this, (SinglePickerItem.__proto__ || Object.getPrototypeOf(SinglePickerItem)).call(this, props));
  }

  _createClass(SinglePickerItem, [{
    key: 'render',
    value: function render() {
      var widgetRef = this;
      var props = widgetRef.props;
      var toInheritProps = {
        onClick: function onClick(evt) {
          props.preOnClickTrigger(function () {
            if (null == props.onPress) return;
            props.onPress(React.createElement('div', {
              style: {
                // TODO
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
      return React.createElement(
        'button',
        toInheritProps,
        props.children
      );
    }
  }]);

  return SinglePickerItem;
}(React.Component);

var SinglePicker = function (_React$Component2) {
  _inherits(SinglePicker, _React$Component2);

  function SinglePicker(props) {
    _classCallCheck(this, SinglePicker);

    var _this2 = _possibleConstructorReturn(this, (SinglePicker.__proto__ || Object.getPrototypeOf(SinglePicker)).call(this, props));

    _this2.state = {
      expanded: false,
      selectedIdx: null
    };
    return _this2;
  }

  _createClass(SinglePicker, [{
    key: 'componentDidCatch',
    value: function componentDidCatch(error, info) {
      console.log(error, info);
    }
  }, {
    key: 'render',
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

      var titleEle = React.createElement(
        'button',
        {
          key: 'dropdown-title',
          onClick: function onClick(evt) {
            widgetRef.setState({
              expanded: !widgetRef.state.expanded
            });
          },
          style: {
            position: 'relative',
            width: '100%'
          }
        },
        props.title
      );

      if (widgetRef.state.expanded) {
        var children = [];
        props.children.map(function (element, idx) {
          var wrappedChild = React.cloneElement(element, {
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
        var childrenSection = React.createElement(
          'div',
          {
            style: {
              position: 'absolute',
              width: '100%'
            }
          },
          children
        );

        return React.createElement(
          'div',
          toInheritProps,
          titleEle,
          childrenSection
        );
      } else {
        return React.createElement(
          'div',
          toInheritProps,
          titleEle
        );
      }
    }
  }]);

  return SinglePicker;
}(React.Component);

exports.SinglePickerItem = SinglePickerItem;
exports.SinglePicker = SinglePicker;

