import { EOpenUIType, EInsertAdType } from "../common/ViedioType";
import { GlobalEventName } from "../common/Events";
import { E_QUEST_TYPE, E_QUEST_STATUS, MapUIPrefabs } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetPool from "../asset/AssetPool";
import AdsModel from "../../ccstudio/data/AdsModel";
import QuestModel from "../../ccstudio/data/QuestModel";
import Model from "../../ccstudio/data/Model";
import _QuestConfig from "../../ccstudio/config/_QuestConfig";
import QuestDaily from "./QuestDaily";
import MyTools from "../../ccstudio/utils/MyTools";
import UIPool from "../common/UIPool";
import QuestDailyItemUI from "./QuestDailyItemUI";
import ViewAnimCtrl from "../../ccstudio/display/ViewAnimCtrl";
const A: any = window["moment"];
const E: any = window["_"];
// import ViedioType from "ViedioType";
const { ccclass, property } = cc._decorator;
@ccclass
export default class QuestDailyViewUI extends UIPool {
    @property(cc.Button)
    btnClose: cc.Button = null;
    @property(cc.Label)
    cdLabel: cc.Label = null;
    @property(cc.Layout)
    content: cc.Layout = null;
    items: QuestDailyItemUI[] = [];
    lateUpdate() {
        const e = Model.quest.resetDailyMoment;
        const t = A(MyTools.GetTimeNow());
        const n = e.diff(t);
        this.cdLabel.string = A.utc(n).format("HH:mm:ss");
    }
    onClickClose() {
        Model.ad.showInterstitial(EInsertAdType.UICloseAd, EOpenUIType.DayTask);
        this.getComponent(ViewAnimCtrl).onClose();
    }
    onDailyListReset() {
        this.refreshList();
    }
    onDailyProgress() { }
    onDisable() {
        cc.director.targetOff(this);
        Model.ad.hideBanner();
    }
    onEnable() {
        this.refreshList();
        cc.director.on(GlobalEventName.DailyQuestReset, this.onDailyListReset, this);
        cc.director.on(GlobalEventName.DailyQuestStatusChange, this.onStatusChange, this);
        this.btnClose.node.on("click", this.onClickClose, this);
        Model.ad.showBanner(EOpenUIType.DayTask);
    }
    // @property(cc.Layout)
    // content: cc.Layout = null;
    // @property(cc.Label)
    // cdLabel: cc.Label = null;
    // @property(cc.Button)
    // btnClose: cc.Button = null;
    onLoad() {
        this.items = this.content.getComponentsInChildren<QuestDailyItemUI>(QuestDailyItemUI);
    }
    onStatusChange() {
        this.refreshList();
    }
    async refreshList() {
        const e = E.keys(_QuestConfig.Instance.getQuests(E_QUEST_TYPE.Daily));
        const t = E.sortBy(e, (e) => {
            const id = parseInt(e);
            const data = QuestDaily.Instance.getData(id);
            return data.status == E_QUEST_STATUS.Finish ? id + data.status : 10000 * -data.status + id;
        });
        this.unscheduleAllCallbacks();
        for (let n = 0; n < t.length; n++) {
            const id = parseInt(t[n]);
            let r = this.items[n];
            if (!r) {
                const i = await AssetPool.Instance.createObjAsync(NAMES_BUNDLE.Game, MapUIPrefabs.QuestDailyItem.path);
                i.parent = this.content.node;
                r = i.getComponent<QuestDailyItemUI>(QuestDailyItemUI);
                r.delegate = this;
                this.items[n] = r;
            }
            r.questId = id;
        }
        this.content.updateLayout();
    }
    requestReceive(e) {
        if (QuestDaily.Instance.receive(e.questId, e.rewardIcon.node.convertToWorldSpaceAR(cc.Vec3.ZERO))) {
            this.refreshList();
        }
    }
    async requestReceiveAd(e) {
        if (await QuestDaily.Instance.requestAd(e.questId)) {
            this.refreshList();
        }
    }
    updateView(e, t, n) {
        e.getComponen(QuestDailyItemUI).questId = n;
    }
}
