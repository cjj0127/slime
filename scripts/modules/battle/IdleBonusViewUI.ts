import { EVideoType } from "../common/ViedioType";
import { GlobalEventName } from "../common/Events";
import AdsManager from "../ads/AdsManager";
import ObtainModel from "../../ccstudio/data/ObtainModel";
import Model from "../../ccstudio/data/Model";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import IdleRewardItemUI from "./IdleRewardItemUI";
import UIPool from "../common/UIPool";
const { ccclass, property } = cc._decorator;
const _: any = window["_"];
@ccclass
export default class IdleBonusViewUI extends UIPool {
    @property(cc.Button)
    btnReceive = null;
    @property(cc.Label)
    coinsLabel = null;
    @property(cc.Layout)
    contentLayout: cc.Layout = null;
    async onClickReceive() {
        const e = () => {
            Model.obtain.receiveBouns(this.btnReceive.node.convertToWorldSpaceAR(cc.Vec3.ZERO)) && this.node.emit("remove", this);
        };
        const t = {
            AdsType: EVideoType.AdObtain,
            OpenUi: EVideoType.AdObtain,
            onSucceed: e
        };
        await AdsManager.getInstance().showRewardedVideo(t);
    }
    onDisable() {
        cc.director.targetOff(this);
    }
    onEnable() {
        this.refresh();
        cc.director.on(GlobalEventName.ObtainRewardUpdate, this.onRewardsUpdate, this);
    }
    onLoad() {
        this.btnReceive.node.on("click", this.onClickReceive, this);
    }
    onRewardsUpdate() {
        this.refresh();
    }
    refresh() {
        const t = Model.obtain.getBunusInfo();
        this.setCoins(t.coins);
        this.clear();
        const n = t.items;
        _.each(n, (t, n) => {
            const o = parseInt(n);
            const r = this.get();
            r.parent = this.contentLayout.node;
            r.getComponent(IdleRewardItemUI).setItemInfo(o, t);
        });
    }
    setCoins(e: any) {
        this.coinsLabel.string = NumberPlus.format(e);
    }
}
