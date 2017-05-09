'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Choo;

var _documentReady = require('document-ready');

var _documentReady2 = _interopRequireDefault(_documentReady);

var _nanohistory = require('nanohistory');

var _nanohistory2 = _interopRequireDefault(_nanohistory);

var _nanorouter = require('nanorouter');

var _nanorouter2 = _interopRequireDefault(_nanorouter);

var _nanomount = require('nanomount');

var _nanomount2 = _interopRequireDefault(_nanomount);

var _nanomorph = require('nanomorph');

var _nanomorph2 = _interopRequireDefault(_nanomorph);

var _nanohref = require('nanohref');

var _nanohref2 = _interopRequireDefault(_nanohref);

var _nanoraf = require('nanoraf');

var _nanoraf2 = _interopRequireDefault(_nanoraf);

var _nanobus = require('nanobus');

var _nanobus2 = _interopRequireDefault(_nanobus);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Choo(opts) {
  opts = opts || {};

  var routerOpts = {
    default: opts.defaultRoute || '/404',
    curry: true
  };

  var timingEnabled = opts.timing === undefined ? true : opts.timing;
  var hasWindow = typeof window !== 'undefined';
  var hasPerformance = hasWindow && window.performance && window.performance.mark;
  var router = (0, _nanorouter2.default)(routerOpts);
  var bus = (0, _nanobus2.default)();
  var rerender = null;
  var tree = null;
  var state = {};

  return {
    toString: toString,
    use: register,
    mount: mount,
    router: router,
    route: route,
    start: start
  };

  function route(route, handler) {
    router.on(route, function (params) {
      return function () {
        state.params = params;
        return handler(state, emit);
      };
    });
  }

  function register(cb) {
    cb(state, bus);
  }

  function start() {
    tree = router(createLocation());
    rerender = (0, _nanoraf2.default)(function () {
      if (hasPerformance && timingEnabled) {
        window.performance.mark('choo:renderStart');
      }
      var newTree = router(createLocation());
      tree = (0, _nanomorph2.default)(tree, newTree);
      _assert2.default.notEqual(tree, newTree, 'choo.start: a different node type was returned as the root node on a rerender. Make sure that the root node is always the same type to prevent the application from being unmounted.');
      if (hasPerformance && timingEnabled) {
        window.performance.mark('choo:renderEnd');
        window.performance.measure('choo:render', 'choo:renderStart', 'choo:renderEnd');
      }
    });

    bus.prependListener('render', rerender);

    if (opts.history != false) {
      (0, _nanohistory2.default)(function (href) {
        bus.emit('pushState');
      });

      bus.prependListener('pushState', function (href) {
        if (href) window.history.pushState({}, null, href);
        bus.emit('render');
        setTimeout(function () {
          scrollIntoView();
        }, 0);
      });

      if (opts.href != false) {
        (0, _nanohref2.default)(function (location) {
          var href = location.href;
          var currHref = window.location.href;
          if (href === currHref) return;
          bus.emit('pushState', href);
        });
      }
    }

    (0, _documentReady2.default)(function () {
      bus.emit('DOMContentLoaded');
    });

    return tree;
  }

  function emit(eventName, data) {
    bus.emit(eventName, data);
  }

  function mount(selector) {
    var newTree = start();
    (0, _documentReady2.default)(function () {
      var root = document.querySelector(selector);
      _assert2.default.ok(root, 'choo.mount: could not query selector: ' + selector);
      (0, _nanomount2.default)(root, newTree);
      tree = root;
    });
  }

  function toString(location, _state) {
    state = _state || {};
    var html = router(location);
    _assert2.default.equal();
    return html.toString();
  }
}

function scrollIntoView() {
  var hash = window.location.hash;
  if (hash) {
    try {
      var el = document.querySelector(hash);
      if (el) el.scrollIntoView(true);
    } catch (e) {}
  }
}

function createLocation() {
  var pathname = window.location.pathname.replace(/\/$/, '');
  var hash = window.location.hash.replace(/^#/, '/');
  return pathname + hash;
}

