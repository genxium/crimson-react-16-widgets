'use strict';

import React from 'react';
const singleSelectorContainerKeyPrefix = 'whateveryoulike-';

import StatelessSingleImageSelector from './StatelessSingleImageSelector';

import {
  SINGLE_UPLOADER_STATE,
  BATCH_UPLOADER_STATE,
} from './ImageSelectorBundle';

class StatelessMultiImageSelector extends React.Component {
  constructor(props) {
    super(props);
    this._singleSelectorCollection = {};
  }

  startUpload() {
    const widgetRef = this;
    for (let k in widgetRef._singleSelectorCollection) {
      const singleSelector = widgetRef._singleSelectorCollection[k];
      if (!singleSelector) continue;
      singleSelector.startUpload();
    };
  }

  getPreviewableImageList() {
    const widgetRef = this;
    const props = widgetRef.props;
    const bundleListManager = props.bundleListManager;

    const bundleList = bundleListManager.bundleList;
    if (0 == bundleList.length) return null;
    let imageList = [];
    for (let i = 0; i < bundleList.length; ++i) {
      const bundle = bundleList[i];
      if (null === bundle.effectiveImgSrc) break;
      imageList.push({
        src: bundle.effectiveImgSrc,
      });
    }
    ;
    return imageList;
  }

  getBatchUploaderStateSync() {
    let toRet = 0;
		const widgetRef = this;
    const props = widgetRef.props;
    const bundleListManager = props.bundleListManager;

    const bundleList = bundleListManager.bundleList;
    if (0 == bundleList.length) return BATCH_UPLOADER_STATE.NONEXISTENT_UPLOADER;

		for (let i = 0; i < bundleList.length; ++i) {
			const bundle = bundleList[i];
			if (SINGLE_UPLOADER_STATE.CREATED == bundle.uploaderState) toRet |= BATCH_UPLOADER_STATE.SOME_CREATED;
			else if (SINGLE_UPLOADER_STATE.INITIALIZED == bundle.uploaderState) toRet |= BATCH_UPLOADER_STATE.SOME_INITIALIZED;
			else if (SINGLE_UPLOADER_STATE.LOCALLY_PREVIEWING == bundle.uploaderState) toRet |= BATCH_UPLOADER_STATE.SOME_LOCALLY_PREVIEWING;
			else if (SINGLE_UPLOADER_STATE.UPLOADING == bundle.uploaderState) toRet |= BATCH_UPLOADER_STATE.SOME_UPLOADING;
			else continue; // UPLOADED
		}
    return toRet;
  }

  render() {
    const widgetRef = this;
    const props = widgetRef.props;

    const View = props.View;

    const bundleListManager = props.bundleListManager;
    const shouldDisable = props.shouldDisable;
    const onSingleNewBundleInitializedBridge = props.onSingleNewBundleInitializedBridge;
    const onSingleImageEditorTriggeredBridge = props.onSingleImageEditorTriggeredBridge;
    const onSingleUploadedBridge = props.onSingleUploadedBridge;
    const onSingleProgressBridge = props.onSingleProgressBridge;
    const onSingleLocalImageAddedBridge = props.onSingleLocalImageAddedBridge;
    const singleImageSelectorSize = props.singleImageSelectorSize;
    const showFileRequirementHint = props.showFileRequirementHint;
    const singleFileSizeLimitBytes = props.singleFileSizeLimitBytes;
    const allowedMimeList = props.allowedMimeList;
    const uploadedMark = props.uploadedMark;

    const bundleList = bundleListManager.bundleList;
    let selectorList = [];
    for (let i = 0; i < bundleList.length; ++i) {
      const bundle = bundleList[i];
      const singleSelector = (
        <View
        key={singleSelectorContainerKeyPrefix + bundle.id}
        style={{
          display: 'inline-block',
          marginRight: 5,
        }}
        >
          <StatelessSingleImageSelector
          key={'single-selector'}
          listIndex={i}
          ref={(c) => {
            if (!c) return;
            widgetRef._singleSelectorCollection[i] = c;
          }}
          bundle={bundle}
          sizePx={singleImageSelectorSize}
          showFileRequirementHint={showFileRequirementHint}
          singleFileSizeLimitBytes={singleFileSizeLimitBytes}
          allowedMimeList={allowedMimeList}
          uploadedMark={uploadedMark}
          progressBarColor={props.progressBarColor}
          BrowserButtonComponent={props.BrowserButtonComponent}
          shouldDisable={ () => {
            return shouldDisable();
          }}
          onNewBundleInitializedBridge={ (idx, props) => {
            onSingleNewBundleInitializedBridge(idx, props); 
          }}
          onImageEditorTriggeredBridge={ (idx) => {
            onSingleImageEditorTriggeredBridge(idx);
          }}
          onUploadedBridge= { (idx, successOrFailure) => {
            onSingleUploadedBridge(idx, successOrFailure);
          }}
          onProgressBridge={ (idx, props) => {
            onSingleProgressBridge(idx, props);
          }}
          onLocalImageAddedBridge={ (idx, props) => {
            onSingleLocalImageAddedBridge(idx, props);
          }}
          {...widgetRef.props}
          />
        </View>
      );
      selectorList.push(singleSelector);
    }

    return (
      <View
      style={widgetRef.props.style}>
        {selectorList}
      </View>
    );
  }
}

export default StatelessMultiImageSelector;
