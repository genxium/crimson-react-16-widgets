'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _shared = require("./shared");

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Paginator =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Paginator, _React$Component);

  _createClass(Paginator, [{
    key: "requestDataAsync",
    value: function requestDataAsync(requestedPage) {
      var widgetRef = this;
      var props = widgetRef.props;
      var dataUrl = props.dataUrl;
      var collectFilters = props.collectFilters;
      var paramDict = {
        page: requestedPage
      };
      Object.assign(paramDict, collectFilters());
      return (0, _shared.httpGet)(dataUrl, paramDict).then(function (response) {
        return response.json();
      }).then(function (responseData) {
        return new Promise(function (resolve, reject) {
          resolve(responseData);
        });
      });
    }
  }, {
    key: "_createNoResultHeader",
    value: function _createNoResultHeader(idx) {
      var widgetRef = this;
      var props = widgetRef.props;
      var View = props.View;
      var Image = props.Image;

      var noResultHint = _react["default"].createElement(View, {
        key: 'paginator-no-result-hint'
      }, "".concat(props.noResultHint));

      var noResultHintIcon = _react["default"].createElement(props.noResultHintIcon, {
        key: 'paginator-no-result-hint-icon'
      }, null);

      return _react["default"].createElement(View, {
        idx: idx,
        key: idx,
        ref: function ref(c) {
          if (!c) return;
          var newHeight = (0, _shared.getRenderedComponentSize)(c).height;
          var theIdx = c.props.idx;
          var headerHeightDict = {};

          for (var k in widgetRef.state.headerHeightDict) {
            headerHeightDict[k] = widgetRef.state.headerHeightDict[k];
          }

          var oldHeight = !headerHeightDict.hasOwnProperty(theIdx) ? null : headerHeightDict[theIdx];
          if (oldHeight == newHeight) return;
          headerHeightDict[theIdx] = newHeight;
          widgetRef.setState({
            headerHeightDict: headerHeightDict
          });
        },
        style: {
          textAlign: 'center'
        }
      }, [noResultHint, noResultHintIcon]);
    }
  }]);

  function Paginator(props) {
    var _this;

    _classCallCheck(this, Paginator);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Paginator).call(this, props));
    _this._footerHeightPx = 32;
    _this.styles = {
      footer: {
        position: 'relative',
        left: 0,
        right: 0,
        height: _this._footerHeightPx
      },
      footerBtn: {
        position: 'absolute',
        width: '40%',
        border: 'none',
        outline: 'none',
        boxShadow: 'none',
        padding: '0',
        verticalAlign: 'middle',
        height: _this._footerHeightPx
      },
      activePage: {
        position: 'absolute',
        width: '20%',
        lineHeight: _this._footerHeightPx.toString() + 'px',
        height: _this._footerHeightPx,
        fontSize: 20,
        textAlign: 'center',
        verticalAlign: 'middle',
        left: '40%'
      }
    };
    _this._listviewRef = null;
    _this._footerRef = null;
    _this.state = {
      headerHeightDict: {},
      cellHeightDict: {}
    };
    return _this;
  }

  _createClass(Paginator, [{
    key: "_wrapSingleCell",
    value: function _wrapSingleCell(idx, singleCell) {
      var widgetRef = this;
      var props = widgetRef.props;
      var View = props.View;

      var wrappedCell = _react["default"].createElement(View, {
        idx: idx,
        key: idx,
        ref: function ref(c) {
          if (!c) return;
          var newHeight = (0, _shared.getRenderedComponentSize)(c).height;
          var theIdx = c.props.idx;
          var cellHeightDict = {};

          for (var k in widgetRef.state.cellHeightDict) {
            cellHeightDict[k] = widgetRef.state.cellHeightDict[k];
          }

          var oldHeight = !cellHeightDict.hasOwnProperty(theIdx) ? null : cellHeightDict[theIdx];
          if (oldHeight == newHeight) return;
          cellHeightDict[theIdx] = newHeight;
          widgetRef.setState({
            cellHeightDict: cellHeightDict
          });
        }
      }, singleCell);

      return wrappedCell;
    }
  }, {
    key: "_wrapSingleHeader",
    value: function _wrapSingleHeader(idx, singleHeader) {
      var widgetRef = this;
      var props = widgetRef.props;
      var View = props.View;

      var wrappedHeader = _react["default"].createElement(View, {
        idx: idx,
        key: idx,
        ref: function ref(c) {
          if (!c) return;
          var newHeight = (0, _shared.getRenderedComponentSize)(c).height;
          var theIdx = c.props.idx;
          var headerHeightDict = {};

          for (var k in widgetRef.state.headerHeightDict) {
            headerHeightDict[k] = widgetRef.state.headerHeightDict[k];
          }

          var oldHeight = !headerHeightDict.hasOwnProperty(theIdx) ? null : headerHeightDict[theIdx];
          if (oldHeight == newHeight) return;
          headerHeightDict[theIdx] = newHeight;
          widgetRef.setState({
            headerHeightDict: headerHeightDict
          });
        }
      }, singleHeader);

      return wrappedHeader;
    }
  }, {
    key: "render",
    value: function render() {
      var widgetRef = this;
      var props = widgetRef.props;
      var View = props.View;
      var Text = props.Text;
      var Image = props.Image;
      var Button = props.Button;
      var totSizePx = props.totSizePx;
      var activePage = props.activePage;
      var onPageSelectedBridge = props.onPageSelectedBridge;
      var cellHeight = props.cellHeight;
      var cellList = props.cellList;
      var presetHeaderList = props.presetHeaderList;
      var nPerPage = props.nPerPage;
      var BackArrow = props.BackArrow;
      var styles = widgetRef.styles;
      var page = activePage();
      var shouldDisplayBackwardBtn = 1 < page;
      var effectivePresetHeaderCount = undefined === presetHeaderList || null === presetHeaderList ? 0 : presetHeaderList.length;
      var netCellCount = cellList.length;
      var shouldDisplayNoResultHeader = 0 >= netCellCount;
      var dynamicNperpage = undefined === nPerPage ? 10
      /* temporarily hardcoded magic number */
      : nPerPage;
      var shouldDisplayForwardBtn = !shouldDisplayNoResultHeader && dynamicNperpage <= netCellCount;
      var wrappedHeaderList = [];

      if (undefined !== presetHeaderList && null !== presetHeaderList) {
        for (var i = 0; i < presetHeaderList.length; ++i) {
          var wrappedHeader = widgetRef._wrapSingleHeader(i, presetHeaderList[i]);

          wrappedHeaderList.push(wrappedHeader);
        }
      }

      var noResultHeaderIdx = effectivePresetHeaderCount;
      var noResultHeader = shouldDisplayNoResultHeader ? widgetRef._createNoResultHeader(noResultHeaderIdx) : null;

      if (null !== noResultHeader) {
        wrappedHeaderList.push(noResultHeader);
      }

      var wrappedCellList = [];

      for (var _i = 0; _i < cellList.length; ++_i) {
        var wrappedCell = widgetRef._wrapSingleCell(_i + wrappedHeaderList.length, cellList[_i]);

        wrappedCellList.push(wrappedCell);
      }

      var allCellList = [];

      for (var _i2 = 0; _i2 < wrappedHeaderList.length; ++_i2) {
        allCellList.push(wrappedHeaderList[_i2]);
      }

      for (var _i3 = 0; _i3 < wrappedCellList.length; ++_i3) {
        allCellList.push(wrappedCellList[_i3]);
      }

      var allCellHeightList = [];

      for (var _i4 = 0; _i4 < wrappedHeaderList.length; ++_i4) {
        var theIdx = _i4;

        if (widgetRef.state.headerHeightDict.hasOwnProperty(theIdx)) {
          allCellHeightList.push(widgetRef.state.headerHeightDict[theIdx]);
        } else {
          allCellHeightList.push(cellHeight);
        }
      }

      for (var _i5 = 0; _i5 < wrappedCellList.length; ++_i5) {
        var _theIdx = _i5 + wrappedHeaderList.length;

        if (widgetRef.state.cellHeightDict.hasOwnProperty(_theIdx)) {
          allCellHeightList.push(widgetRef.state.cellHeightDict[_theIdx]);
        } else {
          allCellHeightList.push(cellHeight);
        }
      }

      var backArrowElement = _react["default"].createElement(BackArrow, null, null);

      var backwardBtn = _react["default"].createElement(Button, {
        key: 'paginator-backward-btn',
        onPress: function onPress(evt) {
          var selectedPage = page - 1;
          onPageSelectedBridge(selectedPage);
        },
        style: Object.assign({
          background: 'transparent',
          display: shouldDisplayBackwardBtn ? 'inline' : 'none',
          left: '0',
          transform: 'scaleX(-1)'
        }, styles.footerBtn)
      }, backArrowElement);

      var forwardBtn = _react["default"].createElement(Button, {
        key: 'paginator-forward-btn',
        onPress: function onPress(evt) {
          var selectedPage = page + 1;
          onPageSelectedBridge(selectedPage);
        },
        style: Object.assign({
          background: 'transparent',
          display: shouldDisplayForwardBtn ? 'inline' : 'none',
          left: '60%'
        }, styles.footerBtn)
      }, backArrowElement);

      var footer = null;

      var onFooterMounted = function onFooterMounted(c) {
        if (!c) return;
        if (null !== widgetRef._footerRef) return;
        widgetRef._footerRef = c;
      };

      var listView = null;
      var wrapperHeight = totSizePx.height - widgetRef._footerHeightPx;
      var listViewProps = Object.assign({
        key: 'paginator-listview',
        style: {
          height: wrapperHeight,
          overflowY: 'scroll',
          WebkitOverflowScrolling: 'touch'
        },
        ref: function ref(c) {
          if (null === c) return;
          if (null !== widgetRef._listviewRef) return;
          widgetRef._listviewRef = c;
        }
      });
      listView = _react["default"].createElement(View, listViewProps, allCellList);
      var footerStyle = {};
      Object.assign(footerStyle, styles.footer);

      var pageIndicator = _react["default"].createElement(View, {
        key: 'paginator-page-indicator',
        style: styles.activePage
      }, "".concat(page));

      footer = _react["default"].createElement(View, {
        key: 'paginator-footer',
        ref: onFooterMounted,
        style: footerStyle
      }, [backwardBtn, pageIndicator, forwardBtn]);
      var overallStyle = {};
      Object.assign(overallStyle, widgetRef.props.style);
      return _react["default"].createElement(View, {
        style: overallStyle
      }, [listView, footer]);
    }
  }]);

  return Paginator;
}(_react["default"].Component);

var _default = Paginator;
exports["default"] = _default;

