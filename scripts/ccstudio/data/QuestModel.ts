import LocalStorageTool from "../utils/LocalStorage";
import ModeBase from "./ModelBase";
import QuestChain from "../../modules/quest/QuestChain";
import QuestDaily from "../../modules/quest/QuestDaily";
import QuestPass from "../../modules/quest/QuestPass";
import QuestSevenChallenge from "../../modules/quest/QuestSevenChallenge";
import MyTools from "../utils/MyTools";
import { GlobalEventName } from "../../modules/common/Events";
import { E_QUEST_TYPE, E_QUEST_ACTIVE_ID } from "../../modules/common/Const";
const moment: any = window['moment'];
const _: any = window['_'];
export default class QuestModel extends ModeBase {
    private _resetDailyMoment: any;
    private questProxy: any = {};
    private sysValues: any = {};
    public commit(activeId: E_QUEST_ACTIVE_ID, value: number = 1, taskIds?: number[] | string[]): void {
        _.each(this.questProxy, (instance: any) => instance.commit(activeId, value, taskIds));
    }
    public fixedUpdate(): void {
        moment(MyTools.GetTimeNow()).isAfter(this.resetDailyMoment) &&
            (this.resetQuest(), this.onCommit(E_QUEST_ACTIVE_ID.UserLogin, 1));
    }
    public getSysValue(activeId: E_QUEST_ACTIVE_ID): number {
        return _.get(this.sysValues, activeId, 0);
    }
    public initLoadData(): void {
        moment(MyTools.GetTimeNow()).isAfter(this._resetDailyMoment) &&
            (this.resetQuest(), this.onCommit(E_QUEST_ACTIVE_ID.UserLogin, 1));
        LocalStorageTool.setItemLocal("cc_quest-daily-reset-time-key", this._resetDailyMoment.format());
        // this.schedule(this.fixUpdate, 1, cc.macro.REPEAT_FOREVER);
        // cc.game.on(cc.game.EVENT_HIDE, () => {
        //     this.unschedule(this.fixUpdate);
        // });
        // cc.game.on(GlobalEvent.GameResume, () => {
        //     this.schedule(this.fixUpdate, 1, cc.macro.REPEAT_FOREVER, Math.random());
        // });
    }
    public load(): void {
        this.setProxy(E_QUEST_TYPE.Daily, QuestDaily.Instance);
        this.setProxy(E_QUEST_TYPE.Chain, QuestChain.Instance);
        this.setProxy(E_QUEST_TYPE.Pass, QuestPass.Instance);
        this.setProxy(E_QUEST_TYPE.SevenChallenge, QuestSevenChallenge.Instance);
        this.sysValues = LocalStorageTool.getItemLocal("cc_quest-sys-value") || {};
        if (_.isEmpty(this.sysValues)) {
            _.set(this.sysValues, E_QUEST_ACTIVE_ID.UserLogin, 1);
            this.saveSysValues();
        }
        this._resetDailyMoment = this.loadDailyResetMoment();
        _.each(this.questProxy, (instance: any) => instance.load());
        cc.director.on(GlobalEventName.QuestCommit, this.onCommit, this);
        cc.director.on(GlobalEventName.QuestBatchCommit, this.onBatchCommit, this);
    }
    public loadDailyResetMoment(): any {
        const e = LocalStorageTool.getItemLocal("cc_quest-daily-reset-time-key");
        return _.isNil(e)
            ? moment(MyTools.GetTimeNow())
                .subtract(8, "h")
                .startOf("day")
                .add(32, "h")
            : moment(e);
    }
    public onBatchCommit(activeId: E_QUEST_ACTIVE_ID, taskIds, value?: number): void {
        if (_.isNil(activeId)) {
            cc.error("任务提交错误，activeId 为空");
        }
        else {
            if (_.isNil(value) || value > this.getSysValue(activeId)) {
                this.sysValues[activeId] = value;
                this.saveSysValues();
            }
            this.commit(activeId, taskIds);
        }
    }
    public onCommit(activeId: E_QUEST_ACTIVE_ID, value?: number): void {
        if (_.isNil(activeId)) {
            cc.error("任务提交错误，activeId 为空");
        }
        else {
            if (_.isNil(value) || value > this.getSysValue(activeId)) {
                this.sysValues[activeId] = value;
                this.saveSysValues();
            }
            this.commit(activeId);
        }
    }
    public onDestroy(): void {
        super.onDestroy;
        this.questProxy = {};
    }
    public resetQuest(): void {
        QuestDaily.Instance.dailyReset();
        QuestPass.Instance.dailyReset();
        QuestSevenChallenge.Instance.dailyReset();
        this._resetDailyMoment = moment(MyTools.GetTimeNow())
            .subtract(8, "h")
            .startOf("day")
            .add(32, "h");
        LocalStorageTool.setItemLocal("cc_quest-daily-reset-time-key", this._resetDailyMoment.format());
    }
    public saveSysValues(): void {
        LocalStorageTool.setItemLocal("cc_quest-sys-value", this.sysValues);
    }
    public setProxy(type: E_QUEST_TYPE, instance: any): void {
        instance.delegate = this;
        this.questProxy[type] = instance;
    }
    public get resetDailyMoment(): any {
        return this._resetDailyMoment;
    }
}
