import { GlobalEventName } from "../common/Events";
import { GameConst, E_QUEST_ACTIVE_ID, E_ASSET_TYPE, MapUIPrefabs } from "../common/Const";
import _HeroConfig from "../../ccstudio/config/_HeroConfig";
import _HeroExpConfig from "../../ccstudio/config/_HeroExpConfig";
import LocalStorageTool from "../../ccstudio/utils/LocalStorage";
import Model from "../../ccstudio/data/Model";
import ModelBase from "../../ccstudio/data/ModelBase";
import PropAddationEventTarget from "../common/PropAddation";
import UserData from "../user/UserData";
const _: any = window['_'];
export default class HeroData {
    private _battleId: number = 1;
    private _battleMembers: number[] = [];
    private _heroDatas: {
        [key: string]: any;
    } = {};
    private static _instance: HeroData = null;
    private _totalLevel: number = 0;
    addExp(e: number, t: number) {
        const heroData = this.getData(e);
        if (_.isNil(heroData))
            cc.error("还每解锁：" + e);
        else {
            const configData = _HeroConfig.Instance.get(e);
            if (heroData.level >= configData.maxLevel)
                cc.error(`已经达到最大等级${e}`);
            else {
                let needExp = _HeroExpConfig.Instance.get(heroData.level);
                if ((heroData.exp += t) >= needExp) {
                    while (true) {
                        heroData.exp -= needExp;
                        heroData.level++;
                        this.totalLevel++;
                        cc.director.emit(GlobalEventName.QuestCommit, E_QUEST_ACTIVE_ID.HeroLvup, this.totalLevel);
                        UserData.Instance.addItem(E_ASSET_TYPE.Sp, 1);
                        const unlockProp = this.tryUnlockProp(e, heroData.level);
                        const unlockSkill = this.tryUnlockSkill(e, heroData.level);
                        if (unlockProp) {
                            Model.ui.openViewAsync(MapUIPrefabs.HeroUnlockProp, {
                                data: {
                                    heroId: e,
                                    unlock: unlockProp,
                                },
                            });
                            cc.director.emit(GlobalEventName.HeroUnlockProp, e, unlockProp);
                        }
                        if (unlockSkill) {
                            Model.ui.openViewAsync(MapUIPrefabs.HeroUnlockProp, {
                                data: {
                                    heroId: e,
                                    unlock: unlockSkill,
                                },
                            });
                            cc.director.emit(GlobalEventName.HeroUnlockSkill, e, unlockSkill);
                        }
                        if (heroData.level == configData.maxLevel) {
                            heroData.exp = needExp;
                            break;
                        }
                        if ((needExp = _HeroExpConfig.Instance.get(heroData.level)) > heroData.exp)
                            break;
                    }
                    cc.director.emit(GlobalEventName.HeroLevelChange, e);
                }
                else
                    cc.director.emit(GlobalEventName.HeroExpChange, e);
                this.save();
            }
        }
    }
    changeHeroSkill(e: number): void {
        const t = _HeroConfig.Instance.get(e);
        const n = this.getData(e).level;
        n >= t.skillUnlockLv ? Model.skill.heroSkillId = t.skillId : Model.skill.heroSkillId = -1;
    }
    createData(e: number, t = 1, n = 0) {
        return {
            id: e,
            level: t,
            exp: n,
            propAdds: [],
        };
    }
    getAllDatas() {
        return this._heroDatas;
    }
    getCurrOwnedString() {
        const e = [];
        this._heroDatas.forEach((t) => {
            e.push(`${t.id}|${t.level}`);
        });
        return e.join(",");
    }
    getData(e: number) {
        return this._heroDatas[e];
    }
    load(): void {
        const e = this;
        let t = LocalStorageTool.getItemLocal("cc_user-hero-data");
        if (this._heroDatas = {}, _.isNil(t)) {
            this._battleId = GameConst.DEFAULT_HERO_ID;
            this._battleMembers = [];
            this.totalLevel = 0;
            this.unlock(GameConst.DEFAULT_HERO_ID);
            this.save();
        }
        else {
            this._battleId = _.get(t, "battleId");
            const n = _.get(t, "heroDatas", {});
            this._battleMembers = _.get(t, "battleMembers", []);
            this.totalLevel = 0;
            _.each(n, (t: any) => {
                const n = t.id;
                const o = t.exp;
                const r = t.level;
                e.totalLevel += r;
                const i = _HeroConfig.Instance.get(n);
                if (i) {
                    const a = i.props;
                    const c = i.unlockPropLvs;
                    const l = i.propValues;
                    const u: PropAddationEventTarget[] = [];
                    _.each(a, (e: string, t: number) => {
                        const n = c[t];
                        const o = l[t];
                        if (r >= n) {
                            const i = new PropAddationEventTarget;
                            i.setProp(e);
                            i.value = `${o}`;
                            i.active();
                            u.push(i);
                        }
                    });
                    e._heroDatas[n] = {
                        id: n,
                        exp: o,
                        level: r,
                        propAdds: u
                    };
                }
            });
        }
    }
    private reportHeroGet(e: number) {
        const data = _HeroConfig.Instance.get(e);
        const n = {
            Hero_Cost: _.toString(data.unlockCost),
            Hero_ID: e,
            Hero_Quality: data.grade,
            Hero_Type: data.unlockType,
        };
    }
    save(): void {
        const e: any = {};
        _.set(e, "battleId", this._battleId);
        const t: any = {};
        _.each(this._heroDatas, (e: any) => {
            t[e.id] = {
                id: e.id,
                level: e.level,
                exp: e.exp
            };
        });
        _.set(e, "heroDatas", t);
        _.set(e, "battleMembers", this.battleMembers);
        LocalStorageTool.setItemLocal("cc_user-hero-data", e);
    }
    saveMembers(): void {
        this.save();
    }
    tryUnlockProp(e: number, t: number) {
        const data = _HeroConfig.Instance.get(e);
        const heroData = this.getData(e);
        const props = data.props;
        const unlockPropLvs = data.unlockPropLvs;
        const propValues = data.propValues;
        const propAdds = heroData.propAdds;
        for (let i = 0; i < unlockPropLvs.length; i++) {
            if (t == unlockPropLvs[i]) {
                const u = props[i];
                const p = propValues[i];
                const d = new PropAddationEventTarget();
                d.setProp(u);
                d.value = `${p}`;
                d.active();
                propAdds.push(d);
                return {
                    prop: u,
                    value: p,
                };
            }
        }
    }
    tryUnlockSkill(e: number, t: number) {
        const data = _HeroConfig.Instance.get(e);
        if (t == data.skillUnlockLv) {
            Model.skill.heroSkillId = data.skillId;
            return data.skillId;
        }
        return null;
    }
    unlock(e: number) {
        this._heroDatas[e] = this.createData(e);
        this.totalLevel++;
        this.reportHeroGet(e);
        this.save();
    }
    public static get Instance() {
        return this._instance || (this._instance = new HeroData());
    }
    public get battleId(): number {
        return this._battleId;
    }
    public set battleId(value: number) {
        if (this._battleId !== value) {
            const t = this._battleId;
            this._battleId = value;
            this.changeHeroSkill(value);
            const n = this.battleMembers;
            const o = n.indexOf(value);
            if (o >= 0) {
                n[o] = t;
            }
            this.save();
        }
    }
    get battleMembers(): Array<number> {
        return this._battleMembers;
    }
    set battleMembers(e: Array<number>) {
        this._battleMembers = _.filter(e, (e: number) => !_.isNil(e) && e > 0);
        this.save();
    }
    get battleSkillId(): number {
        const e = _HeroConfig.Instance.get(this.battleId);
        const t = this.getData(this.battleId).level;
        return (t && t >= e.skillUnlockLv) ? e.skillId : -1;
    }
    public get totalLevel(): number {
        return this._totalLevel;
    }
    public set totalLevel(value: number) {
        if (this._totalLevel !== value) {
            this._totalLevel = value;
            cc.director.emit(GlobalEventName.HeroTotalLevelChange);
        }
    }
}
