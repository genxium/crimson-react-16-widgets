'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var ReactDOM = require('react-dom');

var SinglePicker = require('./SinglePicker').SinglePicker;
var SinglePickerItem = require('./SinglePicker').SinglePickerItem;
var YAMDRenderer = require('./YAMDRenderer').default;

var YAMDEditor = function (_React$Component) {
  _inherits(YAMDEditor, _React$Component);

  function YAMDEditor(props) {
    _classCallCheck(this, YAMDEditor);

    var _this = _possibleConstructorReturn(this, (YAMDEditor.__proto__ || Object.getPrototypeOf(YAMDEditor)).call(this, props));

    _initialiseProps.call(_this);

    _this._inputRef = null;
    _this._previewRef = null;

    _this.state = {
      cachedTextToRender: ""
    };
    return _this;
  }

  _createClass(YAMDEditor, [{
    key: 'render',
    value: function render() {
      var widgetRef = this;
      var props = widgetRef.props;
      var content = props.content;
      var previewableVideoList = props.previewableVideoList;
      var previewableImageList = props.previewableImageList;

      var shouldDisable = props.shouldDisable;
      var sharedIconStyle = props.sharedIconStyle;

      var onContentChangedBridge = props.onContentChangedBridge;

      var shouldHideShortcutBar = undefined == props.shouldHideShortcutBar || null == props.shouldHideShortcutBar ? true : props.shouldHideShortcutBar;
      var hideVideoPickerWhenListEmpty = undefined == props.hideVideoPickerWhenListEmpty || null == props.hideVideoPickerWhenListEmpty ? true : props.hideVideoPickerWhenListEmpty;
      var hideImagePickerWhenListEmpty = undefined == props.hideImagePickerWhenListEmpty || null == props.hideImagePickerWhenListEmpty ? true : props.hideImagePickerWhenListEmpty;

      var videoItemList = [];
      if (undefined !== previewableVideoList && null !== previewableVideoList) {
        var _loop = function _loop(i) {
          var singleVideoItem = React.createElement(SinglePickerItem, {
            key: i,
            onPress: function onPress(evt) {
              widgetRef.insertVideoAtCursor(i);
            }
          }, React.createElement('img', {
            src: previewableVideoList[i].poster,
            style: {
              height: 64,
              objectFit: 'cover'
            }
          }));
          videoItemList.push(singleVideoItem);
        };

        for (var i = 0; i < previewableVideoList.length; ++i) {
          _loop(i);
        }
      }

      var videoPicker = React.createElement(SinglePicker, {
        id: 'video-picker',
        key: 'video-picker',
        title: props.previewableVideoPickerTitle,
        style: {
          display: hideVideoPickerWhenListEmpty && 0 == videoItemList.length ? 'none' : 'inline-block'
        }
      }, videoItemList);

      var imageItemList = [];
      if (undefined !== previewableImageList && null !== previewableImageList) {
        var _loop2 = function _loop2(i) {
          var singleImageItem = React.createElement(SinglePickerItem, {
            key: i,
            onPress: function onPress(evt) {
              widgetRef.insertImageAtCursor(i);
            }
          }, React.createElement('img', {
            src: previewableImageList[i].src,
            style: {
              height: 64,
              objectFit: 'cover'
            }
          }));
          imageItemList.push(singleImageItem);
        };

        for (var i = 0; i < previewableImageList.length; ++i) {
          _loop2(i);
        }
      }

      var imagePicker = React.createElement(SinglePicker, {
        id: 'image-picker',
        key: 'image-picker',
        title: props.previewableImagePickerTitle,
        style: {
          display: hideImagePickerWhenListEmpty && 0 == imageItemList.length ? 'none' : 'inline-block'
        }
      }, imageItemList);

      var mathSampleInsertion = React.createElement('button', {
        style: sharedIconStyle,
        onClick: function onClick(evt) {
          if (!widgetRef._inputRef) return;
          var inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
          var cursorIndex = inputElement.selectionStart;
          var currentValue = widgetRef._inputRef.value;
          var newValue = currentValue.slice(0, cursorIndex) + "\n!{katex}% \\mathcal{L}(x) = \\sum\\_{lower}^{upper} \\oint\\_{\\partial \\Pi} \\sqrt{r\\_{\\mu}r^{\\nu} + b^2} \\cdot d\\vec{A} %\n" + currentValue.slice(cursorIndex, currentValue.length);
          onContentChangedBridge(newValue);
        }
      }, props.mathIcon);

      var seqDiagramSampleText = ["sequenceDiagram", "A->> B: Query", "B->> C: Forward query", "Note right of C: Thinking...", "C-> B: No Arrow", "B-->> A: Dashed Arrow"].join('\n');

      var seqDiagramInsertion = React.createElement('button', {
        style: sharedIconStyle,
        onClick: function onClick(evt) {
          if (!widgetRef._inputRef) return;
          var inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
          var cursorIndex = inputElement.selectionStart;
          var currentValue = widgetRef._inputRef.value;
          var newValue = currentValue.slice(0, cursorIndex) + "\n!{mermaid}%\n" + seqDiagramSampleText + "\n%\n" + currentValue.slice(cursorIndex, currentValue.length);
          onContentChangedBridge(newValue);
        }
      }, props.seqDiagramIcon);

      var generalDiagramSampleText = ["graph TD", "A-->B;", "A-->C;", "B-->|text|D;", "C-.->|dashed|D;"].join('\n');

      var veGraphInsertion = React.createElement('button', {
        style: sharedIconStyle,
        onClick: function onClick(evt) {
          if (!widgetRef._inputRef) return;
          var inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
          var cursorIndex = inputElement.selectionStart;
          var currentValue = widgetRef._inputRef.value;
          var newValue = currentValue.slice(0, cursorIndex) + "\n!{mermaid}%\n" + generalDiagramSampleText + "\n%\n" + currentValue.slice(cursorIndex, currentValue.length);
          onContentChangedBridge(newValue);
        }
      }, props.veGraphIcon);

      var makeHighlightBtn = null;
      if (props.highlightIcon) {
        makeHighlightBtn = React.createElement('button', {
          style: sharedIconStyle,
          onClick: function onClick(evt) {
            if (!widgetRef._inputRef) return;
            var inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
            var stIndex = inputElement.selectionStart;
            var edIndex = inputElement.selectionEnd;
            if (edIndex <= stIndex) return;
            var currentValue = widgetRef._inputRef.value;
            var newValue = currentValue.slice(0, stIndex) + "`" + currentValue.slice(stIndex, edIndex) + "`" + currentValue.slice(edIndex, currentValue.length);
            onContentChangedBridge(newValue);
          }
        }, props.highlightIcon);
      }

      var makeBoldBtn = null;
      if (props.boldIcon) {
        makeBoldBtn = React.createElement('button', {
          style: sharedIconStyle,
          onClick: function onClick(evt) {
            if (!widgetRef._inputRef) return;
            var inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
            var stIndex = inputElement.selectionStart;
            var edIndex = inputElement.selectionEnd;
            if (edIndex <= stIndex) return;
            var currentValue = widgetRef._inputRef.value;
            var newValue = currentValue.slice(0, stIndex) + "**" + currentValue.slice(stIndex, edIndex) + "**" + currentValue.slice(edIndex, currentValue.length);
            onContentChangedBridge(newValue);
          }
        }, props.boldIcon);
      }

      var makeItalicBtn = null;
      if (props.italicIcon) {
        makeItalicBtn = React.createElement('button', {
          style: sharedIconStyle,
          onClick: function onClick(evt) {
            if (!widgetRef._inputRef) return;
            var inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
            var stIndex = inputElement.selectionStart;
            var edIndex = inputElement.selectionEnd;
            if (edIndex <= stIndex) return;
            var currentValue = widgetRef._inputRef.value;
            var newValue = currentValue.slice(0, stIndex) + " _" + currentValue.slice(stIndex, edIndex) + "_ " + currentValue.slice(edIndex, currentValue.length);
            onContentChangedBridge(newValue);
          }
        }, props.italicIcon);
      }

      var strikeOutBtn = React.createElement('button', {
        style: sharedIconStyle,
        onClick: function onClick(evt) {
          if (!widgetRef._inputRef) return;
          var inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
          var stIndex = inputElement.selectionStart;
          var edIndex = inputElement.selectionEnd;
          if (edIndex <= stIndex) return;
          var currentValue = widgetRef._inputRef.value;
          var newValue = currentValue.slice(0, stIndex) + "~~" + currentValue.slice(stIndex, edIndex) + "~~" + currentValue.slice(edIndex, currentValue.length);
          onContentChangedBridge(newValue);
        }
      }, props.strikeOutIcon);

      var addFenceBtn = null;
      if (props.fenceIcon) {
        addFenceBtn = React.createElement('button', {
          style: sharedIconStyle,
          onClick: function onClick(evt) {
            if (!widgetRef._inputRef) return;
            var inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
            var stIndex = inputElement.selectionStart;
            var edIndex = inputElement.selectionEnd;
            if (edIndex <= stIndex) return;
            var currentValue = widgetRef._inputRef.value;
            var newValue = currentValue.slice(0, stIndex) + "\n```\n" + currentValue.slice(stIndex, edIndex) + "\n```\n" + currentValue.slice(edIndex, currentValue.length);
            onContentChangedBridge(newValue);
          }
        }, props.fenceIcon);
      }

      var addLinkBtn = null;
      if (props.hyperlinkIcon) {
        addLinkBtn = React.createElement('button', {
          style: sharedIconStyle,
          onClick: function onClick(evt) {
            if (!widgetRef._inputRef) return;
            var inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
            var stIndex = inputElement.selectionStart;
            var edIndex = inputElement.selectionEnd;
            if (edIndex <= stIndex) return;
            var currentValue = widgetRef._inputRef.value;
            var newValue = currentValue.slice(0, stIndex) + "[" + currentValue.slice(stIndex, edIndex) + "](http://your.link.here)" + currentValue.slice(edIndex, currentValue.length);
            onContentChangedBridge(newValue);
          }
        }, props.hyperlinkIcon);
      }

      var listInsertion = null;
      if (props.listIcon) {
        var _listInsertion = React.createElement('button', {
          style: sharedIconStyle,
          onClick: function onClick(evt) {
            if (!widgetRef._inputRef) return;
            var inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
            var cursorIndex = inputElement.selectionStart;
            var currentValue = widgetRef._inputRef.value;
            var newValue = currentValue.slice(0, cursorIndex) + "\n- item 1\n- item 2\n- item 3\n" + currentValue.slice(cursorIndex, currentValue.length);
            onContentChangedBridge(newValue);
          }
        }, props.listIcon);
      }

      var indentationSampleText = ["> level 1", ">> level 2", "> > > level 3"].join('\n');
      var indentationInsertion = React.createElement('button', {
        style: sharedIconStyle,
        onClick: function onClick(evt) {
          if (!widgetRef._inputRef) return;
          var inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
          var cursorIndex = inputElement.selectionStart;
          var currentValue = widgetRef._inputRef.value;
          var newValue = currentValue.slice(0, cursorIndex) + "\n" + indentationSampleText + "\n" + currentValue.slice(cursorIndex, currentValue.length);
          onContentChangedBridge(newValue);
        }
      }, props.indentationIcon);

      var alignCenterBtn = null;
      if (props.alignCenterIcon) {
        var alignCenterBtnStyle = {};
        Object.assign(alignCenterBtnStyle, sharedIconStyle);
        Object.assign(alignCenterBtnStyle, {
          display: !props.alignCenterTag || !props.alignCenterIcon ? 'none' : 'inline-block'
        });

        alignCenterBtn = React.createElement('button', {
          style: alignCenterBtnStyle,
          onClick: function onClick(evt) {
            if (!widgetRef._inputRef) return;
            var inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
            var stIndex = inputElement.selectionStart;
            var edIndex = inputElement.selectionEnd;
            if (edIndex <= stIndex) return;
            var currentValue = widgetRef._inputRef.value;
            var newValue = currentValue.slice(0, stIndex) + "\n!{" + props.alignCenterTag + "}%\n" + currentValue.slice(stIndex, edIndex) + "\n%\n" + currentValue.slice(edIndex, currentValue.length);
            onContentChangedBridge(newValue);
          }
        }, props.alignCenterIcon);
      }

      var shortcutBar = React.createElement('div', {
        key: 'shortcut-bar',
        style: {
          display: shouldDisable() || shouldHideShortcutBar ? 'none' : 'block',
          paddingBottom: 3
        }
      }, videoPicker, imagePicker, makeHighlightBtn, addFenceBtn, makeBoldBtn, makeItalicBtn, strikeOutBtn, addLinkBtn, listInsertion, indentationInsertion, mathSampleInsertion, seqDiagramInsertion, veGraphInsertion, alignCenterBtn);

      var input = React.createElement('textarea', {
        key: 'md-editor-input',
        style: {
          resize: 'none',
          display: shouldDisable() ? 'none' : 'block',
          width: '100%',
          height: 256,
          overflowY: 'auto',
          padding: 10
        },
        ref: function ref(c) {
          if (!c) return;
          widgetRef._inputRef = c;
        },
        disabled: shouldDisable(),
        value: content,
        onChange: function onChange(evt) {
          onContentChangedBridge(evt.target.value);
        },
        onCut: function onCut(evt) {
          onContentChangedBridge(evt.target.value);
        },
        onPaste: function onPaste(evt) {
          onContentChangedBridge(evt.target.value);
        }
      });

      var refreshPreviewBtn = React.createElement('div', {
        style: {
          marginTop: 3,
          display: widgetRef.state.cachedTextToRender == content || shouldDisable() ? 'none' : 'block',
          textAlign: 'center',
          width: '100%'
        }
      }, React.createElement('button', {
        disabled: shouldDisable(),
        style: {
          fontSize: 14
        },
        onClick: function onClick(evt) {
          widgetRef.setState({
            cachedTextToRender: content
          });
        }
      }, props.previewHint));

      var shouldHidePreview = !shouldDisable() && widgetRef.state.cachedTextToRender != content;
      var previewSrc = shouldDisable() ? content : widgetRef.state.cachedTextToRender;

      var preview = React.createElement(YAMDRenderer, {
        style: {
          marginTop: 3,
          width: '100%',
          display: shouldHidePreview ? 'none' : 'block',
          padding: 10
        },
        imgTag: props.imgTag,
        ktxTag: props.ktxTag,
        mermaidTag: props.mermaidTag,
        alignCenterTag: props.alignCenterTag,
        previewableVideoList: previewableVideoList,
        previewableImageList: previewableImageList,
        source: previewSrc,
        ref: function ref(c) {
          if (!c) return;
          widgetRef._previewRef = c;
        }
      });

      var container = React.createElement('div', {
        style: props.style
      }, shortcutBar, input, refreshPreviewBtn, preview);

      return container;
    }
  }]);

  return YAMDEditor;
}(React.Component);

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.insertVideoAtCursor = function (videoIdx) {
    var widgetRef = _this2;
    if (!widgetRef._inputRef) return;
    var props = widgetRef.props;

    var inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
    var cursorIndex = inputElement.selectionStart;
    var currentValue = widgetRef._inputRef.value;
    var newValue = currentValue.slice(0, cursorIndex) + "\n!{" + props.videoTag + "}%" + videoIdx + "%\n" + currentValue.slice(cursorIndex, currentValue.length);
    props.onContentChangedBridge(newValue);
  };

  this.insertImageAtCursor = function (imageIdx) {
    var widgetRef = _this2;
    if (!widgetRef._inputRef) return;
    var props = widgetRef.props;

    var inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
    var cursorIndex = inputElement.selectionStart;
    var currentValue = widgetRef._inputRef.value;
    var newValue = currentValue.slice(0, cursorIndex) + "\n!{" + props.imgTag + "}%" + imageIdx + "%\n" + currentValue.slice(cursorIndex, currentValue.length);
    props.onContentChangedBridge(newValue);
  };
};

exports.default = YAMDEditor;

