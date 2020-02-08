'use strict'

import React from 'react';
import ReactDOM from 'react-dom';

const magicCellWidthPx = 128;
const magicCellHeightPx = 32;

class SinglePickerItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const widgetRef = this;
    const props = widgetRef.props;
    const toInheritProps = {
      onClick: function(evt) {
        props.preOnClickTrigger(function() {
          if (null == props.onPress) return;
          props.onPress(React.createElement('div', {
            style: {
              // TODO
            }, 
          }, props.children));
        });
      },
    };
    if (undefined !== props.style && null !== props.style) {
      Object.assign(toInheritProps, {
        style: props.style,
      });
    }
    return (
      <button  
      {...toInheritProps}
      > 
        {props.children}
      </button>
    );
  }
}

class SinglePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false, 
      selectedIdx: null,
    };
  }

  componentDidCatch(error, info) {
    console.log(error, info);
  }

  render() {
    const widgetRef = this;
    const props = widgetRef.props;
    const toInheritProps = {
      id: props.id,
      style: {
        position: 'relative',
        width: magicCellWidthPx + 'px',
        height: magicCellHeightPx + 'px',
      }
    };
  
    if (props.style) {
      Object.assign(toInheritProps.style, props.style);
    }
  
    const titleEle = (
      <button
      key='dropdown-title'
      onClick={ (evt) => {
        widgetRef.setState({
          expanded: (!widgetRef.state.expanded)
        });
      }}
      style={{
        position: 'relative',
        width: '100%',
      }}
      >
        {props.title}
      </button>
    ); 

    if (widgetRef.state.expanded) {
      const children = [];
      props.children.map(function(element, idx) {
        const wrappedChild = React.cloneElement(element, { 
          key: 'dropdown-item-' + idx,
          preOnClickTrigger: function(cb) {
            widgetRef.setState({
              selectedIdx: idx,
              expanded: (!widgetRef.state.expanded)
            }, cb);
          },
          style: {
            position: 'relative',
            padding: 2 + 'px',
            width: '100%',
            color: (idx == widgetRef.state.selectedIdx ? 'blue' : 'black'), 
          }
        }); 
        children.push(wrappedChild);
      });
      const childrenSection = (
        <div
        style={{
          position: 'absolute',
          width: '100%',
        }}
        >
          {children}
        </div>
      );

      return (
        <div 
        {...toInheritProps}
        >
        {titleEle}
        {childrenSection}
        </div>
      );
    } else {
      return (
        <div
        {...toInheritProps}
        >
          {titleEle}
        </div>
      );
    }
  }
}

export {
  SinglePickerItem,
  SinglePicker,
};
