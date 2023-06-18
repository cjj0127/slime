import { IMAGE_ICON_PATH_, E_LegionUpType } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
import LanMgr from "../common/Language";
import _LegionRandConfig from "../../ccstudio/config/_LegionRandConfig";
import _PropConfig from "../../ccstudio/config/_PropConfig";
const { ccclass, property } = cc._decorator;
@ccclass
export default class LegionPropItemUI extends cc.Component {
    @property(cc.Sprite)
    bg: cc.Sprite = null;
    @property([cc.SpriteFrame])
    bgFrames: cc.SpriteFrame[] = [];
    @property(cc.Label)
    desc: cc.Label = null;
    @property(cc.Sprite)
    icon: cc.Sprite = null;
    @property(cc.Label)
    ringName: cc.Label = null;
    @property(cc.Label)
    typeLabel: cc.Label = null;
    init(e: any) {
        if (e.id > 0) {
            const t = _LegionRandConfig.Instance.get(e.id);
            const n = _PropConfig.Instance.get(t.propId);
            if (this.ringName.string = LanMgr.Instance.getLangByID(t.name), this.icon.spriteFrame = AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, IMAGE_ICON_PATH_ + "/" + t.icon), t.propId == 0) {
                this.desc.string = LanMgr.Instance.getLangByID("AddRingQuality");
            }
            else {
                let o = LanMgr.Instance.getLangByID(n.desc);
                if (e.upType == E_LegionUpType.Ring) {
                    o += LanMgr.Instance.getLangByID("LegionRush_Tips_4");
                }
                this.desc.string = o.replace("%{value}", "" + e.upNumValue);
            }
            if (e.upType == E_LegionUpType.Mushroom) {
                this.typeLabel.string = LanMgr.Instance.getLangByID("LegionRush_Tips_2");
                this.typeLabel.node.color = cc.color().fromHEX("#01B4FF");
            }
            else {
                this.typeLabel.string = LanMgr.Instance.getLangByID("LegionRush_Tips_3");
                this.typeLabel.node.color = cc.color().fromHEX("#FFCA59");
            }
            this.bg.spriteFrame = e.isPowerEnemy ? this.bgFrames[1] : this.bgFrames[0];
        }
    }
    onCheck() {
        const e = this.getComponent(cc.Toggle);
        if (!e.isChecked) {
            e.check();
        }
    }
}
