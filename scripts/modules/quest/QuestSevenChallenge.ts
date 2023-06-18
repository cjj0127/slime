import { EVideoType } from "../common/ViedioType";
import { GlobalEventName } from "../common/Events";
import { E_QUEST_STATUS, EUNLOCKSYS_ID, E_QUEST_TYPE, E_QUEST_VALUE_UPDATE_TYPE } from "../common/Const";
import AdsManager, { EVideoStatus } from "../ads/AdsManager";
import QuestProxyBase from "../common/QuestProxyBase";
import SevenChallengeModel from "../../ccstudio/data/SevenChallengeModel";
import UserModel from "../../ccstudio/data/UserModel";
import Model from "../../ccstudio/data/Model";
import _QuestConfig from "../../ccstudio/config/_QuestConfig";
import _SevenChallengeConfig from "../../ccstudio/config/_SevenChallengeConfig";
import UserData, { AssetGetType } from "../user/UserData";
// n.default = C
const _: any = window["_"];
export default class QuestSevenChallenge extends QuestProxyBase {
    private static _instance: QuestSevenChallenge = null;
    private quests: Array<number>;
    saveKey: string = "user-seven-Challenge-quest";
    public addDayQuest(e: number) {
        const n = _SevenChallengeConfig.Instance.getDayQuests(e);
        const o: Array<number> = [];
        _.each(n, function (e) {
            o.push(e.quest);
            if (!this.quests.find(item => item == e.quest)) {
                this.quests.push(e.quest);
            }
        }.bind(this));
        Model.user.isUnlock(EUNLOCKSYS_ID.SevenChallenge) && _.each(o, function (e) {
            !this.getData(e) && this.addQuest(e);
        }.bind(this));
    }
    public commit(e: number, t: number) {
        if (Model.user.isUnlock(EUNLOCKSYS_ID.SevenChallenge)) {
            const o = _.clone(this.getActiveQuests(e));
            _.each(o, function (o) {
                const r = this.getData(o);
                if (r.activeId == e && r.status >= E_QUEST_STATUS.Job) {
                    if (r.upType == E_QUEST_VALUE_UPDATE_TYPE.Count) {
                        r.cur += t;
                    }
                    else {
                        r.cur = this.delegate.getSysValue(r.activeId);
                    }
                    this.onProgress(r);
                }
            }.bind(this));
            this.saveData();
        }
    }
    public dailyReset() {
        const e = Model.sevenChallenge.getSevenChallengeDay();
        for (let t = 1; t <= e; t++) {
            this.addDayQuest(t);
        }
    }
    public genOpenQuests() {
        this._questDatas = {};
        this.quests = this.genQuests();
        this.saveData();
    }
    public genQuests() {
        const t = _QuestConfig.Instance.getQuests(E_QUEST_TYPE.SevenChallenge);
        const n = Model.sevenChallenge.getSevenChallengeDay();
        const o: Array<number> = [];
        _.each(t, function (e) {
            const t = _SevenChallengeConfig.Instance.getByQuestId(e.id);
            if (t != null && t.day <= n) {
                o.push(e.id);
            }
        });
        const r = o;
        Model.user.isUnlock(EUNLOCKSYS_ID.SevenChallenge) && _.each(o, (t) => {
            this.addQuest(t);
        });
        return r;
    }
    public getAllQuest() {
        return this._questDatas;
    }
    public getDayQuest(e: number) {
        const t: Array<any> = [];
        _.forEach(this._questDatas, function (n) {
            const o = _SevenChallengeConfig.Instance.getByQuestId(n.id);
            o && o.day == e && t.push(n);
        });
        return t;
    }
    public getDayReceiveEnableCount(e: number) {
        const t = this.getDayQuest(e);
        let n = 0;
        _.each(t, function (e) {
            e.status == E_QUEST_STATUS.Complete && n++;
        });
        return n;
    }
    public getFinishedQuestNum() {
        let e = 0;
        _.forEach(this._questDatas, function (t) {
            t.status == E_QUEST_STATUS.Finish && e++;
        });
        return e;
    }
    public getOpenDayQuest(e: number) {
        const t: Array<any> = [];
        _.forEach(this._questDatas, function (n) {
            const o = _SevenChallengeConfig.Instance.getByQuestId(n.id);
            o && o.day <= e && t.push(n);
        });
        return t;
    }
    public load() {
        const t = localStorage.getItem(this.saveKey);
        const savedData = JSON.parse(t || '{}');
        if (_.isEmpty(savedData)) {
            this.genOpenQuests();
        }
        else {
            this.quests = [];
            _.each(savedData, (t) => {
                this._questDatas[t.id] = this.createDataWithMemo(t);
                this.quests.push(t.id);
            });
            this.dailyReset();
        }
    }
    public onProgress(e: any): void {
        if (e.status == E_QUEST_STATUS.Job && e.cur >= e.max) {
            e.status = E_QUEST_STATUS.Complete;
            this.removeActiveQuestId(e.activeId, e.id);
            cc.director.emit(GlobalEventName.SevenChallengeQuestStatusChange, e.id);
        }
        else {
            cc.director.emit(GlobalEventName.SevenChallengeQuestProgressChange, e.id);
        }
    }
    public received(e: any): void {
        cc.director.emit(GlobalEventName.SevenChallengeQuestStatusChange, e);
    }
    public reportSevenChallengeTask(e): void { }
    public async requestAd(e: any): Promise<boolean> {
        const t = this.getData(e);
        if (t.status != E_QUEST_STATUS.InAD) {
            cc.error(`未达到可观看任务状态 ${e} ${E_QUEST_STATUS[t.status]}`);
            return false;
        }
        else {
            const n = async () => {
                t.status = E_QUEST_STATUS.Complete;
                cc.director.emit(GlobalEventName.SevenChallengeQuestStatusChange, e);
            };
            const o = {
                AdsType: EVideoType.AdQuest,
                OpenUi: EVideoType.AdQuest,
                onSucceed: n,
            };
            return (await AdsManager.getInstance().showRewardedVideo(o)) == EVideoStatus.Success;
        }
    }
    public sendReward(e: any, t: any): void {
        const n = e.asset;
        const o = e.count;
        UserData.Instance.addItem(n, o, {
            sourcePos: t,
            type: AssetGetType.SevenChallenge,
        });
        this.reportSevenChallengeTask(e);
    }
    public static get Instance(): QuestSevenChallenge {
        if (!this._instance) {
            this._instance = new QuestSevenChallenge();
        }
        return this._instance;
    }
}
