import ItemUIBase from "../common/ItemUIBase";
import LanMgr from "../common/Language";
import CTreasureData from "./CTreasureData";
import { COLOR_WHITE, COLOR_GRAY } from "../common/Const";
import _TeasureConfig from "../../ccstudio/config/_TeasureConfig";
const { ccclass, property } = cc._decorator;
@ccclass
export default class TeasureCollectionItemRelicInfoUI extends ItemUIBase {
    private _teasureId: number = 0;
    @property(cc.SpriteFrame)
    private defaultSpriteFrame: cc.SpriteFrame = null;
    @property(cc.Label)
    private descLabel: cc.Label = null;
    @property(cc.SpriteFrame)
    private equipedBg: cc.SpriteFrame = null;
    @property(cc.Node)
    private equipedFlag: cc.Node = null;
    @property(cc.Sprite)
    private itemSp: cc.Sprite = null;
    @property(cc.Label)
    private nameLabel: cc.Label = null;
    protected onEnable(): void {
        if (this._teasureId > 0) {
            const e = _TeasureConfig.Instance.get(this._teasureId);
            this.setEquiped(CTreasureData.Instance.getEquip(e.type) == this._teasureId);
            this.setUnlock(CTreasureData.Instance.getData(this._teasureId) != null);
        }
    }
    // private itemSp: cc.Sprite = null;
    // private nameLabel: cc.Label = null;
    // private descLabel: cc.Label = null;
    // private equipedFlag: cc.Node = null;
    // private equipedBg: cc.SpriteFrame = null;
    // private defaultSpriteFrame: cc.SpriteFrame = null;
    // private _teasureId: number = 0;
    public refresh(): void {
        const e = _TeasureConfig.Instance.get(this._teasureId);
        this.nameLabel.string = LanMgr.Instance.getLangByID(e.name);
        const t = CTreasureData.Instance.getData(this._teasureId);
        let n = LanMgr.Instance.getLangByID(e.desc);
        n = n.replace("%{value}", `${t?.effectValue || e.effectValue}`);
        this.setDescStr(n);
        this.setEquiped(CTreasureData.Instance.getEquip(e.type) == this._teasureId);
        this.setIcon(e.icon);
    }
    public setDescStr(e: string): void {
        this.descLabel.string = e;
    }
    public setEquiped(e: boolean): void {
        this.equipedFlag.active = e;
        this.itemSp.spriteFrame = e ? this.equipedBg : this.defaultSpriteFrame;
    }
    public setNameStr(e: string): void {
        this.nameLabel.string = e;
    }
    public setUnlock(e: boolean): void {
        if (e) {
            this.iconSprite.node.color = COLOR_WHITE;
            this.iconSprite.node.parent.color = COLOR_WHITE;
            this.nameLabel.node.color = cc.color().fromHEX("#FFDD8A");
            this.descLabel.node.color = COLOR_WHITE;
        }
        else {
            this.iconSprite.node.color = COLOR_GRAY;
            this.iconSprite.node.parent.color = COLOR_GRAY;
            this.nameLabel.node.color = COLOR_GRAY;
            this.descLabel.node.color = cc.color().fromHEX("#DDDDDD");
        }
    }
    set teasureId(value: number) {
        this._teasureId = value;
        this.refresh();
    }
    get teasureId(): number {
        return this._teasureId;
    }
}
