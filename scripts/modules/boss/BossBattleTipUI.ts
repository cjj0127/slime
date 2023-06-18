import { GAME_SPINE_PATH_ } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
import _EnemyConfig from "../../ccstudio/config/_EnemyConfig";
import _HeroConfig from "../../ccstudio/config/_HeroConfig";
const { ccclass, property } = cc._decorator;
@ccclass
export default class BossBattleTipUI extends cc.Component {
    bossId = 0;
    heroId = 0;
    @property(sp.Skeleton)
    leftSp: sp.Skeleton = null;
    leftX = 0;
    @property(sp.Skeleton)
    rightSp: sp.Skeleton = null;
    rightX = 0;
    @property(cc.Node)
    vsNode: cc.Node = null;
    private animInit(): void {
        this.leftSp.node.opacity = 0;
        this.leftSp.node.x = this.leftX + 600;
        this.rightSp.node.opacity = 0;
        this.rightSp.node.x = this.rightX + 600;
        this.leftSp.node.stopAllActions();
        this.rightSp.node.stopAllActions();
        this.vsNode.stopAllActions();
        this.vsNode.opacity = 0;
    }
    complete(): void {
        this.node.emit("remove", this);
    }
    private async createEntity(): Promise<void> {
        const e = _HeroConfig.Instance.get(this.heroId);
        const t = GAME_SPINE_PATH_ + "/mushroom";
        const n = await AssetManager.Instance.loadSkeleton(NAMES_BUNDLE.Game, t, e.uiAnim);
        this.leftSp.skeletonData = n;
        this.leftSp.setAnimation(0, "standby", true);
        const o = _EnemyConfig.Instance.get(this.bossId);
        const r = GAME_SPINE_PATH_ + "/monster";
        const m = await AssetManager.Instance.loadSkeleton(NAMES_BUNDLE.Game, r, o.uiAnim || "monster1");
        this.rightSp.node.scaleX = -o.multi;
        this.rightSp.node.scaleY = o.multi;
        this.rightSp.skeletonData = m;
        this.rightSp.setAnimation(0, "standby", true);
    }
    public async onEnable(): Promise<void> {
        this.animInit();
        await this.createEntity();
        this.playAnim();
    }
    public onLoad(): void {
        this.leftX = this.leftSp.node.x;
        this.rightX = this.rightSp.node.x;
    }
    private playAnim(): void {
        cc.tween(this.leftSp.node)
            .set({ opacity: 0 })
            .to(.3, { x: 0 }, { easing: cc.easing.sineOut })
            .delay(.1 + .2)
            .set({ opacity: 255 })
            .to(.1, { x: this.leftX })
            .delay(.8)
            .to(.15, { x: this.leftX - 450 })
            .start();
        cc.tween(this.rightSp.node)
            .set({ opacity: 255 })
            .to(.3, { x: 0 }, { easing: cc.easing.sineOut })
            .delay(.1 + .2)
            .to(.1, { x: this.rightX })
            .delay(.8)
            .to(.15, { x: this.rightX + 450 })
            .start();
        cc.tween(this.vsNode)
            .delay(.3)
            .set({ scale: 5 })
            .parallel(cc.tween().to(.12, { opacity: 255 }), cc.tween().to(.4, { scale: 1 }, { easing: cc.easing.bounceOut }))
            .delay(1)
            .call(this.complete, this)
            .start();
    }
    public reuse(e: {
        heroId: number;
        bossId: number;
    }): void {
        this.heroId = e.heroId;
        this.bossId = e.bossId;
    }
}
