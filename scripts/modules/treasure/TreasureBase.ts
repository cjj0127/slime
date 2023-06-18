const { ccclass, property } = cc._decorator;
@ccclass
export default class TreasureBase extends cc.Component {
    _isActive: boolean = false;
    @property
    treasureId: number = 0;
    onActive() {
    }
    set isActive(value: boolean) {
        if (this._isActive !== value) {
            this._isActive = value;
            this.onActive && this.onActive();
        }
    }
    get isActive(): boolean {
        return this._isActive;
    }
}
