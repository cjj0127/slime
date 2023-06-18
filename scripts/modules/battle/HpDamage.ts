import NumberPlus from "../../ccstudio/utils/NumberPlus";
// import NumberPlus from "NumberPlus";
const { ccclass, property } = cc._decorator;
@ccclass
export default class HpDamage extends cc.Component {
    private _delegate: any = null;
    @property(cc.Label)
    hp: cc.Label = null;
    complete(): void {
        if (this._delegate) {
            this._delegate.playComplete(this);
        }
    }
    playCritical(): void {
        this.reset();
        this.hp.node.color = cc.Color.RED;
        cc.tween(this.hp.node)
            .parallel(cc.tween().to(0.05, { opacity: 255 }), cc.tween().to(0.12, { scale: 1.1 }))
            .to(0.4, { y: 60 })
            .delay(0.2)
            .call(this.complete, this)
            .start();
    }
    playNormall(): void {
        this.reset();
        this.hp.node.color = cc.Color.WHITE;
        cc.tween(this.hp.node)
            .parallel(cc.tween().to(0.05, { opacity: 255 }), cc.tween().to(0.12, { scale: 1 }))
            .to(0.4, { y: 50 })
            .delay(0.2)
            .call(this.complete, this)
            .start();
    }
    reset(): void {
        this.hp.node.scale = 1.4;
        this.hp.node.opacity = 0;
        this.hp.node.y = 0;
        this.hp.node.stopAllActions();
    }
    setDamage(damage: number, isCritical: boolean): void {
        this.hp.string = NumberPlus.format(damage);
        if (isCritical) {
            this.playCritical();
        }
        else {
            this.playNormall();
        }
    }
    set delegate(value: any) {
        this._delegate = value;
    }
}
