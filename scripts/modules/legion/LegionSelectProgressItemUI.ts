import LanMgr from "../common/Language";
import LegionAddationInfoUI from "./LegionAddationInfoUI";
import { E_LegionHeroRingAddType, IMAGE_ICON_PATH_ } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
import _LegionHeroConfig from "../../ccstudio/config/_LegionHeroConfig";
const { ccclass, property } = cc._decorator;
@ccclass
export default class LegionSelectProgressItemUI extends cc.Component {
    @property([cc.Node])
    itemNodes: cc.Node[] = [];
    @property(cc.Label)
    progressLabel: cc.Label = null;
    onLoad() {
        this.itemNodes.forEach((t) => {
            t.getChildByName("lvNode").on(cc.Node.EventType.TOUCH_END, this.onTouchEndHandler, this);
        });
    }
    onTouchEndHandler(e: cc.Event.EventTouch) {
        const t = e.target as cc.Node;
        const n = t.getChildByName("addLv").getComponent("cc.Label") as cc.Label;
        const o = parseInt(n.string);
        const r = _LegionHeroConfig.Instance.get(o);
        const i = r.ringAdd;
        const c = r.ringAddNum;
        let l = "";
        switch (i) {
            case E_LegionHeroRingAddType.AddLevel:
                l = LanMgr.Instance.getLangByID("LegionRush_Tips_5").replace("%{value}", "" + c);
                break;
            case E_LegionHeroRingAddType.AddQuality:
                l = LanMgr.Instance.getLangByID("LegionRush_Tips_1");
        }
        LegionAddationInfoUI.addPopItem(l, t);
    }
    showLvNodes() {
        const e = [1, 2, 4];
        let t = 0;
        for (let n = 0; n < this.itemNodes.length; n++) {
            const o = this.itemNodes[n];
            const r = _LegionHeroConfig.Instance.get(n + 1);
            const i = o.getChildByName("lvNode");
            if (i.active = r.ringAdd > 0, r.ringAdd > 0) {
                i.getChildByName("addLv").getComponent("cc.Label").string = r.id.toString();
                const u = i.getChildByName("quality").getComponent("cc.Sprite");
                const p = `item_quality_${e[t]}`;
                u.spriteFrame = AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, IMAGE_ICON_PATH_ + "/" + p);
                t++;
            }
        }
    }
    showProgress(e: number) {
        for (let t = 0; t < this.itemNodes.length; t++) {
            this.itemNodes[t].getChildByName("fx-orange").active = t + 1 <= e;
        }
        this.progressLabel.string = `${e}/${this.itemNodes.length}`,
            this.showLvNodes();
    }
}
