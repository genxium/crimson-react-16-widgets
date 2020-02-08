'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _SinglePicker = require("./SinglePicker");

var _YAMDRenderer = _interopRequireDefault(require("./YAMDRenderer"));

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

var YAMDEditor =
/*#__PURE__*/
function (_React$Component) {
  _inherits(YAMDEditor, _React$Component);

  function YAMDEditor(props) {
    var _this;

    _classCallCheck(this, YAMDEditor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(YAMDEditor).call(this, props));
    _this._inputRef = null;
    _this._previewRef = null;
    _this.state = {
      cachedTextToRender: ""
    };
    return _this;
  }

  _createClass(YAMDEditor, [{
    key: "insertVideoAtCursor",
    value: function insertVideoAtCursor(videoIdx) {
      var widgetRef = this;
      if (!widgetRef._inputRef) return;
      var props = widgetRef.props;

      var inputElement = _reactDom["default"].findDOMNode(widgetRef._inputRef);

      var cursorIndex = inputElement.selectionStart;
      var currentValue = widgetRef._inputRef.value;
      var newValue = currentValue.slice(0, cursorIndex) + "\n!{" + props.videoTag + "}%" + videoIdx + "%\n" + currentValue.slice(cursorIndex, currentValue.length);
      props.onContentChangedBridge(newValue);
    }
  }, {
    key: "insertImageAtCursor",
    value: function insertImageAtCursor(imageIdx) {
      var widgetRef = this;
      if (!widgetRef._inputRef) return;
      var props = widgetRef.props;

      var inputElement = _reactDom["default"].findDOMNode(widgetRef._inputRef);

      var cursorIndex = inputElement.selectionStart;
      var currentValue = widgetRef._inputRef.value;
      var newValue = currentValue.slice(0, cursorIndex) + "\n!{" + props.imgTag + "}%" + imageIdx + "%\n" + currentValue.slice(cursorIndex, currentValue.length);
      props.onContentChangedBridge(newValue);
    }
  }, {
    key: "render",
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
          var singleVideoItem = _react["default"].createElement(_SinglePicker.SinglePickerItem, {
            key: i,
            onPress: function onPress(evt) {
              widgetRef.insertVideoAtCursor(i);
            }
          }, _react["default"].createElement('img', {
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

      var videoPicker = _react["default"].createElement(_SinglePicker.SinglePicker, {
        id: 'video-picker',
        key: 'video-picker',
        title: props.previewableVideoPickerTitle,
        style: {
          display: hideVideoPickerWhenListEmpty && 0 == videoItemList.length ? 'none' : 'inline-block'
        }
      }, videoItemList);

      var imageItemList = [];

      if (undefined !== previewableImageList && null !== previewableImageList) {
        var _loop2 = function _loop2(_i) {
          var singleImageItem = _react["default"].createElement(_SinglePicker.SinglePickerItem, {
            key: _i,
            onPress: function onPress(evt) {
              widgetRef.insertImageAtCursor(_i);
            }
          }, _react["default"].createElement('img', {
            src: previewableImageList[_i].src,
            style: {
              height: 64,
              objectFit: 'cover'
            }
          }));

          imageItemList.push(singleImageItem);
        };

        for (var _i = 0; _i < previewableImageList.length; ++_i) {
          _loop2(_i);
        }
      }

      var imagePicker = _react["default"].createElement(_SinglePicker.SinglePicker, {
        id: 'image-picker',
        key: 'image-picker',
        title: props.previewableImagePickerTitle,
        style: {
          display: hideImagePickerWhenListEmpty && 0 == imageItemList.length ? 'none' : 'inline-block'
        }
      }, imageItemList);

      var mathSampleInsertion = _react["default"].createElement('button', {
        style: sharedIconStyle,
        onClick: function onClick(evt) {
          if (!widgetRef._inputRef) return;

          var inputElement = _reactDom["default"].findDOMNode(widgetRef._inputRef);

          var cursorIndex = inputElement.selectionStart;
          var currentValue = widgetRef._inputRef.value;
          var newValue = currentValue.slice(0, cursorIndex) + "\n!{katex}% \\mathcal{L}(x) = \\sum\\_{lower}^{upper} \\oint\\_{\\partial \\Pi} \\sqrt{r\\_{\\mu}r^{\\nu} + b^2} \\cdot d\\vec{A} %\n" + currentValue.slice(cursorIndex, currentValue.length);
          onContentChangedBridge(newValue);
        }
      }, props.mathIcon);

      var seqDiagramSampleText = ["sequenceDiagram", "A->> B: Query", "B->> C: Forward query", "Note right of C: Thinking...", "C-> B: No Arrow", "B-->> A: Dashed Arrow"].join('\n');

      var seqDiagramInsertion = _react["default"].createElement('button', {
        style: sharedIconStyle,
        onClick: function onClick(evt) {
          if (!widgetRef._inputRef) return;

          var inputElement = _reactDom["default"].findDOMNode(widgetRef._inputRef);

          var cursorIndex = inputElement.selectionStart;
          var currentValue = widgetRef._inputRef.value;
          var newValue = currentValue.slice(0, cursorIndex) + "\n!{mermaid}%\n" + seqDiagramSampleText + "\n%\n" + currentValue.slice(cursorIndex, currentValue.length);
          onContentChangedBridge(newValue);
        }
      }, props.seqDiagramIcon);

      var generalDiagramSampleText = ["graph TD", "A-->B;", "A-->C;", "B-->|text|D;", "C-.->|dashed|D;"].join('\n');

      var veGraphInsertion = _react["default"].createElement('button', {
        style: sharedIconStyle,
        onClick: function onClick(evt) {
          if (!widgetRef._inputRef) return;

          var inputElement = _reactDom["default"].findDOMNode(widgetRef._inputRef);

          var cursorIndex = inputElement.selectionStart;
          var currentValue = widgetRef._inputRef.value;
          var newValue = currentValue.slice(0, cursorIndex) + "\n!{mermaid}%\n" + generalDiagramSampleText + "\n%\n" + currentValue.slice(cursorIndex, currentValue.length);
          onContentChangedBridge(newValue);
        }
      }, props.veGraphIcon);

      var makeHighlightBtn = null;

      if (props.highlightIcon) {
        makeHighlightBtn = _react["default"].createElement('button', {
          style: sharedIconStyle,
          onClick: function onClick(evt) {
            if (!widgetRef._inputRef) return;

            var inputElement = _reactDom["default"].findDOMNode(widgetRef._inputRef);

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
        makeBoldBtn = _react["default"].createElement('button', {
          style: sharedIconStyle,
          onClick: function onClick(evt) {
            if (!widgetRef._inputRef) return;

            var inputElement = _reactDom["default"].findDOMNode(widgetRef._inputRef);

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
        makeItalicBtn = _react["default"].createElement('button', {
          style: sharedIconStyle,
          onClick: function onClick(evt) {
            if (!widgetRef._inputRef) return;

            var inputElement = _reactDom["default"].findDOMNode(widgetRef._inputRef);

            var stIndex = inputElement.selectionStart;
            var edIndex = inputElement.selectionEnd;
            if (edIndex <= stIndex) return;
            var currentValue = widgetRef._inputRef.value;
            var newValue = currentValue.slice(0, stIndex) + " _" + currentValue.slice(stIndex, edIndex) + "_ " + currentValue.slice(edIndex, currentValue.length);
            onContentChangedBridge(newValue);
          }
        }, props.italicIcon);
      }

      var strikeOutBtn = _react["default"].createElement('button', {
        style: sharedIconStyle,
        onClick: function onClick(evt) {
          if (!widgetRef._inputRef) return;

          var inputElement = _reactDom["default"].findDOMNode(widgetRef._inputRef);

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
        addFenceBtn = _react["default"].createElement('button', {
          style: sharedIconStyle,
          onClick: function onClick(evt) {
            if (!widgetRef._inputRef) return;

            var inputElement = _reactDom["default"].findDOMNode(widgetRef._inputRef);

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
        addLinkBtn = _react["default"].createElement('button', {
          style: sharedIconStyle,
          onClick: function onClick(evt) {
            if (!widgetRef._inputRef) return;

            var inputElement = _reactDom["default"].findDOMNode(widgetRef._inputRef);

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
        var _listInsertion = _react["default"].createElement('button', {
          style: sharedIconStyle,
          onClick: function onClick(evt) {
            if (!widgetRef._inputRef) return;

            var inputElement = _reactDom["default"].findDOMNode(widgetRef._inputRef);

            var cursorIndex = inputElement.selectionStart;
            var currentValue = widgetRef._inputRef.value;
            var newValue = currentValue.slice(0, cursorIndex) + "\n- item 1\n- item 2\n- item 3\n" + currentValue.slice(cursorIndex, currentValue.length);
            onContentChangedBridge(newValue);
          }
        }, props.listIcon);
      }

      var indentationSampleText = ["> level 1", ">> level 2", "> > > level 3"].join('\n');

      var indentationInsertion = _react["default"].createElement('button', {
        style: sharedIconStyle,
        onClick: function onClick(evt) {
          if (!widgetRef._inputRef) return;

          var inputElement = _reactDom["default"].findDOMNode(widgetRef._inputRef);

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
        alignCenterBtn = _react["default"].createElement('button', {
          style: alignCenterBtnStyle,
          onClick: function onClick(evt) {
            if (!widgetRef._inputRef) return;

            var inputElement = _reactDom["default"].findDOMNode(widgetRef._inputRef);

            var stIndex = inputElement.selectionStart;
            var edIndex = inputElement.selectionEnd;
            if (edIndex <= stIndex) return;
            var currentValue = widgetRef._inputRef.value;
            var newValue = currentValue.slice(0, stIndex) + "\n!{" + props.alignCenterTag + "}%\n" + currentValue.slice(stIndex, edIndex) + "\n%\n" + currentValue.slice(edIndex, currentValue.length);
            onContentChangedBridge(newValue);
          }
        }, props.alignCenterIcon);
      }

      var shortcutBar = _react["default"].createElement('div', {
        key: 'shortcut-bar',
        style: {
          display: shouldDisable() || shouldHideShortcutBar ? 'none' : 'block',
          paddingBottom: 3
        }
      }, videoPicker, imagePicker, makeHighlightBtn, addFenceBtn, makeBoldBtn, makeItalicBtn, strikeOutBtn, addLinkBtn, listInsertion, indentationInsertion, mathSampleInsertion, seqDiagramInsertion, veGraphInsertion, alignCenterBtn);

      var input = _react["default"].createElement('textarea', {
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

      var refreshPreviewBtn = _react["default"].createElement('div', {
        style: {
          marginTop: 3,
          display: widgetRef.state.cachedTextToRender == content || shouldDisable() ? 'none' : 'block',
          textAlign: 'center',
          width: '100%'
        }
      }, _react["default"].createElement('button', {
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

      var preview = _react["default"].createElement(_YAMDRenderer["default"], {
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

      var container = _react["default"].createElement('div', {
        style: props.style
      }, shortcutBar, input, refreshPreviewBtn, preview);

      return container;
    }
  }]);

  return YAMDEditor;
}(_react["default"].Component);

var _default = YAMDEditor;
exports["default"] = _default;

