import { EWeekRewardState } from "./WeekRewardItem";
import { EUNLOCKSYS_ID, MapUIPrefabs } from "../common/Const";
import LocalStorageTool from "../../ccstudio/utils/LocalStorage";
import UiModel from "../../ccstudio/data/UiModel";
import Model from "../../ccstudio/data/Model";
import _SevenLoginConfig from "../../ccstudio/config/_SevenLoginConfig";
import MyTools from "../../ccstudio/utils/MyTools";
import UnlockCtrl from "../unlock/UnlockCtrl";
import WeekRewardView from "./WeekRewardView";
// import WeekRewardView from "./WeekRewardView";
const { ccclass, property } = cc._decorator;
export default class WeekMgr {
    static _instance: WeekMgr = null;
    callBack = null;
    isInit = false;
    isOpened = false;
    totalCount = 7;
    weekReceiveDate = "";
    weekReceiveDateKey = "weekReceiveDate";
    weekReceiveDays = 0;
    weekReceiveDaysKay = "weekReceiveDaysKay";
    private CheckOpenDialog(): void {
        if (this.isOpened)
            this.callBack && this.callBack();
        else if (this.weekReceiveDays >= this.totalCount)
            this.callBack && this.callBack();
        else {
            if (!UnlockCtrl.Instance.isUnlock(EUNLOCKSYS_ID.Sign))
                return this.callBack && this.callBack(), console.log("签到未解锁");
            if ("" == this.weekReceiveDate) {
                this.OpenDialog();
                this.isOpened = true;
            }
            else {
                const e = parseInt(this.weekReceiveDate);
                if (this.isSameDay(e, MyTools.GetTimeNow()))
                    this.callBack && this.callBack();
                else {
                    this.OpenDialog();
                    this.isOpened = true;
                }
            }
        }
    }
    GetReceiveState(day: number) {
        return 1 == day && 0 == this.weekReceiveDays ? EWeekRewardState.EComplete : this.weekReceiveDays > day - 1 ? EWeekRewardState.EReceived : this.weekReceiveDays == day - 1 ? EWeekRewardState.EComplete : EWeekRewardState.ENotComplete;
    }
    GetWeekCfg(e) {
        return _SevenLoginConfig.Instance.get(e);
    }
    private InitData(): void {
        if (!this.isInit) {
            this.isInit = true;
            const e = LocalStorageTool.getItemLocal(this.weekReceiveDaysKay, "0");
            this.weekReceiveDays = Number(e);
            LocalStorageTool.setItemLocal(this.weekReceiveDaysKay, this.weekReceiveDays);
            this.weekReceiveDate = LocalStorageTool.getItemLocal(this.weekReceiveDateKey, "");
            LocalStorageTool.setItemLocal(this.weekReceiveDateKey, this.weekReceiveDate);
        }
    }
    private OpenDialog(): void {
        const self = this;
        Model.ui.addViewAsyncQueue(MapUIPrefabs.WeekRewardView, {
            callback: function (t: cc.Node) {
                t.getComponent(WeekRewardView).setCloseCallback(self.callBack);
            }
        });
    }
    // private callBack: Function;
    // private isInit = false;
    // private weekReceiveDaysKay = "WeekReceiveDays";
    // private totalCount = 0; // 需要给出 totalCount 的定义
    // private weekReceiveDays: number = 0;
    // private weekReceiveDateKey = "weekReceiveDate";
    // private weekReceiveDate: string = "";
    // private isOpened = false;
    public OpenWeekDialog(callback: Function = null): void {
        this.callBack = callback;
        this.InitData();
        this.CheckOpenDialog();
    }
    public SignToDay(): void {
        this.weekReceiveDays++;
        LocalStorageTool.setItemLocal(this.weekReceiveDaysKay, this.weekReceiveDays);
        this.weekReceiveDate = MyTools.GetTimeNow().toString();
        LocalStorageTool.setItemLocal(this.weekReceiveDateKey, this.weekReceiveDate);
    }
    public getSignDays(): number {
        return this.weekReceiveDays;
    }
    private isSameDay(e: number, t: number): boolean {
        const n = new Date(e);
        const o = new Date(t);
        return n.getFullYear() == o.getFullYear() && n.getMonth() == o.getMonth() && n.getDate() == o.getDate();
    }
    static get Instance() {
        if (this._instance == null) {
            this._instance = new WeekMgr();
        }
        return this._instance;
    }
}
