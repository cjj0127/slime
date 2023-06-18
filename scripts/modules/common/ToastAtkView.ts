import { COLOR_GREEN, IMAGE_ICON_PATH_ } from "./Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
const { ccclass, property } = cc._decorator;
enum State {
    NONE,
    OPEN,
    DELAY,
    CLOSE
}
@ccclass
export default class ToastAtkView extends cc.Component {
    @property(cc.Sprite)
    arrawSprite: cc.Sprite = null;
    @property(cc.Label)
    atkAddLabel: cc.Label = null;
    @property(cc.Label)
    atkLabel: cc.Label = null;
    private originSize: cc.Size;
    private running: boolean = false;
    private runningTime: number = 0;
    private state: State = State.NONE;
    lateUpdate(e: number) {
        if (this.running) {
            this.runningTime += e;
            switch (this.state) {
                case State.OPEN:
                    if (this.runningTime >= .1) {
                        this.runningTime = 0;
                        this.node.height = this.originSize.height;
                        this.state = State.DELAY;
                        this.node.stopAllActions();
                        this.node.opacity = 0;
                        cc.tween(this.node).to(.1, { opacity: 255 }).start();
                    }
                    else {
                        this.node.height = cc.misc.lerp(0, this.originSize.height, this.runningTime / .1);
                    }
                    break;
                case State.DELAY:
                    if (this.runningTime >= 2) {
                        this.runningTime = 0;
                        this.state = State.CLOSE;
                        this.node.stopAllActions();
                        cc.tween(this.node).to(.1, { opacity: 0 }).start();
                    }
                    break;
                case State.CLOSE:
                    this.node.height = cc.misc.lerp(this.originSize.height, 0, this.runningTime / .12);
                    if (this.runningTime >= .12) {
                        this.runningTime = 0;
                        this.state = State.NONE;
                        this.running = false;
                        this.node.emit("remove", this);
                    }
                    break;
            }
        }
    }
    onEnable() {
        this.node.height = 0;
        this.node.opacity = 0;
        this.running = true;
        this.runningTime = 0;
        this.state = State.OPEN;
    }
    onLoad() {
        this.originSize = this.node.getContentSize();
    }
    tip(atk: string, atkadd: string, up: boolean) {
        this.atkLabel.string = atk;
        this.atkAddLabel.string = atkadd;
        this.atkAddLabel.node.color = up ? COLOR_GREEN : cc.color().fromHEX("#df1aff");
        const o = up ? `${IMAGE_ICON_PATH_}/icon_arrow_up` : `${IMAGE_ICON_PATH_}/icon_arrow_down`;
        this.arrawSprite.spriteFrame = AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, o);
    }
}
