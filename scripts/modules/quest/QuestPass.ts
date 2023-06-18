import QuestProxyBase from "../common/QuestProxyBase";
import { GlobalEventName } from "../common/Events";
import { E_CYCLE_TYPE, E_QUEST_STATUS, E_QUEST_TYPE, E_ASSET_TYPE } from "../common/Const";
import { AssetFlyViewUI } from "../asset/AssetFlyViewUI";
import LocalStorageTool from "../../ccstudio/utils/LocalStorage";
import PassModel from "../../ccstudio/data/PassModel";
import Model from "../../ccstudio/data/Model";
import _QuestConfig from "../../ccstudio/config/_QuestConfig";
import MyTools from "../../ccstudio/utils/MyTools";
import UserData, { AssetGetType } from "../user/UserData";
const _: any = window["_"];
const m: any = window["moment"];
const { ccclass, property } = cc._decorator;
export default class QuestPass extends QuestProxyBase {
    private static _instance: QuestPass = null;
    private _resetWeeklyQuestTime: any = null;
    public dailyQuests: any[] = [];
    saveKey: string = "user-pass-quest";
    public weekQuests: any[] = [];
    checkWeekReset(): void {
        if (m(MyTools.GetTimeNow()).isAfter(this.resetWeeklyQuestTime)) {
            this.removeQuest(this.weekQuests);
            this.weekQuests = this.genQuests(E_CYCLE_TYPE.Weekly, 2);
            this.resetWeeklyQuestTime = m(MyTools.GetTimeNow()).weekday(1).startOf("days").add(176, "hour");
        }
    }
    dailyReset(): void {
        this.removeQuest(this.dailyQuests);
        this.dailyQuests = this.genQuests(E_CYCLE_TYPE.Daily, 3);
        this.checkWeekReset();
        this.saveData();
        cc.director.emit(GlobalEventName.PassQuestReset);
    }
    genAll(): void {
        this._questDatas = {};
        this.weekQuests = this.genQuests(E_CYCLE_TYPE.Weekly, 2);
        this.dailyQuests = this.genQuests(E_CYCLE_TYPE.Daily, 3);
        this.resetWeeklyQuestTime = m(MyTools.GetTimeNow()).weekday(1).startOf("days").add(176, "hour");
        this.saveData();
    }
    genQuests(e: any, t: number): Array<number> {
        const o = _QuestConfig.Instance.getQuests(E_QUEST_TYPE.Pass);
        let r = [];
        for (let i in o) {
            if (o[i].updateCycle == e) {
                r.push(o[i].id);
            }
        }
        let i = r.length > t ? _.slice(_.shuffle(r), 0, t) : r;
        for (let quest of i) {
            this.addQuest(quest);
        }
        return i;
    }
    getAllQuest(): any {
        return this._questDatas;
    }
    getReceiveEnableCount(): number {
        const e = this.questDatas;
        let t = 0;
        if (Model.pass.passActive) {
            for (let i in e) {
                let n = _QuestConfig.Instance.get(e[i].id);
                if (e[i].status == E_QUEST_STATUS.Complete) {
                    if (n.receiveDep) {
                        if (Model.pass.premiumActive) {
                            t++;
                        }
                    }
                    else {
                        t++;
                    }
                }
            }
        }
        return t;
    }
    judgeReceive(e: any) {
        return e.receiveDep ? Model.pass.passActive && Model.pass.premiumActive : Model.pass.passActive;
    }
    load() {
        var t = LocalStorageTool.getItemLocal(this.saveKey, {});
        _.isEmpty(t) ? this.genAll() : (this.dailyQuests = [], this.weekQuests = [], _.each(t, (t) => {
            this._questDatas[t.id] = this.createDataWithMemo(t),
                _QuestConfig.Instance.get(t.id).updateCycle == E_CYCLE_TYPE.Daily ? this.dailyQuests.push(t.id) : this.weekQuests.push(t.id);
        }));
        var n = LocalStorageTool.getItemLocal("cc_user-pass-weekquest-reset-time");
        this._resetWeeklyQuestTime = n ? m(n) : null;
    }
    onProgress(e: any): void {
        if (e.status == E_QUEST_STATUS.Job && e.cur >= e.max) {
            e.status = E_QUEST_STATUS.Complete;
            this.removeActiveQuestId(e.activeId, e.id);
            cc.director.emit(GlobalEventName.PassQuestComplete, e.id);
        }
        else {
            cc.director.emit(GlobalEventName.PassQuestProgress, e.id);
        }
    }
    received(e: number): void {
        cc.director.emit(GlobalEventName.PassQuestReceived, e);
    }
    reportPassTask(e: any): void {
        let t = {
            PassLevel: Model.pass.level,
            PremiumPass: Model.pass.premiumActive,
            Reward: e.asset + "|" + e.count,
            Task_ID: e.id
        };
    }
    saveWeekResetTime(): void {
        LocalStorageTool.setItemLocal("cc_user-pass-weekquest-reset-time", (this.resetWeeklyQuestTime?.format()));
    }
    sendReward(e: any, t: any): void {
        let n = e.asset, o = e.count;
        if (n !== E_ASSET_TYPE.PassExp) {
            UserData.Instance.addItem(n, o, {
                sourcePos: t,
                type: AssetGetType.Pass
            });
        }
        else {
            Model.pass.addExp(o);
            AssetFlyViewUI.Instance.addAsset(E_ASSET_TYPE.PassExp, o, {
                sourcePos: t,
                priority: 2
            });
        }
        this.reportPassTask(e);
    }
    static get Instance() {
        if (QuestPass._instance == null) {
            QuestPass._instance = new QuestPass();
        }
        return QuestPass._instance;
    }
    get resetWeeklyQuestTime() {
        return this._resetWeeklyQuestTime;
    }
    set resetWeeklyQuestTime(value) {
        if (this._resetWeeklyQuestTime !== value) {
            this._resetWeeklyQuestTime = value;
            this.saveWeekResetTime();
        }
    }
}
