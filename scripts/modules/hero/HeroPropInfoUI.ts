import { ENUM_PROP_TYPE } from "../common/Const";
import Model from "../../ccstudio/data/Model";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import _PropConfig from "../../ccstudio/config/_PropConfig";
import HeroPropListItemUI from "./HeroPropListItemUI";
import UIPool from "../common/UIPool";
const { ccclass, property } = cc._decorator;
const propTypes = [
    ENUM_PROP_TYPE.ATK, ENUM_PROP_TYPE.HP,
    ENUM_PROP_TYPE.HPRecovery,
    ENUM_PROP_TYPE.ASPD,
    ENUM_PROP_TYPE.CriticalHitChance,
    ENUM_PROP_TYPE.CriticalHitDamage,
    ENUM_PROP_TYPE.DoubleShot,
    ENUM_PROP_TYPE.TripleShot,
    ENUM_PROP_TYPE.MoveSpeed,
    ENUM_PROP_TYPE.CoinAdd,
    ENUM_PROP_TYPE.SkillHurtAdd,
    ENUM_PROP_TYPE.PartnerAspd,
    ENUM_PROP_TYPE.BossDamageAmount,
    ENUM_PROP_TYPE.SkillCd,
    ENUM_PROP_TYPE.HeroExpAdd,
    ENUM_PROP_TYPE.NormalAtk,
    ENUM_PROP_TYPE.PickaxSpeed,
    ENUM_PROP_TYPE.PickaxMax,
    ENUM_PROP_TYPE.CubeAdd,
    ENUM_PROP_TYPE.ResearchSpeedAdd];
@ccclass
export default class HeroPropInfoUI extends UIPool {
    @property(cc.Layout)
    content: cc.Layout = null;
    private propItems: HeroPropListItemUI[] = [];
    public onEnable(): void {
        this.syncProps();
    }
    private syncProps(): void {
        for (let i = 0; i < propTypes.length; i++) {
            const type = propTypes[i];
            const cfg = _PropConfig.Instance.get(type);
            let value: any = 0;
            switch (type) {
                case ENUM_PROP_TYPE.ATK:
                case ENUM_PROP_TYPE.HP:
                case ENUM_PROP_TYPE.HPRecovery:
                case ENUM_PROP_TYPE.ASPD:
                case ENUM_PROP_TYPE.CriticalHitChance:
                case ENUM_PROP_TYPE.CriticalHitDamage:
                case ENUM_PROP_TYPE.DoubleShot:
                case ENUM_PROP_TYPE.TripleShot:
                    value = Model.user.calcProp(type);
                    break;
                case ENUM_PROP_TYPE.SkillCd:
                    value = 100 * Model.user.calcSkillCd();
                    break;
                case ENUM_PROP_TYPE.CoinAdd:
                    value = NumberPlus.add(Model.user.calcPropAddation(type), Model.user.calcPropAddation(ENUM_PROP_TYPE.BlessCoins));
                    break;
                default:
                    value = Model.user.calcPropAddation(type);
                    break;
            }
            if (value !== 0) {
                let propItem = this.propItems[type];
                if (!propItem) {
                    const item = this.get();
                    item.parent = this.content.node;
                    item.setSiblingIndex(i);
                    propItem = this.propItems[type] = item.getComponent(HeroPropListItemUI);
                }
                propItem.setNameStr(cfg.name);
                propItem.setValue(type, value);
            }
            else if (this.propItems[type]) {
                const item = this.propItems[type];
                this.put(item);
                this.propItems[type] = null;
            }
        }
    }
}
