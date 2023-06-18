const _: any = window["_"];
const Big = window['Big'];
Big.DP = 2;
Big.PE = 2e3;
var i = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
for (var a = 0; a < 2; a++) {
    for (var s = 0; s < 26; s++) {
        i.push(String.fromCharCode(65 + a) + String.fromCharCode(65 + s));
    }
}
export default class NumberPlus {
    static add(e, t) {
        return e = new Big(e),
            t = new Big(t),
            e.plus(t).toString();
    }
    static compare(e, t) {
        return e = new Big(e),
            t = new Big(t),
            e.gte(t);
    }
    // static decode(e) {
    // 	if (e.length >= 2) {
    // 		var t = e.search(/[A-z]/i);
    // 		if (t > 0) {
    // 			var n = Math.floor(1e3 * Number(e.substring(0, t)));
    // 			var r = e.substring(t)
    // 			var a = i.indexOf(r)// o.indexOf(i, r);
    // 			return "" + n + new Array(3 * (a - 1) + 1).join("0")
    // 		}
    // 	} return e
    // }
    static decode(str: string): string {
        if (str.length >= 2) {
            var t = str.search(/[A-z]/i);
            if (t > 0) {
                var n = Math.floor(1e3 * _.toNumber(str.substring(0, t))), r = str.substring(t), a = _.indexOf(i, r);
                return "" + n + new Array(3 * (a - 1) + 1).join("0");
            }
        }
        return str;
    }
    static div(e, t) {
        return e = new Big(e),
            t = new Big(t),
            e.div(t).toString();
    }
    static format(t, n = 0) {
        void 0 == n && (n = 2);
        var a = "";
        if ((t = new Big(t).toFixed(0)).length > 3) {
            var s = Math.floor(t.length / 3);
            0 == t.length % 3 && (s -= 1),
                a = i[s],
                t = Number(t.substr(0, t.length - 3 * (s - 1)) / 1e3);
        }
        return NumberPlus.number_format(t, n) + a;
    }
    static lerp(e, t, n) {
        return e = new Big(e),
            t = new Big(t),
            e.plus(t.minus(e).mul(n)).toString();
    }
    static mul(e, t) {
        return e = new Big(e),
            t = new Big(t),
            e.times(t).toString();
    }
    static number_format(e, t) {
        e = (e + "").replace(/[^0-9+-Ee.]/g, "");
        var n = isFinite(+e) ? +e : 0, o = isFinite(+t) ? Math.abs(t) : 0;
        return (o ?
            function (e, t) {
                var n = Math.pow(10, t);
                return "" + Math.ceil(e * n) / n;
            }(n, o) : "" + Math.round(n)).split(".").join(".");
    }
    static percent(e, t, n = 0) {
        return void 0 == n && (n = 2),
            e = new Big(e),
            t = new Big(t),
            e.gte(t) ? 1 : e.div(t).toNumber();
    }
    static sub(e, t) {
        return e = new Big(e),
            t = new Big(t),
            e.minus(t).toString();
    }
}
