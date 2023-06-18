import GuideUnlock from "../guide/GuideUnlock";
import { E_SKILL_STATE, IMAGE_ICON_PATH_, MapUIPrefabs } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
import UiModel from "../../ccstudio/data/UiModel";
import Model from "../../ccstudio/data/Model";
import _SysUnlockConfig from "../../ccstudio/config/_SysUnlockConfig";
import UnlockCtrl from "../unlock/UnlockCtrl";
const { ccclass, property } = cc._decorator;
@ccclass
export default class SkillBattleSlotUI extends cc.Component {
    @property(cc.Sprite)
    cdSprite = null;
    @property(cc.SpriteFrame)
    durationSp: cc.SpriteFrame = null;
    @property(cc.Sprite)
    durationSprite = null;
    @property(cc.Node)
    emptyNode = null;
    @property(cc.Sprite)
    iconSprite = null;
    @property(cc.Node)
    lockNode = null;
    @property(cc.SpriteFrame)
    normalSp = null;
    skillId = -1;
    slotIndex = 0;
    clear() {
        this.cdSprite.fillRange = 0;
        this.durationSprite.fillRange = 0;
        this.setStatus(E_SKILL_STATE.Idle);
    }
    hideLock() {
        this.lockNode.active = false;
    }
    onEnable() {
        this.durationSprite.fillRange = 0;
        this.cdSprite.fillRange = 0;
    }
    playRelease() { }
    async playUnlockAni(e = null) {
        const t = await Model.ui.openViewAsync(MapUIPrefabs.GuideUnlock);
        await t.getComponent(GuideUnlock).showFocusTo(this.node);
        this.showEmpty();
        const n = this.lockNode.children[this.lockNode.childrenCount - 1];
        n.stopAllActions();
        n.position = cc.Vec3.ZERO;
        cc.tween(this.node)
            .repeat(4, cc.tween(this.node).by(0.03, {
            position: cc.v3(10, 0),
        }).by(0.03, {
            position: cc.v3(-20, 0),
        }).by(0.03, {
            position: cc.v3(10, 0),
        }))
            .call(function () {
            cc.tween(n)
                .parallel(cc.tween().by(0.6, { y: -600 }, { easing: cc.easing.backIn }), cc.tween().by(0.6, { x: 80 }, { easing: cc.easing.sineIn }))
                .call(function () {
                this.showEmpty();
                this.hideLock();
                e && e();
            }, this)
                .start();
            Model.ui.closeView(t);
        }, this)
            .start();
    }
    run() {
        this.cdSprite.fillRange = 0;
        this.durationSprite.fillRange = 1;
        this.playRelease();
    }
    setCdProgress(e: number, t: number) {
        this.cdSprite.fillRange = e / t;
    }
    setDurtionProgress(e: number, t: number) {
        this.durationSprite.fillRange = e / t;
    }
    async setIcon(e: string) {
        const t = IMAGE_ICON_PATH_ + "/" + e;
        this.iconSprite.trim = false;
        this.iconSprite.sizeMode = cc.Sprite.SizeMode.RAW;
        this.iconSprite.spriteFrame = await AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, t);
        this.iconSprite.node.scale = 60 / this.iconSprite.node.width;
    }
    setNameStr(name: string) { }
    setStatus(e: E_SKILL_STATE) {
        const t = this.node.getComponent(cc.Button);
        switch (e) {
            case E_SKILL_STATE.Idle:
                this.iconSprite.setState(cc.Sprite.State.NORMAL);
                t.interactable = true;
                t.target.getComponent(cc.Sprite).spriteFrame = this.normalSp;
                this.cdSprite.fillRange = 0;
                break;
            case E_SKILL_STATE.Duration:
                this.iconSprite.setState(cc.Sprite.State.NORMAL);
                t.target.getComponent(cc.Sprite).spriteFrame = this.durationSp;
                this.cdSprite.fillRange = 0;
                break;
            case E_SKILL_STATE.Cd:
                t.interactable = false;
                this.iconSprite.setState(cc.Sprite.State.GRAY);
                t.target.getComponent(cc.Sprite).spriteFrame = this.normalSp;
                this.durationSprite.fillRange = 0;
                break;
        }
    }
    showEmpty() {
        this.setNameStr("");
        this.iconSprite.spriteFrame = null;
        this.emptyNode.active = true;
        this.clear();
    }
    showItem(e: string, t: string) {
        this.setNameStr(t);
        this.setIcon(e);
        this.emptyNode.active = false;
    }
    showLock(e: number) {
        this.lockNode.active = true;
        if (!this.lockNode.getComponent(cc.Button)) {
            this.lockNode.addComponent(cc.Button);
        }
        this.lockNode.getComponent(cc.Button).node.on("click", function () {
            const t = _SysUnlockConfig.Instance.getUnlockDataBySysType(e);
            UnlockCtrl.Instance.showUnclockTips(t);
        }, this);
    }
}
