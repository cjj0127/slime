import { E_MINE_RESEARCH_STATUS } from "./MineResearchModel";
import { E_RED_Tip, RedDotCfg } from "../config/_RedConfig";
import { GlobalEventName } from "../../modules/common/Events";
import { E_COLLECTION_TYPE, EUNLOCKSYS_ID, E_GEAR_TYPE, E_SUMMON_TYPE, E_ASSET_TYPE, E_QUEST_STATUS } from "../../modules/common/Const";
import BlessData from "../../modules/bless/BlessData";
import _BlessTypeConfig from "../config/_BlessTypeConfig";
import CollectionData from "../../modules/collection/CollectionData";
import MailMgr from "../../modules/mail/MailMgr";
import _MasteryConfig from "../config/_MasteryConfig";
import MasteryModel, { E_MASTERY_STATUS } from "./MasteryModel";
import ShopModel from "./ShopModel";
import ModeBase from "./ModelBase";
import Model from "./Model";
import QuestChain from "../../modules/quest/QuestChain";
import QuestDaily from "../../modules/quest/QuestDaily";
import QuestPass from "../../modules/quest/QuestPass";
import RedDotNode from "../../modules/common/RedDotNode";
import UserData from "../../modules/user/UserData";
const _: any = window["_"];
export default class RedModel extends ModeBase {
    nodeRoot = new RedDotNode();
    nodes = {};
   
    calRingRedCount() {
        return 0;
    }
    
    calcAllDailyAdCount() {
        return QuestDaily.Instance.getReceiveEnableCount() > 0 ? 0 : QuestDaily.Instance.getReceiveAdEnableCount();
    }
    
    calcAllDailyCount() {
        return QuestDaily.Instance.getReceiveEnableCount();
    }
   
    calcArmorLvupCount(): number {
        const e = Model.gear.getAllGears(E_GEAR_TYPE.ARMOR);
        let t = 0;
        _.each(e, (gear) => {
            const n = gear.data;
            if (n && (Model.gear.lvupEnable(n.id) || Model.gear.transNextEnable(n.id))) {
                t++;
            }
        });
        return t;
    }
   
    calcArmorRedCount(): number {
        let e = 0;
        e += this.calcArmorLvupCount();
        const t = Model.gear.equipArmorId;
        const n = Model.gear.getMaxOwnGear(E_GEAR_TYPE.ARMOR);
        if (n > 0 && n !== t) {
            e++;
        }
        return e;
    }
   
    calcChainCount() {
        return QuestChain.Instance.getReceiveEnable(QuestChain.Instance.chainQuestId);
    }
  
    calcCollectionEnable(e: number) {
        const t = CollectionData.Instance.getData(e);
        return t.lv < t.unlockLv;
    }

    calcCollectionGear(): number {
        return CollectionData.Instance.getLvupEnableItems(E_COLLECTION_TYPE.Gear).length;
    }

    calcCollectionPartner(): number {
        return CollectionData.Instance.getLvupEnableItems(E_COLLECTION_TYPE.Partner).length;
    }

    calcCollectionSkill(): number {
        return CollectionData.Instance.getLvupEnableItems(E_COLLECTION_TYPE.Skill).length;
    }

    calcDailyEnable(e: number) {
        const t = QuestDaily.Instance.getData(e);
        return !!t && t.status == E_QUEST_STATUS.Complete;
    }

    calcHeroEnhanceExpCount(): number {
        return Model.user.isUnlock(EUNLOCKSYS_ID.Hero) ? Model.hero.lvupEnableHeros().length : 0;
    }

    calcMailRedDot() {
        return !MailMgr.Instance.isEmpty();
    }

    calcMineResearchCount() {
        if (!Model.user.isUnlock(EUNLOCKSYS_ID.Mine))
            return 0;
        const currUpgradingId = Model.mineResearch.currUpgradingId;
        if (currUpgradingId > 0) {
            return Model.mineResearch.getData(currUpgradingId).status == E_MINE_RESEARCH_STATUS.EComplete ? 1 : 0;
        }
        else {
            return Model.mineResearch.getLvupEnableDatas().length > 0 ? 1 : 0;
        }
    }

    calcMineResearchItemEnable(e) {
        if (!Model.user.isUnlock(EUNLOCKSYS_ID.Mine))
            return 0;
        if (Model.mineResearch.currUpgradingId > 0)
            return 0;
        let count = Model.mineResearch.lvupEnable(e) ? 1 : 0;
        return count;
    }
  
