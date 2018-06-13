'use strict';

const React = require('react');
const ReactDOM = require('react-dom');

const SINGLE_UPLOADER_STATE = require('./ImageSelectorBundle').SINGLE_UPLOADER_STATE;

const PlupLoad = require('plupload');

const LIST_INDEX = 'listIndex';

class StatelessSingleImageSelector extends React.Component {
  constructor(props) {
    super(props);
    this._browseBtnRef = null;
    const widgetRef = this;
    widgetRef._previewLoader = new FileReader();
    widgetRef._previewLoader.onload = function (evt) {
      widgetRef.props.onLocalImageAddedBridge(widgetRef.props.listIndex, {
        uploaderState: SINGLE_UPLOADER_STATE.LOCALLY_PREVIEWING,
        effectiveImgSrc: evt.target.result,
      });
    };
  }

  _updatePluploadExtUploaderListIndex() {
    const widgetRef = this;
    const props = widgetRef.props;
    const bundle = props.bundle;
    if (!bundle) return;
    const extUploader = bundle.extUploader;
    if (!extUploader) return;
    extUploader.setOption({
      listIndex: widgetRef.props.listIndex,
    });
  }

  _initializePluploadExtUploaderEvtBinding(extUploader) {
    const widgetRef = this;
    const props = widgetRef.props;
    const bundle = props.bundle;
    const shouldDisable = props.shouldDisable;
    const onLocalImageAddedBridge = props.onLocalImageAddedBridge;
    const onUploadedBridge = props.onUploadedBridge;
    const onProgressBridge = props.onProgressBridge;

    extUploader.bind('FilesAdded', function (up, files) {
      const targetFile = files[0];
      const uploaderSelf = this;
      const listIndex = parseInt(uploaderSelf.getOption(LIST_INDEX));
      // NOTE: Remove previously added files in the uploader buffer.
      for (let k in uploaderSelf.files) {
        const single = uploaderSelf.files[k];
        if (single && single.id == targetFile.id) continue;
        uploaderSelf.removeFile(single);
      }

      if (!widgetRef._validateSelection(targetFile)) {
        props.showFileRequirementHint();
        onLocalImageAddedBridge(listIndex, {
          effectiveImgSrc: null,
        });
        return;
      }

      uploaderSelf.disableBrowse(); // NOTE: Browsing is disabled once a valid image is added for previewing.
      uploaderSelf.refresh();
      widgetRef._previewLoader.readAsDataURL(targetFile.getNative());
    });

    extUploader.bind('UploadProgress', function(up, file) {
      const uploaderSelf = this;
      const listIndex = parseInt(uploaderSelf.getOption(LIST_INDEX));
      onProgressBridge(listIndex, {
        uploaderState: SINGLE_UPLOADER_STATE.UPLOADING,
        progressPercentage: file.percent,
      });
    });
    
    extUploader.bind('FileUploaded', function(up, file, info) {
      const uploaderSelf = this;
      const listIndex = parseInt(uploaderSelf.getOption(LIST_INDEX));
      onUploadedBridge(listIndex, true);
    });

    extUploader.bind('Error', function (up, err) {
      const uploaderSelf = this;
      const listIndex = parseInt(uploaderSelf.getOption(LIST_INDEX));
      onUploadedBridge(listIndex, false);
    });
  }

  _softReset() {
    const widgetRef = this;
    const props = widgetRef.props;
    const bundle = props.bundle;

    if (null === bundle || undefined === bundle)  return;
    if (SINGLE_UPLOADER_STATE.CREATED != bundle.uploaderState) {
      if (undefined === bundle.extUploader || null === bundle.extUploader)  return;
      widgetRef._updatePluploadExtUploaderListIndex();
      bundle.extUploader.refresh(); // NOTE: This is to update the `overlying browseButton` height according to the `seemingly browseButton` height. 
       bundle.extUploader.disableBrowse(props.shouldDisable());
      return;
    }

    const extUploader = widgetRef.createExtUploader();
    widgetRef._initializePluploadExtUploaderEvtBinding(extUploader);
    props.onNewBundleInitializedBridge(widgetRef.props.listIndex, {
      uploaderState: SINGLE_UPLOADER_STATE.INITIALIZED,
      progressPercentage: 0.0,
      effectiveImgSrc: null,
      extUploader: extUploader,
    });
  }

  componentDidMount() {
    const widgetRef = this;
    widgetRef._softReset();
  }

  componentDidUpdate(prevProps, prevState) {
    const widgetRef = this;
    widgetRef._softReset();
  }

  getPreviewableImage() {
    return {
      src: this.props.bundle.effectiveImgSrc,
    };
  }

  createExtUploader() {
    const widgetRef = this;

    // Reference http://www.plupload.com/docs/v2/Uploader.
    const uploader = new PlupLoad.Uploader({
      browse_button: ReactDOM.findDOMNode(widgetRef._browseBtnRef),
      multi_selection: false,
    });

    uploader.init();
    return uploader;
  }

