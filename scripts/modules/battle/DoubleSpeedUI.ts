import { EVideoType } from "../common/ViedioType";
import { COLOR_WHITE } from "../common/Const";
import AdsManager from "../ads/AdsManager";
import Game from "../Game";
import LocalStorageTool from "../../ccstudio/utils/LocalStorage";
import MyTools from "../../ccstudio/utils/MyTools";
const { ccclass, property } = cc._decorator;
const y: any = window["_"];
const g: any = window["moment"];
@ccclass
export default class DoubleSpeedUI extends cc.Component {
    _lastTime = 0;
    doubleActive = false;
    @property(cc.Node)
    doubleNode = null;
    @property(cc.Node)
    grayNode = null;
    @property(cc.Label)
    lastTimeLabel = null;
    fixedUpdate() {
        if (this.doubleActive) {
            this.lastTime -= 1;
            if (this.lastTime <= 0) {
                this.lastTime = 0;
                this.showGray();
                this.doubleActive = false;
                Game.Instance.globalSpeed = 1;
            }
            else {
                this.setTime(this.lastTime);
            }
        }
    }
    onClickDouble() {
        if (!this.doubleActive) {
            const t = {
                AdsType: EVideoType.AdSpeedUp,
                OpenUi: EVideoType.AdSpeedUp,
                onSucceed: () => {
                    this.doubleActive = true;
                    Game.Instance.globalSpeed = 2;
                    this.showTime();
                    this.lastTime = 900;
                    this.setTime(this.lastTime);
                }
            };
            AdsManager.getInstance().showRewardedVideo(t);
        }
    }
    onEnable() {
        this.doubleActive = this.lastTime > 0;
        if (this.doubleActive) {
            Game.Instance.globalSpeed = 2;
        }
        if (this.lastTime <= 0) {
            this.showGray();
        }
        else {
            this.showTime();
            this.setTime(this.lastTime);
        }
        this.schedule(this.fixedUpdate, 1, cc.macro.REPEAT_FOREVER);
    }
    onLoad() {
        this.node.on("click", this.onClickDouble, this);
        const e = LocalStorageTool.getItemLocal("cc_game-double-speed");
        if (y.isNil(e)) {
            this.lastTime = LocalStorageTool.getItemLocal("cc_game-double-speed-lasttime", 0);
        }
        else {
            const t = g(e);
            const n = g(t).add(900, "seconds");
            this.lastTime = n.diff(g(MyTools.GetTimeNow()), "s");
            LocalStorageTool.removeItemLocal("game-double-speed");
        }
    }
    setTime(e: number) {
        this.lastTimeLabel.string = g.utc(1000 * e).format("mm:ss");
    }
    showGray() {
        this.node.getComponent(cc.Button).target.color = cc.color(200, 200, 200);
        this.grayNode.active = true;
        this.doubleNode.active = false;
    }
    showTime() {
        this.node.getComponent(cc.Button).target.color = COLOR_WHITE;
        this.grayNode.active = false;
        this.doubleNode.active = true;
    }
    get lastTime() {
        return this._lastTime;
    }
    set lastTime(value) {
        this._lastTime = value;
        LocalStorageTool.setItemLocal('game-double-speed-lasttime', this._lastTime);
    }
}
