const { ccclass, property } = cc._decorator;
@ccclass
export default class MapCtr_ extends cc.Component {
    // @property({ type: cc.Vec2 })
    _map_size: cc.Vec2 = new cc.Vec2(2400, 2400);
    // @property
    followSpeed: number = 400;
    // @property
    isCanTouch: boolean = true;
    // @property
    isMoving: boolean = false;
    @property(cc.Node)
    mapContent: cc.Node = null;
    // @property({ type: cc.Vec2 })
    moveToPos: cc.Vec2 = cc.v2(0, 0);
    @property(cc.Sprite)
    target: cc.Sprite = null;
    getMapScale(): number {
        return this.target.node.scale;
    }
    // private _map_size: cc.Vec2;
    // private isCanTouch: boolean;
    // private isMoving: boolean;
    // private moveToPos: cc.Vec2;
    // @property(cc.Node) mapContent: cc.Node = null;
    // @property(cc.Sprite) target: cc.Sprite = null;
    getMinScale(): number {
        const e = cc.view.getVisibleSize();
        const t = e.width / this._map_size.x;
        const n = e.height / this._map_size.y;
        return t > n ? t : n;
    }
    goboundary(): void {
        const e = cc.view.getVisibleSize();
        const t = this.target.node.scale;
        const n = this.target.node.getAnchorPoint();
        if (e.width / 2 - (this._map_size.x * n.x * t - this.target.node.getPosition().x) > 0) {
            const o = this._map_size.x * n.x * t - e.width / 2;
            this.target.node.setPosition(o, this.target.node.y);
        }
        if (e.height / 2 - (this._map_size.y * n.y * t - this.target.node.getPosition().y) > 0) {
            const r = this._map_size.y * n.y * t - e.height / 2;
            this.target.node.setPosition(this.target.node.x, r);
        }
        if (e.width / 2 - (this._map_size.x * (1 - n.x) * t + this.target.node.getPosition().x) > 0) {
            const o = e.width / 2 - this._map_size.x * (1 - n.x) * t;
            this.target.node.setPosition(o, this.target.node.y);
        }
        if (e.height / 2 - (this._map_size.y * (1 - n.y) * t + this.target.node.getPosition().y) > 0) {
            const r = e.height / 2 - this._map_size.y * (1 - n.y) * t;
            this.target.node.setPosition(this.target.node.x, r);
        }
    }
    onLoad(): void {
        const e = cc.view.getVisibleSize();
        const t = this.getMinScale();
        const o = this.node.parent;
        this.mapContent.on(cc.Node.EventType.TOUCH_START, (e: cc.Event.EventTouch) => {
            if (this.isCanTouch) {
                const t = e.getTouches()[0].getLocation();
                this.isMoving = true;
                this.moveToPos = this.target.node.parent.convertToNodeSpaceAR(t);
            }
        }, this.node);
        this.mapContent.on(cc.Node.EventType.TOUCH_MOVE, (r: cc.Event.EventTouch) => {
            if (this.isCanTouch) {
                const i = r.getTouches();
                if (i.length >= 2) {
                    const a = i[0];
                    const s = i[1];
                    const c = a.getDelta();
                    const l = s.getDelta();
                    const u = o.convertToNodeSpaceAR(a.getLocation());
                    const p = o.convertToNodeSpaceAR(s.getLocation());
                    const f = this.target.node.getAnchorPoint();
                    const d = this._map_size.x * f.x * this.target.node.scale - this.target.node.x + (u.x - p.x) / 2;
                    const h = this._map_size.y * f.y * this.target.node.scale - this.target.node.y + (u.y - p.y) / 2;
                    const g = cc.v2(d / (this.target.node.scale * this._map_size.x), h / (this.target.node.scale * this._map_size.y));
                    this.target.node.setAnchorPoint(g);
                    const y = this._map_size.x * (f.x - g.x) * this.target.node.scale;
                    const v = this._map_size.y * (f.y - g.y) * this.target.node.scale;
                    this.target.node.setPosition(this.target.node.x - y, this.target.node.y - v);
                    let _;
                    const m = u.sub(p);
                    const b = c.sub(l);
                    _ = Math.abs(m.x) > Math.abs(m.y) ? (m.x + 0.6 * b.x) / m.x * this.target.node.scale : (m.y + 0.6 * b.y) / m.y * this.target.node.scale;
                    if (this.target.node.scale > 1) {
                        this.target.node.scale = 1;
                    }
                    else if (this.target.node.scale < t) {
                        this.target.node.scale = t;
                    }
                    else {
                        this.target.node.scale = _;
                    }
                    this.goboundary();
                }
                else if (1 == i.length) {
                    const b = r.getDelta();
                    const I = this.target.node.scale;
                    const C = this.target.node.getAnchorPoint().x;
                    const P = this.target.node.getAnchorPoint().y;
                    if (e.width / 2 - (this._map_size.x * C * I - this.target.node.getPosition().x) <= 0 && e.width / 2 - (this._map_size.x * (1 - C) * I + this.target.node.getPosition().x) <= 0) {
                        this.target.node.x += b.x;
                    }
                    if (e.height / 2 - (this._map_size.y * P * I - this.target.node.getPosition().y) <= 0 && e.height / 2 - (this._map_size.y * (1 - P) * I + this.target.node.getPosition().y) <= 0) {
                        this.target.node.y += b.y;
                    }
                }
            }
        }, this.node);
        this.mapContent.on(cc.Node.EventType.TOUCH_END, () => {
            if (this.isCanTouch) {
                this.isMoving = false;
                this.goboundary();
            }
        }, this.node);
    }
    setCanTouch(e: boolean): void {
        this.isCanTouch = e;
    }
    setMapScale(e: number): void {
        this.target.node.scale = e;
    }
}
