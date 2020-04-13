'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _ImageSelectorBundle = require("./ImageSelectorBundle");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var LIST_INDEX = 'listIndex'; // These modules are exported by CommonJs "module.exports = " syntax.

var PlupLoad = require('plupload');

var StatelessSingleImageSelector =
/*#__PURE__*/
function (_React$Component) {
  _inherits(StatelessSingleImageSelector, _React$Component);

  function StatelessSingleImageSelector(props) {
    var _this;

    _classCallCheck(this, StatelessSingleImageSelector);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(StatelessSingleImageSelector).call(this, props));
    _this._browseBtnRef = null;

    var widgetRef = _assertThisInitialized(_this);

    widgetRef._previewLoader = new FileReader();

    widgetRef._previewLoader.onload = function (evt) {
      widgetRef.props.onLocalImageAddedBridge(widgetRef.props.listIndex, {
        uploaderState: _ImageSelectorBundle.SINGLE_UPLOADER_STATE.LOCALLY_PREVIEWING,
        effectiveImgSrc: evt.target.result
      });
    };

    return _this;
  }

  _createClass(StatelessSingleImageSelector, [{
    key: "_updatePluploadExtUploaderListIndex",
    value: function _updatePluploadExtUploaderListIndex() {
      var widgetRef = this;
      var props = widgetRef.props;
      var bundle = props.bundle;
      if (!bundle) return;
      var extUploader = bundle.extUploader;
      if (!extUploader) return;
      extUploader.setOption({
        listIndex: widgetRef.props.listIndex
      });
    }
  }, {
    key: "_initializePluploadExtUploaderEvtBinding",
    value: function _initializePluploadExtUploaderEvtBinding(extUploader) {
      var widgetRef = this;
      var props = widgetRef.props;
      var bundle = props.bundle;
      var shouldDisable = props.shouldDisable;
      var onLocalImageAddedBridge = props.onLocalImageAddedBridge;
      var onUploadedBridge = props.onUploadedBridge;
      var onProgressBridge = props.onProgressBridge;
      extUploader.bind('FilesAdded', function (up, files) {
        var targetFile = files[0];
        var uploaderSelf = this;
        var listIndex = parseInt(uploaderSelf.getOption(LIST_INDEX)); // NOTE: Remove previously added files in the uploader buffer.

        for (var k in uploaderSelf.files) {
          var single = uploaderSelf.files[k];
          if (single && single.id == targetFile.id) continue;
          uploaderSelf.removeFile(single);
        }

        if (!widgetRef._validateSelection(targetFile)) {
          props.showFileRequirementHint();
          onLocalImageAddedBridge(listIndex, {
            effectiveImgSrc: null
          });
          return;
        }

        uploaderSelf.disableBrowse(); // NOTE: Browsing is disabled once a valid image is added for previewing.

        uploaderSelf.refresh();

        widgetRef._previewLoader.readAsDataURL(targetFile.getNative());
      });
      extUploader.bind('UploadProgress', function (up, file) {
        var uploaderSelf = this;
        var listIndex = parseInt(uploaderSelf.getOption(LIST_INDEX));
        onProgressBridge(listIndex, {
          uploaderState: _ImageSelectorBundle.SINGLE_UPLOADER_STATE.UPLOADING,
          progressPercentage: file.percent
        });
      });
      extUploader.bind('FileUploaded', function (up, file, info) {
        var uploaderSelf = this;
        var listIndex = parseInt(uploaderSelf.getOption(LIST_INDEX));
        onUploadedBridge(listIndex, true);
      });
      extUploader.bind('Error', function (up, err) {
        var uploaderSelf = this;
        var listIndex = parseInt(uploaderSelf.getOption(LIST_INDEX));
        onUploadedBridge(listIndex, false);
      });
    }
  }, {
    key: "_softReset",
    value: function _softReset() {
      var widgetRef = this;
      var props = widgetRef.props;
      var bundle = props.bundle;
      if (null === bundle || undefined === bundle) return;

      if (_ImageSelectorBundle.SINGLE_UPLOADER_STATE.CREATED != bundle.uploaderState) {
        if (undefined === bundle.extUploader || null === bundle.extUploader) return;

        widgetRef._updatePluploadExtUploaderListIndex();

        bundle.extUploader.refresh(); // NOTE: This is to update the `overlying browseButton` height according to the `seemingly browseButton` height. 

        bundle.extUploader.disableBrowse(props.shouldDisable());
        return;
      }

      var extUploader = widgetRef.createExtUploader();

      widgetRef._initializePluploadExtUploaderEvtBinding(extUploader);

      props.onNewBundleInitializedBridge(widgetRef.props.listIndex, {
        uploaderState: _ImageSelectorBundle.SINGLE_UPLOADER_STATE.INITIALIZED,
        progressPercentage: 0.0,
        effectiveImgSrc: null,
        extUploader: extUploader
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var widgetRef = this;

      widgetRef._softReset();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var widgetRef = this;

      widgetRef._softReset();
    }
  }, {
    key: "getPreviewableImage",
    value: function getPreviewableImage() {
      return {
        src: this.props.bundle.effectiveImgSrc
      };
    }
  }, {
    key: "createExtUploader",
    value: function createExtUploader() {
      var widgetRef = this; // Reference http://www.plupload.com/docs/v2/Uploader.

      var uploader = new PlupLoad.Uploader({
        browse_button: _reactDom["default"].findDOMNode(widgetRef._browseBtnRef),
        multi_selection: false
      });
      uploader.init();
      return uploader;
    }
  }, {
    key: "startUpload",
    value: function startUpload() {
      var widgetRef = this;
      var props = widgetRef.props;
      var listIndex = props.listIndex;
      var onUploadedBridge = props.onUploadedBridge;
      var bundle = props.bundle;

      if (_ImageSelectorBundle.SINGLE_UPLOADER_STATE.UPLOADED == bundle.uploaderState) {
        onUploadedBridge(listIndex, true);
        return;
      }

      if (_ImageSelectorBundle.SINGLE_UPLOADER_STATE.LOCALLY_PREVIEWING != bundle.uploaderState) {
        // NOTE: Invalid block here, the player should NEVER trigger this block.
        return;
      }
      /*
        // Besides, typical credentials, e.g. `upload token` or simply `uptoken`, are set into the http request headers or multipart body. In the case of plupload with Chinenet as CDN provider, one might have to set the followings. 
         url: <host endpoint>,
        multipart_params: {
          // Add extra multipart {name => value} form-data
          token: <the upload token> 
        }
      */


      props.queryAndSetSingleBundleExtUploaderCredentialsAsync(bundle.extUploader).then(function (extUploader) {
        // Upon starting, the `PlupLoad.Uploader` instance will automatically collect header properties such as `Content-Length` as well as composite the `body` by the detected file and preset boundary.   
        extUploader.start();
      });
    }
  }, {
    key: "_validateSelection",
    value: function _validateSelection(file) {
      var widgetRef = this;
      var props = widgetRef.props;

      if (null === file || undefined === file) {
        return false;
      }

      if (file.size > props.singleFileSizeLimitBytes) {
        return false;
      }

      if (-1 == props.allowedMimeList.indexOf(file.type)) {
        return false;
      }

      return true;
    }
  }, {
    key: "render",
    value: function render() {
      var widgetRef = this;
      var props = widgetRef.props;
      var View = props.View;
      var Image = props.Image;
      var onImageEditorTriggeredBridge = props.onImageEditorTriggeredBridge;
      var bundle = props.bundle;
      var sizePx = props.sizePx;
      var shouldDisable = props.shouldDisable;
      var progressBarSectionHeightPx = 32;
      var progressBarHeightPx = 10;
      var shouldHideProgressBar = _ImageSelectorBundle.SINGLE_UPLOADER_STATE.UPLOADING != bundle.uploaderState;
      var shouldHideImage = _ImageSelectorBundle.SINGLE_UPLOADER_STATE.INITIALIZED == bundle.uploaderState;
      var shouldHideBrowseButton = _ImageSelectorBundle.SINGLE_UPLOADER_STATE.INITIALIZED != bundle.uploaderState || shouldDisable();
      var shouldDisableEditButton = !bundle.isOccupied() || shouldDisable();

      var progressBar = _react["default"].createElement(View, {
        key: "single-image-selector-progress-bar-container",
        style: {
          position: "absolute",
          width: "100%",
          height: progressBarHeightPx,
          borderRadius: 3
        }
      }, _react["default"].createElement(View, {
        key: "single-image-selector-progress-bar",
        style: {
          display: shouldHideProgressBar ? "none" : "block",
          width: bundle.progressPercentage + "%",
          height: "100%",
          borderRadius: 3,
          backgroundColor: props.progressBarColor
        }
      }));

      var uploadedMarkSizePx = {
        w: sizePx.w >> 3,
        h: sizePx.h >> 3
      };
      var uploadedMarkOffsetPx = {
        top: 0,
        left: sizePx.w - uploadedMarkSizePx.w
      };

      var uploadedMark = _react["default"].createElement(View, {
        style: {
          display: _ImageSelectorBundle.SINGLE_UPLOADER_STATE.UPLOADED == bundle.uploaderState ? 'inherit' : 'none',
          fontSize: 16,
          position: "absolute",
          top: uploadedMarkOffsetPx.top,
          left: uploadedMarkOffsetPx.left,
          width: uploadedMarkSizePx.w,
          height: uploadedMarkSizePx.h
        }
      }, props.uploadedMark);

      var imageAndProgressSection = _react["default"].createElement(View, {
        style: {
          position: "absolute",
          width: sizePx.w,
          height: sizePx.h,
          verticalAlign: "middle"
        }
      }, _react["default"].createElement(Image, {
        key: "single-image-selector-preview",
        style: {
          display: shouldHideImage ? "none" : "block",
          width: sizePx.w,
          height: shouldHideImage ? 0 : sizePx.h - progressBarSectionHeightPx,
          objectFit: "contain"
        },
        src: bundle.effectiveImgSrc,
        onClick: function onClick(evt) {
          if (shouldDisableEditButton) return;
          onImageEditorTriggeredBridge(widgetRef.props.listIndex);
        }
      }), _react["default"].createElement(View, {
        style: {
          display: !shouldHideBrowseButton ? "none" : "block",
          position: "relative",
          width: sizePx.w,
          height: progressBarSectionHeightPx,
          textAlign: "center",
          verticalAlign: "middle"
        }
      }, progressBar));

      var BrowseButtonComponent = props.BrowseButtonComponent;
      var browseButtonHeightPx = parseInt(sizePx.h * 0.7);
      var browseButtonTopOffsetPx = sizePx.h - browseButtonHeightPx >> 1;

      var browseButton = _react["default"].createElement(View, {
        key: "single-image-selector-browse-btn",
        style: {
          position: "absolute",
          display: shouldHideBrowseButton ? "none" : "inline-block",
          width: sizePx.w,
          height: shouldHideBrowseButton ? 0 : sizePx.h,
          textAlign: "center",
          verticalAlign: "middle",
          lineHeight: parseInt(sizePx.h) + 'px'
        },
        ref: function ref(c) {
          if (!c) return;
          widgetRef._browseBtnRef = c;
        }
      }, _react["default"].createElement(BrowseButtonComponent, {
        style: {
          position: "absolute",
          top: browseButtonTopOffsetPx,
          width: sizePx.w,
          height: browseButtonHeightPx,
          lineHeight: browseButtonHeightPx + 'px'
        }
      }));

      var containerStyle = {
        position: 'relative',
        width: sizePx.w,
        height: sizePx.h
      };
      return _react["default"].createElement(View, {
        key: "single-image-selector-container",
        style: containerStyle
      }, imageAndProgressSection, browseButton, uploadedMark);
    }
  }]);

  return StatelessSingleImageSelector;
}(_react["default"].Component);

var _default = StatelessSingleImageSelector;
exports["default"] = _default;

