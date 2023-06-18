import BlessData from "./BlessData";
import { EVideoType } from "../common/ViedioType";
import { GlobalEventName } from "../common/Events";
import { E_QUEST_ACTIVE_ID } from "../common/Const";
import AdsManager from "../ads/AdsManager";
import _BlessLevelConfig from "../../ccstudio/config/_BlessLevelConfig";
import _BlessTypeConfig from "../../ccstudio/config/_BlessTypeConfig";
import Config from "../../ccstudio/configs/Config";
import LanMgr from "../common/Language";
import Model from "../../ccstudio/data/Model";
import IconUI from "../common/IconUI";
const { ccclass, property } = cc._decorator;
const C: any = window["moment"];
const _: any = window["_"];
@ccclass
export default class BlessPropItemUI extends cc.Component {
    @property(cc.Label)
    addtionLabel = null;
    @property(cc.Label)
    descLabel = null;
    @property(cc.Label)
    effectTimeLabel = null;
    @property(cc.ProgressBar)
    expProgress = null;
    @property(cc.Button)
    freeBtn = null;
    @property(IconUI)
    iconSprite: IconUI = null;
    itemData = null;
    @property(cc.Label)
    nameLable = null;
    @property(cc.Button)
    obtainBtn = null;
    @property(cc.Label)
    progressLabel = null;
    @property(cc.Label)
    startLv = null;
    @property(cc.Label)
    timeDescLabel = null;
    addExp() {
        BlessData.Instance.addExp(this.itemData.type, 1);
        this.refreshItem(this.itemData);
    }
    bless() {
        this.addExp();
        this.timeUpdate();
        //debugger	
        var e = Model.bless.getBless(this.itemData.type);
        _.isNil(e) && (e = Model.bless.addNewBless(this.itemData.type));
        var t = Config.blessLevel.take(this.itemData.type, this.itemData.level);
        var n = e.get();
        n.setProp(Model.bless.getBlessProp(this.itemData.type)),
            n.value = t.addition.toString(),
            n.active(),
            cc.director.emit(GlobalEventName.BlessTakeEffect, this.itemData.type),
            cc.director.emit(GlobalEventName.QuestCommit, E_QUEST_ACTIVE_ID.ReceiveBless);
    }
    async init(e) {
        this.itemData = e;
        let t = _BlessTypeConfig.Instance.get(e.type);
        this.nameLable.string = LanMgr.Instance.getLangByID(t.name);
        this.descLabel.string = LanMgr.Instance.getLangByID(t.desc);
        this.timeDescLabel.string = "20" + LanMgr.Instance.getLangByID("minutes");
        this.iconSprite.icon = t.icon;
        this.refreshItem(this.itemData);
    }
    onClickFree() {
        this.bless();
    }
    async onClickObtain() {
        const onSucceed = () => {
            this.bless();
        };
        let t: EVideoType = EVideoType.AdBless1;
        switch (this.itemData.type) {
            case 1:
                t = EVideoType.AdBless1;
                break;
            case 2:
                t = EVideoType.AdBless2;
                break;
            case 3:
                t = EVideoType.AdBless3;
                break;
        }
        const info = {
            AdsType: t,
            OpenUi: t,
            onSucceed: onSucceed
        };
        AdsManager.getInstance().showRewardedVideo(info);
    }
    onDestroy() {
        this.unschedule(this.timeUpdate);
    }
    refreshBtn() {
        const e = (0 == this.itemData.exp && 1 == this.itemData.level);
        this.obtainBtn.node.active = !e && BlessData.Instance.getRemainTime(this.itemData.type) <= 0;
        this.freeBtn.node.active = e;
        this.effectTimeLabel.node.parent.active = BlessData.Instance.getRemainTime(this.itemData.type) > 0;
    }
    refreshItem(e: any) {
        const t = Config.blessLevel.take(e.type, e.level);
        this.effectTimeLabel.string = C.utc(e.remainTime).format("mm:ss");
        this.addtionLabel.string = `${t.addition.toString()}%`;
        const n = Config.blessLevel.maxLevel(e.type);
        this.startLv.string = e.level.toString();
        if (n == e.level) {
            this.expProgress.progress = 1;
            this.progressLabel.string = LanMgr.Instance.getLangByID("MaxLevel");
        }
        else {
            this.expProgress.progress = e.exp / t.exp;
            this.progressLabel.string = `${e.exp.toString()}/${t.exp.toString()}`;
        }
        this.refreshBtn();
        this.timeUpdate();
    }
    start() {
        this.obtainBtn.node.on("click", this.onClickObtain, this);
        this.freeBtn.node.on("click", this.onClickFree, this);
        this.schedule(this.timeUpdate, 1, cc.macro.REPEAT_FOREVER);
    }
    timeUpdate() {
        const e = BlessData.Instance.getRemainTime(this.itemData.type);
        if (e > 0) {
            this.effectTimeLabel.string = C.utc(e).format("mm:ss");
        }
        else {
            this.refreshBtn();
        }
    }
}