    calcPartnerCount(): number {
        const e = Model.partner.getAllData();
        let t = 0;
        _.each(e, (partner) => {
            if (partner && (Model.partner.lvupEnable(partner.id) || Model.partner.transNextEnable(partner.id))) {
                t++;
            }
        });
        return t;
    }

    calcPassCount() {
        const e = Model.pass.getAllLevelData();
        let t = 0;
        _.each(e, (data: any) => {
            if (!data.normalReceived) {
                t++;
            }
            if (Model.pass.premiumActive && !data.premiumReceived) {
                t++;
            }
        });
        t += Model.pass.getExtralReceiveCount();
        return t;
    }

    calcQuestPassCount() {
        return QuestPass.Instance.getReceiveEnableCount();
    }

    calcRouletteCount(): number {
        return Model.roulette.getCdTime() > 0 ? 0 : Model.roulette.getLastSpinCount();
    }
   
    calcSevenChallengeRedDot() {
        return Model.sevenChallenge.isShowAllRedDot();
    }

    calcSkillCount(): number {
        const e = Model.skill.getAllData();
        let t = 0;
        _.each(e, (skill) => {
            if (skill && (Model.skill.lvupEnable(skill.id) || Model.skill.transNextEnable(skill.id))) {
                t++;
            }
        });
        return t;
    }

    calcSummonItemCount(e: number): number {
        if (e != E_SUMMON_TYPE.Weapon && e != E_SUMMON_TYPE.Armor) {
            e = E_SUMMON_TYPE.Gear;
        }
        switch (e) {
            case E_SUMMON_TYPE.Skill:
                if (Model.user.isUnlock(EUNLOCKSYS_ID.Skill) && Model.summon.getAdCd(E_SUMMON_TYPE.Skill) <= 0) {
                    return Model.summon.getAdCount(E_SUMMON_TYPE.Skill);
                }
                break;
            case E_SUMMON_TYPE.Partner:
                if (Model.user.isUnlock(EUNLOCKSYS_ID.Partner) && Model.summon.getAdCd(E_SUMMON_TYPE.Partner) <= 0) {
                    return Model.summon.getAdCount(E_SUMMON_TYPE.Partner);
                }
                break;
            case E_SUMMON_TYPE.Gear:
                if (Model.user.isUnlock(EUNLOCKSYS_ID.Equip) && Model.summon.getAdCd(E_SUMMON_TYPE.Gear) <= 0) {
                    return Model.summon.getAdCount(E_SUMMON_TYPE.Gear);
                }
                break;
        }
        return 0;
    }

    calcWeaponLvupCount(): number {
        const e = Model.gear.getAllGears(E_GEAR_TYPE.WEAPON);
        let t = 0;
        _.each(e, (gear) => {
            gear.cfg;
            const n = gear.data;
            if (n && (Model.gear.lvupEnable(n.id) || Model.gear.transNextEnable(n.id))) {
                t++;
            }
        });
        return t;
    }

    calcWeaponRedCount(): number {
        let e = this.calcWeaponLvupCount();
        const t = Model.gear.equipWeaponId;
        const n = Model.gear.getMaxOwnGear(E_GEAR_TYPE.WEAPON);
        if (n > 0 && n !== t) {
            e++;
        }
        return e;
    }
    
    calceBlessCount() {
        let count = 0;
        const cfg = _BlessTypeConfig.Instance.cfg;
        for (const key in cfg) {
            const type = cfg[key].type;
            const blessData = BlessData.Instance.getData(type);
            if (blessData.exp == 0 && blessData.level <= 1) {
                count++;
            }
        }
        return count;
    }
    
    calceMasteryCount() {
        let count = 0;
        const sp = parseInt(UserData.Instance.getItem(E_ASSET_TYPE.Sp));
        const datas = Model.mastery.getAllDatas();
        _.each(datas, (data) => {
            if (data.status == E_MASTERY_STATUS.EOpen && _MasteryConfig.Instance.get(data.id).costSp <= sp) {
                count++;
            }
        });
        return count;
    }
   
