!function(r) {
    var e, t = "[big.js] ", n = t + "Invalid ", i = n + "decimal places", o = {}, s = void 0, c = /^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;
    function f(r, e, t, n) {
        var i = r.c;
        if (t == s && (t = r.constructor.RM), 0 !== t && 1 !== t && 2 !== t && 3 !== t) throw Error("[big.js] Invalid rounding mode");
        if (e < 1) n = 3 == t && (n || !!i[0]) || 0 == e && (1 == t && i[0] >= 5 || 2 == t && (i[0] > 5 || 5 == i[0] && (n || i[1] !== s))), 
        i.length = 1, n ? (r.e = r.e - e + 1, i[0] = 1) : i[0] = r.e = 0; else if (e < i.length) {
            if (n = 1 == t && i[e] >= 5 || 2 == t && (i[e] > 5 || 5 == i[e] && (n || i[e + 1] !== s || 1 & i[e - 1])) || 3 == t && (n || !!i[0]), 
            i.length = e, n) for (;++i[--e] > 9; ) if (i[e] = 0, 0 == e) {
                ++r.e, i.unshift(1);
                break;
            }
            for (e = i.length; !i[--e]; ) i.pop();
        }
        return r;
    }
    function u(r, e, t) {
        var n = r.e, i = r.c.join(""), o = i.length;
        if (e) i = i.charAt(0) + (o > 1 ? "." + i.slice(1) : "") + (n < 0 ? "e" : "e+") + n; else if (n < 0) {
            for (;++n; ) i = "0" + i;
            i = "0." + i;
        } else if (n > 0) if (++n > o) for (n -= o; n--; ) i += "0"; else n < o && (i = i.slice(0, n) + "." + i.slice(n)); else o > 1 && (i = i.charAt(0) + "." + i.slice(1));
        return r.s < 0 && t ? "-" + i : i;
    }
    o.abs = function() {
        var r = new this.constructor(this);
        return r.s = 1, r;
    }, o.cmp = function(r) {
        var e, t = this, n = t.c, i = (r = new t.constructor(r)).c, o = t.s, s = r.s, c = t.e, f = r.e;
        if (!n[0] || !i[0]) return n[0] ? o : i[0] ? -s : 0;
        if (o != s) return o;
        if (e = o < 0, c != f) return c > f ^ e ? 1 : -1;
        for (s = (c = n.length) < (f = i.length) ? c : f, o = -1; ++o < s; ) if (n[o] != i[o]) return n[o] > i[o] ^ e ? 1 : -1;
        return c == f ? 0 : c > f ^ e ? 1 : -1;
    }, o.div = function(r) {
        var e = this, t = e.constructor, n = e.c, o = (r = new t(r)).c, c = e.s == r.s ? 1 : -1, u = t.DP;
        if (u !== ~~u || u < 0 || u > 1e6) throw Error(i);
        if (!o[0]) throw Error("[big.js] Division by zero");
        if (!n[0]) return r.s = c, r.c = [ r.e = 0 ], r;
        var h, l, a, g, w, v = o.slice(), p = h = o.length, d = n.length, E = n.slice(0, h), m = E.length, b = r, P = b.c = [], D = 0, M = u + (b.e = e.e - r.e) + 1;
        for (b.s = c, c = M < 0 ? 0 : M, v.unshift(0); m++ < h; ) E.push(0);
        do {
            for (a = 0; a < 10; a++) {
                if (h != (m = E.length)) g = h > m ? 1 : -1; else for (w = -1, g = 0; ++w < h; ) if (o[w] != E[w]) {
                    g = o[w] > E[w] ? 1 : -1;
                    break;
                }
                if (!(g < 0)) break;
                for (l = m == h ? o : v; m; ) {
                    if (E[--m] < l[m]) {
                        for (w = m; w && !E[--w]; ) E[w] = 9;
                        --E[w], E[m] += 10;
                    }
                    E[m] -= l[m];
                }
                for (;!E[0]; ) E.shift();
            }
            P[D++] = g ? a : ++a, E[0] && g ? E[m] = n[p] || 0 : E = [ n[p] ];
        } while ((p++ < d || E[0] !== s) && c--);
        return P[0] || 1 == D || (P.shift(), b.e--, M--), D > M && f(b, M, t.RM, E[0] !== s), 
        b;
    }, o.eq = function(r) {
        return 0 == this.cmp(r);
    }, o.gt = function(r) {
        return this.cmp(r) > 0;
    }, o.gte = function(r) {
        return this.cmp(r) > -1;
    }, o.lt = function(r) {
        return this.cmp(r) < 0;
    }, o.lte = function(r) {
        return this.cmp(r) < 1;
    }, o.minus = o.sub = function(r) {
        var e, t, n, i, o = this, s = o.constructor, c = o.s, f = (r = new s(r)).s;
        if (c != f) return r.s = -f, o.plus(r);
        var u = o.c.slice(), h = o.e, l = r.c, a = r.e;
        if (!u[0] || !l[0]) return l[0] ? r.s = -f : u[0] ? r = new s(o) : r.s = 1, r;
        if (c = h - a) {
            for ((i = c < 0) ? (c = -c, n = u) : (a = h, n = l), n.reverse(), f = c; f--; ) n.push(0);
            n.reverse();
        } else for (t = ((i = u.length < l.length) ? u : l).length, c = f = 0; f < t; f++) if (u[f] != l[f]) {
            i = u[f] < l[f];
            break;
        }
        if (i && (n = u, u = l, l = n, r.s = -r.s), (f = (t = l.length) - (e = u.length)) > 0) for (;f--; ) u[e++] = 0;
        for (f = e; t > c; ) {
            if (u[--t] < l[t]) {
                for (e = t; e && !u[--e]; ) u[e] = 9;
                --u[e], u[t] += 10;
            }
            u[t] -= l[t];
        }
        for (;0 == u[--f]; ) u.pop();
        for (;0 == u[0]; ) u.shift(), --a;
        return u[0] || (r.s = 1, u = [ a = 0 ]), r.c = u, r.e = a, r;
    }, o.mod = function(r) {
        var e, t = this, n = t.constructor, i = t.s, o = (r = new n(r)).s;
        if (!r.c[0]) throw Error("[big.js] Division by zero");
        return t.s = r.s = 1, e = 1 == r.cmp(t), t.s = i, r.s = o, e ? new n(t) : (i = n.DP, 
        o = n.RM, n.DP = n.RM = 0, t = t.div(r), n.DP = i, n.RM = o, this.minus(t.times(r)));
    }, o.neg = function() {
        var r = new this.constructor(this);
        return r.s = -r.s, r;
    }, o.plus = o.add = function(r) {
        var e, t, n, i = this, o = i.constructor;
        if (r = new o(r), i.s != r.s) return r.s = -r.s, i.minus(r);
        var s = i.e, c = i.c, f = r.e, u = r.c;
        if (!c[0] || !u[0]) return u[0] || (c[0] ? r = new o(i) : r.s = i.s), r;
        if (c = c.slice(), e = s - f) {
            for (e > 0 ? (f = s, n = u) : (e = -e, n = c), n.reverse(); e--; ) n.push(0);
            n.reverse();
        }
        for (c.length - u.length < 0 && (n = u, u = c, c = n), e = u.length, t = 0; e; c[e] %= 10) t = (c[--e] = c[e] + u[e] + t) / 10 | 0;
        for (t && (c.unshift(t), ++f), e = c.length; 0 == c[--e]; ) c.pop();
        return r.c = c, r.e = f, r;
    }, o.pow = function(r) {
        var e = this, t = new e.constructor("1"), i = t, o = r < 0;
        if (r !== ~~r || r < -1e6 || r > 1e6) throw Error(n + "exponent");
        for (o && (r = -r); 1 & r && (i = i.times(e)), r >>= 1; ) e = e.times(e);
        return o ? t.div(i) : i;
    }, o.prec = function(r, e) {
        if (r !== ~~r || r < 1 || r > 1e6) throw Error(n + "precision");
        return f(new this.constructor(this), r, e);
    }, o.round = function(r, e) {
        if (r == s) r = 0; else if (r !== ~~r || r < -1e6 || r > 1e6) throw Error(i);
        return f(new this.constructor(this), r + this.e + 1, e);
    }, o.sqrt = function() {
        var r, e, n, i = this, o = i.constructor, s = i.s, c = i.e, u = new o("0.5");
        if (!i.c[0]) return new o(i);
        if (s < 0) throw Error(t + "No square root");
        0 == (s = Math.sqrt(i + "")) || s == 1 / 0 ? ((e = i.c.join("")).length + c & 1 || (e += "0"), 
        c = ((c + 1) / 2 | 0) - (c < 0 || 1 & c), r = new o(((s = Math.sqrt(e)) == 1 / 0 ? "5e" : (s = s.toExponential()).slice(0, s.indexOf("e") + 1)) + c)) : r = new o(s + ""), 
        c = r.e + (o.DP += 4);
        do {
            n = r, r = u.times(n.plus(i.div(n)));
        } while (n.c.slice(0, c).join("") !== r.c.slice(0, c).join(""));
        return f(r, (o.DP -= 4) + r.e + 1, o.RM);
    }, o.times = o.mul = function(r) {
        var e, t = this, n = t.constructor, i = t.c, o = (r = new n(r)).c, s = i.length, c = o.length, f = t.e, u = r.e;
        if (r.s = t.s == r.s ? 1 : -1, !i[0] || !o[0]) return r.c = [ r.e = 0 ], r;
        for (r.e = f + u, s < c && (e = i, i = o, o = e, u = s, s = c, c = u), e = new Array(u = s + c); u--; ) e[u] = 0;
        for (f = c; f--; ) {
            for (c = 0, u = s + f; u > f; ) c = e[u] + o[f] * i[u - f - 1] + c, e[u--] = c % 10, 
            c = c / 10 | 0;
            e[u] = c;
        }
        for (c ? ++r.e : e.shift(), f = e.length; !e[--f]; ) e.pop();
        return r.c = e, r;
    }, o.toExponential = function(r, e) {
        var t = this, n = t.c[0];
        if (r !== s) {
            if (r !== ~~r || r < 0 || r > 1e6) throw Error(i);
            for (t = f(new t.constructor(t), ++r, e); t.c.length < r; ) t.c.push(0);
        }
        return u(t, !0, !!n);
    }, o.toFixed = function(r, e) {
        var t = this, n = t.c[0];
        if (r !== s) {
            if (r !== ~~r || r < 0 || r > 1e6) throw Error(i);
            for (r = r + (t = f(new t.constructor(t), r + t.e + 1, e)).e + 1; t.c.length < r; ) t.c.push(0);
        }
        return u(t, !1, !!n);
    }, o.toJSON = o.toString = function() {
        var r = this, e = r.constructor;
        return u(r, r.e <= e.NE || r.e >= e.PE, !!r.c[0]);
    }, o.toNumber = function() {
        var r = Number(u(this, !0, !0));
        if (!0 == this.constructor.strict && !this.eq(r.toString())) throw Error(t + "Imprecise conversion");
        return r;
    }, o.toPrecision = function(r, e) {
        var t = this, i = t.constructor, o = t.c[0];
        if (r !== s) {
            if (r !== ~~r || r < 1 || r > 1e6) throw Error(n + "precision");
            for (t = f(new i(t), r, e); t.c.length < r; ) t.c.push(0);
        }
        return u(t, r <= t.e || t.e <= i.NE || t.e >= i.PE, !!o);
    }, o.valueOf = function() {
        var r = this, e = r.constructor;
        if (!0 == e.strict) throw Error(t + "valueOf disallowed");
        return u(r, r.e <= e.NE || r.e >= e.PE, !0);
    }, (e = function r() {
        function e(t) {
            var i = this;
            if (!(i instanceof e)) return t == s ? r() : new e(t);
            if (t instanceof e) i.s = t.s, i.e = t.e, i.c = t.c.slice(); else {
                if ("string" != typeof t) {
                    if (!0 == e.strict && "bigint" != typeof t) throw TypeError(n + "value");
                    t = 0 == t && 1 / t < 0 ? "-0" : String(t);
                }
                !function(r, e) {
                    var t, i, o;
                    if (!c.test(e)) throw Error(n + "number");
                    for (r.s = "-" == e.charAt(0) ? (e = e.slice(1), -1) : 1, (t = e.indexOf(".")) > -1 && (e = e.replace(".", "")), 
                    (i = e.search(/e/i)) > 0 ? (t < 0 && (t = i), t += +e.slice(i + 1), e = e.substring(0, i)) : t < 0 && (t = e.length), 
                    o = e.length, i = 0; i < o && "0" == e.charAt(i); ) ++i;
                    if (i == o) r.c = [ r.e = 0 ]; else {
                        for (;o > 0 && "0" == e.charAt(--o); ) ;
                        for (r.e = t - i - 1, r.c = [], t = 0; i <= o; ) r.c[t++] = +e.charAt(i++);
                    }
                }(i, t);
            }
            i.constructor = e;
        }
        return e.prototype = o, e.DP = 20, e.RM = 1, e.NE = -7, e.PE = 21, e.strict = !1, 
        e.roundDown = 0, e.roundHalfUp = 1, e.roundHalfEven = 2, e.roundUp = 3, e;
    }()).default = e.Big = e, r.Big = e;
}(window);