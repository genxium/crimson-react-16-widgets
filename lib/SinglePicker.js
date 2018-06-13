'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

// TODO: Remove dependencies of `bootstrap` and `react-bootstrap`.
var bootstrapStyle = require('bootstrap/dist/css/bootstrap.min.css');

var MenuItem = require('react-bootstrap/lib/MenuItem');
var SinglePickerItem = React.createClass({
  displayName: 'SinglePickerItem',

  render: function render() {
    var widgetRef = this;
    var props = widgetRef.props;
    var toInheritProps = {
      onClick: props.onPress
    };
    if (undefined !== props.style && null !== props.style) {
      Object.assign(toInheritProps, {
        style: props.style
      });
    }
    return React.createElement(MenuItem, toInheritProps, props.children);
  }
});
exports.SinglePickerItem = SinglePickerItem;

var DropdownButton = require('react-bootstrap/lib/DropdownButton');
var SinglePicker = React.createClass({
  displayName: 'SinglePicker',

  render: function render() {
    var widgetRef = this;
    var props = widgetRef.props;
    var toInheritProps = {
      id: props.id,
      title: props.title
    };
    if (undefined !== props.style && null !== props.style) {
      Object.assign(toInheritProps, {
        style: props.style
      });
    }
    return React.createElement(DropdownButton, toInheritProps, props.children);
  }
});
exports.SinglePicker = SinglePicker;

