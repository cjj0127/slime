const { ccclass, property } = cc._decorator;
@ccclass
export default class RelicBase extends cc.Component {
    private _isActive = false;
    relicId = 0;
    onActive() { }
    get isActive() {
        return this._isActive;
    }
    set isActive(value) {
        if (this._isActive !== value) {
            this._isActive = value;
            if (this.onActive) {
                this.onActive();
            }
        }
    }
}
