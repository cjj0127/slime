import { GlobalEventName } from "../common/Events";
import { E_QUEST_STATUS } from "../common/Const";
import ListView from "../../ccstudio/display/ListView";
import ListViewAdapter from "../../ccstudio/display/ListViewAdapter";
import QuestSevenChallenge from "../quest/QuestSevenChallenge";
import _SevenChallengeConfig from "../../ccstudio/config/_SevenChallengeConfig";
import UIDayChallengeItem from "./UIDayChallengeItem";
const _: any = window["_"];
const { ccclass, property } = cc._decorator;
@ccclass
export default class UIDayChallenge extends ListViewAdapter {
    @property(cc.Layout)
    content: cc.Layout = null;
    @property()
    day: number = 0;
    @property(ListView)
    listView = null;
    onChangeTab(e: any) {
        if (e == this.day) {
            this.day = e;
            this.refreshList();
        }
    }
    onDisable() {
        cc.director.targetOff(this);
    }
    onEnable() {
        cc.director.on(GlobalEventName.SevenChallengeQuestStatusChange, this.onStatusChange, this);
        cc.director.on(GlobalEventName.SevenChallengeChangeTab, this.onChangeTab, this);
    }
    onLoad() {
        this.listView.setAdapter(this);
    }
    onStatusChange() {
        this.refreshList();
    }
    async refreshList() {
        this.unscheduleAllCallbacks();
        const e = _SevenChallengeConfig.Instance.getDayQuests(this.day), t = _.sortBy(e, (e: any) => {
            const t = e.id;
            var n = QuestSevenChallenge.Instance.getData(e.quest);
            return n.status == E_QUEST_STATUS.Finish ? t + n.status : 1e4 * -n.status + t;
        });
        this.setDataSet(t);
        this.listView.notifyUpdate();
    }
    requestReceive(e: any) {
        if (QuestSevenChallenge.Instance.receive(e.questId, e.rewardIcon.node.convertToWorldSpaceAR(cc.Vec3.ZERO))) {
            this.refreshList();
        }
    }
    async requestReceiveAd(e: any) {
        if (await QuestSevenChallenge.Instance.requestAd(e.questId)) {
            this.refreshList();
        }
    }
    updateView(e: any, t: any, n: any) {
        const o = e.getComponent(UIDayChallengeItem);
        o.delegate = this;
        o.questId = n.quest;
    }
}
