//@ts-ignore
cc.Node.prototype.getComponentInParent = function (e) {
    var t = this.getComponent(e);
    if (t instanceof e)
        return t;
    var n = this.getParent();
    return null == n || n instanceof cc.Scene ? null : n.getComponentInParent(e);
};
//@ts-ignore
cc.Component.prototype.getComponentInParent = function (e) {
    var t = this.getComponent(e);
    if (t instanceof e)
        return t;
    var n = this.node.getParent();
    return null == n ? null : n.getComponentInParent(e);
};
cc.Sprite.prototype.setState = function (state: cc.Sprite.State): void {
    if (state == cc.Sprite.State.GRAY) {
        const material = cc.Material.getBuiltinMaterial('2d-gray-sprite');
        this.setMaterial(0, material);
    }
    else {
        const material = cc.Material.getBuiltinMaterial('2d-sprite');
        this.setMaterial(0, material);
    }
};
//@ts-ignore
cc.Director.prototype.calculateDeltaTime = function (time?: number): void {
    time = time || performance.now();
    this._deltaTime = time > this._lastUpdate ? (time - this._lastUpdate) / 1000 : 0;
    if (this._deltaTime < 0 || this._deltaTime > 0.2) {
        this._deltaTime = 1 / 60;
    }
    this._lastUpdate = time;
};
