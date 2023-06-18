import Config from "../configs/Config";
import _LevelConfig from "../config/_LevelConfig";
import LocalStorageTool from "../utils/LocalStorage";
import ModeBase from "./ModelBase";
import Model from "./Model";
import NumberPlus from "../utils/NumberPlus";
import MyTools from "../utils/MyTools";
import UserData, { AssetGetType } from "../../modules/user/UserData";
import Utils_ from "../utils/Utils";
import { GlobalEventName } from "../../modules/common/Events";
import { GameConst, EUNLOCKSYS_ID, E_QUEST_ACTIVE_ID } from "../../modules/common/Const";
const moment: any = window['moment'];
const _: any = window['_'];
export default class ObtainModel extends ModeBase {
    private bonusCoins: string = "0";
    private bonusItems: any = {};
    private bonusReceivedTime: any = null;
    private collectTime: number = 0;
    private idleCoins: string = "0";
    private idleItems: any = {};
    private receivedTime: any = null;
    fixedUpdate(dt) {
        if (!(this.collectTime > 60 * GameConst.IDLE_REWARD_MAX_TIME)) {
            const e = moment(MyTools.GetTimeNow());
            const t = cc.misc.clampf(e.diff(this.receivedTime, "seconds"), 0, 60 * GameConst.IDLE_REWARD_MAX_TIME);
            const n = Math.ceil((t - this.collectTime) / 60);
            if (n > 0) {
                for (let o = 0; o < n; o++) {
                    this.genIdleRewardCoin();
                }
                const r = Math.floor(t / (60 * GameConst.IDLE_REWARD_GEAR_TIME));
                const i = Math.floor(this.collectTime / (60 * GameConst.IDLE_REWARD_GEAR_TIME));
                if (r > i) {
                    for (let c = r - i, l = 0; l < c; l++) {
                        this.genIdleRewardGear();
                    }
                }
                this.collectTime += 60 * n;
            }
            this.saveData();
            cc.director.emit(GlobalEventName.ObtainRewardUpdate);
        }
    }
    genBonusReward(): void {
        const e = Model.level.unlockLevel;
        const t = Config.level.get(e);
        this.bonusCoins = "0";
        this.bonusItems = {};
        this.bonusCoins = NumberPlus.mul(t.obtain, GameConst.EXTRA_OBTAIN);
        const n = Math.floor(GameConst.EXTRA_OBTAIN / GameConst.IDLE_REWARD_GEAR_TIME);
        for (let o = 0; o < n; o++) {
            if (Utils_.randomNumber(100) <= t.obtainGearRate) {
                let numArray = t.obtainWidget.map(item => item.num);
                const r = Utils_.getRandIndex_(numArray);
                const i = t.obtainWidget[r].id;
                const s = _.get(this.bonusItems, i, 0);
                _.set(this.bonusItems, i, s + 1);
            }
        }
    }
    genIdleRewardCoin(): void {
        const e = Model.level.unlockLevel;
        const t = Config.level.get(e);
        this.idleCoins = NumberPlus.add(this.idleCoins, t.obtain);
    }
    genIdleRewardGear(): void {
        const e = Model.level.unlockLevel;
        const t = Config.level.get(e);
        if (Utils_.randomNumber(100) <= t.obtainGearRate) {
            let numArray = t.obtainWidget.map(item => item.num);
            const n = Utils_.getRandIndex_(numArray);
            const o = t.obtainWidget[n].id;
            const r = _.get(this.idleItems, o, 0);
            _.set(this.idleItems, o, r + 1);
        }
    }
    public getBonusEnable(): boolean {
        const bonusReceivedTime = this.getBonusReceivedTime();
        const nowTime = moment(MyTools.GetTimeNow());
        if (_.isNil(bonusReceivedTime)) {
            return true;
        }
        const nextObtainTime = moment(bonusReceivedTime).add(GameConst.EXTRA_OBTAINCD, "minutes");
        return nowTime.isAfter(nextObtainTime);
    }
    public getBonusReceivedTime(): string {
        return this.bonusReceivedTime;
    }
    public getBunusInfo(): {
        coins: string;
        items: Record<string, number>;
    } {
        return {
            coins: this.bonusCoins,
            items: this.bonusItems
        };
    }
    public getCollectSpeed(): number {
        const unlockLevel = Model.level.unlockLevel;
        return Number(Config.level.get(unlockLevel).obtain);
    }
    // private idleCoins: string;
    // private idleItems: Record<string, number>;
    // private bonusCoins: string;
    // private bonusItems: Record<string, number>;
    // private bonusReceivedTime: string;
    // private collectTime: number;
    // public static _instance: C | null = null;
    public getCollectTime(): number {
        return this.collectTime;
    }
    public getIdleInfo(): {
        coins: string;
        items: Record<string, number>;
    } {
        return {
            coins: this.idleCoins,
            items: this.idleItems
        };
    }
    getPreReceiveTime(): Date {
        return this.receivedTime;
    }
    initLoadData(): void {
        if (Model.user.isUnlock(EUNLOCKSYS_ID.Hangup)) {
            this.syncData();
            // this.schedule(this.fixUpdate, 1, cc.macro.REPEAT_FOREVER);
            // cc.game.on(cc.game.EVENT_HIDE, () => {
            //     this.unschedule(this.fixUpdate);
            // });
            // cc.game.on(GlobalEvent.GameResume, () => {
            //     this.schedule(this.fixUpdate, 1, cc.macro.REPEAT_FOREVER, Math.random());
            // });
        }
        else {
            cc.director.once(GlobalEventName.UnlockHungup, this.onUnlockSys, this);
        }
    }
    load(): void {
        const e = JSON.parse(LocalStorageTool.getItemLocal("cc_obtain_info")) || {};
        if (Object.keys(e).length == 0) {
            this.receivedTime = new Date(MyTools.GetTimeNow());
            this.collectTime = 0;
            this.idleCoins = "0";
            this.idleItems = {};
            this.bonusCoins = "0";
            this.bonusItems = {};
            this.bonusReceivedTime = null;
        }
        else {
            this.receivedTime = e.receivedTime && new Date(e.receivedTime);
            this.collectTime = e.collectTime;
            this.idleCoins = e.idleCoins;
            this.idleItems = e.idleItems;
            this.bonusReceivedTime = e.bonusReceivedTime && new Date(e.bonusReceivedTime);
            this.bonusCoins = e.bonusCoins;
            this.bonusItems = e.bonusItems;
        }
        cc.game.on(GlobalEventName.GameResume, this.onEventShow, this);
    }
    onEventShow(): void {
        this.syncData();
    }
    onUnlockSys(): void {
        this.initLoadData();
    }
    public receiveBouns(e: string): boolean {
        if ("0" == this.bonusCoins && _.isEmpty(this.bonusItems)) {
            return false;
        }
        const addationCoins = Model.user.calcAddationCoins(this.bonusCoins);
        UserData.Instance.addCoin(addationCoins, {
            sourcePos: e,
            type: AssetGetType.ExtraObtain
        });
        _.each(this.bonusItems, (e: number, t: string) => {
            const n = parseInt(t);
            Model.gear.addGear(n, e);
        });
        this.bonusReceivedTime = moment(MyTools.GetTimeNow());
        this.bonusCoins = "0";
        this.bonusItems = {};
        this.genBonusReward();
        this.saveData();
        cc.director.emit(GlobalEventName.ObtainBonusReceived);
        return true;
    }
    public receiveIdle(e: string): boolean {
        if ("0" == this.idleCoins && _.isEmpty(this.idleItems)) {
            return false;
        }
        const addationCoins = Model.user.calcAddationCoins(this.idleCoins);
        UserData.Instance.addCoin(addationCoins, {
            sourcePos: e,
            type: AssetGetType.Obtain
        });
        _.each(this.idleItems, (e: number, t: string) => {
            const n = parseInt(t);
            Model.gear.addGear(n, e);
        });
        this.idleCoins = "0";
        this.idleItems = {};
        this.receivedTime = moment(MyTools.GetTimeNow());
        this.collectTime = 0;
        this.saveData();
        cc.director.emit(GlobalEventName.ObtainIdleReceived);
        cc.director.emit(GlobalEventName.QuestCommit, E_QUEST_ACTIVE_ID.ObtainReceive);
        return true;
    }
    saveData(): void {
        const e = {
            bonusCoins: this.bonusCoins,
            bonusItems: this.bonusItems,
            bonusReceivedTime: this.bonusReceivedTime && this.bonusReceivedTime.toISOString(),
            collectTime: this.collectTime,
            idleCoins: this.idleCoins,
            idleItems: this.idleItems,
            receivedTime: this.receivedTime && this.receivedTime.toISOString()
        };
        LocalStorageTool.setItemLocal("cc_obtain_info", JSON.stringify(e));
    }
    // syncData(): void {
    //     const e = moment(MyTools.GetNowTime());
    //     const t = cc.misc.clampf(e.getSecondsBetween(this.receivedTime), 0, 60 * GameConst.IDLE_REWARD_MAX_TIME);
    //     const n = Math.ceil((t - this.collectTime) / 60);
    //     if (n > 0) {
    //         for (let o = 0; o < n; o++) {
    //             this.genIdleRewardCoin();
    //         }
    //         const r = Math.floor(t / (60 * GameConst.IDLE_REWARD_GEAR_TIME));
    //         const i = Math.floor(this.collectTime / (60 * GameConst.IDLE_REWARD_GEAR_TIME));
    //         if (r > i) {
    //             const s = r - i;
    //             for (let c = 0; c < s; c++) {
    //                 this.genIdleRewardGear();
    //             }
    //         }
    //         this.collectTime += 60 * n;
    //     }
    //     if (Object.keys(this.bonusItems).length == 0 || this.bonusCoins == "0") {
    //         this.genBonusReward();
    //     }
    //     this.saveData();
    // }
    syncData() {
        const e = moment(MyTools.GetTimeNow());
        const t = cc.misc.clampf(e.diff(this.receivedTime, "seconds"), 0, 60 * GameConst.IDLE_REWARD_MAX_TIME);
        const n = Math.ceil((t - this.collectTime) / 60);
        if (n > 0) {
            for (let o = 0; o < n; o++) {
                this.genIdleRewardCoin();
            }
            const r = Math.floor(t / (60 * GameConst.IDLE_REWARD_GEAR_TIME));
            const i = Math.floor(this.collectTime / (60 * GameConst.IDLE_REWARD_GEAR_TIME));
            if (r > i) {
                for (let s = r - i, c = 0; c < s; c++) {
                    this.genIdleRewardGear();
                }
            }
            this.collectTime += 60 * n;
        }
        (_.isEmpty(this.bonusItems) || "0" == this.bonusCoins) && this.genBonusReward();
        this.saveData();
    }
}
