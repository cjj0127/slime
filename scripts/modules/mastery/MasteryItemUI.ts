import LanMgr from "../common/Language";
import { IMAGE_ICON_PATH_ } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
import _MasteryConfig from "../../ccstudio/config/_MasteryConfig";
import MasteryModel, { E_MASTERY_STATUS } from "../../ccstudio/data/MasteryModel";
import Model from "../../ccstudio/data/Model";
// import * as MasteryModel from "MasteryModel";
const { ccclass, property } = cc._decorator;
@ccclass
export default class MasteryItemUI extends cc.Component {
    _masteryId = -1;
    @property(cc.Sprite)
    bg: cc.Sprite = null;
    @property(cc.Sprite)
    icon = null;
    @property(cc.Label)
    levelLabel = null;
    lineLines = [];
    @property(cc.Node)
    linkLine = null;
    @property(cc.SpriteFrame)
    maxSpriteFrame = null;
    @property(cc.SpriteFrame)
    normalSpriteFrame = null;
    creatLineLines(e: cc.Node[]): void {
        e.forEach((e) => {
            const n = e.position.sub(this.node.position);
            const o = n.mag();
            const r = cc.instantiate(this.linkLine);
            r.parent = this.node;
            r.setSiblingIndex(0);
            r.width = o;
            r.position = n.mul(0.5);
            r.angle = cc.misc.radiansToDegrees(Math.atan2(n.y, n.x));
            this.lineLines.push(r);
        });
    }
    refreshLinkLineStatus(): void {
        _MasteryConfig.Instance.get(this.masteryId).pre.forEach((t, n) => {
            const o = Model.mastery.getData(t);
            const r = this.lineLines[n];
            if (o && o.status == E_MASTERY_STATUS.EMax) {
                r.color = cc.Color.WHITE;
            }
            else {
                r.color = cc.Color.GRAY;
            }
        });
    }
    refreshStatus(): void {
        const e = _MasteryConfig.Instance.get(this.masteryId);
        const t = Model.mastery.getData(this.masteryId);
        const n = e.maxLevel;
        const o = (t?.level) ?? 0;
        const r = (t?.status) ?? E_MASTERY_STATUS.EClose;
        switch (this.setLevel(o, n), r) {
            case E_MASTERY_STATUS.EClose:
                this.bg.setState(cc.Sprite.State.GRAY);
                this.icon.setState(cc.Sprite.State.GRAY);
                break;
            case E_MASTERY_STATUS.EOpen:
                this.bg.setState(cc.Sprite.State.NORMAL);
                this.icon.setState(cc.Sprite.State.NORMAL);
                this.bg.spriteFrame = this.normalSpriteFrame;
                break;
            case E_MASTERY_STATUS.EMax:
                this.bg.setState(cc.Sprite.State.NORMAL);
                this.icon.setState(cc.Sprite.State.NORMAL);
                this.bg.spriteFrame = this.maxSpriteFrame;
                break;
        }
    }
    setIcon(e: string): void {
        const t = `${IMAGE_ICON_PATH_}/${e}`;
        this.icon.spriteFrame = AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, t);
    }
    setLevel(e: number, t: number): void {
        this.levelLabel.string = t <= 0 ? `${e}` : e == t ? LanMgr.Instance.getLangByID('MaxLevel') : `${e}/${t}`;
    }
    get masteryId() {
        return this._masteryId;
    }
    set masteryId(e) {
        this._masteryId = e;
    }
}
