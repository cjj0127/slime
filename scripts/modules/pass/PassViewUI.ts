import { EOpenUIType, EInsertAdType } from "../common/ViedioType";
import LanMgr from "../common/Language";
import { GlobalEventName } from "../common/Events";
import { GameConst, DAY_SECONDS } from "../common/Const";
import AdsModel from "../../ccstudio/data/AdsModel";
import PassModel from "../../ccstudio/data/PassModel";
import Model from "../../ccstudio/data/Model";
import MyTools from "../../ccstudio/utils/MyTools";
import ViewAnimCtrl from "../../ccstudio/display/ViewAnimCtrl";
// n.default = b
const m: any = window["moment"];
const { ccclass, property } = cc._decorator;
@ccclass
export default class PassViewUI extends cc.Component {
    @property(cc.Button)
    btnBuyPremium: cc.Button = null;
    @property(cc.Button)
    btnClose: cc.Button = null;
    @property(cc.Label)
    countLabel: cc.Label = null;
    private exp: number;
    private level: number;
    @property(cc.Label)
    levelLabel: cc.Label = null;
    @property(cc.Node)
    locked: cc.Node = null;
    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;
    @property(cc.Label)
    progressText: cc.Label = null;
    @property(cc.Label)
    resetTimeLabel: cc.Label = null;
    fixedUpdate() {
        this.refreshResetTime();
    }
    freshCount() {
        this.countLabel.string = Model.pass.getAdCount() + "/" + Model.pass.getTotalCount();
    }
    onActivePremium() {
        this.refreshPremium();
    }
    async onClickBuyPremium() {
        await Model.pass.requestActivePremium();
        this.freshCount();
    }
    onClickClose() {
        Model.ad.showInterstitial(EInsertAdType.UICloseAd, EOpenUIType.Pass);
        this.getComponent(ViewAnimCtrl).onClose();
    }
    onDisable() {
        cc.director.targetOff(this);
        this.unscheduleAllCallbacks();
        Model.ad.hideBanner();
    }
    // private progressBar: cc.ProgressBar;
    // private progressText: cc.Label;
    // private levelLabel: cc.Label;
    // private resetTimeLabel: cc.Label;
    // private btnClose: cc.Button;
    // private btnBuyPremium: cc.Button;
    // private countLabel: cc.Label;
    onEnable() {
        this.level = Model.pass.level;
        this.setLevel(this.level);
        this.exp = this.level >= GameConst.PASS_MAX_LEVEL ? GameConst.PASS_MAX_EXP : Model.pass.exp;
        this.setProgress(this.exp, GameConst.PASS_MAX_EXP);
        this.refreshPremium();
        this.btnBuyPremium.node.on("click", this.onClickBuyPremium, this);
        cc.director.on(GlobalEventName.PassActivePremium, this.onActivePremium, this);
        cc.director.on(GlobalEventName.PassLevelChange, this.onLevelChange, this);
        cc.director.on(GlobalEventName.PassExpChange, this.onExpChange, this);
        this.btnClose.node.on("click", this.onClickClose, this);
        this.refreshResetTime();
        this.schedule(this.fixedUpdate, 1, cc.macro.REPEAT_FOREVER);
        this.freshCount();
        Model.ad.showBanner(EOpenUIType.Pass, true);
    }
    onExpChange() {
        let e = Model.pass.exp;
        if (this.level < GameConst.PASS_MAX_LEVEL) {
            this.progressTo(Model.pass.level, e, GameConst.PASS_MAX_EXP);
        }
    }
    onLevelChange() {
        let e = Model.pass.level;
        let t = Model.pass.exp;
        if (this.level < GameConst.PASS_MAX_LEVEL) {
            this.progressTo(e, t, GameConst.PASS_MAX_EXP);
        }
    }
    progressTo(e: number, t: number, n: number) {
        let r = this;
        let i = this.exp;
        let a = Math.min(GameConst.PASS_MAX_EXP, t);
        if (this.level == e) {
            let s = 0.01 * (a - i);
            cc.tween(this.progressBar).to(s, {
                progress: a / n
            }, {
                easing: cc.easing.sineIn,
                onUpdate() {
                    return r.tweenProgressExp(i, a, t);
                }
            }).start();
        }
        else {
            let l = this.level;
            let u: cc.Tween[] = [];
            if (l + 1 < GameConst.PASS_MAX_LEVEL) {
                let p = e - this.level - 1;
                if (p > 0) {
                    u.push(cc.tween().set({ progress: 0 }).to(0.01 * n, {
                        progress: 1
                    }, {
                        onUpdate() {
                            return r.tweenProgressExp(0, n, t);
                        }
                    }).call(() => {
                        r.setLevel(++l);
                    }));
                    u.push(cc.tween().repeat(p, cc.tween().set({
                        progress: 0
                    }).to(0.01 * n, {
                        progress: 1
                    }, {
                        onUpdate() {
                            return r.tweenProgressExp(0, n, t);
                        }
                    }).call(() => {
                        r.setLevel(++l);
                    })));
                }
                if (l + 1 + p < GameConst.PASS_MAX_LEVEL) {
                    u.push(cc.tween().set({ progress: 0 }).to(0.01 * a, {
                        progress: a / n
                    }, {
                        easing: cc.easing.sineOut,
                        onUpdate() {
                            return r.tweenProgressExp(0, a, t);
                        }
                    }));
                }
            }
            if (u.length > 1) {
                let o = cc.tween(this.progressBar);
                o.sequence.apply(o, u).start();
            }
            else {
                cc.tween(this.progressBar).then(u[0]).start();
            }
        }
        this.exp = a;
        this.level = e;
    }
    refreshPremium(): void {
        const e: boolean = Model.pass.premiumActive;
        this.btnBuyPremium.node.active = !e;
        this.locked.active = !Model.pass.premiumActive;
    }
    refreshResetTime() {
        let e = Model.pass.resetPassTime;
        let t = m(MyTools.GetTimeNow());
        let n = e.diff(t);
        if (n > DAY_SECONDS) {
            let o = LanMgr.Instance.getLangByID("days");
            this.resetTimeLabel.string = LanMgr.Instance.getLangByID("Time Remaining") + " " + Math.floor(n / (1e3 * DAY_SECONDS)) + o +
                " " + m.utc(n).format("HH:mm:ss");
        }
        else {
            this.resetTimeLabel.string = LanMgr.Instance.getLangByID("Time Remaining") + " " + m.utc(n).format("HH:mm:ss");
        }
    }
    setLevel(e: number) {
        e = Math.min(e, GameConst.PASS_MAX_LEVEL);
        this.levelLabel.string = `${e}`;
    }
    setProgress(e: number, t: number) {
        this.progressBar.progress = e / t;
        this.progressText.string = `${e}/${t}`;
    }
    // @property(cc.Label)
    // levelLabel: cc.Label = null;
    // @property(cc.ProgressBar)
    // progressBar: cc.ProgressBar = null;
    // @property(cc.Label)
    // progressText: cc.Label = null;
    // @property(cc.Node)
    // btnBuyPremium: cc.Node = null;
    // @property(cc.Node)
    // locked: cc.Node = null;
    // @property(cc.Label)
    // resetTimeLabel: cc.Label = null;
    // @property(cc.Label)
    // countLabel: cc.Label = null;
    // @property(cc.Node)
    // btnClose: cc.Node = null;
    // level: number = 0;
    // exp: number = 0;
    // private moment = globalThis.moment;
    tweenProgressExp(e: number, t: number, n: number): void {
        const o: number = Math.ceil(cc.misc.lerp(e, t, n));
        this.progressText.string = `${o}/${GameConst.PASS_MAX_EXP}`;
    }
}
