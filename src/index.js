/* global _ctt:true window document require */
/* Some snippets were copy-pasted from Piwik.js */

if (typeof _ctt !== 'object') {
  _ctt = []
}

(function (global, require, window, document) {
  'use strict'
  // ---------------------------------------------------------------------------

  // Constants
  var cookieName = 'CIT-Browser-ID'
  var accountHeaderName = 'account-id'
  var browserHeaderName = 'browser-id'
  var visitorHeaderName = 'visitor-id'
  var referrerHeaderName = 'url'

  // Maximum delay to wait for sending data upon unload event
  var delay = 300

  // CITrap 'class'
  var CITrap = require('ci-trap')

  // Local tracker object
  var tracker = new CITrap(document, 2000)

  // Cookies handler
  var Cookies = require('./cookies.js')
  var cookies = new Cookies(window, document)

  // Helpers
  var uuidV4 = function () {
    function p8 (s) {
      var p = (Math.random().toString(16) + '000000000').substr(2, 8)
      return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p
    }
    return p8() + p8(true) + p8(true) + p8()
  }

  // Browser ID
  var browserID = cookies.getCookie(cookieName) || uuidV4()

  // Session ID
  var sessionID = uuidV4()

  /*
   * apply wrapper
   *
   * @param array parameterArray An array comprising either:
   *      [ 'methodName', optional_parameters ]
   * or:
   *      [ function Object, optional_parameters ]
   */
  function apply () {
    var f
    var parameterArray

    for (var i = 0; i < arguments.length; i += 1) {
      parameterArray = arguments[i]
      f = parameterArray.shift()

      if (typeof f === 'string' || f instanceof String) {
        if (f === 'setAccount') {
          parameterArray.unshift(accountHeaderName)
          tracker.setHeader.apply(tracker, parameterArray)
        } else if (f === 'setVisitor') {
          parameterArray.unshift(visitorHeaderName)
          tracker.setHeader.apply(tracker, parameterArray)
        } else {
          tracker[f].apply(tracker, parameterArray)
        }
      } else {
        f.apply(tracker, parameterArray)
      }
    }
  }

  /*
   * Tracker proxy.
   */
  function Proxy () {
    return {
      push: apply
    }
  }

  // We have to do this _before_ applying our own attributes / methods.
  //
  // Apply the queue
  for (var i2 = 0; i2 < _ctt.length; i2++) {
    if (_ctt[i2]) {
      apply(_ctt[i2])
    }
  }

  // Set current URL (referrer is not mandatory)
  tracker.setHeader(referrerHeaderName, window.location.href)

  // Set browser ID into tracker
  tracker.setHeader(browserHeaderName, browserID)

  // Set session ID
  tracker.setSessionID(sessionID)

  // Set cookie accordingly
  cookies.setCookie(cookieName, browserID)

  // replace initialization array with proxy object
  _ctt = new Proxy()

  /*
   * Handle beforeunload event
   *
   * Subject to Safari's 'Runaway JavaScript Timer' and
   * Chrome V8 extension that terminates JS that exhibits
   * 'slow unload', i.e., calling getTime() > 1000 times
   */
  function beforeUnloadHandler () {
    var now = new Date()
    var expireDateTime = now.getTime() + delay

    tracker.send()

    /*
     * Delay/pause (blocks UI)
     */
    // the things we do for backwards compatibility...
    // in ECMA-262 5th ed., we could simply use:
    // while (Date.now() < expireDateTime) { }
    do {
      now = new Date()
    } while (now.getTime() < expireDateTime)
  }

  window.addEventListener('beforeunload', beforeUnloadHandler, false)

  // last but not least, start it...
  tracker.start({ initialState: true })

  // ---------------------------------------------------------------------------
})(this, require, window, document)
