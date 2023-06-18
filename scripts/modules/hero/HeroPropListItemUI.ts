import LanMgr from "../common/Language";
import { ENUM_PROP_TYPE } from "../common/Const";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
// import NumberPlus from "NumberPlus";
const { ccclass, property } = cc._decorator;
@ccclass
export default class HeroPropListItemUI extends cc.Component {
    @property(cc.Label)
    propNameLabel: cc.Label = null;
    @property(cc.Label)
    propValue: cc.Label = null;
    formatValue(e: number, t: number): string {
        switch (e) {
            case ENUM_PROP_TYPE.ATK:
            case ENUM_PROP_TYPE.HP:
            case ENUM_PROP_TYPE.HPRecovery:
                return `${NumberPlus.format(t)}`;
            case ENUM_PROP_TYPE.CriticalHitDamage:
                return `${NumberPlus.format(t)}%`;
            case ENUM_PROP_TYPE.DoubleShot:
            case ENUM_PROP_TYPE.TripleShot:
            case ENUM_PROP_TYPE.CriticalHitChance:
                return `${Number(t).toFixed(2)}%`;
            case ENUM_PROP_TYPE.ASPD:
                return `${Number(t).toFixed(2)}`;
            case ENUM_PROP_TYPE.SkillCd:
                return `${Math.ceil(Number(t))}%`;
            default:
                return `${t}%`;
        }
    }
    setNameStr(e: string): void {
        this.propNameLabel.string = LanMgr.Instance.getLangByID(e);
    }
    setValue(e: number, t: number): void {
        this.propValue.string = this.formatValue(e, t);
    }
}
