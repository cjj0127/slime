import LanMgr from "../common/Language";
import { GlobalEventName } from "../common/Events";
import { E_SUMMON_TYPE, GameConst, E_ASSET_TYPE, EUNLOCKSYS_ID, Q_COLOR, MapUIPrefabs } from "../common/Const";
import SummonModel from "../../ccstudio/data/SummonModel";
import UiModel from "../../ccstudio/data/UiModel";
import Model from "../../ccstudio/data/Model";
import RedDotParam from "../common/RedDotParam";
import _SummonWidgetConfig from "../../ccstudio/config/_SummonWidgetConfig";
import ToastSummonLvup from "../common/ToastSummonLvup";
import SummonRateViewUI from "./SummonRateViewUI";
import UnlockCtrl from "../unlock/UnlockCtrl";
import UserData from "../user/UserData";
const _: any = window["_"];
const m: any = window["moment"];
const { ccclass, property } = cc._decorator;
@ccclass
export default class SummonItemUI extends RedDotParam {
    @property(cc.Label)
    adCd: cc.Label = null;
    @property(cc.Label)
    adCountLabel: cc.Label = null;
    @property(cc.Label)
    adTitle: cc.Label = null;
    @property(cc.Button)
    btnHelp: cc.Button = null;
    @property(cc.Button)
    btnSummon11: cc.Button = null;
    @property(cc.Button)
    btnSummon35: cc.Button = null;
    @property(cc.Button)
    btnSummonAd: cc.Button = null;
    @property(cc.Node)
    cdNode: cc.Node = null;
    checkUnlock = (e = 0) => {
        if (e == 0)
            e = this.getSysId();
        let unlocked = UnlockCtrl.Instance.isUnlock(e);
        UnlockCtrl.Instance.refreshUnlockNodeState(unlocked, this.node, e);
    };
    @property(cc.Label)
    levelLabel: cc.Label = null;
    onClickSummonAd = async () => {
        let result = await Model.summon.adSummon(this.summonType);
        if (result) {
            this.refreshAdTitle();
            this.refreshAdCount();
            this.refreshBtnAdStatus();
            this.reportSummon("SummonAd");
        }
    };
    @property(cc.Label)
    prgressText: cc.Label = null;
    @property(cc.Label)
    price11Label: cc.Label = null;
    @property(cc.Label)
    price35Label: cc.Label = null;
    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;
    reportSummon = (e) => {
        let t = Model.summon.getLvData(this.summonType);
        let n = {
            Summon_Kind: e,
            Summon_Level: t.level,
            Summon_Total: t.total,
            Summon_Type: E_SUMMON_TYPE[this.summonType]
        };
    };
    @property({ type: cc.Enum(E_SUMMON_TYPE) })
    summonType = E_SUMMON_TYPE.Gear;
    fixedUpdate() {
        this.refreshBtnAdStatus();
        this.refreshAdCount();
    }
    getRedDotParam() {
        return this.summonType;
    }
    getSysId() {
        let id = 0;
        if (this.summonType == E_SUMMON_TYPE.Gear) {
            id = EUNLOCKSYS_ID.Equip;
        }
        else if (this.summonType == E_SUMMON_TYPE.Skill) {
            id = EUNLOCKSYS_ID.Skill;
        }
        else if (this.summonType == E_SUMMON_TYPE.Partner) {
            id = EUNLOCKSYS_ID.Partner;
        }
        return id;
    }
    onClickSummon11() {
        let summonResult = Model.summon.DiamondSummon(this.summonType, GameConst.SUMMON_PRICE_NORMAL);
        if (!_.isEmpty(summonResult)) {
            this.refreshBtnStatus();
            this.reportSummon("10SummonGem");
        }
    }
    onClickSummon35() {
        let summonResult = Model.summon.DiamondSummon(this.summonType, GameConst.SUMMON_PRICE_FULL);
        if (!_.isEmpty(summonResult)) {
            this.refreshBtnStatus();
            this.reportSummon("35SummonGem");
        }
    }
    async onClickSummonRateHelp() {
        const e = Model.summon.getLvData(this.summonType);
        const uiSummonRateView = await Model.ui.openViewAsync(MapUIPrefabs.SummonRateViewUI);
        uiSummonRateView.getComponent(SummonRateViewUI).initData(e.level);
    }
    onDisable() {
        cc.director.targetOff(this);
        this.unscheduleAllCallbacks();
    }
    onEnable() {
        this.refresh();
        this.refreshAdTitle();
        this.refreshAdCount();
        this.refreshBtnStatus();
        this.refreshBtnAdStatus();
        this.checkUnlock();
        this.price11Label.string = "" + GameConst.SUMMON_PRICE_NORMAL;
        this.price35Label.string = "" + GameConst.SUMMON_PRICE_FULL;
        cc.director.on(GlobalEventName.SummonExpChange, this.onExpChange, this);
        cc.director.on(GlobalEventName.SummonLevelChange, this.onSummonLvup, this);
        cc.director.on(GlobalEventName.AssetItemChange + E_ASSET_TYPE.Diamond, this.refreshBtnStatus, this);
        cc.director.on(GlobalEventName.UnlockEquip, this.checkUnlock, this);
        cc.director.on(GlobalEventName.UnlockSkill, this.checkUnlock, this);
        cc.director.on(GlobalEventName.UnlockMastery, this.checkUnlock, this);
        this.schedule(this.fixedUpdate, 1, cc.macro.REPEAT_FOREVER);
    }
    onExpChange(e) {
        if (this.summonType == e) {
            let t = Model.summon.getLvData(this.summonType);
            let maxCount = GameConst.SUMMON_LVUP_COUNTS[t.level - 1];
            let currentProgress = this.progressBar.progress;
            cc.tween(this.progressBar).to(.18, {
                progress: t.count / maxCount
            }, {
                easing: cc.easing.sineIn,
                onUpdate: (elapsedTime, normalizedTime) => {
                    let i = cc.misc.lerp(currentProgress, this.progressBar.progress, normalizedTime);
                    this.prgressText.string = Math.floor(i * maxCount) + "/" + maxCount;
                }
            }).call(() => {
                this.prgressText.string = t.count + "/" + maxCount;
            }).start();
        }
    }
    onLoad() {
        this.btnSummon11.node.on("click", this.onClickSummon11, this);
        this.btnSummon35.node.on("click", this.onClickSummon35, this);
        this.btnSummonAd.node.on("click", this.onClickSummonAd, this);
        this.btnHelp.node.on("click", this.onClickSummonRateHelp, this);
    }
    onSummonLvup(e) {
        if (e == this.summonType) {
            const n = Model.summon.getLvData(this.summonType);
            const o = GameConst.SUMMON_LVUP_COUNTS[n.level - 1];
            let r = this.progressBar.progress;
            cc.tween(this.progressBar).to(0.18, { progress: 1 }, {
                easing: cc.easing.sineIn,
                onUpdate: (a, ratio) => {
                    const i = cc.misc.lerp(r, this.progressBar.progress, ratio);
                    this.prgressText.string = `${Math.floor(i * o)}/${o}`;
                },
            }).call(() => {
                this.setLevel(n.level);
                this.showUpgradeTip();
                let o;
                if (n.level >= GameConst.SUMMON_LVUP_COUNTS.length + 1) {
                    o = _.last(GameConst.SUMMON_LVUP_COUNTS);
                    this.prgressText.string = LanMgr.Instance.getLangByID('Max');
                }
                else {
                    o = GameConst.SUMMON_LVUP_COUNTS[n.level - 1];
                    r = 0;
                    this.progressBar.progress = 0;
                    cc.tween(this.progressBar).to(0.18, {
                        progress: n.count / o,
                    }, {
                        easing: cc.easing.sineIn,
                        onUpdate: (a, ratio) => {
                            const i = cc.misc.lerp(r, this.progressBar.progress, ratio);
                            this.prgressText.string = `${Math.floor(i * o)}/${o}`;
                        },
                    }).call(() => {
                        this.prgressText.string = `${n.count}/${o}`;
                    }).start();
                }
            }).start();
        }
    }
    refresh() {
        let t = Model.summon.getLvData(this.summonType);
        this.setLevel(t.level);
        let e = "";
        if (t.level >= GameConst.SUMMON_LVUP_COUNTS.length + 1) {
            let progression = _.last(GameConst.SUMMON_LVUP_COUNTS);
            e = LanMgr.Instance.getLangByID("Max");
        }
        else {
            let progression = GameConst.SUMMON_LVUP_COUNTS[t.level - 1];
            e = t.count + "/" + progression;
        }
        this.setProgress(t.count, GameConst.SUMMON_LVUP_COUNTS[t.level - 1], e);
    }
    refreshAdCount() {
        const e = Model.summon.getAdCount(this.summonType);
        this.adCountLabel.string = `(${e}/${GameConst.SUMMON_AD_DAILY_COUNT})`;
        this.btnSummonAd.interactable = e > 0;
    }
    refreshAdTitle() {
        const e = Model.summon.calcAdSummonCnt(this.summonType);
        let str = LanMgr.Instance.getLangByID('btn_Summon_count');
        this.adTitle.string = str.replace('%{count}', `${e}`);
    }
    refreshBtnAdStatus() {
        if (Model.summon.getAdCount(this.summonType) > 0) {
            const e = Model.summon.getAdCd(this.summonType);
            this.cdNode.active = e > 0;
            this.adCd.string = m.utc(e * 1000).format('mm:ss');
        }
        else {
            this.cdNode.active = false;
        }
    }
    refreshBtnStatus() {
        const e = parseInt(UserData.Instance.getItem(E_ASSET_TYPE.Diamond));
        this.price11Label.node.color = e >= GameConst.SUMMON_PRICE_NORMAL ? cc.Color.WHITE : cc.Color.RED;
        this.price35Label.node.color = e >= GameConst.SUMMON_PRICE_FULL ? cc.Color.WHITE : cc.Color.RED;
        this.btnSummon11.target.getComponent(cc.Sprite).setState(e >= GameConst.SUMMON_PRICE_NORMAL ? cc.Sprite.State.NORMAL : cc.Sprite.State.GRAY);
        this.btnSummon35.target.getComponent(cc.Sprite).setState(e >= GameConst.SUMMON_PRICE_FULL ? cc.Sprite.State.NORMAL : cc.Sprite.State.GRAY);
    }
    setLevel(e) {
        this.levelLabel.string = `LV${e}`;
    }
    setProgress(e, t, n) {
        this.progressBar.progress = e / t;
        this.prgressText.string = n;
    }
    async showUpgradeTip() {
        const e = Model.summon.getLvData(this.summonType);
        let t = _SummonWidgetConfig.Instance.get(e.level - 1);
        const n = _SummonWidgetConfig.Instance.get(e.level);
        if (t != null && n != null) {
            let o = -1;
            for (let r = 0; r < t.length; r++) {
                const i = t[r];
                const l = n[r];
                if (i == 0 && l > 0) {
                    o = r;
                    break;
                }
            }
            let d;
            if (o > -1) {
                const h = Model.summon.getQualityName(o);
                const v = LanMgr.Instance.getLangByID('UpgradeTip');
                d = v.replace('{s}', `<color=#${Q_COLOR[o + 1]}>${h}</color>`);
            }
            const ui = await Model.ui.openViewAsync(MapUIPrefabs.ToastSummonLvup);
            ui.position = ui.parent.convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(cc.Vec3.ZERO));
            ui.getComponent(ToastSummonLvup).setLevel(e.level - 1, e.level, d);
        }
    }
}
