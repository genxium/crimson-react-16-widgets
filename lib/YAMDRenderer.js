'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// These modules are exported by CommonJs "module.exports = " syntax.
var md = require('markdown-it')().disable(['image']);

var katex = require('katex'); // Exported by its "dist/katex.js" as indicated by its "package.json/main".


require('katex/dist/katex.min.css');

if ('undefined' != typeof mermaid) {
  mermaid.initialize({
    startOnLoad: true
  });
}

var YAMDRenderer =
/*#__PURE__*/
function (_React$Component) {
  _inherits(YAMDRenderer, _React$Component);

  function YAMDRenderer(props) {
    var _this;

    _classCallCheck(this, YAMDRenderer);

    _this.state = {
      dangerousInnerHTML: "",
      mermaidSubstituteResidualList: []
    };
    return _possibleConstructorReturn(_this);
  }

  _createClass(YAMDRenderer, [{
    key: "mdRenderAsync",
    value: function mdRenderAsync(source) {
      return new Promise(function (resolve, reject) {
        resolve(md.render(source));
      });
    }
  }, {
    key: "imgSubstituteToRenderableAsync",
    value: function imgSubstituteToRenderableAsync(content, previewableImageList) {
      var widgetRef = this;
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
    }
  }, {
    key: "videoSubstituteToRenderableAsync",
    value: function videoSubstituteToRenderableAsync(content, previewableVideoList) {
      var widgetRef = this;
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
    }
  }, {
    key: "ktxSubstituteToRenderableAsync",
    value: function ktxSubstituteToRenderableAsync(content, disabled) {
      var widgetRef = this;
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
    }
  }, {
    key: "alnctrContentSubmittableToRenderableAsync",
    value: function alnctrContentSubmittableToRenderableAsync(content) {
      var widgetRef = this;
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
    }
  }, {
    key: "generateRandomMermaidId",
    value: function generateRandomMermaidId(idxOfRegExpTraversal) {
      return "mermaid-" + idxOfRegExpTraversal;
    }
  }, {
    key: "mermaidSubstituteToRenderableAsync",
    value: function mermaidSubstituteToRenderableAsync(content, disabled) {
      var widgetRef = this;
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
    }
  }, {
    key: "renderWithWholePipelineAsync",
    value: function renderWithWholePipelineAsync(source, previewableImageList, previewableVideoList, disableTeX, disableMermaid) {
      var widgetRef = this;
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
    }
  }, {
    key: "componentDidMount",
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
    key: "componentWillReceiveProps",
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
    key: "render",
    value: function render() {
      var widgetRef = this;
      var props = widgetRef.props;
      var style = props.style;
      return _react["default"].createElement('div', {
        style: style,
        dangerouslySetInnerHTML: {
          __html: widgetRef.state.dangerousInnerHTML
        }
      }, null);
    }
  }, {
    key: "componentDidUpdate",
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
}(_react["default"].Component);

var _default = YAMDRenderer;
exports["default"] = _default;

