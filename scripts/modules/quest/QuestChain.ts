import GuideMgr from "../guide/GuideMgr";
import QuestProxyBase from "../common/QuestProxyBase";
import UserData, { AssetGetType } from "../user/UserData";
import { GlobalEventName } from "../common/Events";
import { GameConst, E_QUEST_STATUS, E_QUEST_VALUE_UPDATE_TYPE, E_UnlockSysType } from "../common/Const";
import LocalStorageTool from "../../ccstudio/utils/LocalStorage";
import _QuestConfig from "../../ccstudio/config/_QuestConfig";
const y: any = window["_"];
const { ccclass, property } = cc._decorator;
@ccclass
export default class QuestChain extends QuestProxyBase {
    private _chainQuestId: number = 0;
    private static _instance: QuestChain;
    // private _chainQuestId: number = 0;
    public debug: boolean = false;
    delegate: any;
    // private get chainQuestId(): number {
    //     return this._chainQuestId;
    // }
    saveKey: string = "user-chain-quest";
    public activeQuest(e: number): void {
        const t = _QuestConfig.Instance.get(e);
        y.isNil(t) || this.addQuest(e);
    }
    public commit(e: number, t: number): void {
        const n = this.getData(this.chainQuestId);
        if (n.activeId == e && n.status >= E_QUEST_STATUS.Job) {
            if (n.upType == E_QUEST_VALUE_UPDATE_TYPE.Count) {
                n.cur += t;
            }
            else {
                n.cur = this.delegate.getSysValue(n.activeId);
            }
            this.onProgress(n);
        }
        this.saveData();
    }
    public complete(): void {
        const e = this.getData(this.chainQuestId);
        e.cur = e.max;
        this.onProgress(e);
    }
    public gotoQuest(e: number): void {
        if (this._chainQuestId !== e) {
            const t = this._chainQuestId;
            this.activeQuest(e);
            this._chainQuestId = e;
            cc.director.emit(GlobalEventName.ChainQuestStatusChange, t);
        }
    }
    public load(): void {
        this._questDatas = {};
        const t = LocalStorageTool.getItemLocal(this.saveKey, {});
        if (y.isEmpty(t)) {
            this._chainQuestId = GameConst.CHAIN_QUEST_DEFAULT_ID;
            const n = _QuestConfig.Instance.get(this._chainQuestId);
            this.questDatas[n.id] = this.createData(n, E_QUEST_STATUS.Job);
        }
        else {
            let o = 0;
            y.each(t, (t) => {
                this.questDatas[t.id] = this.createDataWithMemo(t);
                o = Math.max(o, t.id);
            });
            this._chainQuestId = o;
        }
    }
    public onProgress(e: any): void {
        if (e.status == E_QUEST_STATUS.Job && e.cur >= e.max) {
            e.status = E_QUEST_STATUS.Complete;
            this.removeActiveQuestId(e.activeId, e.id);
            cc.director.emit(GlobalEventName.ChainQuestStatusChange, e.id);
            GuideMgr.instance.check();
        }
        else {
            cc.director.emit(GlobalEventName.ChainQuestProgressChange, e.id);
        }
    }
    public received(e: number): void {
        const t = e + 1;
        this.activeQuest(t);
        this._chainQuestId = t;
        cc.director.emit(GlobalEventName.UnlockValueChange, E_UnlockSysType.Task, e);
        cc.director.emit(GlobalEventName.ChainQuestStatusChange, e);
    }
    public reportMainTask(e: any): void {
        const t = { Reward: `${e.asset}|${e.count}`, Task_ID: e.id };
    }
    public sendReward(e: any, t: any): void {
        const n = e.asset;
        const o = e.count;
        UserData.Instance.addItem(n, o, { sourcePos: t, type: AssetGetType.MainTask });
        this.reportMainTask(e);
    }
    public static get Instance(): QuestChain {
        if (!this._instance) {
            this._instance = new QuestChain();
        }
        return this._instance;
    }
    public get chainQuestId(): number {
        return this._chainQuestId;
    }
    public set chainQuestId(value: number) {
        this._chainQuestId = value;
    }
}
