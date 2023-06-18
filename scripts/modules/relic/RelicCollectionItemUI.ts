import LanMgr from "../common/Language";
import UIPool from "../common/UIPool";
import RelicCollectionItemRelicInfoUI from "./RelicCollectionItemRelicInfoUI";
import { _RELIC_TYPE_NAME, IMAGE_ICON_PATH_ } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
import _RelicConfig from "../../ccstudio/config/_RelicConfig";
const { ccclass, property } = cc._decorator;
@ccclass
export default class RelicCollectionItemUI extends UIPool {
    private _typeId: any = 0;
    @property(cc.Button)
    btnOpen: cc.Button = null;
    private closeHeight: number = 0;
    @property(cc.Layout)
    content: cc.Layout = null;
    @property(cc.Sprite)
    iconSprite: cc.Sprite = null;
    itemInfos: Array<RelicCollectionItemRelicInfoUI> = [];
    private openHeight: number = 0;
    openList: boolean = true;
    rootLayout: cc.Layout = null;
    @property(cc.Label)
    typeName: cc.Label = null;
    createItems() {
        const e = _RelicConfig.Instance.getTypeIds(this.typeId);
        for (let t = 0; t < 4; t++) {
            const n = this.get();
            const o = n.getComponent(RelicCollectionItemRelicInfoUI);
            this.itemInfos.push(o);
            const r = e[t];
            o.relicId = r;
            n.parent = this.content.node;
        }
    }
    onClickOpen() {
        this.openList = !this.openList;
        this.btnOpen.target.angle = this.openList ? 180 : 0;
        this.content.node.active = this.openList;
        this.rootLayout.enabled = true;
        this.rootLayout.updateLayout();
        this.rootLayout.enabled = false;
        this.node.height = this.openList ? this.openHeight : this.closeHeight;
    }
    onLoad() {
        this.rootLayout = this.node.getComponent(cc.Layout);
        this.closeHeight = this.node.height;
        this.createItems();
        this.content.enabled = true;
        this.content.updateLayout();
        this.content.enabled = false;
        this.rootLayout.enabled = true;
        this.rootLayout.updateLayout();
        this.rootLayout.enabled = false;
        this.openHeight = this.node.height;
        this.btnOpen.target.angle = this.openList ? 180 : 0;
        this.btnOpen.node.on("click", this.onClickOpen, this);
    }
    setIcon(e: string) {
        const t = IMAGE_ICON_PATH_ + "/" + e;
        this.iconSprite.spriteFrame = AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, t);
    }
    setNameStr(e: string) {
        this.typeName.string = e;
    }
    start() {
        this.setIcon("relic_type_" + this.typeId);
        this.setNameStr(LanMgr.Instance.getLangByID(_RELIC_TYPE_NAME[this.typeId] || ""));
    }
    get typeId() {
        return this._typeId;
    }
    set typeId(value: any) {
        this._typeId = value;
    }
}
