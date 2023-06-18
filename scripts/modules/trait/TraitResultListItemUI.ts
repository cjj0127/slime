import LanMgr from "../common/Language";
import _PropConfig from "../../ccstudio/config/_PropConfig";
import GradeLabelUI from "../battle/GradeLabelUI";
import TraitKindIconUI from "./TraitKindIconUI";
const { ccclass, property } = cc._decorator;
@ccclass
export default class TraitResultListItemUI extends cc.Component {
    @property(TraitKindIconUI)
    comboIcon = null;
    @property(cc.Label)
    descLabel = null;
    @property(GradeLabelUI)
    gradeLabel = null;
    @property(cc.Sprite)
    lockSprite = null;
    @property(cc.SpriteFrame)
    lockedSpriteFrame = null;
    slot = 0;
    @property(cc.SpriteFrame)
    unlockSpriteFrame = null;
    setComboKind(e) {
        this.comboIcon.setKind(e);
    }
    setGrade(e) {
        this.gradeLabel.setGrade(e);
    }
    setProp(e, t) {
        const propCfg = _PropConfig.Instance.get(e), lang = LanMgr.Instance.getLangByID(propCfg.desc);
        this.descLabel.string = lang.replace("%{value}", "" + t);
    }
    setStatus(e) {
        if (e) {
            this.lockSprite.spriteFrame = this.lockedSpriteFrame;
            this.node.color = cc.color().fromHEX("#CE7724");
        }
        else {
            this.lockSprite.spriteFrame = this.unlockSpriteFrame;
            this.node.color = cc.color().fromHEX("#714441");
        }
    }
    showEmpty() {
        this.setStatus(false);
        this.descLabel.string = LanMgr.Instance.getLangByID("Empty");
        this.gradeLabel.setEmpty();
        this.comboIcon.setEmpty();
    }
}
