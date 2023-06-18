import GuideUnlock from "../guide/GuideUnlock";
import ItemUIBase from "../common/ItemUIBase";
import { MapUIPrefabs } from "../common/Const";
import UiModel from "../../ccstudio/data/UiModel";
import Model from "../../ccstudio/data/Model";
import _SysUnlockConfig from "../../ccstudio/config/_SysUnlockConfig";
import UnlockCtrl from "../unlock/UnlockCtrl";
// n.default = v
const { ccclass, property } = cc._decorator;
@ccclass
export default class SlotUI extends ItemUIBase {
    @property(cc.Button)
    btnRemove: cc.Button = null;
    @property(cc.Node)
    checkNode: cc.Node = null;
    @property(cc.Node)
    emptyNode: cc.Node = null;
    @property(cc.Node)
    lockNode: cc.Node = null;
    slotIndex: number = -1;
    @property([cc.SpriteFrame])
    spriteDiFrame: cc.SpriteFrame[] = [];
    hideEmpty() {
        this.emptyNode.active = false;
    }
    hideLock() {
        this.lockNode.active = false;
    }
    hideSelect() {
        this.checkNode.active = false;
        const e = this.checkNode.getChildByName("finger");
        if (e)
            e.getComponent(cc.Animation).stop();
        const t = this.node.getChildByName("ying");
        if (t)
            t.getComponent(cc.Sprite).spriteFrame =
                this.spriteDiFrame[1];
    }
    onClickRemove() {
        this.node.emit("click-remove", this);
    }
    onLoad() {
        if (this.btnRemove)
            this.btnRemove.node.on("click", this.onClickRemove, this);
    }
    async playUnlockAni(e: Function = null) {
        const t = await Model.ui.openViewAsync(MapUIPrefabs.GuideUnlock);
        await t.getComponent(GuideUnlock).showFocusTo(this.node);
        this.showEmpty();
        const n = this.lockNode.children[this.lockNode.childrenCount - 1];
        n.stopAllActions();
        n.position = cc.Vec3.ZERO;
        cc.tween(this.node)
            .repeat(4, cc.tween(this.node)
            .by(0.03, { position: cc.v3(10, 0) })
            .by(0.03, { position: cc.v3(-20, 0) })
            .by(0.03, { position: cc.v3(10, 0) }))
            .call(() => {
            cc.tween(n)
                .parallel(cc.tween().by(0.6, { y: -600 }, { easing: cc.easing.backIn }), cc.tween().by(0.6, { x: 80 }, { easing: cc.easing.sineIn }))
                .call(() => {
                this.showEmpty();
                this.hideLock();
                e && e();
            })
                .start();
            Model.ui.closeView(t);
        })
            .start();
    }
    setLevel(lv) {
    }
    showEmpty() {
        this.setIcon("");
        this.iconSprite.spriteFrame = null;
        this.qualitySprite.node.opacity = 0;
        this.emptyNode.active = true;
        if (this.btnRemove)
            this.btnRemove.node.active = false;
    }
    showItem(e: string, t: number, name: string) {
        this.setIcon(e);
        this.setQualityValue(t);
        this.qualitySprite.node.opacity = 255;
        if (this.btnRemove)
            this.btnRemove.node.active = true;
    }
    showLock(e: number) {
        this.lockNode.active = true;
        if (this.btnRemove)
            this.btnRemove.node.active = false;
        if (!this.lockNode.getComponent(cc.Button))
            this.lockNode.addComponent(cc.Button);
        this.lockNode.getComponent(cc.Button).node.on("click", () => {
            const t = _SysUnlockConfig.Instance.getUnlockDataBySysType(e);
            UnlockCtrl.Instance.showUnclockTips(t);
        }, this);
    }
    showSelect() {
        if (!this.lockNode.active) {
            this.checkNode.active = true;
            const e = this.checkNode.getChildByName("finger");
            if (e)
                e.getComponent(cc.Animation).play();
            const t = this.node.getChildByName("ying");
            if (t)
                t.getComponent(cc.Sprite).spriteFrame =
                    this.spriteDiFrame[0];
            if (this.btnRemove)
                this.btnRemove.node.active = false;
        }
    }
}
