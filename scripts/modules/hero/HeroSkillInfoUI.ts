import LanMgr from "../common/Language";
import { IMAGE_ICON_PATH_ } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
import _SkillConfig from "../../ccstudio/config/_SkillConfig";
// import * as AssetRes from "AssetRes";
const { ccclass, property } = cc._decorator;
@ccclass
export default class HeroSkillInfoUI extends cc.Component {
    @property(cc.Label)
    descLabel: cc.Label = null;
    @property(cc.Sprite)
    iconSprite: cc.Sprite = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;
    private skillId: number = 0;
    @property(cc.Node)
    skillLocked: cc.Node = null;
    @property(cc.Label)
    skillUnlockLvLabel: cc.Label = null;
    public refresh() {
        const skillCfg = _SkillConfig.Instance.get(this.skillId);
        this.setIcon(skillCfg.icon);
        this.setNameStr(skillCfg.name);
        this.setDescStr(skillCfg.desc);
    }
    private setDescStr(desc: string) {
        this.descLabel.string = LanMgr.Instance.getLangByID(desc);
    }
    private setIcon(icon: string) {
        const imagePath = `${IMAGE_ICON_PATH_}/${icon}`;
        this.iconSprite.spriteFrame = AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, imagePath);
    }
    private setNameStr(name: string) {
        this.nameLabel.string = LanMgr.Instance.getLangByID(name);
    }
    public setSkill(skillId: number) {
        if (this.skillId !== skillId) {
            this.skillId = skillId;
            this.refresh();
        }
    }
    public setState(state: number, requiredLevel: number) {
        this.skillLocked.active = state < requiredLevel;
        this.skillUnlockLvLabel.string = `LV${requiredLevel}`;
    }
}
