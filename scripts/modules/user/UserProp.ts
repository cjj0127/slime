import { GlobalEventName } from "../common/Events";
import { ENUM_PROP_TYPE, E_QUEST_ACTIVE_ID, E_ASSET_TYPE } from "../common/Const";
import LocalStorageTool from "../../ccstudio/utils/LocalStorage";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import _PropConfig from "../../ccstudio/config/_PropConfig";
import _PropLevelConfig from "../../ccstudio/config/_PropLevelConfig";
import UserData from "./UserData";
const h: any = window["_"];
// import { UserData } from 'xxx';
const { ccclass, property } = cc._decorator;
@ccclass
export default class UserProp {
    private static _instance: UserProp = null;
    private calcFuncs: any = {};
    private questActiveId: any = {};
    private userPorpDatas: {
        [key: number]: {
            level: number;
            needCoins: number;
            value: number;
            totalCost: number;
        };
    } = {}; // { level: number, needCoins: number, value: number, totalCost: number }
    public CriticalHitDamage(e: number, t: number): {
        value: number;
        needCoins: number;
    } {
        return {
            value: NumberPlus.add(e, 1 * (t - 1)),
            needCoins: t <= 100 ? _PropLevelConfig.Instance.get(ENUM_PROP_TYPE.CriticalHitDamage, t) : NumberPlus.mul(77, Math.pow(1.0053, t - 100))
        };
    }
    public TripleShot(e: string, t: number): {
        value: string;
        needCoins: number;
    } {
        return {
            value: (h.toNumber(e) + .1 * (t - 1)).toString(),
            needCoins: t <= 100 ? _PropLevelConfig.Instance.get(ENUM_PROP_TYPE.TripleShot, t) : NumberPlus.mul(NumberPlus.decode("15.6D"), Math.pow(1.08, t - 100))
        };
    }
    public calcAspd(e: string, t: number): {
        value: string;
        needCoins: number;
    } {
        return {
            value: (h.toNumber(e) + .01 * (t - 1)).toString(),
            needCoins: t <= 100 ? _PropLevelConfig.Instance.get(ENUM_PROP_TYPE.ASPD, t) : NumberPlus.mul(6300, Math.pow(1.03, t - 100))
        };
    }
    calcAtkValue(e: number, t: number) {
        return {
            value: NumberPlus.add(e, 10 * (t - 1)),
            needCoins: t <= 100 ? _PropLevelConfig.Instance.get(ENUM_PROP_TYPE.ATK, t) : NumberPlus.mul(155, Math.pow(1.0053, t - 100))
        };
    }
    public calcCriticalHitChance(e: string, t: number): {
        value: string;
        needCoins: number;
    } {
        return {
            value: (h.toNumber(e) + .1 * (t - 1)).toString(),
            needCoins: t <= 100 ? _PropLevelConfig.Instance.get(ENUM_PROP_TYPE.CriticalHitChance, t) : NumberPlus.mul(6300, Math.pow(1.033, t - 100))
        };
    }
    public calcDoubleShot(e: string, t: number): {
        value: string;
        needCoins: number;
    } {
        return {
            value: (h.toNumber(e) + .1 * (t - 1)).toString(),
            needCoins: t <= 100 ? _PropLevelConfig.Instance.get(ENUM_PROP_TYPE.DoubleShot, t) : NumberPlus.mul(NumberPlus.decode("1B"), Math.pow(1.015, t - 100))
        };
    }
    calcHP(e: number, t: number) {
        return {
            value: NumberPlus.add(e, 10 * (t - 1)),
            needCoins: t <= 100 ? _PropLevelConfig.Instance.get(ENUM_PROP_TYPE.HP, t) : NumberPlus.mul(100, Math.pow(1.0053, t - 100))
        };
    }
    public calcHPRecovery(e: number, t: number): {
        value: number;
        needCoins: number;
    } {
        return {
            value: NumberPlus.add(e, .7 * (t - 1)),
            needCoins: t <= 100 ? _PropLevelConfig.Instance.get(ENUM_PROP_TYPE.HPRecovery, t) : NumberPlus.mul(100, Math.pow(1.0053, t - 100))
        };
    }
    getCurEquipString() {
        let e = "";
        for (let t = 1; t <= 8; t++) {
            e = 1 == t ? this.getData(t).level.toString() : e + "|" + this.getData(t).level.toString();
        }
        return e;
    }
    getData(e: any) {
        return this.userPorpDatas[e];
    }
    public getQuestActiveId(propType: any) {
        return this.questActiveId[propType];
    }
    init() {
        for (let e = ENUM_PROP_TYPE.ATK; e <= ENUM_PROP_TYPE.TripleShot; e++) {
            const t = this.questActiveId[e];
            const n = this.getData(e);
            cc.director.emit(GlobalEventName.QuestCommit, t, n.level);
        }
    }
    isMaxLevel(e: number, t: number = 0) {
        const n = _PropConfig.Instance.get(e);
        return n.levelMax > 0 && t >= n.levelMax;
    }
    levelUp(propId: number, lv: number) {
        let changeLevel = 0;
        let costCoins = [];
        const info = this.userPorpDatas[propId];
        const func = this.calcFuncs[propId];
        if (!func) {
            cc.error("未找到计算属性的方法！！！", propId);
        }
        for (let l = _PropConfig.Instance.get(propId), f = info.level, d = info.needCoins; lv > 0 && !this.isMaxLevel(propId, f);) {
            const h = UserData.Instance.getItem(E_ASSET_TYPE.Coin);
            if (!NumberPlus.compare(h, d))
                break;
            UserData.Instance.setMemItem(E_ASSET_TYPE.Coin, NumberPlus.sub(h, d));
            costCoins.push(d);
            const g = func.call(this, l.base, f + 1);
            d = g.needCoins;
            info.totalCost = NumberPlus.add(info.totalCost, d);
            info.level = ++f;
            info.needCoins = d;
            info.value = g.value;
            lv--;
            changeLevel++;
        }
        if (changeLevel > 0) {
            cc.director.emit(GlobalEventName.AssetItemChange + E_ASSET_TYPE.Coin);
            UserData.Instance.saveItems();
        }
        return { changeLevel, costCoins };
    }
    levelUpEnable(id: number) {
        const t = this.userPorpDatas[id];
        if (h.isNil(t)) {
            cc.error(`升级失败：未找到升级属性[${id}]的运行数据`);
        }
        const n = t.needCoins;
        return NumberPlus.compare(UserData.Instance.coins, n);
    }
    load() {
        for (let e = ENUM_PROP_TYPE.ATK; e <= ENUM_PROP_TYPE.TripleShot; e++) {
            const t = _PropConfig.Instance.get(e);
            const n = this.loadUserPorpLevel(e);
            const o = n.level;
            const i = n.totalCost;
            const a = this.calcFuncs[e];
            if (!a) {
                cc.error("未找到计算属性的方法！！！", e);
            }
            const c = a.call(this, t.base, o);
            const l = c.value;
            const u = c.needCoins;
            this.userPorpDatas[e] = { level: o, needCoins: u, value: l, totalCost: i };
        }
    }
    loadUserPorpLevel(e: number) {
        return LocalStorageTool.getItemLocal(`user_prop_${e}`, { level: 1, totalCost: "0" });
    }
    lvupCoins(id: number) {
        return this.userPorpDatas[id].needCoins;
    }
    saveUserPropLevel(id: number, t: number, n: any) {
        LocalStorageTool.setItemLocal(`user_prop_${id}`, { level: t, totalCost: n });
    }
    constructor() {
        this.calcFuncs[ENUM_PROP_TYPE.ATK] = this.calcAtkValue;
        this.calcFuncs[ENUM_PROP_TYPE.HP] = this.calcHP;
        this.calcFuncs[ENUM_PROP_TYPE.HPRecovery] = this.calcHPRecovery;
        this.calcFuncs[ENUM_PROP_TYPE.ASPD] = this.calcAspd;
        this.calcFuncs[ENUM_PROP_TYPE.CriticalHitChance] = this.calcCriticalHitChance;
        this.calcFuncs[ENUM_PROP_TYPE.CriticalHitDamage] = this.CriticalHitDamage;
        this.calcFuncs[ENUM_PROP_TYPE.DoubleShot] = this.calcDoubleShot;
        this.calcFuncs[ENUM_PROP_TYPE.TripleShot] = this.TripleShot;
        this.questActiveId[ENUM_PROP_TYPE.ATK] = E_QUEST_ACTIVE_ID.EnhanceAtk;
        this.questActiveId[ENUM_PROP_TYPE.HP] = E_QUEST_ACTIVE_ID.EnhanceHp;
        this.questActiveId[ENUM_PROP_TYPE.HPRecovery] = E_QUEST_ACTIVE_ID.EnhanceHPRecovery;
        this.questActiveId[ENUM_PROP_TYPE.ASPD] = E_QUEST_ACTIVE_ID.EnhanceAspd;
        this.questActiveId[ENUM_PROP_TYPE.CriticalHitChance] = E_QUEST_ACTIVE_ID.EnhanceCriticalHitChance;
        this.questActiveId[ENUM_PROP_TYPE.CriticalHitDamage] = E_QUEST_ACTIVE_ID.EnhanceCriticalHitDamage;
        this.questActiveId[ENUM_PROP_TYPE.DoubleShot] = E_QUEST_ACTIVE_ID.EnhanceDouble;
        this.questActiveId[ENUM_PROP_TYPE.TripleShot] = E_QUEST_ACTIVE_ID.EnhanceTriple;
    }
    public static get Instance(): UserProp {
        if (UserProp._instance == null) {
            UserProp._instance = new UserProp();
        }
        return UserProp._instance;
    }
}
