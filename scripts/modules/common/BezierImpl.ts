const { ccclass, property } = cc._decorator;
class Bezier {
    public A: number;
    public B: number;
    public C: number;
    public m0: number;
    public m1: number;
    public m2: number;
    public m3: number;
    public mLength: number;
    public p0: cc.Vec2;
    public p1: cc.Vec2;
    public p2: cc.Vec2;
    constructor(p0: cc.Vec2, p1: cc.Vec2, p2: cc.Vec2) {
        const o = p0.x - 2 * p1.x + p2.x;
        const r = p0.y - 2 * p1.y + p2.y;
        const i = 2 * (p1.x - p0.x);
        const a = 2 * (p1.y - p0.y);
        const s = 4 * (o * o + r * r);
        const c = 4 * (o * i + r * a);
        const l = i * i + a * a;
        const u = Math.sqrt(l);
        const p = 8 * Math.pow(s, 1.5);
        const f = (c * c - 4 * s * l) / p;
        const d = 2 * Math.sqrt(s);
        const h = d / p;
        const g = c + d * u;
        const y = f * Math.log(g <= 0 ? 1e-7 : g) - c * h * u;
        const v = s + c;
        const _ = s + v;
        let m = l + v;
        let b = Math.sqrt(m < 0 ? 0 : m);
        m = _ + d * b;
        const I = Math.log(m <= 0 ? 1e-7 : m);
        this.mLength = y - f * I + h * _ * b;
        this.A = s;
        this.B = c;
        this.C = l;
        this.m0 = f;
        this.m1 = d;
        this.m2 = h;
        this.m3 = y;
        this.p0 = p0;
        this.p1 = p1;
        this.p2 = p2;
    }
}
class Point {
    x: number;
    y: number;
}
class BezierCurve {
    private A: number;
    private B: number;
    private C: number;
    private m0: number;
    private m1: number;
    private m2: number;
    private m3: number;
    private mLength: number;
    private p0: Point;
    private p1: Point;
    private p2: Point;
    getLength(): number {
        return this.mLength;
    }
    getPoint(e: number): Point {
        for (let t = this.m3 - e * this.mLength, n = 0; n < 7; ++n) {
            const o = this.A * e, r = this.B + o, i = r + o, a = this.C + e * r, s = Math.sqrt(a < 0 ? 0 : a);
            let c = i + this.m1 * s;
            c = Math.log(c <= 0 ? 1e-7 : c);
            const l = (t - this.m0 * c) / s + this.m2 * i;
            if (e -= l, Math.abs(l) < 0.01) {
                break;
            }
        }
        const u = e * e, p = e + e, f = 1 - p + u;
        return {
            x: f * this.p0.x + p * this.p1.x + u * this.p2.x,
            y: f * this.p0.y + p * this.p1.y + u * this.p2.y
        };
    }
    constructor(p0: Point, p1: Point, p2: Point) {
        this.p0 = p0;
        this.p1 = p1;
        this.p2 = p2;
        this.A = p2.x - 2 * p1.x + p0.x;
        this.B = 2 * (p1.x - p0.x);
        this.C = p0.x;
        this.m0 = Math.sqrt(Math.pow(p0.x - p2.x, 2) + Math.pow(p0.y - p2.y, 2));
        this.m1 = Math.sqrt(Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2)) / this.m0;
        this.m2 = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)) / this.m0;
        this.m3 = 1 / (this.m1 + this.m2 + this.m0);
        this.mLength = 100; // Default value
    }
}
class BezierPath {
    private mLength: number;
    private mMap: Array<{
        first: number;
        second: BezierCurve;
    }>;
    getLength(): number {
        return this.mLength;
    }
    getPoint(e: number): Point {
        e *= this.mLength;
        const t = this.mMap[Math.max(0, this.upperBound(e) - 1)];
        e = (e - t.first) / t.second.getLength();
        return t.second.getPoint(e);
    }
    private sortCommand(e: {
        first: number;
        second: BezierCurve;
    }, t: {
        first: number;
        second: BezierCurve;
    }) {
        return e.first - t.first;
    }
    upperBound(e: number): number {
        let t;
        for (t = 0; t < this.mMap.length && !(this.mMap[t].first > e); ++t)
            ;
        return t;
    }
    constructor(points: Array<Point>) {
        if (points.length < 3)
            throw 1;
        let o = 0;
        let r = points[o++];
        let i = 0;
        const a = [];
        for (let s = 3; s < points.length; ++s) {
            const c = {
                x: (points[o].x + points[o + 1].x) / 2,
                y: (points[o].y + points[o + 1].y) / 2
            };
            const l = new BezierCurve(r, points[o], c);
            a.push({ first: i, second: l });
            i += l.getLength();
            r = c;
            o++;
        }
        const l = new BezierCurve(r, points[o], points[o + 1]);
        a.push({ first: i, second: l });
        i += l.getLength();
        a.sort(this.sortCommand);
        this.mMap = a;
        this.mLength = i;
    }
}
cc.bezierUniformTo = function (e: cc.Node, t: Array<Point>) {
    const n = new BezierPath(t);
    const r = Object.create(null);
    r.progress = function (e: any, t: any, o: any, r: number): {
        x: number;
        y: number;
    } {
        return n.getPoint(r);
    };
    return cc.tween().to(e, { position: t[t.length - 1] }, r);
};
cc.bezierUniformBy = function (e: cc.Node, t: Array<Point>) {
    const n = new BezierPath(t);
    const r = Object.create(null);
    r.progress = function (e: any, t: any, o: any, r: number): {
        x: number;
        y: number;
    } {
        return n.getPoint(r);
    };
    return cc.tween().by(e, { position: t[t.length - 1] }, r);
};
