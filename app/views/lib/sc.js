var sc = (function (exports) {
  'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
      return;
    }

    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */

  /* global Reflect, Promise */
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  function __extends(d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }

  var _assign = function __assign() {
    _assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];

        for (var p in s) {
          if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
      }

      return t;
    };

    return _assign.apply(this, arguments);
  };

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  function isFunction(x) {
    return typeof x === 'function';
  }

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  var _enable_super_gross_mode_that_will_cause_bad_things = false;
  var config = {
    Promise: undefined,

    set useDeprecatedSynchronousErrorHandling(value) {
      if (value) {
        var error =
        /*@__PURE__*/
        new Error();
        /*@__PURE__*/

        console.warn('DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: \n' + error.stack);
      }

      _enable_super_gross_mode_that_will_cause_bad_things = value;
    },

    get useDeprecatedSynchronousErrorHandling() {
      return _enable_super_gross_mode_that_will_cause_bad_things;
    }

  };

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  function hostReportError(err) {
    setTimeout(function () {
      throw err;
    }, 0);
  }

  /** PURE_IMPORTS_START _config,_util_hostReportError PURE_IMPORTS_END */
  var empty = {
    closed: true,
    next: function next(value) {},
    error: function error(err) {
      if (config.useDeprecatedSynchronousErrorHandling) {
        throw err;
      } else {
        hostReportError(err);
      }
    },
    complete: function complete() {}
  };

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  var isArray =
  /*@__PURE__*/
  function () {
    return Array.isArray || function (x) {
      return x && typeof x.length === 'number';
    };
  }();

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  function isObject(x) {
    return x !== null && _typeof(x) === 'object';
  }

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  var UnsubscriptionErrorImpl =
  /*@__PURE__*/
  function () {
    function UnsubscriptionErrorImpl(errors) {
      Error.call(this);
      this.message = errors ? errors.length + " errors occurred during unsubscription:\n" + errors.map(function (err, i) {
        return i + 1 + ") " + err.toString();
      }).join('\n  ') : '';
      this.name = 'UnsubscriptionError';
      this.errors = errors;
      return this;
    }

    UnsubscriptionErrorImpl.prototype =
    /*@__PURE__*/
    Object.create(Error.prototype);
    return UnsubscriptionErrorImpl;
  }();

  var UnsubscriptionError = UnsubscriptionErrorImpl;

  var Subscription =
  /*@__PURE__*/
  function () {
    function Subscription(unsubscribe) {
      this.closed = false;
      this._parentOrParents = null;
      this._subscriptions = null;

      if (unsubscribe) {
        this._unsubscribe = unsubscribe;
      }
    }

    Subscription.prototype.unsubscribe = function () {
      var errors;

      if (this.closed) {
        return;
      }

      var _a = this,
          _parentOrParents = _a._parentOrParents,
          _unsubscribe = _a._unsubscribe,
          _subscriptions = _a._subscriptions;

      this.closed = true;
      this._parentOrParents = null;
      this._subscriptions = null;

      if (_parentOrParents instanceof Subscription) {
        _parentOrParents.remove(this);
      } else if (_parentOrParents !== null) {
        for (var index = 0; index < _parentOrParents.length; ++index) {
          var parent_1 = _parentOrParents[index];
          parent_1.remove(this);
        }
      }

      if (isFunction(_unsubscribe)) {
        try {
          _unsubscribe.call(this);
        } catch (e) {
          errors = e instanceof UnsubscriptionError ? flattenUnsubscriptionErrors(e.errors) : [e];
        }
      }

      if (isArray(_subscriptions)) {
        var index = -1;
        var len = _subscriptions.length;

        while (++index < len) {
          var sub = _subscriptions[index];

          if (isObject(sub)) {
            try {
              sub.unsubscribe();
            } catch (e) {
              errors = errors || [];

              if (e instanceof UnsubscriptionError) {
                errors = errors.concat(flattenUnsubscriptionErrors(e.errors));
              } else {
                errors.push(e);
              }
            }
          }
        }
      }

      if (errors) {
        throw new UnsubscriptionError(errors);
      }
    };

    Subscription.prototype.add = function (teardown) {
      var subscription = teardown;

      if (!teardown) {
        return Subscription.EMPTY;
      }

      switch (_typeof(teardown)) {
        case 'function':
          subscription = new Subscription(teardown);

        case 'object':
          if (subscription === this || subscription.closed || typeof subscription.unsubscribe !== 'function') {
            return subscription;
          } else if (this.closed) {
            subscription.unsubscribe();
            return subscription;
          } else if (!(subscription instanceof Subscription)) {
            var tmp = subscription;
            subscription = new Subscription();
            subscription._subscriptions = [tmp];
          }

          break;

        default:
          {
            throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
          }
      }

      var _parentOrParents = subscription._parentOrParents;

      if (_parentOrParents === null) {
        subscription._parentOrParents = this;
      } else if (_parentOrParents instanceof Subscription) {
        if (_parentOrParents === this) {
          return subscription;
        }

        subscription._parentOrParents = [_parentOrParents, this];
      } else if (_parentOrParents.indexOf(this) === -1) {
        _parentOrParents.push(this);
      } else {
        return subscription;
      }

      var subscriptions = this._subscriptions;

      if (subscriptions === null) {
        this._subscriptions = [subscription];
      } else {
        subscriptions.push(subscription);
      }

      return subscription;
    };

    Subscription.prototype.remove = function (subscription) {
      var subscriptions = this._subscriptions;

      if (subscriptions) {
        var subscriptionIndex = subscriptions.indexOf(subscription);

        if (subscriptionIndex !== -1) {
          subscriptions.splice(subscriptionIndex, 1);
        }
      }
    };

    Subscription.EMPTY = function (empty) {
      empty.closed = true;
      return empty;
    }(new Subscription());

    return Subscription;
  }();

  function flattenUnsubscriptionErrors(errors) {
    return errors.reduce(function (errs, err) {
      return errs.concat(err instanceof UnsubscriptionError ? err.errors : err);
    }, []);
  }

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  var rxSubscriber =
  /*@__PURE__*/
  function () {
    return typeof Symbol === 'function' ?
    /*@__PURE__*/
    Symbol('rxSubscriber') : '@@rxSubscriber_' +
    /*@__PURE__*/
    Math.random();
  }();

  var Subscriber =
  /*@__PURE__*/
  function (_super) {
    __extends(Subscriber, _super);

    function Subscriber(destinationOrNext, error, complete) {
      var _this = _super.call(this) || this;

      _this.syncErrorValue = null;
      _this.syncErrorThrown = false;
      _this.syncErrorThrowable = false;
      _this.isStopped = false;

      switch (arguments.length) {
        case 0:
          _this.destination = empty;
          break;

        case 1:
          if (!destinationOrNext) {
            _this.destination = empty;
            break;
          }

          if (_typeof(destinationOrNext) === 'object') {
            if (destinationOrNext instanceof Subscriber) {
              _this.syncErrorThrowable = destinationOrNext.syncErrorThrowable;
              _this.destination = destinationOrNext;
              destinationOrNext.add(_this);
            } else {
              _this.syncErrorThrowable = true;
              _this.destination = new SafeSubscriber(_this, destinationOrNext);
            }

            break;
          }

        default:
          _this.syncErrorThrowable = true;
          _this.destination = new SafeSubscriber(_this, destinationOrNext, error, complete);
          break;
      }

      return _this;
    }

    Subscriber.prototype[rxSubscriber] = function () {
      return this;
    };

    Subscriber.create = function (next, error, complete) {
      var subscriber = new Subscriber(next, error, complete);
      subscriber.syncErrorThrowable = false;
      return subscriber;
    };

    Subscriber.prototype.next = function (value) {
      if (!this.isStopped) {
        this._next(value);
      }
    };

    Subscriber.prototype.error = function (err) {
      if (!this.isStopped) {
        this.isStopped = true;

        this._error(err);
      }
    };

    Subscriber.prototype.complete = function () {
      if (!this.isStopped) {
        this.isStopped = true;

        this._complete();
      }
    };

    Subscriber.prototype.unsubscribe = function () {
      if (this.closed) {
        return;
      }

      this.isStopped = true;

      _super.prototype.unsubscribe.call(this);
    };

    Subscriber.prototype._next = function (value) {
      this.destination.next(value);
    };

    Subscriber.prototype._error = function (err) {
      this.destination.error(err);
      this.unsubscribe();
    };

    Subscriber.prototype._complete = function () {
      this.destination.complete();
      this.unsubscribe();
    };

    Subscriber.prototype._unsubscribeAndRecycle = function () {
      var _parentOrParents = this._parentOrParents;
      this._parentOrParents = null;
      this.unsubscribe();
      this.closed = false;
      this.isStopped = false;
      this._parentOrParents = _parentOrParents;
      return this;
    };

    return Subscriber;
  }(Subscription);

  var SafeSubscriber =
  /*@__PURE__*/
  function (_super) {
    __extends(SafeSubscriber, _super);

    function SafeSubscriber(_parentSubscriber, observerOrNext, error, complete) {
      var _this = _super.call(this) || this;

      _this._parentSubscriber = _parentSubscriber;
      var next;
      var context = _this;

      if (isFunction(observerOrNext)) {
        next = observerOrNext;
      } else if (observerOrNext) {
        next = observerOrNext.next;
        error = observerOrNext.error;
        complete = observerOrNext.complete;

        if (observerOrNext !== empty) {
          context = Object.create(observerOrNext);

          if (isFunction(context.unsubscribe)) {
            _this.add(context.unsubscribe.bind(context));
          }

          context.unsubscribe = _this.unsubscribe.bind(_this);
        }
      }

      _this._context = context;
      _this._next = next;
      _this._error = error;
      _this._complete = complete;
      return _this;
    }

    SafeSubscriber.prototype.next = function (value) {
      if (!this.isStopped && this._next) {
        var _parentSubscriber = this._parentSubscriber;

        if (!config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
          this.__tryOrUnsub(this._next, value);
        } else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
          this.unsubscribe();
        }
      }
    };

    SafeSubscriber.prototype.error = function (err) {
      if (!this.isStopped) {
        var _parentSubscriber = this._parentSubscriber;
        var useDeprecatedSynchronousErrorHandling = config.useDeprecatedSynchronousErrorHandling;

        if (this._error) {
          if (!useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
            this.__tryOrUnsub(this._error, err);

            this.unsubscribe();
          } else {
            this.__tryOrSetError(_parentSubscriber, this._error, err);

            this.unsubscribe();
          }
        } else if (!_parentSubscriber.syncErrorThrowable) {
          this.unsubscribe();

          if (useDeprecatedSynchronousErrorHandling) {
            throw err;
          }

          hostReportError(err);
        } else {
          if (useDeprecatedSynchronousErrorHandling) {
            _parentSubscriber.syncErrorValue = err;
            _parentSubscriber.syncErrorThrown = true;
          } else {
            hostReportError(err);
          }

          this.unsubscribe();
        }
      }
    };

    SafeSubscriber.prototype.complete = function () {
      var _this = this;

      if (!this.isStopped) {
        var _parentSubscriber = this._parentSubscriber;

        if (this._complete) {
          var wrappedComplete = function wrappedComplete() {
            return _this._complete.call(_this._context);
          };

          if (!config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
            this.__tryOrUnsub(wrappedComplete);

            this.unsubscribe();
          } else {
            this.__tryOrSetError(_parentSubscriber, wrappedComplete);

            this.unsubscribe();
          }
        } else {
          this.unsubscribe();
        }
      }
    };

    SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
      try {
        fn.call(this._context, value);
      } catch (err) {
        this.unsubscribe();

        if (config.useDeprecatedSynchronousErrorHandling) {
          throw err;
        } else {
          hostReportError(err);
        }
      }
    };

    SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
      if (!config.useDeprecatedSynchronousErrorHandling) {
        throw new Error('bad call');
      }

      try {
        fn.call(this._context, value);
      } catch (err) {
        if (config.useDeprecatedSynchronousErrorHandling) {
          parent.syncErrorValue = err;
          parent.syncErrorThrown = true;
          return true;
        } else {
          hostReportError(err);
          return true;
        }
      }

      return false;
    };

    SafeSubscriber.prototype._unsubscribe = function () {
      var _parentSubscriber = this._parentSubscriber;
      this._context = null;
      this._parentSubscriber = null;

      _parentSubscriber.unsubscribe();
    };

    return SafeSubscriber;
  }(Subscriber);

  /** PURE_IMPORTS_START _Subscriber PURE_IMPORTS_END */
  function canReportError(observer) {
    while (observer) {
      var _a = observer,
          closed_1 = _a.closed,
          destination = _a.destination,
          isStopped = _a.isStopped;

      if (closed_1 || isStopped) {
        return false;
      } else if (destination && destination instanceof Subscriber) {
        observer = destination;
      } else {
        observer = null;
      }
    }

    return true;
  }

  /** PURE_IMPORTS_START _Subscriber,_symbol_rxSubscriber,_Observer PURE_IMPORTS_END */
  function toSubscriber(nextOrObserver, error, complete) {
    if (nextOrObserver) {
      if (nextOrObserver instanceof Subscriber) {
        return nextOrObserver;
      }

      if (nextOrObserver[rxSubscriber]) {
        return nextOrObserver[rxSubscriber]();
      }
    }

    if (!nextOrObserver && !error && !complete) {
      return new Subscriber(empty);
    }

    return new Subscriber(nextOrObserver, error, complete);
  }

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  var observable =
  /*@__PURE__*/
  function () {
    return typeof Symbol === 'function' && Symbol.observable || '@@observable';
  }();

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  function noop() {}

  /** PURE_IMPORTS_START _noop PURE_IMPORTS_END */
  function pipeFromArray(fns) {
    if (!fns) {
      return noop;
    }

    if (fns.length === 1) {
      return fns[0];
    }

    return function piped(input) {
      return fns.reduce(function (prev, fn) {
        return fn(prev);
      }, input);
    };
  }

  /** PURE_IMPORTS_START _util_canReportError,_util_toSubscriber,_symbol_observable,_util_pipe,_config PURE_IMPORTS_END */

  var Observable =
  /*@__PURE__*/
  function () {
    function Observable(subscribe) {
      this._isScalar = false;

      if (subscribe) {
        this._subscribe = subscribe;
      }
    }

    Observable.prototype.lift = function (operator) {
      var observable = new Observable();
      observable.source = this;
      observable.operator = operator;
      return observable;
    };

    Observable.prototype.subscribe = function (observerOrNext, error, complete) {
      var operator = this.operator;
      var sink = toSubscriber(observerOrNext, error, complete);

      if (operator) {
        sink.add(operator.call(sink, this.source));
      } else {
        sink.add(this.source || config.useDeprecatedSynchronousErrorHandling && !sink.syncErrorThrowable ? this._subscribe(sink) : this._trySubscribe(sink));
      }

      if (config.useDeprecatedSynchronousErrorHandling) {
        if (sink.syncErrorThrowable) {
          sink.syncErrorThrowable = false;

          if (sink.syncErrorThrown) {
            throw sink.syncErrorValue;
          }
        }
      }

      return sink;
    };

    Observable.prototype._trySubscribe = function (sink) {
      try {
        return this._subscribe(sink);
      } catch (err) {
        if (config.useDeprecatedSynchronousErrorHandling) {
          sink.syncErrorThrown = true;
          sink.syncErrorValue = err;
        }

        if (canReportError(sink)) {
          sink.error(err);
        } else {
          console.warn(err);
        }
      }
    };

    Observable.prototype.forEach = function (next, promiseCtor) {
      var _this = this;

      promiseCtor = getPromiseCtor(promiseCtor);
      return new promiseCtor(function (resolve, reject) {
        var subscription;
        subscription = _this.subscribe(function (value) {
          try {
            next(value);
          } catch (err) {
            reject(err);

            if (subscription) {
              subscription.unsubscribe();
            }
          }
        }, reject, resolve);
      });
    };

    Observable.prototype._subscribe = function (subscriber) {
      var source = this.source;
      return source && source.subscribe(subscriber);
    };

    Observable.prototype[observable] = function () {
      return this;
    };

    Observable.prototype.pipe = function () {
      var operations = [];

      for (var _i = 0; _i < arguments.length; _i++) {
        operations[_i] = arguments[_i];
      }

      if (operations.length === 0) {
        return this;
      }

      return pipeFromArray(operations)(this);
    };

    Observable.prototype.toPromise = function (promiseCtor) {
      var _this = this;

      promiseCtor = getPromiseCtor(promiseCtor);
      return new promiseCtor(function (resolve, reject) {
        var value;

        _this.subscribe(function (x) {
          return value = x;
        }, function (err) {
          return reject(err);
        }, function () {
          return resolve(value);
        });
      });
    };

    Observable.create = function (subscribe) {
      return new Observable(subscribe);
    };

    return Observable;
  }();

  function getPromiseCtor(promiseCtor) {
    if (!promiseCtor) {
      promiseCtor =  Promise;
    }

    if (!promiseCtor) {
      throw new Error('no Promise impl found');
    }

    return promiseCtor;
  }

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  var ObjectUnsubscribedErrorImpl =
  /*@__PURE__*/
  function () {
    function ObjectUnsubscribedErrorImpl() {
      Error.call(this);
      this.message = 'object unsubscribed';
      this.name = 'ObjectUnsubscribedError';
      return this;
    }

    ObjectUnsubscribedErrorImpl.prototype =
    /*@__PURE__*/
    Object.create(Error.prototype);
    return ObjectUnsubscribedErrorImpl;
  }();

  var ObjectUnsubscribedError = ObjectUnsubscribedErrorImpl;

  /** PURE_IMPORTS_START tslib,_Subscription PURE_IMPORTS_END */

  var SubjectSubscription =
  /*@__PURE__*/
  function (_super) {
    __extends(SubjectSubscription, _super);

    function SubjectSubscription(subject, subscriber) {
      var _this = _super.call(this) || this;

      _this.subject = subject;
      _this.subscriber = subscriber;
      _this.closed = false;
      return _this;
    }

    SubjectSubscription.prototype.unsubscribe = function () {
      if (this.closed) {
        return;
      }

      this.closed = true;
      var subject = this.subject;
      var observers = subject.observers;
      this.subject = null;

      if (!observers || observers.length === 0 || subject.isStopped || subject.closed) {
        return;
      }

      var subscriberIndex = observers.indexOf(this.subscriber);

      if (subscriberIndex !== -1) {
        observers.splice(subscriberIndex, 1);
      }
    };

    return SubjectSubscription;
  }(Subscription);

  /** PURE_IMPORTS_START tslib,_Observable,_Subscriber,_Subscription,_util_ObjectUnsubscribedError,_SubjectSubscription,_internal_symbol_rxSubscriber PURE_IMPORTS_END */

  var SubjectSubscriber =
  /*@__PURE__*/
  function (_super) {
    __extends(SubjectSubscriber, _super);

    function SubjectSubscriber(destination) {
      var _this = _super.call(this, destination) || this;

      _this.destination = destination;
      return _this;
    }

    return SubjectSubscriber;
  }(Subscriber);

  var Subject =
  /*@__PURE__*/
  function (_super) {
    __extends(Subject, _super);

    function Subject() {
      var _this = _super.call(this) || this;

      _this.observers = [];
      _this.closed = false;
      _this.isStopped = false;
      _this.hasError = false;
      _this.thrownError = null;
      return _this;
    }

    Subject.prototype[rxSubscriber] = function () {
      return new SubjectSubscriber(this);
    };

    Subject.prototype.lift = function (operator) {
      var subject = new AnonymousSubject(this, this);
      subject.operator = operator;
      return subject;
    };

    Subject.prototype.next = function (value) {
      if (this.closed) {
        throw new ObjectUnsubscribedError();
      }

      if (!this.isStopped) {
        var observers = this.observers;
        var len = observers.length;
        var copy = observers.slice();

        for (var i = 0; i < len; i++) {
          copy[i].next(value);
        }
      }
    };

    Subject.prototype.error = function (err) {
      if (this.closed) {
        throw new ObjectUnsubscribedError();
      }

      this.hasError = true;
      this.thrownError = err;
      this.isStopped = true;
      var observers = this.observers;
      var len = observers.length;
      var copy = observers.slice();

      for (var i = 0; i < len; i++) {
        copy[i].error(err);
      }

      this.observers.length = 0;
    };

    Subject.prototype.complete = function () {
      if (this.closed) {
        throw new ObjectUnsubscribedError();
      }

      this.isStopped = true;
      var observers = this.observers;
      var len = observers.length;
      var copy = observers.slice();

      for (var i = 0; i < len; i++) {
        copy[i].complete();
      }

      this.observers.length = 0;
    };

    Subject.prototype.unsubscribe = function () {
      this.isStopped = true;
      this.closed = true;
      this.observers = null;
    };

    Subject.prototype._trySubscribe = function (subscriber) {
      if (this.closed) {
        throw new ObjectUnsubscribedError();
      } else {
        return _super.prototype._trySubscribe.call(this, subscriber);
      }
    };

    Subject.prototype._subscribe = function (subscriber) {
      if (this.closed) {
        throw new ObjectUnsubscribedError();
      } else if (this.hasError) {
        subscriber.error(this.thrownError);
        return Subscription.EMPTY;
      } else if (this.isStopped) {
        subscriber.complete();
        return Subscription.EMPTY;
      } else {
        this.observers.push(subscriber);
        return new SubjectSubscription(this, subscriber);
      }
    };

    Subject.prototype.asObservable = function () {
      var observable = new Observable();
      observable.source = this;
      return observable;
    };

    Subject.create = function (destination, source) {
      return new AnonymousSubject(destination, source);
    };

    return Subject;
  }(Observable);

  var AnonymousSubject =
  /*@__PURE__*/
  function (_super) {
    __extends(AnonymousSubject, _super);

    function AnonymousSubject(destination, source) {
      var _this = _super.call(this) || this;

      _this.destination = destination;
      _this.source = source;
      return _this;
    }

    AnonymousSubject.prototype.next = function (value) {
      var destination = this.destination;

      if (destination && destination.next) {
        destination.next(value);
      }
    };

    AnonymousSubject.prototype.error = function (err) {
      var destination = this.destination;

      if (destination && destination.error) {
        this.destination.error(err);
      }
    };

    AnonymousSubject.prototype.complete = function () {
      var destination = this.destination;

      if (destination && destination.complete) {
        this.destination.complete();
      }
    };

    AnonymousSubject.prototype._subscribe = function (subscriber) {
      var source = this.source;

      if (source) {
        return this.source.subscribe(subscriber);
      } else {
        return Subscription.EMPTY;
      }
    };

    return AnonymousSubject;
  }(Subject);

  /** PURE_IMPORTS_START tslib,_Subscription PURE_IMPORTS_END */

  var Action =
  /*@__PURE__*/
  function (_super) {
    __extends(Action, _super);

    function Action(scheduler, work) {
      return _super.call(this) || this;
    }

    Action.prototype.schedule = function (state, delay) {

      return this;
    };

    return Action;
  }(Subscription);

  /** PURE_IMPORTS_START tslib,_Action PURE_IMPORTS_END */

  var AsyncAction =
  /*@__PURE__*/
  function (_super) {
    __extends(AsyncAction, _super);

    function AsyncAction(scheduler, work) {
      var _this = _super.call(this, scheduler, work) || this;

      _this.scheduler = scheduler;
      _this.work = work;
      _this.pending = false;
      return _this;
    }

    AsyncAction.prototype.schedule = function (state, delay) {
      if (delay === void 0) {
        delay = 0;
      }

      if (this.closed) {
        return this;
      }

      this.state = state;
      var id = this.id;
      var scheduler = this.scheduler;

      if (id != null) {
        this.id = this.recycleAsyncId(scheduler, id, delay);
      }

      this.pending = true;
      this.delay = delay;
      this.id = this.id || this.requestAsyncId(scheduler, this.id, delay);
      return this;
    };

    AsyncAction.prototype.requestAsyncId = function (scheduler, id, delay) {
      if (delay === void 0) {
        delay = 0;
      }

      return setInterval(scheduler.flush.bind(scheduler, this), delay);
    };

    AsyncAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
      if (delay === void 0) {
        delay = 0;
      }

      if (delay !== null && this.delay === delay && this.pending === false) {
        return id;
      }

      clearInterval(id);
      return undefined;
    };

    AsyncAction.prototype.execute = function (state, delay) {
      if (this.closed) {
        return new Error('executing a cancelled action');
      }

      this.pending = false;

      var error = this._execute(state, delay);

      if (error) {
        return error;
      } else if (this.pending === false && this.id != null) {
        this.id = this.recycleAsyncId(this.scheduler, this.id, null);
      }
    };

    AsyncAction.prototype._execute = function (state, delay) {
      var errored = false;
      var errorValue = undefined;

      try {
        this.work(state);
      } catch (e) {
        errored = true;
        errorValue = !!e && e || new Error(e);
      }

      if (errored) {
        this.unsubscribe();
        return errorValue;
      }
    };

    AsyncAction.prototype._unsubscribe = function () {
      var id = this.id;
      var scheduler = this.scheduler;
      var actions = scheduler.actions;
      var index = actions.indexOf(this);
      this.work = null;
      this.state = null;
      this.pending = false;
      this.scheduler = null;

      if (index !== -1) {
        actions.splice(index, 1);
      }

      if (id != null) {
        this.id = this.recycleAsyncId(scheduler, id, null);
      }

      this.delay = null;
    };

    return AsyncAction;
  }(Action);

  /** PURE_IMPORTS_START tslib,_AsyncAction PURE_IMPORTS_END */

  var QueueAction =
  /*@__PURE__*/
  function (_super) {
    __extends(QueueAction, _super);

    function QueueAction(scheduler, work) {
      var _this = _super.call(this, scheduler, work) || this;

      _this.scheduler = scheduler;
      _this.work = work;
      return _this;
    }

    QueueAction.prototype.schedule = function (state, delay) {
      if (delay === void 0) {
        delay = 0;
      }

      if (delay > 0) {
        return _super.prototype.schedule.call(this, state, delay);
      }

      this.delay = delay;
      this.state = state;
      this.scheduler.flush(this);
      return this;
    };

    QueueAction.prototype.execute = function (state, delay) {
      return delay > 0 || this.closed ? _super.prototype.execute.call(this, state, delay) : this._execute(state, delay);
    };

    QueueAction.prototype.requestAsyncId = function (scheduler, id, delay) {
      if (delay === void 0) {
        delay = 0;
      }

      if (delay !== null && delay > 0 || delay === null && this.delay > 0) {
        return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
      }

      return scheduler.flush(this);
    };

    return QueueAction;
  }(AsyncAction);

  var Scheduler =
  /*@__PURE__*/
  function () {
    function Scheduler(SchedulerAction, now) {
      if (now === void 0) {
        now = Scheduler.now;
      }

      this.SchedulerAction = SchedulerAction;
      this.now = now;
    }

    Scheduler.prototype.schedule = function (work, delay, state) {
      if (delay === void 0) {
        delay = 0;
      }

      return new this.SchedulerAction(this, work).schedule(state, delay);
    };

    Scheduler.now = function () {
      return Date.now();
    };

    return Scheduler;
  }();

  /** PURE_IMPORTS_START tslib,_Scheduler PURE_IMPORTS_END */

  var AsyncScheduler =
  /*@__PURE__*/
  function (_super) {
    __extends(AsyncScheduler, _super);

    function AsyncScheduler(SchedulerAction, now) {
      if (now === void 0) {
        now = Scheduler.now;
      }

      var _this = _super.call(this, SchedulerAction, function () {
        if (AsyncScheduler.delegate && AsyncScheduler.delegate !== _this) {
          return AsyncScheduler.delegate.now();
        } else {
          return now();
        }
      }) || this;

      _this.actions = [];
      _this.active = false;
      _this.scheduled = undefined;
      return _this;
    }

    AsyncScheduler.prototype.schedule = function (work, delay, state) {
      if (delay === void 0) {
        delay = 0;
      }

      if (AsyncScheduler.delegate && AsyncScheduler.delegate !== this) {
        return AsyncScheduler.delegate.schedule(work, delay, state);
      } else {
        return _super.prototype.schedule.call(this, work, delay, state);
      }
    };

    AsyncScheduler.prototype.flush = function (action) {
      var actions = this.actions;

      if (this.active) {
        actions.push(action);
        return;
      }

      var error;
      this.active = true;

      do {
        if (error = action.execute(action.state, action.delay)) {
          break;
        }
      } while (action = actions.shift());

      this.active = false;

      if (error) {
        while (action = actions.shift()) {
          action.unsubscribe();
        }

        throw error;
      }
    };

    return AsyncScheduler;
  }(Scheduler);

  /** PURE_IMPORTS_START tslib,_AsyncScheduler PURE_IMPORTS_END */

  var QueueScheduler =
  /*@__PURE__*/
  function (_super) {
    __extends(QueueScheduler, _super);

    function QueueScheduler() {
      return _super !== null && _super.apply(this, arguments) || this;
    }

    return QueueScheduler;
  }(AsyncScheduler);

  /** PURE_IMPORTS_START _QueueAction,_QueueScheduler PURE_IMPORTS_END */
  var queue =
  /*@__PURE__*/
  new QueueScheduler(QueueAction);

  /** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */
  var EMPTY =
  /*@__PURE__*/
  new Observable(function (subscriber) {
    return subscriber.complete();
  });
  function empty$1(scheduler) {
    return scheduler ? emptyScheduled(scheduler) : EMPTY;
  }

  function emptyScheduled(scheduler) {
    return new Observable(function (subscriber) {
      return scheduler.schedule(function () {
        return subscriber.complete();
      });
    });
  }

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  function isScheduler(value) {
    return value && typeof value.schedule === 'function';
  }

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  var subscribeToArray = function subscribeToArray(array) {
    return function (subscriber) {
      for (var i = 0, len = array.length; i < len && !subscriber.closed; i++) {
        subscriber.next(array[i]);
      }

      subscriber.complete();
    };
  };

  /** PURE_IMPORTS_START _Observable,_Subscription PURE_IMPORTS_END */
  function scheduleArray(input, scheduler) {
    return new Observable(function (subscriber) {
      var sub = new Subscription();
      var i = 0;
      sub.add(scheduler.schedule(function () {
        if (i === input.length) {
          subscriber.complete();
          return;
        }

        subscriber.next(input[i++]);

        if (!subscriber.closed) {
          sub.add(this.schedule());
        }
      }));
      return sub;
    });
  }

  /** PURE_IMPORTS_START _Observable,_util_subscribeToArray,_scheduled_scheduleArray PURE_IMPORTS_END */
  function fromArray(input, scheduler) {
    if (!scheduler) {
      return new Observable(subscribeToArray(input));
    } else {
      return scheduleArray(input, scheduler);
    }
  }

  /** PURE_IMPORTS_START _util_isScheduler,_fromArray,_scheduled_scheduleArray PURE_IMPORTS_END */
  function of() {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    var scheduler = args[args.length - 1];

    if (isScheduler(scheduler)) {
      args.pop();
      return scheduleArray(args, scheduler);
    } else {
      return fromArray(args);
    }
  }

  /** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */
  function throwError(error, scheduler) {
    if (!scheduler) {
      return new Observable(function (subscriber) {
        return subscriber.error(error);
      });
    } else {
      return new Observable(function (subscriber) {
        return scheduler.schedule(dispatch, 0, {
          error: error,
          subscriber: subscriber
        });
      });
    }
  }

  function dispatch(_a) {
    var error = _a.error,
        subscriber = _a.subscriber;
    subscriber.error(error);
  }

  /** PURE_IMPORTS_START _observable_empty,_observable_of,_observable_throwError PURE_IMPORTS_END */

  var Notification =
  /*@__PURE__*/
  function () {
    function Notification(kind, value, error) {
      this.kind = kind;
      this.value = value;
      this.error = error;
      this.hasValue = kind === 'N';
    }

    Notification.prototype.observe = function (observer) {
      switch (this.kind) {
        case 'N':
          return observer.next && observer.next(this.value);

        case 'E':
          return observer.error && observer.error(this.error);

        case 'C':
          return observer.complete && observer.complete();
      }
    };

    Notification.prototype["do"] = function (next, error, complete) {
      var kind = this.kind;

      switch (kind) {
        case 'N':
          return next && next(this.value);

        case 'E':
          return error && error(this.error);

        case 'C':
          return complete && complete();
      }
    };

    Notification.prototype.accept = function (nextOrObserver, error, complete) {
      if (nextOrObserver && typeof nextOrObserver.next === 'function') {
        return this.observe(nextOrObserver);
      } else {
        return this["do"](nextOrObserver, error, complete);
      }
    };

    Notification.prototype.toObservable = function () {
      var kind = this.kind;

      switch (kind) {
        case 'N':
          return of(this.value);

        case 'E':
          return throwError(this.error);

        case 'C':
          return empty$1();
      }

      throw new Error('unexpected notification kind value');
    };

    Notification.createNext = function (value) {
      if (typeof value !== 'undefined') {
        return new Notification('N', value);
      }

      return Notification.undefinedValueNotification;
    };

    Notification.createError = function (err) {
      return new Notification('E', undefined, err);
    };

    Notification.createComplete = function () {
      return Notification.completeNotification;
    };

    Notification.completeNotification = new Notification('C');
    Notification.undefinedValueNotification = new Notification('N', undefined);
    return Notification;
  }();

  /** PURE_IMPORTS_START tslib,_Subscriber,_Notification PURE_IMPORTS_END */

  var ObserveOnSubscriber =
  /*@__PURE__*/
  function (_super) {
    __extends(ObserveOnSubscriber, _super);

    function ObserveOnSubscriber(destination, scheduler, delay) {
      if (delay === void 0) {
        delay = 0;
      }

      var _this = _super.call(this, destination) || this;

      _this.scheduler = scheduler;
      _this.delay = delay;
      return _this;
    }

    ObserveOnSubscriber.dispatch = function (arg) {
      var notification = arg.notification,
          destination = arg.destination;
      notification.observe(destination);
      this.unsubscribe();
    };

    ObserveOnSubscriber.prototype.scheduleMessage = function (notification) {
      var destination = this.destination;
      destination.add(this.scheduler.schedule(ObserveOnSubscriber.dispatch, this.delay, new ObserveOnMessage(notification, this.destination)));
    };

    ObserveOnSubscriber.prototype._next = function (value) {
      this.scheduleMessage(Notification.createNext(value));
    };

    ObserveOnSubscriber.prototype._error = function (err) {
      this.scheduleMessage(Notification.createError(err));
      this.unsubscribe();
    };

    ObserveOnSubscriber.prototype._complete = function () {
      this.scheduleMessage(Notification.createComplete());
      this.unsubscribe();
    };

    return ObserveOnSubscriber;
  }(Subscriber);

  var ObserveOnMessage =
  /*@__PURE__*/
  function () {
    function ObserveOnMessage(notification, destination) {
      this.notification = notification;
      this.destination = destination;
    }

    return ObserveOnMessage;
  }();

  /** PURE_IMPORTS_START tslib,_Subject,_scheduler_queue,_Subscription,_operators_observeOn,_util_ObjectUnsubscribedError,_SubjectSubscription PURE_IMPORTS_END */

  var ReplaySubject =
  /*@__PURE__*/
  function (_super) {
    __extends(ReplaySubject, _super);

    function ReplaySubject(bufferSize, windowTime, scheduler) {
      if (bufferSize === void 0) {
        bufferSize = Number.POSITIVE_INFINITY;
      }

      if (windowTime === void 0) {
        windowTime = Number.POSITIVE_INFINITY;
      }

      var _this = _super.call(this) || this;

      _this.scheduler = scheduler;
      _this._events = [];
      _this._infiniteTimeWindow = false;
      _this._bufferSize = bufferSize < 1 ? 1 : bufferSize;
      _this._windowTime = windowTime < 1 ? 1 : windowTime;

      if (windowTime === Number.POSITIVE_INFINITY) {
        _this._infiniteTimeWindow = true;
        _this.next = _this.nextInfiniteTimeWindow;
      } else {
        _this.next = _this.nextTimeWindow;
      }

      return _this;
    }

    ReplaySubject.prototype.nextInfiniteTimeWindow = function (value) {
      var _events = this._events;

      _events.push(value);

      if (_events.length > this._bufferSize) {
        _events.shift();
      }

      _super.prototype.next.call(this, value);
    };

    ReplaySubject.prototype.nextTimeWindow = function (value) {
      this._events.push(new ReplayEvent(this._getNow(), value));

      this._trimBufferThenGetEvents();

      _super.prototype.next.call(this, value);
    };

    ReplaySubject.prototype._subscribe = function (subscriber) {
      var _infiniteTimeWindow = this._infiniteTimeWindow;

      var _events = _infiniteTimeWindow ? this._events : this._trimBufferThenGetEvents();

      var scheduler = this.scheduler;
      var len = _events.length;
      var subscription;

      if (this.closed) {
        throw new ObjectUnsubscribedError();
      } else if (this.isStopped || this.hasError) {
        subscription = Subscription.EMPTY;
      } else {
        this.observers.push(subscriber);
        subscription = new SubjectSubscription(this, subscriber);
      }

      if (scheduler) {
        subscriber.add(subscriber = new ObserveOnSubscriber(subscriber, scheduler));
      }

      if (_infiniteTimeWindow) {
        for (var i = 0; i < len && !subscriber.closed; i++) {
          subscriber.next(_events[i]);
        }
      } else {
        for (var i = 0; i < len && !subscriber.closed; i++) {
          subscriber.next(_events[i].value);
        }
      }

      if (this.hasError) {
        subscriber.error(this.thrownError);
      } else if (this.isStopped) {
        subscriber.complete();
      }

      return subscription;
    };

    ReplaySubject.prototype._getNow = function () {
      return (this.scheduler || queue).now();
    };

    ReplaySubject.prototype._trimBufferThenGetEvents = function () {
      var now = this._getNow();

      var _bufferSize = this._bufferSize;
      var _windowTime = this._windowTime;
      var _events = this._events;
      var eventsCount = _events.length;
      var spliceCount = 0;

      while (spliceCount < eventsCount) {
        if (now - _events[spliceCount].time < _windowTime) {
          break;
        }

        spliceCount++;
      }

      if (eventsCount > _bufferSize) {
        spliceCount = Math.max(spliceCount, eventsCount - _bufferSize);
      }

      if (spliceCount > 0) {
        _events.splice(0, spliceCount);
      }

      return _events;
    };

    return ReplaySubject;
  }(Subject);

  var ReplayEvent =
  /*@__PURE__*/
  function () {
    function ReplayEvent(time, value) {
      this.time = time;
      this.value = value;
    }

    return ReplayEvent;
  }();

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */

  /* global Reflect, Promise */

  var _extendStatics$1 = function extendStatics(d, b) {
    _extendStatics$1 = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics$1(d, b);
  };

  function __extends$1(d, b) {
    _extendStatics$1(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }

  var _assign$1 = function __assign() {
    _assign$1 = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];

        for (var p in s) {
          if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
      }

      return t;
    };

    return _assign$1.apply(this, arguments);
  };

  function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
      s += arguments[i].length;
    }

    for (var r = Array(s), k = 0, i = 0; i < il; i++) {
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
        r[k] = a[j];
      }
    }

    return r;
  }

  var assert = function assert(predicate, msg) {
    if (!predicate) {
      throw new Error(msg);
    }
  };

  var isDefined = function isDefined(val) {
    return typeof val !== 'undefined';
  };

  var assertDefined = function assertDefined(val) {
    var msg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Expect to be defined';
    assert(isDefined(val), msg);
  };

  var isString = function isString(val) {
    return typeof val === 'string' || val instanceof String;
  };

  var assertString = function assertString(val) {
    var msg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Expected to be a string';
    assert(isDefined(val) && isString(val), msg);
  };

  var assertNonEmptyString = function assertNonEmptyString(val) {
    var msg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Expected to be non empty string';
    assertString(val, msg);
    assert(val.length > 0, msg);
  };

  var isArray$1 = function isArray(val) {
    return Array.isArray(val);
  };

  var assertArray = function assertArray(val) {
    var msg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Expected to be an array';
    assert(isArray$1(val), msg);
  };

  var isObject$1 = function isObject(val) {
    return Object.prototype.toString.call(val) === '[object Object]';
  };

  var assertObject = function assertObject(val) {
    var msg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Expected to be an object';
    assert(isObject$1(val), msg);
  };

  var assertNonEmptyObject = function assertNonEmptyObject(val) {
    var msg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Expected to be non empty object';
    assertObject(val, msg);
    assert(Object.keys(val).length > 0, msg);
  };

  var isOneOf = function isOneOf(collection, val) {
    if (isArray$1(collection)) {
      return collection.includes(val);
    }

    if (isObject$1(collection)) {
      return Object.values(collection).includes(val);
    }

    return false;
  };

  var assertOneOf = function assertOneOf(collection, val) {
    var msg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Expected to be one of the collection elements';
    assert(isOneOf(collection, val), msg);
  };

  var isFunction$1 = function isFunction(val) {
    return typeof val === 'function' && !/^class\s/.test(Function.prototype.toString.call(val));
  };

  var assertFunction = function assertFunction(val) {
    var msg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Expected to be a function';
    assert(isFunction$1(val), msg);
  };

  var isNumber = function isNumber(val) {
    return typeof val === 'number' && !isNaN(val);
  };

  var assertNumber = function assertNumber(val) {
    var msg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Expected to be a number';
    assert(isNumber(val), msg);
  };

  var NOT_VALID_PROTOCOL = 'Not a valid protocol';
  var NOT_VALID_ADDRESS = 'Address must be of type object';
  var NOT_VALID_HOST = 'Not a valid host';
  var NOT_VALID_PATH = 'Not a valid path';
  var NOT_VALID_PORT = 'Not a valid port';
  var ASYNC_MODEL_TYPES = {
    REQUEST_RESPONSE: 'requestResponse',
    REQUEST_STREAM: 'requestStream'
  };
  var SERVICE_NAME_NOT_PROVIDED = 'MS0020 - Invalid format, definition must contain valid serviceName';
  var DEFINITION_MISSING_METHODS = 'MS0021 - Invalid format, definition must contain valid methods';
  var INVALID_METHODS = 'MS0022 - Invalid format, definition must contain valid methods';

  var getServiceNameInvalid = function getServiceNameInvalid(serviceName) {
    return "MS0023 - Invalid format, serviceName must be not empty string but received type ".concat(_typeof(serviceName));
  };

  var getIncorrectMethodValueError = function getIncorrectMethodValueError(qualifier) {
    return "Method value for ".concat(qualifier, " definition should be non empty object");
  };

  var getAsynModelNotProvidedError = function getAsynModelNotProvidedError(qualifier) {
    return "Async model is not provided in service definition for ".concat(qualifier);
  };

  var getInvalidAsyncModelError = function getInvalidAsyncModelError(qualifier) {
    return "Invalid async model in service definition for ".concat(qualifier);
  };

  var validateAddress = function validateAddress(address) {
    var isOptional = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    if (isOptional && typeof address === 'undefined') {
      return true;
    }

    assertNonEmptyObject(address, NOT_VALID_ADDRESS);
    var host = address.host,
        path = address.path,
        protocol = address.protocol;
    var port = address.port;
    port = isString(port) ? Number(port) : port;
    assertString(host, NOT_VALID_HOST);
    assertString(path, NOT_VALID_PATH);
    assertNumber(port, NOT_VALID_PORT);
    assertString(protocol, NOT_VALID_PROTOCOL);
    assert(isOneOf(['pm', 'ws', 'wss', 'tcp'], protocol), NOT_VALID_PROTOCOL);
    return true;
  };
  /**
   * address is <protocol>://<host>:<port>/<path>
   */


  var getFullAddress = function getFullAddress(address) {
    validateAddress(address, false);
    var host = address.host,
        path = address.path,
        port = address.port,
        protocol = address.protocol;
    return "".concat(protocol, "://").concat(host, ":").concat(port, "/").concat(path);
  };

  var getAddress = function getAddress(address) {
    var newAddress = {};
    address = buildAddress({
      key: 'protocol',
      optionalValue: 'pm',
      delimiter: '://',
      str: address,
      newAddress: newAddress
    });
    address = buildAddress({
      key: 'host',
      optionalValue: 'defaultHost',
      delimiter: ':',
      str: address,
      newAddress: newAddress
    });
    address = buildAddress({
      key: 'port',
      optionalValue: 8080,
      delimiter: '/',
      str: address,
      newAddress: newAddress
    });
    newAddress.path = address;
    return newAddress;
  };

  var buildAddress = function buildAddress(_ref) {
    var key = _ref.key,
        optionalValue = _ref.optionalValue,
        delimiter = _ref.delimiter,
        newAddress = _ref.newAddress,
        str = _ref.str;

    var _str$split = str.split(delimiter),
        _str$split2 = _slicedToArray(_str$split, 2),
        v1 = _str$split2[0],
        rest = _str$split2[1];

    if (!rest) {
      rest = v1;
      v1 = optionalValue;
    }

    newAddress[key] = v1;
    return rest;
  };

  var isNodejs = function isNodejs() {
    try {
      // common api for main threat or worker in the browser
      return !navigator;
    } catch (e) {
      return false;
    }
  };

  var workersMap = {};
  var registeredIframes = {};
  var iframes = [];
  /**
   * check from which iframe the event arrived,
   * @param ev
   */

  var registerIframe = function registerIframe(ev) {
    iframes.some(function (iframe) {
      if (ev.source === iframe.contentWindow) {
        registeredIframes[ev.data.detail.whoAmI || ev.data.detail.origin] = iframe;
      }

      return ev.source === iframe.contentWindow;
    });
  };

  var initialize = function initialize() {
    if (!isNodejs()) {
      // @ts-ignore
      if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
        console.warn("Don't use this on webworkers, only on the main thread");
      } else {
        addEventListener('message', function (ev) {
          if (ev && ev.data && !ev.data.workerId) {
            ev.data.type === 'ConnectIframe' && registerIframe(ev);
            var detail = ev.data.detail;

            if (detail) {
              ev.data.workerId = 1;
              var propogateTo = workersMap[detail.to] || workersMap[detail.address]; // discoveryEvents || rsocketEvents

              if (propogateTo) {
                // @ts-ignore
                propogateTo.postMessage(ev.data, ev.ports);
              }

              var iframe = registeredIframes[detail.to] || registeredIframes[detail.address];

              if (iframe) {
                iframe.contentWindow.postMessage(ev.data, '*', ev.ports);
              }
            }
          }
        });
      }
    }
  };

  function workerEventHandler(ev) {
    if (ev.data && ev.data.detail && ev.data.type) {
      var detail = ev.data.detail;

      if (!ev.data.workerId) {
        ev.data.workerId = 1;

        if (ev.data.type === 'ConnectWorkerEvent') {
          if (detail.whoAmI) {
            // @ts-ignore
            workersMap[detail.whoAmI] = this;
          }
        } else {
          var propogateTo = workersMap[detail.to] || workersMap[detail.address]; // discoveryEvents || rsocketEvents

          if (propogateTo) {
            // @ts-ignore
            propogateTo.postMessage(ev.data, ev.ports);
          } else {
            // @ts-ignore
            postMessage(ev.data, '*', ev.ports);
          }
        }
      }
    }
  }

  var addWorker = function addWorker(worker) {
    worker.addEventListener('message', workerEventHandler.bind(worker));
  };

  var removeWorker = function removeWorker(worker) {
    worker.removeEventListener('message', workerEventHandler.bind(worker));
  };

  var addIframe = function addIframe(iframe) {
    iframes.push(iframe);
  };

  var colorsMap = {};

  var getRandomColor = function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';

    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
  };

  var saveToLogs = function saveToLogs(identifier, msg, extra, debug) {
    var type = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'log';

    if (!colorsMap[identifier]) {
      colorsMap[identifier] = getRandomColor();
    } // tslint:disable


    if (debug) {
      var logColor = "color:".concat(colorsMap[identifier]);
      extra && console[type]("%c******** address: ".concat(identifier, "********"), logColor);
      console[type](msg);
      extra && Object.keys(extra).forEach(function (key) {
        if (Array.isArray(extra[key])) {
          Object.values(extra[key]).forEach(function (props) {
            console[type]("".concat(key, ": ").concat(JSON.stringify(props.qualifier || props, null, 2)));
          });
        } else {
          console[type]("".concat(key, ": ").concat(JSON.stringify(extra[key], null, 2)));
        }
      });
    } // tslint:enable

  };

  var getQualifier = function getQualifier(_ref2) {
    var serviceName = _ref2.serviceName,
        methodName = _ref2.methodName;
    return "".concat(serviceName, "/").concat(methodName);
  };

  var validateServiceDefinition = function validateServiceDefinition(definition) {
    assertNonEmptyObject(definition);
    var serviceName = definition.serviceName,
        methods = definition.methods;
    assertDefined(serviceName, SERVICE_NAME_NOT_PROVIDED);
    assertNonEmptyString(serviceName, getServiceNameInvalid(serviceName));
    assertDefined(methods, DEFINITION_MISSING_METHODS);
    assertNonEmptyObject(methods, INVALID_METHODS);
    Object.keys(methods).forEach(function (methodName) {
      assertNonEmptyString(methodName);
      var qualifier = getQualifier({
        serviceName: serviceName,
        methodName: methodName
      });
      validateAsyncModel(qualifier, methods[methodName]);
    });
  };

  var validateAsyncModel = function validateAsyncModel(qualifier, val) {
    assertNonEmptyObject(val, getIncorrectMethodValueError(qualifier));
    var asyncModel = val.asyncModel;
    assertDefined(asyncModel, getAsynModelNotProvidedError(qualifier));
    assertOneOf(ASYNC_MODEL_TYPES, asyncModel, getInvalidAsyncModelError(qualifier));
  }; // polyfill MessagePort and MessageChannel


  var MessagePortPolyfill =
  /*#__PURE__*/
  function () {
    function MessagePortPolyfill(whoami) {
      _classCallCheck(this, MessagePortPolyfill);

      this.onmessage = null;
      this.onmessageerror = null;
      this.otherPort = null;
      this.onmessageListeners = [];
      this.queue = [];
      this.otherSideStart = false;
      this.whoami = whoami;
    }

    _createClass(MessagePortPolyfill, [{
      key: "dispatchEvent",
      value: function dispatchEvent(event) {
        if (this.onmessage) {
          this.onmessage(event);
        }

        this.onmessageListeners.forEach(function (listener) {
          return listener(event);
        });
        return true;
      }
    }, {
      key: "postMessage",
      value: function postMessage(message) {
        if (!this.otherPort) {
          return;
        }

        if (this.otherSideStart) {
          this.otherPort.dispatchEvent({
            data: message
          });
        } else {
          this.queue.push(message);
        }
      }
    }, {
      key: "addEventListener",
      value: function addEventListener(type, listener) {
        if (type !== 'message') {
          return;
        }

        if (typeof listener !== 'function' || this.onmessageListeners.indexOf(listener) !== -1) {
          return;
        }

        this.onmessageListeners.push(listener);
      }
    }, {
      key: "removeEventListener",
      value: function removeEventListener(type, listener) {
        if (type !== 'message') {
          return;
        }

        var index = this.onmessageListeners.indexOf(listener);

        if (index === -1) {
          return;
        }

        this.onmessageListeners.splice(index, 1);
      }
    }, {
      key: "start",
      value: function start() {
        var _this2 = this;

        setTimeout(function () {
          return _this2.otherPort && _this2.otherPort.startSending.apply(_this2.otherPort, []);
        }, 0);
      }
    }, {
      key: "close",
      value: function close() {
        var _this3 = this;

        setTimeout(function () {
          return _this3.otherPort && _this3.otherPort.stopSending.apply(_this3.otherPort, []);
        }, 0);
      }
    }, {
      key: "startSending",
      value: function startSending() {
        var _this4 = this;

        this.otherSideStart = true;
        this.queue.forEach(function (message) {
          return _this4.otherPort && _this4.otherPort.dispatchEvent({
            data: message
          });
        });
      }
    }, {
      key: "stopSending",
      value: function stopSending() {
        this.otherSideStart = false;
        this.queue.length = 0;
      }
    }]);

    return MessagePortPolyfill;
  }(); // tslint:disable-next-line


  var MessageChannelPolyfill = function MessageChannelPolyfill() {
    _classCallCheck(this, MessageChannelPolyfill);

    this.port1 = new MessagePortPolyfill('client');
    this.port2 = new MessagePortPolyfill('server');
    this.port1.otherPort = this.port2;
    this.port2.otherPort = this.port1;
  };

  var globalObj = typeof window !== 'undefined' && window.Math === Math ? window : typeof self !== 'undefined' && self.Math === Math ? self : Function('return this')();

  function applyMessageChannelPolyfill() {
    globalObj.MessagePort = MessagePortPolyfill;
    globalObj.MessageChannel = MessageChannelPolyfill;
  }

  if (!globalObj.MessagePort || !globalObj.MessageChannel) {
    applyMessageChannelPolyfill();
  }

  var workers = !isNodejs() ? {
    addWorker: addWorker,
    removeWorker: removeWorker,
    initialize: initialize,
    addIframe: addIframe
  } : {};
  var INVALID_ITEMS_TO_PUBLISH = 'itemsToPublish are not of type Array';
  var NODEJS_MUST_PROVIDE_CLUSTER_IMPL = 'Must provide cluster when running on nodejs';

  var getAddressCollision = function getAddressCollision(address, seedAddress) {
    return "address " + address + " must be different from the seed Address " + seedAddress;
  };

  var getDiscoverySuccessfullyDestroyedMessage = function getDiscoverySuccessfullyDestroyedMessage(address) {
    return getFullAddress(address) + " has been removed";
  };

  var createDiscovery = function createDiscovery(options) {
    var address = options.address,
        itemsToPublish = options.itemsToPublish,
        seedAddress = options.seedAddress,
        debug = options.debug;
    var joinCluster = options.cluster;
    var discoveredItemsSubject = new ReplaySubject();

    if (!joinCluster) {
      saveToLogs(getFullAddress(address), NODEJS_MUST_PROVIDE_CLUSTER_IMPL, {}, debug, 'warn');
      discoveredItemsSubject.complete();
      return {
        destroy: function destroy() {
          return Promise.resolve(NODEJS_MUST_PROVIDE_CLUSTER_IMPL);
        },
        discoveredItems$: function discoveredItems$() {
          return discoveredItemsSubject.asObservable();
        }
      };
    }

    var membersState = {};
    validateAddress(address, false);

    if (seedAddress) {
      validateAddress(seedAddress, false);
      validateAddressCollision(address, seedAddress);
    }

    assertArray(itemsToPublish, INVALID_ITEMS_TO_PUBLISH);
    var cluster = joinCluster({
      address: address,
      seedAddress: seedAddress,
      itemsToPublish: itemsToPublish,
      debug: false
    });
    var clusterListener = cluster.listen$();
    var subscription;
    return Object.freeze({
      destroy: function destroy() {
        subscription && subscription.unsubscribe();
        discoveredItemsSubject.complete();
        return new Promise(function (resolve, reject) {
          cluster.destroy().then(function () {
            return resolve(getDiscoverySuccessfullyDestroyedMessage(address));
          })["catch"](function (error) {
            return reject(error);
          });
        });
      },
      discoveredItems$: function discoveredItems$() {
        cluster.getCurrentMembersData().then(function (currentMembersState) {
          var members = Object.keys(currentMembersState);
          members.forEach(function (member) {
            var memberItem = currentMembersState[member];

            if (memberItem.length === 0) {
              discoveredItemsSubject.next({
                type: 'IDLE',
                items: []
              });
            } else {
              if (!membersState[member]) {
                membersState[member] = true;
                discoveredItemsSubject.next({
                  type: 'REGISTERED',
                  items: memberItem
                });
              }
            }
          });
        })["catch"](function (error) {
          return discoveredItemsSubject.error(error);
        });
        subscription = clusterListener.subscribe(function (clusterEvent) {
          var type = clusterEvent.type,
              items = clusterEvent.items,
              from = clusterEvent.from;

          if (items.length > 0) {
            if (type === 'REMOVED' && membersState[from]) {
              membersState[from] = false;
              discoveredItemsSubject.next({
                type: 'UNREGISTERED',
                items: items
              });
            }

            if (type !== 'REMOVED' && !membersState[from]) {
              membersState[from] = true;
              discoveredItemsSubject.next({
                type: 'REGISTERED',
                items: items
              });
            }
          }
        }, function (error) {
          return discoveredItemsSubject.error(error);
        }, function () {
          return discoveredItemsSubject.complete();
        });
        return discoveredItemsSubject.asObservable();
      }
    });
  };

  var validateAddressCollision = function validateAddressCollision(address, seedAddress) {
    var fullAddress = getFullAddress(address);
    var fullSeedAddress = getFullAddress(seedAddress);

    if (fullAddress === fullSeedAddress) {
      throw new Error(getAddressCollision(fullAddress, fullSeedAddress));
    }
  };

  var ASYNC_MODEL_TYPES$1 = ASYNC_MODEL_TYPES;
  var MICROSERVICE_NOT_EXISTS = 'MS0000 - microservice does not exists';
  var MESSAGE_NOT_PROVIDED = 'MS0001 - Message has not been provided';
  var MESSAGE_DATA_NOT_PROVIDED = 'MS0002 - Message data has not been provided';
  var MESSAGE_QUALIFIER_NOT_PROVIDED = 'MS0003 - Message qualifier has not been provided';
  var INVALID_MESSAGE = 'MS0004 - Message should not to be empty object';
  var INVALID_QUALIFIER = 'MS0005 - qualifier expected to be service/method format';
  var SERVICE_DEFINITION_NOT_PROVIDED = 'MS0006 - Service missing definition';
  var WRONG_DATA_FORMAT_IN_MESSAGE = 'MS0007 - Message format error: data must be Array';
  var SERVICES_IS_NOT_ARRAY = 'MS0008 - Not valid format, services must be an Array';
  var SERVICE_IS_NOT_OBJECT = 'MS0009 - Not valid format, service must be an Object';
  var MICROSERVICE_OPTIONS_IS_NOT_OBJECT = 'MS0000 - Not valid format, MicroserviceOptions must be an Object';
  var QUALIFIER_IS_NOT_STRING = 'MS0011 - qualifier should not be empty string';
  var TRANSPORT_NOT_PROVIDED = 'MS0013 - Transport provider is not define';
  var ROUTER_NOT_PROVIDED = 'MS0024 - Router is not define';
  var INVALID_ASYNC_MODEL = 'MS0028 - invalid async model';

  var getServiceMethodIsMissingError = function getServiceMethodIsMissingError(methodName) {
    return "MS0014 - service method '" + methodName + "' missing in the serviceDefinition";
  };

  var getNotFoundByRouterError = function getNotFoundByRouterError(whoAmI, qualifier) {
    return "MS0015 - " + whoAmI + " can't find services that match the give criteria: '" + JSON.stringify(qualifier) + "'";
  };

  var getAsyncModelMissmatch = function getAsyncModelMissmatch(expectedAsyncModel, receivedAsyncModel) {
    return "MS0016 - asyncModel does not match, expect " + expectedAsyncModel + ", but received " + receivedAsyncModel;
  };

  var getMethodNotFoundError = function getMethodNotFoundError(message) {
    return "Can't find method " + message.qualifier;
  };

  var getInvalidMethodReferenceError = function getInvalidMethodReferenceError(qualifier) {
    return "MS0017 - service (" + qualifier + ") has valid definition but reference is not a function.";
  };

  var getServiceReferenceNotProvidedError = function getServiceReferenceNotProvidedError(serviceName) {
    return "MS0018 - service does not uphold the contract, " + serviceName + " is not provided";
  };

  var getInvalidServiceReferenceError = function getInvalidServiceReferenceError(serviceName) {
    return "MS0019 - Not valid format, " + serviceName + " reference must be an Object";
  };

  var getIncorrectServiceImplementForPromise = function getIncorrectServiceImplementForPromise(whoAmI, qualifier) {
    return "MS0025 - " + whoAmI + "'s service '" + qualifier + "' define as Promise but service return not Promise";
  };

  var getIncorrectServiceImplementForObservable = function getIncorrectServiceImplementForObservable(whoAmI, qualifier) {
    return "MS0026 - " + whoAmI + "'s service '" + qualifier + "' define as Observable but service return not Observable";
  };

  var getIncorrectServiceInvoke = function getIncorrectServiceInvoke(whoAmI, qualifier) {
    return "MS0027 - " + whoAmI + "'s " + qualifier + " has no valid response, expect Promise or Observable";
  };

  var NO_PROXY_SUPPORT = 'MS0029 - Proxy not supported, please add Proxy polyfill';

  var validateMicroserviceOptions = function validateMicroserviceOptions(microserviceOptions) {
    assertObject(microserviceOptions, MICROSERVICE_OPTIONS_IS_NOT_OBJECT);
    var services = microserviceOptions.services,
        seedAddress = microserviceOptions.seedAddress,
        address = microserviceOptions.address;
    validateAddress(seedAddress, true);
    validateAddress(address, true);
    validateMicroserviceServices(services);
  };

  var validateMicroserviceServices = function validateMicroserviceServices(services) {
    assertArray(services, SERVICES_IS_NOT_ARRAY);
    services.forEach(validateService);
  };

  var validateService = function validateService(service) {
    assertNonEmptyObject(service, SERVICE_IS_NOT_OBJECT);
    var definition = service.definition,
        reference = service.reference;
    assertDefined(definition, SERVICE_DEFINITION_NOT_PROVIDED);
    validateServiceDefinition(definition);
    var serviceName = definition.serviceName;
    assertDefined(reference, getServiceReferenceNotProvidedError(serviceName));
  };

  var validateServiceReference = function validateServiceReference(reference, definition) {
    var serviceName = definition.serviceName;
    assertObject(reference, getInvalidServiceReferenceError(serviceName));
    Object.keys(definition.methods).forEach(function (methodName) {
      var qualifier = getQualifier({
        serviceName: serviceName,
        methodName: methodName
      });
      var staticMethodRef = reference.constructor && reference.constructor[methodName];
      assertFunction(reference[methodName] || staticMethodRef, getInvalidMethodReferenceError(qualifier));
    });
  };

  var validateMessage = function validateMessage(message) {
    assertDefined(message, MESSAGE_NOT_PROVIDED);
    assertNonEmptyObject(message, INVALID_MESSAGE);
    var data = message.data,
        qualifier = message.qualifier;
    assertDefined(qualifier, MESSAGE_QUALIFIER_NOT_PROVIDED);
    validateQualifier(qualifier);
    assertDefined(data, MESSAGE_DATA_NOT_PROVIDED);
    assertArray(data, WRONG_DATA_FORMAT_IN_MESSAGE);
  };

  var validateQualifier = function validateQualifier(value) {
    assertNonEmptyString(value, QUALIFIER_IS_NOT_STRING);
    var parts = value.split('/');
    assert(parts.length === 2, INVALID_QUALIFIER);
    assertNonEmptyString(parts[0], INVALID_QUALIFIER);
    assertNonEmptyString(parts[1], INVALID_QUALIFIER);
  };

  var validateDiscoveryInstance = function validateDiscoveryInstance(discovery) {
    assertDefined(discovery, '');
    var discoveredItems$ = discovery.discoveredItems$,
        destroy = discovery.destroy;
    assertDefined(discoveredItems$, '');
    assertDefined(destroy, '');
  };

  var serviceCallError = function serviceCallError(_a) {
    var errorMessage = _a.errorMessage,
        microserviceContext = _a.microserviceContext;
    var error = new Error(errorMessage);

    if (microserviceContext) {
      var whoAmI = microserviceContext.whoAmI,
          debug = microserviceContext.debug;
      saveToLogs(whoAmI, errorMessage, {}, debug, 'warn');
    }

    return error;
  };

  var throwException = function throwException(asyncModel, message) {
    if (asyncModel === ASYNC_MODEL_TYPES$1.REQUEST_RESPONSE) {
      return Promise.reject(message);
    } else {
      return new Observable(function (obs) {
        obs.error(message);
      });
    }
  };

  var localCall = function localCall(_a) {
    var localService = _a.localService,
        asyncModel = _a.asyncModel,
        message = _a.message,
        microserviceContext = _a.microserviceContext;
    var reference = localService.reference,
        asyncModelProvider = localService.asyncModel;
    var method = reference && reference[localService.methodName];

    if (!method) {
      return throwException(asyncModel, serviceCallError({
        errorMessage: getMethodNotFoundError(message),
        microserviceContext: microserviceContext
      }));
    }

    if (asyncModelProvider !== asyncModel) {
      return throwException(asyncModel, serviceCallError({
        errorMessage: getAsyncModelMissmatch(asyncModel, asyncModelProvider),
        microserviceContext: microserviceContext
      }));
    }

    var invoke = method.apply(void 0, message.data);

    if (_typeof(invoke) !== 'object' || !invoke) {
      return throwException(asyncModel, serviceCallError({
        errorMessage: getIncorrectServiceInvoke(microserviceContext.whoAmI, message.qualifier),
        microserviceContext: microserviceContext
      }));
    }

    switch (asyncModel) {
      case ASYNC_MODEL_TYPES$1.REQUEST_STREAM:
        return new Observable(function (obs) {
          isFunction$1(invoke.subscribe) ? invoke.subscribe(function () {
            var data = [];

            for (var _i = 0; _i < arguments.length; _i++) {
              data[_i] = arguments[_i];
            }

            return obs.next.apply(obs, data);
          }, function (err) {
            return obs.error(err);
          }, function () {
            return obs.complete();
          }) : obs.error(serviceCallError({
            errorMessage: getIncorrectServiceImplementForObservable(microserviceContext.whoAmI, message.qualifier),
            microserviceContext: microserviceContext
          }));
        });

      case ASYNC_MODEL_TYPES$1.REQUEST_RESPONSE:
        return new Promise(function (resolve, reject) {
          isFunction$1(invoke.then) ? invoke.then(resolve)["catch"](reject) : reject(serviceCallError({
            errorMessage: getIncorrectServiceImplementForPromise(microserviceContext.whoAmI, message.qualifier),
            microserviceContext: microserviceContext
          }));
        });

      default:
        return throwException(asyncModel, serviceCallError({
          errorMessage: INVALID_ASYNC_MODEL,
          microserviceContext: microserviceContext
        }));
    }
  };

  var loggerUtil = function loggerUtil(whoAmI, debug) {
    return function (msg, type) {
      saveToLogs(whoAmI, msg, {}, debug, type);
    };
  };

  var remoteCall = function remoteCall(options) {
    var asyncModel = options.asyncModel,
        transportClient = options.transportClient,
        microserviceContext = options.microserviceContext,
        message = options.message;
    var logger = loggerUtil(microserviceContext.whoAmI, microserviceContext.debug);

    switch (asyncModel) {
      case ASYNC_MODEL_TYPES$1.REQUEST_STREAM:
        return new Observable(function (obs) {
          getValidEndpoint(options).then(function (endpoint) {
            transportClient.start({
              remoteAddress: endpoint.address,
              logger: logger
            }).then(function (_a) {
              var requestStream = _a.requestStream;
              requestStream(message).subscribe(function (data) {
                return obs.next(data);
              }, function (err) {
                return obs.error(err);
              }, function () {
                return obs.complete();
              });
            })["catch"](function (error) {
              return obs.error(error);
            });
          })["catch"](function (error) {
            return obs.error(error);
          });
        });

      case ASYNC_MODEL_TYPES$1.REQUEST_RESPONSE:
        return new Promise(function (resolve, reject) {
          getValidEndpoint(options).then(function (endpoint) {
            transportClient.start({
              remoteAddress: endpoint.address,
              logger: logger
            }).then(function (_a) {
              var requestResponse = _a.requestResponse;
              requestResponse(message).then(function (response) {
                return resolve(response);
              })["catch"](function (e) {
                return reject(e);
              });
            })["catch"](function (e) {
              return reject(e);
            });
          })["catch"](function (e) {
            return reject(e);
          });
        });

      default:
        throw new Error('invalid async model');
    }
  };

  var getValidEndpoint = function getValidEndpoint(_a) {
    var router = _a.router,
        microserviceContext = _a.microserviceContext,
        message = _a.message,
        asyncModel = _a.asyncModel,
        transportClient = _a.transportClient;
    return new Promise(function (resolve, reject) {
      router({
        lookUp: microserviceContext.remoteRegistry.lookUp,
        message: message
      }).then(function (endPoint) {
        var asyncModelProvider = endPoint.asyncModel;

        if (asyncModelProvider !== asyncModel) {
          reject(serviceCallError({
            errorMessage: getAsyncModelMissmatch(asyncModel, asyncModelProvider),
            microserviceContext: microserviceContext
          }));
        }

        if (!transportClient) {
          reject(serviceCallError({
            errorMessage: TRANSPORT_NOT_PROVIDED,
            microserviceContext: microserviceContext
          }));
        }

        resolve(endPoint);
      })["catch"](function () {
        reject(serviceCallError({
          errorMessage: getNotFoundByRouterError(microserviceContext.whoAmI, message.qualifier),
          microserviceContext: microserviceContext
        }));
      });
    });
  };

  var getServiceCall = function getServiceCall(options) {
    var router = options.router,
        microserviceContext = options.microserviceContext,
        transportClient = options.transportClient;
    return function (_a) {
      var message = _a.message,
          asyncModel = _a.asyncModel;

      try {
        validateMessage(message);
      } catch (e) {
        var err = serviceCallError({
          errorMessage: e.message,
          microserviceContext: microserviceContext
        });
        return asyncModel === ASYNC_MODEL_TYPES$1.REQUEST_RESPONSE ? Promise.reject(err) : throwError(err);
      }

      var localService = microserviceContext.localRegistry.lookUp({
        qualifier: message.qualifier
      });
      return localService ? localCall({
        localService: localService,
        asyncModel: asyncModel,
        message: message,
        microserviceContext: microserviceContext
      }) : remoteCall({
        router: router,
        microserviceContext: microserviceContext,
        message: message,
        asyncModel: asyncModel,
        transportClient: transportClient
      });
    };
  };

  var _createServiceCall = function createServiceCall(options) {
    var router = options.router,
        microserviceContext = options.microserviceContext,
        transportClient = options.transportClient;

    if (!microserviceContext) {
      throw new Error(MICROSERVICE_NOT_EXISTS);
    }

    var serviceCall = getServiceCall({
      router: router,
      microserviceContext: microserviceContext,
      transportClient: transportClient
    });
    return Object.freeze({
      requestStream: function requestStream(message) {
        return serviceCall({
          message: message,
          asyncModel: ASYNC_MODEL_TYPES$1.REQUEST_STREAM
        });
      },
      requestResponse: function requestResponse(message) {
        return serviceCall({
          message: message,
          asyncModel: ASYNC_MODEL_TYPES$1.REQUEST_RESPONSE
        });
      }
    });
  };

  var createRemoteRegistry = function createRemoteRegistry() {
    var remoteRegistryMap = {};
    return Object.freeze({
      lookUp: function lookUp(_a) {
        var qualifier = _a.qualifier;

        if (!remoteRegistryMap) {
          throw new Error(MICROSERVICE_NOT_EXISTS);
        }

        return remoteRegistryMap[qualifier] || [];
      },
      createEndPoints: function createEndPoints(options) {
        if (!remoteRegistryMap) {
          throw new Error(MICROSERVICE_NOT_EXISTS);
        }

        return getEndpointsFromServices(options); // all services => endPoints[]
      },
      update: function update(_a) {
        var type = _a.type,
            items = _a.items;

        if (type === 'IDLE') {
          return;
        }

        if (!remoteRegistryMap) {
          throw new Error(MICROSERVICE_NOT_EXISTS);
        }

        remoteRegistryMap = updatedRemoteRegistry({
          type: type,
          items: items,
          remoteRegistryMap: remoteRegistryMap
        });
      },
      destroy: function destroy() {
        remoteRegistryMap = null;
      }
    });
  }; // Helpers


  var getEndpointsFromServices = function getEndpointsFromServices(options) {
    var services = options.services,
        address = options.address;
    return services && address ? services.reduce(function (res, service) {
      return __spreadArrays(res, getEndpointsFromService({
        service: service,
        address: address
      }));
    }, []) : [];
  };

  var updatedRemoteRegistry = function updatedRemoteRegistry(_a) {
    var type = _a.type,
        items = _a.items,
        remoteRegistryMap = _a.remoteRegistryMap;

    switch (type) {
      case 'REGISTERED':
        remoteRegistryMap = items.reduce(function (res, endpoint) {
          var _a;

          return _assign$1(_assign$1({}, res), (_a = {}, _a[endpoint.qualifier] = __spreadArrays(res[endpoint.qualifier] || [], [endpoint]), _a));
        }, remoteRegistryMap || {});
        break;

      case 'UNREGISTERED':
        items.forEach(function (unregisteredEndpoint) {
          remoteRegistryMap[unregisteredEndpoint.qualifier] = remoteRegistryMap[unregisteredEndpoint.qualifier].filter(function (registryEndpoint) {
            return getFullAddress(registryEndpoint.address) !== getFullAddress(unregisteredEndpoint.address);
          });
        });
        break;
    }

    return _assign$1({}, remoteRegistryMap);
  };

  var getEndpointsFromService = function getEndpointsFromService(_a) {
    var service = _a.service,
        address = _a.address;
    var definition = service.definition;
    var serviceName = definition.serviceName,
        methods = definition.methods;
    return Object.keys(methods).map(function (methodName) {
      return {
        qualifier: getQualifier({
          serviceName: serviceName,
          methodName: methodName
        }),
        serviceName: serviceName,
        methodName: methodName,
        asyncModel: methods[methodName].asyncModel,
        address: address
      };
    }) || [];
  };

  var getReferencePointer = function getReferencePointer(_a) {
    var reference = _a.reference,
        methodName = _a.methodName;
    var methodRef = reference[methodName];

    if (methodRef) {
      return methodRef.bind(reference);
    } // static method


    return reference.constructor && reference.constructor[methodName];
  };

  var flatteningServices = function flatteningServices(_a) {
    var services = _a.services,
        serviceFactoryOptions = _a.serviceFactoryOptions;
    return services && Array.isArray(services) ? services.map(function (service) {
      var reference = service.reference,
          definition = service.definition;

      if (isFunction$1(reference)) {
        var ref = reference(serviceFactoryOptions);
        validateServiceReference(ref, definition);
        return {
          reference: ref,
          definition: definition
        };
      } else {
        validateServiceReference(reference, definition);
        return {
          reference: reference,
          definition: definition
        };
      }
    }) : services;
  };

  var createLocalRegistry = function createLocalRegistry() {
    var localRegistryMap = {};
    return Object.freeze({
      lookUp: function lookUp(_a) {
        var qualifier = _a.qualifier;

        if (!localRegistryMap) {
          throw new Error(MICROSERVICE_NOT_EXISTS);
        }

        return localRegistryMap[qualifier] || null;
      },
      add: function add(_a) {
        var _b = _a.services,
            services = _b === void 0 ? [] : _b;

        if (!localRegistryMap) {
          throw new Error(MICROSERVICE_NOT_EXISTS);
        }

        var references = getReferenceFromServices({
          services: services
        });
        localRegistryMap = getUpdatedLocalRegistry({
          localRegistryMap: localRegistryMap,
          references: references
        });
      },
      destroy: function destroy() {
        localRegistryMap = null;
      }
    });
  }; // Helpers


  var getReferenceFromServices = function getReferenceFromServices(_a) {
    var _b = _a.services,
        services = _b === void 0 ? [] : _b;
    return services.reduce(function (res, service) {
      return __spreadArrays(res, getReferenceFromService({
        service: service
      }));
    }, []);
  };

  var getUpdatedLocalRegistry = function getUpdatedLocalRegistry(_a) {
    var localRegistryMap = _a.localRegistryMap,
        references = _a.references;
    return _assign$1(_assign$1({}, localRegistryMap), references.reduce(function (res, reference) {
      var _a;

      return _assign$1(_assign$1({}, res), (_a = {}, _a[reference.qualifier] = reference, _a));
    }, localRegistryMap || {}));
  };

  var getReferenceFromService = function getReferenceFromService(_a) {
    var service = _a.service;
    var data = [];
    var definition = service.definition,
        reference = service.reference;
    var serviceName = definition.serviceName,
        methods = definition.methods;
    Object.keys(methods).forEach(function (methodName) {
      var _a;

      var qualifier = getQualifier({
        serviceName: serviceName,
        methodName: methodName
      });
      data.push({
        qualifier: qualifier,
        serviceName: serviceName,
        methodName: methodName,
        asyncModel: methods[methodName].asyncModel,
        reference: (_a = {}, _a[methodName] = getReferencePointer({
          reference: reference,
          methodName: methodName
        }), _a)
      });
    });
    return data;
  };
  /** PURE_IMPORTS_START  PURE_IMPORTS_END */


  function isFunction$1$1(x) {
    return typeof x === 'function';
  }
  /** PURE_IMPORTS_START  PURE_IMPORTS_END */


  var _enable_super_gross_mode_that_will_cause_bad_things$1 = false;
  var config$1 = {
    Promise: undefined,

    set useDeprecatedSynchronousErrorHandling(value) {
      if (value) {
        var error =
        /*@__PURE__*/
        new Error();
        /*@__PURE__*/

        console.warn('DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: \n' + error.stack);
      }

      _enable_super_gross_mode_that_will_cause_bad_things$1 = value;
    },

    get useDeprecatedSynchronousErrorHandling() {
      return _enable_super_gross_mode_that_will_cause_bad_things$1;
    }

  };
  /** PURE_IMPORTS_START  PURE_IMPORTS_END */

  function hostReportError$1(err) {
    setTimeout(function () {
      throw err;
    }, 0);
  }
  /** PURE_IMPORTS_START _config,_util_hostReportError PURE_IMPORTS_END */


  var empty$2 = {
    closed: true,
    next: function next(value) {},
    error: function error(err) {
      if (config$1.useDeprecatedSynchronousErrorHandling) {
        throw err;
      } else {
        hostReportError$1(err);
      }
    },
    complete: function complete() {}
  };
  /** PURE_IMPORTS_START  PURE_IMPORTS_END */

  var isArray$1$1 =
  /*@__PURE__*/
  function () {
    return Array.isArray || function (x) {
      return x && typeof x.length === 'number';
    };
  }();
  /** PURE_IMPORTS_START  PURE_IMPORTS_END */


  function isObject$1$1(x) {
    return x !== null && _typeof(x) === 'object';
  }
  /** PURE_IMPORTS_START  PURE_IMPORTS_END */


  var UnsubscriptionErrorImpl$1 =
  /*@__PURE__*/
  function () {
    function UnsubscriptionErrorImpl(errors) {
      Error.call(this);
      this.message = errors ? errors.length + " errors occurred during unsubscription:\n" + errors.map(function (err, i) {
        return i + 1 + ") " + err.toString();
      }).join('\n  ') : '';
      this.name = 'UnsubscriptionError';
      this.errors = errors;
      return this;
    }

    UnsubscriptionErrorImpl.prototype =
    /*@__PURE__*/
    Object.create(Error.prototype);
    return UnsubscriptionErrorImpl;
  }();

  var UnsubscriptionError$1 = UnsubscriptionErrorImpl$1;
  /** PURE_IMPORTS_START _util_isArray,_util_isObject,_util_isFunction,_util_UnsubscriptionError PURE_IMPORTS_END */

  var Subscription$1 =
  /*@__PURE__*/
  function () {
    function Subscription(unsubscribe) {
      this.closed = false;
      this._parentOrParents = null;
      this._subscriptions = null;

      if (unsubscribe) {
        this._unsubscribe = unsubscribe;
      }
    }

    Subscription.prototype.unsubscribe = function () {
      var errors;

      if (this.closed) {
        return;
      }

      var _a = this,
          _parentOrParents = _a._parentOrParents,
          _unsubscribe = _a._unsubscribe,
          _subscriptions = _a._subscriptions;

      this.closed = true;
      this._parentOrParents = null;
      this._subscriptions = null;

      if (_parentOrParents instanceof Subscription) {
        _parentOrParents.remove(this);
      } else if (_parentOrParents !== null) {
        for (var index = 0; index < _parentOrParents.length; ++index) {
          var parent_1 = _parentOrParents[index];
          parent_1.remove(this);
        }
      }

      if (isFunction$1$1(_unsubscribe)) {
        try {
          _unsubscribe.call(this);
        } catch (e) {
          errors = e instanceof UnsubscriptionError$1 ? flattenUnsubscriptionErrors$1(e.errors) : [e];
        }
      }

      if (isArray$1$1(_subscriptions)) {
        var index = -1;
        var len = _subscriptions.length;

        while (++index < len) {
          var sub = _subscriptions[index];

          if (isObject$1$1(sub)) {
            try {
              sub.unsubscribe();
            } catch (e) {
              errors = errors || [];

              if (e instanceof UnsubscriptionError$1) {
                errors = errors.concat(flattenUnsubscriptionErrors$1(e.errors));
              } else {
                errors.push(e);
              }
            }
          }
        }
      }

      if (errors) {
        throw new UnsubscriptionError$1(errors);
      }
    };

    Subscription.prototype.add = function (teardown) {
      var subscription = teardown;

      if (!teardown) {
        return Subscription.EMPTY;
      }

      switch (_typeof(teardown)) {
        case 'function':
          subscription = new Subscription(teardown);

        case 'object':
          if (subscription === this || subscription.closed || typeof subscription.unsubscribe !== 'function') {
            return subscription;
          } else if (this.closed) {
            subscription.unsubscribe();
            return subscription;
          } else if (!(subscription instanceof Subscription)) {
            var tmp = subscription;
            subscription = new Subscription();
            subscription._subscriptions = [tmp];
          }

          break;

        default:
          {
            throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
          }
      }

      var _parentOrParents = subscription._parentOrParents;

      if (_parentOrParents === null) {
        subscription._parentOrParents = this;
      } else if (_parentOrParents instanceof Subscription) {
        if (_parentOrParents === this) {
          return subscription;
        }

        subscription._parentOrParents = [_parentOrParents, this];
      } else if (_parentOrParents.indexOf(this) === -1) {
        _parentOrParents.push(this);
      } else {
        return subscription;
      }

      var subscriptions = this._subscriptions;

      if (subscriptions === null) {
        this._subscriptions = [subscription];
      } else {
        subscriptions.push(subscription);
      }

      return subscription;
    };

    Subscription.prototype.remove = function (subscription) {
      var subscriptions = this._subscriptions;

      if (subscriptions) {
        var subscriptionIndex = subscriptions.indexOf(subscription);

        if (subscriptionIndex !== -1) {
          subscriptions.splice(subscriptionIndex, 1);
        }
      }
    };

    Subscription.EMPTY = function (empty) {
      empty.closed = true;
      return empty;
    }(new Subscription());

    return Subscription;
  }();

  function flattenUnsubscriptionErrors$1(errors) {
    return errors.reduce(function (errs, err) {
      return errs.concat(err instanceof UnsubscriptionError$1 ? err.errors : err);
    }, []);
  }
  /** PURE_IMPORTS_START  PURE_IMPORTS_END */


  var rxSubscriber$1 =
  /*@__PURE__*/
  function () {
    return typeof Symbol === 'function' ?
    /*@__PURE__*/
    Symbol('rxSubscriber') : '@@rxSubscriber_' +
    /*@__PURE__*/
    Math.random();
  }();
  /** PURE_IMPORTS_START tslib,_util_isFunction,_Observer,_Subscription,_internal_symbol_rxSubscriber,_config,_util_hostReportError PURE_IMPORTS_END */


  var Subscriber$1 =
  /*@__PURE__*/
  function (_super) {
    __extends$1(Subscriber, _super);

    function Subscriber(destinationOrNext, error, complete) {
      var _this = _super.call(this) || this;

      _this.syncErrorValue = null;
      _this.syncErrorThrown = false;
      _this.syncErrorThrowable = false;
      _this.isStopped = false;

      switch (arguments.length) {
        case 0:
          _this.destination = empty$2;
          break;

        case 1:
          if (!destinationOrNext) {
            _this.destination = empty$2;
            break;
          }

          if (_typeof(destinationOrNext) === 'object') {
            if (destinationOrNext instanceof Subscriber) {
              _this.syncErrorThrowable = destinationOrNext.syncErrorThrowable;
              _this.destination = destinationOrNext;
              destinationOrNext.add(_this);
            } else {
              _this.syncErrorThrowable = true;
              _this.destination = new SafeSubscriber$1(_this, destinationOrNext);
            }

            break;
          }

        default:
          _this.syncErrorThrowable = true;
          _this.destination = new SafeSubscriber$1(_this, destinationOrNext, error, complete);
          break;
      }

      return _this;
    }

    Subscriber.prototype[rxSubscriber$1] = function () {
      return this;
    };

    Subscriber.create = function (next, error, complete) {
      var subscriber = new Subscriber(next, error, complete);
      subscriber.syncErrorThrowable = false;
      return subscriber;
    };

    Subscriber.prototype.next = function (value) {
      if (!this.isStopped) {
        this._next(value);
      }
    };

    Subscriber.prototype.error = function (err) {
      if (!this.isStopped) {
        this.isStopped = true;

        this._error(err);
      }
    };

    Subscriber.prototype.complete = function () {
      if (!this.isStopped) {
        this.isStopped = true;

        this._complete();
      }
    };

    Subscriber.prototype.unsubscribe = function () {
      if (this.closed) {
        return;
      }

      this.isStopped = true;

      _super.prototype.unsubscribe.call(this);
    };

    Subscriber.prototype._next = function (value) {
      this.destination.next(value);
    };

    Subscriber.prototype._error = function (err) {
      this.destination.error(err);
      this.unsubscribe();
    };

    Subscriber.prototype._complete = function () {
      this.destination.complete();
      this.unsubscribe();
    };

    Subscriber.prototype._unsubscribeAndRecycle = function () {
      var _parentOrParents = this._parentOrParents;
      this._parentOrParents = null;
      this.unsubscribe();
      this.closed = false;
      this.isStopped = false;
      this._parentOrParents = _parentOrParents;
      return this;
    };

    return Subscriber;
  }(Subscription$1);

  var SafeSubscriber$1 =
  /*@__PURE__*/
  function (_super) {
    __extends$1(SafeSubscriber, _super);

    function SafeSubscriber(_parentSubscriber, observerOrNext, error, complete) {
      var _this = _super.call(this) || this;

      _this._parentSubscriber = _parentSubscriber;
      var next;
      var context = _this;

      if (isFunction$1$1(observerOrNext)) {
        next = observerOrNext;
      } else if (observerOrNext) {
        next = observerOrNext.next;
        error = observerOrNext.error;
        complete = observerOrNext.complete;

        if (observerOrNext !== empty$2) {
          context = Object.create(observerOrNext);

          if (isFunction$1$1(context.unsubscribe)) {
            _this.add(context.unsubscribe.bind(context));
          }

          context.unsubscribe = _this.unsubscribe.bind(_this);
        }
      }

      _this._context = context;
      _this._next = next;
      _this._error = error;
      _this._complete = complete;
      return _this;
    }

    SafeSubscriber.prototype.next = function (value) {
      if (!this.isStopped && this._next) {
        var _parentSubscriber = this._parentSubscriber;

        if (!config$1.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
          this.__tryOrUnsub(this._next, value);
        } else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
          this.unsubscribe();
        }
      }
    };

    SafeSubscriber.prototype.error = function (err) {
      if (!this.isStopped) {
        var _parentSubscriber = this._parentSubscriber;
        var useDeprecatedSynchronousErrorHandling = config$1.useDeprecatedSynchronousErrorHandling;

        if (this._error) {
          if (!useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
            this.__tryOrUnsub(this._error, err);

            this.unsubscribe();
          } else {
            this.__tryOrSetError(_parentSubscriber, this._error, err);

            this.unsubscribe();
          }
        } else if (!_parentSubscriber.syncErrorThrowable) {
          this.unsubscribe();

          if (useDeprecatedSynchronousErrorHandling) {
            throw err;
          }

          hostReportError$1(err);
        } else {
          if (useDeprecatedSynchronousErrorHandling) {
            _parentSubscriber.syncErrorValue = err;
            _parentSubscriber.syncErrorThrown = true;
          } else {
            hostReportError$1(err);
          }

          this.unsubscribe();
        }
      }
    };

    SafeSubscriber.prototype.complete = function () {
      var _this = this;

      if (!this.isStopped) {
        var _parentSubscriber = this._parentSubscriber;

        if (this._complete) {
          var wrappedComplete = function wrappedComplete() {
            return _this._complete.call(_this._context);
          };

          if (!config$1.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
            this.__tryOrUnsub(wrappedComplete);

            this.unsubscribe();
          } else {
            this.__tryOrSetError(_parentSubscriber, wrappedComplete);

            this.unsubscribe();
          }
        } else {
          this.unsubscribe();
        }
      }
    };

    SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
      try {
        fn.call(this._context, value);
      } catch (err) {
        this.unsubscribe();

        if (config$1.useDeprecatedSynchronousErrorHandling) {
          throw err;
        } else {
          hostReportError$1(err);
        }
      }
    };

    SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
      if (!config$1.useDeprecatedSynchronousErrorHandling) {
        throw new Error('bad call');
      }

      try {
        fn.call(this._context, value);
      } catch (err) {
        if (config$1.useDeprecatedSynchronousErrorHandling) {
          parent.syncErrorValue = err;
          parent.syncErrorThrown = true;
          return true;
        } else {
          hostReportError$1(err);
          return true;
        }
      }

      return false;
    };

    SafeSubscriber.prototype._unsubscribe = function () {
      var _parentSubscriber = this._parentSubscriber;
      this._context = null;
      this._parentSubscriber = null;

      _parentSubscriber.unsubscribe();
    };

    return SafeSubscriber;
  }(Subscriber$1);
  /** PURE_IMPORTS_START  PURE_IMPORTS_END */


  function noop$1() {}
  /** PURE_IMPORTS_START tslib,_Subscriber,_util_noop,_util_isFunction PURE_IMPORTS_END */


  function tap(nextOrObserver, error, complete) {
    return function tapOperatorFunction(source) {
      return source.lift(new DoOperator(nextOrObserver, error, complete));
    };
  }

  var DoOperator =
  /*@__PURE__*/
  function () {
    function DoOperator(nextOrObserver, error, complete) {
      this.nextOrObserver = nextOrObserver;
      this.error = error;
      this.complete = complete;
    }

    DoOperator.prototype.call = function (subscriber, source) {
      return source.subscribe(new TapSubscriber(subscriber, this.nextOrObserver, this.error, this.complete));
    };

    return DoOperator;
  }();

  var TapSubscriber =
  /*@__PURE__*/
  function (_super) {
    __extends$1(TapSubscriber, _super);

    function TapSubscriber(destination, observerOrNext, error, complete) {
      var _this = _super.call(this, destination) || this;

      _this._tapNext = noop$1;
      _this._tapError = noop$1;
      _this._tapComplete = noop$1;
      _this._tapError = error || noop$1;
      _this._tapComplete = complete || noop$1;

      if (isFunction$1$1(observerOrNext)) {
        _this._context = _this;
        _this._tapNext = observerOrNext;
      } else if (observerOrNext) {
        _this._context = observerOrNext;
        _this._tapNext = observerOrNext.next || noop$1;
        _this._tapError = observerOrNext.error || noop$1;
        _this._tapComplete = observerOrNext.complete || noop$1;
      }

      return _this;
    }

    TapSubscriber.prototype._next = function (value) {
      try {
        this._tapNext.call(this._context, value);
      } catch (err) {
        this.destination.error(err);
        return;
      }

      this.destination.next(value);
    };

    TapSubscriber.prototype._error = function (err) {
      try {
        this._tapError.call(this._context, err);
      } catch (err) {
        this.destination.error(err);
        return;
      }

      this.destination.error(err);
    };

    TapSubscriber.prototype._complete = function () {
      try {
        this._tapComplete.call(this._context);
      } catch (err) {
        this.destination.error(err);
        return;
      }

      return this.destination.complete();
    };

    return TapSubscriber;
  }(Subscriber$1);

  var getProxy = function getProxy(_a) {
    var serviceCall = _a.serviceCall,
        serviceDefinition = _a.serviceDefinition; // workaround to support old browsers

    var obj = {};
    Object.keys(serviceDefinition.methods).forEach(function (key) {
      return obj[key] = function () {
        throw Error(NO_PROXY_SUPPORT);
      };
    });
    return new Proxy(obj, {
      get: preServiceCall({
        serviceDefinition: serviceDefinition,
        serviceCall: serviceCall
      })
    });
  };

  var preServiceCall = function preServiceCall(_a) {
    var serviceCall = _a.serviceCall,
        serviceDefinition = _a.serviceDefinition;
    return function (target, prop) {
      if (!serviceDefinition.methods[prop]) {
        throw new Error(getServiceMethodIsMissingError(prop));
      }

      var asyncModel = serviceDefinition.methods[prop].asyncModel;
      return function () {
        var data = [];

        for (var _i = 0; _i < arguments.length; _i++) {
          data[_i] = arguments[_i];
        }

        var message = {
          qualifier: getQualifier({
            serviceName: serviceDefinition.serviceName,
            methodName: prop
          }),
          data: data
        };
        return serviceCall({
          message: message,
          asyncModel: asyncModel
        });
      };
    };
  };

  var _createProxy = function createProxy(proxyOptions) {
    var router = proxyOptions.router,
        serviceDefinition = proxyOptions.serviceDefinition,
        microserviceContext = proxyOptions.microserviceContext,
        transportClient = proxyOptions.transportClient;

    if (!microserviceContext) {
      throw new Error(MICROSERVICE_NOT_EXISTS);
    }

    validateServiceDefinition(serviceDefinition);
    return getProxy({
      serviceCall: getServiceCall({
        router: router,
        microserviceContext: microserviceContext,
        transportClient: transportClient
      }),
      serviceDefinition: serviceDefinition
    });
  };

  var _destroy = function destroy(options) {
    var discovery = options.discovery,
        serverStop = options.serverStop,
        transportClientDestroy = options.transportClientDestroy;
    var microserviceContext = options.microserviceContext;

    if (!microserviceContext) {
      throw new Error(MICROSERVICE_NOT_EXISTS);
    }

    var logger = loggerUtil(microserviceContext.whoAmI, microserviceContext.debug);
    return new Promise(function (resolve, reject) {
      if (microserviceContext) {
        var localRegistry = microserviceContext.localRegistry,
            remoteRegistry = microserviceContext.remoteRegistry;
        localRegistry.destroy();
        remoteRegistry.destroy();
        transportClientDestroy({
          address: microserviceContext.whoAmI,
          logger: logger
        });
      }

      serverStop && serverStop();
      discovery && discovery.destroy().then(function () {
        resolve('');
        microserviceContext = null;
      });
    });
  };

  var setMicroserviceInstance = function setMicroserviceInstance(options) {
    var transportClient = options.transportClient,
        serverStop = options.serverStop,
        discoveryInstance = options.discoveryInstance,
        debug = options.debug,
        defaultRouter = options.defaultRouter,
        microserviceContext = options.microserviceContext;
    var remoteRegistry = microserviceContext.remoteRegistry;
    discoveryInstance.discoveredItems$().pipe(printLogs(microserviceContext.whoAmI, debug)).subscribe(remoteRegistry.update);
    var serviceFactoryOptions = getServiceFactoryOptions({
      microserviceContext: microserviceContext,
      transportClient: transportClient,
      defaultRouter: defaultRouter
    });
    return Object.freeze(_assign$1({
      destroy: function destroy() {
        return _destroy({
          microserviceContext: microserviceContext,
          discovery: discoveryInstance,
          serverStop: serverStop,
          transportClientDestroy: transportClient.destroy
        });
      }
    }, serviceFactoryOptions));
  };

  var getServiceFactoryOptions = function getServiceFactoryOptions(_a) {
    var microserviceContext = _a.microserviceContext,
        transportClient = _a.transportClient,
        defaultRouter = _a.defaultRouter;
    return {
      createProxy: function createProxy(_a) {
        var serviceDefinition = _a.serviceDefinition,
            _b = _a.router,
            router = _b === void 0 ? defaultRouter : _b;
        return _createProxy({
          serviceDefinition: serviceDefinition,
          router: router,
          microserviceContext: microserviceContext,
          transportClient: transportClient
        });
      },
      createServiceCall: function createServiceCall(_a) {
        var _b = _a.router,
            router = _b === void 0 ? defaultRouter : _b;
        return _createServiceCall({
          router: router,
          microserviceContext: microserviceContext,
          transportClient: transportClient
        });
      }
    };
  };

  var printLogs = function printLogs(whoAmI, debug) {
    return tap(function (_a) {
      var _b;

      var type = _a.type,
          items = _a.items;
      return type !== 'IDLE' && saveToLogs(whoAmI, "microservice received an updated", (_b = {}, _b[type] = items.map(function (item) {
        return item.qualifier;
      }), _b), debug);
    });
  };

  var createMicroservice = function createMicroservice(options) {
    var microserviceOptions = _assign$1({
      defaultRouter: function defaultRouter() {
        throw new Error(ROUTER_NOT_PROVIDED);
      },
      services: [],
      debug: false,
      transport: {
        clientTransport: {
          start: function start() {
            throw new Error('client transport not provided');
          }
        },
        serverTransport: function serverTransport() {
          throw new Error('server transport not provided');
        }
      }
    }, options);

    if (isString(microserviceOptions.address)) {
      microserviceOptions = _assign$1(_assign$1({}, microserviceOptions), {
        address: getAddress(microserviceOptions.address)
      });
    }

    if (isString(microserviceOptions.seedAddress)) {
      microserviceOptions = _assign$1(_assign$1({}, microserviceOptions), {
        seedAddress: getAddress(microserviceOptions.seedAddress)
      });
    }

    validateMicroserviceOptions(microserviceOptions);
    var cluster = microserviceOptions.cluster,
        debug = microserviceOptions.debug;
    var transport = microserviceOptions.transport;
    var address = microserviceOptions.address;
    var seedAddress = microserviceOptions.seedAddress;
    var transportClient = transport.clientTransport;
    var fallBackAddress = address || getAddress(Date.now().toString()); // tslint:disable-next-line

    var microserviceContext = createMicroserviceContext({
      address: fallBackAddress,
      debug: debug || false
    });
    var remoteRegistry = microserviceContext.remoteRegistry,
        localRegistry = microserviceContext.localRegistry;
    var serviceFactoryOptions = getServiceFactoryOptions({
      microserviceContext: microserviceContext,
      transportClient: transportClient,
      defaultRouter: microserviceOptions.defaultRouter
    });
    var services = microserviceOptions ? flatteningServices({
      services: microserviceOptions.services,
      serviceFactoryOptions: serviceFactoryOptions
    }) : [];
    localRegistry.add({
      services: services,
      address: address
    }); // if address is not available then microservice can't share services

    var endPointsToPublishInCluster = address ? remoteRegistry.createEndPoints({
      services: services,
      address: address
    }) || [] : [];
    var discoveryInstance = createDiscovery({
      address: fallBackAddress,
      itemsToPublish: endPointsToPublishInCluster,
      seedAddress: seedAddress,
      cluster: cluster,
      debug: debug
    });
    validateDiscoveryInstance(discoveryInstance); // if address is not available then microservice can't start a server and get serviceCall requests

    var serverStop = address && transport ? transport.serverTransport({
      logger: loggerUtil(microserviceContext.whoAmI, microserviceContext.debug),
      localAddress: address,
      serviceCall: _createServiceCall({
        router: microserviceOptions.defaultRouter,
        microserviceContext: microserviceContext,
        transportClient: transportClient
      })
    }) : function () {};
    return setMicroserviceInstance({
      microserviceContext: microserviceContext,
      transportClient: transportClient,
      discoveryInstance: discoveryInstance,
      serverStop: serverStop,
      debug: debug,
      defaultRouter: microserviceOptions.defaultRouter
    });
  };

  var createMicroserviceContext = function createMicroserviceContext(_a) {
    var address = _a.address,
        debug = _a.debug;
    var remoteRegistry = createRemoteRegistry();
    var localRegistry = createLocalRegistry();
    return {
      remoteRegistry: remoteRegistry,
      localRegistry: localRegistry,
      debug: debug,
      whoAmI: getFullAddress(address)
    };
  };

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   * 
   */

  var nullthrows = function nullthrows(x) {
    if (x != null) {
      return x;
    }

    throw new Error("Got unexpected null or undefined");
  };

  var nullthrows_1 = nullthrows;

  var FlowableMapOperator_1 = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, '__esModule', {
      value: true
    });

    var _nullthrows2 = _interopRequireDefault(nullthrows_1);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        "default": obj
      };
    }
    /**
                                                                                                                                                                                                           * An operator that acts like Array.map, applying a given function to
                                                                                                                                                                                                           * all values provided by its `Subscription` and passing the result to its
                                                                                                                                                                                                           * `Subscriber`.
                                                                                                                                                                                                           */


    var FlowableMapOperator =
    /*#__PURE__*/
    function () {
      function FlowableMapOperator(subscriber, fn) {
        _classCallCheck(this, FlowableMapOperator);

        this._fn = fn;
        this._subscriber = subscriber;
        this._subscription = null;
      }

      _createClass(FlowableMapOperator, [{
        key: "onComplete",
        value: function onComplete() {
          this._subscriber.onComplete();
        }
      }, {
        key: "onError",
        value: function onError(error) {
          this._subscriber.onError(error);
        }
      }, {
        key: "onNext",
        value: function onNext(t) {
          try {
            this._subscriber.onNext(this._fn(t));
          } catch (e) {
            (0, _nullthrows2["default"])(this._subscription).cancel();

            this._subscriber.onError(e);
          }
        }
      }, {
        key: "onSubscribe",
        value: function onSubscribe(subscription) {
          this._subscription = subscription;

          this._subscriber.onSubscribe(subscription);
        }
      }]);

      return FlowableMapOperator;
    }();

    exports["default"] = FlowableMapOperator;
  });
  unwrapExports(FlowableMapOperator_1);

  var FlowableTakeOperator_1 = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, '__esModule', {
      value: true
    });

    var _nullthrows2 = _interopRequireDefault(nullthrows_1);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        "default": obj
      };
    }
    /**
                                                                                                                                                                                                           * An operator that requests a fixed number of values from its source
                                                                                                                                                                                                           * `Subscription` and forwards them to its `Subscriber`, cancelling the
                                                                                                                                                                                                           * subscription when the requested number of items has been reached.
                                                                                                                                                                                                           */


    var FlowableTakeOperator =
    /*#__PURE__*/
    function () {
      function FlowableTakeOperator(subscriber, toTake) {
        _classCallCheck(this, FlowableTakeOperator);

        this._subscriber = subscriber;
        this._subscription = null;
        this._toTake = toTake;
      }

      _createClass(FlowableTakeOperator, [{
        key: "onComplete",
        value: function onComplete() {
          this._subscriber.onComplete();
        }
      }, {
        key: "onError",
        value: function onError(error) {
          this._subscriber.onError(error);
        }
      }, {
        key: "onNext",
        value: function onNext(t) {
          try {
            this._subscriber.onNext(t);

            if (--this._toTake === 0) {
              this._cancelAndComplete();
            }
          } catch (e) {
            (0, _nullthrows2["default"])(this._subscription).cancel();

            this._subscriber.onError(e);
          }
        }
      }, {
        key: "onSubscribe",
        value: function onSubscribe(subscription) {
          this._subscription = subscription;

          this._subscriber.onSubscribe(subscription);

          if (this._toTake <= 0) {
            this._cancelAndComplete();
          }
        }
      }, {
        key: "_cancelAndComplete",
        value: function _cancelAndComplete() {
          (0, _nullthrows2["default"])(this._subscription).cancel();

          this._subscriber.onComplete();
        }
      }]);

      return FlowableTakeOperator;
    }();

    exports["default"] = FlowableTakeOperator;
  });
  unwrapExports(FlowableTakeOperator_1);

  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   * 
   */

  var validateFormat =  function (format) {
    if (format === undefined) {
      throw new Error('invariant(...): Second argument must be a string.');
    }
  };
  /**
   * Use invariant() to assert state which your program assumes to be true.
   *
   * Provide sprintf-style format (only %s is supported) and arguments to provide
   * information about what broke and what you were expecting.
   *
   * The invariant message will be stripped in production, but the invariant will
   * remain to ensure logic does not differ in production.
   */

  function invariant(condition, format) {
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    validateFormat(format);

    if (!condition) {
      var error;

      if (format === undefined) {
        error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
      } else {
        var argIndex = 0;
        error = new Error(format.replace(/%s/g, function () {
          return String(args[argIndex++]);
        }));
        error.name = 'Invariant Violation';
      }

      error.framesToPop = 1; // Skip invariant's own stack frame.

      throw error;
    }
  }

  var invariant_1 = invariant;

  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   * 
   */

  function makeEmptyFunction(arg) {
    return function () {
      return arg;
    };
  }
  /**
   * This function accepts and discards inputs; it has no side effects. This is
   * primarily useful idiomatically for overridable function endpoints which
   * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
   */


  var emptyFunction = function emptyFunction() {};

  emptyFunction.thatReturns = makeEmptyFunction;
  emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
  emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
  emptyFunction.thatReturnsNull = makeEmptyFunction(null);

  emptyFunction.thatReturnsThis = function () {
    return this;
  };

  emptyFunction.thatReturnsArgument = function (arg) {
    return arg;
  };

  var emptyFunction_1 = emptyFunction;

  var warning =  emptyFunction_1;
  var warning_1 = warning;

  var Flowable_1 = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, '__esModule', {
      value: true
    });

    var _FlowableMapOperator2 = _interopRequireDefault(FlowableMapOperator_1);

    var _FlowableTakeOperator2 = _interopRequireDefault(FlowableTakeOperator_1);

    var _invariant2 = _interopRequireDefault(invariant_1);

    var _warning2 = _interopRequireDefault(warning_1);

    var _emptyFunction2 = _interopRequireDefault(emptyFunction_1);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        "default": obj
      };
    }
    /**
                                                                                                                                                                                                                       * Implements the ReactiveStream `Publisher` interface with Rx-style operators.
                                                                                                                                                                                                                       */


    var Flowable =
    /*#__PURE__*/
    function () {
      _createClass(Flowable, null, [{
        key: "just",
        value: function just() {
          for (var _len = arguments.length, values = new Array(_len), _key = 0; _key < _len; _key++) {
            values[_key] = arguments[_key];
          }

          return new Flowable(function (subscriber) {
            var cancelled = false;
            var i = 0;
            subscriber.onSubscribe({
              cancel: function cancel() {
                cancelled = true;
              },
              request: function request(n) {
                while (!cancelled && n > 0 && i < values.length) {
                  subscriber.onNext(values[i++]);
                  n--;
                }

                if (!cancelled && i == values.length) {
                  subscriber.onComplete();
                }
              }
            });
          });
        }
      }, {
        key: "error",
        value: function error(_error) {
          return new Flowable(function (subscriber) {
            subscriber.onSubscribe({
              cancel: function cancel() {},
              request: function request() {
                subscriber.onError(_error);
              }
            });
          });
        }
      }, {
        key: "never",
        value: function never() {
          return new Flowable(function (subscriber) {
            subscriber.onSubscribe({
              cancel: _emptyFunction2["default"],
              request: _emptyFunction2["default"]
            });
          });
        }
      }]);

      function Flowable(source) {
        var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Number.MAX_SAFE_INTEGER;

        _classCallCheck(this, Flowable);

        this._max = max;
        this._source = source;
      }

      _createClass(Flowable, [{
        key: "subscribe",
        value: function subscribe(subscriberOrCallback) {
          var partialSubscriber;

          if (typeof subscriberOrCallback === 'function') {
            partialSubscriber = this._wrapCallback(subscriberOrCallback);
          } else {
            partialSubscriber = subscriberOrCallback;
          }

          var subscriber = new FlowableSubscriber(partialSubscriber, this._max);

          this._source(subscriber);
        }
      }, {
        key: "lift",
        value: function lift(onSubscribeLift) {
          var _this = this;

          return new Flowable(function (subscriber) {
            return _this._source(onSubscribeLift(subscriber));
          });
        }
      }, {
        key: "map",
        value: function map(fn) {
          return this.lift(function (subscriber) {
            return new _FlowableMapOperator2["default"](subscriber, fn);
          });
        }
      }, {
        key: "take",
        value: function take(toTake) {
          return this.lift(function (subscriber) {
            return new _FlowableTakeOperator2["default"](subscriber, toTake);
          });
        }
      }, {
        key: "_wrapCallback",
        value: function _wrapCallback(callback) {
          var max = this._max;
          return {
            onNext: callback,
            onSubscribe: function onSubscribe(subscription) {
              subscription.request(max);
            }
          };
        }
      }]);

      return Flowable;
    }();

    exports["default"] = Flowable;
    /**
                                     * @private
                                     */

    var FlowableSubscriber =
    /*#__PURE__*/
    function () {
      function FlowableSubscriber(subscriber, max) {
        var _this2 = this;

        _classCallCheck(this, FlowableSubscriber);

        this._cancel = function () {
          if (!_this2._active) {
            return;
          }

          _this2._active = false;

          if (_this2._subscription) {
            _this2._subscription.cancel();
          }
        };

        this._request = function (n) {
          (0, _invariant2["default"])(Number.isInteger(n) && n >= 1 && n <= _this2._max, 'Flowable: Expected request value to be an integer with a ' + 'value greater than 0 and less than or equal to %s, got ' + '`%s`.', _this2._max, n);

          if (!_this2._active) {
            return;
          }

          if (n === _this2._max) {
            _this2._pending = _this2._max;
          } else {
            _this2._pending += n;

            if (_this2._pending >= _this2._max) {
              _this2._pending = _this2._max;
            }
          }

          if (_this2._subscription) {
            _this2._subscription.request(n);
          }
        };

        this._active = false;
        this._max = max;
        this._pending = 0;
        this._started = false;
        this._subscriber = subscriber || {};
        this._subscription = null;
      }

      _createClass(FlowableSubscriber, [{
        key: "onComplete",
        value: function onComplete() {
          if (!this._active) {
            (0, _warning2["default"])(false, 'Flowable: Invalid call to onComplete(): %s.', this._started ? 'onComplete/onError was already called' : 'onSubscribe has not been called');
            return;
          }

          this._active = false;
          this._started = true;

          try {
            if (this._subscriber.onComplete) {
              this._subscriber.onComplete();
            }
          } catch (error) {
            if (this._subscriber.onError) {
              this._subscriber.onError(error);
            }
          }
        }
      }, {
        key: "onError",
        value: function onError(error) {
          if (this._started && !this._active) {
            (0, _warning2["default"])(false, 'Flowable: Invalid call to onError(): %s.', this._active ? 'onComplete/onError was already called' : 'onSubscribe has not been called');
            return;
          }

          this._active = false;
          this._started = true;
          this._subscriber.onError && this._subscriber.onError(error);
        }
      }, {
        key: "onNext",
        value: function onNext(data) {
          if (!this._active) {
            (0, _warning2["default"])(false, 'Flowable: Invalid call to onNext(): %s.', this._active ? 'onComplete/onError was already called' : 'onSubscribe has not been called');
            return;
          }

          if (this._pending === 0) {
            (0, _warning2["default"])(false, 'Flowable: Invalid call to onNext(), all request()ed values have been ' + 'published.');
            return;
          }

          if (this._pending !== this._max) {
            this._pending--;
          }

          try {
            this._subscriber.onNext && this._subscriber.onNext(data);
          } catch (error) {
            if (this._subscription) {
              this._subscription.cancel();
            }

            this.onError(error);
          }
        }
      }, {
        key: "onSubscribe",
        value: function onSubscribe(subscription) {
          if (this._started) {
            (0, _warning2["default"])(false, 'Flowable: Invalid call to onSubscribe(): already called.');
            return;
          }

          this._active = true;
          this._started = true;
          this._subscription = subscription;

          try {
            this._subscriber.onSubscribe && this._subscriber.onSubscribe({
              cancel: this._cancel,
              request: this._request
            });
          } catch (error) {
            this.onError(error);
          }
        }
      }]);

      return FlowableSubscriber;
    }();
  });
  unwrapExports(Flowable_1);

  var Single_1 = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, '__esModule', {
      value: true
    });

    var _warning2 = _interopRequireDefault(warning_1);

    var _emptyFunction2 = _interopRequireDefault(emptyFunction_1);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        "default": obj
      };
    }
    /**
                                                                                                                                                                                                                       * Represents a lazy computation that will either produce a value of type T
                                                                                                                                                                                                                       * or fail with an error. Calling `subscribe()` starts the
                                                                                                                                                                                                                       * computation and returns a subscription object, which has an `unsubscribe()`
                                                                                                                                                                                                                       * method that can be called to prevent completion/error callbacks from being
                                                                                                                                                                                                                       * invoked and, where supported, to also cancel the computation.
                                                                                                                                                                                                                       * Implementations may optionally implement cancellation; if they do not
                                                                                                                                                                                                                       * `cancel()` is a no-op.
                                                                                                                                                                                                                       *
                                                                                                                                                                                                                       * Note: Unlike Promise, callbacks (onComplete/onError) may be invoked
                                                                                                                                                                                                                       * synchronously.
                                                                                                                                                                                                                       *
                                                                                                                                                                                                                       * Example:
                                                                                                                                                                                                                       *
                                                                                                                                                                                                                       * ```
                                                                                                                                                                                                                       * const value = new Single(subscriber => {
                                                                                                                                                                                                                       *   const id = setTimeout(
                                                                                                                                                                                                                       *     () => subscriber.onComplete('Hello!'),
                                                                                                                                                                                                                       *     250
                                                                                                                                                                                                                       *   );
                                                                                                                                                                                                                       *   // Optional: Call `onSubscribe` with a cancellation callback
                                                                                                                                                                                                                       *   subscriber.onSubscribe(() => clearTimeout(id));
                                                                                                                                                                                                                       * });
                                                                                                                                                                                                                       *
                                                                                                                                                                                                                       * // Start the computation. onComplete will be called after the timeout
                                                                                                                                                                                                                       * // with 'hello'  unless `cancel()` is called first.
                                                                                                                                                                                                                       * value.subscribe({
                                                                                                                                                                                                                       *   onComplete: value => console.log(value),
                                                                                                                                                                                                                       *   onError: error => console.error(error),
                                                                                                                                                                                                                       *   onSubscribe: cancel => ...
                                                                                                                                                                                                                       * });
                                                                                                                                                                                                                       * ```
                                                                                                                                                                                                                       */


    var Single =
    /*#__PURE__*/
    function () {
      _createClass(Single, null, [{
        key: "of",
        value: function of(value) {
          return new Single(function (subscriber) {
            subscriber.onSubscribe();
            subscriber.onComplete(value);
          });
        }
      }, {
        key: "error",
        value: function error(_error) {
          return new Single(function (subscriber) {
            subscriber.onSubscribe();
            subscriber.onError(_error);
          });
        }
      }]);

      function Single(source) {
        _classCallCheck(this, Single);

        this._source = source;
      }

      _createClass(Single, [{
        key: "subscribe",
        value: function subscribe(partialSubscriber) {
          var subscriber = new FutureSubscriber(partialSubscriber);

          try {
            this._source(subscriber);
          } catch (error) {
            subscriber.onError(error);
          }
        }
      }, {
        key: "flatMap",
        value: function flatMap(fn) {
          var _this = this;

          return new Single(function (subscriber) {
            var currentCancel;

            var cancel = function cancel() {
              currentCancel && currentCancel();
              currentCancel = null;
            };

            _this._source({
              onComplete: function onComplete(value) {
                fn(value).subscribe({
                  onComplete: function onComplete(mapValue) {
                    subscriber.onComplete(mapValue);
                  },
                  onError: function onError(error) {
                    return subscriber.onError(error);
                  },
                  onSubscribe: function onSubscribe(_cancel) {
                    currentCancel = _cancel;
                  }
                });
              },
              onError: function onError(error) {
                return subscriber.onError(error);
              },
              onSubscribe: function onSubscribe(_cancel) {
                currentCancel = _cancel;
                subscriber.onSubscribe(cancel);
              }
            });
          });
        }
        /**
           * Return a new Single that resolves to the value of this Single applied to
           * the given mapping function.
           */

      }, {
        key: "map",
        value: function map(fn) {
          var _this2 = this;

          return new Single(function (subscriber) {
            return _this2._source({
              onComplete: function onComplete(value) {
                return subscriber.onComplete(fn(value));
              },
              onError: function onError(error) {
                return subscriber.onError(error);
              },
              onSubscribe: function onSubscribe(cancel) {
                return subscriber.onSubscribe(cancel);
              }
            });
          });
        }
      }, {
        key: "then",
        value: function then(successFn, errorFn) {
          this.subscribe({
            onComplete: successFn || _emptyFunction2["default"],
            onError: errorFn || _emptyFunction2["default"]
          });
        }
      }]);

      return Single;
    }();

    exports["default"] = Single;
    /**
                                   * @private
                                   */

    var FutureSubscriber =
    /*#__PURE__*/
    function () {
      function FutureSubscriber(subscriber) {
        _classCallCheck(this, FutureSubscriber);

        this._active = false;
        this._started = false;
        this._subscriber = subscriber || {};
      }

      _createClass(FutureSubscriber, [{
        key: "onComplete",
        value: function onComplete(value) {
          if (!this._active) {
            (0, _warning2["default"])(false, 'Single: Invalid call to onComplete(): %s.', this._started ? 'onComplete/onError was already called' : 'onSubscribe has not been called');
            return;
          }

          this._active = false;
          this._started = true;

          try {
            if (this._subscriber.onComplete) {
              this._subscriber.onComplete(value);
            }
          } catch (error) {
            if (this._subscriber.onError) {
              this._subscriber.onError(error);
            }
          }
        }
      }, {
        key: "onError",
        value: function onError(error) {
          if (this._started && !this._active) {
            (0, _warning2["default"])(false, 'Single: Invalid call to onError(): %s.', this._active ? 'onComplete/onError was already called' : 'onSubscribe has not been called');
            return;
          }

          this._active = false;
          this._started = true;
          this._subscriber.onError && this._subscriber.onError(error);
        }
      }, {
        key: "onSubscribe",
        value: function onSubscribe(cancel) {
          var _this3 = this;

          if (this._started) {
            (0, _warning2["default"])(false, 'Single: Invalid call to onSubscribe(): already called.');
            return;
          }

          this._active = true;
          this._started = true;

          try {
            this._subscriber.onSubscribe && this._subscriber.onSubscribe(function () {
              if (!_this3._active) {
                return;
              }

              _this3._active = false;
              cancel && cancel();
            });
          } catch (error) {
            this.onError(error);
          }
        }
      }]);

      return FutureSubscriber;
    }();
  });
  unwrapExports(Single_1);

  var FlowableProcessor_1 = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, '__esModule', {
      value: true
    });

    var _warning2 = _interopRequireDefault(warning_1);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        "default": obj
      };
    }

    var FlowableProcessor =
    /*#__PURE__*/
    function () {
      function FlowableProcessor(source, fn) {
        _classCallCheck(this, FlowableProcessor);

        this._source = source;
        this._transformer = fn;
        this._done = false;
        this._mappers = []; //mappers for map function
      }

      _createClass(FlowableProcessor, [{
        key: "onSubscribe",
        value: function onSubscribe(subscription) {
          this._subscription = subscription;
        }
      }, {
        key: "onNext",
        value: function onNext(t) {
          if (!this._sink) {
            (0, _warning2["default"])('Warning, premature onNext for processor, dropping value');
            return;
          }

          var val = t;

          if (this._transformer) {
            val = this._transformer(t);
          }

          var finalVal = this._mappers.reduce(function (interimVal, mapper) {
            return mapper(interimVal);
          }, val);

          this._sink.onNext(finalVal);
        }
      }, {
        key: "onError",
        value: function onError(error) {
          this._error = error;

          if (!this._sink) {
            (0, _warning2["default"])('Warning, premature onError for processor, marking complete/errored');
          } else {
            this._sink.onError(error);
          }
        }
      }, {
        key: "onComplete",
        value: function onComplete() {
          this._done = true;

          if (!this._sink) {
            (0, _warning2["default"])('Warning, premature onError for processor, marking complete');
          } else {
            this._sink.onComplete();
          }
        }
      }, {
        key: "subscribe",
        value: function subscribe(subscriber) {
          if (this._source.subscribe) {
            this._source.subscribe(this);
          }

          this._sink = subscriber;

          this._sink.onSubscribe(this);

          if (this._error) {
            this._sink.onError(this._error);
          } else if (this._done) {
            this._sink.onComplete();
          }
        }
      }, {
        key: "map",
        value: function map(fn) {
          this._mappers.push(fn);

          return this;
        }
      }, {
        key: "request",
        value: function request(n) {
          this._subscription && this._subscription.request(n);
        }
      }, {
        key: "cancel",
        value: function cancel() {
          this._subscription && this._subscription.cancel();
        }
      }]);

      return FlowableProcessor;
    }();

    exports["default"] = FlowableProcessor;
  });
  unwrapExports(FlowableProcessor_1);

  var FlowableTimer = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    exports.every = every;

    var _Flowable2 = _interopRequireDefault(Flowable_1);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        "default": obj
      };
    }
    /**
                                                                                                                                                                                                          * Returns a Publisher that provides the current time (Date.now()) every `ms`
                                                                                                                                                                                                          * milliseconds.
                                                                                                                                                                                                          *
                                                                                                                                                                                                          * The timer is established on the first call to `request`: on each
                                                                                                                                                                                                          * interval a value is published if there are outstanding requests,
                                                                                                                                                                                                          * otherwise nothing occurs for that interval. This approach ensures
                                                                                                                                                                                                          * that the interval between `onNext` calls is as regular as possible
                                                                                                                                                                                                          * and means that overlapping `request` calls (ie calling again before
                                                                                                                                                                                                          * the previous values have been vended) behaves consistently.
                                                                                                                                                                                                          */


    function every(ms) {
      return new _Flowable2["default"](function (subscriber) {
        var intervalId = null;
        var pending = 0;
        subscriber.onSubscribe({
          cancel: function cancel() {
            if (intervalId != null) {
              clearInterval(intervalId);
              intervalId = null;
            }
          },
          request: function request(n) {
            if (n < Number.MAX_SAFE_INTEGER) {
              pending += n;
            } else {
              pending = Number.MAX_SAFE_INTEGER;
            }

            if (intervalId != null) {
              return;
            }

            intervalId = setInterval(function () {
              if (pending > 0) {
                if (pending !== Number.MAX_SAFE_INTEGER) {
                  pending--;
                }

                subscriber.onNext(Date.now());
              }
            }, ms);
          }
        });
      });
    }
  });
  unwrapExports(FlowableTimer);
  var FlowableTimer_1 = FlowableTimer.every;

  var build = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    exports.every = exports.Single = exports.FlowableProcessor = exports.Flowable = undefined;

    var _Flowable2 = _interopRequireDefault(Flowable_1);

    var _Single2 = _interopRequireDefault(Single_1);

    var _FlowableProcessor2 = _interopRequireDefault(FlowableProcessor_1);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        "default": obj
      };
    }
    /**
                                                                                                                                                   * The public API of the `flowable` package.
                                                                                                                                                   */


    exports.Flowable = _Flowable2["default"];
    exports.FlowableProcessor = _FlowableProcessor2["default"];
    exports.Single = _Single2["default"];
    exports.every = FlowableTimer.every;
  });
  unwrapExports(build);
  var build_1 = build.every;
  var build_2 = build.Single;
  var build_3 = build.FlowableProcessor;
  var build_4 = build.Flowable;

  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   * @typechecks
   */

  var hasOwnProperty = Object.prototype.hasOwnProperty;
  /**
   * Executes the provided `callback` once for each enumerable own property in the
   * object. The `callback` is invoked with three arguments:
   *
   *  - the property value
   *  - the property name
   *  - the object being traversed
   *
   * Properties that are added after the call to `forEachObject` will not be
   * visited by `callback`. If the values of existing properties are changed, the
   * value passed to `callback` will be the value at the time `forEachObject`
   * visits them. Properties that are deleted before being visited are not
   * visited.
   *
   * @param {?object} object
   * @param {function} callback
   * @param {*} context
   */

  function forEachObject(object, callback, context) {
    for (var name in object) {
      if (hasOwnProperty.call(object, name)) {
        callback.call(context, object[name], name, object);
      }
    }
  }

  var forEachObject_1 = forEachObject;

  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   * @typechecks
   */

  /**
   * Simple function for formatting strings.
   *
   * Replaces placeholders with values passed as extra arguments
   *
   * @param {string} format the base string
   * @param ...args the values to insert
   * @return {string} the replaced string
   */

  function sprintf(format) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var index = 0;
    return format.replace(/%s/g, function (match) {
      return args[index++];
    });
  }

  var sprintf_1 = sprintf;

  var RSocketFrame = createCommonjsModule(function (module, exports) {
    /* eslint-disable max-len, no-bitwise */

    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    exports.MAX_VERSION = exports.MAX_TTL = exports.MAX_STREAM_ID = exports.MAX_RESUME_LENGTH = exports.MAX_REQUEST_N = exports.MAX_REQUEST_COUNT = exports.MAX_MIME_LENGTH = exports.MAX_METADATA_LENGTH = exports.MAX_LIFETIME = exports.MAX_KEEPALIVE = exports.MAX_CODE = exports.FRAME_TYPE_OFFFSET = exports.FLAGS_MASK = exports.ERROR_EXPLANATIONS = exports.ERROR_CODES = exports.FLAGS = exports.FRAME_TYPE_NAMES = exports.FRAME_TYPES = exports.CONNECTION_STREAM_ID = undefined;
    exports.isIgnore = isIgnore;
    exports.isMetadata = isMetadata;
    exports.isComplete = isComplete;
    exports.isNext = isNext;
    exports.isRespond = isRespond;
    exports.isResumeEnable = isResumeEnable;
    exports.isLease = isLease;
    exports.isResumePositionFrameType = isResumePositionFrameType;
    exports.getFrameTypeName = getFrameTypeName;
    exports.createErrorFromFrame = createErrorFromFrame;
    exports.getErrorCodeExplanation = getErrorCodeExplanation;
    exports.printFrame = printFrame;

    var _forEachObject2 = _interopRequireDefault(forEachObject_1);

    var _sprintf2 = _interopRequireDefault(sprintf_1);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        "default": obj
      };
    }

    var CONNECTION_STREAM_ID = exports.CONNECTION_STREAM_ID = 0;
    var FRAME_TYPES = exports.FRAME_TYPES = {
      CANCEL: 0x09,
      // Cancel Request: Cancel outstanding request.
      ERROR: 0x0b,
      // Error: Error at connection or application level.
      EXT: 0x3f,
      // Extension Header: Used To Extend more frame types as well as extensions.
      KEEPALIVE: 0x03,
      // Keepalive: Connection keepalive.
      LEASE: 0x02,
      // Lease: Sent by Responder to grant the ability to send requests.
      METADATA_PUSH: 0x0c,
      // Metadata: Asynchronous Metadata frame
      PAYLOAD: 0x0a,
      // Payload: Payload on a stream. For example, response to a request, or message on a channel.
      REQUEST_CHANNEL: 0x07,
      // Request Channel: Request a completable stream in both directions.
      REQUEST_FNF: 0x05,
      // Fire And Forget: A single one-way message.
      REQUEST_N: 0x08,
      // Request N: Request N more items with Reactive Streams semantics.
      REQUEST_RESPONSE: 0x04,
      // Request Response: Request single response.
      REQUEST_STREAM: 0x06,
      // Request Stream: Request a completable stream.
      RESERVED: 0x00,
      // Reserved
      RESUME: 0x0d,
      // Resume: Replaces SETUP for Resuming Operation (optional)
      RESUME_OK: 0x0e,
      // Resume OK : Sent in response to a RESUME if resuming operation possible (optional)
      SETUP: 0x01 // Setup: Sent by client to initiate protocol processing.

    }; // Maps frame type codes to type names

    var FRAME_TYPE_NAMES = exports.FRAME_TYPE_NAMES = {};
    (0, _forEachObject2["default"])(FRAME_TYPES, function (value, name) {
      FRAME_TYPE_NAMES[value] = name;
    });
    var FLAGS = exports.FLAGS = {
      COMPLETE: 0x40,
      // PAYLOAD, REQUEST_CHANNEL: indicates stream completion, if set onComplete will be invoked on receiver.
      FOLLOWS: 0x80,
      // (unused)
      IGNORE: 0x200,
      // (all): Ignore frame if not understood.
      LEASE: 0x40,
      // SETUP: Will honor lease or not.
      METADATA: 0x100,
      // (all): must be set if metadata is present in the frame.
      NEXT: 0x20,
      // PAYLOAD: indicates data/metadata present, if set onNext will be invoked on receiver.
      RESPOND: 0x80,
      // KEEPALIVE: should KEEPALIVE be sent by peer on receipt.
      RESUME_ENABLE: 0x80 // SETUP: Client requests resume capability if possible. Resume Identification Token present.

    }; // Maps error names to codes

    var ERROR_CODES = exports.ERROR_CODES = {
      APPLICATION_ERROR: 0x00000201,
      CANCELED: 0x00000203,
      CONNECTION_CLOSE: 0x00000102,
      CONNECTION_ERROR: 0x00000101,
      INVALID: 0x00000204,
      INVALID_SETUP: 0x00000001,
      REJECTED: 0x00000202,
      REJECTED_RESUME: 0x00000004,
      REJECTED_SETUP: 0x00000003,
      RESERVED: 0x00000000,
      RESERVED_EXTENSION: 0xffffffff,
      UNSUPPORTED_SETUP: 0x00000002
    }; // Maps error codes to names

    var ERROR_EXPLANATIONS = exports.ERROR_EXPLANATIONS = {};
    (0, _forEachObject2["default"])(ERROR_CODES, function (code, explanation) {
      ERROR_EXPLANATIONS[code] = explanation;
    });
    var FLAGS_MASK = exports.FLAGS_MASK = 0x3ff; // low 10 bits

    var FRAME_TYPE_OFFFSET = exports.FRAME_TYPE_OFFFSET = 10; // frame type is offset 10 bytes within the uint16 containing type + flags

    var MAX_CODE = exports.MAX_CODE = 0x7fffffff; // uint31

    var MAX_KEEPALIVE = exports.MAX_KEEPALIVE = 0x7fffffff; // uint31

    var MAX_LIFETIME = exports.MAX_LIFETIME = 0x7fffffff; // uint31

    var MAX_METADATA_LENGTH = exports.MAX_METADATA_LENGTH = 0xffffff; // uint24

    var MAX_MIME_LENGTH = exports.MAX_MIME_LENGTH = 0xff; // int8

    var MAX_REQUEST_COUNT = exports.MAX_REQUEST_COUNT = 0x7fffffff; // uint31

    var MAX_REQUEST_N = exports.MAX_REQUEST_N = 0x7fffffff; // uint31

    var MAX_RESUME_LENGTH = exports.MAX_RESUME_LENGTH = 0xffff; // uint16

    var MAX_STREAM_ID = exports.MAX_STREAM_ID = 0x7fffffff; // uint31

    var MAX_TTL = exports.MAX_TTL = 0x7fffffff; // uint31

    var MAX_VERSION = exports.MAX_VERSION = 0xffff; // uint16

    /**
     * Returns true iff the flags have the IGNORE bit set.
     */

    function isIgnore(flags) {
      return (flags & FLAGS.IGNORE) === FLAGS.IGNORE;
    }
    /**
                                                                                   * Returns true iff the flags have the METADATA bit set.
                                                                                   */


    function isMetadata(flags) {
      return (flags & FLAGS.METADATA) === FLAGS.METADATA;
    }
    /**
                                                                                                                                                                       * Returns true iff the flags have the COMPLETE bit set.
                                                                                                                                                                       */


    function isComplete(flags) {
      return (flags & FLAGS.COMPLETE) === FLAGS.COMPLETE;
    }
    /**
                                                                                                                                                                                                                                                           * Returns true iff the flags have the NEXT bit set.
                                                                                                                                                                                                                                                           */


    function isNext(flags) {
      return (flags & FLAGS.NEXT) === FLAGS.NEXT;
    }
    /**
                                                                                                                                                                                                                                                                                                                                   * Returns true iff the flags have the RESPOND bit set.
                                                                                                                                                                                                                                                                                                                                   */


    function isRespond(flags) {
      return (flags & FLAGS.RESPOND) === FLAGS.RESPOND;
    }
    /**
                                                                                                                                                                                                                                                                                                                                                                                                                    * Returns true iff the flags have the RESUME_ENABLE bit set.
                                                                                                                                                                                                                                                                                                                                                                                                                    */


    function isResumeEnable(flags) {
      return (flags & FLAGS.RESUME_ENABLE) === FLAGS.RESUME_ENABLE;
    }
    /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Returns true iff the flags have the LEASE bit set.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


    function isLease(flags) {
      return (flags & FLAGS.LEASE) === FLAGS.LEASE;
    }
    /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 * Returns true iff the frame type is counted toward the implied
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 * client/server position used for the resumption protocol.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 */


    function isResumePositionFrameType(type) {
      return type === FRAME_TYPES.CANCEL || type === FRAME_TYPES.ERROR || type === FRAME_TYPES.PAYLOAD || type === FRAME_TYPES.REQUEST_CHANNEL || type === FRAME_TYPES.REQUEST_FNF || type === FRAME_TYPES.REQUEST_RESPONSE || type === FRAME_TYPES.REQUEST_STREAM || type === FRAME_TYPES.REQUEST_N;
    }

    function getFrameTypeName(type) {
      var name = FRAME_TYPE_NAMES[type];
      return name != null ? name : toHex(type);
    }
    /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              * Constructs an Error object given the contents of an error frame. The
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              * `source` property contains metadata about the error for use in introspecting
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              * the error at runtime:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              * - `error.source.code: number`: the error code returned by the server.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              * - `error.source.explanation: string`: human-readable explanation of the code
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              *   (this value is not standardized and may change).
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              * - `error.source.message: string`: the error string returned by the server.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              */


    function createErrorFromFrame(frame) {
      var code = frame.code,
          message = frame.message;
      var explanation = getErrorCodeExplanation(code);
      var error = new Error((0, _sprintf2["default"])('RSocket error %s (%s): %s. See error `source` property for details.', toHex(code), explanation, message));
      error.source = {
        code: code,
        explanation: explanation,
        message: message
      };
      return error;
    }
    /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Given a RSocket error code, returns a human-readable explanation of that
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * code, following the names used in the protocol specification.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


    function getErrorCodeExplanation(code) {
      var explanation = ERROR_EXPLANATIONS[code];

      if (explanation != null) {
        return explanation;
      } else if (code <= 0x00300) {
        return 'RESERVED (PROTOCOL)';
      } else {
        return 'RESERVED (APPLICATION)';
      }
    }
    /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * Pretty-prints the frame for debugging purposes, with types, flags, and
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * error codes annotated with descriptive names.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */


    function printFrame(frame) {
      var obj = Object.assign({}, frame);
      obj.type = getFrameTypeName(frame.type) + " (".concat(toHex(frame.type), ")");
      var flagNames = [];
      (0, _forEachObject2["default"])(FLAGS, function (flag, name) {
        if ((frame.flags & flag) === flag) {
          flagNames.push(name);
        }
      });

      if (!flagNames.length) {
        flagNames.push('NO FLAGS');
      }

      obj.flags = flagNames.join(' | ') + " (".concat(toHex(frame.flags), ")");

      if (frame.type === FRAME_TYPES.ERROR) {
        obj.code = getErrorCodeExplanation(frame.code) + " (".concat(toHex(frame.code), ")");
      }

      return JSON.stringify(obj, null, 2);
    }

    function toHex(n) {
      return '0x' + n.toString(16);
    }
  });
  unwrapExports(RSocketFrame);
  var RSocketFrame_1 = RSocketFrame.MAX_VERSION;
  var RSocketFrame_2 = RSocketFrame.MAX_TTL;
  var RSocketFrame_3 = RSocketFrame.MAX_STREAM_ID;
  var RSocketFrame_4 = RSocketFrame.MAX_RESUME_LENGTH;
  var RSocketFrame_5 = RSocketFrame.MAX_REQUEST_N;
  var RSocketFrame_6 = RSocketFrame.MAX_REQUEST_COUNT;
  var RSocketFrame_7 = RSocketFrame.MAX_MIME_LENGTH;
  var RSocketFrame_8 = RSocketFrame.MAX_METADATA_LENGTH;
  var RSocketFrame_9 = RSocketFrame.MAX_LIFETIME;
  var RSocketFrame_10 = RSocketFrame.MAX_KEEPALIVE;
  var RSocketFrame_11 = RSocketFrame.MAX_CODE;
  var RSocketFrame_12 = RSocketFrame.FRAME_TYPE_OFFFSET;
  var RSocketFrame_13 = RSocketFrame.FLAGS_MASK;
  var RSocketFrame_14 = RSocketFrame.ERROR_EXPLANATIONS;
  var RSocketFrame_15 = RSocketFrame.ERROR_CODES;
  var RSocketFrame_16 = RSocketFrame.FLAGS;
  var RSocketFrame_17 = RSocketFrame.FRAME_TYPE_NAMES;
  var RSocketFrame_18 = RSocketFrame.FRAME_TYPES;
  var RSocketFrame_19 = RSocketFrame.CONNECTION_STREAM_ID;
  var RSocketFrame_20 = RSocketFrame.isIgnore;
  var RSocketFrame_21 = RSocketFrame.isMetadata;
  var RSocketFrame_22 = RSocketFrame.isComplete;
  var RSocketFrame_23 = RSocketFrame.isNext;
  var RSocketFrame_24 = RSocketFrame.isRespond;
  var RSocketFrame_25 = RSocketFrame.isResumeEnable;
  var RSocketFrame_26 = RSocketFrame.isLease;
  var RSocketFrame_27 = RSocketFrame.isResumePositionFrameType;
  var RSocketFrame_28 = RSocketFrame.getFrameTypeName;
  var RSocketFrame_29 = RSocketFrame.createErrorFromFrame;
  var RSocketFrame_30 = RSocketFrame.getErrorCodeExplanation;
  var RSocketFrame_31 = RSocketFrame.printFrame;

  var LiteBuffer_1 = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    exports.Buffer = Buffer;
    var K_MAX_LENGTH = 0x7fffffff;

    function createBuffer(length) {
      if (length > K_MAX_LENGTH) {
        throw new RangeError('The value "' + length + '" is invalid for option "size"');
      } // Return an augmented `Uint8Array` instance


      var buf = new Uint8Array(length); // $FlowFixMe

      buf.__proto__ = Buffer.prototype;
      return buf;
    }

    var bufferExists = typeof commonjsGlobal !== 'undefined' && commonjsGlobal.hasOwnProperty('Buffer'); // export const LiteBuffer =  bufferExists ? gloval.Buffer : Buffer;

    var LiteBuffer = exports.LiteBuffer = bufferExists ? commonjsGlobal.Buffer : Buffer;

    function Buffer(arg, encodingOrOffset, length) {
      // Common case.
      if (typeof arg === 'number') {
        if (typeof encodingOrOffset === 'string') {
          throw new TypeError('The "string" argument must be of type string. Received type number');
        }

        return allocUnsafe(arg);
      }

      return from(arg, encodingOrOffset, length);
    }

    function from(value, encodingOrOffset, length) {
      if (ArrayBuffer.isView(value)) {
        return fromArrayLike(value);
      }

      if (value == null) {
        throw TypeError('The first argument must be one of type, Buffer, ArrayBuffer, Array, ' + 'or Array-like Object. Received type ' + _typeof(value));
      }

      if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
        return fromArrayBuffer(value, encodingOrOffset, length);
      }

      if (typeof value === 'number') {
        throw new TypeError('The "value" argument must not be of type number. Received type number');
      }

      var valueOf = value.valueOf && value.valueOf();

      if (valueOf != null && valueOf !== value) {
        return Buffer.from(valueOf, encodingOrOffset, length);
      }

      var b = fromObject(value);

      if (b) {
        return b;
      }

      throw new TypeError('The first argument must be one of type string, Buffer, ArrayBuffer, ' + 'Array, or Array-like Object. Received type ' + _typeof(value));
    }

    Buffer.from = function (value, encodingOrOffset, length) {
      return from(value, encodingOrOffset, length);
    }; // $FlowFixMe


    Buffer.prototype.__proto__ = Uint8Array.prototype; // $FlowFixMe

    Buffer.__proto__ = Uint8Array;

    function assertSize(size) {
      if (typeof size !== 'number') {
        throw new TypeError('"size" argument must be of type number');
      } else if (size < 0) {
        throw new RangeError('The value "' + size + '" is invalid for option "size"');
      }
    }

    function alloc(size, fill, encoding) {
      assertSize(size);
      return createBuffer(size);
    }

    Buffer.alloc = function (size, fill, encoding) {
      return alloc(size);
    };

    function allocUnsafe(size) {
      assertSize(size);
      return createBuffer(size < 0 ? 0 : checked(size) | 0);
    }

    function fromArrayLike(array) {
      var length = array.length < 0 ? 0 : checked(array.length) | 0;
      var buf = createBuffer(length);

      for (var i = 0; i < length; i += 1) {
        buf[i] = array[i] & 255;
      }

      return buf;
    }

    function fromArrayBuffer(array, byteOffset, length) {
      var buf;

      if (byteOffset === undefined && length === undefined) {
        buf = new Uint8Array(array);
      } else if (length === undefined) {
        buf = new Uint8Array(array, byteOffset);
      } else {
        buf = new Uint8Array(array, byteOffset, length);
      } // $FlowFixMe


      buf.__proto__ = Buffer.prototype;
      return buf;
    }

    function fromObject(obj) {
      if (Buffer.isBuffer(obj)) {
        var len = checked(obj.length) | 0;
        var buf = createBuffer(len);

        if (buf.length === 0) {
          return buf;
        }

        obj.copy(buf, 0, 0, len);
        return buf;
      }

      if (obj.length !== undefined) {
        if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
          return createBuffer(0);
        }

        return fromArrayLike(obj);
      }

      if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
        return fromArrayLike(obj.data);
      }
    }

    function checked(length) {
      if (length >= K_MAX_LENGTH) {
        throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes');
      }

      return length | 0;
    }

    Buffer.isBuffer = function isBuffer(b) {
      return b != null && b._isBuffer === true && b !== Buffer.prototype;
    };

    Buffer.isEncoding = function isEncoding(encoding) {
      switch (String(encoding).toLowerCase()) {
        case 'hex':
        case 'utf8':
        case 'utf-8':
        case 'ascii':
        case 'latin1':
        case 'binary':
        case 'base64':
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return true;

        default:
          return false;
      }
    };

    Buffer.prototype._isBuffer = true;

    Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
      return this.indexOf(val, byteOffset, encoding) !== -1;
    };

    function blitBuffer(src, dst, offset, length) {
      var i = 0;

      for (; i < length; ++i) {
        if (i + offset >= dst.length || i >= src.length) break;
        dst[i + offset] = src[i];
      }

      return i;
    }

    function utf8Write(buf, input, offset, length) {
      return blitBuffer(utf8ToBytes(input, buf.length - offset), buf, offset, length);
    }

    Buffer.prototype.write = function write(input, offset, length, encoding) {
      switch (encoding) {
        case 'utf8':
          return utf8Write(this, input, offset, length);

        default:
          throw new TypeError('Unknown encoding: ' + encoding);
      }
    };

    var MAX_ARGUMENTS_LENGTH = 0x1000;

    function decodeCodePointsArray(codePoints) {
      var len = codePoints.length;

      if (len <= MAX_ARGUMENTS_LENGTH) {
        return String.fromCharCode.apply(String, codePoints); // avoid extra slice()
      } // Decode in chunks to avoid "call stack size exceeded".


      var res = '';
      var i = 0;

      while (i < len) {
        res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
      }

      return res;
    }

    Buffer.prototype.slice = function slice(start, end) {
      var len = this.length;
      start = ~~start;
      end = end === undefined ? len : ~~end;

      if (start < 0) {
        start += len;
        if (start < 0) start = 0;
      } else if (start > len) {
        start = len;
      }

      if (end < 0) {
        end += len;
        if (end < 0) end = 0;
      } else if (end > len) {
        end = len;
      }

      if (end < start) end = start;
      var newBuf = this.subarray(start, end); // Return an augmented `Uint8Array` instance

      newBuf.__proto__ = Buffer.prototype;
      return newBuf;
    };

    function checkOffset(offset, ext, length) {
      if (offset % 1 !== 0 || offset < 0) throw new RangeError('offset is not uint');
      if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length');
    }

    Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 1, this.length);
      return this[offset];
    };

    Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      return this[offset] << 8 | this[offset + 1];
    };

    Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return this[offset] * 0x1000000 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
    };

    Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 1, this.length);
      if (!(this[offset] & 0x80)) return this[offset];
      return (0xff - this[offset] + 1) * -1;
    };

    Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      var val = this[offset + 1] | this[offset] << 8;
      return val & 0x8000 ? val | 0xffff0000 : val;
    };

    Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
    };

    function checkInt(buf, value, offset, ext, max, min) {
      if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
      if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
      if (offset + ext > buf.length) throw new RangeError('Index out of range');
    }

    Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
      this[offset] = value & 0xff;
      return offset + 1;
    };

    Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
      this[offset] = value >>> 8;
      this[offset + 1] = value & 0xff;
      return offset + 2;
    };

    Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 0xff;
      return offset + 4;
    };

    Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
      this[offset] = value >>> 8;
      this[offset + 1] = value & 0xff;
      return offset + 2;
    };

    Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
      if (value < 0) value = 0xffffffff + value + 1;
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 0xff;
      return offset + 4;
    }; // $FlowFixMe


    Buffer.prototype.toString = function toString() {
      var length = this.length;
      if (length === 0) return '';
      return slowToString.apply(this, arguments);
    };

    function slowToString(encoding, start, end) {
      var loweredCase = false;

      if (start === undefined || start < 0) {
        start = 0;
      }

      if (start > this.length) {
        return '';
      }

      if (end === undefined || end > this.length) {
        end = this.length;
      }

      if (end <= 0) {
        return '';
      } // Force coersion to uint32. This will also coerce falsey/NaN values to 0.


      end >>>= 0;
      start >>>= 0;

      if (end <= start) {
        return '';
      }

      if (!encoding) encoding = 'utf8';

      while (true) {
        switch (encoding) {
          case 'utf8':
          case 'utf-8':
            return utf8Slice(this, start, end);

          default:
            if (loweredCase) throw new TypeError('Unsupported encoding: ' + encoding);
            encoding = (encoding + '').toLowerCase();
            loweredCase = true;
        }
      }
    }

    function utf8ToBytes(str) {
      var pUnits = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Infinity;
      var units = pUnits;
      var codePoint;
      var length = str.length;
      var leadSurrogate = null;
      var bytes = [];

      for (var i = 0; i < length; ++i) {
        codePoint = str.charCodeAt(i); // is surrogate component

        if (codePoint > 0xd7ff && codePoint < 0xe000) {
          // last char was a lead
          if (!leadSurrogate) {
            // no lead yet
            if (codePoint > 0xdbff) {
              // unexpected trail
              if ((units -= 3) > -1) bytes.push(0xef, 0xbf, 0xbd);
              continue;
            } else if (i + 1 === length) {
              // unpaired lead
              if ((units -= 3) > -1) bytes.push(0xef, 0xbf, 0xbd);
              continue;
            } // valid lead


            leadSurrogate = codePoint;
            continue;
          } // 2 leads in a row


          if (codePoint < 0xdc00) {
            if ((units -= 3) > -1) bytes.push(0xef, 0xbf, 0xbd);
            leadSurrogate = codePoint;
            continue;
          } // valid surrogate pair


          codePoint = (leadSurrogate - 0xd800 << 10 | codePoint - 0xdc00) + 0x10000;
        } else if (leadSurrogate) {
          // valid bmp char, but last char was a lead
          if ((units -= 3) > -1) bytes.push(0xef, 0xbf, 0xbd);
        }

        leadSurrogate = null; // encode utf8

        if (codePoint < 0x80) {
          if ((units -= 1) < 0) break;
          bytes.push(codePoint);
        } else if (codePoint < 0x800) {
          if ((units -= 2) < 0) break;
          bytes.push(codePoint >> 0x6 | 0xc0, codePoint & 0x3f | 0x80);
        } else if (codePoint < 0x10000) {
          if ((units -= 3) < 0) break;
          bytes.push(codePoint >> 0xc | 0xe0, codePoint >> 0x6 & 0x3f | 0x80, codePoint & 0x3f | 0x80);
        } else if (codePoint < 0x110000) {
          if ((units -= 4) < 0) break;
          bytes.push(codePoint >> 0x12 | 0xf0, codePoint >> 0xc & 0x3f | 0x80, codePoint >> 0x6 & 0x3f | 0x80, codePoint & 0x3f | 0x80);
        } else {
          throw new Error('Invalid code point');
        }
      }

      return bytes;
    }

    function byteLength(string, encoding) {
      if (Buffer.isBuffer(string)) {
        return string.length;
      }

      if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
        return string.byteLength;
      }

      if (typeof string !== 'string') {
        throw new TypeError('The "string" argument must be one of type string, Buffer, or ' + 'ArrayBuffer. Received type ' + _typeof(string));
      }

      var len = string.length;
      var mustMatch = arguments.length > 2 && arguments[2] === true;
      if (!mustMatch && len === 0) return 0; // Use a for loop to avoid recursion

      var loweredCase = false;

      for (;;) {
        switch (encoding) {
          case 'utf8':
          case 'utf-8':
            return utf8ToBytes(string).length;

          default:
            if (loweredCase) {
              return mustMatch ? -1 : utf8ToBytes(string).length; // assume utf8
            }

            encoding = ('' + encoding).toLowerCase();
            loweredCase = true;
        }
      }

      throw new Error('Unexpected path in function');
    }

    Buffer.byteLength = byteLength;

    function utf8Slice(buf, start, end) {
      end = Math.min(buf.length, end);
      var res = [];
      var i = start;

      while (i < end) {
        var firstByte = buf[i];
        var codePoint = null;
        var bytesPerSequence = firstByte > 0xef ? 4 : firstByte > 0xdf ? 3 : firstByte > 0xbf ? 2 : 1;

        if (i + bytesPerSequence <= end) {
          var secondByte = void 0,
              thirdByte = void 0,
              fourthByte = void 0,
              tempCodePoint = void 0;

          switch (bytesPerSequence) {
            case 1:
              if (firstByte < 0x80) {
                codePoint = firstByte;
              }

              break;

            case 2:
              secondByte = buf[i + 1];

              if ((secondByte & 0xc0) === 0x80) {
                tempCodePoint = (firstByte & 0x1f) << 0x6 | secondByte & 0x3f;

                if (tempCodePoint > 0x7f) {
                  codePoint = tempCodePoint;
                }
              }

              break;

            case 3:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];

              if ((secondByte & 0xc0) === 0x80 && (thirdByte & 0xc0) === 0x80) {
                tempCodePoint = (firstByte & 0xf) << 0xc | (secondByte & 0x3f) << 0x6 | thirdByte & 0x3f;

                if (tempCodePoint > 0x7ff && (tempCodePoint < 0xd800 || tempCodePoint > 0xdfff)) {
                  codePoint = tempCodePoint;
                }
              }

              break;

            case 4:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              fourthByte = buf[i + 3];

              if ((secondByte & 0xc0) === 0x80 && (thirdByte & 0xc0) === 0x80 && (fourthByte & 0xc0) === 0x80) {
                tempCodePoint = (firstByte & 0xf) << 0x12 | (secondByte & 0x3f) << 0xc | (thirdByte & 0x3f) << 0x6 | fourthByte & 0x3f;

                if (tempCodePoint > 0xffff && tempCodePoint < 0x110000) {
                  codePoint = tempCodePoint;
                }
              }

          }
        }

        if (codePoint === null) {
          // we did not generate a valid codePoint so insert a
          // replacement char (U+FFFD) and advance only 1 byte
          codePoint = 0xfffd;
          bytesPerSequence = 1;
        } else if (codePoint > 0xffff) {
          // encode to utf16 (surrogate pair dance)
          codePoint -= 0x10000;
          res.push(codePoint >>> 10 & 0x3ff | 0xd800);
          codePoint = 0xdc00 | codePoint & 0x3ff;
        }

        res.push(codePoint);
        i += bytesPerSequence;
      }

      return decodeCodePointsArray(res);
    } // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)


    Buffer.prototype.copy = function copy(target, targetStart, start, end) {
      if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer');
      if (!start) start = 0;
      if (!end && end !== 0) end = this.length;
      if (targetStart >= target.length) targetStart = target.length;
      if (!targetStart) targetStart = 0;
      if (end > 0 && end < start) end = start; // Copy 0 bytes; we're done

      if (end === start) return 0;
      if (target.length === 0 || this.length === 0) return 0; // Fatal error conditions

      if (targetStart < 0) {
        throw new RangeError('targetStart out of bounds');
      }

      if (start < 0 || start >= this.length) throw new RangeError('Index out of range');
      if (end < 0) throw new RangeError('sourceEnd out of bounds'); // Are we oob?

      if (end > this.length) end = this.length;

      if (target.length - targetStart < end - start) {
        end = target.length - targetStart + start;
      }

      var len = end - start;

      if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
        // Use built-in when available, missing from IE11
        this.copyWithin(targetStart, start, end);
      } else if (this === target && start < targetStart && targetStart < end) {
        // descending copy from end
        for (var i = len - 1; i >= 0; --i) {
          target[i + targetStart] = this[i + start];
        }
      } else {
        Uint8Array.prototype.set.call(target, this.subarray(start, end), targetStart);
      }

      return len;
    };

    function isInstance(obj, type) {
      return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
    }

    function numberIsNaN(obj) {
      // For IE11 support
      return obj !== obj; // eslint-disable-line no-self-compare
    }
  });
  unwrapExports(LiteBuffer_1);
  var LiteBuffer_2 = LiteBuffer_1.Buffer;
  var LiteBuffer_3 = LiteBuffer_1.LiteBuffer;

  var RSocketSerialization = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    exports.IdentitySerializers = exports.IdentitySerializer = exports.JsonSerializers = exports.JsonSerializer = undefined;

    var _invariant2 = _interopRequireDefault(invariant_1);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        "default": obj
      };
    } // JSON serializer

    /**
     * A Serializer transforms data between the application encoding used in
     * Payloads and the Encodable type accepted by the transport client.
     */


    var JsonSerializer = exports.JsonSerializer = {
      deserialize: function deserialize(data) {
        var str;

        if (data == null) {
          return null;
        } else if (typeof data === 'string') {
          str = data;
        } else if (LiteBuffer_1.LiteBuffer.isBuffer(data)) {
          var buffer = data;
          str = buffer.toString('utf8');
        } else {
          var _buffer = LiteBuffer_1.LiteBuffer.from(data);

          str = _buffer.toString('utf8');
        }

        return JSON.parse(str);
      },
      serialize: JSON.stringify
    };
    var JsonSerializers = exports.JsonSerializers = {
      data: JsonSerializer,
      metadata: JsonSerializer
    }; // Pass-through serializer

    var IdentitySerializer = exports.IdentitySerializer = {
      deserialize: function deserialize(data) {
        (0, _invariant2["default"])(data == null || typeof data === 'string' || LiteBuffer_1.LiteBuffer.isBuffer(data) || data instanceof Uint8Array, 'RSocketSerialization: Expected data to be a string, Buffer, or ' + 'Uint8Array. Got `%s`.', data);
        return data;
      },
      serialize: function serialize(data) {
        return data;
      }
    };
    var IdentitySerializers = exports.IdentitySerializers = {
      data: IdentitySerializer,
      metadata: IdentitySerializer
    };
  });
  unwrapExports(RSocketSerialization);
  var RSocketSerialization_1 = RSocketSerialization.IdentitySerializers;
  var RSocketSerialization_2 = RSocketSerialization.IdentitySerializer;
  var RSocketSerialization_3 = RSocketSerialization.JsonSerializers;
  var RSocketSerialization_4 = RSocketSerialization.JsonSerializer;

  var RSocketLease = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    exports.ResponderLeaseHandler = exports.RequesterLeaseHandler = exports.Leases = exports.Lease = undefined;

    var _invariant2 = _interopRequireDefault(invariant_1);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        "default": obj
      };
    }

    var Lease =
    /*#__PURE__*/
    function () {
      function Lease(timeToLiveMillis, allowedRequests, metadata) {
        _classCallCheck(this, Lease);

        (0, _invariant2["default"])(timeToLiveMillis > 0, 'Lease time-to-live must be positive');
        (0, _invariant2["default"])(allowedRequests > 0, 'Lease allowed requests must be positive');
        this.timeToLiveMillis = timeToLiveMillis;
        this.allowedRequests = allowedRequests;
        this.startingAllowedRequests = allowedRequests;
        this.expiry = Date.now() + timeToLiveMillis;
        this.metadata = metadata;
      }

      _createClass(Lease, [{
        key: "expired",
        value: function expired() {
          return Date.now() > this.expiry;
        }
      }, {
        key: "valid",
        value: function valid() {
          return this.allowedRequests > 0 && !this.expired();
        } // todo hide

      }, {
        key: "_use",
        value: function _use() {
          if (this.expired()) {
            return false;
          }

          var allowed = this.allowedRequests;
          var success = allowed > 0;

          if (success) {
            this.allowedRequests = allowed - 1;
          }

          return success;
        }
      }]);

      return Lease;
    }();

    exports.Lease = Lease;

    var Leases =
    /*#__PURE__*/
    function () {
      function Leases() {
        _classCallCheck(this, Leases);

        this._sender = function () {
          return build.Flowable.never();
        };

        this._receiver = function (leases) {};
      }

      _createClass(Leases, [{
        key: "sender",
        value: function sender(_sender) {
          this._sender = _sender;
          return this;
        }
      }, {
        key: "receiver",
        value: function receiver(_receiver) {
          this._receiver = _receiver;
          return this;
        }
      }, {
        key: "stats",
        value: function stats(_stats) {
          this._stats = _stats;
          return this;
        }
      }]);

      return Leases;
    }();

    exports.Leases = Leases;

    var RequesterLeaseHandler =
    /*#__PURE__*/
    function () {
      function RequesterLeaseHandler(leaseReceiver) {
        var _this = this;

        _classCallCheck(this, RequesterLeaseHandler);

        this._requestN = -1;
        leaseReceiver(new build.Flowable(function (subscriber) {
          if (_this._subscriber) {
            subscriber.onError(new Error('only 1 subscriber is allowed'));
            return;
          }

          if (_this.isDisposed()) {
            subscriber.onComplete();
            return;
          }

          _this._subscriber = subscriber;
          subscriber.onSubscribe({
            cancel: function cancel() {
              _this.dispose();
            },
            request: function request(n) {
              if (n <= 0) {
                subscriber.onError(new Error("request demand must be positive: ".concat(n)));
              }

              if (!_this.isDisposed()) {
                var curReqN = _this._requestN;

                _this._onRequestN(curReqN);

                _this._requestN = Math.min(Number.MAX_SAFE_INTEGER, Math.max(0, curReqN) + n);
              }
            }
          });
        }));
      }
      /*negative value means received lease was not signalled due to missing requestN*/


      _createClass(RequesterLeaseHandler, [{
        key: "use",
        value: function use() {
          var l = this._lease;
          return l ? l._use() : false;
        }
      }, {
        key: "errorMessage",
        value: function errorMessage() {
          return _errorMessage(this._lease);
        }
      }, {
        key: "receive",
        value: function receive(frame) {
          if (!this.isDisposed()) {
            var timeToLiveMillis = frame.ttl;
            var requestCount = frame.requestCount;
            var metadata = frame.metadata;

            this._onLease(new Lease(timeToLiveMillis, requestCount, metadata));
          }
        }
      }, {
        key: "availability",
        value: function availability() {
          var l = this._lease;

          if (l && l.valid()) {
            return l.allowedRequests / l.startingAllowedRequests;
          }

          return 0.0;
        }
      }, {
        key: "dispose",
        value: function dispose() {
          if (!this._isDisposed) {
            this._isDisposed = true;
            var s = this._subscriber;

            if (s) {
              s.onComplete();
            }
          }
        }
      }, {
        key: "isDisposed",
        value: function isDisposed() {
          return this._isDisposed;
        }
      }, {
        key: "_onRequestN",
        value: function _onRequestN(requestN) {
          var l = this._lease;
          var s = this._subscriber;

          if (requestN < 0 && l && s) {
            s.onNext(l);
          }
        }
      }, {
        key: "_onLease",
        value: function _onLease(lease) {
          var s = this._subscriber;
          var newReqN = this._requestN - 1;

          if (newReqN >= 0 && s) {
            s.onNext(lease);
          }

          this._requestN = Math.max(-1, newReqN);
          this._lease = lease;
        }
      }]);

      return RequesterLeaseHandler;
    }();

    exports.RequesterLeaseHandler = RequesterLeaseHandler;

    var ResponderLeaseHandler =
    /*#__PURE__*/
    function () {
      function ResponderLeaseHandler(leaseSender, stats, errorConsumer) {
        _classCallCheck(this, ResponderLeaseHandler);

        this._leaseSender = leaseSender;
        this._stats = stats;
        this._errorConsumer = errorConsumer;
      }

      _createClass(ResponderLeaseHandler, [{
        key: "use",
        value: function use() {
          var l = this._lease;
          var success = l ? l._use() : false;

          this._onStatsEvent(success);

          return success;
        }
      }, {
        key: "errorMessage",
        value: function errorMessage() {
          return _errorMessage(this._lease);
        }
      }, {
        key: "send",
        value: function send(_send) {
          var _this2 = this;

          var subscription;

          var _isDisposed;

          this._leaseSender(this._stats).subscribe({
            onComplete: function onComplete() {
              return _this2._onStatsEvent();
            },
            onError: function onError(error) {
              _this2._onStatsEvent();

              var errConsumer = _this2._errorConsumer;

              if (errConsumer) {
                errConsumer(error);
              }
            },
            onNext: function onNext(lease) {
              _this2._lease = lease;

              _send(lease);
            },
            onSubscribe: function onSubscribe(s) {
              if (_isDisposed) {
                s.cancel();
                return;
              }

              s.request(RSocketFrame.MAX_REQUEST_N);
              subscription = s;
            }
          });

          return {
            dispose: function dispose() {
              if (!_isDisposed) {
                _isDisposed = true;

                this._onStatsEvent();

                if (subscription) {
                  subscription.cancel();
                }
              }
            },
            isDisposed: function isDisposed() {
              return _isDisposed;
            }
          };
        }
      }, {
        key: "_onStatsEvent",
        value: function _onStatsEvent(success) {
          var s = this._stats;

          if (s) {
            var event = success === undefined ? 'Terminate' : success ? 'Accept' : 'Reject';
            s.onEvent(event);
          }
        }
      }]);

      return ResponderLeaseHandler;
    }();

    exports.ResponderLeaseHandler = ResponderLeaseHandler;

    function _errorMessage(lease) {
      if (!lease) {
        return 'Lease was not received yet';
      }

      if (lease.valid()) {
        return 'Missing leases';
      } else {
        var isExpired = lease.expired();
        var requests = lease.allowedRequests;
        return "Missing leases. Expired: ".concat(isExpired.toString(), ", allowedRequests: ").concat(requests);
      }
    }
  });
  unwrapExports(RSocketLease);
  var RSocketLease_1 = RSocketLease.ResponderLeaseHandler;
  var RSocketLease_2 = RSocketLease.RequesterLeaseHandler;
  var RSocketLease_3 = RSocketLease.Leases;
  var RSocketLease_4 = RSocketLease.Lease;

  var RSocketMachine = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    exports.createServerMachine = createServerMachine;
    exports.createClientMachine = createClientMachine;

    var _emptyFunction2 = _interopRequireDefault(emptyFunction_1);

    var _invariant2 = _interopRequireDefault(invariant_1);

    var _warning2 = _interopRequireDefault(warning_1);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        "default": obj
      };
    }

    var ResponderWrapper =
    /*#__PURE__*/
    function () {
      function ResponderWrapper(responder) {
        _classCallCheck(this, ResponderWrapper);

        this._responder = responder || {};
      }

      _createClass(ResponderWrapper, [{
        key: "setResponder",
        value: function setResponder(responder) {
          this._responder = responder || {};
        }
      }, {
        key: "fireAndForget",
        value: function fireAndForget(payload) {
          if (this._responder.fireAndForget) {
            try {
              this._responder.fireAndForget(payload);
            } catch (error) {
              console.error('fireAndForget threw an exception', error);
            }
          }
        }
      }, {
        key: "requestResponse",
        value: function requestResponse(payload) {
          var error;

          if (this._responder.requestResponse) {
            try {
              return this._responder.requestResponse(payload);
            } catch (_error) {
              console.error('requestResponse threw an exception', _error);
              error = _error;
            }
          }

          return build.Single.error(error || new Error('not implemented'));
        }
      }, {
        key: "requestStream",
        value: function requestStream(payload) {
          var error;

          if (this._responder.requestStream) {
            try {
              return this._responder.requestStream(payload);
            } catch (_error) {
              console.error('requestStream threw an exception', _error);
              error = _error;
            }
          }

          return build.Flowable.error(error || new Error('not implemented'));
        }
      }, {
        key: "requestChannel",
        value: function requestChannel(payloads) {
          var error;

          if (this._responder.requestChannel) {
            try {
              return this._responder.requestChannel(payloads);
            } catch (_error) {
              console.error('requestChannel threw an exception', _error);
              error = _error;
            }
          }

          return build.Flowable.error(error || new Error('not implemented'));
        }
      }, {
        key: "metadataPush",
        value: function metadataPush(payload) {
          var error;

          if (this._responder.metadataPush) {
            try {
              return this._responder.metadataPush(payload);
            } catch (_error) {
              console.error('metadataPush threw an exception', _error);
              error = _error;
            }
          }

          return build.Single.error(error || new Error('not implemented'));
        }
      }]);

      return ResponderWrapper;
    }();

    function createServerMachine(connection, connectionPublisher, serializers, requesterLeaseHandler, responderLeaseHandler) {
      return new RSocketMachineImpl('SERVER', connection, connectionPublisher, serializers, undefined, requesterLeaseHandler, responderLeaseHandler);
    }

    function createClientMachine(connection, connectionPublisher, serializers, requestHandler, requesterLeaseHandler, responderLeaseHandler) {
      return new RSocketMachineImpl('CLIENT', connection, connectionPublisher, serializers, requestHandler, requesterLeaseHandler, responderLeaseHandler);
    }

    var RSocketMachineImpl =
    /*#__PURE__*/
    function () {
      function RSocketMachineImpl(role, connection, connectionPublisher, serializers, requestHandler, requesterLeaseHandler, responderLeaseHandler) {
        var _this = this;

        _classCallCheck(this, RSocketMachineImpl);

        this._connectionAvailability = 1.0;

        this._handleTransportClose = function () {
          _this._handleError(new Error('RSocket: The connection was closed.'));
        };

        this._handleError = function (error) {
          // Error any open request streams
          _this._receivers.forEach(function (receiver) {
            receiver.onError(error);
          });

          _this._receivers.clear(); // Cancel any active subscriptions


          _this._subscriptions.forEach(function (subscription) {
            subscription.cancel();
          });

          _this._subscriptions.clear();

          _this._connectionAvailability = 0.0;

          _this._dispose(_this._requesterLeaseHandler, _this._responderLeaseSenderDisposable);
        };

        this._handleFrame = function (frame) {
          var streamId = frame.streamId;

          if (streamId === RSocketFrame.CONNECTION_STREAM_ID) {
            _this._handleConnectionFrame(frame);
          } else {
            _this._handleStreamFrame(streamId, frame);
          }
        };

        this._connection = connection;
        this._requesterLeaseHandler = requesterLeaseHandler;
        this._responderLeaseHandler = responderLeaseHandler;
        this._nextStreamId = role === 'CLIENT' ? 1 : 2;
        this._receivers = new Map();
        this._subscriptions = new Map();
        this._serializers = serializers || RSocketSerialization.IdentitySerializers;
        this._requestHandler = new ResponderWrapper(requestHandler); // Subscribe to completion/errors before sending anything

        connectionPublisher({
          onComplete: this._handleTransportClose,
          onError: this._handleError,
          onNext: this._handleFrame,
          onSubscribe: function onSubscribe(subscription) {
            return subscription.request(Number.MAX_SAFE_INTEGER);
          }
        });
        var responderHandler = this._responderLeaseHandler;

        if (responderHandler) {
          this._responderLeaseSenderDisposable = responderHandler.send(this._leaseFrameSender());
        } // Cleanup when the connection closes


        this._connection.connectionStatus().subscribe({
          onNext: function onNext(status) {
            if (status.kind === 'CLOSED') {
              _this._handleTransportClose();
            } else if (status.kind === 'ERROR') {
              _this._handleError(status.error);
            }
          },
          onSubscribe: function onSubscribe(subscription) {
            return subscription.request(Number.MAX_SAFE_INTEGER);
          }
        });
      }

      _createClass(RSocketMachineImpl, [{
        key: "setRequestHandler",
        value: function setRequestHandler(requestHandler) {
          this._requestHandler.setResponder(requestHandler);
        }
      }, {
        key: "close",
        value: function close() {
          this._connection.close();
        }
      }, {
        key: "connectionStatus",
        value: function connectionStatus() {
          return this._connection.connectionStatus();
        }
      }, {
        key: "availability",
        value: function availability() {
          var r = this._requesterLeaseHandler;
          var requesterAvailability = r ? r.availability() : 1.0;
          return Math.min(this._connectionAvailability, requesterAvailability);
        }
      }, {
        key: "fireAndForget",
        value: function fireAndForget(payload) {
          if (this._useLeaseOrError(this._requesterLeaseHandler)) {
            //todo need to signal error to user provided error handler
            return;
          }

          var streamId = this._getNextStreamId(this._receivers);

          var data = this._serializers.data.serialize(payload.data);

          var metadata = this._serializers.metadata.serialize(payload.metadata);

          var frame = {
            data: data,
            flags: payload.metadata !== undefined ? RSocketFrame.FLAGS.METADATA : 0,
            metadata: metadata,
            streamId: streamId,
            type: RSocketFrame.FRAME_TYPES.REQUEST_FNF
          };

          this._connection.sendOne(frame);
        }
      }, {
        key: "requestResponse",
        value: function requestResponse(payload) {
          var _this2 = this;

          var leaseError = this._useLeaseOrError(this._requesterLeaseHandler);

          if (leaseError) {
            return build.Single.error(new Error(leaseError));
          }

          var streamId = this._getNextStreamId(this._receivers);

          return new build.Single(function (subscriber) {
            _this2._receivers.set(streamId, {
              onComplete: _emptyFunction2["default"],
              onError: function onError(error) {
                return subscriber.onError(error);
              },
              onNext: function onNext(data) {
                return subscriber.onComplete(data);
              }
            });

            var data = _this2._serializers.data.serialize(payload.data);

            var metadata = _this2._serializers.metadata.serialize(payload.metadata);

            var frame = {
              data: data,
              flags: payload.metadata !== undefined ? RSocketFrame.FLAGS.METADATA : 0,
              metadata: metadata,
              streamId: streamId,
              type: RSocketFrame.FRAME_TYPES.REQUEST_RESPONSE
            };

            _this2._connection.sendOne(frame);

            subscriber.onSubscribe(function () {
              _this2._receivers["delete"](streamId);

              var cancelFrame = {
                flags: 0,
                streamId: streamId,
                type: RSocketFrame.FRAME_TYPES.CANCEL
              };

              _this2._connection.sendOne(cancelFrame);
            });
          });
        }
      }, {
        key: "requestStream",
        value: function requestStream(payload) {
          var _this3 = this;

          var leaseError = this._useLeaseOrError(this._requesterLeaseHandler);

          if (leaseError) {
            return build.Flowable.error(new Error(leaseError));
          }

          var streamId = this._getNextStreamId(this._receivers);

          return new build.Flowable(function (subscriber) {
            _this3._receivers.set(streamId, subscriber);

            var initialized = false;
            subscriber.onSubscribe({
              cancel: function cancel() {
                _this3._receivers["delete"](streamId);

                if (!initialized) {
                  return;
                }

                var cancelFrame = {
                  flags: 0,
                  streamId: streamId,
                  type: RSocketFrame.FRAME_TYPES.CANCEL
                };

                _this3._connection.sendOne(cancelFrame);
              },
              request: function request(n) {
                if (n > RSocketFrame.MAX_REQUEST_N) {
                  n = RSocketFrame.MAX_REQUEST_N;
                }

                if (initialized) {
                  var requestNFrame = {
                    flags: 0,
                    requestN: n,
                    streamId: streamId,
                    type: RSocketFrame.FRAME_TYPES.REQUEST_N
                  };

                  _this3._connection.sendOne(requestNFrame);
                } else {
                  initialized = true;

                  var data = _this3._serializers.data.serialize(payload.data);

                  var metadata = _this3._serializers.metadata.serialize(payload.metadata);

                  var requestStreamFrame = {
                    data: data,
                    flags: payload.metadata !== undefined ? RSocketFrame.FLAGS.METADATA : 0,
                    metadata: metadata,
                    requestN: n,
                    streamId: streamId,
                    type: RSocketFrame.FRAME_TYPES.REQUEST_STREAM
                  };

                  _this3._connection.sendOne(requestStreamFrame);
                }
              }
            });
          }, RSocketFrame.MAX_REQUEST_N);
        }
      }, {
        key: "requestChannel",
        value: function requestChannel(payloads) {
          var _this4 = this;

          var leaseError = this._useLeaseOrError(this._requesterLeaseHandler);

          if (leaseError) {
            return build.Flowable.error(new Error(leaseError));
          }

          var streamId = this._getNextStreamId(this._receivers);

          var payloadsSubscribed = false;
          return new build.Flowable(function (subscriber) {
            try {
              _this4._receivers.set(streamId, subscriber);

              var initialized = false;
              subscriber.onSubscribe({
                cancel: function cancel() {
                  _this4._receivers["delete"](streamId);

                  if (!initialized) {
                    return;
                  }

                  var cancelFrame = {
                    flags: 0,
                    streamId: streamId,
                    type: RSocketFrame.FRAME_TYPES.CANCEL
                  };

                  _this4._connection.sendOne(cancelFrame);
                },
                request: function request(n) {
                  if (n > RSocketFrame.MAX_REQUEST_N) {
                    n = RSocketFrame.MAX_REQUEST_N;
                  }

                  if (initialized) {
                    var requestNFrame = {
                      flags: 0,
                      requestN: n,
                      streamId: streamId,
                      type: RSocketFrame.FRAME_TYPES.REQUEST_N
                    };

                    _this4._connection.sendOne(requestNFrame);
                  } else {
                    if (!payloadsSubscribed) {
                      payloadsSubscribed = true;
                      payloads.subscribe({
                        onComplete: function onComplete() {
                          _this4._sendStreamComplete(streamId);
                        },
                        onError: function onError(error) {
                          _this4._sendStreamError(streamId, error.message);
                        },
                        //Subscriber methods
                        onNext: function onNext(payload) {
                          var data = _this4._serializers.data.serialize(payload.data);

                          var metadata = _this4._serializers.metadata.serialize(payload.metadata);

                          if (!initialized) {
                            initialized = true;
                            var requestChannelFrame = {
                              data: data,
                              flags: payload.metadata !== undefined ? RSocketFrame.FLAGS.METADATA : 0,
                              metadata: metadata,
                              requestN: n,
                              streamId: streamId,
                              type: RSocketFrame.FRAME_TYPES.REQUEST_CHANNEL
                            };

                            _this4._connection.sendOne(requestChannelFrame);
                          } else {
                            var payloadFrame = {
                              data: data,
                              flags: RSocketFrame.FLAGS.NEXT | (payload.metadata !== undefined ? RSocketFrame.FLAGS.METADATA : 0),
                              metadata: metadata,
                              streamId: streamId,
                              type: RSocketFrame.FRAME_TYPES.PAYLOAD
                            };

                            _this4._connection.sendOne(payloadFrame);
                          }
                        },
                        onSubscribe: function onSubscribe(subscription) {
                          _this4._subscriptions.set(streamId, subscription);

                          subscription.request(1);
                        }
                      });
                    } else {
                      (0, _warning2["default"])(false, 'RSocketClient: re-entrant call to request n before initial' + ' channel established.');
                    }
                  }
                }
              });
            } catch (err) {
              console.warn('Exception while subscribing to channel flowable:' + err);
            }
          }, RSocketFrame.MAX_REQUEST_N);
        }
      }, {
        key: "metadataPush",
        value: function metadataPush(payload) {
          // TODO #18065331: implement metadataPush
          throw new Error('metadataPush() is not implemented');
        }
      }, {
        key: "_getNextStreamId",
        value: function _getNextStreamId(streamIds) {
          var streamId = this._nextStreamId;

          do {
            this._nextStreamId = this._nextStreamId + 2 & RSocketFrame.MAX_STREAM_ID;
          } while (this._nextStreamId === 0 || streamIds.has(streamId));

          return streamId;
        }
      }, {
        key: "_useLeaseOrError",
        value: function _useLeaseOrError(leaseHandler) {
          if (leaseHandler) {
            if (!leaseHandler.use()) {
              return leaseHandler.errorMessage();
            }
          }
        }
      }, {
        key: "_leaseFrameSender",
        value: function _leaseFrameSender() {
          var _this5 = this;

          return function (lease) {
            return _this5._connection.sendOne({
              flags: 0,
              metadata: lease.metadata,
              requestCount: lease.allowedRequests,
              streamId: RSocketFrame.CONNECTION_STREAM_ID,
              ttl: lease.timeToLiveMillis,
              type: RSocketFrame.FRAME_TYPES.LEASE
            });
          };
        }
      }, {
        key: "_dispose",
        value: function _dispose() {
          for (var _len = arguments.length, disposables = new Array(_len), _key = 0; _key < _len; _key++) {
            disposables[_key] = arguments[_key];
          }

          disposables.forEach(function (d) {
            if (d) {
              d.dispose();
            }
          });
        }
      }, {
        key: "_isRequest",
        value: function _isRequest(frameType) {
          switch (frameType) {
            case RSocketFrame.FRAME_TYPES.REQUEST_FNF:
            case RSocketFrame.FRAME_TYPES.REQUEST_RESPONSE:
            case RSocketFrame.FRAME_TYPES.REQUEST_STREAM:
            case RSocketFrame.FRAME_TYPES.REQUEST_CHANNEL:
              return true;

            default:
              return false;
          }
        }
        /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    * Handle the connection closing normally: this is an error for any open streams.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    */

        /**
         * Handle the transport connection closing abnormally or a connection-level protocol error.
         */

      }, {
        key: "_handleConnectionError",
        value: function _handleConnectionError(error) {
          this._handleError(error);

          this._connection.close();
        }
        /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              * Handle a frame received from the transport client.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              */

        /**
         * Handle connection frames (stream id === 0).
         */

      }, {
        key: "_handleConnectionFrame",
        value: function _handleConnectionFrame(frame) {
          switch (frame.type) {
            case RSocketFrame.FRAME_TYPES.ERROR:
              var error = (0, RSocketFrame.createErrorFromFrame)(frame);

              this._handleConnectionError(error);

              break;

            case RSocketFrame.FRAME_TYPES.EXT:
              // Extensions are not supported
              break;

            case RSocketFrame.FRAME_TYPES.KEEPALIVE:
              if ((0, RSocketFrame.isRespond)(frame.flags)) {
                this._connection.sendOne(Object.assign({}, frame, {
                  flags: frame.flags ^ RSocketFrame.FLAGS.RESPOND,
                  // eslint-disable-line no-bitwise
                  lastReceivedPosition: 0
                }));
              }

              break;

            case RSocketFrame.FRAME_TYPES.LEASE:
              var r = this._requesterLeaseHandler;

              if (r) {
                r.receive(frame);
              }

              break;

            case RSocketFrame.FRAME_TYPES.METADATA_PUSH:
            case RSocketFrame.FRAME_TYPES.REQUEST_CHANNEL:
            case RSocketFrame.FRAME_TYPES.REQUEST_FNF:
            case RSocketFrame.FRAME_TYPES.REQUEST_RESPONSE:
            case RSocketFrame.FRAME_TYPES.REQUEST_STREAM:
              // TODO #18064706: handle requests from server
              break;

            case RSocketFrame.FRAME_TYPES.RESERVED:
              // No-op
              break;

            case RSocketFrame.FRAME_TYPES.RESUME:
            case RSocketFrame.FRAME_TYPES.RESUME_OK:
              // TODO #18065016: support resumption
              break;
          }
        }
        /**
           * Handle stream-specific frames (stream id !== 0).
           */

      }, {
        key: "_handleStreamFrame",
        value: function _handleStreamFrame(streamId, frame) {
          if (this._isRequest(frame.type)) {
            var leaseError = this._useLeaseOrError(this._responderLeaseHandler);

            if (leaseError) {
              this._sendStreamError(streamId, leaseError);

              return;
            }
          }

          switch (frame.type) {
            case RSocketFrame.FRAME_TYPES.CANCEL:
              this._handleCancel(streamId, frame);

              break;

            case RSocketFrame.FRAME_TYPES.REQUEST_N:
              this._handleRequestN(streamId, frame);

              break;

            case RSocketFrame.FRAME_TYPES.REQUEST_FNF:
              this._handleFireAndForget(streamId, frame);

              break;

            case RSocketFrame.FRAME_TYPES.REQUEST_RESPONSE:
              this._handleRequestResponse(streamId, frame);

              break;

            case RSocketFrame.FRAME_TYPES.REQUEST_STREAM:
              this._handleRequestStream(streamId, frame);

              break;

            case RSocketFrame.FRAME_TYPES.REQUEST_CHANNEL:
              this._handleRequestChannel(streamId, frame);

              break;

            case RSocketFrame.FRAME_TYPES.ERROR:
              var error = (0, RSocketFrame.createErrorFromFrame)(frame);

              this._handleStreamError(streamId, error);

              break;

            case RSocketFrame.FRAME_TYPES.PAYLOAD:
              var receiver = this._receivers.get(streamId);

              if (receiver != null) {
                if ((0, RSocketFrame.isNext)(frame.flags)) {
                  var payload = {
                    data: this._serializers.data.deserialize(frame.data),
                    metadata: this._serializers.metadata.deserialize(frame.metadata)
                  };
                  receiver.onNext(payload);
                }

                if ((0, RSocketFrame.isComplete)(frame.flags)) {
                  this._receivers["delete"](streamId);

                  receiver.onComplete();
                }
              }

              break;
          }
        }
      }, {
        key: "_handleCancel",
        value: function _handleCancel(streamId, frame) {
          var subscription = this._subscriptions.get(streamId);

          if (subscription) {
            subscription.cancel();

            this._subscriptions["delete"](streamId);
          }
        }
      }, {
        key: "_handleRequestN",
        value: function _handleRequestN(streamId, frame) {
          var subscription = this._subscriptions.get(streamId);

          if (subscription) {
            subscription.request(frame.requestN);
          }
        }
      }, {
        key: "_handleFireAndForget",
        value: function _handleFireAndForget(streamId, frame) {
          var payload = this._deserializePayload(frame);

          this._requestHandler.fireAndForget(payload);
        }
      }, {
        key: "_handleRequestResponse",
        value: function _handleRequestResponse(streamId, frame) {
          var _this6 = this;

          var payload = this._deserializePayload(frame);

          this._requestHandler.requestResponse(payload).subscribe({
            onComplete: function onComplete(payload) {
              _this6._sendStreamPayload(streamId, payload, true);
            },
            onError: function onError(error) {
              return _this6._sendStreamError(streamId, error.message);
            },
            onSubscribe: function onSubscribe(cancel) {
              var subscription = {
                cancel: cancel,
                request: _emptyFunction2["default"]
              };

              _this6._subscriptions.set(streamId, subscription);
            }
          });
        }
      }, {
        key: "_handleRequestStream",
        value: function _handleRequestStream(streamId, frame) {
          var _this7 = this;

          var payload = this._deserializePayload(frame);

          this._requestHandler.requestStream(payload).subscribe({
            onComplete: function onComplete() {
              return _this7._sendStreamComplete(streamId);
            },
            onError: function onError(error) {
              return _this7._sendStreamError(streamId, error.message);
            },
            onNext: function onNext(payload) {
              return _this7._sendStreamPayload(streamId, payload);
            },
            onSubscribe: function onSubscribe(subscription) {
              _this7._subscriptions.set(streamId, subscription);

              subscription.request(frame.requestN);
            }
          });
        }
      }, {
        key: "_handleRequestChannel",
        value: function _handleRequestChannel(streamId, frame) {
          var _this8 = this;

          var existingSubscription = this._subscriptions.get(streamId);

          if (existingSubscription) {
            //Likely a duplicate REQUEST_CHANNEL frame, ignore per spec
            return;
          }

          var payloads = new build.Flowable(function (subscriber) {
            var firstRequest = true;
            subscriber.onSubscribe({
              cancel: function cancel() {
                _this8._receivers["delete"](streamId);

                var cancelFrame = {
                  flags: 0,
                  streamId: streamId,
                  type: RSocketFrame.FRAME_TYPES.CANCEL
                };

                _this8._connection.sendOne(cancelFrame);
              },
              request: function request(n) {
                if (n > RSocketFrame.MAX_REQUEST_N) {
                  n = RSocketFrame.MAX_REQUEST_N;
                }

                if (firstRequest) {
                  n--;
                }

                if (n > 0) {
                  var requestNFrame = {
                    flags: 0,
                    requestN: n,
                    streamId: streamId,
                    type: RSocketFrame.FRAME_TYPES.REQUEST_N
                  };

                  _this8._connection.sendOne(requestNFrame);
                } //critically, if n is 0 now, that's okay because we eagerly decremented it


                if (firstRequest && n >= 0) {
                  firstRequest = false; //release the initial frame we received in frame form due to map operator

                  subscriber.onNext(frame);
                }
              }
            });
          }, RSocketFrame.MAX_REQUEST_N);
          var framesToPayloads = new build.FlowableProcessor(payloads, function (frame) {
            return _this8._deserializePayload(frame);
          });

          this._receivers.set(streamId, framesToPayloads);

          this._requestHandler.requestChannel(framesToPayloads).subscribe({
            onComplete: function onComplete() {
              return _this8._sendStreamComplete(streamId);
            },
            onError: function onError(error) {
              return _this8._sendStreamError(streamId, error.message);
            },
            onNext: function onNext(payload) {
              return _this8._sendStreamPayload(streamId, payload);
            },
            onSubscribe: function onSubscribe(subscription) {
              _this8._subscriptions.set(streamId, subscription);

              subscription.request(frame.requestN);
            }
          });
        }
      }, {
        key: "_sendStreamComplete",
        value: function _sendStreamComplete(streamId) {
          this._subscriptions["delete"](streamId);

          this._connection.sendOne({
            data: null,
            flags: RSocketFrame.FLAGS.COMPLETE,
            metadata: null,
            streamId: streamId,
            type: RSocketFrame.FRAME_TYPES.PAYLOAD
          });
        }
      }, {
        key: "_sendStreamError",
        value: function _sendStreamError(streamId, errorMessage) {
          this._subscriptions["delete"](streamId);

          this._connection.sendOne({
            code: RSocketFrame.ERROR_CODES.APPLICATION_ERROR,
            flags: 0,
            message: errorMessage,
            streamId: streamId,
            type: RSocketFrame.FRAME_TYPES.ERROR
          });
        }
      }, {
        key: "_sendStreamPayload",
        value: function _sendStreamPayload(streamId, payload) {
          var complete = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var flags = RSocketFrame.FLAGS.NEXT;

          if (complete) {
            // eslint-disable-next-line no-bitwise
            flags |= RSocketFrame.FLAGS.COMPLETE;

            this._subscriptions["delete"](streamId);
          }

          var data = this._serializers.data.serialize(payload.data);

          var metadata = this._serializers.metadata.serialize(payload.metadata);

          this._connection.sendOne({
            data: data,
            flags: flags,
            metadata: metadata,
            streamId: streamId,
            type: RSocketFrame.FRAME_TYPES.PAYLOAD
          });
        }
      }, {
        key: "_deserializePayload",
        value: function _deserializePayload(frame) {
          return deserializePayload(this._serializers, frame);
        }
        /**
           * Handle an error specific to a stream.
           */

      }, {
        key: "_handleStreamError",
        value: function _handleStreamError(streamId, error) {
          var receiver = this._receivers.get(streamId);

          if (receiver != null) {
            this._receivers["delete"](streamId);

            receiver.onError(error);
          }
        }
      }]);

      return RSocketMachineImpl;
    }();

    function deserializePayload(serializers, frame) {
      return {
        data: serializers.data.deserialize(frame.data),
        metadata: serializers.metadata.deserialize(frame.metadata)
      };
    }
  });
  unwrapExports(RSocketMachine);
  var RSocketMachine_1 = RSocketMachine.createServerMachine;
  var RSocketMachine_2 = RSocketMachine.createClientMachine;

  var RSocketServer_1 = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, '__esModule', {
      value: true
    });

    var _invariant2 = _interopRequireDefault(invariant_1);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        "default": obj
      };
    }
    /**
                                                                                                                                                 * RSocketServer: A server in an RSocket connection that accepts connections
                                                                                                                                                 * from peers via the given transport server.
                                                                                                                                                 */


    var RSocketServer =
    /*#__PURE__*/
    function () {
      function RSocketServer(config) {
        var _this = this;

        _classCallCheck(this, RSocketServer);

        this._handleTransportComplete = function () {
          _this._handleTransportError(new Error('RSocketServer: Connection closed unexpectedly.'));
        };

        this._handleTransportError = function (error) {
          _this._connections.forEach(function (connection) {
            // TODO: Allow passing in error
            connection.close();
          });
        };

        this._handleTransportConnection = function (connection) {
          var swapper = new SubscriberSwapper();
          var subscription;
          connection.receive().subscribe(swapper.swap({
            onError: function onError(error) {
              return console.error(error);
            },
            onNext: function onNext(frame) {
              switch (frame.type) {
                case RSocketFrame.FRAME_TYPES.RESUME:
                  connection.sendOne({
                    code: RSocketFrame.ERROR_CODES.REJECTED_RESUME,
                    flags: 0,
                    message: 'RSocketServer: RESUME not supported.',
                    streamId: RSocketFrame.CONNECTION_STREAM_ID,
                    type: RSocketFrame.FRAME_TYPES.ERROR
                  });
                  connection.close();
                  break;

                case RSocketFrame.FRAME_TYPES.SETUP:
                  if (_this._setupLeaseError(frame)) {
                    connection.sendOne({
                      code: RSocketFrame.ERROR_CODES.INVALID_SETUP,
                      flags: 0,
                      message: 'RSocketServer: LEASE not supported.',
                      streamId: RSocketFrame.CONNECTION_STREAM_ID,
                      type: RSocketFrame.FRAME_TYPES.ERROR
                    });
                    connection.close();
                    break;
                  }

                  var serializers = _this._getSerializers();

                  var requesterLeaseHandler;
                  var responderLeaseHandler;
                  var leasesSupplier = _this._config.leases;

                  if (leasesSupplier) {
                    var lease = leasesSupplier();
                    requesterLeaseHandler = new RSocketLease.RequesterLeaseHandler(lease._receiver);
                    responderLeaseHandler = new RSocketLease.ResponderLeaseHandler(lease._sender, lease._stats);
                  }

                  var serverMachine = (0, RSocketMachine.createServerMachine)(connection, function (subscriber) {
                    swapper.swap(subscriber);
                  }, serializers, requesterLeaseHandler, responderLeaseHandler);

                  try {
                    var requestHandler = _this._config.getRequestHandler(serverMachine, deserializePayload(serializers, frame));

                    serverMachine.setRequestHandler(requestHandler);

                    _this._connections.add(serverMachine);
                  } catch (error) {
                    connection.sendOne({
                      code: RSocketFrame.ERROR_CODES.REJECTED_SETUP,
                      flags: 0,
                      message: 'Application rejected setup, reason: ' + error.message,
                      streamId: RSocketFrame.CONNECTION_STREAM_ID,
                      type: RSocketFrame.FRAME_TYPES.ERROR
                    });
                    connection.close();
                  } // TODO(blom): We should subscribe to connection status
                  // so we can remove the connection when it goes away


                  break;

                default:
                  (0, _invariant2["default"])(false, 'RSocketServer: Expected first frame to be SETUP or RESUME, ' + 'got `%s`.', (0, RSocketFrame.getFrameTypeName)(frame.type));
              }
            },
            onSubscribe: function onSubscribe(_subscription) {
              subscription = _subscription;
              subscription.request(1);
            }
          }));
        };

        this._config = config;
        this._connections = new Set();
        this._started = false;
        this._subscription = null;
      }

      _createClass(RSocketServer, [{
        key: "start",
        value: function start() {
          var _this2 = this;

          (0, _invariant2["default"])(!this._started, 'RSocketServer: Unexpected call to start(), already started.');
          this._started = true;

          this._config.transport.start().subscribe({
            onComplete: this._handleTransportComplete,
            onError: this._handleTransportError,
            onNext: this._handleTransportConnection,
            onSubscribe: function onSubscribe(subscription) {
              _this2._subscription = subscription;
              subscription.request(Number.MAX_SAFE_INTEGER);
            }
          });
        }
      }, {
        key: "stop",
        value: function stop() {
          if (this._subscription) {
            this._subscription.cancel();
          }

          this._config.transport.stop();

          this._handleTransportError(new Error('RSocketServer: Connection terminated via stop().'));
        }
      }, {
        key: "_getSerializers",
        value: function _getSerializers() {
          return this._config.serializers || RSocketSerialization.IdentitySerializers;
        }
      }, {
        key: "_setupLeaseError",
        value: function _setupLeaseError(frame) {
          var clientLeaseEnabled = (frame.flags & RSocketFrame.FLAGS.LEASE) === RSocketFrame.FLAGS.LEASE;
          var serverLeaseEnabled = this._config.leases;
          return clientLeaseEnabled && !serverLeaseEnabled;
        }
      }]);

      return RSocketServer;
    }();

    exports["default"] = RSocketServer;

    var SubscriberSwapper =
    /*#__PURE__*/
    function () {
      function SubscriberSwapper(target) {
        _classCallCheck(this, SubscriberSwapper);

        this._target = target;
      }

      _createClass(SubscriberSwapper, [{
        key: "swap",
        value: function swap(next) {
          this._target = next;

          if (this._subscription) {
            this._target.onSubscribe && this._target.onSubscribe(this._subscription);
          }

          return this;
        }
      }, {
        key: "onComplete",
        value: function onComplete() {
          (0, _invariant2["default"])(this._target, 'must have target');
          this._target.onComplete && this._target.onComplete();
        }
      }, {
        key: "onError",
        value: function onError(error) {
          (0, _invariant2["default"])(this._target, 'must have target');
          this._target.onError && this._target.onError(error);
        }
      }, {
        key: "onNext",
        value: function onNext(value) {
          (0, _invariant2["default"])(this._target, 'must have target');
          this._target.onNext && this._target.onNext(value);
        }
      }, {
        key: "onSubscribe",
        value: function onSubscribe(subscription) {
          (0, _invariant2["default"])(this._target, 'must have target');
          this._subscription = subscription;
          this._target.onSubscribe && this._target.onSubscribe(subscription);
        }
      }]);

      return SubscriberSwapper;
    }();

    function deserializePayload(serializers, frame) {
      return {
        data: serializers.data.deserialize(frame.data),
        metadata: serializers.metadata.deserialize(frame.metadata)
      };
    }
  });
  var RSocketServer = unwrapExports(RSocketServer_1);

  var getSerializers = function getSerializers() {
    return {
      data: {
        deserialize: function deserialize(data) {
          return data;
        },
        serialize: function serialize(data) {
          return data;
        }
      },
      metadata: {
        deserialize: function deserialize(data) {
          return data;
        },
        serialize: function serialize(data) {
          return data;
        }
      }
    };
  };
  var getSetup = function getSetup(setup) {
    return {
      dataMimeType: setup && setup.dataMimeType || 'text/plain',
      keepAlive: setup && setup.keepAlive || 1000000,
      lifetime: setup && setup.lifetime || 1000000,
      metadataMimeType: setup && setup.metadataMimeType || 'text/plain'
    };
  };

  // @ts-ignore
  var createServer = function createServer(_a) {
    var address = _a.address,
        serverProvider = _a.serverProvider,
        serviceCall = _a.serviceCall;
    var factoryOptions = serverProvider.factoryOptions,
        providerFactory = serverProvider.providerFactory;
    var serializers = serverProvider.serializers || getSerializers();
    var server = new RSocketServer({
      getRequestHandler: function getRequestHandler(socket) {
        return {
          requestResponse: function requestResponse(_a) {
            var _b = _a.data,
                data = _b === void 0 ? {} : _b,
                _c = _a.metadata;
            return serviceCall.requestResponse(data);
          },
          requestStream: function requestStream(_a) {
            var _b = _a.data,
                data = _b === void 0 ? {} : _b,
                _c = _a.metadata;
            return serviceCall.requestStream(data);
          }
        };
      },
      serializers: serializers,
      transport: providerFactory({
        address: address,
        factoryOptions: factoryOptions
      })
    });
    server.start();
    return function () {
      try {
        server.stop.bind(server);
      } catch (e) {
        console.error('RSocket unable to close connection ' + e);
      }
    };
  };

  var assert$1 = function assert(predicate, msg) {
    if (!predicate) {
      throw new Error(msg);
    }
  };
  var isDefined$1 = function isDefined(val) {
    return typeof val !== 'undefined';
  };
  var assertDefined$1 = function assertDefined(val) {
    var msg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Expect to be defined';
    assert$1(isDefined$1(val), msg);
  };
  var isString$1 = function isString(val) {
    return typeof val === 'string' || val instanceof String;
  };
  var assertString$1 = function assertString(val) {
    var msg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Expected to be a string';
    assert$1(isDefined$1(val) && isString$1(val), msg);
  };
  var isArray$2 = function isArray(val) {
    return Array.isArray(val);
  };
  var isObject$2 = function isObject(val) {
    return Object.prototype.toString.call(val) === '[object Object]';
  };
  var assertObject$1 = function assertObject(val) {
    var msg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Expected to be an object';
    assert$1(isObject$2(val), msg);
  };
  var assertNonEmptyObject$1 = function assertNonEmptyObject(val) {
    var msg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Expected to be non empty object';
    assertObject$1(val, msg);
    assert$1(Object.keys(val).length > 0, msg);
  };
  var isOneOf$1 = function isOneOf(collection, val) {
    if (isArray$2(collection)) {
      return collection.includes(val);
    }

    if (isObject$2(collection)) {
      return Object.values(collection).includes(val);
    }

    return false;
  };
  var isFunction$2 = function isFunction(val) {
    return typeof val === 'function' && !/^class\s/.test(Function.prototype.toString.call(val));
  };
  var assertFunction$1 = function assertFunction(val) {
    var msg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Expected to be a function';
    assert$1(isFunction$2(val), msg);
  };
  var isNumber$1 = function isNumber(val) {
    return typeof val === 'number' && !isNaN(val);
  };
  var assertNumber$1 = function assertNumber(val) {
    var msg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Expected to be a number';
    assert$1(isNumber$1(val), msg);
  };

  var NOT_VALID_PROTOCOL$1 = 'Not a valid protocol';
  var NOT_VALID_ADDRESS$1 = 'Address must be of type object';
  var NOT_VALID_HOST$1 = 'Not a valid host';
  var NOT_VALID_PATH$1 = 'Not a valid path';
  var NOT_VALID_PORT$1 = 'Not a valid port';

  var validateAddress$1 = function validateAddress(address) {
    var isOptional = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    if (isOptional && typeof address === 'undefined') {
      return true;
    }

    assertNonEmptyObject$1(address, NOT_VALID_ADDRESS$1);
    var host = address.host,
        path = address.path,
        protocol = address.protocol;
    var port = address.port;
    port = isString$1(port) ? Number(port) : port;
    assertString$1(host, NOT_VALID_HOST$1);
    assertString$1(path, NOT_VALID_PATH$1);
    assertNumber$1(port, NOT_VALID_PORT$1);
    assertString$1(protocol, NOT_VALID_PROTOCOL$1);
    assert$1(isOneOf$1(['pm', 'ws', 'wss', 'tcp'], protocol), NOT_VALID_PROTOCOL$1);
    return true;
  };
  /**
   * address is <protocol>://<host>:<port>/<path>
   */

  var getFullAddress$1 = function getFullAddress(address) {
    validateAddress$1(address, false);
    var host = address.host,
        path = address.path,
        port = address.port,
        protocol = address.protocol;
    return "".concat(protocol, "://").concat(host, ":").concat(port, "/").concat(path);
  };
  var getAddress$1 = function getAddress(address) {
    var newAddress = {};
    address = buildAddress$1({
      key: 'protocol',
      optionalValue: 'pm',
      delimiter: '://',
      str: address,
      newAddress: newAddress
    });
    address = buildAddress$1({
      key: 'host',
      optionalValue: 'defaultHost',
      delimiter: ':',
      str: address,
      newAddress: newAddress
    });
    address = buildAddress$1({
      key: 'port',
      optionalValue: 8080,
      delimiter: '/',
      str: address,
      newAddress: newAddress
    });
    newAddress.path = address;
    return newAddress;
  };

  var buildAddress$1 = function buildAddress(_ref) {
    var key = _ref.key,
        optionalValue = _ref.optionalValue,
        delimiter = _ref.delimiter,
        newAddress = _ref.newAddress,
        str = _ref.str;

    var _str$split = str.split(delimiter),
        _str$split2 = _slicedToArray(_str$split, 2),
        v1 = _str$split2[0],
        rest = _str$split2[1];

    if (!rest) {
      rest = v1;
      v1 = optionalValue;
    }

    newAddress[key] = v1;
    return rest;
  };

  var isNodejs$1 = function isNodejs() {
    try {
      // common api for main threat or worker in the browser
      return !navigator;
    } catch (e) {
      return false;
    }
  };

  var workersMap$1 = {};
  var registeredIframes$1 = {};
  var iframes$1 = [];
  /**
   * check from which iframe the event arrived,
   * @param ev
   */

  var registerIframe$1 = function registerIframe(ev) {
    iframes$1.some(function (iframe) {
      if (ev.source === iframe.contentWindow) {
        registeredIframes$1[ev.data.detail.whoAmI || ev.data.detail.origin] = iframe;
      }

      return ev.source === iframe.contentWindow;
    });
  };

  var initialize$1 = function initialize() {
    if (!isNodejs$1()) {
      // @ts-ignore
      if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
        console.warn("Don't use this on webworkers, only on the main thread");
      } else {
        addEventListener('message', function (ev) {
          if (ev && ev.data && !ev.data.workerId) {
            ev.data.type === 'ConnectIframe' && registerIframe$1(ev);
            var detail = ev.data.detail;

            if (detail) {
              ev.data.workerId = 1;
              var propogateTo = workersMap$1[detail.to] || workersMap$1[detail.address]; // discoveryEvents || rsocketEvents

              if (propogateTo) {
                // @ts-ignore
                propogateTo.postMessage(ev.data, ev.ports);
              }

              var iframe = registeredIframes$1[detail.to] || registeredIframes$1[detail.address];

              if (iframe) {
                iframe.contentWindow.postMessage(ev.data, '*', ev.ports);
              }
            }
          }
        });
      }
    }
  };

  function workerEventHandler$1(ev) {
    if (ev.data && ev.data.detail && ev.data.type) {
      var detail = ev.data.detail;

      if (!ev.data.workerId) {
        ev.data.workerId = 1;

        if (ev.data.type === 'ConnectWorkerEvent') {
          if (detail.whoAmI) {
            // @ts-ignore
            workersMap$1[detail.whoAmI] = this;
          }
        } else {
          var propogateTo = workersMap$1[detail.to] || workersMap$1[detail.address]; // discoveryEvents || rsocketEvents

          if (propogateTo) {
            // @ts-ignore
            propogateTo.postMessage(ev.data, ev.ports);
          } else {
            // @ts-ignore
            postMessage(ev.data, '*', ev.ports);
          }
        }
      }
    }
  }

  var addWorker$1 = function addWorker(worker) {
    worker.addEventListener('message', workerEventHandler$1.bind(worker));
  };
  var removeWorker$1 = function removeWorker(worker) {
    worker.removeEventListener('message', workerEventHandler$1.bind(worker));
  };
  var addIframe$1 = function addIframe(iframe) {
    iframes$1.push(iframe);
  };

  var colorsMap$1 = {};

  var getRandomColor$1 = function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';

    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
  };

  var saveToLogs$1 = function saveToLogs(identifier, msg, extra, debug) {
    var type = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'log';

    if (!colorsMap$1[identifier]) {
      colorsMap$1[identifier] = getRandomColor$1();
    } // tslint:disable


    if (debug) {
      var logColor = "color:".concat(colorsMap$1[identifier]);
      extra && console[type]("%c******** address: ".concat(identifier, "********"), logColor);
      console[type](msg);
      extra && Object.keys(extra).forEach(function (key) {
        if (Array.isArray(extra[key])) {
          Object.values(extra[key]).forEach(function (props) {
            console[type]("".concat(key, ": ").concat(JSON.stringify(props.qualifier || props, null, 2)));
          });
        } else {
          console[type]("".concat(key, ": ").concat(JSON.stringify(extra[key], null, 2)));
        }
      });
    } // tslint:enable

  };

  // polyfill MessagePort and MessageChannel
  var MessagePortPolyfill$1 =
  /*#__PURE__*/
  function () {
    function MessagePortPolyfill(whoami) {
      _classCallCheck(this, MessagePortPolyfill);

      this.onmessage = null;
      this.onmessageerror = null;
      this.otherPort = null;
      this.onmessageListeners = [];
      this.queue = [];
      this.otherSideStart = false;
      this.whoami = whoami;
    }

    _createClass(MessagePortPolyfill, [{
      key: "dispatchEvent",
      value: function dispatchEvent(event) {
        if (this.onmessage) {
          this.onmessage(event);
        }

        this.onmessageListeners.forEach(function (listener) {
          return listener(event);
        });
        return true;
      }
    }, {
      key: "postMessage",
      value: function postMessage(message) {
        if (!this.otherPort) {
          return;
        }

        if (this.otherSideStart) {
          this.otherPort.dispatchEvent({
            data: message
          });
        } else {
          this.queue.push(message);
        }
      }
    }, {
      key: "addEventListener",
      value: function addEventListener(type, listener) {
        if (type !== 'message') {
          return;
        }

        if (typeof listener !== 'function' || this.onmessageListeners.indexOf(listener) !== -1) {
          return;
        }

        this.onmessageListeners.push(listener);
      }
    }, {
      key: "removeEventListener",
      value: function removeEventListener(type, listener) {
        if (type !== 'message') {
          return;
        }

        var index = this.onmessageListeners.indexOf(listener);

        if (index === -1) {
          return;
        }

        this.onmessageListeners.splice(index, 1);
      }
    }, {
      key: "start",
      value: function start() {
        var _this = this;

        setTimeout(function () {
          return _this.otherPort && _this.otherPort.startSending.apply(_this.otherPort, []);
        }, 0);
      }
    }, {
      key: "close",
      value: function close() {
        var _this2 = this;

        setTimeout(function () {
          return _this2.otherPort && _this2.otherPort.stopSending.apply(_this2.otherPort, []);
        }, 0);
      }
    }, {
      key: "startSending",
      value: function startSending() {
        var _this3 = this;

        this.otherSideStart = true;
        this.queue.forEach(function (message) {
          return _this3.otherPort && _this3.otherPort.dispatchEvent({
            data: message
          });
        });
      }
    }, {
      key: "stopSending",
      value: function stopSending() {
        this.otherSideStart = false;
        this.queue.length = 0;
      }
    }]);

    return MessagePortPolyfill;
  }(); // tslint:disable-next-line

  var MessageChannelPolyfill$1 = function MessageChannelPolyfill() {
    _classCallCheck(this, MessageChannelPolyfill);

    this.port1 = new MessagePortPolyfill$1('client');
    this.port2 = new MessagePortPolyfill$1('server');
    this.port1.otherPort = this.port2;
    this.port2.otherPort = this.port1;
  };
  var globalObj$1 = typeof window !== 'undefined' && window.Math === Math ? window : typeof self !== 'undefined' && self.Math === Math ? self : Function('return this')();
  function applyMessageChannelPolyfill$1() {
    globalObj$1.MessagePort = MessagePortPolyfill$1;
    globalObj$1.MessageChannel = MessageChannelPolyfill$1;
  }

  if (!globalObj$1.MessagePort || !globalObj$1.MessageChannel) {
    applyMessageChannelPolyfill$1();
  }

  var workers$1 = !isNodejs$1() ? {
    addWorker: addWorker$1,
    removeWorker: removeWorker$1,
    initialize: initialize$1,
    addIframe: addIframe$1
  } : {};

  var validateClientProvider = function validateClientProvider(provider) {
    return validateProvider(provider, 'RsocketClient');
  };
  var validateServerProvider = function validateServerProvider(provider) {
    return validateProvider(provider, 'RsocketServer');
  };
  var validateProvider = function validateProvider(provider, name) {
    assertDefined$1(provider, "Must provide " + name + " provider");
    assertFunction$1(provider, name + " provider invalid, expect a function be receive " + _typeof(provider));
  };

  var SERVER_NOT_IMPL = 'Server provider is not implemented';
  var CLIENT_NOT_IMPL = 'Client provider is not implemented';

  var __assign = undefined && undefined.__assign || function () {
    __assign = Object.assign || function (t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];

        for (var p in s) {
          if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
      }

      return t;
    };

    return __assign.apply(this, arguments);
  }; // @ts-ignore
  var setupServer = function setupServer(configuration) {
    var serverProvider = __assign({
      factoryOptions: null,
      providerFactory: function providerFactory() {
        throw new Error(SERVER_NOT_IMPL);
      }
    }, configuration);

    validateServerProvider(serverProvider.providerFactory);
    return function (options) {
      var localAddress = options.localAddress,
          logger = options.logger,
          serviceCall = options.serviceCall;

      var requestResponse = function requestResponse(message) {
        return new build_2(function (subscriber) {
          subscriber.onSubscribe();
          serviceCall.requestResponse(message).then(function (response) {
            subscriber.onComplete({
              data: response,
              metadata: null
            });
          })["catch"](function (error) {
            logger(error.message, 'warn');
            subscriber.onError({
              message: {
                data: error instanceof Error ? error.message : error,
                metadata: {
                  isErrorFormat: error instanceof Error
                }
              }
            });
          });
        });
      };

      var requestStream = function requestStream(message) {
        return new build_4(function (subscriber) {
          subscriber.onSubscribe();
          serviceCall.requestStream(message).subscribe(function (response) {
            subscriber.onNext({
              data: response,
              metadata: null
            });
          }, function (error) {
            logger(error.message, 'warn');
            subscriber.onError({
              message: {
                data: error instanceof Error ? error.message : error,
                metadata: {
                  isErrorFormat: error instanceof Error
                }
              }
            });
          }, function () {
            return subscriber.onComplete();
          });
        });
      };

      var stopServer = createServer({
        address: localAddress,
        serverProvider: serverProvider,
        serviceCall: {
          requestResponse: requestResponse,
          requestStream: requestStream
        }
      });
      return stopServer;
    };
  };

  var RSocketVersion = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    var MAJOR_VERSION = exports.MAJOR_VERSION = 1;
    var MINOR_VERSION = exports.MINOR_VERSION = 0;
  });
  unwrapExports(RSocketVersion);
  var RSocketVersion_1 = RSocketVersion.MAJOR_VERSION;
  var RSocketVersion_2 = RSocketVersion.MINOR_VERSION;

  var RSocketClient_1 = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, '__esModule', {
      value: true
    });

    var _invariant2 = _interopRequireDefault(invariant_1);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        "default": obj
      };
    }
    /**
                                                                                                                                                 * RSocketClient: A client in an RSocket connection that will communicates with
                                                                                                                                                 * the peer via the given transport client. Provides methods for establishing a
                                                                                                                                                 * connection and initiating the RSocket interactions:
                                                                                                                                                 * - fireAndForget()
                                                                                                                                                 * - requestResponse()
                                                                                                                                                 * - requestStream()
                                                                                                                                                 * - requestChannel()
                                                                                                                                                 * - metadataPush()
                                                                                                                                                 */


    var RSocketClient =
    /*#__PURE__*/
    function () {
      function RSocketClient(config) {
        _classCallCheck(this, RSocketClient);

        this._cancel = null;
        this._config = config;
        this._connection = null;
        this._socket = null;
      }

      _createClass(RSocketClient, [{
        key: "close",
        value: function close() {
          this._config.transport.close();
        }
      }, {
        key: "connect",
        value: function connect() {
          var _this = this;

          (0, _invariant2["default"])(!this._connection, 'RSocketClient: Unexpected call to connect(), already connected.');
          this._connection = new build.Single(function (subscriber) {
            var transport = _this._config.transport;
            var subscription;
            transport.connectionStatus().subscribe({
              onNext: function onNext(status) {
                if (status.kind === 'CONNECTED') {
                  subscription && subscription.cancel();
                  subscriber.onComplete(new RSocketClientSocket(_this._config, transport));
                } else if (status.kind === 'ERROR') {
                  subscription && subscription.cancel();
                  subscriber.onError(status.error);
                } else if (status.kind === 'CLOSED') {
                  subscription && subscription.cancel();
                  subscriber.onError(new Error('RSocketClient: Connection closed.'));
                }
              },
              onSubscribe: function onSubscribe(_subscription) {
                subscriber.onSubscribe(function () {
                  return _subscription.cancel();
                });
                subscription = _subscription;
                subscription.request(Number.MAX_SAFE_INTEGER);
              }
            });
            transport.connect();
          });
          return this._connection;
        }
      }]);

      return RSocketClient;
    }();

    exports["default"] = RSocketClient;
    /**
                                          * @private
                                          */

    var RSocketClientSocket =
    /*#__PURE__*/
    function () {
      function RSocketClientSocket(config, connection) {
        _classCallCheck(this, RSocketClientSocket);

        var requesterLeaseHandler;
        var responderLeaseHandler;
        var leasesSupplier = config.leases;

        if (leasesSupplier) {
          var lease = leasesSupplier();
          requesterLeaseHandler = new RSocketLease.RequesterLeaseHandler(lease._receiver);
          responderLeaseHandler = new RSocketLease.ResponderLeaseHandler(lease._sender, lease._stats);
        }

        this._machine = (0, RSocketMachine.createClientMachine)(connection, function (subscriber) {
          return connection.receive().subscribe(subscriber);
        }, config.serializers, config.responder, requesterLeaseHandler, responderLeaseHandler); // Send SETUP

        connection.sendOne(this._buildSetupFrame(config)); // Send KEEPALIVE frames

        var keepAlive = config.setup.keepAlive;
        var navigator = config.navigator;

        if (keepAlive > 30000 && navigator && navigator.userAgent && (navigator.userAgent.includes('Trident') || navigator.userAgent.includes('Edg'))) {
          console.warn('rsocket-js: Due to a browser bug, Internet Explorer and Edge users may experience WebSocket instability with keepAlive values longer than 30 seconds.');
        }

        var keepAliveFrames = (0, build.every)(keepAlive).map(function () {
          return {
            data: null,
            flags: RSocketFrame.FLAGS.RESPOND,
            lastReceivedPosition: 0,
            streamId: RSocketFrame.CONNECTION_STREAM_ID,
            type: RSocketFrame.FRAME_TYPES.KEEPALIVE
          };
        });
        connection.send(keepAliveFrames);
      }

      _createClass(RSocketClientSocket, [{
        key: "fireAndForget",
        value: function fireAndForget(payload) {
          this._machine.fireAndForget(payload);
        }
      }, {
        key: "requestResponse",
        value: function requestResponse(payload) {
          return this._machine.requestResponse(payload);
        }
      }, {
        key: "requestStream",
        value: function requestStream(payload) {
          return this._machine.requestStream(payload);
        }
      }, {
        key: "requestChannel",
        value: function requestChannel(payloads) {
          return this._machine.requestChannel(payloads);
        }
      }, {
        key: "metadataPush",
        value: function metadataPush(payload) {
          return this._machine.metadataPush(payload);
        }
      }, {
        key: "close",
        value: function close() {
          this._machine.close();
        }
      }, {
        key: "connectionStatus",
        value: function connectionStatus() {
          return this._machine.connectionStatus();
        }
      }, {
        key: "availability",
        value: function availability() {
          return this._machine.availability();
        }
      }, {
        key: "_buildSetupFrame",
        value: function _buildSetupFrame(config) {
          var _config$setup = config.setup,
              dataMimeType = _config$setup.dataMimeType,
              keepAlive = _config$setup.keepAlive,
              lifetime = _config$setup.lifetime,
              metadata = _config$setup.metadata,
              metadataMimeType = _config$setup.metadataMimeType,
              data = _config$setup.data;
          var flags = 0;

          if (metadata !== undefined) {
            flags |= RSocketFrame.FLAGS.METADATA;
          }

          return {
            data: data,
            dataMimeType: dataMimeType,
            flags: flags | (config.leases ? RSocketFrame.FLAGS.LEASE : 0),
            keepAlive: keepAlive,
            lifetime: lifetime,
            majorVersion: RSocketVersion.MAJOR_VERSION,
            metadata: metadata,
            metadataMimeType: metadataMimeType,
            minorVersion: RSocketVersion.MINOR_VERSION,
            resumeToken: null,
            streamId: RSocketFrame.CONNECTION_STREAM_ID,
            type: RSocketFrame.FRAME_TYPES.SETUP
          };
        }
      }]);

      return RSocketClientSocket;
    }();
  });
  var RSocketClient = unwrapExports(RSocketClient_1);

  // @ts-ignore
  var getClientConnection = function getClientConnection(_a) {
    var address = _a.address,
        clientProvider = _a.clientProvider,
        connectionManager = _a.connectionManager;
    var fullAddress = getFullAddress$1(address);
    var connection = connectionManager.getConnection(fullAddress);

    if (!connection) {
      var client_1 = createClient({
        address: address,
        clientProvider: clientProvider
      });
      connection = new Promise(function (resolve, reject) {
        client_1.connect().subscribe({
          onComplete: function onComplete(socket) {
            return resolve(socket);
          },
          onError: function onError(error) {
            return reject(error);
          }
        });
      });
      connectionManager.setConnection(fullAddress, connection);
    }

    return connection;
  };

  var createClient = function createClient(_a) {
    var address = _a.address,
        clientProvider = _a.clientProvider;
    var factoryOptions = clientProvider.factoryOptions,
        providerFactory = clientProvider.providerFactory;
    var serializers = clientProvider.serializers || getSerializers();
    var setup = clientProvider.setup ? getSetup(clientProvider.setup) : getSetup({});
    return new RSocketClient({
      serializers: serializers,
      setup: setup,
      transport: providerFactory({
        address: address,
        factoryOptions: factoryOptions
      })
    });
  };

  var __assign$1 = undefined && undefined.__assign || function () {
    __assign$1 = Object.assign || function (t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];

        for (var p in s) {
          if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
      }

      return t;
    };

    return __assign$1.apply(this, arguments);
  };
  /**
   * createConnectionManager manage all open connection per process
   *
   */


  var createConnectionManager = function createConnectionManager() {
    var openConnections = {};
    return {
      getConnection: function getConnection(connectionAddress) {
        return openConnections[connectionAddress];
      },
      getAllConnections: function getAllConnections() {
        return __assign$1({}, openConnections);
      },
      setConnection: function setConnection(connectionAddress, value) {
        return openConnections[connectionAddress] = value;
      },
      removeConnection: function removeConnection(connectionAddress) {
        return delete openConnections[connectionAddress];
      }
    };
  };

  var __assign$2 = undefined && undefined.__assign || function () {
    __assign$2 = Object.assign || function (t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];

        for (var p in s) {
          if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
      }

      return t;
    };

    return __assign$2.apply(this, arguments);
  };

  var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function (resolve) {
        resolve(value);
      });
    }

    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }

      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }

      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }

      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };

  var __generator = undefined && undefined.__generator || function (thisArg, body) {
    var _ = {
      label: 0,
      sent: function sent() {
        if (t[0] & 1) throw t[1];
        return t[1];
      },
      trys: [],
      ops: []
    },
        f,
        y,
        t,
        g;
    return g = {
      next: verb(0),
      "throw": verb(1),
      "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
      return this;
    }), g;

    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }

    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");

      while (_) {
        try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];

          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;

            case 4:
              _.label++;
              return {
                value: op[1],
                done: false
              };

            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;

            case 7:
              op = _.ops.pop();

              _.trys.pop();

              continue;

            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }

              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }

              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }

              if (t && _.label < t[2]) {
                _.label = t[2];

                _.ops.push(op);

                break;
              }

              if (t[2]) _.ops.pop();

              _.trys.pop();

              continue;
          }

          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      }

      if (op[0] & 5) throw op[1];
      return {
        value: op[0] ? op[1] : void 0,
        done: true
      };
    }
  };
  var setupClient = function setupClient(configuration) {
    var clientProvider = __assign$2({
      factoryOptions: null,
      providerFactory: function providerFactory() {
        throw new Error(CLIENT_NOT_IMPL);
      }
    }, configuration);

    validateClientProvider(clientProvider.providerFactory);
    var connectionManager = createConnectionManager();

    var destroy = function destroy(options) {
      var address = options.address,
          logger = options.logger;
      var connection = connectionManager.getConnection(address);

      if (connection) {
        connection.then(function (socketToClose) {
          try {
            socketToClose.close();
          } catch (e) {
            logger("RSocket unable to close connection " + e, 'warn');
          }

          connectionManager.removeConnection(address);
        });
      }
    };

    return {
      start: function start(options) {
        return __awaiter(void 0, void 0, void 0, function () {
          var remoteAddress, logger, socket;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                remoteAddress = options.remoteAddress, logger = options.logger;
                return [4
                /*yield*/
                , getClientConnection({
                  address: remoteAddress,
                  clientProvider: clientProvider,
                  connectionManager: connectionManager
                })];

              case 1:
                socket = _a.sent();
                return [2
                /*return*/
                , {
                  requestResponse: function requestResponse(message) {
                    return new Promise(function (resolve, reject) {
                      var socketConnect = socket.requestResponse({
                        data: message,
                        metadata: ''
                      });
                      socketConnect.subscribe({
                        onComplete: function onComplete(_a) {
                          var data = _a.data,
                              metadata = _a.metadata;
                          return resolve(data);
                        },
                        onError: function onError(err) {
                          handleErrors({
                            rejectFn: function rejectFn(errMsg) {
                              return reject(errMsg);
                            },
                            err: err,
                            message: message,
                            logger: logger
                          });
                        }
                      });
                    });
                  },
                  requestStream: function requestStream(message) {
                    var socketConnect = socket.requestStream({
                      data: message,
                      metadata: ''
                    });
                    var max = socketConnect._max;
                    return new Observable(function (obs) {
                      socketConnect.subscribe({
                        onNext: function onNext(_a) {
                          var data = _a.data,
                              metadata = _a.metadata;
                          return obs.next(data);
                        },
                        onError: function onError(err) {
                          handleErrors({
                            rejectFn: function rejectFn(errMsg) {
                              return obs.error(errMsg);
                            },
                            err: err,
                            message: message,
                            logger: logger
                          });
                        },
                        onComplete: function onComplete() {
                          return obs.complete();
                        },
                        onSubscribe: function onSubscribe(subscription) {
                          subscription.request(max);
                        }
                      });
                    });
                  }
                }];
            }
          });
        });
      },
      destroy: destroy
    };
  };

  var handleErrors = function handleErrors(_a) {
    var rejectFn = _a.rejectFn,
        err = _a.err,
        logger = _a.logger,
        message = _a.message;

    if (err && err.source && err.source.message) {
      var _b = err.source.message,
          metadata = _b.metadata,
          data = _b.data;
      logger("remoteCall to " + message.qualifier + " with data " + message.data + " error " + data, 'log');
      rejectFn(metadata && metadata.isErrorFormat === true ? new Error(data) : data);
    } else {
      rejectFn(new Error('RemoteCall exception occur.'));
    }
  };

  var ReactiveSocketTypes = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    /** Copyright (c) Facebook, Inc. and its affiliates.
                                                                                 *
                                                                                 * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                 * you may not use this file except in compliance with the License.
                                                                                 * You may obtain a copy of the License at
                                                                                 *
                                                                                 *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                 *
                                                                                 * Unless required by applicable law or agreed to in writing, software
                                                                                 * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                 * See the License for the specific language governing permissions and
                                                                                 * limitations under the License.
                                                                                 *
                                                                                 * 
                                                                                 */

    /**
                                                                                 * Represents a network connection with input/output used by a ReactiveSocket to
                                                                                 * send/receive data.
                                                                                 */

    var CONNECTION_STATUS = exports.CONNECTION_STATUS = {
      CLOSED: Object.freeze({
        kind: 'CLOSED'
      }),
      CONNECTED: Object.freeze({
        kind: 'CONNECTED'
      }),
      CONNECTING: Object.freeze({
        kind: 'CONNECTING'
      }),
      NOT_CONNECTED: Object.freeze({
        kind: 'NOT_CONNECTED'
      })
    };
    /**
                                                                  * Describes the connection status of a ReactiveSocket/DuplexConnection.
                                                                  * - NOT_CONNECTED: no connection established or pending.
                                                                  * - CONNECTING: when `connect()` has been called but a connection is not yet
                                                                  *   established.
                                                                  * - CONNECTED: when a connection is established.
                                                                  * - CLOSED: when the connection has been explicitly closed via `close()`.
                                                                  * - ERROR: when the connection has been closed for any other reason.
                                                                  */

    /**
     * A contract providing different interaction models per the [ReactiveSocket protocol]
     (https://github.com/ReactiveSocket/reactivesocket/blob/master/Protocol.md).
     */

    /**
     * A single unit of data exchanged between the peers of a `ReactiveSocket`.
     */

    /**
                                                                  * A type that can be written to a buffer.
                                                                  */
    // prettier-ignore
    // prettier-ignore
    // prettier-ignore
    // prettier-ignore
    // prettier-ignore
    // prettier-ignore
    // prettier-ignore
    // prettier-ignore
    // prettier-ignore
    // prettier-ignore
    // prettier-ignore
    // prettier-ignore
    // prettier-ignore
    // prettier-ignore
  });
  unwrapExports(ReactiveSocketTypes);
  var ReactiveSocketTypes_1 = ReactiveSocketTypes.CONNECTION_STATUS;



  var ReactiveStreamTypes = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var build$1 = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    Object.keys(ReactiveSocketTypes).forEach(function (key) {
      if (key === 'default' || key === '__esModule') return;
      Object.defineProperty(exports, key, {
        enumerable: true,
        get: function get() {
          return ReactiveSocketTypes[key];
        }
      });
    });
    Object.keys(ReactiveStreamTypes).forEach(function (key) {
      if (key === 'default' || key === '__esModule') return;
      Object.defineProperty(exports, key, {
        enumerable: true,
        get: function get() {
          return ReactiveStreamTypes[key];
        }
      });
    });
  });
  unwrapExports(build$1);

  /**
   *
   *      
   */


  var newMessage = function newMessage(_ref) {
    var type = _ref.type,
        payload = _ref.payload;
    return {
      cid: Date.now() + '-' + Math.random(),
      payload: payload,
      type: type
    };
  }; // $FlowFixMe


  var getMessageData = function getMessageData(_ref2) {
    var data = _ref2.data;
    return data || null;
  };

  var updateListeners = function updateListeners(_ref3) {
    var _ref3$listeners = _ref3.listeners,
        listeners = _ref3$listeners === void 0 ? [] : _ref3$listeners,
        type = _ref3.type,
        func = _ref3.func,
        scope = _ref3.scope;
    return type && func ? [].concat(_toConsumableArray(listeners), [{
      func: func,
      type: type,
      scope: scope
    }]) : _toConsumableArray(listeners);
  };

  var localAddress = [];

  var genericPostMessage = function genericPostMessage(data, transfer) {
    try {
      // $FlowFixMe
      if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
        if (localAddress.indexOf(data.detail.address) > -1) {
          var event = new MessageEvent('message', {
            data: data,
            ports: transfer
          });
          dispatchEvent(event);
        } else {
          // $FlowFixMe
          postMessage(data, transfer);
        }
      } else {
        if (window.self !== window.top) {
          // $FlowFixMe
          window.parent && window.parent.postMessage(data, '*', transfer);
        } else {
          postMessage(data, '*', transfer);
        }
      }
    } catch (e) {
      console.error('Unable to post message ', e);
    }
  };
  /**
   *      
   */

  /**
   * EventsClient implements IChannelClient
   *
   * initiate connection with a server.
   *
   */


  var listeners = [];

  var EventsClient =
  /*#__PURE__*/
  function () {
    function EventsClient(option) {
      _classCallCheck(this, EventsClient);

      this.eventType = option.eventType || 'RsocketEvents';
      this.confirmConnectionOpenCallback = option.confirmConnectionOpenCallback;
      this.debug = option.debug || false;
    }

    _createClass(EventsClient, [{
      key: "connect",
      value: function connect(address) {
        var _this = this;

        var channel = new MessageChannel();

        if (!channel) {
          throw new Error('MessageChannel not supported');
        } // send open message to the server with a port message


        pingServer(this.eventType, channel, address);
        listeners = updateListeners({
          func: initConnection,
          type: 'message',
          scope: 'port'
        }); // start to listen to the port

        startListen(channel, this.confirmConnectionOpenCallback);

        if (channel && channel.port1) {
          var port1 = channel.port1;
          return Object.freeze({
            disconnect: function disconnect() {
              port1.postMessage(newMessage({
                payload: null,
                type: 'close'
              }));
              Array.isArray(listeners) && listeners.forEach(function (_ref4) {
                var type = _ref4.type,
                    func = _ref4.func,
                    scope = _ref4.scope;
                return scope === 'port' ? port1 && port1.removeEventListener(type, func) : // $FlowFixMe
                removeEventListener(type, func);
              });
            },
            receive: function receive(cb) {
              listeners = updateListeners({
                func: responseMessage,
                listeners: listeners,
                type: 'message',
                scope: 'port'
              });
              port1.addEventListener('message', function (eventMsg) {
                return responseMessage(eventMsg, _this.debug, cb);
              });
            },
            send: function send(msg) {
              if (_this.debug) {
                console.log("Client send request with payload: ".concat(JSON.stringify(msg)));
              }

              port1.postMessage(newMessage({
                payload: msg,
                type: 'request'
              }));
            }
          });
        } else {
          throw new Error('Unable to use port message');
        }
      }
    }]);

    return EventsClient;
  }();

  var pingServer = function pingServer(type, channel, address) {
    genericPostMessage({
      detail: {
        address: address,
        type: 'rsocket-events-open-connection'
      },
      type: type
    }, [channel.port2]);
  };

  var startListen = function startListen(channel, confirmConnectionOpenCallback) {
    if (channel && channel.port1) {
      var port1 = channel.port1;
      port1.addEventListener('message', function (eventMsg) {
        return initConnection(eventMsg, channel, confirmConnectionOpenCallback, port1);
      });
      port1.start();
    }
  };

  var initConnection = function initConnection(eventMsg, channel, confirmConnectionOpenCallback, port1) {
    var _getMessageData = getMessageData(eventMsg),
        type = _getMessageData.type;

    switch (type) {
      case 'connect':
        {
          typeof confirmConnectionOpenCallback === 'function' && confirmConnectionOpenCallback();
          break;
        }

      case 'disconnect':
        {
          if (channel) {
            port1 && port1.close();
            Array.isArray(listeners) && listeners.forEach(function (_ref5) {
              var type = _ref5.type,
                  func = _ref5.func,
                  scope = _ref5.scope;
              return scope === 'port' && port1 && port1.removeEventListener(type, func);
            });
            port1 = null;
            channel = null;
          }

          break;
        }
    }
  };

  var responseMessage = function responseMessage(eventMsg, debug, cb) {
    var _getMessageData2 = getMessageData(eventMsg),
        type = _getMessageData2.type,
        payload = _getMessageData2.payload;

    if (type === 'response') {
      if (debug) {
        console.log("Client receive response with payload: ".concat(payload));
      }

      cb(payload);
    }
  };
  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   */

  /**
   * Use invariant() to assert state which your program assumes to be true.
   *
   * Provide sprintf-style format (only %s is supported) and arguments
   * to provide information about what broke and what you were
   * expecting.
   *
   * The invariant message will be stripped in production, but the invariant
   * will remain to ensure logic does not differ in production.
   */


  var validateFormat$1 = function validateFormat(format) {};

  function invariant$1(condition, format, a, b, c, d, e, f) {
    validateFormat$1(format);

    if (!condition) {
      var error;

      if (format === undefined) {
        error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
      } else {
        var args = [a, b, c, d, e, f];
        var argIndex = 0;
        error = new Error(format.replace(/%s/g, function () {
          return args[argIndex++];
        }));
        error.name = 'Invariant Violation';
      }

      error.framesToPop = 1; // we don't care about invariant's own frame

      throw error;
    }
  }

  var invariant_1$1 = invariant$1;
  /**
   * written with <3 by scaleCube-js maintainers
   *
   * RSocketEventsClient Transport provider for event base messages
   * browser <--> browser
   *
   *      
   */

  /**
   * A WebSocket transport client for use in browser environments.
   */

  var RSocketEventsClient =
  /*#__PURE__*/
  function () {
    function RSocketEventsClient(_ref6) {
      var eventClient = _ref6.eventClient,
          address = _ref6.address,
          _ref6$debug = _ref6.debug,
          debug = _ref6$debug === void 0 ? false : _ref6$debug;

      _classCallCheck(this, RSocketEventsClient);

      this._receivers = new Set();
      this._eventsClient = eventClient || new EventsClient({
        confirmConnectionOpenCallback: this.confirmConnectionOpenCallback.bind(this),
        eventType: 'RsocketEvents',
        debug: debug
      });
      this._address = address;
      this._statusSubscribers = new Set();
      this._status = build$1.CONNECTION_STATUS.NOT_CONNECTED;
      this.debug = debug;
    }

    _createClass(RSocketEventsClient, [{
      key: "confirmConnectionOpenCallback",
      value: function confirmConnectionOpenCallback() {
        this._setConnectionStatus(build$1.CONNECTION_STATUS.CONNECTED);
      }
      /**
       * Send a single frame on the connection.
       */

    }, {
      key: "sendOne",
      value: function sendOne(frame) {
        if (!this.connection) {
          return;
        }

        this.connection.send(frame);
      }
      /**
       * Send all the `input` frames on this connection.
       *
       * Notes:
       * - Implementations must not cancel the subscription.
       * - Implementations must signal any errors by calling `onError` on the
       *   `receive()` Publisher.
       */

    }, {
      key: "send",
      value: function send(input) {
        var _this2 = this;

        if (!this.connection) {
          return;
        }

        input.subscribe(function (frame) {
          if (_this2.debug) {
            console.log('RSocketEventsClient send frame: ', frame);
          }

          _this2.connection.send(frame);
        });
      }
      /**
       * Returns a stream of all `Frame`s received on this connection.
       *
       * Notes:
       * - Implementations must call `onComplete` if the underlying connection is
       *   closed by the peer or by calling `close()`.
       * - Implementations must call `onError` if there are any errors
       *   sending/receiving frames.
       * - Implemenations may optionally support multi-cast receivers. Those that do
       *   not should throw if `receive` is called more than once.
       */

    }, {
      key: "receive",
      value: function receive() {
        var _this3 = this;

        return new build.Flowable(function (subject) {
          subject.onSubscribe({
            cancel: function cancel() {
              _this3._receivers["delete"](subject);
            },
            request: function request() {
              _this3._receivers.add(subject);
            }
          });
        });
      }
      /**
       * Close the underlying connection, emitting `onComplete` on the receive()
       * Publisher.
       */

    }, {
      key: "close",
      value: function close(error) {
        if (this._status.kind === 'CLOSED' || this._status.kind === 'ERROR') {
          // already closed
          return;
        }

        var status = error ? {
          error: error,
          kind: 'ERROR'
        } : build$1.CONNECTION_STATUS.CLOSED;

        this._setConnectionStatus(status);

        this._receivers.forEach(function (subscriber) {
          if (error) {
            subscriber.onError(error);
          } else {
            subscriber.onComplete();
          }
        });

        this._receivers.clear();

        this.connection && typeof this.connection.disconnect === 'function' && this.connection.disconnect();
        this._eventsClient = null;
      }
      /**
       * Open the underlying connection. Throws if the connection is already in
       * the CLOSED or ERROR state.
       */

    }, {
      key: "connect",
      value: function connect() {
        var _this4 = this;

        invariant_1$1(this._status.kind === 'NOT_CONNECTED', 'RSocketEventsClient: Cannot connect(), a connection is already ' + 'established.');

        this._setConnectionStatus(build$1.CONNECTION_STATUS.CONNECTING);

        if (this._eventsClient) {
          var _eventsClient = this._eventsClient;

          this._setConnectionStatus(build$1.CONNECTION_STATUS.CONNECTING);

          this.connection = _eventsClient.connect(this._address);
          this.connection.receive(function (frame) {
            if (_this4.debug) {
              console.log('RSocketEventsClient received frame: ', frame);
            }

            frame && _this4._receivers.forEach(function (subscriber) {
              return subscriber.onNext(frame);
            });
          });
        } else {
          console.log('connection is closed');
        }
      }
      /**
       * Returns a Flowable that immediately publishes the current connection
       * status and thereafter updates as it changes. Once a connection is in
       * the CLOSED or ERROR state, it may not be connected again.
       * Implementations must publish values per the comments on ConnectionStatus.
       */

    }, {
      key: "connectionStatus",
      value: function connectionStatus() {
        var _this5 = this;

        return new build.Flowable(function (subscriber) {
          subscriber.onSubscribe({
            cancel: function cancel() {
              _this5._statusSubscribers["delete"](subscriber);
            },
            request: function request() {
              _this5._statusSubscribers.add(subscriber);

              subscriber.onNext(_this5._status);
            }
          });
        });
      }
    }, {
      key: "_setConnectionStatus",
      value: function _setConnectionStatus(status) {
        this._status = status;

        this._statusSubscribers.forEach(function (subscriber) {
          return subscriber.onNext(status);
        });
      }
    }]);

    return RSocketEventsClient;
  }();
  /** Copyright (c) Facebook, Inc. and its affiliates.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *
   *      
   */


  var cjs = RSocketEventsClient;

  var clientFactory = function clientFactory(options) {
    var address = options.address,
        factoryOptions = options.factoryOptions;
    validateAddress$1(address);
    var protocol = address.protocol;

    switch (protocol.toLowerCase()) {
      case 'pm':
        return new cjs({
          address: getFullAddress$1(address)
        });

      default:
        throw Error(NOT_VALID_PROTOCOL$1);
    }
  };

  /**
   *
   *      
   */


  var newMessage$1 = function newMessage(_ref) {
    var type = _ref.type,
        payload = _ref.payload;
    return {
      cid: Date.now() + '-' + Math.random(),
      payload: payload,
      type: type
    };
  }; // $FlowFixMe


  var getMessageData$1 = function getMessageData(_ref2) {
    var data = _ref2.data;
    return data || null;
  };

  var updateListeners$1 = function updateListeners(_ref3) {
    var _ref3$listeners = _ref3.listeners,
        listeners = _ref3$listeners === void 0 ? [] : _ref3$listeners,
        type = _ref3.type,
        func = _ref3.func,
        scope = _ref3.scope;
    return type && func ? [].concat(_toConsumableArray(listeners), [{
      func: func,
      type: type,
      scope: scope
    }]) : _toConsumableArray(listeners);
  };

  var localAddress$1 = [];

  var genericPostMessage$1 = function genericPostMessage(data, transfer) {
    try {
      // $FlowFixMe
      if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
        if (localAddress$1.indexOf(data.detail.address) > -1) {
          var event = new MessageEvent('message', {
            data: data,
            ports: transfer ? transfer : undefined
          });
          dispatchEvent(event);
        } else {
          // $FlowFixMe
          postMessage(data, transfer ? transfer : undefined);
        }
      } else {
        // $FlowFixMe
        postMessage(data, '*', transfer ? transfer : undefined);
      }
    } catch (e) {
      console.error('Unable to post message ', e);
    }
  };
  /**
   *      
   */

  /**
   * EventsClient implements IChannelClient
   *
   * initiate connection with a server.
   *
   */


  var listeners$1 = [];

  var EventsClient$1 =
  /*#__PURE__*/
  function () {
    function EventsClient(option) {
      _classCallCheck(this, EventsClient);

      this.eventType = option.eventType || 'RsocketEvents';
      this.confirmConnectionOpenCallback = option.confirmConnectionOpenCallback;
      this.debug = option.debug || false;
    }

    _createClass(EventsClient, [{
      key: "connect",
      value: function connect(address) {
        var _this = this;

        var channel = new MessageChannel();

        if (!channel) {
          throw new Error('MessageChannel not supported');
        } // send open message to the server with a port message


        pingServer$1(this.eventType, channel, address);
        listeners$1 = updateListeners$1({
          func: initConnection$1,
          type: 'message',
          scope: 'port'
        }); // start to listen to the port

        startListen$1(channel, this.confirmConnectionOpenCallback);

        if (channel && channel.port1) {
          var port1 = channel.port1;
          return Object.freeze({
            disconnect: function disconnect() {
              port1.postMessage(newMessage$1({
                payload: null,
                type: 'close'
              }));
              Array.isArray(listeners$1) && listeners$1.forEach(function (_ref4) {
                var type = _ref4.type,
                    func = _ref4.func,
                    scope = _ref4.scope;
                return scope === 'port' ? port1 && port1.removeEventListener(type, func) : // $FlowFixMe
                removeEventListener(type, func);
              });
            },
            receive: function receive(cb) {
              listeners$1 = updateListeners$1({
                func: responseMessage$1,
                listeners: listeners$1,
                type: 'message',
                scope: 'port'
              });
              port1.addEventListener('message', function (eventMsg) {
                return responseMessage$1(eventMsg, _this.debug, cb);
              });
            },
            send: function send(msg) {
              if (_this.debug) {
                console.log("Client send request with payload: ".concat(JSON.stringify(msg)));
              }

              port1.postMessage(newMessage$1({
                payload: msg,
                type: 'request'
              }));
            }
          });
        } else {
          throw new Error('Unable to use port message');
        }
      }
    }]);

    return EventsClient;
  }();

  var pingServer$1 = function pingServer(type, channel, address) {
    genericPostMessage$1({
      detail: {
        address: address,
        type: 'rsocket-events-open-connection'
      },
      type: type
    }, [channel.port2]);
  };

  var startListen$1 = function startListen(channel, confirmConnectionOpenCallback) {
    if (channel && channel.port1) {
      var port1 = channel.port1;
      port1.addEventListener('message', function (eventMsg) {
        return initConnection$1(eventMsg, channel, confirmConnectionOpenCallback, port1);
      });
      port1.start();
    }
  };

  var initConnection$1 = function initConnection(eventMsg, channel, confirmConnectionOpenCallback, port1) {
    var _getMessageData = getMessageData$1(eventMsg),
        type = _getMessageData.type;

    switch (type) {
      case 'connect':
        {
          typeof confirmConnectionOpenCallback === 'function' && confirmConnectionOpenCallback();
          break;
        }

      case 'disconnect':
        {
          if (channel) {
            port1 && port1.close();
            Array.isArray(listeners$1) && listeners$1.forEach(function (_ref5) {
              var type = _ref5.type,
                  func = _ref5.func,
                  scope = _ref5.scope;
              return scope === 'port' && port1 && port1.removeEventListener(type, func);
            });
            port1 = null;
            channel = null;
          }

          break;
        }
    }
  };

  var responseMessage$1 = function responseMessage(eventMsg, debug, cb) {
    var _getMessageData2 = getMessageData$1(eventMsg),
        type = _getMessageData2.type,
        payload = _getMessageData2.payload;

    if (type === 'response') {
      if (debug) {
        console.log("Client receive response with payload: ".concat(payload));
      }

      cb(payload);
    }
  };
  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   */

  /**
   * Use invariant() to assert state which your program assumes to be true.
   *
   * Provide sprintf-style format (only %s is supported) and arguments
   * to provide information about what broke and what you were
   * expecting.
   *
   * The invariant message will be stripped in production, but the invariant
   * will remain to ensure logic does not differ in production.
   */


  var validateFormat$2 = function validateFormat(format) {};

  function invariant$2(condition, format, a, b, c, d, e, f) {
    validateFormat$2(format);

    if (!condition) {
      var error;

      if (format === undefined) {
        error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
      } else {
        var args = [a, b, c, d, e, f];
        var argIndex = 0;
        error = new Error(format.replace(/%s/g, function () {
          return args[argIndex++];
        }));
        error.name = 'Invariant Violation';
      }

      error.framesToPop = 1; // we don't care about invariant's own frame

      throw error;
    }
  }

  var invariant_1$2 = invariant$2;
  /**
   * written with <3 by scaleCube-js maintainers
   *
   * RSocketEventsClient Transport provider for event base messages
   * browser <--> browser
   *
   *      
   */

  /**
   * A WebSocket transport client for use in browser environments.
   */

  var RSocketEventsClient$1 =
  /*#__PURE__*/
  function () {
    function RSocketEventsClient(_ref6) {
      var eventClient = _ref6.eventClient,
          address = _ref6.address,
          _ref6$debug = _ref6.debug,
          debug = _ref6$debug === void 0 ? false : _ref6$debug;

      _classCallCheck(this, RSocketEventsClient);

      this._receivers = new Set();
      this._eventsClient = eventClient || new EventsClient$1({
        confirmConnectionOpenCallback: this.confirmConnectionOpenCallback.bind(this),
        eventType: 'RsocketEvents',
        debug: debug
      });
      this._address = address;
      this._statusSubscribers = new Set();
      this._status = build$1.CONNECTION_STATUS.NOT_CONNECTED;
      this.debug = debug;
    }

    _createClass(RSocketEventsClient, [{
      key: "confirmConnectionOpenCallback",
      value: function confirmConnectionOpenCallback() {
        this._setConnectionStatus(build$1.CONNECTION_STATUS.CONNECTED);
      }
      /**
       * Send a single frame on the connection.
       */

    }, {
      key: "sendOne",
      value: function sendOne(frame) {
        if (!this.connection) {
          return;
        }

        this.connection.send(frame);
      }
      /**
       * Send all the `input` frames on this connection.
       *
       * Notes:
       * - Implementations must not cancel the subscription.
       * - Implementations must signal any errors by calling `onError` on the
       *   `receive()` Publisher.
       */

    }, {
      key: "send",
      value: function send(input) {
        var _this2 = this;

        if (!this.connection) {
          return;
        }

        input.subscribe(function (frame) {
          if (_this2.debug) {
            console.log('RSocketEventsClient send frame: ', frame);
          }

          _this2.connection.send(frame);
        });
      }
      /**
       * Returns a stream of all `Frame`s received on this connection.
       *
       * Notes:
       * - Implementations must call `onComplete` if the underlying connection is
       *   closed by the peer or by calling `close()`.
       * - Implementations must call `onError` if there are any errors
       *   sending/receiving frames.
       * - Implemenations may optionally support multi-cast receivers. Those that do
       *   not should throw if `receive` is called more than once.
       */

    }, {
      key: "receive",
      value: function receive() {
        var _this3 = this;

        return new build.Flowable(function (subject) {
          subject.onSubscribe({
            cancel: function cancel() {
              _this3._receivers["delete"](subject);
            },
            request: function request() {
              _this3._receivers.add(subject);
            }
          });
        });
      }
      /**
       * Close the underlying connection, emitting `onComplete` on the receive()
       * Publisher.
       */

    }, {
      key: "close",
      value: function close(error) {
        if (this._status.kind === 'CLOSED' || this._status.kind === 'ERROR') {
          // already closed
          return;
        }

        var status = error ? {
          error: error,
          kind: 'ERROR'
        } : build$1.CONNECTION_STATUS.CLOSED;

        this._setConnectionStatus(status);

        this._receivers.forEach(function (subscriber) {
          if (error) {
            subscriber.onError(error);
          } else {
            subscriber.onComplete();
          }
        });

        this._receivers.clear();

        this.connection && typeof this.connection.disconnect === 'function' && this.connection.disconnect();
        this._eventsClient = null;
      }
      /**
       * Open the underlying connection. Throws if the connection is already in
       * the CLOSED or ERROR state.
       */

    }, {
      key: "connect",
      value: function connect() {
        var _this4 = this;

        invariant_1$2(this._status.kind === 'NOT_CONNECTED', 'RSocketEventsClient: Cannot connect(), a connection is already ' + 'established.');

        this._setConnectionStatus(build$1.CONNECTION_STATUS.CONNECTING);

        if (this._eventsClient) {
          var _eventsClient = this._eventsClient;

          this._setConnectionStatus(build$1.CONNECTION_STATUS.CONNECTING);

          this.connection = _eventsClient.connect(this._address);
          this.connection.receive(function (frame) {
            if (_this4.debug) {
              console.log('RSocketEventsClient received frame: ', frame);
            }

            frame && _this4._receivers.forEach(function (subscriber) {
              return subscriber.onNext(frame);
            });
          });
        } else {
          console.log('connection is closed');
        }
      }
      /**
       * Returns a Flowable that immediately publishes the current connection
       * status and thereafter updates as it changes. Once a connection is in
       * the CLOSED or ERROR state, it may not be connected again.
       * Implementations must publish values per the comments on ConnectionStatus.
       */

    }, {
      key: "connectionStatus",
      value: function connectionStatus() {
        var _this5 = this;

        return new build.Flowable(function (subscriber) {
          subscriber.onSubscribe({
            cancel: function cancel() {
              _this5._statusSubscribers["delete"](subscriber);
            },
            request: function request() {
              _this5._statusSubscribers.add(subscriber);

              subscriber.onNext(_this5._status);
            }
          });
        });
      }
    }, {
      key: "_setConnectionStatus",
      value: function _setConnectionStatus(status) {
        this._status = status;

        this._statusSubscribers.forEach(function (subscriber) {
          return subscriber.onNext(status);
        });
      }
    }]);

    return RSocketEventsClient;
  }();
  /** Copyright (c) Facebook, Inc. and its affiliates.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *
   *      
   */


  var cjs$1 = RSocketEventsClient$1;

  function _interopDefault(ex) {
    return ex && _typeof(ex) === 'object' && 'default' in ex ? ex['default'] : ex;
  }

  var RSocketEventsClient$2 = _interopDefault(cjs$1);
  /**
   *
   *      
   */


  var newMessage$2 = function newMessage(_ref) {
    var type = _ref.type,
        payload = _ref.payload;
    return {
      cid: Date.now() + '-' + Math.random(),
      payload: payload,
      type: type
    };
  }; // $FlowFixMe


  var getMessageData$2 = function getMessageData(_ref2) {
    var data = _ref2.data;
    return data || null;
  };

  var updateListeners$2 = function updateListeners(_ref3) {
    var _ref3$listeners = _ref3.listeners,
        listeners = _ref3$listeners === void 0 ? [] : _ref3$listeners,
        type = _ref3.type,
        func = _ref3.func,
        scope = _ref3.scope;
    return type && func ? [].concat(_toConsumableArray(listeners), [{
      func: func,
      type: type,
      scope: scope
    }]) : _toConsumableArray(listeners);
  };

  var localAddress$2 = [];

  var setLocalAddress = function setLocalAddress(address) {
    localAddress$2 = [].concat(_toConsumableArray(localAddress$2), [address]);
    return localAddress$2;
  };
  /**
   *      
   */


  var listeners$2 = [];
  /**
   * EventsServer
   * Waiting for client to initiate connection.
   *
   * successful connection message contain a port message.
   * server will use the port message to return confirmation for the connection.
   */

  var EventsServer =
  /*#__PURE__*/
  function () {
    function EventsServer(option) {
      var _this = this;

      _classCallCheck(this, EventsServer);

      this.eventType = option.eventType || 'RsocketEvents';
      this.address = option.address;
      this.debug = option.debug || false;

      this._getEventData = option.processEvent || function (data) {
        return data.type === _this.eventType ? data.detail : null;
      };

      setLocalAddress(this.address);
      listeners$2 = updateListeners$2({
        func: this._handler,
        listeners: listeners$2,
        type: this.eventType,
        scope: 'global'
      }); // $FlowFixMe

      typeof addEventListener === 'function' && addEventListener('message', this._handler.bind(this)); // eslint-disable-line
    }

    _createClass(EventsServer, [{
      key: "_handler",
      value: function _handler(ev) {
        var _this2 = this;

        var event = this._getEventData(ev.data);

        if (!event || event.address !== this.address || event.type !== 'rsocket-events-open-connection') {
          return;
        }

        if (ev && (Array.isArray(ev.ports) // fix firefox < 52
        || Object.prototype.toString.call(ev.ports) === '[object MessagePortList]')) {
          this._clientChannelPort = ev.ports[0];

          this._clientChannelPort.postMessage({
            type: 'connect'
          });

          listeners$2 = updateListeners$2({
            func: connectionHandler,
            listeners: listeners$2,
            type: 'message',
            scope: 'port'
          });
          this._clientChannelPort && this._clientChannelPort.addEventListener('message', function (ev) {
            return connectionHandler(ev, _this2.onStop.bind(_this2));
          });
          this._clientChannelPort && this._clientChannelPort.start();

          this._onConnection(new ServerChannel({
            clientChannelPort: this._clientChannelPort || new MessagePort(),
            debug: this.debug
          }));
        }
      }
    }, {
      key: "onConnect",
      value: function onConnect(cb) {
        this._onConnection = cb;
      }
    }, {
      key: "onStop",
      value: function onStop() {
        this._clientChannelPort && this._clientChannelPort.postMessage({
          type: 'disconnect'
        });
        this._clientChannelPort && this._clientChannelPort.close();
      }
    }]);

    return EventsServer;
  }();
  /**
   * ServerChannel implements IChannelServer
   *
   * server connection implementation
   */


  var ServerChannel =
  /*#__PURE__*/
  function () {
    function ServerChannel(_ref4) {
      var clientChannelPort = _ref4.clientChannelPort,
          debug = _ref4.debug;

      _classCallCheck(this, ServerChannel);

      this.clientChannelPort = clientChannelPort;
      this.debug = debug || false;
    }

    _createClass(ServerChannel, [{
      key: "connect",
      value: function connect() {
        var _this3 = this;

        return {
          disconnect: function disconnect() {
            _this3.clientChannelPort.postMessage(newMessage$2({
              payload: null,
              type: 'disconnect'
            }));

            listeners$2.forEach(function (_ref5) {
              var func = _ref5.func,
                  type = _ref5.type,
                  scope = _ref5.scope;
              return scope === 'port' ? _this3.clientChannelPort.removeEventListener(type, func) : // $FlowFixMe
              removeEventListener(type, func);
            });
          },
          receive: function receive(cb) {
            listeners$2 = updateListeners$2({
              func: requestMessage,
              listeners: listeners$2,
              type: 'message',
              scope: 'port'
            });

            _this3.clientChannelPort.addEventListener('message', function (eventMsg) {
              return requestMessage(eventMsg, cb, _this3.debug);
            });
          },
          send: function send(msg) {
            if (_this3.debug) {
              console.log("Server responses with payload: ".concat(JSON.stringify(msg)));
            }

            _this3.clientChannelPort.postMessage(newMessage$2({
              payload: msg,
              type: 'response'
            }));
          }
        };
      }
    }]);

    return ServerChannel;
  }();

  var requestMessage = function requestMessage(eventMsg, cb, debug) {
    var _getMessageData = getMessageData$2(eventMsg),
        payload = _getMessageData.payload,
        type = _getMessageData.type;

    if (type === 'request') {
      if (debug) {
        console.log("Server receive request with payload: ".concat(payload));
      }

      cb(payload);
    }
  };

  var connectionHandler = function connectionHandler(ev, onStop) {
    var event = getMessageData$2(ev);

    switch (event.type) {
      case 'close':
        {
          onStop();
        }
    }
  };
  /**
   * written with <3 by scaleCube-js maintainers
   *
   * RSocketEventsServer Transport provider for event base messages
   * browser <--> browser
   *
   *      
   */

  /**
   * A Events transport server.
   */


  var RSocketEventsServer =
  /*#__PURE__*/
  function () {
    function RSocketEventsServer(options) {
      _classCallCheck(this, RSocketEventsServer);

      this._subscribers = new Set();
      this.address = options.address;
      this._server = new EventsServer(options);
    }

    _createClass(RSocketEventsServer, [{
      key: "start",
      value: function start() {
        var _this4 = this;

        return new build.Flowable(function (subscriber) {
          subscriber.onSubscribe({
            cancel: function cancel() {
              if (!_this4._server) {
                return;
              }

              _this4._server.onStop();
            },
            request: function request() {
              _this4._server.onConnect(function (eventClient) {
                var eventClientConnection = new RSocketEventsClient$2({
                  address: _this4.address,
                  eventClient: eventClient
                });

                if (eventClientConnection) {
                  _this4._subscribers.add(eventClientConnection);

                  eventClientConnection.connect();
                  subscriber.onNext(eventClientConnection);
                } else {
                  subscriber.onError(new Error("unable to create connection - address: ".concat(_this4.address)));
                }
              });
            }
          });
        });
      }
    }, {
      key: "stop",
      value: function stop() {
        if (!this._subscribers) {
          return;
        }

        this._subscribers.forEach(function (subscriber) {
          return subscriber.close();
        });

        this._subscribers.clear();
      }
    }]);

    return RSocketEventsServer;
  }();
  /** Copyright (c) Facebook, Inc. and its affiliates.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *
   *      
   */


  var cjs$2 = RSocketEventsServer;

  var serverFactory = function serverFactory(options) {
    var address = options.address,
        factoryOptions = options.factoryOptions;
    validateAddress$1(address);
    var protocol = address.protocol;

    switch (protocol.toLowerCase()) {
      case 'pm':
        return new cjs$2({
          address: getFullAddress$1(address)
        });

      default:
        throw Error(NOT_VALID_PROTOCOL$1);
    }
  };

  var serializers = {
    data: {
      deserialize: function deserialize(data) {
        return data;
      },
      serialize: function serialize(data) {
        return data;
      }
    },
    metadata: {
      deserialize: function deserialize(data) {
        return data;
      },
      serialize: function serialize(data) {
        return data;
      }
    }
  };
  var clientProvider = {
    providerFactory: clientFactory,
    serializers: serializers,
    factoryOptions: null
  };
  var serverProvider = {
    providerFactory: serverFactory,
    serializers: serializers,
    factoryOptions: null
  };

  var transport = {
    clientTransport: setupClient(clientProvider),
    serverTransport: setupServer(serverProvider)
  };

  var MEMBERSHIP_EVENT = 'membershipEvent';
  var MEMBERSHIP_EVENT_INIT_SERVER = 'membershipEventInitServer';
  var MEMBERSHIP_EVENT_INIT_CLIENT = 'membershipEventInitClient';
  var MESSAGE = 'message';
  var ADDED = 'ADDED';
  var REMOVED = 'REMOVED';
  var INIT = 'INIT';
  var getMultiInitClientFromServer = function getMultiInitClientFromServer(whoAmI, from) {
    return "PLEASE PAY ATTENTION:\n            ".concat(whoAmI, " received multiple ").concat(MEMBERSHIP_EVENT_INIT_CLIENT, " from ").concat(from, ",        \n            it might happen if the addresses are not unique. and might result with incorrect behavior\n            ");
  };

  var getKeysAsArray = function getKeysAsArray(obj) {
    return obj && Object.keys(obj) || [];
  };
  var localAddress$3 = [];
  var setLocalAddress$1 = function setLocalAddress(address) {
    localAddress$3 = [].concat(_toConsumableArray(localAddress$3), [address]);
    return localAddress$3;
  };
  var genericPostMessage$2 = function genericPostMessage(data, transfer) {
    try {
      // @ts-ignore
      if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
        if (data.detail && data.detail.to && localAddress$3.indexOf(data.detail.to) > -1) {
          var event = new MessageEvent('message', {
            data: data,
            ports: transfer
          });
          dispatchEvent(event);
        } else {
          // @ts-ignore
          postMessage(data, transfer);
        }
      } else {
        if (data.type === 'ConnectWorkerEvent') {
          return;
        }

        if (window.self !== window.top) {
          // @ts-ignore
          window.parent && window.parent.postMessage(data, '*', transfer);
        } else {
          postMessage(data, '*', transfer);
        }
      }
    } catch (e) {
      console.error('Unable to post message ', e);
    }
  };

  var server = function server(options) {
    var _eventHandlers;

    var whoAmI = options.whoAmI,
        itemsToPublish = options.itemsToPublish,
        rSubjectMembers = options.rSubjectMembers,
        membersStatus = options.membersStatus,
        updateConnectedMember = options.updateConnectedMember,
        getMembershipEvent = options.getMembershipEvent,
        port1 = options.port1,
        seed = options.seed,
        debug = options.debug;
    var eventHandlers = (_eventHandlers = {}, _defineProperty(_eventHandlers, "globalEventsHandler".concat(whoAmI), function globalEventsHandler(ev) {
      var _ev$data = ev.data,
          evType = _ev$data.type,
          membershipEvent = _ev$data.detail;

      if (evType === MEMBERSHIP_EVENT) {
        var metadata = membershipEvent.metadata,
            type = membershipEvent.type,
            to = membershipEvent.to,
            from = membershipEvent.from,
            origin = membershipEvent.origin;

        if (origin === whoAmI || from === whoAmI || from === to || to !== whoAmI) {
          return;
        }

        if (membersStatus.membersState[origin]) {
          saveToLogs$1(whoAmI, getMultiInitClientFromServer(whoAmI, origin), {}, debug, 'warn');
          return;
        } // console.log('Server listen to global', { ...membersStatus.membersState },metadata, whoAmI)


        var mPort = ev && ev.ports && ev.ports[0];

        if (!mPort) {
          console.error("".concat(whoAmI, " unable to receive port from ").concat(from));
        }

        mPort.addEventListener(MESSAGE, eventHandlers["portEventsHandler".concat(whoAmI)]);
        mPort.start(); // 1. update seed with the new metadata

        seed && port1.postMessage(getMembershipEvent({
          from: whoAmI,
          to: seed,
          origin: origin,
          metadata: metadata,
          type: ADDED
        })); // 2. response to initiator of the contact with all members data

        mPort.postMessage(getMembershipEvent({
          from: whoAmI,
          to: from,
          origin: whoAmI,
          metadata: Object.assign(Object.assign({}, membersStatus.membersState), _defineProperty({}, whoAmI, itemsToPublish)),
          type: INIT
        })); // 3. update membersState

        membersStatus.membersState = Object.assign(Object.assign({}, membersStatus.membersState), metadata);
        updateConnectedMember({
          metadata: metadata,
          type: ADDED,
          from: from,
          to: to,
          origin: origin
        }); // 4. update ports

        membersStatus.membersPort = Object.assign(Object.assign({}, membersStatus.membersPort), _defineProperty({}, from, mPort));
        rSubjectMembers && rSubjectMembers.next({
          type: type,
          items: metadata[origin],
          from: origin
        });
        saveToLogs$1(whoAmI, "".concat(whoAmI, " server received ").concat(type, " request from ").concat(from), Object.assign({}, membersStatus.membersState), debug);
      }

      if (evType === MEMBERSHIP_EVENT_INIT_SERVER) {
        var _to = membershipEvent.to,
            _origin = membershipEvent.origin;

        if (_to === whoAmI && _to !== _origin) {
          genericPostMessage$2({
            detail: {
              from: whoAmI,
              to: _origin,
              origin: _origin
            },
            type: MEMBERSHIP_EVENT_INIT_CLIENT
          });
        }
      }
    }), _defineProperty(_eventHandlers, "portEventsHandler".concat(whoAmI), function portEventsHandler(ev) {
      var _ev$data2 = ev.data,
          evType = _ev$data2.type,
          membershipEvent = _ev$data2.detail;
      var metadata = membershipEvent.metadata,
          type = membershipEvent.type,
          from = membershipEvent.from,
          to = membershipEvent.to,
          origin = membershipEvent.origin;

      if (origin === whoAmI || from === whoAmI || to !== whoAmI) {
        return;
      } // update seed with the change in members


      seed && port1.postMessage(getMembershipEvent({
        from: whoAmI,
        to: seed,
        origin: origin,
        metadata: metadata,
        type: type
      }));

      switch (type) {
        case INIT:
          break;

        case ADDED:
          membersStatus.membersState = Object.assign(Object.assign({}, membersStatus.membersState), metadata);
          break;

        case REMOVED:
          if (membersStatus.membersState[origin]) {
            delete membersStatus.membersState[origin];
          }

          var mPort = membersStatus.membersPort[origin];

          if (mPort) {
            mPort.postMessage(getMembershipEvent({
              type: REMOVED,
              metadata: {},
              to: from,
              from: to,
              origin: whoAmI
            }));
            membersStatus.membersPort[origin].close();
          }

          break;

        default:
          saveToLogs$1(whoAmI, 'Not supported membership event type', {}, debug, 'warn');
          return;
      }

      rSubjectMembers && rSubjectMembers.next({
        type: type,
        items: metadata[origin],
        from: origin
      });
      updateConnectedMember({
        metadata: metadata,
        type: type === INIT ? ADDED : type,
        from: from,
        to: to,
        origin: origin
      });
      saveToLogs$1(whoAmI, "".concat(whoAmI, " server received ").concat(type, " request from ").concat(from), {
        membersState: Object.assign({}, membersStatus.membersState),
        membersPort: getKeysAsArray(Object.assign({}, membersStatus.membersPort))
      }, debug);
    }), _eventHandlers);

    var notifyMainthreadType = function notifyMainthreadType() {
      // @ts-ignore
      if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
        return 'ConnectWorkerEvent';
      }

      if (window.self !== window.top) {
        return 'ConnectIframe';
      }

      return '';
    };

    return {
      start: function start() {
        addEventListener(MESSAGE, eventHandlers["globalEventsHandler".concat(whoAmI)]);
        genericPostMessage$2({
          detail: {
            whoAmI: whoAmI
          },
          type: notifyMainthreadType()
        });
      },
      stop: function stop() {
        removeEventListener(MESSAGE, eventHandlers["globalEventsHandler".concat(whoAmI)]);
        var membersList = getKeysAsArray(Object.assign({}, membersStatus.membersPort));
        membersList.forEach(function (to) {
          var mPort = membersStatus.membersPort[to];
          mPort && mPort.postMessage(getMembershipEvent({
            to: to,
            from: whoAmI,
            origin: whoAmI,
            metadata: _defineProperty({}, whoAmI, itemsToPublish),
            type: REMOVED
          }));
          mPort.removeEventListener(MESSAGE, eventHandlers["portEventsHandler".concat(whoAmI)]);
          mPort.close();
        });
        return Promise.resolve('');
      }
    };
  };

  var client = function client(options) {
    var _eventHandlers;

    var whoAmI = options.whoAmI,
        membersStatus = options.membersStatus,
        updateConnectedMember = options.updateConnectedMember,
        getMembershipEvent = options.getMembershipEvent,
        itemsToPublish = options.itemsToPublish,
        rSubjectMembers = options.rSubjectMembers,
        port1 = options.port1,
        port2 = options.port2,
        debug = options.debug,
        retry = options.retry,
        seedAddress = options.seedAddress;
    var seed = '';
    var retryTimer = null;
    var countServers = 0;
    var eventHandlers = (_eventHandlers = {}, _defineProperty(_eventHandlers, "globalEventsHandler".concat(whoAmI), function globalEventsHandler(ev) {
      var _ev$data = ev.data,
          evType = _ev$data.type,
          membershipEvent = _ev$data.detail;

      if (evType === MEMBERSHIP_EVENT_INIT_CLIENT) {
        var from = membershipEvent.from,
            origin = membershipEvent.origin;

        if (from === seed && origin && origin === whoAmI) {
          countServers++;

          if (countServers > 1) {
            saveToLogs$1(whoAmI, getMultiInitClientFromServer(whoAmI, from), {}, debug, 'warn');
            return;
          } // @ts-ignore


          port1.addEventListener(MESSAGE, eventHandlers["portEventsHandler".concat(whoAmI)].bind(this));
          port1.start();
          clearInterval(retryTimer);
          removeEventListener(MESSAGE, eventHandlers["globalEventsHandler".concat(whoAmI)]);
          retryTimer = null;
          genericPostMessage$2(getMembershipEvent({
            metadata: _defineProperty({}, whoAmI, itemsToPublish),
            type: INIT,
            to: seed,
            from: whoAmI,
            origin: whoAmI
          }), [port2]);
        }
      }
    }), _defineProperty(_eventHandlers, "portEventsHandler".concat(whoAmI), function portEventsHandler(ev) {
      var _ev$data2 = ev.data,
          evType = _ev$data2.type,
          membershipEvent = _ev$data2.detail;

      if (evType === MEMBERSHIP_EVENT) {
        var metadata = membershipEvent.metadata,
            type = membershipEvent.type,
            from = membershipEvent.from,
            to = membershipEvent.to,
            origin = membershipEvent.origin;

        if (origin === whoAmI || from === whoAmI || from === to) {
          return;
        }

        switch (type) {
          case INIT:
            clearInterval(retryTimer);
            removeEventListener(MESSAGE, eventHandlers["globalEventsHandler".concat(whoAmI)]);
            retryTimer = null;
            membersStatus.membersState = Object.assign(Object.assign({}, membersStatus.membersState), metadata); // @ts-ignore

            this.resolveClusterStart ? this.resolveClusterStart() : console.error('unable to resolve cluster client.');
            break;

          case ADDED:
            membersStatus.membersState = Object.assign(Object.assign({}, membersStatus.membersState), metadata);
            break;

          case REMOVED:
            if (membersStatus.membersState[from]) {
              delete membersStatus.membersState[from];
            }

            break;
        }

        updateConnectedMember({
          metadata: metadata,
          type: type === INIT ? ADDED : type,
          from: from,
          to: to,
          origin: origin
        });
        saveToLogs$1(whoAmI, "".concat(whoAmI, " client received ").concat(type, " request from ").concat(from), Object.assign({}, membersStatus.membersState), debug);
        Object.keys(metadata).forEach(function (member) {
          return rSubjectMembers && rSubjectMembers.next({
            type: type,
            items: metadata[member],
            from: member
          });
        });
      }
    }), _eventHandlers);
    return Object.freeze({
      start: function start() {
        return new Promise(function (resolve, reject) {
          if (!seedAddress) {
            resolve();
          } else {
            seed = getFullAddress$1(seedAddress);

            var ClusterStart = function ClusterStart() {
              return {
                resolveClusterStart: resolve
              };
            };

            addEventListener(MESSAGE, eventHandlers["globalEventsHandler".concat(whoAmI)].bind(ClusterStart()));
            retryTimer = setInterval(function () {
              genericPostMessage$2({
                detail: {
                  origin: whoAmI,
                  to: seed
                },
                type: MEMBERSHIP_EVENT_INIT_SERVER
              });
            }, retry.timeout);
          }
        });
      },
      stop: function stop() {
        updateConnectedMember({
          metadata: _defineProperty({}, whoAmI, itemsToPublish),
          type: REMOVED,
          from: whoAmI,
          to: null,
          origin: whoAmI
        });
        port1.postMessage(getMembershipEvent({
          metadata: _defineProperty({}, whoAmI, itemsToPublish),
          type: REMOVED,
          from: whoAmI,
          to: seed,
          origin: whoAmI
        }));
        removeEventListener(MESSAGE, eventHandlers["globalEventsHandler".concat(whoAmI)]);
        port1.removeEventListener(MESSAGE, eventHandlers["portEventsHandler".concat(whoAmI)]);
        port1.close();
        port2.close();
        saveToLogs$1(whoAmI, "".concat(whoAmI, " close client"), Object.assign({}, membersStatus.membersState), debug);
      }
    });
  };

  var createMember = function createMember(address, membersStatus) {
    var whoAmI = getFullAddress$1(address);
    setLocalAddress$1(whoAmI);
    /**
     * membership event format
     * @param from
     * @param to
     * @param metadata
     * @param origin
     * @param type
     */

    var getMembershipEvent = function getMembershipEvent(_ref) {
      var from = _ref.from,
          to = _ref.to,
          metadata = _ref.metadata,
          origin = _ref.origin,
          type = _ref.type;
      return {
        detail: {
          metadata: metadata,
          type: type,
          from: from,
          origin: origin,
          to: to
        },
        type: MEMBERSHIP_EVENT
      };
    };
    /**
     * loop on all connected members and update them on the change
     * @param type
     * @param metadata
     * @param from
     * @param to
     * @param origin
     */


    var updateConnectedMember = function updateConnectedMember(_ref2) {
      var type = _ref2.type,
          metadata = _ref2.metadata,
          from = _ref2.from,
          to = _ref2.to,
          origin = _ref2.origin;
      var membersPort = membersStatus.membersPort;
      Object.keys(membersPort).forEach(function (nextMember) {
        if (from !== nextMember && whoAmI !== nextMember && origin !== nextMember) {
          var mPort = membersPort[nextMember];
          mPort.postMessage(getMembershipEvent({
            from: whoAmI,
            to: nextMember,
            origin: from,
            metadata: metadata,
            type: type
          }));
        }
      });
    };

    return {
      getMembershipEvent: getMembershipEvent,
      updateConnectedMember: updateConnectedMember,
      whoAmI: whoAmI
    };
  };

  var __awaiter$1 = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function (resolve) {
        resolve(value);
      });
    }

    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }

      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }

      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }

      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var joinCluster = function joinCluster(options) {
    var address = options.address,
        seedAddress = options.seedAddress,
        itemsToPublish = options.itemsToPublish,
        retry = options.retry,
        debug = options.debug;

    var _ref = new MessageChannel(),
        port1 = _ref.port1,
        port2 = _ref.port2;

    var membersStatus = {
      membersPort: {},
      membersState: {}
    };
    var delayedActions = [];
    var isConnected = !seedAddress;
    var rSubjectMembers = new Subject();
    var clientPort;

    var _createMember = createMember(address, membersStatus),
        updateConnectedMember = _createMember.updateConnectedMember,
        getMembershipEvent = _createMember.getMembershipEvent,
        whoAmI = _createMember.whoAmI;

    var serverPort = server({
      whoAmI: whoAmI,
      membersStatus: membersStatus,
      rSubjectMembers: rSubjectMembers,
      itemsToPublish: itemsToPublish,
      updateConnectedMember: updateConnectedMember,
      getMembershipEvent: getMembershipEvent,
      port1: port1,
      seed: seedAddress ? getFullAddress$1(seedAddress) : undefined,
      debug: debug
    });
    serverPort.start();
    clientPort = client({
      whoAmI: whoAmI,
      updateConnectedMember: updateConnectedMember,
      getMembershipEvent: getMembershipEvent,
      membersStatus: membersStatus,
      itemsToPublish: itemsToPublish,
      rSubjectMembers: rSubjectMembers,
      port1: port1,
      port2: port2,
      retry: retry || {
        timeout: 10
      },
      debug: debug,
      seedAddress: seedAddress
    });
    clientPort.start().then(function () {
      isConnected = true;

      if (delayedActions.length > 0) {
        delayedActions.forEach(function (action) {
          return action && action();
        });
      }
    });
    return Object.freeze({
      listen$: function listen$() {
        return rSubjectMembers.asObservable();
      },
      getCurrentMembersData: function getCurrentMembersData() {
        return new Promise(function (resolve, reject) {
          var getMemberStateCluster = function getMemberStateCluster() {
            resolve(Object.assign({}, membersStatus.membersState));
          };

          if (!isConnected) {
            delayedActions.push(getMemberStateCluster);
          } else {
            getMemberStateCluster();
          }
        });
      },
      destroy: function destroy() {
        return new Promise(function (resolve, reject) {
          var destroyCluster = function destroyCluster() {
            return __awaiter$1(void 0, void 0, void 0,
            /*#__PURE__*/
            regeneratorRuntime.mark(function _callee() {
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.prev = 0;
                      _context.next = 3;
                      return serverPort.stop();

                    case 3:
                      _context.t0 = clientPort;

                      if (!_context.t0) {
                        _context.next = 7;
                        break;
                      }

                      _context.next = 7;
                      return clientPort.stop();

                    case 7:
                      _context.next = 12;
                      break;

                    case 9:
                      _context.prev = 9;
                      _context.t1 = _context["catch"](0);
                      saveToLogs$1(whoAmI, "unable to destroy ".concat(whoAmI, ": ").concat(_context.t1), {}, debug, 'warn');

                    case 12:
                      rSubjectMembers.complete();
                      membersStatus.membersPort = {};
                      membersStatus.membersState = {};
                      resolve('');

                    case 16:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee, null, [[0, 9]]);
            }));
          };

          if (!isConnected) {
            delayedActions.push(destroyCluster);
          } else {
            return destroyCluster();
          }
        });
      }
    });
  };

  var retryRouter = function retryRouter(_a) {
    var period = _a.period,
        maxRetry = _a.maxRetry;
    return function (options) {
      var message = options.message,
          lookUp = options.lookUp;
      var qualifier = message.qualifier;
      var retry = 0;
      return new Promise(function (resolve, reject) {
        var checkRegistry = function checkRegistry() {
          var endpoints = lookUp({
            qualifier: qualifier
          });

          if (!(endpoints && Array.isArray(endpoints) && endpoints.length > 0)) {
            if (maxRetry && maxRetry >= retry) {
              retry++;
            }

            if (!maxRetry || maxRetry >= retry) {
              setTimeout(function () {
                checkRegistry();
              }, period);
            } else {
              reject(null);
            }
          } else {
            resolve(endpoints[0]);
          }
        };

        checkRegistry();
      });
    };
  };

  var createMicroservice$1 = function (config) {
      return createMicroservice(_assign({ transport: transport, cluster: joinCluster, defaultRouter: retryRouter({ period: 10, maxRetry: 500 }) }, config));
  };

  exports.ASYNC_MODEL_TYPES = ASYNC_MODEL_TYPES$1;
  exports.createMicroservice = createMicroservice$1;
  exports.stringToAddress = getAddress$1;
  exports.workers = workers$1;

  return exports;

}({}));
