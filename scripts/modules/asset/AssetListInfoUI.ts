import { NAMES_BUNDLE } from "./AssetRes";
import LanMgr from "../common/Language";
import { GlobalEventName } from "../common/Events";
import { IMAGE_ICON_PATH_, MapUIPrefabs } from "../common/Const";
import _AssetConfig from "../../ccstudio/config/_AssetConfig";
import AssetManager from "./AssetManager";
import UiModel from "../../ccstudio/data/UiModel";
import Model from "../../ccstudio/data/Model";
import RewardItemUI from "../battle/RewardItemUI";
// n.default = m
const { ccclass, property } = cc._decorator;
@ccclass
export default class AssetListInfoUI extends cc.Component {
    @property(cc.Sprite)
    bg: cc.Sprite = null;
    @property(cc.Layout)
    content: cc.Layout = null;
    @property(cc.Sprite)
    icon: cc.Sprite = null;
    @property(cc.Prefab)
    itemPrefeb: cc.Prefab = null;
    @property(cc.Node)
    listNode: cc.Node = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Node)
    viewNode: cc.Node = null;
    onDisable() {
        cc.director.targetOff(this);
    }
    onEnable() {
        cc.director.on(GlobalEventName.TouchScreen, this.onTouchScreen, this);
    }
    onTouchScreen() {
        this.node.emit("remove", this);
    }
    setHeight(e: number) {
        this.bg.node.height = this.content.node.childrenCount * (e + this.content.spacingY) + (this.listNode.height - this.viewNode.height);
    }
    async setIcon(e: string) {
        const t = this.icon;
        t.spriteFrame = await AssetManager.Instance.loadSpriteFrame(NAMES_BUNDLE.Game, `${IMAGE_ICON_PATH_}/${e}`) as cc.SpriteFrame;
    }
    setNameStr(e: string) {
        this.nameLabel.string = LanMgr.Instance.getLangByID(e);
    }
    static async showPops(e: any[], t: any[], o: cc.Node) {
        const r = o.convertToWorldSpaceAR(cc.Vec3.ZERO), i = cc.view.getVisibleSize(), a = await Model.ui.openViewAsync(MapUIPrefabs.AssetListInfo), l = a.getComponent(AssetListInfoUI), p = l.content.node;
        if (r.x + .5 * a.width >= i.width) {
            r.x = i.width - .5 * a.width;
        }
        if (r.x - .5 * a.width < 0) {
            r.x = .5 * a.width;
        }
        p.removeAllChildren();
        let f = 0;
        for (let d = 0; d < e.length; d++) {
            const y = e[d];
            if (_AssetConfig.Instance.get(y)) {
                const v = t[d], _ = cc.instantiate(l.itemPrefeb);
                _.parent = p;
                f = _.height;
                _.getComponent(RewardItemUI).setItemInfo(y, v);
            }
        }
        l.setHeight(f);
        r.y -= .5 * o.height;
        const m = a.parent.convertToNodeSpaceAR(r);
        a.position = m;
    }
}
