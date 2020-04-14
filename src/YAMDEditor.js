'use strict'

import React from 'react';
import ReactDOM from 'react-dom';

import {
  SinglePicker,
  SinglePickerItem,
} from './SinglePicker';

import YAMDRenderer from './YAMDRenderer';

class YAMDEditor extends React.Component {
  constructor(props) {
    super(props);
    this._inputRef = null;

    this.state = {
      cachedTextToRender: "",
    };
  }

  insertVideoAtCursor(videoIdx) {
    const widgetRef = this;
    if (!widgetRef._inputRef) return;
    const props = widgetRef.props;

    const inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
    const cursorIndex = inputElement.selectionStart;
    const currentValue = widgetRef._inputRef.value;
    const newValue = currentValue.slice(0, cursorIndex) + "\n!{" + props.videoTag + "}%" + videoIdx + "%\n" + currentValue.slice(cursorIndex, currentValue.length);
    props.onContentChangedBridge(newValue);
  }

  insertImageAtCursor(imageIdx) {
    const widgetRef = this;
    if (!widgetRef._inputRef) return;
    const props = widgetRef.props;

    const inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
    const cursorIndex = inputElement.selectionStart;
    const currentValue = widgetRef._inputRef.value;
    const newValue = currentValue.slice(0, cursorIndex) + "\n!{" + props.imgTag + "}%" + imageIdx + "%\n" + currentValue.slice(cursorIndex, currentValue.length);
    props.onContentChangedBridge(newValue);
  }

  shouldHidePreview() {
    const widgetRef = this;
    return (!widgetRef.props.shouldDisable() && widgetRef.state.cachedTextToRender != widgetRef.props.content);
  }

