'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SingleImageSelectorBundleListManager = exports.SingleImageSelectorBundle = exports.BATCH_UPLOADER_STATE = exports.SINGLE_UPLOADER_STATE = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SINGLE_UPLOADER_STATE = {
  CREATED: -1,
  INITIALIZED: 0,
  // Bound to an extUploader.
  LOCALLY_PREVIEWING: 1,
  UPLOADING: 2,
  UPLOADED: 3
};
exports.SINGLE_UPLOADER_STATE = SINGLE_UPLOADER_STATE;
var BATCH_UPLOADER_STATE = {
  NONEXISTENT_UPLOADER: -1,
  ALL_UPLOADED: 0,
  SOME_CREATED: 1 << 1,
  SOME_INITIALIZED: 1 << 2,
  SOME_LOCALLY_PREVIEWING: 1 << 3,
  SOME_UPLOADING: 1 << 4
};
exports.BATCH_UPLOADER_STATE = BATCH_UPLOADER_STATE;

function localGuid() {
  var s4 = function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  };

  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

var SingleImageSelectorBundle =
/*#__PURE__*/
function () {
  function SingleImageSelectorBundle(props) {
    _classCallCheck(this, SingleImageSelectorBundle);

    this.id = localGuid();

    if (null == props) {
      // NOTE: All of `uploaderState`, `effectiveImgSrc/effectiveVideoSrc` and `progressPercentage` are app-scope identifiers/variables, which are independent of CDN provider, e.g. Qiniu.
      this.uploaderState = SINGLE_UPLOADER_STATE.CREATED;
      this.effectiveImgSrc = null;
      this.effectiveVideoSrc = null;
      this.progressPercentage = 0.0; // NOTE: The `extUploader` itself is stateful, i.e. contains a state-automata.

      this.extUploader = null;
      return;
    }

    this.uploaderState = null == props.uploaderState ? SINGLE_UPLOADER_STATE.CREATED : props.uploaderState;
    this.effectiveImgSrc = null == props.effectiveImgSrc ? null : props.effectiveImgSrc;
    this.effectiveVideoSrc = null == props.effectiveVideoSrc ? null : props.effectiveVideoSrc;
    this.progressPercentage = null == props.progressPercentage ? 0.0 : props.progressPercentage; // NOTE: The member `extUploader` COULDN'T be assigned by constructor!

    this.extUploader = null;
  }

  _createClass(SingleImageSelectorBundle, [{
    key: "assign",
    value: function assign(props) {
      if (null != props.uploaderState) {
        this.uploaderState = props.uploaderState;
      }

      if (null != props.effectiveImgSrc) {
        this.effectiveImgSrc = props.effectiveImgSrc;
      }

      if (null != props.effectiveVideoSrc) {
        this.effectiveVideoSrc = props.effectiveVideoSrc;
      }

      if (null != props.progressPercentage) {
        this.progressPercentage = props.progressPercentage;
      }
    }
  }, {
    key: "reset",
    value: function reset(props) {
      this._explicitlyDestruct();

      if (null == props) return;
      this.uploaderState = null == props.uploaderState ? SINGLE_UPLOADER_STATE.CREATED : props.uploaderState;
      this.effectiveImgSrc = null == props.effectiveImgSrc ? null : props.effectiveImgSrc;
      this.effectiveVideoSrc = null == props.effectiveVideoSrc ? null : props.effectiveVideoSrc;
      this.progressPercentage = null == props.progressPercentage ? 0.0 : props.progressPercentage;
      this.extUploader = null == props.extUploader ? null : props.extUploader;
    }
  }, {
    key: "isOccupied",
    value: function isOccupied() {
      if (SINGLE_UPLOADER_STATE.CREATED == this.uploaderState) return false;
      if (SINGLE_UPLOADER_STATE.INITIALIZED == this.uploaderState) return false;
      return true;
    }
  }, {
    key: "_explicitlyDestruct",
    value: function _explicitlyDestruct() {
      this.uploaderState = SINGLE_UPLOADER_STATE.CREATED;
      this.effectiveImgSrc = null;
      this.effectiveVideoSrc = null;
      this.progressPercentage = 0.0;

      if (null !== this.extUploader) {
        // NOTE: This is Plupload specific.
        // Reference http://www.plupload.com/docs/Uploader#methods
        // Prevent uncleaned plupload instance from being triggered by its bound browseButton.
        this.extUploader.unbindAll();
        this.extUploader.destroy();
      }

      this.extUploader = null;
    }
  }]);

  return SingleImageSelectorBundle;
}();

