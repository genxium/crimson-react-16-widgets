'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var Component = React.Component;

var katexStyle = require('katex/dist/katex.min.css');
var katex = require('katex');

var md = require('markdown-it')().disable(['image']);

if ('undefined' != typeof mermaid) {
	mermaid.initialize({
		startOnLoad: true
	});
}

var YAMDRenderer = function (_React$Component) {
	_inherits(YAMDRenderer, _React$Component);

	function YAMDRenderer() {
		var _ref;

		var _temp, _this, _ret;

		_classCallCheck(this, YAMDRenderer);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = YAMDRenderer.__proto__ || Object.getPrototypeOf(YAMDRenderer)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
			dangerousInnerHTML: "",
			mermaidSubstituteResidualList: []
		}, _this.mdRenderAsync = function (source) {
			return new Promise(function (resolve, reject) {
				resolve(md.render(source));
			});
		}, _this.imgSubstituteToRenderableAsync = function (content, previewableImageList) {
			var widgetRef = _this;
			var props = widgetRef.props;

			if (!previewableImageList || 0 >= previewableImageList.length) {
				return new Promise(function (resolve, reject) {
					resolve(content);
				});
			}

			var regex = new RegExp('\!\{' + props.imgTag + '\}\%(\\d+)\%', 'g');
			var newContent = content.replace(regex, function (match, param1, offset, wholeString) {
				if (typeof previewableImageList[param1] != 'undefined') {
					var src = previewableImageList[param1].src;
					var replacementTag = "<img style='display: block; width: 100%; object-fit: contain;' src='" + src + "'/>";
					return replacementTag;
				} else {
					return match;
				}
			});

			return new Promise(function (resolve, reject) {
				resolve(newContent);
			});
		}, _this.videoSubstituteToRenderableAsync = function (content, previewableVideoList) {
			var widgetRef = _this;
			var props = widgetRef.props;

			if (!previewableVideoList || 0 >= previewableVideoList.length) {
				return new Promise(function (resolve, reject) {
					resolve(content);
				});
			}

			var regex = new RegExp('\!\{' + props.videoTag + '\}\%(\d+)\%', 'g');
			var newContent = content.replace(regex, function (match, param1, offset, wholeString) {
				if (typeof previewableVideoList[param1] != 'undefined') {
					var src = previewableVideoList[param1].src;
					var replacementTag = ["<video width='100%' controls>", "<source src='" + src + "'>", "</video>"].join('\n');
					return replacementTag;
				} else {
					return match;
				}
			});

			return new Promise(function (resolve, reject) {
				resolve(newContent);
			});
		}, _this.ktxSubstituteToRenderableAsync = function (content, disabled) {
			var widgetRef = _this;
			var props = widgetRef.props;

			if (true == disabled) return new Promise(function (resolve, reject) {
				resolve(content);
			});
			var regex = new RegExp('\!\{' + props.ktxTag + '\}\%([^%]+)\%', 'g');
			var newContent = content.replace(regex, function (match, param1, offset, wholeString) {
				try {
					var toRenderParam = param1.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\\[rn]/g, '\\n');
					var replacementTag = katex.renderToString(toRenderParam);
					return replacementTag;
				} catch (err) {
					return param1;
				}
			});

			return new Promise(function (resolve, reject) {
				resolve(newContent);
			});
		}, _this.alnctrContentSubmittableToRenderableAsync = function (content) {
			var widgetRef = _this;
			var props = widgetRef.props;
			if (undefined === props.alignCenterTag || null === props.alignCenterTag) {
				return new Promise(function (resolve, reject) {
					resolve(content);
				});
			}

			var regex = new RegExp('\!\{' + props.alignCenterTag + '\}\%([^%]+)\%', 'g');
			var newContent = content.replace(regex, function (match, param1, offset, wholeString) {
				try {
					var toRenderParam = param1.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\\[rn]/g, '\\n');
					var strongRegex = /<strong>([\s\S]+)<\/strong>/g;
					var tmp = toRenderParam.replace(strongRegex, "<span style=\'font-weight: bold; font-size: 24px;\'>$1</span>");
					var replacementTag = "<div style=\'width: 100%; text-align: center;\'>" + tmp + "</div>";
					return replacementTag;
				} catch (err) {
					return param1;
				}
			});
			return new Promise(function (resolve, reject) {
				resolve(newContent);
			});
		}, _this.generateRandomMermaidId = function (idxOfRegExpTraversal) {
			return "mermaid-" + idxOfRegExpTraversal;
		}, _this.mermaidSubstituteToRenderableAsync = function (content, disabled) {
			var widgetRef = _this;
			var props = widgetRef.props;

			if (true == disabled) return new Promise(function (resolve, reject) {
				resolve(content);
			});

			var newMermaidSubstituteResidualList = [];
			var idxOfRegExpTraversal = 0;

			var regex = new RegExp('\!\{' + props.mermaidTag + '\}\%([^%]+)\%', 'g');
			var newContent = content.replace(regex, function (match, param1, offset, wholeString) {
				try {
					var assignedId = widgetRef.generateRandomMermaidId(idxOfRegExpTraversal);
					var toSave = param1.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\\[rn]/g, '\\n');
					newMermaidSubstituteResidualList.push({
						id: assignedId,
						graph: toSave
					});
					var replacementTag = "<div id='" + assignedId + "' class='mermaid'>" + param1 + "</div>";
					return replacementTag;
				} catch (err) {
					return param1;
				} finally {
					++idxOfRegExpTraversal;
				}
			});

			return new Promise(function (resolve, reject) {
				resolve({
					content: newContent,
					substitueResidualList: newMermaidSubstituteResidualList
				});
			});
		}, _this.renderWithWholePipelineAsync = function (source, previewableImageList, previewableVideoList, disableTeX, disableMermaid) {
			var widgetRef = _this;
			var props = widgetRef.props;
			return widgetRef.mdRenderAsync(source).then(function (newSource) {
				return widgetRef.imgSubstituteToRenderableAsync(newSource, previewableImageList);
			}).then(function (newSource) {
				return widgetRef.videoSubstituteToRenderableAsync(newSource, previewableVideoList);
			}).then(function (newSource) {
				return widgetRef.ktxSubstituteToRenderableAsync(newSource, disableTeX);
			}).then(function (newSource) {
				return widgetRef.alnctrContentSubmittableToRenderableAsync(newSource);
			}).then(function (newSource) {
				return widgetRef.mermaidSubstituteToRenderableAsync(newSource, disableMermaid);
			}).then(function (rendered) {
				return new Promise(function (resolve, reject) {
					widgetRef.setState({
						mermaidSubstituteResidualList: rendered.substitueResidualList,
						dangerousInnerHTML: rendered.content
					}, function () {
						resolve(true);
					});
				});
			});
		}, _temp), _possibleConstructorReturn(_this, _ret);
	}

	_createClass(YAMDRenderer, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var widgetRef = this;
			var props = widgetRef.props;
			var source = props.source;
			var previewableImageList = props.previewableImageList;
			var previewableVideoList = props.previewableVideoList;
			var disableTeX = props.disableTeX;
			var disableMermaid = props.disableMermaid;
			widgetRef.renderWithWholePipelineAsync(source, previewableImageList, previewableVideoList, disableTeX, disableMermaid);
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			var widgetRef = this;
			var source = nextProps.source;
			var previewableImageList = nextProps.previewableImageList;
			var previewableVideoList = nextProps.previewableVideoList;
			var disableTeX = nextProps.disableTeX;
			var disableMermaid = nextProps.disableMermaid;
			widgetRef.renderWithWholePipelineAsync(source, previewableImageList, previewableVideoList, disableTeX, disableMermaid);
		}
	}, {
		key: 'render',
		value: function render() {
			var widgetRef = this;
			var props = widgetRef.props;
			var style = props.style;

			return React.createElement('div', {
				style: style,
				dangerouslySetInnerHTML: {
					__html: widgetRef.state.dangerousInnerHTML
				}
			}, null);
		}
	}, {
		key: 'componentDidUpdate',
		value: function componentDidUpdate() {
			var widgetRef = this;
			var props = widgetRef.props;
			var disableMermaid = props.disableMermaid;
			if (true == disableMermaid) return;

			if ('undefined' == typeof mermaid) return;
			mermaid.init(props.mermaidOptions, ".mermaid");
		}
	}]);

	return YAMDRenderer;
}(React.Component);

exports.default = YAMDRenderer;