  render() {
    const widgetRef = this;
    const props = widgetRef.props;
    const content = props.content; 
    const previewableVideoList = props.previewableVideoList;
    const previewableImageList = props.previewableImageList;
    
    const shouldDisable = props.shouldDisable;
    const sharedIconStyle = props.sharedIconStyle;

    const onContentChangedBridge = props.onContentChangedBridge;

    const shouldHideShortcutBar = (null == props.shouldHideShortcutBar ? true : props.shouldHideShortcutBar);
    const hideVideoPickerWhenListEmpty = (null == props.hideVideoPickerWhenListEmpty ? true : props.hideVideoPickerWhenListEmpty);
    const hideImagePickerWhenListEmpty = (null == props.hideImagePickerWhenListEmpty ? true : props.hideImagePickerWhenListEmpty);

    let videoItemList = [];
    if (null != previewableVideoList) {
      for (let i = 0; i < previewableVideoList.length; ++i) {
        const singleVideoItem = React.createElement(SinglePickerItem, {
          key: i,
          onPress: (evt) => {
            widgetRef.insertVideoAtCursor(i);
          }
        }, React.createElement('img', {
          src: previewableVideoList[i].poster,
          style: {
            height: 64,
            objectFit: 'cover',
          }
        })); 
        videoItemList.push(singleVideoItem);
      }
    }

    const videoPicker = React.createElement(SinglePicker, {
      id: 'video-picker',
      key: 'video-picker',
      title: props.previewableVideoPickerTitle,
      style: {
        display: (hideVideoPickerWhenListEmpty && 0 == videoItemList.length ? 'none' : 'inline-block'),
      }
    }, videoItemList);

    let imageItemList = [];
    if (null != previewableImageList) {
      for (let i = 0; i < previewableImageList.length; ++i) {
        const singleImageItem = React.createElement(SinglePickerItem, {
          key: i,
          onPress: (evt) => {
            widgetRef.insertImageAtCursor(i);
          }
        }, React.createElement('img', {
          src: previewableImageList[i].src,
          style: {
            height: 64,
            objectFit: 'cover',
          }
        })); 
        imageItemList.push(singleImageItem);
      }
    }

    const imagePicker = React.createElement(SinglePicker, {
      id: 'image-picker',
      key: 'image-picker',
      title: props.previewableImagePickerTitle,
      style: {
        display: (hideImagePickerWhenListEmpty && 0 == imageItemList.length ? 'none' : 'inline-block'),
      }
    }, imageItemList);

    const mathSampleInsertion = React.createElement('button', {
      style: sharedIconStyle,
      onClick: (evt) => {
        if (!widgetRef._inputRef) return;
        const inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
        const cursorIndex = inputElement.selectionStart;
        const currentValue = widgetRef._inputRef.value;
        const newValue = currentValue.slice(0, cursorIndex) + "\n!{katex}% \\mathcal{L}(x) = \\sum\\_{lower}^{upper} \\oint\\_{\\partial \\Pi} \\sqrt{r\\_{\\mu}r^{\\nu} + b^2} \\cdot d\\vec{A} %\n" + currentValue.slice(cursorIndex, currentValue.length);
        onContentChangedBridge(newValue);
      },
    }, props.mathIcon);

    const seqDiagramSampleText = ["sequenceDiagram",
                                  "A->> B: Query",
                                  "B->> C: Forward query",
                                  "Note right of C: Thinking...",
                                  "C-> B: No Arrow",
                                  "B-->> A: Dashed Arrow"].join('\n');

    const seqDiagramInsertion = React.createElement('button', { 
      style: sharedIconStyle,
      onClick: (evt) => {
        if (!widgetRef._inputRef) return;
        const inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
        const cursorIndex = inputElement.selectionStart;
        const currentValue = widgetRef._inputRef.value;
        const newValue = currentValue.slice(0, cursorIndex) + "\n!{mermaid}%\n" + seqDiagramSampleText + "\n%\n" + currentValue.slice(cursorIndex, currentValue.length);
        onContentChangedBridge(newValue);
      },
    }, props.seqDiagramIcon);

    const generalDiagramSampleText = ["graph TD",
                                  "A-->B;",
                                  "A-->C;",
                                  "B-->|text|D;",
                                  "C-.->|dashed|D;"].join('\n');

    const veGraphInsertion = React.createElement('button', { 
      style: sharedIconStyle,
      onClick: (evt) => {
        if (!widgetRef._inputRef) return;
        const inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
        const cursorIndex = inputElement.selectionStart;
        const currentValue = widgetRef._inputRef.value;
        const newValue = currentValue.slice(0, cursorIndex) + "\n!{mermaid}%\n" + generalDiagramSampleText + "\n%\n" + currentValue.slice(cursorIndex, currentValue.length);
        onContentChangedBridge(newValue);
      },
    }, props.veGraphIcon);

    let makeHighlightBtn = null;
    if (props.highlightIcon) {
      makeHighlightBtn = React.createElement('button', {
        style: sharedIconStyle,
        onClick: (evt) => {
          if (!widgetRef._inputRef) return;
          const inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
          const stIndex = inputElement.selectionStart;
          const edIndex = inputElement.selectionEnd;
          if (edIndex <= stIndex) return; 
          const currentValue = widgetRef._inputRef.value;
          const newValue = currentValue.slice(0, stIndex) + "`" + currentValue.slice(stIndex, edIndex) + "`" + currentValue.slice(edIndex, currentValue.length);
          onContentChangedBridge(newValue);
        },
      }, props.highlightIcon);
    }

    let makeBoldBtn = null;
    if (props.boldIcon) {
      makeBoldBtn = React.createElement('button', {
        style: sharedIconStyle,
        onClick: (evt) => {
          if (!widgetRef._inputRef) return;
          const inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
          const stIndex = inputElement.selectionStart;
          const edIndex = inputElement.selectionEnd;
          if (edIndex <= stIndex) return; 
          const currentValue = widgetRef._inputRef.value;
          const newValue = currentValue.slice(0, stIndex) + "**" + currentValue.slice(stIndex, edIndex) + "**" + currentValue.slice(edIndex, currentValue.length);
          onContentChangedBridge(newValue);
        },
      }, props.boldIcon);
    }

    let makeItalicBtn = null;
    if (props.italicIcon) {
      makeItalicBtn = React.createElement('button', {
        style: sharedIconStyle,
        onClick: (evt) => {
          if (!widgetRef._inputRef) return;
          const inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
          const stIndex = inputElement.selectionStart;
          const edIndex = inputElement.selectionEnd;
          if (edIndex <= stIndex) return; 
          const currentValue = widgetRef._inputRef.value;
          const newValue = currentValue.slice(0, stIndex) + " _" + currentValue.slice(stIndex, edIndex) + "_ " + currentValue.slice(edIndex, currentValue.length);
          onContentChangedBridge(newValue);
        }
      }, props.italicIcon);
    }

    const strikeOutBtn = React.createElement('button', {
      style: sharedIconStyle,
      onClick: (evt) => {
        if (!widgetRef._inputRef) return;
        const inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
        const stIndex = inputElement.selectionStart;
        const edIndex = inputElement.selectionEnd;
        if (edIndex <= stIndex) return; 
        const currentValue = widgetRef._inputRef.value;
        const newValue = currentValue.slice(0, stIndex) + "~~" + currentValue.slice(stIndex, edIndex) + "~~" + currentValue.slice(edIndex, currentValue.length);
        onContentChangedBridge(newValue);
      },
    }, props.strikeOutIcon);

    let addFenceBtn = null;
    if (props.fenceIcon) {
      addFenceBtn = React.createElement('button', {
        style: sharedIconStyle,
        onClick: (evt) => {
          if (!widgetRef._inputRef) return;
          const inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
          const stIndex = inputElement.selectionStart;
          const edIndex = inputElement.selectionEnd;
          if (edIndex <= stIndex) return; 
          const currentValue = widgetRef._inputRef.value;
          const newValue = currentValue.slice(0, stIndex) + "\n```\n" + currentValue.slice(stIndex, edIndex) + "\n```\n" + currentValue.slice(edIndex, currentValue.length);
          onContentChangedBridge(newValue);
        }
      }, props.fenceIcon);
    }

    let addLinkBtn = null;
    if (props.hyperlinkIcon) {
      addLinkBtn = React.createElement('button', {
        style: sharedIconStyle,
        onClick: (evt) => {
          if (!widgetRef._inputRef) return;
          const inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
          const stIndex = inputElement.selectionStart;
          const edIndex = inputElement.selectionEnd;
          if (edIndex <= stIndex) return; 
          const currentValue = widgetRef._inputRef.value;
          const newValue = currentValue.slice(0, stIndex) + "[" + currentValue.slice(stIndex, edIndex) + "](http://your.link.here)" + currentValue.slice(edIndex, currentValue.length);
          onContentChangedBridge(newValue);
        }
      }, props.hyperlinkIcon);
    }

    let listInsertion = null;
    if (props.listIcon) {
      const listInsertion = React.createElement('button', {
        style: sharedIconStyle,
        onClick: (evt) => {
          if (!widgetRef._inputRef) return;
          const inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
          const cursorIndex = inputElement.selectionStart;
          const currentValue = widgetRef._inputRef.value;
          const newValue = currentValue.slice(0, cursorIndex) + "\n- item 1\n- item 2\n- item 3\n" + currentValue.slice(cursorIndex, currentValue.length);
          onContentChangedBridge(newValue);
        }
      }, props.listIcon);
    }

    const indentationSampleText = ["> level 1",
                                  ">> level 2", 
                                  "> > > level 3", 
                                  ].join('\n');
    const indentationInsertion = React.createElement('button', {
      style: sharedIconStyle,
      onClick: (evt) => {
        if (!widgetRef._inputRef) return;
        const inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
        const cursorIndex = inputElement.selectionStart;
        const currentValue = widgetRef._inputRef.value;
        const newValue = currentValue.slice(0, cursorIndex) + "\n" + indentationSampleText + "\n" + currentValue.slice(cursorIndex, currentValue.length);
        onContentChangedBridge(newValue);
      }
    }, props.indentationIcon);

    let alignCenterBtn = null;
    if (props.alignCenterIcon) {
      const alignCenterBtnStyle = {};
      Object.assign(alignCenterBtnStyle, sharedIconStyle);
      Object.assign(alignCenterBtnStyle, {
        display: ((!props.alignCenterTag || !props.alignCenterIcon) ? 'none' : 'inline-block'),
      });

      alignCenterBtn = React.createElement('button', {
        style: alignCenterBtnStyle,
        onClick: (evt) => {
          if (!widgetRef._inputRef) return;
          const inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
          const stIndex = inputElement.selectionStart;
          const edIndex = inputElement.selectionEnd;
          if (edIndex <= stIndex) return; 
          const currentValue = widgetRef._inputRef.value;
          const newValue = currentValue.slice(0, stIndex) + "\n!{" + props.alignCenterTag + "}%\n" + currentValue.slice(stIndex, edIndex) + "\n%\n" + currentValue.slice(edIndex, currentValue.length);
          onContentChangedBridge(newValue);
        },
      }, props.alignCenterIcon);
    }

    const shortcutBar = React.createElement('div', {
      key: 'shortcut-bar',
      style: {
        display: (shouldDisable() || shouldHideShortcutBar ? 'none' : 'block'),
        paddingBottom: 3,
      }
    }, videoPicker, imagePicker, makeHighlightBtn, addFenceBtn, makeBoldBtn, makeItalicBtn, strikeOutBtn, addLinkBtn, listInsertion, indentationInsertion, mathSampleInsertion, seqDiagramInsertion, veGraphInsertion, alignCenterBtn); 

    const input = React.createElement('textarea', {
      key: 'md-editor-input',
      style: {
        resize: 'none',
        display: (shouldDisable() ? 'none' : 'block'),
        width: '100%',
        height: 256,
        overflowY: 'auto',
        padding: 10,
      },
      ref: function(c) {
        if (!c) return;
        widgetRef._inputRef = c;
      },
      disabled: shouldDisable(),
      value: content,
      onChange: (evt) => {
        onContentChangedBridge(evt.target.value);
      },
      onCut: (evt) => {
        onContentChangedBridge(evt.target.value);
      },
      onPaste: (evt) => {
        onContentChangedBridge(evt.target.value);
      },
    });

    const container = React.createElement('div', {
      style: props.style,
    }, shortcutBar, input);

    return container;
  }
}

export default YAMDEditor;