exports.SingleImageSelectorBundle = SingleImageSelectorBundle;

var SingleImageSelectorBundleListManager =
/*#__PURE__*/
function () {
  function SingleImageSelectorBundleListManager(props) {
    _classCallCheck(this, SingleImageSelectorBundleListManager);

    this.bundleList = [];
  }

  _createClass(SingleImageSelectorBundleListManager, [{
    key: "pushNew",
    value: function pushNew(props) {
      var instance = this;
      instance.bundleList.push(new SingleImageSelectorBundle(props));
    }
  }, {
    key: "assignAtIndex",
    value: function assignAtIndex(idx, props) {
      var instance = this;
      instance.bundleList[idx].assign(props);
    }
  }, {
    key: "resetAtIndex",
    value: function resetAtIndex(idx, props) {
      var instance = this;
      instance.bundleList[idx].reset(props);
    }
  }, {
    key: "assignAtIndexAndRecycle",
    value: function assignAtIndexAndRecycle(idx, props) {
      var instance = this;
      var newBundleList = [];
      var targetBundle = instance.bundleList[idx];
      targetBundle.assign(props);

      for (var i = 0; i < instance.bundleList.length; ++i) {
        if (i == idx) continue;
        var bundle = instance.bundleList[i];
        newBundleList.push(bundle);
      }

      newBundleList.push(targetBundle);
      instance.bundleList = newBundleList;
    }
  }, {
    key: "resetAtIndexAndRecycle",
    value: function resetAtIndexAndRecycle(idx, props) {
      var instance = this;
      var newBundleList = [];
      var targetBundle = instance.bundleList[idx];
      targetBundle.reset(props);

      for (var i = 0; i < instance.bundleList.length; ++i) {
        if (i == idx) continue;
        var bundle = instance.bundleList[i];
        newBundleList.push(bundle);
      }

      newBundleList.push(targetBundle);
      instance.bundleList = newBundleList;
    }
  }, {
    key: "removeAtIndex",
    value: function removeAtIndex(idx) {
      var instance = this;
      var newBundleList = [];

      for (var i = 0; i < instance.bundleList.length; ++i) {
        var bundle = instance.bundleList[i];

        if (i == idx) {
          if (undefined !== bundle.extUploader && null !== bundle.extUploader) {
            bundle.extUploader.unbindAll();
            bundle.extUploader.destroy();
          }

          continue;
        }

        newBundleList.push(bundle);
      }

      instance.bundleList = newBundleList;
    }
  }, {
    key: "occupiedCount",
    value: function occupiedCount() {
      var instance = this;
      var ret = 0;

      for (var i = 0; i < instance.bundleList.length; ++i) {
        var bundle = instance.bundleList[i];
        if (!bundle.isOccupied()) continue;
        ++ret;
      }

      return ret;
    }
  }, {
    key: "allOccupied",
    value: function allOccupied() {
      var instance = this;

      for (var i = 0; i < instance.bundleList.length; ++i) {
        var bundle = instance.bundleList[i];
        if (!bundle.isOccupied()) return false;
      }

      return true;
    }
  }]);

  return SingleImageSelectorBundleListManager;
}();

exports.SingleImageSelectorBundleListManager = SingleImageSelectorBundleListManager;

