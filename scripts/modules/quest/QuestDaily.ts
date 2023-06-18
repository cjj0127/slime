import { EVideoType } from "../common/ViedioType";
import { GlobalEventName } from "../common/Events";
import { E_QUEST_TYPE, E_QUEST_STATUS, E_QUEST_ACTIVE_ID } from "../common/Const";
import AdsManager, { EVideoStatus } from "../ads/AdsManager";
import MsgBox from "../common/MsgBox";
import QuestProxyBase from "../common/QuestProxyBase";
import LanMgr from "../common/Language";
import LocalStorageTool from "../../ccstudio/utils/LocalStorage";
import _QuestConfig from "../../ccstudio/config/_QuestConfig";
import UserData, { AssetGetType } from "../user/UserData";
const _: any = window['_'];
export default class QuestDaily extends QuestProxyBase {
    private static _instance: QuestDaily = null;
    saveKey: string = "user-daily-quest";
    dailyReset() {
        _.each(this._questDatas, (t) => {
            this.reset(t, E_QUEST_STATUS.Job);
        });
        this.saveData();
        cc.director.emit(GlobalEventName.DailyQuestReset);
    }
    load() {
        const t = LocalStorageTool.getItemLocal(this.saveKey, {});
        if (_.isEmpty(t)) {
            this._questDatas = {};
            const n = _QuestConfig.Instance.getQuests(E_QUEST_TYPE.Daily);
            _.each(n, (t) => {
                this._questDatas[t.id] = this.createData(t, E_QUEST_STATUS.Job);
            });
        }
        else {
            _.each(t, (t) => {
                this._questDatas[t.id] = this.createDataWithMemo(t);
            });
        }
    }
    onProgress(e) {
        if (e.status == E_QUEST_STATUS.Job && e.cur >= e.max) {
            if (_QuestConfig.Instance.get(e.id).ad) {
                e.status = E_QUEST_STATUS.InAD;
            }
            else {
                e.status = E_QUEST_STATUS.Complete;
            }
            this.removeActiveQuestId(e.activeId, e.id);
            cc.director.emit(GlobalEventName.DailyQuestStatusChange, e.id);
        }
        else {
            cc.director.emit(GlobalEventName.DailyQuestProgressChange, e.id);
        }
    }
    received(e) {
        cc.director.emit(GlobalEventName.QuestCommit, E_QUEST_ACTIVE_ID.DailyQuest);
        cc.director.emit(GlobalEventName.DailyQuestStatusChange, e);
    }
    reportDailyTask(e) {
        // const t = {
        //     Task_ID: e.id,
        //     Task_Ad: e.ad,
        //     Reward: e.asset + "|" + e.count
        // };
    }
    async requestAd(e: string): Promise<boolean> {
        const data = this.getData(e);
        if (data.status !== E_QUEST_STATUS.InAD) {
            cc.error(`未达到可观看任务状态 ${e} ${E_QUEST_STATUS[data.status]}`);
            return false;
        }
        const dialog = MsgBox.open(LanMgr.Instance.getLangByID("Watch an ad and get advanced task reward"));
        return new Promise(function (resolve) {
            dialog.confirmAd(async function () {
                const onSucceed = (bol) => {
                    data.status = E_QUEST_STATUS.Complete;
                    cc.director.emit(GlobalEventName.DailyQuestComplete, bol);
                };
                const p = {
                    AdsType: EVideoType.AdQuest,
                    OpenUi: EVideoType.AdQuest,
                    onSucceed: onSucceed
                };
                const res = await AdsManager.getInstance().showRewardedVideo(p);
                resolve(res === EVideoStatus.Success);
            });
            dialog.cancel(function () {
                resolve(false);
            });
        });
    }
    async sendReward(e, t) {
        const n = e.asset, o = e.count;
        UserData.Instance.addItem(n, o, {
            sourcePos: t,
            type: AssetGetType.DailyTask
        });
        this.reportDailyTask(e);
    }
    public static get Instance() {
        return this._instance || (this._instance = new QuestDaily());
    }
}
