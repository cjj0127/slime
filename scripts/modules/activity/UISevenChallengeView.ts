import { GlobalEventName } from "../common/Events";
import { GameConst, E_QUEST_STATUS } from "../common/Const";
import AppConstDefine from "../common/AppConst";
import _ExtralRewardConfig from "../../ccstudio/config/_ExtralRewardConfig";
import LanMgr from "../common/Language";
import SevenChallengeModel from "../../ccstudio/data/SevenChallengeModel";
import Model from "../../ccstudio/data/Model";
import _QuestConfig from "../../ccstudio/config/_QuestConfig";
import QuestSevenChallenge from "../quest/QuestSevenChallenge";
import _SevenChallengeConfig from "../../ccstudio/config/_SevenChallengeConfig";
import ToggleToPage, { PAGE_EVENTS } from "../common/ToggleToPage";
import UISevenChallengeToggle from "./UISevenChallengeToggle";
import UserData, { AssetGetType } from "../user/UserData";
const { ccclass, property } = cc._decorator;
const _: any = window["_"];
@ccclass
export default class UISevenChallengeView extends cc.Component {
    @property(cc.Button)
    btnGm: cc.Button = null;
    defaultToggleId: number = 0;
    @property(cc.Button)
    obtainAll: cc.Button = null;
    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;
    @property(cc.Label)
    remainTimeLabel: cc.Label = null;
    selectType: number = null;
    @property(cc.ToggleContainer)
    toggleContainer: cc.ToggleContainer = null;
    @property(ToggleToPage)
    toggleToPage: ToggleToPage = null;
    @property(cc.RichText)
    totalProLabel: cc.RichText = null;
    caculateLastDays(): void {
        if (Model.sevenChallenge.getSevenChallengeOpenTime() == -1) {
            Model.sevenChallenge.saveSevenChallengeOpenTime();
        }
    }
    finishAll(): void {
        const e = QuestSevenChallenge.Instance.questDatas;
        _.each(e, (e) => {
            e.status = E_QUEST_STATUS.Complete;
            cc.director.emit(GlobalEventName.SevenChallengeQuestStatusChange, e.id);
        });
    }
    onEnable(): void {
        this.caculateLastDays();
        this.toggleToPage.setDefaultCheckedIdx(this.defaultToggleId);
        this.refreshUi();
        cc.director.on(GlobalEventName.SevenChallengeQuestStatusChange, this.refreshUi, this);
        this.obtainAll.node.on("click", this.onObtainAll, this);
        this.btnGm.node.on("click", this.finishAll, this);
    }
    onLoad(): void {
        this.toggleToPage.node.on(PAGE_EVENTS.PageToIdx, this.onPageTo, this);
    }
    onObtainAll(): void {
        let e = QuestSevenChallenge.Instance.getFinishedQuestNum();
        let t = 0;
        const n = [];
        const o = [];
        const r = Model.sevenChallenge.getSevenChallengeDay();
        const i = QuestSevenChallenge.Instance.questDatas;
        _.each(i, (i) => {
            const s = QuestSevenChallenge.Instance.getData(i.id);
            if (s && s.status == E_QUEST_STATUS.Complete) {
                t++;
                s.status = E_QUEST_STATUS.Finish;
                const c = _QuestConfig.Instance.get(i.id);
                const p = n.indexOf(c.asset);
                if (p == -1) {
                    n.push(c.asset);
                    o.push(c.count);
                }
                else {
                    o[p] += c.count;
                }
                const f = -1 | (_SevenChallengeConfig.Instance.getByQuestId(i.id)?.day ?? void 0);
                const d = {
                    SevenChallenge_FinishDay: f,
                    SevenChallenge_ID: i.id,
                    SevenChallenge_Points: e + t,
                    SevenChallenge_UnlockDay: r
                };
                const h = {
                    LoginReward: `${c.asset.toString()}|${c.count.toString()}`,
                    Reward_Type: "Task",
                    SevenChallenge_ID: i.id,
                    SevenChallenge_Points: e + t
                };
            }
        });
        cc.director.emit(GlobalEventName.SevenChallengeQuestStatusChange);
        for (let c = 0; c < n.length; c++) {
            UserData.Instance.addItem(n[c], o[c], {
                sourcePos: this.node.convertToWorldSpaceAR(cc.Vec3.ZERO),
                type: AssetGetType.SevenChallenge
            });
        }
    }
    onPageTo(e: number): void {
        const t = this.toggleToPage.getToggleContainer().toggleItems[e].getComponent(UISevenChallengeToggle);
        cc.director.emit(GlobalEventName.SevenChallengeChangeTab, t.day);
    }
    onToggle(e: any): void {
        if (this.selectType !== e) {
            this.refresh(e, this.selectType);
            this.selectType = e;
        }
    }
    playRedDot(e: cc.Node): void {
        e.stopAllActions();
        e.scale = 1;
        cc.tween(e).to(0.2, { scale: 1.2 }).to(0.2, { scale: 1 }).union().repeatForever().start();
    }
    refresh(e, a): void { }
    refreshUi(): void {
        this.btnGm.node.active = AppConstDefine.OPEN_GM;
        this.showTotalProgress();
        this.remainTimeLabel.string = `:${GameConst.SEVENCHALLENGE_LAST_TIME - Model.sevenChallenge.getSevenChallengeDay()}${LanMgr.Instance.getLangByID("days")}`;
        const e = this.obtainAll.node.getChildByName("redpoint");
        e.active = Model.sevenChallenge.isShowAllQuestDot();
        this.playRedDot(e);
    }
    reuse(e: number): void {
        this.defaultToggleId = _.isNil(e) ? 0 : e;
    }
    showTotalProgress(): void {
        const e = QuestSevenChallenge.Instance.getFinishedQuestNum();
        this.totalProLabel.string = `:</color><color=#DED235>${e}/</color>${_ExtralRewardConfig.Instance.getMaxQuestNum()}`;
        this.progressBar.progress = e / _ExtralRewardConfig.Instance.getMaxQuestNum();
    }
    start(): void {
        let e = Model.sevenChallenge.getSevenChallengeDay();
        if (e > 7) {
            e = 7;
        }
        cc.director.emit(GlobalEventName.SevenChallengeChangeTab, e);
    }
}
