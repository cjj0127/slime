! function(t, n) {
    "object" == ("undefined" == typeof exports ? "undefined" : typeof(exports)) && "undefined" != typeof module ? t.moment = module.exports = n() : "function" == typeof define && define.amd ? define(n) : t.moment = n();
}(window, function() {
    var t;

    function n() {
        return t.apply(null, arguments);
    }

    function s(e) {
        return e instanceof Array || "[object Array]" == Object.prototype.toString.call(e);
    }

    function i(e) {
        return null != e && "[object Object]" == Object.prototype.toString.call(e);
    }

    function r(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
    }

    function a(e) {
        if (Object.getOwnPropertyNames) return 0 == Object.getOwnPropertyNames(e).length;
        for (var t in e)
            if (r(e, t)) return;
        return 1;
    }

    function o(e) {
        return void 0 == e;
    }

    function u(e) {
        return "number" == typeof e || "[object Number]" == Object.prototype.toString.call(e);
    }

    function l(e) {
        return e instanceof Date || "[object Date]" == Object.prototype.toString.call(e);
    }

    function h(e, t) {
        for (var n = [], s = e.length, i = 0; i < s; ++i) n.push(t(e[i], i));
        return n;
    }

    function d(e, t) {
        for (var n in t) r(t, n) && (e[n] = t[n]);
        return r(t, "toString") && (e.toString = t.toString), r(t, "valueOf") && (e.valueOf = t.valueOf),
            e;
    }

    function c(e, t, n, s) {
        return wt(e, t, n, s, !0).utc();
    }

    function f(e) {
        return null == e._pf && (e._pf = {
            empty: !1,
            unusedTokens: [],
            unusedInput: [],
            overflow: -2,
            charsLeftOver: 0,
            nullInput: !1,
            invalidEra: null,
            invalidMonth: null,
            invalidFormat: !1,
            userInvalidated: !1,
            iso: !1,
            parsedDateParts: [],
            era: null,
            meridiem: null,
            rfc2822: !1,
            weekdayMismatch: !1
        }), e._pf;
    }

    function m(e) {
        if (null == e._isValid) {
            var t = f(e),
                n = y.call(t.parsedDateParts, function(e) {
                    return null != e;
                });
            if (n = !isNaN(e._d.getTime()) && t.overflow < 0 && !t.empty && !t.invalidEra && !t.invalidMonth && !t.invalidWeekday && !t.weekdayMismatch && !t.nullInput && !t.invalidFormat && !t.userInvalidated && (!t.meridiem || t.meridiem && n),
                e._strict && (n = n && 0 == t.charsLeftOver && 0 == t.unusedTokens.length && void 0 == t.bigHour),
                null != Object.isFrozen && Object.isFrozen(e)) return n;
            e._isValid = n;
        }
        return e._isValid;
    }

    function _(e) {
        var t = c(NaN);
        return null != e ? d(f(t), e) : f(t).userInvalidated = !0, t;
    }
    var y = Array.prototype.some || function(e) {
            for (var t = Object(this), n = t.length >>> 0, s = 0; s < n; s++)
                if (s in t && e.call(this, t[s], s, t)) return !0;
            return !1;
        },
        g = n.momentProperties = [],
        w = !1;

    function p(e, t) {
        var n, s, i, r = g.length;
        if (o(t._isAMomentObject) || (e._isAMomentObject = t._isAMomentObject), o(t._i) || (e._i = t._i),
            o(t._f) || (e._f = t._f), o(t._l) || (e._l = t._l), o(t._strict) || (e._strict = t._strict),
            o(t._tzm) || (e._tzm = t._tzm), o(t._isUTC) || (e._isUTC = t._isUTC), o(t._offset) || (e._offset = t._offset),
            o(t._pf) || (e._pf = f(t)), o(t._locale) || (e._locale = t._locale), 0 < r)
            for (n = 0; n < r; n++) o(i = t[s = g[n]]) || (e[s] = i);
        return e;
    }

    function k(e) {
        p(this, e), this._d = new Date(null != e._d ? e._d.getTime() : NaN), this.isValid() || (this._d = new Date(NaN)), !1 == w && (w = !0, n.updateOffset(this), w = !1);
    }

    function v(e) {
        return e instanceof k || null != e && null != e._isAMomentObject;
    }

    function M(e) {
        !1 == n.suppressDeprecationWarnings && "undefined" != typeof console && console.warn && console.warn("Deprecation warning: " + e);
    }

    function D(t, s) {
        var i = !0;
        return d(function() {
            if (null != n.deprecationHandler && n.deprecationHandler(null, t), i) {
                for (var a, o, u = [], l = arguments.length, h = 0; h < l; h++) {
                    if (a = "", "object" == typeof(arguments[h])) {
                        for (o in a += "\n[" + h + "] ", arguments[0]) r(arguments[0], o) && (a += o + ": " + arguments[0][o] + ", ");
                        a = a.slice(0, -2);
                    } else a = arguments[h];
                    u.push(a);
                }
                M(t + "\nArguments: " + Array.prototype.slice.call(u).join("") + "\n" + new Error().stack),
                    i = !1;
            }
            return s.apply(this, arguments);
        }, s);
    }
    var S = {};

    function Y(e, t) {
        null != n.deprecationHandler && n.deprecationHandler(e, t), S[e] || (M(t), S[e] = !0);
    }

    function O(e) {
        return "undefined" != typeof Function && e instanceof Function || "[object Function]" == Object.prototype.toString.call(e);
    }

    function b(e, t) {
        var n, s = d({}, e);
        for (n in t) r(t, n) && (i(e[n]) && i(t[n]) ? (s[n] = {}, d(s[n], e[n]), d(s[n], t[n])) : null != t[n] ? s[n] = t[n] : delete s[n]);
        for (n in e) r(e, n) && !r(t, n) && i(e[n]) && (s[n] = d({}, s[n]));
        return s;
    }

    function x(e) {
        null != e && this.set(e);
    }
    n.suppressDeprecationWarnings = !1, n.deprecationHandler = null;
    var T = Object.keys || function(e) {
        var t, n = [];
        for (t in e) r(e, t) && n.push(t);
        return n;
    };

    function N(e, t, n) {
        var s = "" + Math.abs(e);
        return (0 <= e ? n ? "+" : "" : "-") + Math.pow(10, Math.max(0, t - s.length)).toString().substr(1) + s;
    }
    var P = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,
        R = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,
        W = {},
        C = {};

    function U(e, t, n, s) {
        var i = "string" == typeof s ? function() {
            return this[s]();
        } : s;
        e && (C[e] = i), t && (C[t[0]] = function() {
            return N(i.apply(this, arguments), t[1], t[2]);
        }), n && (C[n] = function() {
            return this.localeData().ordinal(i.apply(this, arguments), e);
        });
    }

    function H(e, t) {
        return e.isValid() ? (t = F(t, e.localeData()), W[t] = W[t] || function(e) {
            for (var t, n = e.match(P), s = 0, i = n.length; s < i; s++) C[n[s]] ? n[s] = C[n[s]] : n[s] = (t = n[s]).match(/\[[\s\S]/) ? t.replace(/^\[|\]$/g, "") : t.replace(/\\/g, "");
            return function(t) {
                for (var s = "", r = 0; r < i; r++) s += O(n[r]) ? n[r].call(t, e) : n[r];
                return s;
            };
        }(t), W[t](e)) : e.localeData().invalidDate();
    }

    function F(e, t) {
        var n = 5;

        function s(e) {
            return t.longDateFormat(e) || e;
        }
        for (R.lastIndex = 0; 0 <= n && R.test(e);) e = e.replace(R, s), R.lastIndex = 0,
            --n;
        return e;
    }
    var L = {};

    function V(e, t) {
        var n = e.toLowerCase();
        L[n] = L[n + "s"] = L[t] = e;
    }

    function G(e) {
        return "string" == typeof e ? L[e] || L[e.toLowerCase()] : void 0;
    }

    function E(e) {
        var t, n, s = {};
        for (n in e) r(e, n) && (t = G(n)) && (s[t] = e[n]);
        return s;
    }
    var A = {};

    function I(e, t) {
        A[e] = t;
    }

    function j(e) {
        return e % 4 == 0 && e % 100 != 0 || e % 400 == 0;
    }

    function Z(e) {
        return e < 0 ? Math.ceil(e) || 0 : Math.floor(e);
    }

    function z(e) {
        return 0 != (e = +e) && isFinite(e) ? Z(e) : 0;
    }

    function $(e, t) {
        return function(s) {
            return null != s ? (B(this, e, s), n.updateOffset(this, t), this) : q(this, e);
        };
    }

    function q(e, t) {
        return e.isValid() ? e._d["get" + (e._isUTC ? "UTC" : "") + t]() : NaN;
    }

    function B(e, t, n) {
        e.isValid() && !isNaN(n) && ("FullYear" == t && j(e.year()) && 1 == e.month() && 29 == e.date() ? (n = z(n),
            e._d["set" + (e._isUTC ? "UTC" : "") + t](n, e.month(), ke(n, e.month()))) : e._d["set" + (e._isUTC ? "UTC" : "") + t](n));
    }
    var J = /\d/,
        Q = /\d\d/,
        X = /\d{3}/,
        K = /\d{4}/,
        ee = /[+-]?\d{6}/,
        te = /\d\d?/,
        ne = /\d\d\d\d?/,
        se = /\d\d\d\d\d\d?/,
        ie = /\d{1,3}/,
        re = /\d{1,4}/,
        ae = /[+-]?\d{1,6}/,
        oe = /\d+/,
        ue = /[+-]?\d+/,
        le = /Z|[+-]\d\d:?\d\d/gi,
        he = /Z|[+-]\d\d(?::?\d\d)?/gi,
        de = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i;

    function ce(e, t, n) {
        _e[e] = O(t) ? t : function(e) {
            return e && n ? n : t;
        };
    }

    function fe(e, t) {
        return r(_e, e) ? _e[e](t._strict, t._locale) : new RegExp(me(e.replace("\\", "").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function(e, t, n, s, i) {
            return t || n || s || i;
        })));
    }

    function me(e) {
        return e.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    }
    var _e = {},
        ye = {};

    function ge(e, t) {
        var n, s, i = t;
        for ("string" == typeof e && (e = [e]), u(t) && (i = function(e, n) {
                n[t] = z(e);
            }), s = e.length, n = 0; n < s; n++) ye[e[n]] = i;
    }

    function we(e, t) {
        ge(e, function(e, n, s, i) {
            s._w = s._w || {}, t(e, s._w, s, i);
        });
    }
    var pe;

    function ke(e, t) {
        if (isNaN(e) || isNaN(t)) return NaN;
        var n = (t % (n = 12) + n) % n;
        return e += (t - n) / 12, 1 == n ? j(e) ? 29 : 28 : 31 - n % 7 % 2;
    }
    pe = Array.prototype.indexOf || function(e) {
        for (var t = 0; t < this.length; ++t)
            if (this[t] == e) return t;
        return -1;
    }, U("M", ["MM", 2], "Mo", function() {
        return this.month() + 1;
    }), U("MMM", 0, 0, function(e) {
        return this.localeData().monthsShort(this, e);
    }), U("MMMM", 0, 0, function(e) {
        return this.localeData().months(this, e);
    }), V("month", "M"), I("month", 8), ce("M", te), ce("MM", te, Q), ce("MMM", function(e, t) {
        return t.monthsShortRegex(e);
    }), ce("MMMM", function(e, t) {
        return t.monthsRegex(e);
    }), ge(["M", "MM"], function(e, t) {
        t[1] = z(e) - 1;
    }), ge(["MMM", "MMMM"], function(e, t, n, s) {
        null != (s = n._locale.monthsParse(e, s, n._strict)) ? t[1] = s : f(n).invalidMonth = e;
    });
    var ve = "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
        Me = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        De = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,
        Se = de,
        Ye = de;

    function Oe(e, t) {
        var n;
        if (e.isValid()) {
            if ("string" == typeof t)
                if (/^\d+$/.test(t)) t = z(t);
                else if (!u(t = e.localeData().monthsParse(t))) return;
            n = Math.min(e.date(), ke(e.year(), t)), e._d["set" + (e._isUTC ? "UTC" : "") + "Month"](t, n);
        }
    }

    function be(e) {
        return null != e ? (Oe(this, e), n.updateOffset(this, !0), this) : q(this, "Month");
    }

    function xe() {
        function e(e, t) {
            return t.length - e.length;
        }
        for (var t, n = [], s = [], i = [], r = 0; r < 12; r++) t = c([2e3, r]), n.push(this.monthsShort(t, "")),
            s.push(this.months(t, "")), i.push(this.months(t, "")), i.push(this.monthsShort(t, ""));
        for (n.sort(e), s.sort(e), i.sort(e), r = 0; r < 12; r++) n[r] = me(n[r]), s[r] = me(s[r]);
        for (r = 0; r < 24; r++) i[r] = me(i[r]);
        this._monthsRegex = new RegExp("^(" + i.join("|") + ")", "i"), this._monthsShortRegex = this._monthsRegex,
            this._monthsStrictRegex = new RegExp("^(" + s.join("|") + ")", "i"), this._monthsShortStrictRegex = new RegExp("^(" + n.join("|") + ")", "i");
    }

    function Te(e) {
        return j(e) ? 366 : 365;
    }
    U("Y", 0, 0, function() {
            var e = this.year();
            return e <= 9999 ? N(e, 4) : "+" + e;
        }), U(0, ["YY", 2], 0, function() {
            return this.year() % 100;
        }), U(0, ["YYYY", 4], 0, "year"), U(0, ["YYYYY", 5], 0, "year"), U(0, ["YYYYYY", 6, !0], 0, "year"),
        V("year", "y"), I("year", 1), ce("Y", ue), ce("YY", te, Q), ce("YYYY", re, K), ce("YYYYY", ae, ee),
        ce("YYYYYY", ae, ee), ge(["YYYYY", "YYYYYY"], 0), ge("YYYY", function(e, t) {
            t[0] = 2 == e.length ? n.parseTwoDigitYear(e) : z(e);
        }), ge("YY", function(e, t) {
            t[0] = n.parseTwoDigitYear(e);
        }), ge("Y", function(e, t) {
            t[0] = parseInt(e, 10);
        }), n.parseTwoDigitYear = function(e) {
            return z(e) + (68 < z(e) ? 1900 : 2e3);
        };
    var Ne = $("FullYear", !0);

    function Pe(e, t, n, s, i, r, a) {
        var o;
        return e < 100 && 0 <= e ? (o = new Date(e + 400, t, n, s, i, r, a), isFinite(o.getFullYear()) && o.setFullYear(e)) : o = new Date(e, t, n, s, i, r, a),
            o;
    }

    function Re(e) {
        var t;
        return e < 100 && 0 <= e ? ((t = Array.prototype.slice.call(arguments))[0] = e + 400,
                t = new Date(Date.UTC.apply(null, t)), isFinite(t.getUTCFullYear()) && t.setUTCFullYear(e)) : t = new Date(Date.UTC.apply(null, arguments)),
            t;
    }

    function We(e, t, n) {
        return (n = 7 + t - n) - (7 + Re(e, 0, n).getUTCDay() - t) % 7 - 1;
    }

    function Ce(e, t, n, s, i) {
        var r;
        return n = (t = 1 + 7 * (t - 1) + (7 + n - s) % 7 + We(e, s, i)) <= 0 ? Te(r = e - 1) + t : t > Te(e) ? (r = e + 1,
            t - Te(e)) : (r = e, t), {
            year: r,
            dayOfYear: n
        };
    }

    function Ue(e, t, n) {
        var s, i, r = We(e.year(), t, n);
        return (r = Math.floor((e.dayOfYear() - r - 1) / 7) + 1) < 1 ? s = r + He(i = e.year() - 1, t, n) : r > He(e.year(), t, n) ? (s = r - He(e.year(), t, n),
            i = e.year() + 1) : (i = e.year(), s = r), {
            week: s,
            year: i
        };
    }

    function He(e, t, n) {
        var s = We(e, t, n);
        return t = We(e + 1, t, n), (Te(e) - s + t) / 7;
    }

    function Fe(e, t) {
        return e.slice(t, 7).concat(e.slice(0, t));
    }
    U("w", ["ww", 2], "wo", "week"), U("W", ["WW", 2], "Wo", "isoWeek"), V("week", "w"),
        V("isoWeek", "W"), I("week", 5), I("isoWeek", 5), ce("w", te), ce("ww", te, Q),
        ce("W", te), ce("WW", te, Q), we(["w", "ww", "W", "WW"], function(e, t, n, s) {
            t[s.substr(0, 1)] = z(e);
        }), U("d", 0, "do", "day"), U("dd", 0, 0, function(e) {
            return this.localeData().weekdaysMin(this, e);
        }), U("ddd", 0, 0, function(e) {
            return this.localeData().weekdaysShort(this, e);
        }), U("dddd", 0, 0, function(e) {
            return this.localeData().weekdays(this, e);
        }), U("e", 0, 0, "weekday"), U("E", 0, 0, "isoWeekday"), V("day", "d"), V("weekday", "e"),
        V("isoWeekday", "E"), I("day", 11), I("weekday", 11), I("isoWeekday", 11), ce("d", te),
        ce("e", te), ce("E", te), ce("dd", function(e, t) {
            return t.weekdaysMinRegex(e);
        }), ce("ddd", function(e, t) {
            return t.weekdaysShortRegex(e);
        }), ce("dddd", function(e, t) {
            return t.weekdaysRegex(e);
        }), we(["dd", "ddd", "dddd"], function(e, t, n, s) {
            null != (s = n._locale.weekdaysParse(e, s, n._strict)) ? t.d = s : f(n).invalidWeekday = e;
        }), we(["d", "e", "E"], function(e, t, n, s) {
            t[s] = z(e);
        });
    var Le = "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
        Ve = "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        Ge = "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
        Ee = de,
        Ae = de,
        Ie = de;

    function je() {
        function e(e, t) {
            return t.length - e.length;
        }
        for (var t, n, s, i = [], r = [], a = [], o = [], u = 0; u < 7; u++) s = c([2e3, 1]).day(u),
            t = me(this.weekdaysMin(s, "")), n = me(this.weekdaysShort(s, "")), s = me(this.weekdays(s, "")),
            i.push(t), r.push(n), a.push(s), o.push(t), o.push(n), o.push(s);
        i.sort(e), r.sort(e), a.sort(e), o.sort(e), this._weekdaysRegex = new RegExp("^(" + o.join("|") + ")", "i"),
            this._weekdaysShortRegex = this._weekdaysRegex, this._weekdaysMinRegex = this._weekdaysRegex,
            this._weekdaysStrictRegex = new RegExp("^(" + a.join("|") + ")", "i"), this._weekdaysShortStrictRegex = new RegExp("^(" + r.join("|") + ")", "i"),
            this._weekdaysMinStrictRegex = new RegExp("^(" + i.join("|") + ")", "i");
    }

    function Ze() {
        return this.hours() % 12 || 12;
    }

    function ze(e, t) {
        U(e, 0, 0, function() {
            return this.localeData().meridiem(this.hours(), this.minutes(), t);
        });
    }

    function $e(e, t) {
        return t._meridiemParse;
    }
    U("H", ["HH", 2], 0, "hour"), U("h", ["hh", 2], 0, Ze), U("k", ["kk", 2], 0, function() {
            return this.hours() || 24;
        }), U("hmm", 0, 0, function() {
            return "" + Ze.apply(this) + N(this.minutes(), 2);
        }), U("hmmss", 0, 0, function() {
            return "" + Ze.apply(this) + N(this.minutes(), 2) + N(this.seconds(), 2);
        }), U("Hmm", 0, 0, function() {
            return "" + this.hours() + N(this.minutes(), 2);
        }), U("Hmmss", 0, 0, function() {
            return "" + this.hours() + N(this.minutes(), 2) + N(this.seconds(), 2);
        }), ze("a", !0), ze("A", !1), V("hour", "h"), I("hour", 13), ce("a", $e), ce("A", $e),
        ce("H", te), ce("h", te), ce("k", te), ce("HH", te, Q), ce("hh", te, Q), ce("kk", te, Q),
        ce("hmm", ne), ce("hmmss", se), ce("Hmm", ne), ce("Hmmss", se), ge(["H", "HH"], 3),
        ge(["k", "kk"], function(e, t) {
            e = z(e), t[3] = 24 == e ? 0 : e;
        }), ge(["a", "A"], function(e, t, n) {
            n._isPm = n._locale.isPM(e), n._meridiem = e;
        }), ge(["h", "hh"], function(e, t, n) {
            t[3] = z(e), f(n).bigHour = !0;
        }), ge("hmm", function(e, t, n) {
            var s = e.length - 2;
            t[3] = z(e.substr(0, s)), t[4] = z(e.substr(s)), f(n).bigHour = !0;
        }), ge("hmmss", function(e, t, n) {
            var s = e.length - 4,
                i = e.length - 2;
            t[3] = z(e.substr(0, s)), t[4] = z(e.substr(s, 2)), t[5] = z(e.substr(i)), f(n).bigHour = !0;
        }), ge("Hmm", function(e, t) {
            var n = e.length - 2;
            t[3] = z(e.substr(0, n)), t[4] = z(e.substr(n));
        }), ge("Hmmss", function(e, t) {
            var n = e.length - 4,
                s = e.length - 2;
            t[3] = z(e.substr(0, n)), t[4] = z(e.substr(n, 2)), t[5] = z(e.substr(s));
        }), de = $("Hours", !0);
    var qe, Be = {
            calendar: {
                sameDay: "[Today at] LT",
                nextDay: "[Tomorrow at] LT",
                nextWeek: "dddd [at] LT",
                lastDay: "[Yesterday at] LT",
                lastWeek: "[Last] dddd [at] LT",
                sameElse: "L"
            },
            longDateFormat: {
                LTS: "h:mm:ss A",
                LT: "h:mm A",
                L: "MM/DD/YYYY",
                LL: "MMMM D, YYYY",
                LLL: "MMMM D, YYYY h:mm A",
                LLLL: "dddd, MMMM D, YYYY h:mm A"
            },
            invalidDate: "Invalid date",
            ordinal: "%d",
            dayOfMonthOrdinalParse: /\d{1,2}/,
            relativeTime: {
                future: "in %s",
                past: "%s ago",
                s: "a few seconds",
                ss: "%d seconds",
                m: "a minute",
                mm: "%d minutes",
                h: "an hour",
                hh: "%d hours",
                d: "a day",
                dd: "%d days",
                w: "a week",
                ww: "%d weeks",
                M: "a month",
                MM: "%d months",
                y: "a year",
                yy: "%d years"
            },
            months: ve,
            monthsShort: Me,
            week: {
                dow: 0,
                doy: 6
            },
            weekdays: Le,
            weekdaysMin: Ge,
            weekdaysShort: Ve,
            meridiemParse: /[ap]\.?m?\.?/i
        },
        Je = {},
        Qe = {};

    function Xe(e) {
        return e && e.toLowerCase().replace("_", "-");
    }

    function Ke(e) {
        var t;
        if (void 0 == Je[e] && "undefined" != typeof module && module && module.exports && null != e.match("^[^/\\\\]*$")) try {
            t = qe._abbr, require("./locale/" + e), et(t);
        } catch (t) {
            Je[e] = null;
        }
        return Je[e];
    }

    function et(e, t) {
        return e && ((t = o(t) ? nt(e) : tt(e, t)) ? qe = t : "undefined" != typeof console && console.warn && console.warn("Locale " + e + " not found. Did you forget to load it?")),
            qe._abbr;
    }

    function tt(e, t) {
        if (null == t) return delete Je[e], null;
        var n, s = Be;
        if (t.abbr = e, null != Je[e]) Y("defineLocaleOverride", "use moment.updateLocale(localeName, config) to change an existing locale. moment.defineLocale(localeName, config) should only be used for creating a new locale See http://momentjs.com/guides/#/warnings/define-locale/ for more info."),
            s = Je[e]._config;
        else if (null != t.parentLocale)
            if (null != Je[t.parentLocale]) s = Je[t.parentLocale]._config;
            else {
                if (null == (n = Ke(t.parentLocale))) return Qe[t.parentLocale] || (Qe[t.parentLocale] = []),
                    Qe[t.parentLocale].push({
                        name: e,
                        config: t
                    }), null;
                s = n._config;
            }
        return Je[e] = new x(b(s, t)), Qe[e] && Qe[e].forEach(function(e) {
            tt(e.name, e.config);
        }), et(e), Je[e];
    }

    function nt(e) {
        var t;
        if (!(e = e && e._locale && e._locale._abbr ? e._locale._abbr : e)) return qe;
        if (!s(e)) {
            if (t = Ke(e)) return t;
            e = [e];
        }
        return function(e) {
            for (var t, n, s, i, r = 0; r < e.length;) {
                for (t = (i = Xe(e[r]).split("-")).length, n = (n = Xe(e[r + 1])) ? n.split("-") : null; 0 < t;) {
                    if (s = Ke(i.slice(0, t).join("-"))) return s;
                    if (n && n.length >= t && function(e, t) {
                            for (var n = Math.min(e.length, t.length), s = 0; s < n; s += 1)
                                if (e[s] !== t[s]) return s;
                            return n;
                        }(i, n) >= t - 1) break;
                    t--;
                }
                r++;
            }
            return qe;
        }(e);
    }

    function st(e) {
        var t = e._a;
        return t && -2 == f(e).overflow && (t = t[1] < 0 || 11 < t[1] ? 1 : t[2] < 1 || t[2] > ke(t[0], t[1]) ? 2 : t[3] < 0 || 24 < t[3] || 24 == t[3] && (0 !== t[4] || 0 !== t[5] || 0 !== t[6]) ? 3 : t[4] < 0 || 59 < t[4] ? 4 : t[5] < 0 || 59 < t[5] ? 5 : t[6] < 0 || 999 < t[6] ? 6 : -1,
            f(e)._overflowDayOfYear && (t < 0 || 2 < t) && (t = 2), f(e)._overflowWeeks && -1 == t && (t = 7),
            f(e)._overflowWeekday && -1 == t && (t = 8), f(e).overflow = t), e;
    }
    var it = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
        rt = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
        at = /Z|[+-]\d\d(?::?\d\d)?/,
        ot = [
            ["YYYYYY-MM-DD", /[+-]\d{6}-\d\d-\d\d/],
            ["YYYY-MM-DD", /\d{4}-\d\d-\d\d/],
            ["GGGG-[W]WW-E", /\d{4}-W\d\d-\d/],
            ["GGGG-[W]WW", /\d{4}-W\d\d/, !1],
            ["YYYY-DDD", /\d{4}-\d{3}/],
            ["YYYY-MM", /\d{4}-\d\d/, !1],
            ["YYYYYYMMDD", /[+-]\d{10}/],
            ["YYYYMMDD", /\d{8}/],
            ["GGGG[W]WWE", /\d{4}W\d{3}/],
            ["GGGG[W]WW", /\d{4}W\d{2}/, !1],
            ["YYYYDDD", /\d{7}/],
            ["YYYYMM", /\d{6}/, !1],
            ["YYYY", /\d{4}/, !1]
        ],
        ut = [
            ["HH:mm:ss.SSSS", /\d\d:\d\d:\d\d\.\d+/],
            ["HH:mm:ss,SSSS", /\d\d:\d\d:\d\d,\d+/],
            ["HH:mm:ss", /\d\d:\d\d:\d\d/],
            ["HH:mm", /\d\d:\d\d/],
            ["HHmmss.SSSS", /\d\d\d\d\d\d\.\d+/],
            ["HHmmss,SSSS", /\d\d\d\d\d\d,\d+/],
            ["HHmmss", /\d\d\d\d\d\d/],
            ["HHmm", /\d\d\d\d/],
            ["HH", /\d\d/]
        ],
        lt = /^\/?Date\((-?\d+)/i,
        ht = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/,
        dt = {
            UT: 0,
            GMT: 0,
            EDT: -240,
            EST: -300,
            CDT: -300,
            CST: -360,
            MDT: -360,
            MST: -420,
            PDT: -420,
            PST: -480
        };

    function ct(e) {
        var t, n, s, i, r, a, o = e._i,
            u = it.exec(o) || rt.exec(o),
            l = (o = ot.length,
                ut.length);
        if (u) {
            for (f(e).iso = !0, t = 0, n = o; t < n; t++)
                if (ot[t][1].exec(u[1])) {
                    i = ot[t][0], s = !1 !== ot[t][2];
                    break;
                }
            if (null == i) e._isValid = !1;
            else {
                if (u[3]) {
                    for (t = 0, n = l; t < n; t++)
                        if (ut[t][1].exec(u[3])) {
                            r = (u[2] || " ") + ut[t][0];
                            break;
                        }
                    if (null == r) return void(e._isValid = !1);
                }
                if (s || null == r) {
                    if (u[4]) {
                        if (!at.exec(u[4])) return void(e._isValid = !1);
                        a = "Z";
                    }
                    e._f = i + (r || "") + (a || ""), yt(e);
                } else e._isValid = !1;
            }
        } else e._isValid = !1;
    }

    function ft(e) {
        var t, n, s, i, r = ht.exec(e._i.replace(/\([^)]*\)|[\n\t]/g, " ").replace(/(\s\s+)/g, " ").replace(/^\s\s*/, "").replace(/\s\s*$/, ""));
        r ? (s = t = function(e, t, n, s, i, r) {
            return e = [function(e) {
                    return (e = parseInt(e, 10)) <= 49 ? 2e3 + e : e <= 999 ? 1900 + e : e;
                }(e), Me.indexOf(t), parseInt(n, 10), parseInt(s, 10), parseInt(i, 10)], r && e.push(parseInt(r, 10)),
                e;
        }(r[4], r[3], r[2], r[5], r[6], r[7]), i = e, (n = r[1]) && Ve.indexOf(n) !== new Date(s[0], s[1], s[2]).getDay() ? (f(i).weekdayMismatch = !0,
            i._isValid = !1) : (e._a = t, e._tzm = (n = r[8], s = r[9], i = r[10], n ? dt[n] : s ? 0 : ((n = parseInt(i, 10)) - (s = n % 100)) / 100 * 60 + s),
            e._d = Re.apply(null, e._a), e._d.setUTCMinutes(e._d.getUTCMinutes() - e._tzm),
            f(e).rfc2822 = !0)) : e._isValid = !1;
    }

    function mt(e, t, n) {
        return null != e ? e : null != t ? t : n;
    }

    function _t(e) {
        var t, s, i, r, a, o, u, l, h, d, c, m = [];
        if (!e._d) {
            for (i = e, r = new Date(n.now()), s = i._useUTC ? [r.getUTCFullYear(), r.getUTCMonth(), r.getUTCDate()] : [r.getFullYear(), r.getMonth(), r.getDate()],
                e._w && null == e._a[2] && null == e._a[1] && (null != (r = (i = e)._w).GG || null != r.W || null != r.E ? (l = 1,
                    h = 4, a = mt(r.GG, i._a[0], Ue(pt(), 1, 4).year), o = mt(r.W, 1), ((u = mt(r.E, 1)) < 1 || 7 < u) && (d = !0)) : (l = i._locale._week.dow,
                    h = i._locale._week.doy, c = Ue(pt(), l, h), a = mt(r.gg, i._a[0], c.year), o = mt(r.w, c.week),
                    null != r.d ? ((u = r.d) < 0 || 6 < u) && (d = !0) : null != r.e ? (u = r.e + l,
                        (r.e < 0 || 6 < r.e) && (d = !0)) : u = l), o < 1 || o > He(a, l, h) ? f(i)._overflowWeeks = !0 : null != d ? f(i)._overflowWeekday = !0 : (c = Ce(a, o, u, l, h),
                    i._a[0] = c.year, i._dayOfYear = c.dayOfYear)), null != e._dayOfYear && (r = mt(e._a[0], s[0]),
                    (e._dayOfYear > Te(r) || 0 == e._dayOfYear) && (f(e)._overflowDayOfYear = !0),
                    d = Re(r, 0, e._dayOfYear), e._a[1] = d.getUTCMonth(), e._a[2] = d.getUTCDate()),
                t = 0; t < 3 && null == e._a[t]; ++t) e._a[t] = m[t] = s[t];
            for (; t < 7; t++) e._a[t] = m[t] = null == e._a[t] ? 2 == t ? 1 : 0 : e._a[t];
            24 == e._a[3] && 0 == e._a[4] && 0 == e._a[5] && 0 == e._a[6] && (e._nextDay = !0,
                    e._a[3] = 0), e._d = (e._useUTC ? Re : Pe).apply(null, m), a = e._useUTC ? e._d.getUTCDay() : e._d.getDay(),
                null != e._tzm && e._d.setUTCMinutes(e._d.getUTCMinutes() - e._tzm), e._nextDay && (e._a[3] = 24),
                e._w && void 0 !== e._w.d && e._w.d !== a && (f(e).weekdayMismatch = !0);
        }
    }

    function yt(e) {
        if (e._f == n.ISO_8601) ct(e);
        else if (e._f == n.RFC_2822) ft(e);
        else {
            e._a = [], f(e).empty = !0;
            for (var t, s, i, a, o, u = "" + e._i, l = u.length, h = 0, d = F(e._f, e._locale).match(P) || [], c = d.length, m = 0; m < c; m++) s = d[m],
                (t = (u.match(fe(s, e)) || [])[0]) && (0 < (i = u.substr(0, u.indexOf(t))).length && f(e).unusedInput.push(i),
                    u = u.slice(u.indexOf(t) + t.length), h += t.length), C[s] ? (t ? f(e).empty = !1 : f(e).unusedTokens.push(s),
                    i = s, o = e, null != (a = t) && r(ye, i) && ye[i](a, o._a, o, i)) : e._strict && !t && f(e).unusedTokens.push(s);
            f(e).charsLeftOver = l - h, 0 < u.length && f(e).unusedInput.push(u), e._a[3] <= 12 && !0 == f(e).bigHour && 0 < e._a[3] && (f(e).bigHour = void 0),
                f(e).parsedDateParts = e._a.slice(0), f(e).meridiem = e._meridiem, e._a[3] = function(e, t, n) {
                    return null == n ? t : null != e.meridiemHour ? e.meridiemHour(t, n) : null != e.isPM ? ((e = e.isPM(n)) && t < 12 && (t += 12),
                        t = e || 12 !== t ? t : 0) : t;
                }(e._locale, e._a[3], e._meridiem), null !== (l = f(e).era) && (e._a[0] = e._locale.erasConvertYear(l, e._a[0])),
                _t(e), st(e);
        }
    }

    function gt(e) {
        var t, r, a, c = e._i,
            y = e._f;
        return e._locale = e._locale || nt(e._l), null == c || void 0 == y && "" == c ? _({
            nullInput: !0
        }) : ("string" == typeof c && (e._i = c = e._locale.preparse(c)), v(c) ? new k(st(c)) : (l(c) ? e._d = c : s(y) ? function(e) {
                var t, n, s, i, r, a, o = !1,
                    u = e._f.length;
                if (0 == u) return f(e).invalidFormat = !0, e._d = new Date(NaN);
                for (i = 0; i < u; i++) r = 0, a = !1, t = p({}, e), null != e._useUTC && (t._useUTC = e._useUTC),
                    t._f = e._f[i], yt(t), m(t) && (a = !0), r = (r += f(t).charsLeftOver) + 10 * f(t).unusedTokens.length,
                    f(t).score = r, o ? r < s && (s = r, n = t) : (null == s || r < s || a) && (s = r,
                        n = t, a && (o = !0));
                d(e, n || t);
            }(e) : y ? yt(e) : o(y = (c = e)._i) ? c._d = new Date(n.now()) : l(y) ? c._d = new Date(y.valueOf()) : "string" == typeof y ? (r = c,
                null !== (t = lt.exec(r._i)) ? r._d = new Date(+t[1]) : (ct(r), !1 == r._isValid && (delete r._isValid,
                    ft(r), !1 == r._isValid && (delete r._isValid, r._strict ? r._isValid = !1 : n.createFromInputFallback(r))))) : s(y) ? (c._a = h(y.slice(0), function(e) {
                return parseInt(e, 10);
            }), _t(c)) : i(y) ? (t = c)._d || (a = void 0 == (r = E(t._i)).day ? r.date : r.day,
                t._a = h([r.year, r.month, a, r.hour, r.minute, r.second, r.millisecond], function(e) {
                    return e && parseInt(e, 10);
                }), _t(t)) : u(y) ? c._d = new Date(y) : n.createFromInputFallback(c), m(e) || (e._d = null),
            e));
    }

    function wt(e, t, n, r, o) {
        var u = {};
        return !0 !== t && !1 !== t || (r = t, t = void 0), !0 !== n && !1 !== n || (r = n,
                n = void 0), (i(e) && a(e) || s(e) && 0 == e.length) && (e = void 0), u._isAMomentObject = !0,
            u._useUTC = u._isUTC = o, u._l = n, u._i = e, u._f = t, u._strict = r, (o = new k(st(gt(o = u))))._nextDay && (o.add(1, "d"),
                o._nextDay = void 0), o;
    }

    function pt(e, t, n, s) {
        return wt(e, t, n, s, !1);
    }

    function kt(e, t) {
        var n, i;
        if (!(t = 1 == t.length && s(t[0]) ? t[0] : t).length) return pt();
        for (n = t[0], i = 1; i < t.length; ++i) t[i].isValid() && !t[i][e](n) || (n = t[i]);
        return n;
    }
    n.createFromInputFallback = D("value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.", function(e) {
        e._d = new Date(e._i + (e._useUTC ? " UTC" : ""));
    }), n.ISO_8601 = function() {}, n.RFC_2822 = function() {}, ne = D("moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/", function() {
        var e = pt.apply(null, arguments);
        return this.isValid() && e.isValid() ? e < this ? this : e : _();
    }), se = D("moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/", function() {
        var e = pt.apply(null, arguments);
        return this.isValid() && e.isValid() ? this < e ? this : e : _();
    });
    var vt = ["year", "quarter", "month", "week", "day", "hour", "minute", "second", "millisecond"];

    function Mt(e) {
        var t = (e = E(e)).year || 0,
            n = e.quarter || 0,
            s = e.month || 0,
            i = e.week || e.isoWeek || 0,
            a = e.day || 0,
            o = e.hour || 0,
            u = e.minute || 0,
            l = e.second || 0,
            h = e.millisecond || 0;
        this._isValid = function(e) {
                var t, n, s = !1,
                    i = vt.length;
                for (t in e)
                    if (r(e, t) && (-1 == pe.call(vt, t) || null != e[t] && isNaN(e[t]))) return !1;
                for (n = 0; n < i; ++n)
                    if (e[vt[n]]) {
                        if (s) return !1;
                        parseFloat(e[vt[n]]) !== z(e[vt[n]]) && (s = !0);
                    }
                return !0;
            }(e), this._milliseconds = +h + 1e3 * l + 6e4 * u + 36e5 * o, this._days = +a + 7 * i,
            this._months = +s + 3 * n + 12 * t, this._data = {}, this._locale = nt(), this._bubble();
    }

    function Dt(e) {
        return e instanceof Mt;
    }

    function St(e) {
        return e < 0 ? -1 * Math.round(-1 * e) : Math.round(e);
    }

    function Yt(e, t) {
        U(e, 0, 0, function() {
            var e = this.utcOffset(),
                n = "+";
            return e < 0 && (e = -e, n = "-"), n + N(~~(e / 60), 2) + t + N(~~e % 60, 2);
        });
    }
    Yt("Z", ":"), Yt("ZZ", ""), ce("Z", he), ce("ZZ", he), ge(["Z", "ZZ"], function(e, t, n) {
        n._useUTC = !0, n._tzm = bt(he, e);
    });
    var Ot = /([\+\-]|\d\d)/gi;

    function bt(e, t) {
        return null == (t = (t || "").match(e)) ? null : 0 == (t = 60 * (e = ((t[t.length - 1] || []) + "").match(Ot) || ["-", 0, 0])[1] + z(e[2])) ? 0 : "+" == e[0] ? t : -t;
    }

    function xt(e, t) {
        var s;
        return t._isUTC ? (t = t.clone(), s = (v(e) || l(e) ? e : pt(e)).valueOf() - t.valueOf(),
            t._d.setTime(t._d.valueOf() + s), n.updateOffset(t, !1), t) : pt(e).local();
    }

    function Tt(e) {
        return -Math.round(e._d.getTimezoneOffset());
    }

    function Nt() {
        return !!this.isValid() && this._isUTC && 0 == this._offset;
    }
    n.updateOffset = function() {};
    var Pt = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/,
        Rt = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

    function Wt(t, n) {
        var s, i = t,
            a = null;
        return Dt(t) ? i = {
                ms: t._milliseconds,
                d: t._days,
                M: t._months
            } : u(t) || !isNaN(+t) ? (i = {}, n ? i[n] = +t : i.milliseconds = +t) : (a = Pt.exec(t)) ? (s = "-" == a[1] ? -1 : 1,
                i = {
                    y: 0,
                    d: z(a[2]) * s,
                    h: z(a[3]) * s,
                    m: z(a[4]) * s,
                    s: z(a[5]) * s,
                    ms: z(St(1e3 * a[6])) * s
                }) : (a = Rt.exec(t)) ? (s = "-" == a[1] ? -1 : 1, i = {
                y: Ct(a[2], s),
                M: Ct(a[3], s),
                w: Ct(a[4], s),
                d: Ct(a[5], s),
                h: Ct(a[6], s),
                m: Ct(a[7], s),
                s: Ct(a[8], s)
            }) : null == i ? i = {} : "object" == typeof(i) && ("from" in i || "to" in i) && (n = function(e, t) {
                var n;
                return e.isValid() && t.isValid() ? (t = xt(t, e), e.isBefore(t) ? n = Ut(e, t) : ((n = Ut(t, e)).milliseconds = -n.milliseconds,
                    n.months = -n.months), n) : {
                    milliseconds: 0,
                    months: 0
                };
            }(pt(i.from), pt(i.to)), (i = {}).ms = n.milliseconds, i.M = n.months), a = new Mt(i),
            Dt(t) && r(t, "_locale") && (a._locale = t._locale), Dt(t) && r(t, "_isValid") && (a._isValid = t._isValid),
            a;
    }

    function Ct(e, t) {
        return e = e && parseFloat(e.replace(",", ".")), (isNaN(e) ? 0 : e) * t;
    }

    function Ut(e, t) {
        var n = {};
        return n.months = t.month() - e.month() + 12 * (t.year() - e.year()), e.clone().add(n.months, "M").isAfter(t) && --n.months,
            n.milliseconds = +t - +e.clone().add(n.months, "M"), n;
    }

    function Ht(e, t) {
        return function(n, s) {
            var i;
            return null == s || isNaN(+s) || (Y(t, "moment()." + t + "(period, number) is deprecated. Please use moment()." + t + "(number, period). See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info."),
                i = n, n = s, s = i), Ft(this, Wt(n, s), e), this;
        };
    }

    function Ft(e, t, s, i) {
        var r = t._milliseconds,
            a = St(t._days);
        t = St(t._months), e.isValid() && (i = null == i || i, t && Oe(e, q(e, "Month") + t * s),
            a && B(e, "Date", q(e, "Date") + a * s), r && e._d.setTime(e._d.valueOf() + r * s),
            i && n.updateOffset(e, a || t));
    }

    function Lt(e) {
        return "string" == typeof e || e instanceof String;
    }

    function Vt(e) {
        return v(e) || l(e) || Lt(e) || u(e) || function(e) {
            var t = s(e),
                n = !1;
            return t && (n = 0 == e.filter(function(t) {
                return !u(t) && Lt(e);
            }).length), t && n;
        }(e) || function(e) {
            var t, n = i(e) && !a(e),
                s = !1,
                o = ["years", "year", "y", "months", "month", "M", "days", "day", "d", "dates", "date", "D", "hours", "hour", "h", "minutes", "minute", "m", "seconds", "second", "s", "milliseconds", "millisecond", "ms"],
                u = o.length;
            for (t = 0; t < u; t += 1) s = s || r(e, o[t]);
            return n && s;
        }(e) || null == e;
    }

    function Gt(e, t) {
        if (e.date() < t.date()) return -Gt(t, e);
        var n = 12 * (t.year() - e.year()) + (t.month() - e.month()),
            s = e.clone().add(n, "months");
        return -(n + (t = t - s < 0 ? (t - s) / (s - e.clone().add(n - 1, "months")) : (t - s) / (e.clone().add(1 + n, "months") - s))) || 0;
    }

    function Et(e) {
        return void 0 == e ? this._locale._abbr : (null != (e = nt(e)) && (this._locale = e),
            this);
    }

    function At() {
        return this._locale;
    }
    Wt.fn = Mt.prototype, Wt.invalid = function() {
            return Wt(NaN);
        }, ve = Ht(1, "add"), Le = Ht(-1, "subtract"), n.defaultFormat = "YYYY-MM-DDTHH:mm:ssZ",
        n.defaultFormatUtc = "YYYY-MM-DDTHH:mm:ss[Z]", Ge = D("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.", function(e) {
            return void 0 == e ? this.localeData() : this.locale(e);
        });
    var It, jt = 126227808e5;

    function Zt(e, t) {
        return (e % t + t) % t;
    }

    function zt(e, t, n) {
        return e < 100 && 0 <= e ? new Date(e + 400, t, n) - jt : new Date(e, t, n).valueOf();
    }

    function $t(e, t, n) {
        return e < 100 && 0 <= e ? Date.UTC(e + 400, t, n) - jt : Date.UTC(e, t, n);
    }

    function qt(e, t) {
        return t.erasAbbrRegex(e);
    }

    function Bt() {
        for (var e = [], t = [], n = [], s = [], i = this.eras(), r = 0, a = i.length; r < a; ++r) t.push(me(i[r].name)),
            e.push(me(i[r].abbr)), n.push(me(i[r].narrow)), s.push(me(i[r].name)), s.push(me(i[r].abbr)),
            s.push(me(i[r].narrow));
        this._erasRegex = new RegExp("^(" + s.join("|") + ")", "i"), this._erasNameRegex = new RegExp("^(" + t.join("|") + ")", "i"),
            this._erasAbbrRegex = new RegExp("^(" + e.join("|") + ")", "i"), this._erasNarrowRegex = new RegExp("^(" + n.join("|") + ")", "i");
    }

    function Jt(e, t) {
        U(0, [e, e.length], 0, t);
    }

    function Qt(e, t, n, s, i) {
        var r;
        return null == e ? Ue(this, s, i).year : (r = He(e, s, i), function(e, t, n, s, i) {
            return t = Re((e = Ce(e, t, n, s, i)).year, 0, e.dayOfYear), this.year(t.getUTCFullYear()),
                this.month(t.getUTCMonth()), this.date(t.getUTCDate()), this;
        }.call(this, e, t = r < t ? r : t, n, s, i));
    }
    for (U("N", 0, 0, "eraAbbr"), U("NN", 0, 0, "eraAbbr"), U("NNN", 0, 0, "eraAbbr"),
        U("NNNN", 0, 0, "eraName"), U("NNNNN", 0, 0, "eraNarrow"), U("y", ["y", 1], "yo", "eraYear"),
        U("y", ["yy", 2], 0, "eraYear"), U("y", ["yyy", 3], 0, "eraYear"), U("y", ["yyyy", 4], 0, "eraYear"),
        ce("N", qt), ce("NN", qt), ce("NNN", qt), ce("NNNN", function(e, t) {
            return t.erasNameRegex(e);
        }), ce("NNNNN", function(e, t) {
            return t.erasNarrowRegex(e);
        }), ge(["N", "NN", "NNN", "NNNN", "NNNNN"], function(e, t, n, s) {
            (s = n._locale.erasParse(e, s, n._strict)) ? f(n).era = s: f(n).invalidEra = e;
        }), ce("y", oe), ce("yy", oe), ce("yyy", oe), ce("yyyy", oe), ce("yo", function(e, t) {
            return t._eraYearOrdinalRegex || oe;
        }), ge(["y", "yy", "yyy", "yyyy"], 0), ge(["yo"], function(e, t, n) {
            var s;
            n._locale._eraYearOrdinalRegex && (s = e.match(n._locale._eraYearOrdinalRegex)),
                n._locale.eraYearOrdinalParse ? t[0] = n._locale.eraYearOrdinalParse(e, s) : t[0] = parseInt(e, 10);
        }), U(0, ["gg", 2], 0, function() {
            return this.weekYear() % 100;
        }), U(0, ["GG", 2], 0, function() {
            return this.isoWeekYear() % 100;
        }), Jt("gggg", "weekYear"), Jt("ggggg", "weekYear"), Jt("GGGG", "isoWeekYear"),
        Jt("GGGGG", "isoWeekYear"), V("weekYear", "gg"), V("isoWeekYear", "GG"), I("weekYear", 1),
        I("isoWeekYear", 1), ce("G", ue), ce("g", ue), ce("GG", te, Q), ce("gg", te, Q),
        ce("GGGG", re, K), ce("gggg", re, K), ce("GGGGG", ae, ee), ce("ggggg", ae, ee),
        we(["gggg", "ggggg", "GGGG", "GGGGG"], function(e, t, n, s) {
            t[s.substr(0, 2)] = z(e);
        }), we(["gg", "GG"], function(e, t, s, i) {
            t[i] = n.parseTwoDigitYear(e);
        }), U("Q", 0, "Qo", "quarter"), V("quarter", "Q"), I("quarter", 7), ce("Q", J),
        ge("Q", function(e, t) {
            t[1] = 3 * (z(e) - 1);
        }), U("D", ["DD", 2], "Do", "date"), V("date", "D"), I("date", 9), ce("D", te),
        ce("DD", te, Q), ce("Do", function(e, t) {
            return e ? t._dayOfMonthOrdinalParse || t._ordinalParse : t._dayOfMonthOrdinalParseLenient;
        }), ge(["D", "DD"], 2), ge("Do", function(e, t) {
            t[2] = z(e.match(te)[0]);
        }), re = $("Date", !0), U("DDD", ["DDDD", 3], "DDDo", "dayOfYear"), V("dayOfYear", "DDD"),
        I("dayOfYear", 4), ce("DDD", ie), ce("DDDD", X), ge(["DDD", "DDDD"], function(e, t, n) {
            n._dayOfYear = z(e);
        }), U("m", ["mm", 2], 0, "minute"), V("minute", "m"), I("minute", 14), ce("m", te),
        ce("mm", te, Q), ge(["m", "mm"], 4), K = $("Minutes", !1), U("s", ["ss", 2], 0, "second"),
        V("second", "s"), I("second", 15), ce("s", te), ce("ss", te, Q), ge(["s", "ss"], 5),
        ae = $("Seconds", !1), U("S", 0, 0, function() {
            return ~~(this.millisecond() / 100);
        }), U(0, ["SS", 2], 0, function() {
            return ~~(this.millisecond() / 10);
        }), U(0, ["SSS", 3], 0, "millisecond"), U(0, ["SSSS", 4], 0, function() {
            return 10 * this.millisecond();
        }), U(0, ["SSSSS", 5], 0, function() {
            return 100 * this.millisecond();
        }), U(0, ["SSSSSS", 6], 0, function() {
            return 1e3 * this.millisecond();
        }), U(0, ["SSSSSSS", 7], 0, function() {
            return 1e4 * this.millisecond();
        }), U(0, ["SSSSSSSS", 8], 0, function() {
            return 1e5 * this.millisecond();
        }), U(0, ["SSSSSSSSS", 9], 0, function() {
            return 1e6 * this.millisecond();
        }), V("millisecond", "ms"), I("millisecond", 16), ce("S", ie, J), ce("SS", ie, Q),
        ce("SSS", ie, X), It = "SSSS"; It.length <= 9; It += "S") ce(It, oe);

    function Xt(e, t) {
        t[6] = z(1e3 * ("0." + e));
    }
    for (It = "S"; It.length <= 9; It += "S") ge(It, Xt);

    function Kt(e) {
        return e;
    }

    function en(e, t, n, s) {
        var i = nt();
        return s = c().set(s, t), i[n](s, e);
    }

    function tn(e, t, n) {
        if (u(e) && (t = e, e = void 0), e = e || "", null != t) return en(e, t, n, "month");
        for (var s = [], i = 0; i < 12; i++) s[i] = en(e, i, n, "month");
        return s;
    }

    function nn(e, t, n, s) {
        "boolean" == typeof e ? u(t) && (n = t, t = void 0) : (t = e, e = !1, u(n = t) && (n = t,
            t = void 0)), t = t || "";
        var i, r = nt(),
            a = e ? r._week.dow : 0,
            o = [];
        if (null != n) return en(t, (n + a) % 7, s, "day");
        for (i = 0; i < 7; i++) o[i] = en(t, (i + a) % 7, s, "day");
        return o;
    }
    ee = $("Milliseconds", !1), U("z", 0, 0, "zoneAbbr"), U("zz", 0, 0, "zoneName"),
        (J = k.prototype).add = ve, J.calendar = function(e, t) {
            1 == arguments.length && (arguments[0] ? Vt(arguments[0]) ? (e = arguments[0],
                t = void 0) : function(e) {
                for (var t = i(e) && !a(e), n = !1, s = ["sameDay", "nextDay", "lastDay", "nextWeek", "lastWeek", "sameElse"], o = 0; o < s.length; o += 1) n = n || r(e, s[o]);
                return t && n;
            }(arguments[0]) && (t = arguments[0], e = void 0) : t = e = void 0);
            var s = xt(e = e || pt(), this).startOf("day");
            return s = n.calendarFormat(this, s) || "sameElse", t = t && (O(t[s]) ? t[s].call(this, e) : t[s]),
                this.format(t || this.localeData().calendar(s, this, pt(e)));
        }, J.clone = function() {
            return new k(this);
        }, J.diff = function(e, t, n) {
            var s, i, r;
            if (!this.isValid()) return NaN;
            if (!(s = xt(e, this)).isValid()) return NaN;
            switch (i = 6e4 * (s.utcOffset() - this.utcOffset()), t = G(t)) {
                case "year":
                    r = Gt(this, s) / 12;
                    break;

                case "month":
                    r = Gt(this, s);
                    break;

                case "quarter":
                    r = Gt(this, s) / 3;
                    break;

                case "second":
                    r = (this - s) / 1e3;
                    break;

                case "minute":
                    r = (this - s) / 6e4;
                    break;

                case "hour":
                    r = (this - s) / 36e5;
                    break;

                case "day":
                    r = (this - s - i) / 864e5;
                    break;

                case "week":
                    r = (this - s - i) / 6048e5;
                    break;

                default:
                    r = this - s;
            }
            return n ? r : Z(r);
        }, J.endOf = function(e) {
            var t, s;
            if (void 0 == (e = G(e)) || "millisecond" == e || !this.isValid()) return this;
            switch (s = this._isUTC ? $t : zt, e) {
                case "year":
                    t = s(this.year() + 1, 0, 1) - 1;
                    break;

                case "quarter":
                    t = s(this.year(), this.month() - this.month() % 3 + 3, 1) - 1;
                    break;

                case "month":
                    t = s(this.year(), this.month() + 1, 1) - 1;
                    break;

                case "week":
                    t = s(this.year(), this.month(), this.date() - this.weekday() + 7) - 1;
                    break;

                case "isoWeek":
                    t = s(this.year(), this.month(), this.date() - (this.isoWeekday() - 1) + 7) - 1;
                    break;

                case "day":
                case "date":
                    t = s(this.year(), this.month(), this.date() + 1) - 1;
                    break;

                case "hour":
                    t = this._d.valueOf(), t += 36e5 - Zt(t + (this._isUTC ? 0 : 6e4 * this.utcOffset()), 36e5) - 1;
                    break;

                case "minute":
                    t = this._d.valueOf(), t += 6e4 - Zt(t, 6e4) - 1;
                    break;

                case "second":
                    t = this._d.valueOf(), t += 1e3 - Zt(t, 1e3) - 1;
            }
            return this._d.setTime(t), n.updateOffset(this, !0), this;
        }, J.format = function(e) {
            return e = H(this, e = e || (this.isUtc() ? n.defaultFormatUtc : n.defaultFormat)),
                this.localeData().postformat(e);
        }, J.from = function(e, t) {
            return this.isValid() && (v(e) && e.isValid() || pt(e).isValid()) ? Wt({
                to: this,
                from: e
            }).locale(this.locale()).humanize(!t) : this.localeData().invalidDate();
        }, J.fromNow = function(e) {
            return this.from(pt(), e);
        }, J.to = function(e, t) {
            return this.isValid() && (v(e) && e.isValid() || pt(e).isValid()) ? Wt({
                from: this,
                to: e
            }).locale(this.locale()).humanize(!t) : this.localeData().invalidDate();
        }, J.toNow = function(e) {
            return this.to(pt(), e);
        }, J.get = function(e) {
            return O(this[e = G(e)]) ? this[e]() : this;
        }, J.invalidAt = function() {
            return f(this).overflow;
        }, J.isAfter = function(e, t) {
            return e = v(e) ? e : pt(e), !(!this.isValid() || !e.isValid()) && ("millisecond" == (t = G(t) || "millisecond") ? this.valueOf() > e.valueOf() : e.valueOf() < this.clone().startOf(t).valueOf());
        }, J.isBefore = function(e, t) {
            return e = v(e) ? e : pt(e), !(!this.isValid() || !e.isValid()) && ("millisecond" == (t = G(t) || "millisecond") ? this.valueOf() < e.valueOf() : this.clone().endOf(t).valueOf() < e.valueOf());
        }, J.isBetween = function(e, t, n, s) {
            return e = v(e) ? e : pt(e), t = v(t) ? t : pt(t), !!(this.isValid() && e.isValid() && t.isValid()) && ("(" == (s = s || "()")[0] ? this.isAfter(e, n) : !this.isBefore(e, n)) && (")" == s[1] ? this.isBefore(t, n) : !this.isAfter(t, n));
        }, J.isSame = function(e, t) {
            return e = v(e) ? e : pt(e), !(!this.isValid() || !e.isValid()) && ("millisecond" == (t = G(t) || "millisecond") ? this.valueOf() == e.valueOf() : (e = e.valueOf(),
                this.clone().startOf(t).valueOf() <= e && e <= this.clone().endOf(t).valueOf()));
        }, J.isSameOrAfter = function(e, t) {
            return this.isSame(e, t) || this.isAfter(e, t);
        }, J.isSameOrBefore = function(e, t) {
            return this.isSame(e, t) || this.isBefore(e, t);
        }, J.isValid = function() {
            return m(this);
        }, J.lang = Ge, J.locale = Et, J.localeData = At, J.max = se, J.min = ne, J.parsingFlags = function() {
            return d({}, f(this));
        }, J.set = function(t, n) {
            if ("object" == typeof(t))
                for (var s = function(e) {
                        var t, n = [];
                        for (t in e) r(e, t) && n.push({
                            unit: t,
                            priority: A[t]
                        });
                        return n.sort(function(e, t) {
                            return e.priority - t.priority;
                        }), n;
                    }(t = E(t)), i = s.length, a = 0; a < i; a++) this[s[a].unit](t[s[a].unit]);
            else if (O(this[t = G(t)])) return this[t](n);
            return this;
        }, J.startOf = function(e) {
            var t, s;
            if (void 0 == (e = G(e)) || "millisecond" == e || !this.isValid()) return this;
            switch (s = this._isUTC ? $t : zt, e) {
                case "year":
                    t = s(this.year(), 0, 1);
                    break;

                case "quarter":
                    t = s(this.year(), this.month() - this.month() % 3, 1);
                    break;

                case "month":
                    t = s(this.year(), this.month(), 1);
                    break;

                case "week":
                    t = s(this.year(), this.month(), this.date() - this.weekday());
                    break;

                case "isoWeek":
                    t = s(this.year(), this.month(), this.date() - (this.isoWeekday() - 1));
                    break;

                case "day":
                case "date":
                    t = s(this.year(), this.month(), this.date());
                    break;

                case "hour":
                    t = this._d.valueOf(), t -= Zt(t + (this._isUTC ? 0 : 6e4 * this.utcOffset()), 36e5);
                    break;

                case "minute":
                    t = this._d.valueOf(), t -= Zt(t, 6e4);
                    break;

                case "second":
                    t = this._d.valueOf(), t -= Zt(t, 1e3);
            }
            return this._d.setTime(t), n.updateOffset(this, !0), this;
        }, J.subtract = Le, J.toArray = function() {
            var e = this;
            return [e.year(), e.month(), e.date(), e.hour(), e.minute(), e.second(), e.millisecond()];
        }, J.toObject = function() {
            var e = this;
            return {
                years: e.year(),
                months: e.month(),
                date: e.date(),
                hours: e.hours(),
                minutes: e.minutes(),
                seconds: e.seconds(),
                milliseconds: e.milliseconds()
            };
        }, J.toDate = function() {
            return new Date(this.valueOf());
        }, J.toISOString = function(e) {
            if (!this.isValid()) return null;
            var t = (e = !0 !== e) ? this.clone().utc() : this;
            return t.year() < 0 || 9999 < t.year() ? H(t, e ? "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYYYY-MM-DD[T]HH:mm:ss.SSSZ") : O(Date.prototype.toISOString) ? e ? this.toDate().toISOString() : new Date(this.valueOf() + 6e4 * this.utcOffset()).toISOString().replace("Z", H(t, "Z")) : H(t, e ? "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYY-MM-DD[T]HH:mm:ss.SSSZ");
        }, J.inspect = function() {
            if (!this.isValid()) return "moment.invalid(/* " + this._i + " */)";
            var e, t = "moment",
                n = "";
            return this.isLocal() || (t = 0 == this.utcOffset() ? "moment.utc" : "moment.parseZone",
                    n = "Z"), t = "[" + t + '("]', e = 0 <= this.year() && this.year() <= 9999 ? "YYYY" : "YYYYYY",
                this.format(t + e + "-MM-DD[T]HH:mm:ss.SSS" + n + '[")]');
        }, "undefined" != typeof Symbol && null != Symbol.for && (J[Symbol.for("nodejs.util.inspect.custom")] = function() {
            return "Moment<" + this.format() + ">";
        }), J.toJSON = function() {
            return this.isValid() ? this.toISOString() : null;
        }, J.toString = function() {
            return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
        }, J.unix = function() {
            return Math.floor(this.valueOf() / 1e3);
        }, J.valueOf = function() {
            return this._d.valueOf() - 6e4 * (this._offset || 0);
        }, J.creationData = function() {
            return {
                input: this._i,
                format: this._f,
                locale: this._locale,
                isUTC: this._isUTC,
                strict: this._strict
            };
        }, J.eraName = function() {
            for (var e, t = this.localeData().eras(), n = 0, s = t.length; n < s; ++n) {
                if (e = this.clone().startOf("day").valueOf(), t[n].since <= e && e <= t[n].until) return t[n].name;
                if (t[n].until <= e && e <= t[n].since) return t[n].name;
            }
            return "";
        }, J.eraNarrow = function() {
            for (var e, t = this.localeData().eras(), n = 0, s = t.length; n < s; ++n) {
                if (e = this.clone().startOf("day").valueOf(), t[n].since <= e && e <= t[n].until) return t[n].narrow;
                if (t[n].until <= e && e <= t[n].since) return t[n].narrow;
            }
            return "";
        }, J.eraAbbr = function() {
            for (var e, t = this.localeData().eras(), n = 0, s = t.length; n < s; ++n) {
                if (e = this.clone().startOf("day").valueOf(), t[n].since <= e && e <= t[n].until) return t[n].abbr;
                if (t[n].until <= e && e <= t[n].since) return t[n].abbr;
            }
            return "";
        }, J.eraYear = function() {
            for (var e, t, s = this.localeData().eras(), i = 0, r = s.length; i < r; ++i)
                if (e = s[i].since <= s[i].until ? 1 : -1,
                    t = this.clone().startOf("day").valueOf(), s[i].since <= t && t <= s[i].until || s[i].until <= t && t <= s[i].since) return (this.year() - n(s[i].since).year()) * e + s[i].offset;
            return this.year();
        }, J.year = Ne, J.isLeapYear = function() {
            return j(this.year());
        }, J.weekYear = function(e) {
            return Qt.call(this, e, this.week(), this.weekday(), this.localeData()._week.dow, this.localeData()._week.doy);
        }, J.isoWeekYear = function(e) {
            return Qt.call(this, e, this.isoWeek(), this.isoWeekday(), 1, 4);
        }, J.quarter = J.quarters = function(e) {
            return null == e ? Math.ceil((this.month() + 1) / 3) : this.month(3 * (e - 1) + this.month() % 3);
        }, J.month = be, J.daysInMonth = function() {
            return ke(this.year(), this.month());
        }, J.week = J.weeks = function(e) {
            var t = this.localeData().week(this);
            return null == e ? t : this.add(7 * (e - t), "d");
        }, J.isoWeek = J.isoWeeks = function(e) {
            var t = Ue(this, 1, 4).week;
            return null == e ? t : this.add(7 * (e - t), "d");
        }, J.weeksInYear = function() {
            var e = this.localeData()._week;
            return He(this.year(), e.dow, e.doy);
        }, J.weeksInWeekYear = function() {
            var e = this.localeData()._week;
            return He(this.weekYear(), e.dow, e.doy);
        }, J.isoWeeksInYear = function() {
            return He(this.year(), 1, 4);
        }, J.isoWeeksInISOWeekYear = function() {
            return He(this.isoWeekYear(), 1, 4);
        }, J.date = re, J.day = J.days = function(e) {
            if (!this.isValid()) return null != e ? this : NaN;
            var t, n, s = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
            return null != e ? (t = e, n = this.localeData(), e = "string" != typeof t ? t : isNaN(t) ? "number" == typeof(t = n.weekdaysParse(t)) ? t : null : parseInt(t, 10),
                this.add(e - s, "d")) : s;
        }, J.weekday = function(e) {
            if (!this.isValid()) return null != e ? this : NaN;
            var t = (this.day() + 7 - this.localeData()._week.dow) % 7;
            return null == e ? t : this.add(e - t, "d");
        }, J.isoWeekday = function(e) {
            return this.isValid() ? null != e ? (t = e, n = this.localeData(), n = "string" == typeof t ? n.weekdaysParse(t) % 7 || 7 : isNaN(t) ? null : t,
                this.day(this.day() % 7 ? n : n - 7)) : this.day() || 7 : null != e ? this : NaN;
            var t, n;
        }, J.dayOfYear = function(e) {
            var t = Math.round((this.clone().startOf("day") - this.clone().startOf("year")) / 864e5) + 1;
            return null == e ? t : this.add(e - t, "d");
        }, J.hour = J.hours = de, J.minute = J.minutes = K, J.second = J.seconds = ae, J.millisecond = J.milliseconds = ee,
        J.utcOffset = function(e, t, s) {
            var i, r = this._offset || 0;
            if (!this.isValid()) return null != e ? this : NaN;
            if (null == e) return this._isUTC ? r : Tt(this);
            if ("string" == typeof e) {
                if (null == (e = bt(he, e))) return this;
            } else Math.abs(e) < 16 && !s && (e *= 60);
            return !this._isUTC && t && (i = Tt(this)), this._offset = e, this._isUTC = !0,
                null != i && this.add(i, "m"), r !== e && (!t || this._changeInProgress ? Ft(this, Wt(e - r, "m"), 1, !1) : this._changeInProgress || (this._changeInProgress = !0,
                    n.updateOffset(this, !0), this._changeInProgress = null)), this;
        }, J.utc = function(e) {
            return this.utcOffset(0, e);
        }, J.local = function(e) {
            return this._isUTC && (this.utcOffset(0, e), this._isUTC = !1, e && this.subtract(Tt(this), "m")),
                this;
        }, J.parseZone = function() {
            var e;
            return null != this._tzm ? this.utcOffset(this._tzm, !1, !0) : "string" == typeof this._i && (null != (e = bt(le, this._i)) ? this.utcOffset(e) : this.utcOffset(0, !0)),
                this;
        }, J.hasAlignedHourOffset = function(e) {
            return !!this.isValid() && (e = e ? pt(e).utcOffset() : 0, (this.utcOffset() - e) % 60 == 0);
        }, J.isDST = function() {
            return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset();
        }, J.isLocal = function() {
            return !!this.isValid() && !this._isUTC;
        }, J.isUtcOffset = function() {
            return !!this.isValid() && this._isUTC;
        }, J.isUtc = Nt, J.isUTC = Nt, J.zoneAbbr = function() {
            return this._isUTC ? "UTC" : "";
        }, J.zoneName = function() {
            return this._isUTC ? "Coordinated Universal Time" : "";
        }, J.dates = D("dates accessor is deprecated. Use date instead.", re), J.months = D("months accessor is deprecated. Use month instead", be),
        J.years = D("years accessor is deprecated. Use year instead", Ne), J.zone = D("moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/", function(e, t) {
            return null != e ? (this.utcOffset(e = "string" != typeof e ? -e : e, t), this) : -this.utcOffset();
        }), J.isDSTShifted = D("isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information", function() {
            if (!o(this._isDSTShifted)) return this._isDSTShifted;
            var e, t = {};
            return p(t, this), (t = gt(t))._a ? (e = (t._isUTC ? c : pt)(t._a), this._isDSTShifted = this.isValid() && 0 < function(e, t) {
                for (var n = Math.min(e.length, t.length), s = Math.abs(e.length - t.length), i = 0, r = 0; r < n; r++) z(e[r]) !== z(t[r]) && i++;
                return i + s;
            }(t._a, e.toArray())) : this._isDSTShifted = !1, this._isDSTShifted;
        }), (Q = x.prototype).calendar = function(e, t, n) {
            return O(e = this._calendar[e] || this._calendar.sameElse) ? e.call(t, n) : e;
        }, Q.longDateFormat = function(e) {
            var t = this._longDateFormat[e],
                n = this._longDateFormat[e.toUpperCase()];
            return t || !n ? t : (this._longDateFormat[e] = n.match(P).map(function(e) {
                return "MMMM" == e || "MM" == e || "DD" == e || "dddd" == e ? e.slice(1) : e;
            }).join(""), this._longDateFormat[e]);
        }, Q.invalidDate = function() {
            return this._invalidDate;
        }, Q.ordinal = function(e) {
            return this._ordinal.replace("%d", e);
        }, Q.preparse = Kt, Q.postformat = Kt, Q.relativeTime = function(e, t, n, s) {
            var i = this._relativeTime[n];
            return O(i) ? i(e, t, n, s) : i.replace(/%d/i, e);
        }, Q.pastFuture = function(e, t) {
            return O(e = this._relativeTime[0 < e ? "future" : "past"]) ? e(t) : e.replace(/%s/i, t);
        }, Q.set = function(e) {
            var t, n;
            for (n in e) r(e, n) && (O(t = e[n]) ? this[n] = t : this["_" + n] = t);
            this._config = e, this._dayOfMonthOrdinalParseLenient = new RegExp((this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) + "|" + /\d{1,2}/.source);
        }, Q.eras = function() {
            for (var t, s = this._eras || nt("en")._eras, i = 0, r = s.length; i < r; ++i) {
                switch (typeof(s[i].since)) {
                    case "string":
                        t = n(s[i].since).startOf("day"), s[i].since = t.valueOf();
                }
                switch (typeof(s[i].until)) {
                    case "undefined":
                        s[i].until = 1 / 0;
                        break;

                    case "string":
                        t = n(s[i].until).startOf("day").valueOf(), s[i].until = t.valueOf();
                }
            }
            return s;
        }, Q.erasParse = function(e, t, n) {
            var s, i, r, a, o, u = this.eras();
            for (e = e.toUpperCase(), s = 0, i = u.length; s < i; ++s)
                if (r = u[s].name.toUpperCase(),
                    a = u[s].abbr.toUpperCase(), o = u[s].narrow.toUpperCase(), n) switch (t) {
                    case "N":
                    case "NN":
                    case "NNN":
                        if (a == e) return u[s];
                        break;

                    case "NNNN":
                        if (r == e) return u[s];
                        break;

                    case "NNNNN":
                        if (o == e) return u[s];
                } else if (0 <= [r, a, o].indexOf(e)) return u[s];
        }, Q.erasConvertYear = function(e, t) {
            var s = e.since <= e.until ? 1 : -1;
            return void 0 == t ? n(e.since).year() : n(e.since).year() + (t - e.offset) * s;
        }, Q.erasAbbrRegex = function(e) {
            return r(this, "_erasAbbrRegex") || Bt.call(this), e ? this._erasAbbrRegex : this._erasRegex;
        }, Q.erasNameRegex = function(e) {
            return r(this, "_erasNameRegex") || Bt.call(this), e ? this._erasNameRegex : this._erasRegex;
        }, Q.erasNarrowRegex = function(e) {
            return r(this, "_erasNarrowRegex") || Bt.call(this), e ? this._erasNarrowRegex : this._erasRegex;
        }, Q.months = function(e, t) {
            return e ? (s(this._months) ? this._months : this._months[(this._months.isFormat || De).test(t) ? "format" : "standalone"])[e.month()] : s(this._months) ? this._months : this._months.standalone;
        }, Q.monthsShort = function(e, t) {
            return e ? (s(this._monthsShort) ? this._monthsShort : this._monthsShort[De.test(t) ? "format" : "standalone"])[e.month()] : s(this._monthsShort) ? this._monthsShort : this._monthsShort.standalone;
        }, Q.monthsParse = function(e, t, n) {
            var s, i;
            if (this._monthsParseExact) return function(e, t, n) {
                var s, i, r;
                if (e = e.toLocaleLowerCase(), !this._monthsParse)
                    for (this._monthsParse = [],
                        this._longMonthsParse = [], this._shortMonthsParse = [], s = 0; s < 12; ++s) r = c([2e3, s]),
                        this._shortMonthsParse[s] = this.monthsShort(r, "").toLocaleLowerCase(), this._longMonthsParse[s] = this.months(r, "").toLocaleLowerCase();
                return n ? "MMM" == t ? -1 !== (i = pe.call(this._shortMonthsParse, e)) ? i : null : -1 !== (i = pe.call(this._longMonthsParse, e)) ? i : null : "MMM" == t ? -1 !== (i = pe.call(this._shortMonthsParse, e)) || -1 !== (i = pe.call(this._longMonthsParse, e)) ? i : null : -1 !== (i = pe.call(this._longMonthsParse, e)) || -1 !== (i = pe.call(this._shortMonthsParse, e)) ? i : null;
            }.call(this, e, t, n);
            for (this._monthsParse || (this._monthsParse = [], this._longMonthsParse = [], this._shortMonthsParse = []),
                s = 0; s < 12; s++) {
                if (i = c([2e3, s]), n && !this._longMonthsParse[s] && (this._longMonthsParse[s] = new RegExp("^" + this.months(i, "").replace(".", "") + "$", "i"),
                        this._shortMonthsParse[s] = new RegExp("^" + this.monthsShort(i, "").replace(".", "") + "$", "i")),
                    n || this._monthsParse[s] || (i = "^" + this.months(i, "") + "|^" + this.monthsShort(i, ""),
                        this._monthsParse[s] = new RegExp(i.replace(".", ""), "i")), n && "MMMM" == t && this._longMonthsParse[s].test(e)) return s;
                if (n && "MMM" == t && this._shortMonthsParse[s].test(e)) return s;
                if (!n && this._monthsParse[s].test(e)) return s;
            }
        }, Q.monthsRegex = function(e) {
            return this._monthsParseExact ? (r(this, "_monthsRegex") || xe.call(this), e ? this._monthsStrictRegex : this._monthsRegex) : (r(this, "_monthsRegex") || (this._monthsRegex = Ye),
                this._monthsStrictRegex && e ? this._monthsStrictRegex : this._monthsRegex);
        }, Q.monthsShortRegex = function(e) {
            return this._monthsParseExact ? (r(this, "_monthsRegex") || xe.call(this), e ? this._monthsShortStrictRegex : this._monthsShortRegex) : (r(this, "_monthsShortRegex") || (this._monthsShortRegex = Se),
                this._monthsShortStrictRegex && e ? this._monthsShortStrictRegex : this._monthsShortRegex);
        }, Q.week = function(e) {
            return Ue(e, this._week.dow, this._week.doy).week;
        }, Q.firstDayOfYear = function() {
            return this._week.doy;
        }, Q.firstDayOfWeek = function() {
            return this._week.dow;
        }, Q.weekdays = function(e, t) {
            return t = s(this._weekdays) ? this._weekdays : this._weekdays[e && !0 !== e && this._weekdays.isFormat.test(t) ? "format" : "standalone"], !0 == e ? Fe(t, this._week.dow) : e ? t[e.day()] : t;
        }, Q.weekdaysMin = function(e) {
            return !0 == e ? Fe(this._weekdaysMin, this._week.dow) : e ? this._weekdaysMin[e.day()] : this._weekdaysMin;
        }, Q.weekdaysShort = function(e) {
            return !0 == e ? Fe(this._weekdaysShort, this._week.dow) : e ? this._weekdaysShort[e.day()] : this._weekdaysShort;
        }, Q.weekdaysParse = function(e, t, n) {
            var s, i;
            if (this._weekdaysParseExact) return function(e, t, n) {
                var s, i, r;
                if (e = e.toLocaleLowerCase(), !this._weekdaysParse)
                    for (this._weekdaysParse = [],
                        this._shortWeekdaysParse = [], this._minWeekdaysParse = [], s = 0; s < 7; ++s) r = c([2e3, 1]).day(s),
                        this._minWeekdaysParse[s] = this.weekdaysMin(r, "").toLocaleLowerCase(), this._shortWeekdaysParse[s] = this.weekdaysShort(r, "").toLocaleLowerCase(),
                        this._weekdaysParse[s] = this.weekdays(r, "").toLocaleLowerCase();
                return n ? "dddd" == t ? -1 !== (i = pe.call(this._weekdaysParse, e)) ? i : null : "ddd" == t ? -1 !== (i = pe.call(this._shortWeekdaysParse, e)) ? i : null : -1 !== (i = pe.call(this._minWeekdaysParse, e)) ? i : null : "dddd" == t ? -1 !== (i = pe.call(this._weekdaysParse, e)) || -1 !== (i = pe.call(this._shortWeekdaysParse, e)) || -1 !== (i = pe.call(this._minWeekdaysParse, e)) ? i : null : "ddd" == t ? -1 !== (i = pe.call(this._shortWeekdaysParse, e)) || -1 !== (i = pe.call(this._weekdaysParse, e)) || -1 !== (i = pe.call(this._minWeekdaysParse, e)) ? i : null : -1 !== (i = pe.call(this._minWeekdaysParse, e)) || -1 !== (i = pe.call(this._weekdaysParse, e)) || -1 !== (i = pe.call(this._shortWeekdaysParse, e)) ? i : null;
            }.call(this, e, t, n);
            for (this._weekdaysParse || (this._weekdaysParse = [], this._minWeekdaysParse = [],
                    this._shortWeekdaysParse = [], this._fullWeekdaysParse = []), s = 0; s < 7; s++) {
                if (i = c([2e3, 1]).day(s), n && !this._fullWeekdaysParse[s] && (this._fullWeekdaysParse[s] = new RegExp("^" + this.weekdays(i, "").replace(".", "\\.?") + "$", "i"),
                        this._shortWeekdaysParse[s] = new RegExp("^" + this.weekdaysShort(i, "").replace(".", "\\.?") + "$", "i"),
                        this._minWeekdaysParse[s] = new RegExp("^" + this.weekdaysMin(i, "").replace(".", "\\.?") + "$", "i")),
                    this._weekdaysParse[s] || (i = "^" + this.weekdays(i, "") + "|^" + this.weekdaysShort(i, "") + "|^" + this.weekdaysMin(i, ""),
                        this._weekdaysParse[s] = new RegExp(i.replace(".", ""), "i")), n && "dddd" == t && this._fullWeekdaysParse[s].test(e)) return s;
                if (n && "ddd" == t && this._shortWeekdaysParse[s].test(e)) return s;
                if (n && "dd" == t && this._minWeekdaysParse[s].test(e)) return s;
                if (!n && this._weekdaysParse[s].test(e)) return s;
            }
        }, Q.weekdaysRegex = function(e) {
            return this._weekdaysParseExact ? (r(this, "_weekdaysRegex") || je.call(this), e ? this._weekdaysStrictRegex : this._weekdaysRegex) : (r(this, "_weekdaysRegex") || (this._weekdaysRegex = Ee),
                this._weekdaysStrictRegex && e ? this._weekdaysStrictRegex : this._weekdaysRegex);
        }, Q.weekdaysShortRegex = function(e) {
            return this._weekdaysParseExact ? (r(this, "_weekdaysRegex") || je.call(this), e ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex) : (r(this, "_weekdaysShortRegex") || (this._weekdaysShortRegex = Ae),
                this._weekdaysShortStrictRegex && e ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex);
        }, Q.weekdaysMinRegex = function(e) {
            return this._weekdaysParseExact ? (r(this, "_weekdaysRegex") || je.call(this), e ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex) : (r(this, "_weekdaysMinRegex") || (this._weekdaysMinRegex = Ie),
                this._weekdaysMinStrictRegex && e ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex);
        }, Q.isPM = function(e) {
            return "p" == (e + "").toLowerCase().charAt(0);
        }, Q.meridiem = function(e, t, n) {
            return 11 < e ? n ? "pm" : "PM" : n ? "am" : "AM";
        }, et("en", {
            eras: [{
                since: "0001-01-01",
                until: 1 / 0,
                offset: 1,
                name: "Anno Domini",
                narrow: "AD",
                abbr: "AD"
            }, {
                since: "0000-12-31",
                until: -1 / 0,
                offset: 1,
                name: "Before Christ",
                narrow: "BC",
                abbr: "BC"
            }],
            dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
            ordinal: function(e) {
                var t = e % 10;
                return e + (1 == z(e % 100 / 10) ? "th" : 1 == t ? "st" : 2 == t ? "nd" : 3 == t ? "rd" : "th");
            }
        }), n.lang = D("moment.lang is deprecated. Use moment.locale instead.", et), n.langData = D("moment.langData is deprecated. Use moment.localeData instead.", nt);
    var sn = Math.abs;

    function rn(e, t, n, s) {
        return t = Wt(t, n), e._milliseconds += s * t._milliseconds, e._days += s * t._days,
            e._months += s * t._months, e._bubble();
    }

    function an(e) {
        return e < 0 ? Math.floor(e) : Math.ceil(e);
    }

    function on(e) {
        return 4800 * e / 146097;
    }

    function un(e) {
        return 146097 * e / 4800;
    }

    function ln(e) {
        return function() {
            return this.as(e);
        };
    }

    function hn(e) {
        return function() {
            return this.isValid() ? this._data[e] : NaN;
        };
    }
    ie = ln("ms"), X = ln("s"), ve = ln("m"), se = ln("h"), ne = ln("d"), Le = ln("w"),
        de = ln("M"), K = ln("Q"), ae = ln("y"), ee = hn("milliseconds"), re = hn("seconds"),
        Ne = hn("minutes"), Q = hn("hours");
    var dn = hn("days"),
        cn = hn("months"),
        fn = hn("years"),
        mn = Math.round,
        _n = {
            ss: 44,
            s: 45,
            m: 45,
            h: 22,
            d: 26,
            w: null,
            M: 11
        };
    var yn = Math.abs;

    function gn(e) {
        return (0 < e) - (e < 0) || +e;
    }

    function wn() {
        if (!this.isValid()) return this.localeData().invalidDate();
        var e, t, n, s, i, r, a, o = yn(this._milliseconds) / 1e3,
            u = yn(this._days),
            l = yn(this._months),
            h = this.asSeconds();
        return h ? (e = Z(o / 60), t = Z(e / 60), o %= 60, e %= 60, n = Z(l / 12), l %= 12,
            s = o ? o.toFixed(3).replace(/\.?0+$/, "") : "", i = gn(this._months) !== gn(h) ? "-" : "",
            r = gn(this._days) !== gn(h) ? "-" : "", a = gn(this._milliseconds) !== gn(h) ? "-" : "",
            (h < 0 ? "-" : "") + "P" + (n ? i + n + "Y" : "") + (l ? i + l + "M" : "") + (u ? r + u + "D" : "") + (t || e || o ? "T" : "") + (t ? a + t + "H" : "") + (e ? a + e + "M" : "") + (o ? a + s + "S" : "")) : "P0D";
    }
    var pn = Mt.prototype;
    return pn.isValid = function() {
            return this._isValid;
        }, pn.abs = function() {
            var e = this._data;
            return this._milliseconds = sn(this._milliseconds), this._days = sn(this._days),
                this._months = sn(this._months), e.milliseconds = sn(e.milliseconds), e.seconds = sn(e.seconds),
                e.minutes = sn(e.minutes), e.hours = sn(e.hours), e.months = sn(e.months), e.years = sn(e.years),
                this;
        }, pn.add = function(e, t) {
            return rn(this, e, t, 1);
        }, pn.subtract = function(e, t) {
            return rn(this, e, t, -1);
        }, pn.as = function(e) {
            if (!this.isValid()) return NaN;
            var t, n, s = this._milliseconds;
            if ("month" == (e = G(e)) || "quarter" == e || "year" == e) switch (t = this._days + s / 864e5,
                n = this._months + on(t), e) {
                case "month":
                    return n;

                case "quarter":
                    return n / 3;

                case "year":
                    return n / 12;
            } else switch (t = this._days + Math.round(un(this._months)), e) {
                case "week":
                    return t / 7 + s / 6048e5;

                case "day":
                    return t + s / 864e5;

                case "hour":
                    return 24 * t + s / 36e5;

                case "minute":
                    return 1440 * t + s / 6e4;

                case "second":
                    return 86400 * t + s / 1e3;

                case "millisecond":
                    return Math.floor(864e5 * t) + s;

                default:
                    throw new Error("Unknown unit " + e);
            }
        }, pn.asMilliseconds = ie, pn.asSeconds = X, pn.asMinutes = ve, pn.asHours = se,
        pn.asDays = ne, pn.asWeeks = Le, pn.asMonths = de, pn.asQuarters = K, pn.asYears = ae,
        pn.valueOf = function() {
            return this.isValid() ? this._milliseconds + 864e5 * this._days + this._months % 12 * 2592e6 + 31536e6 * z(this._months / 12) : NaN;
        }, pn._bubble = function() {
            var e = this._milliseconds,
                t = this._days,
                n = this._months,
                s = this._data;
            return 0 <= e && 0 <= t && 0 <= n || e <= 0 && t <= 0 && n <= 0 || (e += 864e5 * an(un(n) + t),
                    n = t = 0), s.milliseconds = e % 1e3, e = Z(e / 1e3), s.seconds = e % 60, e = Z(e / 60),
                s.minutes = e % 60, e = Z(e / 60), s.hours = e % 24, t += Z(e / 24), n += e = Z(on(t)),
                t -= an(un(e)), e = Z(n / 12), n %= 12, s.days = t, s.months = n, s.years = e, this;
        }, pn.clone = function() {
            return Wt(this);
        }, pn.get = function(e) {
            return e = G(e), this.isValid() ? this[e + "s"]() : NaN;
        }, pn.milliseconds = ee, pn.seconds = re, pn.minutes = Ne, pn.hours = Q, pn.days = dn,
        pn.weeks = function() {
            return Z(this.days() / 7);
        }, pn.months = cn, pn.years = fn, pn.humanize = function(t, n) {
            if (!this.isValid()) return this.localeData().invalidDate();
            var s = !1,
                i = _n;
            return "object" == typeof(t) && (n = t, t = !1), "boolean" == typeof t && (s = t), "object" == typeof(n) && (i = Object.assign({}, _n, n),
                null != n.s && null == n.ss && (i.ss = n.s - 1)), n = function(e, t, n, s) {
                var i = Wt(e).abs(),
                    r = mn(i.as("s")),
                    a = mn(i.as("m")),
                    o = mn(i.as("h")),
                    u = mn(i.as("d")),
                    l = mn(i.as("M")),
                    h = mn(i.as("w"));
                return i = mn(i.as("y")), r = (r <= n.ss ? ["s", r] : r < n.s && ["ss", r]) || a <= 1 && ["m"] || a < n.m && ["mm", a] || o <= 1 && ["h"] || o < n.h && ["hh", o] || u <= 1 && ["d"] || u < n.d && ["dd", u],
                    (r = (r = null != n.w ? r || h <= 1 && ["w"] || h < n.w && ["ww", h] : r) || l <= 1 && ["M"] || l < n.M && ["MM", l] || i <= 1 && ["y"] || ["yy", i])[2] = t,
                    r[3] = 0 < +e, r[4] = s,
                    function(e, t, n, s, i) {
                        return i.relativeTime(t || 1, !!n, e, s);
                    }.apply(null, r);
            }(this, !s, i, t = this.localeData()), s && (n = t.pastFuture(+this, n)), t.postformat(n);
        }, pn.toISOString = wn, pn.toString = wn, pn.toJSON = wn, pn.locale = Et, pn.localeData = At,
        pn.toIsoString = D("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)", wn),
        pn.lang = Ge, U("X", 0, 0, "unix"), U("x", 0, 0, "valueOf"), ce("x", ue), ce("X", /[+-]?\d+(\.\d{1,3})?/),
        ge("X", function(e, t, n) {
            n._d = new Date(1e3 * parseFloat(e));
        }), ge("x", function(e, t, n) {
            n._d = new Date(z(e));
        }), n.version = "2.29.2", t = pt, n.fn = J, n.min = function() {
            return kt("isBefore", [].slice.call(arguments, 0));
        }, n.max = function() {
            return kt("isAfter", [].slice.call(arguments, 0));
        }, n.now = function() {
            return Date.now ? Date.now() : +new Date();
        }, n.utc = c, n.unix = function(e) {
            return pt(1e3 * e);
        }, n.months = function(e, t) {
            return tn(e, t, "months");
        }, n.isDate = l, n.locale = et, n.invalid = _, n.duration = Wt, n.isMoment = v,
        n.weekdays = function(e, t, n) {
            return nn(e, t, n, "weekdays");
        }, n.parseZone = function() {
            return pt.apply(null, arguments).parseZone();
        }, n.localeData = nt, n.isDuration = Dt, n.monthsShort = function(e, t) {
            return tn(e, t, "monthsShort");
        }, n.weekdaysMin = function(e, t, n) {
            return nn(e, t, n, "weekdaysMin");
        }, n.defineLocale = tt, n.updateLocale = function(e, t) {
            var n, s;
            return null != t ? (s = Be, null != Je[e] && null != Je[e].parentLocale ? Je[e].set(b(Je[e]._config, t)) : (t = b(s = null != (n = Ke(e)) ? n._config : s, t),
                null == n && (t.abbr = e), (s = new x(t)).parentLocale = Je[e], Je[e] = s), et(e)) : null != Je[e] && (null != Je[e].parentLocale ? (Je[e] = Je[e].parentLocale,
                e == et() && et(e)) : null != Je[e] && delete Je[e]), Je[e];
        }, n.locales = function() {
            return T(Je);
        }, n.weekdaysShort = function(e, t, n) {
            return nn(e, t, n, "weekdaysShort");
        }, n.normalizeUnits = G, n.relativeTimeRounding = function(e) {
            return void 0 == e ? mn : "function" == typeof e && (mn = e, !0);
        }, n.relativeTimeThreshold = function(e, t) {
            return void 0 !== _n[e] && (void 0 == t ? _n[e] : (_n[e] = t, "s" == e && (_n.ss = t - 1), !0));
        }, n.calendarFormat = function(e, t) {
            return (e = e.diff(t, "days", !0)) < -6 ? "sameElse" : e < -1 ? "lastWeek" : e < 0 ? "lastDay" : e < 1 ? "sameDay" : e < 2 ? "nextDay" : e < 7 ? "nextWeek" : "sameElse";
        }, n.prototype = J, n.HTML5_FMT = {
            DATETIME_LOCAL: "YYYY-MM-DDTHH:mm",
            DATETIME_LOCAL_SECONDS: "YYYY-MM-DDTHH:mm:ss",
            DATETIME_LOCAL_MS: "YYYY-MM-DDTHH:mm:ss.SSS",
            DATE: "YYYY-MM-DD",
            TIME: "HH:mm",
            TIME_SECONDS: "HH:mm:ss",
            TIME_MS: "HH:mm:ss.SSS",
            WEEK: "GGGG-[W]WW",
            MONTH: "YYYY-MM"
        }, n;
});