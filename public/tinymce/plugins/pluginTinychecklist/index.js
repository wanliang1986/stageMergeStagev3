/* eslint no-unused-expressions: 0 */ // --> OFF
/* eslint no-undef: 0 */ // --> OFF

/*!
 * Tiny Checklist plugin
 *
 * Copyright 2010-2021 Tiny Technologies, Inc. All rights reserved.
 *
 * Version: 1.1.0-25
 */
!(function (o) {
  'use strict';

  function O(n) {
    return function () {
      return n;
    };
  }

  function n() {
    return c;
  }

  var e,
    i = O(!1),
    u = O(!0),
    c =
      ((e = {
        fold: function (n, e) {
          return n();
        },
        is: i,
        isSome: i,
        isNone: u,
        getOr: s,
        getOrThunk: t,
        getOrDie: function (n) {
          throw new Error(n || 'error: getOrDie called on none.');
        },
        getOrNull: O(null),
        getOrUndefined: O(void 0),
        or: s,
        orThunk: t,
        map: n,
        each: function () {},
        bind: n,
        exists: i,
        forall: u,
        filter: n,
        equals: r,
        equals_: r,
        toArray: function () {
          return [];
        },
        toString: O('none()'),
      }),
      Object.freeze && Object.freeze(e),
      e);

  function r(n) {
    return n.isNone();
  }

  function t(n) {
    return n();
  }

  function s(n) {
    return n;
  }

  function a(n) {
    return parseInt(n, 10);
  }

  function f(n, e) {
    var r = n - e;
    return 0 == r ? 0 : 0 < r ? 1 : -1;
  }

  function l(n, e, r) {
    return { major: n, minor: e, patch: r };
  }

  function d(n) {
    var e = /([0-9]+)\.([0-9]+)\.([0-9]+)(?:(\-.+)?)/.exec(n);
    return e ? l(a(e[1]), a(e[2]), a(e[3])) : l(0, 0, 0);
  }

  function m(n, e) {
    return (
      !!n &&
      -1 ===
        (function (n, e) {
          var r = f(n.major, e.major);
          if (0 !== r) return r;
          var t = f(n.minor, e.minor);
          if (0 !== t) return t;
          var o = f(n.patch, e.patch);
          return 0 !== o ? o : 0;
        })(
          d(
            [(r = n).majorVersion, r.minorVersion]
              .join('.')
              .split('.')
              .slice(0, 3)
              .join('.')
          ),
          d(e)
        )
    );
    var r;
  }

  function v(e) {
    return function (n) {
      return (
        (function (n) {
          if (null === n) return 'null';
          var e = typeof n;
          return 'object' == e &&
            (Array.prototype.isPrototypeOf(n) ||
              (n.constructor && 'Array' === n.constructor.name))
            ? 'array'
            : 'object' == e &&
              (String.prototype.isPrototypeOf(n) ||
                (n.constructor && 'String' === n.constructor.name))
            ? 'string'
            : e;
        })(n) === e
      );
    };
  }

  function h(n, e) {
    return (r = n), (t = e), -1 < nn.call(r, t);
    var r, t;
  }

  function g(n, e) {
    for (var r = n.length, t = new Array(r), o = 0; o < r; o++) {
      var i = n[o];
      t[o] = e(i, o);
    }
    return t;
  }

  function p(n, e) {
    for (var r = 0, t = n.length; r < t; r++) {
      e(n[r], r);
    }
  }

  function N(n) {
    return n.dom().nodeName.toLowerCase();
  }

  function w(n, e, r) {
    if (!($(r) || K(r) || Q(r)))
      throw (
        (o.console.error(
          'Invalid call to Attr.set. Key ',
          e,
          ':: Value ',
          r,
          ':: Element ',
          n
        ),
        new Error('Attribute value was not simple'))
      );
    n.setAttribute(e, r + '');
  }

  function x(n, e, r) {
    w(n.dom(), e, r);
  }

  function S(n, e) {
    var r = n.dom();
    !(function (n, e) {
      for (var r = H(n), t = 0, o = r.length; t < o; t++) {
        var i = r[t];
        e(n[i], i);
      }
    })(e, function (n, e) {
      w(r, e, n);
    });
  }

  function T(n, e) {
    n.dom().removeAttribute(e);
  }

  function E(n) {
    return (
      (e = n.dom().attributes),
      (r = function (n, e) {
        return (n[e.name] = e.value), n;
      }),
      (t = {}),
      p(e, function (n) {
        t = r(t, n);
      }),
      t
    );
    var e, r, t;
  }

  function k(n, e) {
    var r,
      t,
      o = ((r = e), null === (t = n.dom().getAttribute(r)) ? void 0 : t);
    return void 0 === o || '' === o ? [] : o.split(' ');
  }

  function D(n) {
    return void 0 !== n.dom().classList;
  }

  function y(n) {
    return k(n, 'class');
  }

  function b(n, e) {
    return (
      (o = e),
      (i = k((r = n), (t = 'class')).concat([o])),
      x(r, t, i.join(' ')),
      !0
    );
    var r, t, o, i;
  }

  function C(n, e) {
    return (
      (o = e),
      0 <
      (i = (function (n, e) {
        for (var r = [], t = 0, o = n.length; t < o; t++) {
          var i = n[t];
          e(i, t) && r.push(i);
        }
        return r;
      })(k((r = n), (t = 'class')), function (n) {
        return n !== o;
      })).length
        ? x(r, t, i.join(' '))
        : T(r, t),
      !1
    );
    var r, t, o, i;
  }

  function L(n, e) {
    D(n) ? n.dom().classList.add(e) : b(n, e);
  }

  function A(n, e) {
    var r;
    D(n) ? n.dom().classList.remove(e) : C(n, e),
      0 === (D((r = n)) ? r.dom().classList : y(r)).length && T(r, 'class');
  }

  function _(n, e) {
    return D(n)
      ? n.dom().classList.toggle(e)
      : ((t = e), (h(y((r = n)), t) ? C : b)(r, t));
    var r, t;
  }

  function M(n, e) {
    return D(n) && n.dom().classList.contains(e);
  }

  function R(n, e, r) {
    return 0 != (n.compareDocumentPosition(e) & r);
  }

  function I(n, e) {
    var r = (function (n, e) {
      for (var r = 0; r < n.length; r++) {
        var t = n[r];
        if (t.test(e)) return t;
      }
    })(n, e);
    if (!r) return { major: 0, minor: 0 };

    function t(n) {
      return Number(e.replace(r, '$' + n));
    }

    return an(t(1), t(2));
  }

  function j(n, e) {
    return function () {
      return e === n;
    };
  }

  function P(n, e) {
    return function () {
      return e === n;
    };
  }

  function B(n, e) {
    var r = String(e).toLowerCase();
    return (function (n, e) {
      for (var r = 0, t = n.length; r < t; r++) {
        var o = n[r];
        if (e(o, r)) return z.some(o);
      }
      return z.none();
    })(n, function (n) {
      return n.search(r);
    });
  }

  function F(n, e) {
    return -1 !== n.indexOf(e);
  }

  function U(e) {
    return function (n) {
      return F(n, e);
    };
  }

  function X(n, e) {
    var r = n.dom();
    if (r.nodeType !== Ln) return !1;
    var t = r;
    if (void 0 !== t.matches) return t.matches(e);
    if (void 0 !== t.msMatchesSelector) return t.msMatchesSelector(e);
    if (void 0 !== t.webkitMatchesSelector) return t.webkitMatchesSelector(e);
    if (void 0 !== t.mozMatchesSelector) return t.mozMatchesSelector(e);
    throw new Error('Browser lacks native selectors');
  }

  function q(n, e) {
    var r,
      t = void 0 === e ? o.document : e.dom();
    return ((r = t).nodeType !== Ln && r.nodeType !== An) ||
      0 === r.childElementCount
      ? []
      : g(t.querySelectorAll(n), Cn.fromDom);
  }

  var V,
    Y = function (r) {
      function n() {
        return o;
      }

      function e(n) {
        return n(r);
      }

      var t = O(r),
        o = {
          fold: function (n, e) {
            return e(r);
          },
          is: function (n) {
            return r === n;
          },
          isSome: u,
          isNone: i,
          getOr: t,
          getOrThunk: t,
          getOrDie: t,
          getOrNull: t,
          getOrUndefined: t,
          or: n,
          orThunk: n,
          map: function (n) {
            return Y(n(r));
          },
          each: function (n) {
            n(r);
          },
          bind: e,
          exists: e,
          forall: e,
          filter: function (n) {
            return n(r) ? o : c;
          },
          toArray: function () {
            return [r];
          },
          toString: function () {
            return 'some(' + r + ')';
          },
          equals: function (n) {
            return n.is(r);
          },
          equals_: function (n, e) {
            return n.fold(i, function (n) {
              return e(r, n);
            });
          },
        };
      return o;
    },
    z = {
      some: Y,
      none: n,
      from: function (n) {
        return null == n ? c : Y(n);
      },
    },
    H = Object.keys,
    W = Object.hasOwnProperty,
    G = function (n, e) {
      return W.call(n, e);
    },
    $ = v('string'),
    K = v('boolean'),
    J = v('function'),
    Q = v('number'),
    Z = Array.prototype.slice,
    nn = Array.prototype.indexOf,
    en =
      (J(Array.from) && Array.from,
      o.Node.ATTRIBUTE_NODE,
      o.Node.CDATA_SECTION_NODE,
      o.Node.COMMENT_NODE,
      o.Node.DOCUMENT_NODE),
    rn =
      (o.Node.DOCUMENT_TYPE_NODE,
      o.Node.DOCUMENT_FRAGMENT_NODE,
      o.Node.ELEMENT_NODE),
    tn = o.Node.TEXT_NODE,
    on =
      (o.Node.PROCESSING_INSTRUCTION_NODE,
      o.Node.ENTITY_REFERENCE_NODE,
      o.Node.ENTITY_NODE,
      o.Node.NOTATION_NODE,
      void 0 !== o.window ? o.window : Function('return this;')(),
      (V = tn),
      function (n) {
        return n.dom().nodeType === V;
      }),
    un = function (n, e) {
      return R(n, e, o.Node.DOCUMENT_POSITION_CONTAINED_BY);
    },
    cn = function (n) {
      function e() {
        return r;
      }

      var r = n;
      return {
        get: e,
        set: function (n) {
          r = n;
        },
        clone: function () {
          return cn(r);
        },
      };
    },
    sn = function () {
      return an(0, 0);
    },
    an = function (n, e) {
      return { major: n, minor: e };
    },
    fn = {
      nu: an,
      detect: function (n, e) {
        var r = String(e).toLowerCase();
        return 0 === n.length ? sn() : I(n, r);
      },
      unknown: sn,
    },
    ln = 'Firefox',
    dn = function (n) {
      var e = n.current;
      return {
        current: e,
        version: n.version,
        isEdge: j('Edge', e),
        isChrome: j('Chrome', e),
        isIE: j('IE', e),
        isOpera: j('Opera', e),
        isFirefox: j(ln, e),
        isSafari: j('Safari', e),
      };
    },
    mn = {
      unknown: function () {
        return dn({ current: void 0, version: fn.unknown() });
      },
      nu: dn,
      edge: O('Edge'),
      chrome: O('Chrome'),
      ie: O('IE'),
      opera: O('Opera'),
      firefox: O(ln),
      safari: O('Safari'),
    },
    vn = 'Windows',
    hn = 'Android',
    gn = 'Solaris',
    pn = 'FreeBSD',
    On = 'ChromeOS',
    Nn = function (n) {
      var e = n.current;
      return {
        current: e,
        version: n.version,
        isWindows: P(vn, e),
        isiOS: P('iOS', e),
        isAndroid: P(hn, e),
        isOSX: P('OSX', e),
        isLinux: P('Linux', e),
        isSolaris: P(gn, e),
        isFreeBSD: P(pn, e),
        isChromeOS: P(On, e),
      };
    },
    wn = {
      unknown: function () {
        return Nn({ current: void 0, version: fn.unknown() });
      },
      nu: Nn,
      windows: O(vn),
      ios: O('iOS'),
      android: O(hn),
      linux: O('Linux'),
      osx: O('OSX'),
      solaris: O(gn),
      freebsd: O(pn),
      chromeos: O(On),
    },
    xn = function (n, r) {
      return B(n, r).map(function (n) {
        var e = fn.detect(n.versionRegexes, r);
        return { current: n.name, version: e };
      });
    },
    Sn = function (n, r) {
      return B(n, r).map(function (n) {
        var e = fn.detect(n.versionRegexes, r);
        return { current: n.name, version: e };
      });
    },
    Tn = /.*?version\/\ ?([0-9]+)\.([0-9]+).*/,
    En = [
      {
        name: 'Edge',
        versionRegexes: [/.*?edge\/ ?([0-9]+)\.([0-9]+)$/],
        search: function (n) {
          return (
            F(n, 'edge/') &&
            F(n, 'chrome') &&
            F(n, 'safari') &&
            F(n, 'applewebkit')
          );
        },
      },
      {
        name: 'Chrome',
        versionRegexes: [/.*?chrome\/([0-9]+)\.([0-9]+).*/, Tn],
        search: function (n) {
          return F(n, 'chrome') && !F(n, 'chromeframe');
        },
      },
      {
        name: 'IE',
        versionRegexes: [
          /.*?msie\ ?([0-9]+)\.([0-9]+).*/,
          /.*?rv:([0-9]+)\.([0-9]+).*/,
        ],
        search: function (n) {
          return F(n, 'msie') || F(n, 'trident');
        },
      },
      {
        name: 'Opera',
        versionRegexes: [Tn, /.*?opera\/([0-9]+)\.([0-9]+).*/],
        search: U('opera'),
      },
      {
        name: 'Firefox',
        versionRegexes: [/.*?firefox\/\ ?([0-9]+)\.([0-9]+).*/],
        search: U('firefox'),
      },
      {
        name: 'Safari',
        versionRegexes: [Tn, /.*?cpu os ([0-9]+)_([0-9]+).*/],
        search: function (n) {
          return (F(n, 'safari') || F(n, 'mobile/')) && F(n, 'applewebkit');
        },
      },
    ],
    kn = [
      {
        name: 'Windows',
        search: U('win'),
        versionRegexes: [/.*?windows\ nt\ ?([0-9]+)\.([0-9]+).*/],
      },
      {
        name: 'iOS',
        search: function (n) {
          return F(n, 'iphone') || F(n, 'ipad');
        },
        versionRegexes: [
          /.*?version\/\ ?([0-9]+)\.([0-9]+).*/,
          /.*cpu os ([0-9]+)_([0-9]+).*/,
          /.*cpu iphone os ([0-9]+)_([0-9]+).*/,
        ],
      },
      {
        name: 'Android',
        search: U('android'),
        versionRegexes: [/.*?android\ ?([0-9]+)\.([0-9]+).*/],
      },
      {
        name: 'OSX',
        search: U('mac os x'),
        versionRegexes: [/.*?mac\ os\ x\ ?([0-9]+)_([0-9]+).*/],
      },
      { name: 'Linux', search: U('linux'), versionRegexes: [] },
      {
        name: 'Solaris',
        search: U('sunos'),
        versionRegexes: [],
      },
      { name: 'FreeBSD', search: U('freebsd'), versionRegexes: [] },
      {
        name: 'ChromeOS',
        search: U('cros'),
        versionRegexes: [/.*?chrome\/([0-9]+)\.([0-9]+).*/],
      },
    ],
    Dn = { browsers: O(En), oses: O(kn) },
    yn = cn(
      (function (n, e) {
        var r,
          t,
          o,
          i,
          u,
          c,
          s,
          a,
          f,
          l,
          d,
          m,
          v = Dn.browsers(),
          h = Dn.oses(),
          g = xn(v, n).fold(mn.unknown, mn.nu),
          p = Sn(h, n).fold(wn.unknown, wn.nu);
        return {
          browser: g,
          os: p,
          deviceType:
            ((t = g),
            (o = n),
            (i = e),
            (u = (r = p).isiOS() && !0 === /ipad/i.test(o)),
            (c = r.isiOS() && !u),
            (s = r.isiOS() || r.isAndroid()),
            (a = s || i('(pointer:coarse)')),
            (f = u || (!c && s && i('(min-device-width:768px)'))),
            (l = c || (s && !f)),
            (d = t.isSafari() && r.isiOS() && !1 === /safari/i.test(o)),
            (m = !l && !f && !d),
            {
              isiPad: O(u),
              isiPhone: O(c),
              isTablet: O(f),
              isPhone: O(l),
              isTouch: O(a),
              isAndroid: r.isAndroid,
              isiOS: r.isiOS,
              isWebView: O(d),
              isDesktop: O(m),
            }),
        };
      })(o.navigator.userAgent, function (n) {
        return o.window.matchMedia(n).matches;
      })
    ),
    bn = function (n) {
      if (null == n) throw new Error('Node cannot be null or undefined');
      return { dom: O(n) };
    },
    Cn = {
      fromHtml: function (n, e) {
        var r = (e || o.document).createElement('div');
        if (((r.innerHTML = n), !r.hasChildNodes() || 1 < r.childNodes.length))
          throw (
            (o.console.error('HTML does not have a single root node', n),
            new Error('HTML must have a single root node'))
          );
        return bn(r.childNodes[0]);
      },
      fromTag: function (n, e) {
        var r = (e || o.document).createElement(n);
        return bn(r);
      },
      fromText: function (n, e) {
        var r = (e || o.document).createTextNode(n);
        return bn(r);
      },
      fromDom: bn,
      fromPoint: function (n, e, r) {
        var t = n.dom();
        return z.from(t.elementFromPoint(e, r)).map(bn);
      },
    },
    Ln = rn,
    An = en;
  yn.get().browser.isIE();

  function _n(n, e, r, t, o) {
    return n(r, t) ? z.some(r) : J(o) && o(r) ? z.none() : e(r, t, o);
  }

  function Mn(n, e, r) {
    for (var t = n.dom(), o = J(r) ? r : O(!1); t.parentNode; ) {
      t = t.parentNode;
      var i = Cn.fromDom(t);
      if (e(i)) return z.some(i);
      if (o(i)) break;
    }
    return z.none();
  }

  function Rn(n) {
    return z.from(n.dom().parentNode).map(Cn.fromDom);
  }

  function In(n) {
    return g(n.dom().childNodes, Cn.fromDom);
  }

  function jn(n) {
    return (e = 0), (r = n.dom().childNodes), z.from(r[e]).map(Cn.fromDom);
    var e, r;
  }

  function Pn(r, n) {
    p(n, function (n) {
      var e;
      (e = n), r.dom().appendChild(e.dom());
    });
  }

  function Bn(n, e) {
    var r,
      t,
      o,
      i,
      u,
      c,
      s = ((r = n), (t = e), (o = Cn.fromTag(t)), (i = E(r)), S(o, i), o);
    (c = s),
      Rn((u = n)).each(function (n) {
        n.dom().insertBefore(c.dom(), u.dom());
      });
    var a,
      f = In(n);
    return (
      Pn(s, f),
      null !== (a = n.dom()).parentNode && a.parentNode.removeChild(a),
      s
    );
  }

  function Fn(n, e, r) {
    return Mn(
      n,
      function (n) {
        return X(n, e);
      },
      r
    );
  }

  function Un(i) {
    function u(n) {
      return 'ol' === N(n) || 'ul' === N(n);
    }

    function n() {
      var n,
        e = Cn.fromDom(i.selection.getNode());
      _n(
        function (n, e) {
          return e(n);
        },
        Mn,
        e,
        u,
        n
      ).fold(
        function () {
          i.execCommand('InsertUnorderedList', !1, {
            'list-attributes': { class: 'tox-checklist' },
          });
        },
        function (e) {
          i.undoManager.transact(function () {
            if (M(e, 'tox-checklist')) i.execCommand('RemoveList');
            else {
              var n = Bn(e, 'ul');
              L(n, 'tox-checklist');
            }
          });
        }
      );
    }

    i.ui.registry.addToggleButton('checklist', {
      icon: 'checklist',
      tooltip: 'Insert Checklist',
      onAction: n,
      onSetup: function (r) {
        function t(n) {
          return (e = o), n.dom() === e.dom() || u(n);
          var e;
        }

        function e(n) {
          return r.setActive(
            !i.readonly &&
              ((e = Cn.fromDom(n)), _n(X, Fn, e, '.tox-checklist', t).isSome())
          );
          var e;
        }

        function n(n) {
          return e(n.element);
        }

        var o = Cn.fromDom(i.getBody());
        return (
          i.on('NodeChange', n),
          e(i.selection.getNode()),
          function () {
            return i.off('NodeChange', n);
          }
        );
      },
    }),
      i.ui.registry.addMenuItem('checklist', {
        icon: 'checklist',
        text: 'Checklist',
        onAction: n,
      });
  }

  !(function () {
    for (var n = [], e = 0; e < arguments.length; e++) n[e] = arguments[e];
  })('element', 'offset');

  function Xn(n, e) {
    return void 0 !== n ? n : void 0 !== e ? e : 0;
  }

  function qn(n) {
    return (
      'li' === N(n) &&
      Rn(n)
        .filter(function (n) {
          return 'ul' === N(n) && M(n, 'tox-checklist');
        })
        .isSome()
    );
  }

  function Vn(n, e) {
    return z
      .from(n)
      .filter(qn)
      .exists(function (n) {
        return (
          e <
          (function (n) {
            var e = n.dom().ownerDocument,
              r = e.body,
              t = e.defaultView,
              o = e.documentElement;
            if (r === n.dom()) return Jn(r.offsetLeft, r.offsetTop);
            var i = Xn(t.pageYOffset, o.scrollTop),
              u = Xn(t.pageXOffset, o.scrollLeft),
              c = Xn(o.clientTop, r.clientTop),
              s = Xn(o.clientLeft, r.clientLeft);
            return Qn(n).translate(u - s, i - c);
          })(n).left()
        );
      });
  }

  function Yn(n) {
    return _(n, 'tox-checklist--checked');
  }

  function zn(o) {
    var i = cn(z.none());
    o.on('mousedown touchstart', function (n) {
      var e,
        r,
        t = Cn.fromDom(n.target);
      (r = n),
        !i.get().exists(function (n) {
          return (
            'touchstart' === n.type &&
            'mousedown' === r.type &&
            r.timeStamp - n.timeStamp < 250
          );
        }) &&
          Vn(
            t,
            'touchstart' === (e = n).type ? e.touches[0].clientX : e.clientX
          ) &&
          (i.set(z.some(n)),
          o.undoManager.transact(function () {
            n.preventDefault(), Yn(t);
          }));
    });
  }

  function Hn(n) {
    return h(['ul', 'ol', 'dl'], N(n));
  }

  function Wn(n) {
    return (
      z
        .from(n)
        .filter(function (n) {
          return M(n, 'tox-checklist');
        })
        .bind(jn)
        .map(function (n) {
          'li' === N(n) &&
            jn(n).exists(function (n) {
              return 'ul' === N(n);
            }) &&
            L(n, 'tox-checklist--hidden');
        }),
      n
    );
  }

  function Gn(n) {
    n.on('ListMutation', function (n) {
      var e = z.from(n.element).map(Cn.fromDom);
      'IndentList' === n.action || 'OutdentList' === n.action
        ? e.map(Wn).map(function (n) {
            return p(q('ul', n), function (n) {
              return Wn(n);
            });
          })
        : ('ToggleUlList' !== n.action &&
            'ToggleOlList' !== n.action &&
            'ToggleDLList' !== n.action) ||
          e.filter(Hn).map(function (n) {
            A(n, 'tox-checklist'),
              p(In(n), function (n) {
                return A(n, 'tox-checklist--checked');
              });
          });
    });
  }

  function $n(r) {
    if (m(tinymce, '5.0.0'))
      return (
        o.console.error(
          'The Checklist Plugin requires at least 5.0.0 of TinyMCE'
        ),
        {}
      );
    var e;
    r.on('init', function () {
      var n, e;
      (n = r.plugins),
        (G(n, (e = 'lists')) ? z.from(n[e]) : z.none()).isNone() &&
          r.windowManager.alert(
            'Please use the Checklist Plugin together with the Lists plugin.'
          );
    }),
      Gn(r),
      Un(r),
      (e = r).shortcuts.add('meta+13', 'Check checklist item', function () {
        var n = e.selection.getSelectedBlocks();
        p(n, function (n) {
          var e = Cn.fromDom(n);
          qn(e) && Yn(e);
        });
      }),
      zn(r);
  }

  var Kn = function (r, t) {
      return {
        left: O(r),
        top: O(t),
        translate: function (n, e) {
          return Kn(r + n, t + e);
        },
      };
    },
    Jn = Kn,
    Qn = function (n) {
      var e,
        r,
        t,
        o = n.dom(),
        i = o.ownerDocument.body;
      return i === o
        ? Jn(i.offsetLeft, i.offsetTop)
        : null != (r = on((e = n)) ? e.dom().parentNode : e.dom()) &&
          r.ownerDocument.body.contains(r)
        ? ((t = o.getBoundingClientRect()), Jn(t.left, t.top))
        : Jn(0, 0);
    };
  tinymce.PluginManager.add('checklist', $n);
})(window);
