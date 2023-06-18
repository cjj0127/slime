import ItemUIBase from "../common/ItemUIBase";
import LanMgr from "../common/Language";
import { GlobalEventName } from "../common/Events";
import { MapUIPrefabs, COLOR_WHITE, COLOR_GRAY } from "../common/Const";
import RelicModel from "../../ccstudio/data/RelicModel";
import UiModel from "../../ccstudio/data/UiModel";
import Model from "../../ccstudio/data/Model";
import _RelicConfig from "../../ccstudio/config/_RelicConfig";
import RelicData_ from "./RelicData_";
import MsgHint from "../common/MsgHint";
// import { ItemUIBase } from 'ItemUIBase';
const { ccclass, property } = cc._decorator;
@ccclass
export default class RelicTypeItemUI extends ItemUIBase {
    @property(cc.SpriteFrame)
    defaultSpriteFrame: cc.SpriteFrame = null;
    @property(cc.Label)
    levelLabel: cc.Label = null;
    @property(cc.Node)
    suoNode: cc.Node = null;
    @property
    typeId: number = 0;
    onClickTypeItem() {
        Model.relic.isUnlockType(this.typeId) ? Model.ui.openViewAsync(MapUIPrefabs.RelicDetailView, { data: this.typeId }) : MsgHint.tip(LanMgr.Instance.getLangByID("You do not own this type of relic."));
    }
    onDisable() {
        cc.director.targetOff(this);
    }
    onEnable() {
        cc.director.on(GlobalEventName.RelicLvup, this.onRelicLvup, this);
    }
    // private defaultSpriteFrame: cc.SpriteFrame;
    // @property(cc.Node)
    // suoNode: cc.Node = null;
    // @property(cc.Label)
    // levelLabel: cc.Label = null;
    onLoad() {
        this.defaultSpriteFrame = this.iconSprite.spriteFrame;
        this.node.on("click", this.onClickTypeItem, this);
    }
    onRelicLvup(e: any) {
        const t = RelicData_.Instance.getEquip(this.typeId);
        if (t == e) {
            const n = RelicData_.Instance.getData(t);
            this.setLevel(n.level);
        }
    }
    refresh() {
        const e = Model.relic.isUnlockType(this.typeId);
        if (this.setStatus(e), e) {
            const t = RelicData_.Instance.getEquip(this.typeId);
            if (t > 0) {
                const n = RelicData_.Instance.getData(t), o = _RelicConfig.Instance.get(t);
                this.iconSprite.node.opacity = 255;
                this.iconSprite.node.width = 80;
                this.iconSprite.node.height = 80;
                this.iconSprite.node.y = 6;
                this.setLevel(n.level);
                this.setIcon(o.icon);
            }
            else {
                this.iconSprite.node.opacity = 160;
                this.iconSprite.node.width = 46;
                this.iconSprite.node.height = 46;
                this.iconSprite.node.y = 0;
                this.iconSprite.spriteFrame = this.defaultSpriteFrame;
                this.levelLabel.string = "";
            }
        }
        else {
            this.iconSprite.node.width = 46;
            this.iconSprite.node.height = 46;
            this.iconSprite.node.y = 0;
            this.iconSprite.node.opacity = 255;
            this.levelLabel.string = "";
        }
    }
    setLevel(e: number) {
        this.levelLabel.string = "LV" + e;
    }
    setStatus(e: boolean) {
        if (e) {
            this.node.color = COLOR_WHITE;
            this.suoNode.active = false;
            this.iconSprite.node.color = COLOR_WHITE;
        }
        else {
            this.iconSprite.spriteFrame = this.defaultSpriteFrame;
            this.node.color = COLOR_GRAY;
            this.iconSprite.node.color = COLOR_GRAY;
            this.suoNode.active = true;
        }
    }
}
