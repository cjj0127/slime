import GuideMgr from "../guide/GuideMgr";
import { SpecialGuideEnum } from "../guide/GuideEnums";
import { E_ToggleShopType } from "../common/Const";
const { ccclass, property } = cc._decorator;
@ccclass
export default class ToggleShop extends cc.Component {
    delegate: any = null;
    @property({ type: cc.Enum(E_ToggleShopType) })
    shopType: E_ToggleShopType = E_ToggleShopType.Summon;
    onLoad() {
        this.node.getComponent;
        this.node.on("toggle", this.onToggle, this);
    }
    onToggle() {
        GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchSkillButton);
        GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchGearButton);
        GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchPartnerButton);
    }
}
