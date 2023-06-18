import { E_QUEST_STATUS, E_QUEST_VALUE_UPDATE_TYPE } from "./Const";
import LocalStorageTool from "../../ccstudio/utils/LocalStorage";
import _QuestConfig from "../../ccstudio/config/_QuestConfig";
const _: any = window["_"];
export default class QuestProxyBase {
    _questDatas: any = {};
    actionQuests: any = {};
    delegate: any = null;
    saveKey = "";
   
    addActiveQuestId(activeId: any, questId: any) {
        const activeQuests = this.actionQuests[activeId] || [];
        if (activeQuests.indexOf(questId) == -1) {
            activeQuests.push(questId);
            this.actionQuests[activeId] = activeQuests;
        }
    }
   
    addQuest(e) {
        const t = _QuestConfig.Instance.get(e);
        const n = this.createData(t, E_QUEST_STATUS.Job, t.ad);
        this.questDatas[n.id] = n;
        t.updateType == E_QUEST_VALUE_UPDATE_TYPE.Set && this.onProgress(n);
        this.saveData();
    }
   
    commit(e, t) {
        const o = Object.assign({}, this.getActiveQuests(e));
        Object.values(o).forEach((i) => {
            const a = this.getData(i);
            if (a) {
                if (a.status >= E_QUEST_STATUS.Job) {
                    a.upType == E_QUEST_VALUE_UPDATE_TYPE.Count ? a.cur += t : a.cur = this.delegate.getSysValue(a.activeId);
                    this.onProgress(a);
                }
            }
            else {
                cc.error(i, e, o);
            }
        });
        this.saveData();
    }
   
    createData(e, t, n = false) {
        const o = this.getInitValue(e);
        this.addActiveQuestId(e.activeId, e.id);
        return {
            id: e.id,
            cur: o,
            max: e.max,
            status: t,
            ad: n,
            activeId: e.activeId,
            upType: e.updateType,
        };
    }
   
    createDataWithMemo(memoData: any) {
        const questId = memoData.id;
        const questConfig = _QuestConfig.Instance.get(questId);
        const data = {
            activeId: questConfig.activeId,
            cur: memoData.cur,
            id: questId,
            max: questConfig.max,
            status: memoData.status,
            upType: questConfig.updateType,
        };
        if (data.status == E_QUEST_STATUS.Job && data.cur >= data.max) {
            if (questConfig.ad) {
                data.status = E_QUEST_STATUS.InAD;
            }
            else {
                data.status = E_QUEST_STATUS.Complete;
            }
        }
        if (data.status == E_QUEST_STATUS.InAD && !questConfig.ad) {
            data.status = E_QUEST_STATUS.Complete;
        }
        this.addActiveQuestId(questConfig.activeId, questId);
        return data;
    }
   
    getActiveQuests(activeId: any) {
        return this.actionQuests[activeId] || [];
    }
   
    getData(e) {
        return this.questDatas[e];
    }
   
    getInitValue(e) {
        return e.updateType == E_QUEST_VALUE_UPDATE_TYPE.Count ? 0 : this.delegate.getSysValue(e.activeId);
    }
   
    getReceiveAdEnableCount() {
        const e = this.questDatas;
        let t = 0;
        _.each(e, (e) => {
            e.status == E_QUEST_STATUS.InAD && t++;
        });
        return t;
    }
   
    getReceiveEnable(e) {
        return this.getData(e).status == E_QUEST_STATUS.Complete;
    }
   
    getReceiveEnableCount() {
        const e = this.questDatas;
        let t = 0;
        _.each(e, (e) => {
            e.status == E_QUEST_STATUS.Complete && t++;
        });
        return t;
    }
   
    judgeReceive(o, n) {
        return true;
    }
   
    onProgress(quest) {
        if (quest.cur >= quest.max) {
            quest.status = E_QUEST_STATUS.Complete;
        }
    }
   
    receive(e, t) {
        const n = this.getData(e);
        if (_.isNil(n)) {
            cc.warn("不存在正在进行中的" + e + "任务");
            return false;
        }
        if (n.id != e) {
            cc.warn("任务错误，领取" + e + "和存档" + n.id + "不一致");
            return false;
        }
        if (n.status != E_QUEST_STATUS.Complete) {
            // cc.warn(任务状态未达到完成 ${ e } status: ${ QUEST_STATUS[n.status] });
            return false;
        }
        const o = _QuestConfig.Instance.get(e);
        if (this.judgeReceive(o, n)) {
            n.status = E_QUEST_STATUS.Finish;
            this.sendReward(o, t);
            this.received(e);
            this.saveData();
            this.removeActiveQuestId(n.activeId, e);
            return true;
        }
        else {
            // cc.warn(任务未达到领取条件 ${ e });
            return false;
        }
    }
   
    received(questId) {
        this.delegate.onReceivedQuest(questId);
    }
   
    removeActiveQuestId(activeId: any, questId: any) {
        const activeQuests = this.actionQuests[activeId];
        if (activeQuests && activeQuests.length > 0) {
            const index = activeQuests.indexOf(questId);
            if (index >= 0) {
                activeQuests.splice(index, 1);
            }
        }
    }
   
    removeQuest(e) {
        if (Array.isArray(e)) {
            e.forEach((e) => {
                const n = this.getData(e);
                this.removeActiveQuestId(n.activeId, e);
                delete this.questDatas[e];
            });
        }
        else {
            const n = this.getData(e);
            this.removeActiveQuestId(n.activeId, e);
            delete this.questDatas[e];
        }
        this.saveData();
    }
   
    reset(e, t = E_QUEST_STATUS.Job) {
        const n = _QuestConfig.Instance.get(e.id);
        const o = this.getInitValue(n);
        e.cur = o;
        e.status = t;
        this.addActiveQuestId(e.activeId, e.id);
    }
   
    saveData() {
        const data: any = {};
        _.each(this.questDatas, (value) => {
            data[value.id] = {
                id: value.id,
                cur: value.cur,
                status: value.status,
            };
        });
        LocalStorageTool.setItemLocal(this.saveKey, data);
    }
   
    sendReward(quest, index) {
        if (quest.reward.length > 0 && index >= 0 && index < quest.reward.length) {
            this.delegate.onAddReward(quest.reward[index]);
        }
    }
    get questDatas() {
        return this._questDatas;
    }
}
