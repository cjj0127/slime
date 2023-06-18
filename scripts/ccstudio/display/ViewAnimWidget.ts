import AnimViewBase from "./ViewAnimBase";
import { E_Direction } from "../../modules/common/Const";
// import ViewAnimBase from 'ViewAnimBase';
const { ccclass, property, disallowMultiple, menu } = cc._decorator;
@ccclass
@menu('ViewAnim/ViewAnimWidget')
@disallowMultiple
export default class ViewAnimWidget extends AnimViewBase {
    @property({ tooltip: '延迟进入的时间' })
    delayInDuration = 0;
    @property({ tooltip: '延迟退出的时间' })
    delayOutDuration = 0;
    @property({ type: cc.Enum(E_Direction), tooltip: '动画移动的方向' })
    dir = E_Direction.LEFT;
    @property({ tooltip: '是否缓动进入' })
    inEasing = true;
    private initOut = false;
    originPosition = null;
    outPosition = null;
    private tween: cc.Tween;
    private createInAction(e: number): cc.Tween {
        let t: cc.Tween;
        if (this.inEasing) {
            t = cc.tween().to(e, { position: this.originPosition }, { easing: cc.easing.backOut });
        }
        else {
            t = cc.tween().to(e, { position: this.originPosition }, { easing: cc.easing.quartOut });
        }
        return cc.tween().delay(this.delayInDuration).parallel(cc.tween().set({ opacity: 0 }).to(.5 * e, { opacity: 255 }), t);
    }
    private createOutAction(e: number): cc.Tween {
        return cc.tween().delay(this.delayOutDuration).parallel(cc.tween().set({ opacity: 255 }).to(.5 * e, { opacity: 0 }), cc.tween().to(e, { position: this.outPosition }));
    }
    public initialize(): void {
        this.preCreate();
        this.lateCreate();
    }
    private lateCreate(): void {
        this.initOut && (this.node.position = this.outPosition);
    }
    private preCreate(): void {
        switch (this.originPosition = this.node.position, this.dir) {
            case E_Direction.LEFT:
                this.outPosition = this.originPosition.sub(cc.v3(this.node.width, 0, 0));
                break;
            case E_Direction.RIGHT:
                this.outPosition = this.originPosition.add(cc.v3(this.node.width, 0, 0));
                break;
            case E_Direction.TOP:
                this.outPosition = this.originPosition.add(cc.v3(0, this.node.height, 0));
                break;
            case E_Direction.BOTTOM:
                this.outPosition = this.originPosition.sub(cc.v3(0, this.node.height, 0));
        }
    }
    public runInAction_(e: number): void {
        this.tween && this.tween.stop();
        this.node.opacity = 0;
        this.node.position = this.outPosition;
        this.tween = cc.tween(this.node).then(this.createInAction(e)).call(() => {
            this.node.emit("widget-anim-in-done");
        }).start();
    }
    public runOutAction_(e: number): void {
        this.tween && this.tween.stop();
        this.node.opacity = 255;
        this.tween = cc.tween(this.node).then(this.createOutAction(e)).start();
    }
}
