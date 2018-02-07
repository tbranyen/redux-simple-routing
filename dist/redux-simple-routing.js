(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('prop-types'), require('route-parser')) :
	typeof define === 'function' && define.amd ? define(['exports', 'react', 'prop-types', 'route-parser'], factory) :
	(factory((global.reduxSimpleRouting = global.reduxSimpleRouting || {}),global.React,global.PropTypes,global.routeParser));
}(this, (function (exports,React,PropTypes,routeParser) { 'use strict';

var React__default = 'default' in React ? React['default'] : React;
PropTypes = 'default' in PropTypes ? PropTypes['default'] : PropTypes;
routeParser = 'default' in routeParser ? routeParser['default'] : routeParser;

var types = {
  POP_STATE: 'POP_STATE',
  PUSH_STATE: 'PUSH_STATE',
  REPLACE_STATE: 'REPLACE_STATE'
};

var assign = Object.assign;
var keys = Object.keys;

var routeMap = {};

var addInternalRoutes = function addInternalRoutes(routes) {
  return assign(routeMap, routes);
};

var getActiveRoute = function getActiveRoute() {
  var _location = location,
      pathname = _location.pathname;

  var activeRoute = { routeName: 'notFound' };

  keys(routeMap).some(function (routeName) {
    var route = routeMap[routeName];
    var params = route.match(pathname);

    if (params) {
      assign(activeRoute, { params: params, routeName: routeName, route: route });
      return true;
    }
  });

  return activeRoute;
};

var setActiveRoute = function setActiveRoute(state, newRoute) {
  var replace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var _location2 = location,
      pathname = _location2.pathname,
      search = _location2.search;

  var activeRoute = assign({}, state);

  if (newRoute.routeName) {
    activeRoute.routeName = newRoute.routeName;
  }

  if (newRoute.params) {
    var params = newRoute.params;


    activeRoute.params = params;

    // Coerce all params to String as that is what would come back from
    // URL parsing.
    keys(params).forEach(function (key) {
      var value = params[key];

      if (value !== null && value !== undefined) {
        params[key] = String(params[key]);
      } else {
        delete params[key];
      }
    });
  }

  var route = routeMap[activeRoute.routeName] || routeMap.notFound;
  var url = route.reverse(activeRoute.params);
  var stateMethod = replace ? 'replaceState' : 'pushState';

  if (url && '' + pathname + search !== '' + url + search) {
    history[stateMethod](null, null, '' + url + search);
  } else if (!url) {
    throw new Error('Invalid push');
  }

  return activeRoute;
};

var monitorActiveRoute = function monitorActiveRoute(store) {
  // Initial route.
  store.dispatch({ type: types.POP_STATE });

  // Monitor for changes.
  window.onpopstate = function () {
    return store.dispatch({ type: types.POP_STATE });
  };
};

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var activePage = (function (routesToPages) {
  var _class, _temp;

  return _temp = _class = function (_Component) {
    _inherits(ActivePage, _Component);

    _createClass(ActivePage, [{
      key: 'render',
      value: function render() {
        var ActivePage = this.state.ActivePage;


        return React__default.createElement(ActivePage, this.props);
      }
    }]);

    function ActivePage(props, context) {
      _classCallCheck(this, ActivePage);

      var _this = _possibleConstructorReturn(this, (ActivePage.__proto__ || Object.getPrototypeOf(ActivePage)).call(this, props, context));

      _this.setActivePage = function () {
        var _this$context$store$g = _this.context.store.getState(),
            route = _this$context$store$g.route;

        _this.setState({ ActivePage: routesToPages[route.routeName] });
      };

      var initialRouteName = _this.context.store.getState().route.routeName;
      _this.state = { ActivePage: routesToPages[initialRouteName] };
      return _this;
    }

    _createClass(ActivePage, [{
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this.unsubscribe();
      }
    }, {
      key: 'componentDidMount',
      value: function componentDidMount() {
        monitorActiveRoute(this.context.store);
        this.unsubscribe = this.context.store.subscribe(this.setActivePage);
      }
    }]);

    return ActivePage;
  }(React.Component), _class.contextTypes = {
    store: PropTypes.object
  }, _temp;
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$1 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$1(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$1(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var keys$1 = Object.keys;

var Link = function (_Component) {
  _inherits$1(Link, _Component);

  function Link() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck$1(this, Link);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn$1(this, (_ref = Link.__proto__ || Object.getPrototypeOf(Link)).call.apply(_ref, [this].concat(args))), _this), _this.navigateTo = function (ev) {
      ev.stopPropagation();
      ev.nativeEvent.stopImmediatePropagation();

      var _this$props = _this.props,
          to = _this$props.to,
          params = _this$props.params;
      var store = _this.context.store;


      store.dispatch({ type: types.PUSH_STATE, routeName: to, params: params });
    }, _this.isActive = function () {
      var _this$props2 = _this.props,
          to = _this$props2.to,
          params = _this$props2.params;
      var store = _this.context.store;

      var activeRoute = getActiveRoute();

      if (!to || to === activeRoute.routeName) {
        var activeParamNames = keys$1(activeRoute.params || {});

        return !activeParamNames.filter(function (paramName) {
          return activeRoute.params[paramName] !== params[paramName];
        }).length;
      }
    }, _temp), _possibleConstructorReturn$1(_this, _ret);
  }

  _createClass$1(Link, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          children = _props.children,
          to = _props.to,
          params = _props.params,
          rest = _objectWithoutProperties(_props, ['children', 'to', 'params']);

      var navigateTo = this.navigateTo;


      var additionalState = {
        'data-active': this.isActive() || null
      };

      return React__default.createElement(
        'nav',
        _extends({ onClick: navigateTo }, additionalState, rest),
        children
      );
    }
  }]);

  return Link;
}(React.Component);

Link.propTypes = {
  to: PropTypes.string,
  params: PropTypes.object
};
Link.contextTypes = {
  store: PropTypes.object
};
Link.defaultProps = {
  to: null,
  params: {}
};

var _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var assign$1 = Object.assign;


var reducer = (function (routes) {
  addInternalRoutes(routes);

  var initialState = _extends$1({}, getActiveRoute());

  return function route() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];

    switch (action.type) {
      case types.POP_STATE:
        {
          return assign$1({}, state, getActiveRoute());
        }

      case types.PUSH_STATE:
        {
          return assign$1({}, state, setActiveRoute(state, action));
        }

      case types.REPLACE_STATE:
        {
          return assign$1({}, state, setActiveRoute(state, action, true));
        }

      default:
        {
          return state;
        }
    }
  };
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var push = function push(to, params) {
  // Allow `routeName` aliased to `to` to be optional.
  if ((typeof to === 'undefined' ? 'undefined' : _typeof(to)) === 'object') {
    params = to;
    to = null;
  }

  return { type: types.PUSH_STATE, routeName: to, params: params };
};

var replace = function replace(to, params) {
  // Allow `routeName` aliased to `to` to be optional.
  if ((typeof to === 'undefined' ? 'undefined' : _typeof(to)) === 'object') {
    params = to;
    to = null;
  }

  return { type: types.REPLACE_STATE, routeName: to, params: params };
};

var actions = { push: push, replace: replace };

exports.maintainActivePage = activePage;
exports.Link = Link;
exports.types = types;
exports.routeReducer = reducer;
exports.Route = routeParser;
exports.routeActions = actions;

Object.defineProperty(exports, '__esModule', { value: true });

})));
