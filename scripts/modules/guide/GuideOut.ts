enum HollowOutShape {
    Rect = 1,
    Circle = 2
}
const { ccclass, property, requireComponent, disallowMultiple, executeInEditMode } = cc._decorator;
@ccclass
@executeInEditMode
@disallowMultiple
@requireComponent(cc.Sprite)
export default class GuideOut extends cc.Component {
    @property()
    _center: cc.Vec2 = cc.v2();
    @property()
    _feather = .5;
    @property()
    _height = 300;
    @property()
    _radius = 200;
    @property()
    _round = 1;
    @property({
        type: cc.Enum(HollowOutShape)
    })
    _shape = HollowOutShape.Rect;
    @property()
    _width = 300;
    material: any = null;
    sprite: cc.Sprite = null;
    tweenRes: Function = null;
    circle(center: cc.Vec2, radius: number, feather: number) {
        this._shape = HollowOutShape.Circle,
            null != center && (this._center = center),
            null != radius && (this._radius = radius),
            null != feather && (this._feather = feather >= 0 ? feather : 0);
        this.material.setProperty("size", this.getNodeSize());
        this.material.setProperty("center", this.getCenter(this._center));
        this.material.setProperty("width", this.getWidth(2 * this._radius));
        this.material.setProperty("height", this.getHeight(2 * this._radius));
        this.material.setProperty("round", this.getRound(this._radius));
        this.material.setProperty("feather", this.getFeather(this._feather));
    }
    circleTo(e, t, n, o) {
        return void 0 === o && (o = 0),
            new Promise((i) => {
                this._shape = HollowOutShape.Circle,
                    cc.Tween.stopAllByTarget(this),
                    this.unscheduleAllCallbacks(),
                    this.tweenRes && this.tweenRes(),
                    this.tweenRes = i,
                    cc.tween(this as GuideOut).to(e, {
                        center: t,
                        radius: n,
                        feather: o
                    }).call(() => {
                        this.scheduleOnce(() => {
                            this.tweenRes && (this.tweenRes(), this.tweenRes = null);
                        });
                    }).start();
            });
    }
    getCenter(e) {
        var t = this.node;
        var n = t.width;
        var o = t.height;
        var r = (e.x + n / 2) / n;
        var i = (-e.y + o / 2) / o;
        return cc.v2(r, i);
    }
    getFeather(e) {
        return e / this.node.width;
    }
    getHeight(e) {
        return e / this.node.width;
    }
    getNodeSize() {
        return cc.v2(this.node.width, this.node.height);
    }
    getRound(e) {
        return e / this.node.width;
    }
    getWidth(e) {
        return e / this.node.width;
    }
    init() {
        this.sprite = this.node.getComponent(cc.Sprite);
        if (this.sprite.spriteFrame) {
            this.sprite.spriteFrame.getTexture().packable = false;
        }
        this.material = this.sprite.getMaterial(0);
        this.sprite.setMaterial(0, this.material);
        this.updateProperties();
    }
    onLoad() {
        this.init();
    }
    rect(center: cc.Vec2, widht: number, height: number, round: number, feather: number) {
        if (this._shape = HollowOutShape.Rect, null != center && (this._center = center), null != widht && (this._width = widht), null != height && (this._height = height), null != round) {
            this._round = round >= 0 ? round : 0;
            var i = Math.min(this._width / 2, this._height / 2);
            this._round = this._round <= i ? this._round : i;
        }
        null != feather && (this._feather = feather >= 0 ? feather : 0, this._feather = this._feather <= this._round ? this._feather : this._round);
        this.material.setProperty("size", this.getNodeSize());
        this.material.setProperty("center", this.getCenter(this._center));
        this.material.setProperty("width", this.getWidth(this._width));
        this.material.setProperty("height", this.getHeight(this._height));
        this.material.setProperty("round", this.getRound(this._round));
        this.material.setProperty("feather", this.getFeather(this._feather));
    }
    rectTo(time: number, center: cc.Vec2, widht: number, height: number, round: number = 0, feather: number = 0) {
        //  void 0 === round && (round = 0),
        //     void 0 === feather && (feather = 0),
        return new Promise((resolve) => {
            this._shape = HollowOutShape.Rect;
            cc.Tween.stopAllByTarget(this);
            this.unscheduleAllCallbacks();
            this.tweenRes && this.tweenRes();
            this.tweenRes = resolve;
            round = Math.min(round, widht / 2, height / 2);
            feather = Math.min(feather, round);
            cc.tween(this as GuideOut).to(time, {
                center: center,
                width: widht,
                height: height,
                round: round,
                feather: feather
            }).call(() => {
                this.scheduleOnce(() => {
                    this.tweenRes && (this.tweenRes(), this.tweenRes = null);
                });
            }).start();
        });
    }
    reset() {
        this.rect(cc.v2(), 0, 0, 0, 0);
    }
    resetInEditor() {
        this.init();
    }
    setNodeSize() {
        var e = this.node;
        var t = e.width;
        var n = e.height;
        this._radius = Math.sqrt(Math.pow(t, 2) + Math.pow(n, 2)) / 2,
            this.rect(e.getPosition(), t, n, 0, 0);
    }
    updateProperties() {
        switch (this._shape) {
            case HollowOutShape.Rect:
                this.rect(this._center, this._width, this._height, this._round, this._feather);
                break;
            case HollowOutShape.Circle:
                this.circle(this._center, this._radius, this._feather);
        }
    }
    @property()
    get center() {
        return this._center;
    }
    set center(e) {
        this._center = e;
        this.updateProperties();
    }
    @property({
        visible: function () {
            return this._shape === HollowOutShape.Circle || this.round > 0;
        }
    })
    get feather() {
        return this._feather;
    }
    set feather(e) {
        this._feather = e;
        this.updateProperties();
    }
    @property({
        visible: function () {
            return this._shape == HollowOutShape.Rect;
        }
    })
    get height() {
        return this._height;
    }
    set height(e) {
        this._height = e;
        this.updateProperties();
    }
    @property({
        visible: function () {
            return this._shape == HollowOutShape.Circle;
        }
    })
    get radius() {
        return this._radius;
    }
    set radius(e) {
        this._radius = e;
        this.updateProperties();
    }
    @property({
        visible: function () {
            return this._shape == HollowOutShape.Rect;
        }
    })
    get round() {
        return this._round;
    }
    set round(e) {
        this._round = e;
        this.updateProperties();
    }
    @property({
        type: cc.Enum(HollowOutShape)
    })
    get shape() {
        return this._shape;
    }
    set shape(e) {
        this._shape = e;
        this.updateProperties();
    }
    @property({
        visible: function () {
            return this._shape == HollowOutShape.Rect;
        }
    })
    get width() {
        return this._width;
    }
    set width(e) {
        this._width = e;
        this.updateProperties();
    }
}
