import LanMgr from "../common/Language";
import { IMAGE_ICON_PATH_ } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
import Model from "../../ccstudio/data/Model";
import RedDotParam from "../common/RedDotParam";
import { E_MINE_RESEARCH_STATUS } from "../../ccstudio/data/MineResearchModel";
import _MineResearchConfig from "../../ccstudio/config/_MineResearchConfig";
// n.default = m
const _: any = window["_"];
const { ccclass, property } = cc._decorator;
@ccclass
export default class MineResearchItemUI extends RedDotParam {
    @property(cc.SpriteFrame)
    activateSpriteFrame: cc.SpriteFrame = null;
    @property(cc.Sprite)
    iconSprite: cc.Sprite = null;
    @property([cc.Node])
    lineLines: cc.Node[] = [];
    @property(cc.Node)
    linkLine: cc.Node = null;
    @property(cc.SpriteFrame)
    maxSpriteFrame: cc.SpriteFrame = null;
    @property()
    mineResearchId: number = 0;
    @property(cc.Label)
    progressText: cc.Label = null;
    @property(cc.Sprite)
    statusSprite: cc.Sprite = null;
    creatLineLines(e: Array<any>) {
        _.each(e, e => {
            const n = e.position.sub(this.node.position);
            const o = n.mag();
            const r = cc.instantiate(this.linkLine);
            r.parent = this.node;
            r.setSiblingIndex(0);
            r.width = o;
            r.position = n.mul(.5);
            r.angle = cc.misc.radiansToDegrees(Math.atan2(n.y, n.x));
            this.lineLines.push(r);
        });
    }
    // progressText: cc.Label;
    // iconSprite: cc.Sprite;
    // statusSprite: cc.Sprite;
    // activateSpriteFrame: cc.SpriteFrame;
    // maxSpriteFrame: cc.SpriteFrame;
    // linkLine: cc.Node;
    // mineResearchId: number;
    // lineLines: Array<cc.Node>;
    getRedDotParam(): number {
        return this.mineResearchId;
    }
    refresh() {
        const e = this.mineResearchId;
        const t = _MineResearchConfig.Instance.get(e);
        const n = Model.mineResearch.getData(e);
        this.setProgress(n.level, t.maxLevel);
        this.setStatus(n.status == E_MINE_RESEARCH_STATUS.EClose, n.level == t.maxLevel);
    }
    refreshLinkLineStatus() {
        const t = _MineResearchConfig.Instance.get(this.mineResearchId).pre;
        _.each(t, (t, n) => {
            const o = Model.mineResearch.getData(t);
            const r = this.lineLines[n];
            if (o && o.status == E_MINE_RESEARCH_STATUS.EMaxLevel) {
                r.color = cc.Color.WHITE;
            }
            else {
                r.color = cc.Color.GRAY;
            }
        });
    }
    async setIcon(e: string) {
        const t = IMAGE_ICON_PATH_ + "/" + e;
        this.iconSprite.spriteFrame = await AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, t);
    }
    setProgress(e: number, t: number) {
        this.progressText.string = e == t ? LanMgr.Instance.getLangByID("Max") : e + "/" + t;
    }
    setStatus(e: boolean, t: boolean) {
        if (e) {
            this.statusSprite.spriteFrame = this.activateSpriteFrame;
            this.statusSprite.setState(cc.Sprite.State.GRAY);
            this.iconSprite.setState(cc.Sprite.State.GRAY);
            return;
        }
        this.iconSprite.setState(cc.Sprite.State.NORMAL);
        this.statusSprite.setState(cc.Sprite.State.NORMAL);
        this.statusSprite.spriteFrame = t ? this.maxSpriteFrame : this.activateSpriteFrame;
    }
}
