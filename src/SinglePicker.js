'use strict'

const React = require('react');
const ReactDOM = require('react-dom');

// TODO: Remove dependencies of `bootstrap` and `react-bootstrap`.
const bootstrapStyle = require('bootstrap/dist/css/bootstrap.min.css');

const MenuItem = require('react-bootstrap/lib/MenuItem');
const SinglePickerItem = React.createClass({
  render: function() {
    const widgetRef = this;
    const props = widgetRef.props;
    const toInheritProps = {
      onClick: props.onPress,
    };
    if (undefined !== props.style && null !== props.style) {
      Object.assign(toInheritProps, {
        style: props.style,
      });
    }
    return React.createElement(MenuItem, toInheritProps, props.children);
  }
});
exports.SinglePickerItem = SinglePickerItem;

const DropdownButton = require('react-bootstrap/lib/DropdownButton');
const SinglePicker = React.createClass({
  render: function() {
    const widgetRef = this;
    const props = widgetRef.props;
    const toInheritProps = {
      id: props.id,
      title: props.title,
    };
    if (undefined !== props.style && null !== props.style) {
      Object.assign(toInheritProps, {
        style: props.style,
      });
    }
    return React.createElement(DropdownButton, toInheritProps, props.children);
  }
});
exports.SinglePicker = SinglePicker;
