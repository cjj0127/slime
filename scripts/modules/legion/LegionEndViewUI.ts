import GuideMgr from "../guide/GuideMgr";
import { SpecialGuideEnum } from "../guide/GuideEnums";
import LanMgr from "../common/Language";
import { MapUIPrefabs } from "../common/Const";
import _LegionWaveConfig from "../../ccstudio/config/_LegionWaveConfig";
import RingModel from "../../ccstudio/data/RingModel";
import UiModel from "../../ccstudio/data/UiModel";
import Model from "../../ccstudio/data/Model";
import _PropConfig from "../../ccstudio/config/_PropConfig";
import LegionProgressViewUI from "./LegionProgressViewUI";
import LegionPropDescItemUI from "./LegionPropDescItemUI";
import LegionRingUI from "./LegionRingUI";
import ViewAnimCtrl from "../../ccstudio/display/ViewAnimCtrl";
const { ccclass, property } = cc._decorator;
const _: any = window["_"];
@ccclass
export default class LegionEndViewUI extends cc.Component {
    @property(cc.Button)
    closeBtn: cc.Button = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(LegionProgressViewUI)
    proCmp: LegionProgressViewUI = null;
    @property(cc.Prefab)
    proDetailItem: cc.Prefab = null;
    @property([cc.SpriteFrame])
    resultSpriteFrames: cc.SpriteFrame[] = [];
    @property(LegionRingUI)
    ringCmp: LegionRingUI = null;
    ringId = 0;
    wave = 0;
    @property(cc.Sprite)
    winSprite: cc.Sprite = null;
    isWin() {
        return this.wave >= _LegionWaveConfig.Instance.getWavesNum();
    }
    onClose() {
        this.getComponent(ViewAnimCtrl).onClose();
        this.isWin() && Model.ui.openViewAsync(MapUIPrefabs.LegionRushRewardView);
    }
    onDisable() {
        if (this.isWin()) {
            GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchLegionRushReward2);
        }
        else {
            GuideMgr.instance.completeSpecialGuide(SpecialGuideEnum.TouchLegionRushReward);
            GuideMgr.instance.completeSpecialGuide(SpecialGuideEnum.TouchLegionRushReward2);
            GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchHeroButton5);
        }
    }
    onEnable() {
        this.refresh();
        GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchLegionRushReward);
    }
    onLoad() {
        this.closeBtn.node.on("click", this.onClose, this);
    }
    refresh() {
        this.proCmp.init(this.wave);
        this.ringCmp.init(this.ringId);
        this.ringCmp.showBreath();
        this.content.removeAllChildren();
        const t = Model.ring.getRingData(this.ringId);
        _.each(t.propData, t => {
            const n = cc.instantiate(this.proDetailItem);
            n.parent = this.content;
            const o = _PropConfig.Instance.get(t.propId), r = LanMgr.Instance.getLangByID(o.desc).replace("%{value}", "" + t.value);
            n.getComponent(LegionPropDescItemUI).init(!1, r);
            n.getComponent(LegionPropDescItemUI).setColor("#EBBA52");
        });
        this.winSprite.spriteFrame = this.isWin() ? this.resultSpriteFrames[0] : this.resultSpriteFrames[1];
    }
    reuse(e: {
        wave: number;
        ringId: number;
    }) {
        this.wave = e.wave;
        this.ringId = e.ringId;
    }
}
