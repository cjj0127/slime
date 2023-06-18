import { GlobalEventName } from "../common/Events";
import { E_ASSET_TYPE, E_ITEM_TYPE } from "../common/Const";
import { AssetFlyViewUI } from "../asset/AssetFlyViewUI";
import _AssetConfig from "../../ccstudio/config/_AssetConfig";
import LocalStorageTool from "../../ccstudio/utils/LocalStorage";
import Model from "../../ccstudio/data/Model";
import NativeBridge from "../../ccstudio/utils/NativeBridge";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
export enum AssetGetType {
    Obtain = "Obtain",
    ExtraObtain = "ExtraObtain",
    Basic = "Basic",
    GoldRush = "GoldRush",
    GoldBox = "GoldBox",
    BossRush = "BossRush",
    MainTask = "MainTask",
    DailyTask = "DailyTask",
    SevenLogin = "SevenLogin",
    GemBox = "GemBox",
    ShopFree = "ShopFree",
    Shop = "Shop",
    Spin = "Spin",
    Mine = "Mine",
    Pass = "Pass",
    SevenChallenge = "SevenChallenge",
    Compensation = "Compensation",
    Trait = "Trait",
    Hero = "Hero",
    Ring = "Ring",
    Plunder = "Plunder"
}
export enum AssetUseType {
    Gear = "Gear",
    Skill = "Skill",
    Partner = "Partner",
    Hero = "Hero",
    Mine = "Mine",
    Mastery = "Mastery"
}
const _: any = window["_"];
export default class UserData {
    private static _instance: UserData = null;
    private _modeLowBattery: boolean | null = null;
    static isNewPlayer = false;
    public items = {};
    addCoin(e, t = null) {
        let n = this;
        let o = null;
        if (t && t.callback) {
            o = t.callback;
        }
        let a = function () {
            let a = _.get(n.items, E_ASSET_TYPE.Coin, "0");
            let s = NumberPlus.add(a, e);
            n.setItem(E_ASSET_TYPE.Coin, s);
            n.reportAddItem(E_ASSET_TYPE.Coin, e, t);
            if (o) {
                o();
            }
            if (t && t.notify) {
                cc.director.emit(GlobalEventName.AssetItemChange + E_ASSET_TYPE.Coin);
            }
        };
        t.callback = a;
        if (t.sourcePos) {
            this.flyAddItem(E_ASSET_TYPE.Coin, e, t);
        }
        else {
            a();
        }
        if (t && t.notify) {
            cc.director.emit(GlobalEventName.AssetItemChange + E_ASSET_TYPE.Coin);
        }
    }
    addDiams(e, t = null) {
        this.addItem(E_ASSET_TYPE.Diamond, e, t);
    }
    public addItem(id: number, value: number, n?: any): void {
        if (!NumberPlus.compare(0, value)) {
            if (id !== E_ASSET_TYPE.Coin) {
                if (!n) {
                    n = { notify: true };
                }
                this.addMemItem(id, value, n);
                if (n?.sourcePos) {
                    this.flyAddItem(id, value, n);
                    if (n.notify) {
                        cc.director.emit(GlobalEventName.AssetItemChange + id);
                    }
                }
                else {
                    const o = n.callback;
                    if (o) {
                        o();
                    }
                    cc.director.emit(GlobalEventName.AssetItemChange + id);
                }
            }
            else {
                this.addCoin(value, n);
            }
        }
    }
    public addMemItem(id: number, value: number, n: any = null): void {
        if (!NumberPlus.compare(0, value)) {
            switch (_AssetConfig.Instance.get(id).type) {
                case E_ITEM_TYPE.Asset:
                    const o = _.get(this.items, id, "0"), i = NumberPlus.add(o, value);
                    this.setItem(id, i);
                    break;
                case E_ITEM_TYPE.Gear:
                    Model.gear.addGear(id, Number(value));
                    break;
                case E_ITEM_TYPE.Hero:
                    Model.hero.unlock(id);
                    break;
                case E_ITEM_TYPE.Partner:
                    Model.partner.addPartner(id, Number(value));
                    break;
                case E_ITEM_TYPE.Skill:
                    Model.skill.addSkill(id, Number(value));
            }
            this.reportAddItem(id, value, n);
        }
    }
    decCoins(e, t = null) {
        return this.subItem(E_ASSET_TYPE.Coin, e, t);
    }
    decDiams(e, t) {
        return this.subItem(E_ASSET_TYPE.Diamond, e, t);
    }
    public flyAddItem(e: number, t: number, n: any): void {
        if (!n.notify) {
            let o = null;
            if (n && n.callback) {
                o = n.callback;
            }
            n.callback = (): void => {
                cc.director.emit(GlobalEventName.AssetItemChange + e);
                if (o) {
                    o();
                }
            };
        }
        if (e < E_ASSET_TYPE.Equip) {
            AssetFlyViewUI.Instance.addAsset(e, t, n);
        }
        else {
            AssetFlyViewUI.Instance.addOtherAsset(e, t, n);
        }
    }
    gaveUnlockTypeAferGuide() {
        return LocalStorageTool.getItemLocal("cc_user-next-unlock-data", 0);
    }
    getDwarvenKingDamageRecord() {
        return LocalStorageTool.getItemLocal("cc_user-dwarvenKing-damage-record", 0);
    }
    public getItem(id: any): any {
        return _.get(this.items, id, "0");
    }
    load() {
        this.items = this.loadItems();
    }
    loadItems() {
        return LocalStorageTool.getItemLocal("cc_user-currency", {});
    }
    public reportAddItem(e: number, t: any, n: any): void {
        if (t !== 0 && t !== "0") {
            if (e == E_ASSET_TYPE.Coin) {
                const o = {
                    GetGoldNum: t.toString(),
                    GetType: n?.type
                };
            }
            else if (e == E_ASSET_TYPE.Diamond) {
                const o = {
                    GemNum: Number(t),
                    GetType: n?.type
                };
            }
        }
    }
    public reportSubItem(id: number, value: number, n: any): void {
        if (id == E_ASSET_TYPE.Diamond) {
            const o = {
                GemNum: Number(value),
                GemUse_Type: n?.type
            };
        }
        else if (id == E_ASSET_TYPE.Coin) {
        }
    }
    saveDwarvenKingDamageRecord(e) {
        LocalStorageTool.setItemLocal("cc_user-dwarvenKing-damage-record", e);
    }
    saveItems() {
        LocalStorageTool.setItemLocal("cc_user-currency", this.items);
    }
    saveUnlockTypeAferGuide(e) {
        LocalStorageTool.setItemLocal("cc_user-next-unlock-data", e);
    }
    public setItem(id: number, value: number): void {
        _.set(this.items, id, value);
        this.saveItems();
    }
    public setMemItem(id: any, value: any): void {
        _.set(this.items, id, value);
    }
    public subItem(id: number, value: number, n: any = null): boolean {
        const o = _.get(this.items, id, "0");
        if (NumberPlus.compare(value, 0) && NumberPlus.compare(o, value)) {
            const r = NumberPlus.sub(o, value);
            this.setItem(id, r);
            cc.director.emit(GlobalEventName.AssetItemChange + id);
            this.reportSubItem(id, value, n);
            return true;
        }
        return false;
    }
    public static get Instance(): UserData {
        if (UserData._instance == null) {
            UserData._instance = new UserData();
        }
        return UserData._instance;
    }
    public get coins(): string {
        return _.get(this.items, E_ASSET_TYPE.Coin, "0");
    }
    public get diams(): string {
        return _.get(this.items, E_ASSET_TYPE.Diamond, "0");
    }
    public set modeLow(value: boolean) {
        this._modeLowBattery = value;
        LocalStorageTool.setItemLocal("cc_low-battery", this._modeLowBattery);
    }
    public get modeLow(): boolean {
        if (_.isNil(this._modeLowBattery)) {
            this._modeLowBattery = LocalStorageTool.getItemLocal("cc_low-battery", false);
            if (NativeBridge.Instance.checkIsLowPhone()) {
                this._modeLowBattery = true;
                LocalStorageTool.setItemLocal("cc_low-battery", this._modeLowBattery);
            }
        }
        return this._modeLowBattery!;
    }
}
