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

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var LIST_INDEX = 'listIndex'; // These modules are exported by CommonJs "module.exports = " syntax.

var PlupLoad = require('plupload');

var StatelessSingleVideoSelector =
/*#__PURE__*/
function (_React$Component) {
  _inherits(StatelessSingleVideoSelector, _React$Component);

  function StatelessSingleVideoSelector(props) {
    var _this;

    _classCallCheck(this, StatelessSingleVideoSelector);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(StatelessSingleVideoSelector).call(this, props));
    _this._browseBtnRef = null;
    return _this;
  }

  _createClass(StatelessSingleVideoSelector, [{
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
      var onLocalVideoAddedBridge = props.onLocalVideoAddedBridge;
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
          onLocalVideoAddedBridge(listIndex, {
            effectiveVideoSrc: null
          });
          return;
        }

        uploaderSelf.disableBrowse(); // NOTE: Browsing is disabled once a valid video is added for previewing.

        uploaderSelf.refresh();
        widgetRef.props.onLocalVideoAddedBridge(uploaderSelf.getOption(LIST_INDEX), {
          uploaderState: _ImageSelectorBundle.SINGLE_UPLOADER_STATE.LOCALLY_PREVIEWING,
          effectiveVideoSrc: (window.URL ? URL : webkitURL).createObjectURL(targetFile.getNative())
        });
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
        effectiveVideoSrc: null,
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
    key: "createExtUploader",
    value: function createExtUploader() {
      var widgetRef = this;
      var props = widgetRef.props;
      var chunkSize = props.chunkSize; // Reference http://www.plupload.com/docs/v2/Uploader.

      var uploader = new PlupLoad.Uploader({
        browse_button: _reactDom["default"].findDOMNode(widgetRef._browseBtnRef),
        multi_selection: false,
        chunk_size: chunkSize
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
      var Video = props.Video;
      var onVideoEditorTriggeredBridge = props.onVideoEditorTriggeredBridge;
      var bundle = props.bundle;
      var sizePx = props.sizePx;
      var shouldDisable = props.shouldDisable;
      var progressBarSectionHeightPx = 32;
      var progressBarHeightPx = 10;
      var shouldHideProgressBar = _ImageSelectorBundle.SINGLE_UPLOADER_STATE.UPLOADING != bundle.uploaderState;
      var shouldHideVideo = _ImageSelectorBundle.SINGLE_UPLOADER_STATE.INITIALIZED == bundle.uploaderState;
      var shouldHideBrowseButton = _ImageSelectorBundle.SINGLE_UPLOADER_STATE.INITIALIZED != bundle.uploaderState || shouldDisable();
      var shouldShowControls = props.controls;
      var shouldDisableEditButton = !bundle.isOccupied() || shouldDisable();

      var progressBar = _react["default"].createElement(View, {
        key: "single-video-selector-progress-bar-container",
        style: {
          position: "absolute",
          width: "100%",
          height: progressBarHeightPx,
          borderRadius: 3
        }
      }, _react["default"].createElement(View, {
        key: "single-video-selector-progress-bar",
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

      var videoAndProgressSection = _react["default"].createElement(View, {
        style: {
          position: "absolute",
          width: sizePx.w,
          height: sizePx.h
        },
        onClick: function onClick(evt) {
          if (shouldDisableEditButton) return;
          onVideoEditorTriggeredBridge(widgetRef.props.listIndex);
        }
      }, _react["default"].createElement(Video, {
        controls: shouldShowControls,
        key: "single-video-selector-preview",
        src: bundle.effectiveVideoSrc,
        style: {
          display: shouldHideVideo ? "none" : "block",
          width: sizePx.w,
          height: shouldHideVideo ? 0 : sizePx.h - progressBarSectionHeightPx,
          objectFit: "contain"
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

      var browseButton = _react["default"].createElement(View, {
        key: "single-video-selector-browse-btn",
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
      }, _react["default"].createElement(BrowseButtonComponent, null));

      var containerStyle = {
        position: 'relative',
        width: sizePx.w,
        height: sizePx.h
      };
      return _react["default"].createElement(View, {
        key: "single-video-selector-container",
        style: containerStyle
      }, videoAndProgressSection, browseButton, uploadedMark);
    }
  }]);

  return StatelessSingleVideoSelector;
}(_react["default"].Component);

var _default = StatelessSingleVideoSelector;
exports["default"] = _default;

