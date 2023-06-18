import _LegionWaveConfig from "../../ccstudio/config/_LegionWaveConfig";
const { ccclass, property } = cc._decorator;
@ccclass
export default class LegionProgressViewUI extends cc.Component {
    @property(cc.Sprite)
    bar: cc.Sprite = null;
    @property(cc.Sprite)
    boss: cc.Sprite = null;
    @property([cc.SpriteFrame])
    bossSpriteFrames: cc.SpriteFrame[] = [];
    @property(cc.Node)
    curNode: cc.Node = null;
    @property(cc.Mask)
    mask: cc.Mask = null;
    maxLength: number = 0;
    @property([cc.Label])
    numLabels: cc.Label[] = [];
    init(e: number) {
        if (e == 0)
            e = 1;
        const t = [1, 5, 10, 15];
        const n = Object.keys(_LegionWaveConfig.Instance.cfg).length;
        const o = e / n * this.maxLength;
        this.mask.node.setContentSize(cc.size(o, this.mask.node.getContentSize().height));
        let r = this.mask.node.x + o - 0.55 * this.curNode.width;
        if (e > 10)
            r += 2.5;
        else if ((e !== 1 && e % 5 !== 0) || e == 10)
            r += 1;
        this.curNode.scale = e == 1 || e % 5 == 0 ? 1.1 : 1;
        this.curNode.setPosition(cc.v2(r, this.curNode.y));
        const i = this.curNode.getChildByName("ani").getComponent(sp.Skeleton);
        i.clearTracks();
        i.setAnimation(0, "progress_effect", true);
        for (let s = 0; s < this.numLabels.length; s++) {
            const c = this.numLabels[s];
            const l = t[s];
            if (e > l)
                c.node.color = cc.color().fromHEX("#FFE62A");
            else if (e == l)
                c.node.color = cc.color().fromHEX("#00B4FF");
            else if (e < l)
                c.node.color = cc.color().fromHEX("#9E91A7");
        }
        this.boss.spriteFrame = e == n ? this.bossSpriteFrames[1] : this.bossSpriteFrames[0];
    }
    onLoad() {
        this.maxLength = this.mask.node.width;
    }
}
