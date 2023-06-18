const { ccclass, property, executeInEditMode } = cc._decorator;
@ccclass
@executeInEditMode
export default class SceneLayerCtrl extends cc.Component {
    _layoutDirty = false;
    cameraNode = null;
    index = 0;
    @property({
        range: [0, 1],
        tooltip: "1相对静止",
        displayName: "移动缩放值"
    })
    moveScale = 0;
    _addChildrenEventListeners() {
        for (let n of this.node.children) {
            n.on(cc.Node.EventType.SCALE_CHANGED, this._doLayoutDirty, this);
            n.on(cc.Node.EventType.SIZE_CHANGED, this._doLayoutDirty, this);
            n.on(cc.Node.EventType.POSITION_CHANGED, this._doLayoutDirty, this);
            n.on(cc.Node.EventType.ANCHOR_CHANGED, this._doLayoutDirty, this);
        }
    }
    _addEventListeners() {
        cc.director.on(cc.Director.EVENT_AFTER_UPDATE, this.updateLayout, this);
        this.node.on(cc.Node.EventType.CHILD_ADDED, this._childAdded, this);
        this.node.on(cc.Node.EventType.CHILD_REMOVED, this._childRemoved, this);
        this._addChildrenEventListeners();
    }
    _childAdded(e: cc.Node) {
        e.on(cc.Node.EventType.SCALE_CHANGED, this._doLayoutDirty, this);
        e.on(cc.Node.EventType.SIZE_CHANGED, this._doLayoutDirty, this);
        e.on(cc.Node.EventType.POSITION_CHANGED, this._doLayoutDirty, this);
        e.on(cc.Node.EventType.ANCHOR_CHANGED, this._doLayoutDirty, this);
        this._doLayoutDirty();
    }
    _childRemoved(e: cc.Node) {
        e.off(cc.Node.EventType.SCALE_CHANGED, this._doLayoutDirty, this);
        e.off(cc.Node.EventType.SIZE_CHANGED, this._doLayoutDirty, this);
        e.off(cc.Node.EventType.POSITION_CHANGED, this._doLayoutDirty, this);
        e.off(cc.Node.EventType.ANCHOR_CHANGED, this._doLayoutDirty, this);
        this._doLayoutDirty();
    }
    _doLayout() {
        let e = this.node.children, t = 0, n = 0, o = 0, r = 0;
        for (let i of e) {
            if (i.activeInHierarchy) {
                let a = i.anchorX, s = i.anchorY, c = this._getUsedScaleValue(i.scaleX), l = this._getUsedScaleValue(i.scaleY), u = i.width * c, p = i.height * l, f = i.x - u * a, d = i.x + u * (1 - a), h = i.y + p * (1 - s);
                t = Math.min(t, f);
                n = Math.max(n, d);
                o = Math.max(o, h);
            }
        }
        let g = Math.abs(n - t);
        this.node.width = g;
        this.node.height = o;
        this.node.anchorX = Math.abs(t) / g;
    }
    _doLayoutDirty() {
        this._layoutDirty = true;
    }
    _getUsedScaleValue(e: number) {
        return Math.abs(e);
    }
    _removeChildrenEventListeners() {
        for (let n of this.node.children) {
            n.off(cc.Node.EventType.SCALE_CHANGED, this._doLayoutDirty, this);
            n.off(cc.Node.EventType.SIZE_CHANGED, this._doLayoutDirty, this);
            n.off(cc.Node.EventType.POSITION_CHANGED, this._doLayoutDirty, this);
            n.off(cc.Node.EventType.ANCHOR_CHANGED, this._doLayoutDirty, this);
        }
    }
    _removeEventListeners() {
        cc.director.off(cc.Director.EVENT_AFTER_UPDATE, this.updateLayout, this);
        this.node.off(cc.Node.EventType.CHILD_ADDED, this._childAdded, this);
        this.node.off(cc.Node.EventType.CHILD_REMOVED, this._childRemoved, this);
        this._removeChildrenEventListeners();
    }
    onMove(e: number) {
        let t = this.node.x + e * this.moveScale;
        if (t + this.node.width * (1 - this.node.anchorX) < this.cameraNode.x - .5 * this.cameraNode.width - 35) {
            t += 2 * this.node.width;
        }
        this.node.x = t;
    }
    reset() {
        this.node.x = this.cameraNode.x + this.index * this.node.width;
    }
    setCamera(e: cc.Node) {
        this.cameraNode = e;
    }
    // index: number;
    // cameraNode: cc.Node;
    // moveScale: number;
    // _layoutDirty: boolean;
    setSortIdx(e: number) {
        this.index = e;
    }
    updateLayout() {
        if (this._layoutDirty && this.node.children.length > 0 && this.node.children.find(function (e: cc.Node) {
            return e.activeInHierarchy;
        })) {
            this._layoutDirty = false;
            this._doLayout();
        }
    }
}
