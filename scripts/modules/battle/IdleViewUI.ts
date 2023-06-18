import { EOpenUIType } from "../common/ViedioType";
import LanMgr from "../common/Language";
import LanLabel from "../common/LanLabel";
import { GlobalEventName } from "../common/Events";
import { GameConst, MapUIPrefabs } from "../common/Const";
import SubscribeModel from "../../ccstudio/data/SubscribeModel";
import Model from "../../ccstudio/data/Model";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import MyTools from "../../ccstudio/utils/MyTools";
import IdleRewardItemUI from "./IdleRewardItemUI";
import UIPool from "../common/UIPool";
const moment: any = window['moment'];
const { ccclass, property } = cc._decorator;
const E: any = window["_"];
@ccclass
export default class IdleViewUI extends UIPool {
    @property(cc.Button)
    btnBonus: cc.Button = null;
    @property(cc.Button)
    btnReceive: cc.Button = null;
    @property(cc.Label)
    coinsLabel: cc.Label = null;
    @property(cc.Label)
    collectSpeed: cc.Label = null;
    @property(cc.RichText)
    collectTime: cc.RichText = null;
    @property(cc.Layout)
    contentLayout: cc.Layout = null;
    @property(cc.Label)
    nextBonus: cc.Label = null;
    fixedUpdate() {
        this.refreshBonusStatus();
    }
    onBonusReceived() {
        this.refreshBonusStatus();
    }
    onClickBonus() {
        Model.obtain.getBonusEnable() && Model.ui.openViewAsync(MapUIPrefabs.IdleBonusView);
    }
    onClickReceive() {
        //@ts-ignore
        Model.obtain.receiveIdle(this.btnReceive.node.convertToWorldSpaceAR(cc.Vec3.ZERO)) && this.node.emit("remove", this);
    }
    onDisable() {
        this.unscheduleAllCallbacks();
        cc.director.targetOff(this);
        Model.ad.hideBanner();
    }
    onEnable() {
        this.refresh();
        this.refreshBonusStatus();
        Model.obtain.genBonusReward();
        cc.director.on(GlobalEventName.ObtainBonusReceived, this.onBonusReceived, this);
        cc.director.on(GlobalEventName.ObtainRewardUpdate, this.onRewardsUpdate, this);
        this.schedule(this.fixedUpdate.bind(this), 1, cc.macro.REPEAT_FOREVER);
        Model.ad.showBanner(EOpenUIType.Idle);
    }
    onLoad() {
        this.btnBonus.node.on("click", this.onClickBonus, this);
        this.btnReceive.node.on(cc.Node.EventType.TOUCH_END, async () => {
            await SubscribeModel.Instance.checkHangUpSubscribe();
        }, this);
        this.btnReceive.node.on("click", this.onClickReceive, this);
    }
    onRewardsUpdate() {
        this.refresh();
        this.refreshBonusStatus();
    }
    refresh() {
        let t = Model.obtain.getIdleInfo();
        let n = Math.floor(Model.obtain.getCollectTime() / 60);
        this.setCoins(t.coins);
        this.setCollectTime(n);
        this.setCollectSpeed(Model.obtain.getCollectSpeed());
        this.clear();
        let o = t.items;
        E.each(o, (t, n) => {
            let o = parseInt(n);
            let r = this.get();
            r.parent = this.contentLayout.node;
            r.getComponent(IdleRewardItemUI).setItemInfo(o, t);
        });
    }
    refreshBonusStatus() {
        let e = this;
        let t = Model.obtain.getBonusReceivedTime();
        let n = !1;
        let o = moment(MyTools.GetTimeNow());
        if (E.isNil(t))
            n = !0;
        else {
            let r = moment(t).add(GameConst.EXTRA_OBTAINCD, "minutes");
            o.isAfter(r) ? n = !0 : e = r.diff(o, "seconds");
        }
        if (n) {
            this.btnBonus.target.getComponent(cc.Sprite).setState(cc.Sprite.State.NORMAL);
            this.nextBonus.string = LanMgr.Instance.getLangByID("btn_obtain_bonus");
        }
        else {
            this.btnBonus.target.getComponent(cc.Sprite).setState(cc.Sprite.State.GRAY);
            //@ts-ignore
            this.nextBonus.string = moment.utc(1e3 * t).format("mm:ss");
        }
    }
    setCoins(e: any) {
        this.coinsLabel.string = NumberPlus.format(e);
    }
    setCollectSpeed(e: number) {
        this.collectSpeed.string = NumberPlus.format(e) + "/m";
    }
    setCollectTime(e: number) {
        this.collectTime.getComponent(LanLabel).setVars("time", e.toString());
    }
}
// collectTime = null;
// collectSpeed = null;
// coinsLabel = null;
// contentLayout = null;
// btnBonus = null;
// btnReceive = null;
// nextBonus = null;
// async onLoad() {
//     globalThis._;
//     globalThis.moment;
// }
// }
// export { Const, Events, MyTools, Language, LanLabel, AdsModel, ObtainModel, SubscribeModel, UiModel, ViedioType, NumberPlus, UIPool, IdleRewardItemUI };
