import ItemUIBase from "../common/ItemUIBase";
import LanMgr from "../common/Language";
import RelicData_ from "./RelicData_";
import { COLOR_WHITE, COLOR_GRAY } from "../common/Const";
import _RelicConfig from "../../ccstudio/config/_RelicConfig";
// import ItemUIBase from "ItemUIBase";
const { ccclass, property } = cc._decorator;
@ccclass
export default class RelicCollectionItemRelicInfoUI extends ItemUIBase {
    private _relicId: number = 0;
    @property(cc.SpriteFrame)
    defaultSpriteFrame: cc.SpriteFrame = null;
    @property(cc.Label)
    descLabel: cc.Label = null;
    @property(cc.SpriteFrame)
    equipedBg: cc.SpriteFrame = null;
    @property(cc.Node)
    equipedFlg: cc.Node = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;
    onEnable(): void {
        if (this.relicId > 0) {
            const e = _RelicConfig.Instance.get(this.relicId);
            this.setEquiped(RelicData_.Instance.getEquip(e.type) == this.relicId);
            this.setUnlock(RelicData_.Instance.getData(this.relicId) != null);
        }
    }
    // @d(cc.Label)
    // nameLabel: cc.Label;
    // @d(cc.Label)
    // descLabel: cc.Label;
    // @d(cc.Node)
    // equipedFlg: cc.Node;
    // @d(cc.SpriteFrame)
    // equipedBg: cc.SpriteFrame;
    // @d(cc.SpriteFrame)
    // defaultSpriteFrame: cc.SpriteFrame;
    refresh(): void {
        const e = _RelicConfig.Instance.get(this.relicId);
        this.setNameStr(LanMgr.Instance.getLangByID(e.name));
        const t = RelicData_.Instance.getData(this.relicId);
        let n = LanMgr.Instance.getLangByID(e.desc);
        n = n.replace("%{value}", `${(t?.effectValue || e.effectValue)}`);
        this.setDescStr(n);
        this.setEquiped(RelicData_.Instance.getEquip(e.type) == this.relicId);
        this.setIcon(e.icon);
    }
    setDescStr(e: string): void {
        this.descLabel.string = e;
    }
    setEquiped(e: boolean): void {
        this.equipedFlg.active = e;
        this.node.getComponent(cc.Sprite).spriteFrame = e ? this.equipedBg : this.defaultSpriteFrame;
    }
    setNameStr(e: string): void {
        this.nameLabel.string = e;
    }
    setUnlock(e: boolean): void {
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
    get relicId(): number {
        return this._relicId;
    }
    set relicId(value: number) {
        this._relicId = value;
        this.refresh();
    }
}
