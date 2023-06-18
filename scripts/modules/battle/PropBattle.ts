import BattleWorld from "./BattleWorld";
import HeroAi from "../hero/HeroAi";
import PartnerAi from "../partner/PartnerAi";
import { GlobalEventName } from "../common/Events";
import { ENUM_PROP_TYPE, GameConst } from "../common/Const";
import Model from "../../ccstudio/data/Model";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
const _: any = window["_"];
const { ccclass, property } = cc._decorator;
@ccclass
export default class PropBattle extends cc.Component {
    private refreshMethods: {
        [key: number]: () => void;
    } = {};
    public init(): void {
        this.refreshMethods[ENUM_PROP_TYPE.ATK] = this.refreshUserAtk;
        this.refreshMethods[ENUM_PROP_TYPE.BaseAtk] = this.refreshUserAtk;
        this.refreshMethods[ENUM_PROP_TYPE.AddAtk] = this.refreshUserAtk;
        this.refreshMethods[ENUM_PROP_TYPE.HP] = this.refreshUserHp;
        this.refreshMethods[ENUM_PROP_TYPE.BaseHP] = this.refreshUserHp;
        this.refreshMethods[ENUM_PROP_TYPE.HPRecovery] = this.refreshUserHpRecovery;
        this.refreshMethods[ENUM_PROP_TYPE.HPRecoveryRate] = this.refreshUserHpRecoveryRate;
        this.refreshMethods[ENUM_PROP_TYPE.CriticalHitChance] = this.refreshCriticalChance;
        this.refreshMethods[ENUM_PROP_TYPE.CriticalHitDamage] = this.refreshCriticalDamage;
        this.refreshMethods[ENUM_PROP_TYPE.ASPD] = this.refreshAspd;
        this.refreshMethods[ENUM_PROP_TYPE.BuffAspd] = this.refreshAspd;
        this.refreshMethods[ENUM_PROP_TYPE.DoubleShot] = this.refreshDouble;
        this.refreshMethods[ENUM_PROP_TYPE.TripleShot] = this.refreshTriple;
        this.refreshMethods[ENUM_PROP_TYPE.BossDamageAmount] = this.refrshBossDamage;
        this.refreshMethods[ENUM_PROP_TYPE.BlessAtk] = this.refreshUserAtk;
        this.refreshMethods[ENUM_PROP_TYPE.BlessCoins] = this.refreshBlessCoins;
        this.refreshMethods[ENUM_PROP_TYPE.BlessSkill] = this.refreshSkillCd;
        this.refreshMethods[ENUM_PROP_TYPE.SkillCd] = this.refreshSkillCd;
        this.refreshMethods[ENUM_PROP_TYPE.PartnerAspd] = this.refreshPartnerAspd;
        this.refreshMethods[ENUM_PROP_TYPE.PartnerAspdRelic2] = this.refreshPartnerAspd;
        this.refreshMethods[ENUM_PROP_TYPE.PartnerAspdRelic12] = this.refreshPartnerAspd;
        this.refreshMethods[ENUM_PROP_TYPE.PartnerAtkRelic3] = this.refreshPartnerAtk;
        this.refreshMethods[ENUM_PROP_TYPE.PartnerAtk] = this.refreshPartnerAtk;
        cc.director.on(GlobalEventName.PropChange, this.onPropChange, this);
    }
    onPropChange(e) {
        const t = this.refreshMethods[e];
        if (t) {
            t.call(this);
        }
        else {
            cc.warn(`未找到对应的属性重算方法: ${e} ${ENUM_PROP_TYPE[e]}`);
        }
        cc.director.emit(GlobalEventName.PropValueChange, e);
    }
    refreshAspd() {
        const totalAspd = _.toNumber(Model.user.calcTotalAspd());
        this.hero.getComponent(HeroAi).atkFre = GameConst.ATK_FRE / totalAspd;
    }
    refreshBlessCoins() {
        _.toNumber(Model.user.calcProp(ENUM_PROP_TYPE.BlessCoins));
    }
    refreshCriticalChance() {
        this.hero.criticalChange = _.toNumber(Model.user.calcProp(ENUM_PROP_TYPE.CriticalHitChance));
        cc.director.emit(GlobalEventName.HeroCriticalChanceChange, this.hero.criticalChange);
    }
    refreshCriticalDamage() {
        this.hero.criticalDamge = Model.user.calcProp(ENUM_PROP_TYPE.CriticalHitDamage);
        cc.director.emit(GlobalEventName.HeroCriticalDamageChange, this.hero.criticalDamge);
    }
    refreshDouble() {
        this.hero.getComponent(HeroAi).doubleShot = _.toNumber(Model.user.calcProp(ENUM_PROP_TYPE.DoubleShot));
    }
    refreshPartnerAspd() {
        const partners = BattleWorld.Instance.partners;
        _.each(partners, function (partner) {
            if (partner) {
                const partnerAspd = Model.user.calcPartnerAspd(partner.cfgId);
                partner.getComponent(PartnerAi).atkFre = GameConst.ATK_FRE / partnerAspd;
            }
        });
    }
    refreshPartnerAtk() {
        const partners = BattleWorld.Instance.partners;
        _.each(partners, function (partner) {
            if (partner) {
                const partnerAtk = Model.user.calcPartnerAtk(partner.cfgId);
                partner.damage = partnerAtk;
            }
        });
    }
    refreshSkillCd() {
        BattleWorld.Instance.skillCtrl.cdAddation = Model.user.calcSkillCd();
    }
    refreshTriple() {
        this.hero.getComponent(HeroAi).tripleShot = _.toNumber(Model.user.calcProp(ENUM_PROP_TYPE.TripleShot));
    }
    refreshUserAtk() {
        const oldDamage = this.hero.damage;
        const newDamage = Model.user.calcAtk();
        if (this.hero.damage != newDamage.toString()) {
            this.hero.damage = newDamage;
            Model.partner.calcAllProp();
            const partners = this.partners;
            _.each(partners, function (partner) {
                if (partner) {
                    const partnerProp = Model.partner.getProp(partner.cfgId);
                    const partnerDamage = partnerProp.atk;
                    partner.damage = partnerDamage;
                }
            });
        }
    }
    refreshUserHp() {
        const maxHp = Model.user.calcProp(ENUM_PROP_TYPE.HP);
        const hpDifference = NumberPlus.sub(maxHp, this.hero.maxHp);
        this.hero.maxHp = maxHp;
        this.hero.hp = NumberPlus.add(this.hero.hp, hpDifference);
        cc.director.emit(GlobalEventName.HeroMaxHpChange, maxHp);
    }
    refreshUserHpRecovery() {
        this.hero.hpRecovery = Model.user.calcProp(ENUM_PROP_TYPE.HPRecovery);
    }
    refreshUserHpRecoveryRate() {
        this.hero.hpRecoveryRage = Model.user.calcProp(ENUM_PROP_TYPE.HPRecoveryRate);
    }
    refrshBossDamage() {
        _.toNumber(Model.user.calcProp(ENUM_PROP_TYPE.BossDamageAmount));
    }
    get buffCtrl() {
        return BattleWorld.Instance.buffCtrl;
    }
    get hero() {
        return BattleWorld.Instance.hero;
    }
    get partners() {
        return BattleWorld.Instance.partners;
    }
    get skillCtrl() {
        return BattleWorld.Instance.skillCtrl;
    }
}