    calceMenuShopAdCount(): number {
        if (!Model.user.isUnlock(EUNLOCKSYS_ID.Shop)) {
            return 0;
        }
        if (Model.shop.getFreeEnable()) {
            return 0;
        }
        let e = 0;
        if (Model.user.isUnlock(EUNLOCKSYS_ID.Skill) && Model.summon.getAdCd(E_SUMMON_TYPE.Skill) <= 0) {
            e += Model.summon.getAdCount(E_SUMMON_TYPE.Skill);
        }
        if (Model.user.isUnlock(EUNLOCKSYS_ID.Equip) && Model.summon.getAdCd(E_SUMMON_TYPE.Gear) <= 0) {
            e += Model.summon.getAdCount(E_SUMMON_TYPE.Gear);
        }
        if (Model.user.isUnlock(EUNLOCKSYS_ID.Partner) && Model.summon.getAdCd(E_SUMMON_TYPE.Partner) <= 0) {
            e += Model.summon.getAdCount(E_SUMMON_TYPE.Partner);
        }
        return e;
    }
    
    calceRouletteAdCount() {
        if (Model.roulette.getCdTime() > 0)
            return 0;
        let count = Model.roulette.freeSpinEnable() ? 0 : Model.roulette.getLastSpinCount();
        return count;
    }
    
    calceRouletteFreeCount() {
        if (Model.roulette.getCdTime() > 0)
            return 0;
        let count = Model.roulette.freeSpinEnable() ? 1 : 0;
        return count;
    }

    calceShopCount(): number {
        if (!Model.user.isUnlock(EUNLOCKSYS_ID.Shop)) {
            return 0;
        }
        let e = 0;
        if (Model.shop.getFreeEnable()) {
            e++;
        }
        return e;
    }
    
    calceSummonAdCount(): number {
        let e = 0;
        if (Model.user.isUnlock(EUNLOCKSYS_ID.Skill) && Model.summon.getAdCd(E_SUMMON_TYPE.Skill) <= 0) {
            e += Model.summon.getAdCount(E_SUMMON_TYPE.Skill);
        }
        if (Model.user.isUnlock(EUNLOCKSYS_ID.Equip) && Model.summon.getAdCd(E_SUMMON_TYPE.Gear) <= 0) {
            e += Model.summon.getAdCount(E_SUMMON_TYPE.Gear);
        }
        if (Model.user.isUnlock(EUNLOCKSYS_ID.Partner) && Model.summon.getAdCd(E_SUMMON_TYPE.Partner) <= 0) {
            e += Model.summon.getAdCount(E_SUMMON_TYPE.Partner);
        }
        return e;
    }
    
    createNodes(e: any) {
        const n: any = {};
        _.each(e, (e: any, o: string) => {
            const r = parseInt(o);
            const i = new RedDotNode;
            i.redId = r;
            const a = this[e.method];
            if (a) {
                i.setCalcFunc(a.bind(this), e.param);
            }
            n[r] = i;
        });
        _.each(e, (e: any, t: string) => {
            const o = parseInt(t);
            const r = n[o];
            if (e.parent) {
                n[e.parent].addChild(r);
            }
        });
        return n;
    }

    getNode(e: number) {
        return this.nodes[e];
    }

    initLoadData() {
        this.registerEvent();
    }

    load() {
        this.nodeRoot.redId = E_RED_Tip.eRedRoot;
        this.nodes = this.createNodes(RedDotCfg);
    }
    
    onDestroy() {
        this.nodes = {};
        this.removeEvents();
    }

    onEvent(e: number) {
        this.reCalculate(e);
    }

    reCalculate(e: number) {
        const t = this.getNode(e);
        if (t) {
            t.clearResult();
            t.clearParent();
            t.clearChildren();
            cc.director.emit(GlobalEventName.RedDotRefresh, e);
        }
    }
    
    registerEvent() {
        _.each(RedDotCfg, (t: any, n: string) => {
            const o = parseInt(n);
            let r = t.event;
            if (typeof r == "string") {
                r = [r];
            }
            _.forEach(r, (t: string) => {
                cc.director.on(t, () => {
                    return this.onEvent(o);
                });
            });
        });
    }
    
    removeEvents() {
        _.each(RedDotCfg, (e: any) => {
            let t = e.event;
            if (typeof t == "string") {
                t = [t];
            }
            _.forEach(t, (e: string) => {
                cc.director.off(e);
            });
        });
        cc.director.targetOff(this);
    }
    ;
}
