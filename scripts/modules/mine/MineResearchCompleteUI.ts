import { IMAGE_ICON_PATH_ } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
import LanMgr from "../common/Language";
import { eVIEW_ANIM_EVENT } from "../../ccstudio/display/ViewAnimCtrl";
import MineResearchModel from "../../ccstudio/data/MineResearchModel";
import _MineResearchConfig from "../../ccstudio/config/_MineResearchConfig";
import Model from "../../ccstudio/data/Model";
import _PropConfig from "../../ccstudio/config/_PropConfig";
// n.default = v
const { ccclass, property } = cc._decorator;
@ccclass
export default class MineResearchCompleteUI extends cc.Component {
    @property(cc.Button)
    btnOk: cc.Button = null;
    @property(cc.Label)
    descLabel: cc.Label = null;
    @property(cc.Sprite)
    icon: cc.Sprite = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;
    researchId: number = 0;
    @property(cc.Node)
    skinNode: cc.Node = null;
    onClickOk() {
        Model.mineResearch.complete();
        this.node.emit(eVIEW_ANIM_EVENT.Close);
    }
    onEnable() {
        this.playSkinAnim();
        const e = _MineResearchConfig.Instance.get(this.researchId), t = Model.mineResearch.getData(this.researchId).level, n = e.value[t];
        this.setDescStr(e.propType, n);
        this.setNameStr(e.name);
        this.setIcon(e.icon);
    }
    onLoad() {
        this.btnOk.node.on("click", this.onClickOk, this);
    }
    playSkinAnim() {
        this.skinNode.stopAllActions();
        cc.tween(this.skinNode).by(5, { angle: 360 }).repeatForever().start();
    }
    reuse(e: number) {
        this.researchId = e;
    }
    setDescStr(e: number, t: number) {
        this.descLabel.string = _PropConfig.Instance.getDesc(e, t);
    }
    setIcon(e: string) {
        const t = IMAGE_ICON_PATH_ + "/" + e;
        this.icon.spriteFrame = AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, t);
    }
    setNameStr(e: number) {
        this.nameLabel.string = LanMgr.Instance.getLangByID(e);
    }
}
