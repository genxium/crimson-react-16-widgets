'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _StatelessSingleImageSelector = _interopRequireDefault(require("./StatelessSingleImageSelector"));

var _ImageSelectorBundle = require("./ImageSelectorBundle");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var singleSelectorContainerKeyPrefix = 'whateveryoulike-';

var StatelessMultiImageSelector =
/*#__PURE__*/
function (_React$Component) {
  _inherits(StatelessMultiImageSelector, _React$Component);

  function StatelessMultiImageSelector(props) {
    var _this;

    _classCallCheck(this, StatelessMultiImageSelector);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(StatelessMultiImageSelector).call(this, props));
    _this._singleSelectorCollection = {};
    return _this;
  }

  _createClass(StatelessMultiImageSelector, [{
    key: "startUpload",
    value: function startUpload() {
      var widgetRef = this;

      for (var k in widgetRef._singleSelectorCollection) {
        var singleSelector = widgetRef._singleSelectorCollection[k];
        if (!singleSelector) continue;
        singleSelector.startUpload();
      }

      ;
    }
  }, {
    key: "getPreviewableImageList",
    value: function getPreviewableImageList() {
      var widgetRef = this;
      var props = widgetRef.props;
      var bundleListManager = props.bundleListManager;
      var bundleList = bundleListManager.bundleList;
      if (0 == bundleList.length) return null;
      var imageList = [];

      for (var i = 0; i < bundleList.length; ++i) {
        var bundle = bundleList[i];
        if (null === bundle.effectiveImgSrc) break;
        imageList.push({
          src: bundle.effectiveImgSrc
        });
      }

      ;
      return imageList;
    }
  }, {
    key: "getBatchUploaderStateSync",
    value: function getBatchUploaderStateSync() {
      var toRet = 0;
      var widgetRef = this;
      var props = widgetRef.props;
      var bundleListManager = props.bundleListManager;
      var bundleList = bundleListManager.bundleList;
      if (0 == bundleList.length) return _ImageSelectorBundle.BATCH_UPLOADER_STATE.NONEXISTENT_UPLOADER;

      for (var i = 0; i < bundleList.length; ++i) {
        var bundle = bundleList[i];
        if (_ImageSelectorBundle.SINGLE_UPLOADER_STATE.CREATED == bundle.uploaderState) toRet |= _ImageSelectorBundle.BATCH_UPLOADER_STATE.SOME_CREATED;else if (_ImageSelectorBundle.SINGLE_UPLOADER_STATE.INITIALIZED == bundle.uploaderState) toRet |= _ImageSelectorBundle.BATCH_UPLOADER_STATE.SOME_INITIALIZED;else if (_ImageSelectorBundle.SINGLE_UPLOADER_STATE.LOCALLY_PREVIEWING == bundle.uploaderState) toRet |= _ImageSelectorBundle.BATCH_UPLOADER_STATE.SOME_LOCALLY_PREVIEWING;else if (_ImageSelectorBundle.SINGLE_UPLOADER_STATE.UPLOADING == bundle.uploaderState) toRet |= _ImageSelectorBundle.BATCH_UPLOADER_STATE.SOME_UPLOADING;else continue; // UPLOADED
      }

      return toRet;
    }
  }, {
    key: "render",
    value: function render() {
      var widgetRef = this;
      var props = widgetRef.props;
      var View = props.View;
      var bundleListManager = props.bundleListManager;
      var _shouldDisable = props.shouldDisable;
      var onSingleNewBundleInitializedBridge = props.onSingleNewBundleInitializedBridge;
      var onSingleImageEditorTriggeredBridge = props.onSingleImageEditorTriggeredBridge;
      var onSingleUploadedBridge = props.onSingleUploadedBridge;
      var onSingleProgressBridge = props.onSingleProgressBridge;
      var onSingleLocalImageAddedBridge = props.onSingleLocalImageAddedBridge;
      var singleImageSelectorSize = props.singleImageSelectorSize;
      var showFileRequirementHint = props.showFileRequirementHint;
      var singleFileSizeLimitBytes = props.singleFileSizeLimitBytes;
      var allowedMimeList = props.allowedMimeList;
      var uploadedMark = props.uploadedMark;
      var bundleList = bundleListManager.bundleList;
      var selectorList = [];

      var _loop = function _loop(i) {
        var bundle = bundleList[i];

        var singleSelector = _react["default"].createElement(View, {
          key: singleSelectorContainerKeyPrefix + bundle.id,
          style: {
            display: 'inline-block',
            marginRight: 5
          }
        }, _react["default"].createElement(_StatelessSingleImageSelector["default"], _extends({
          key: 'single-selector',
          listIndex: i,
          ref: function ref(c) {
            if (!c) return;
            widgetRef._singleSelectorCollection[i] = c;
          },
          bundle: bundle,
          sizePx: singleImageSelectorSize,
          showFileRequirementHint: showFileRequirementHint,
          singleFileSizeLimitBytes: singleFileSizeLimitBytes,
          allowedMimeList: allowedMimeList,
          uploadedMark: uploadedMark,
          progressBarColor: props.progressBarColor,
          BrowseButtonComponent: props.BrowseButtonComponent,
          shouldDisable: function shouldDisable() {
            return _shouldDisable();
          },
          onNewBundleInitializedBridge: function onNewBundleInitializedBridge(idx, props) {
            onSingleNewBundleInitializedBridge(idx, props);
          },
          onImageEditorTriggeredBridge: function onImageEditorTriggeredBridge(idx) {
            onSingleImageEditorTriggeredBridge(idx);
          },
          onUploadedBridge: function onUploadedBridge(idx, successOrFailure) {
            onSingleUploadedBridge(idx, successOrFailure);
          },
          onProgressBridge: function onProgressBridge(idx, props) {
            onSingleProgressBridge(idx, props);
          },
          onLocalImageAddedBridge: function onLocalImageAddedBridge(idx, props) {
            onSingleLocalImageAddedBridge(idx, props);
          }
        }, widgetRef.props)));

        selectorList.push(singleSelector);
      };

      for (var i = 0; i < bundleList.length; ++i) {
        _loop(i);
      }

      return _react["default"].createElement(View, {
        style: widgetRef.props.style
      }, selectorList);
    }
  }]);

  return StatelessMultiImageSelector;
}(_react["default"].Component);

var _default = StatelessMultiImageSelector;
exports["default"] = _default;

