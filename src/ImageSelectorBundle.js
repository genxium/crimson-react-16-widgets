'use strict';

const SINGLE_UPLOADER_STATE = {
  CREATED: -1,
  INITIALIZED: 0, // Bound to an extUploader.
  LOCALLY_PREVIEWING: 1,
  UPLOADING: 2,
  UPLOADED: 3,
};

const BATCH_UPLOADER_STATE = {
  NONEXISTENT_UPLOADER: -1,
	ALL_UPLOADED: 0,
	SOME_CREATED: (1 << 1),
	SOME_INITIALIZED: (1 << 2),
	SOME_LOCALLY_PREVIEWING: (1 << 3),
	SOME_UPLOADING: (1 << 4),
};

function localGuid() {
  const s4 = function() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

class SingleImageSelectorBundle {
  constructor(props) {
    this.id =  localGuid();
		if (null == props) {
			// NOTE: All of `uploaderState`, `effectiveImgSrc/effectiveVideoSrc` and `progressPercentage` are app-scope identifiers/variables, which are independent of CDN provider, e.g. Qiniu.
			this.uploaderState = SINGLE_UPLOADER_STATE.CREATED;
			this.effectiveImgSrc = null;
			this.effectiveVideoSrc = null;
			this.progressPercentage = 0.0;

			// NOTE: The `extUploader` itself is stateful, i.e. contains a state-automata.
			this.extUploader = null;
			return;
		}	
		this.uploaderState = (null == props.uploaderState ? SINGLE_UPLOADER_STATE.CREATED : props.uploaderState);
		this.effectiveImgSrc = (null == props.effectiveImgSrc ? null : props.effectiveImgSrc);
		this.effectiveVideoSrc = (null == props.effectiveVideoSrc ? null : props.effectiveVideoSrc);
		this.progressPercentage = (null == props.progressPercentage ? 0.0 : props.progressPercentage);
		
		// NOTE: The member `extUploader` COULDN'T be assigned by constructor!
		this.extUploader = null;
  }
	
	assign(props) {
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

	reset(props) {
		this._explicitlyDestruct();
		if (null == props)	return;

		this.uploaderState = (null == props.uploaderState ? SINGLE_UPLOADER_STATE.CREATED : props.uploaderState);
		this.effectiveImgSrc = (null == props.effectiveImgSrc ? null : props.effectiveImgSrc);
		this.effectiveVideoSrc = (null == props.effectiveVideoSrc ? null : props.effectiveVideoSrc);
		this.progressPercentage = (null == props.progressPercentage ? 0.0 : props.progressPercentage);
		
		this.extUploader = (null == props.extUploader ? null : props.extUploader);
	}

	isOccupied() {
		if (SINGLE_UPLOADER_STATE.CREATED == this.uploaderState) return false;
		if (SINGLE_UPLOADER_STATE.INITIALIZED == this.uploaderState) return false;
		return true;
	}
	
	_explicitlyDestruct() {
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
}

class SingleImageSelectorBundleListManager {
  constructor(props) {
		this.bundleList = [];
  }

	pushNew(props) {
		const instance = this;
		instance.bundleList.push(new SingleImageSelectorBundle(props));	
	}

	assignAtIndex(idx, props) {
		const instance = this;
		instance.bundleList[idx].assign(props);
	}
	
	resetAtIndex(idx, props) {
		const instance = this;
		instance.bundleList[idx].reset(props);
	}

	assignAtIndexAndRecycle(idx, props) {
		const instance = this;
		let newBundleList = [];
		let targetBundle = instance.bundleList[idx];	
		targetBundle.assign(props);
		for (let i = 0; i < instance.bundleList.length; ++i) {
			if (i == idx) continue;
			const bundle = instance.bundleList[i];
			newBundleList.push(bundle);
		}
		newBundleList.push(targetBundle);
		instance.bundleList = newBundleList;
	}	
		
	resetAtIndexAndRecycle(idx, props) {
		const instance = this;
		let newBundleList = [];
		let targetBundle = instance.bundleList[idx];	
		targetBundle.reset(props);
		for (let i = 0; i < instance.bundleList.length; ++i) {
			if (i == idx) continue;
			const bundle = instance.bundleList[i];
			newBundleList.push(bundle);
		}
		newBundleList.push(targetBundle);
		instance.bundleList = newBundleList;
	}
		
	removeAtIndex(idx) {
		const instance = this;
		let newBundleList = [];
		for (let i = 0; i < instance.bundleList.length; ++i) {
			const bundle = instance.bundleList[i];
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

	occupiedCount() {	
		const instance = this;
		let ret = 0;
		for (let i = 0; i < instance.bundleList.length; ++i) {
			const bundle = instance.bundleList[i];
			if (!bundle.isOccupied()) continue;
			++ret;
		}
		return ret;
	}

	allOccupied() {
		const instance = this;
		for (let i = 0; i < instance.bundleList.length; ++i) {
			const bundle = instance.bundleList[i];
			if (!bundle.isOccupied()) return false;
		}
		return true;
	}
}

export {
  SINGLE_UPLOADER_STATE,
  BATCH_UPLOADER_STATE,
  SingleImageSelectorBundle,
  SingleImageSelectorBundleListManager,
};
