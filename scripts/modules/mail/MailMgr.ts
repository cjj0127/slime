import { GlobalEventName } from "../common/Events";
import LocalStorageTool from "../../ccstudio/utils/LocalStorage";
import _MailConfig from "../../ccstudio/config/_MailConfig";
import LevelModel from "../../ccstudio/data/LevelModel";
import UserModel from "../../ccstudio/data/UserModel";
import Model from "../../ccstudio/data/Model";
import QuestChain from "../quest/QuestChain";
import UtilTime from "../../ccstudio/utils/TimeUtil";
import MyTools from "../../ccstudio/utils/MyTools";
export enum MailState {
    UnShow = 0,
    Show = 1,
    Received = 2,
    OutDate = 3,
    Delete = 4
}
export enum MailTimeType {
    NotLimit = 0,
    Week = 1,
    Date = 2
}
export enum MailReceiveType {
    Level = 1,
    Quest = 2
}
export class MailData {
    id; // = id;
    outDateTime; // = -1;
    receiveTimes; // = 0;
    state; // = MailState.UnShow;
}
const v: any = window["_"];
export default class MailMgr {
    static _instance: MailMgr;
    mailData: {
        [key: string]: MailData;
    } = {};
    checkIsComplete(id: string): boolean {
        return this.isCompleteCondition(id) && this.isCompleteTime(id) && !this.isReceiveLimit(id);
    }
    checkMail(): void {
        const self = this;
        const mails = _MailConfig.Instance.getAll();
        v.each(mails, (mail) => {
            const id = mail.id;
            self.checkMailData(id);
        });
    }
    public checkMailByReceiveType(receiveType: number): void {
        const self = this;
        const mails = _MailConfig.Instance.getAll();
        v.each(mails, (mail) => {
            if (mail.receiveType == receiveType) {
                self.checkMailData(mail.id);
            }
        });
    }
    checkMailData(id: string): void {
        let mailData = this.getMailData(id);
        if (mailData == null) {
            mailData = new MailData();
            mailData.id = id;
            mailData.outDateTime = -1;
            mailData.receiveTimes = 0;
            mailData.state = MailState.UnShow;
        }
        if (mailData.state == MailState.UnShow) {
            if (this.checkIsComplete(id)) {
                mailData.state = MailState.Show;
                mailData.outDateTime = this.getOutDateTime(id);
            }
        }
        else if (mailData.state == MailState.Show) {
            if (this.isOutTime(id)) {
                mailData.state = MailState.OutDate;
                mailData.receiveTimes = 0;
            }
        }
        else if (mailData.state == MailState.Received) {
            if (this.isOutTime(id) && this.isCompleteTime(id)) {
                mailData.state = MailState.Show;
                mailData.receiveTimes = 0;
                mailData.outDateTime = this.getOutDateTime(id);
            }
        }
        else if (mailData.state == MailState.OutDate) {
            if (this.isOutTime(id) && this.isCompleteTime(id)) {
                mailData.state = MailState.Show;
                mailData.receiveTimes = 0;
                mailData.outDateTime = this.getOutDateTime(id);
            }
        }
        this.saveMailData(id, mailData);
    }
    public deleteAllMail(): void {
        const showMailList = this.getMailByState(MailState.Show);
        for (let i = 0; i < showMailList.length; i++) {
            showMailList[i].state = MailState.Delete;
            cc.director.emit(GlobalEventName.FreshMail, showMailList[i].id);
            this.saveMailData(showMailList[i].id, showMailList[i]);
        }
    }
    public getMailByState(state: MailState): MailData[] {
        const mailList: MailData[] = [];
        for (const key in this.mailData) {
            if (this.mailData[key].state == state) {
                mailList.push(this.mailData[key]);
            }
        }
        return mailList;
    }
    public getMailCfg(id: string) {
        return _MailConfig.Instance.get(id);
    }
    getMailData(id: any): any {
        return this.mailData[id] || null;
    }
    getOutDateTime(id: string): number {
        const nowTime = MyTools.GetTimeNow();
        const mail = _MailConfig.Instance.get(id);
        return (mail.timeType == MailTimeType.NotLimit) ? 0 : (nowTime + 86400 * parseInt(mail.time));
    }
    public getShowMail(): MailData[] {
        const mailList: MailData[] = [];
        for (const key in this.mailData) {
            const state = this.mailData[key].state;
            if (state == MailState.Show || state == MailState.Received) {
                mailList.push(this.mailData[key]);
            }
        }
        return mailList;
    }
    public init(): void {
        this.mailData = JSON.parse(LocalStorageTool.getItemLocal("cc_mailData", "{}"));
        this.checkMail();
    }
    isCompleteCondition(id: string): boolean {
        const mail = _MailConfig.Instance.get(id);
        if (mail.receiveType == MailReceiveType.Level) {
            return Model.level.currNormalLevel >= mail.receive;
        }
        else if (mail.receiveType == MailReceiveType.Quest) {
            return QuestChain.Instance.chainQuestId > mail.receive;
        }
        else {
            return false;
        }
    }
    isCompleteTime(id: string): boolean {
        const mail = _MailConfig.Instance.get(id);
        const mailData = this.getMailData(id);
        if (mail.timeType == MailTimeType.NotLimit) {
            return true;
        }
        else if (mail.timeType == MailTimeType.Week) {
            return MyTools.GetDateNow().getDay() == parseInt(mail.time);
        }
        else if (mail.timeType == MailTimeType.Date) {
            return !!UtilTime.isSameDay(mail.time);
        }
        else {
            return false;
        }
    }
    public isEmpty(): boolean {
        for (const key in this.mailData) {
            if (this.mailData[key].state == MailState.Show) {
                return false;
            }
        }
        return true;
    }
    isOutTime(id: string): boolean {
        const mail = _MailConfig.Instance.get(id);
        const mailData = this.getMailData(id);
        const outDateTime = MyTools.GetTimeNow() >= mailData.outDateTime;
        if (mail.timeType != MailTimeType.NotLimit) {
            if (mail.timeType == MailTimeType.Date) {
                return outDateTime;
            }
            else if (mail.timeType == MailTimeType.Week) {
                return outDateTime;
            }
        }
        return false;
    }
    isReceiveLimit(id: string): boolean {
        const mail = _MailConfig.Instance.get(id);
        const mailData = this.getMailData(id);
        return (mailData != null) && (mail.times != -1) && (mail.times < mailData.receiveTimes);
    }
    public receiveAllMail(): void {
        const showMailList = this.getMailByState(MailState.Show);
        for (let i = 0; i < showMailList.length; i++) {
            this.receiveMail(showMailList[i].id);
            this.receiveReward(showMailList[i].id);
        }
    }
    public receiveMail(id: string): void {
        const mailData = this.getMailData(id);
        if (mailData != null) {
            mailData.receiveTimes++;
            mailData.state = MailState.Received;
            this.saveMailData(id, mailData);
            cc.director.emit(GlobalEventName.FreshMail, id);
        }
    }
    public receiveReward(id: string): void {
        const mailCfg = this.getMailCfg(id);
        if (mailCfg != null) {
            for (let i = 0; i < mailCfg.asset.length; i++) {
                Model.user.addAsset(mailCfg.asset[i], mailCfg.count[i]);
            }
        }
    }
    saveMailData(id: string, mailData: MailData): void {
        this.mailData[id] = mailData;
        LocalStorageTool.setItemLocal("cc_mailData", JSON.stringify(this.mailData));
    }
    public static get Instance(): MailMgr {
        if (this._instance == null) {
            this._instance = new MailMgr();
        }
        return this._instance;
    }
}
