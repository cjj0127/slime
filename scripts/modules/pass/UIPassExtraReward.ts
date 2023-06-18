import { GlobalEventName } from "../common/Events";
import { GameConst } from "../common/Const";
import PassModel from "../../ccstudio/data/PassModel";
import Model from "../../ccstudio/data/Model";
import _PassConfig from "../../ccstudio/config/_PassConfig";
import AssetInfoUI from "../asset/AssetInfoUI";
// n.default = h
const { ccclass, property } = cc._decorator;
@ccclass
export default class UIPassExtraReward extends cc.Component {
    @property(cc.Button)
    btnReceive: cc.Button = null;
    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;
    @property(cc.Label)
    progressText: cc.Label = null;
    uiexp: number = 0;
    onClickReceive() {
        if (Model.pass.receiveExtralRewsrd()) {
            this.uiexp = 0;
            this.setProgress(0);
            var e = Model.pass.exp;
            this.uiexp < e && this.progressTo(e, this.refreshBtnStatus);
        }
        else {
            var t = Model.pass.passId;
            var n = _PassConfig.Instance.get(t).extraRewardId;
            AssetInfoUI.addPopItem(n, this.btnReceive.node);
        }
    }
    onEnable() {
        this.refreshProgress();
        this.refreshBtnStatus();
        cc.director.on(GlobalEventName.PassExtralExpChange, this.onPassExtralChange, this);
    }
    onLoad() {
        this.btnReceive.node.on("click", this.onClickReceive, this);
    }
    onPassExtralChange() {
        this.refreshProgress();
        this.refreshBtnStatus();
    }
    progressTo(e, t) {
        var n = this;
        var o = GameConst.PASS_MAX_EXP;
        e = cc.misc.clampf(e, 0, o);
        var r = this.uiexp;
        var i = .04 * (e - r);
        cc.tween(this.progressBar).to(i, {
            progress: e / o
        }, {
            easing: cc.easing.sineIn,
            onUpdate: function (t, o) {
                return n.tweenProgressExp(r, e, o);
            }
        }).call(function () {
            return t && t.call(n);
        }).start();
    }
    refreshBtnStatus() {
        Model.pass.exp >= GameConst.PASS_MAX_EXP ? this.btnReceive.target.getComponent(cc.Sprite).setState(cc.Sprite.State.NORMAL) : this.btnReceive.target.getComponent(cc.Sprite).setState(cc.Sprite.State.GRAY);
    }
    refreshProgress() {
        var e = Model.pass.level;
        var t = Model.pass.exp;
        if (e >= GameConst.PASS_MAX_LEVEL) {
            this.setProgress(t);
            this.uiexp = t;
        }
        else {
            this.setProgress(0);
            this.uiexp = 0;
            this.btnReceive.target.getComponent(cc.Sprite).setState(cc.Sprite.State.GRAY);
        }
    }
    setProgress(e) {
        var t = GameConst.PASS_MAX_EXP;
        e = cc.misc.clampf(e, 0, t);
        this.progressBar.progress = e / t;
        this.progressText.string = `${e}/${t}`;
        if (e >= t) {
            this.btnReceive.target.getComponent(cc.Sprite).setState(cc.Sprite.State.NORMAL);
        }
        else {
            this.btnReceive.target.getComponent(cc.Sprite).setState(cc.Sprite.State.GRAY);
        }
    }
    tweenProgressExp(e, t, n) {
        var o = Math.ceil(cc.misc.lerp(e, t, n));
        this.progressText.string = `${o}/${GameConst.PASS_MAX_EXP}`;
    }
}