  startUpload() {
    const widgetRef = this;
    const props = widgetRef.props;
    const listIndex = props.listIndex;
    const onUploadedBridge = props.onUploadedBridge;
    
    const bundle = props.bundle;
    if (SINGLE_UPLOADER_STATE.UPLOADED == bundle.uploaderState) {
      onUploadedBridge(listIndex, true);
      return;
    }
    if (SINGLE_UPLOADER_STATE.LOCALLY_PREVIEWING != bundle.uploaderState) {
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
    props.queryAndSetSingleBundleExtUploaderCredentialsAsync(bundle.extUploader)
    .then(function(extUploader) {
      // Upon starting, the `PlupLoad.Uploader` instance will automatically collect header properties such as `Content-Length` as well as composite the `body` by the detected file and preset boundary.   
      extUploader.start();
    });

  }

  _validateSelection(file) {
    const widgetRef = this;
    const props = widgetRef.props;

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

  render() {
    const widgetRef = this;
    const props = widgetRef.props;

    const View = props.View;
    const Image = props.Image;

    const onImageEditorTriggeredBridge = props.onImageEditorTriggeredBridge;
    const bundle = props.bundle;
    const sizePx = props.sizePx;
    const shouldDisable = props.shouldDisable;

    const progressBarSectionHeightPx = 32;
    const progressBarHeightPx = 10;
    const shouldHideProgressBar = (SINGLE_UPLOADER_STATE.UPLOADING != bundle.uploaderState);
    const shouldHideImage = (SINGLE_UPLOADER_STATE.INITIALIZED == bundle.uploaderState);
    const shouldHideBrowseButton = (SINGLE_UPLOADER_STATE.INITIALIZED != bundle.uploaderState || shouldDisable());

    const shouldDisableEditButton = (!bundle.isOccupied() || shouldDisable());

    const progressBar = (
      <View
        key='single-image-selector-progress-bar-container'
        style={{
          position: "absolute",
          width: "100%",
          height: progressBarHeightPx,
          borderRadius: 3,
        }}
      >
        <View
          key='single-image-selector-progress-bar'
          style={{
            display: (shouldHideProgressBar ? "none" : "block"),
            width: bundle.progressPercentage + "%",
            height: "100%",
            borderRadius: 3,
            backgroundColor: props.progressBarColor,
          }} />
      </View>
    );

    const uploadedMarkSizePx = {
      w: (sizePx.w >> 3),
      h: (sizePx.h >> 3),
    };
    const uploadedMarkOffsetPx = {
      top: 0,
      left: (sizePx.w - uploadedMarkSizePx.w),
    };
    const uploadedMark = (
      <View
        style={{
          display: (SINGLE_UPLOADER_STATE.UPLOADED == bundle.uploaderState ? 'inherit' : 'none'),
          fontSize: 16,
          position: "absolute",
          top: uploadedMarkOffsetPx.top,
          left: uploadedMarkOffsetPx.left,
          width: uploadedMarkSizePx.w,
          height: uploadedMarkSizePx.h,
        }}
      >
        {props.uploadedMark}
      </View>
    );

    const imageAndProgressSection = (
      <View
        style={{
          position: "absolute",
          width: sizePx.w,
          height: sizePx.h,
          verticalAlign: "middle",
        }}
      >
        <Image
          key='single-image-selector-preview'
          style={{
            display: (shouldHideImage ? "none" : "block"),
            width: sizePx.w,
            height: (shouldHideImage ? 0 : (sizePx.h - progressBarSectionHeightPx)),
            objectFit: "contain",
          }}
          src={bundle.effectiveImgSrc}
          onClick={(evt) => {
            if (shouldDisableEditButton) return;
            onImageEditorTriggeredBridge(widgetRef.props.listIndex);
          }}
        />
        <View
          style={{
            display: (!shouldHideBrowseButton ? "none" : "block"),
            position: "relative",
            width: sizePx.w,
            height: progressBarSectionHeightPx,
            textAlign: "center",
            verticalAlign: "middle",
          }}>
          {progressBar}
        </View>
      </View>
    );

    const BrowserButtonComponent = props.BrowserButtonComponent;
    const browseButtonHeightPx = parseInt(sizePx.h * 0.7);
    const browseButtonTopOffsetPx = ((sizePx.h - browseButtonHeightPx) >> 1); 

    const browseButton = (
      <View
      key='single-image-selector-browse-btn'
      style={{
        position: "absolute",
        display: (shouldHideBrowseButton ? "none" : "inline-block"),
        width: sizePx.w,
        height: (shouldHideBrowseButton ? 0 : sizePx.h),
        textAlign: "center",
        verticalAlign: "middle",
        lineHeight: parseInt(sizePx.h) + 'px',
      }}
      ref={function (c) {
        if (!c) return;
        widgetRef._browseBtnRef = c;
      }}
      >
        <BrowserButtonComponent 
        style={{
          position: "absolute",
          top: browseButtonTopOffsetPx,
          width: sizePx.w,
          height: browseButtonHeightPx,
          lineHeight: browseButtonHeightPx + 'px',
        }}
        />
      </View>
    );

    const containerStyle = {
      position: 'relative',
      width: sizePx.w,
      height: sizePx.h,
    };

    return (
      <View
        key='single-image-selector-container'
        style={containerStyle}
      >
        {imageAndProgressSection}
        {browseButton}
        {uploadedMark}
      </View>
    );
  }
}

exports.default = StatelessSingleImageSelector;
module.exports = StatelessSingleImageSelector;
