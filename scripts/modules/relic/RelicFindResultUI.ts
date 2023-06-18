import GuideMgr from "../guide/GuideMgr";
import { SpecialGuideEnum } from "../guide/GuideEnums";
import LanMgr from "../common/Language";
import { IMAGE_ICON_PATH_ } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
import _RelicConfig from "../../ccstudio/config/_RelicConfig";
// import { GuideMgr } from "./GuideMgr";
const { ccclass, property } = cc._decorator;
@ccclass
export default class RelicFindResultUI extends cc.Component {
    _touchCloseEnable: boolean = false;
    @property(sp.Skeleton)
    anim: sp.Skeleton = null;
    @property(cc.Node)
    closeTip: cc.Node = null;
    @property(cc.Sprite)
    icon: cc.Sprite = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;
    relicId: number = 0;
    onDisable(): void {
        GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchRelicIcon);
    }
    onEnable(): void {
        this.icon.node.opacity = 0;
        const e = _RelicConfig.Instance.get(this.relicId);
        const t = IMAGE_ICON_PATH_ + "/" + e.icon;
        this.icon.spriteFrame = AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, t);
        this.nameLabel.string = "";
        this.anim.setAnimation(0, "open", false);
        this.anim.setCompleteListener(this.playComplete.bind(this));
        const n = this.anim.findAnimation("open");
        this.unscheduleAllCallbacks();
        this.scheduleOnce(this.showIcon, 0.55 * n.duration);
        this.node.stopAllActions();
        this.touchCloseEnable = false;
    }
    onLoad(): void {
        const background = this.node.getChildByName("background");
        background.on(cc.Node.EventType.TOUCH_END, this.onTouchBackgroundEnd, this);
        //@ts-ignore
        background._touchListener.swallowTouches = false;
    }
    onTouchBackgroundEnd(): void {
        if (this.touchCloseEnable) {
            this.node.emit("Close");
        }
    }
    playComplete(): void {
        this.closeTip.stopAllActions();
        cc.tween(this.node)
            .delay(0.6)
            .call(() => {
            cc.tween(this.closeTip)
                .to(0.12, {
                opacity: 155,
                scale: 1
            })
                .call(() => {
                this.touchCloseEnable = true;
                GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchAnyWhere);
            })
                .start();
        })
            .start();
    }
    // private relicId: number;
    // private _touchCloseEnable: boolean;
    // public closeTip: cc.Node;
    // public nameLabel: cc.Label;
    // public icon: cc.Sprite;
    // public anim: sp.Skeleton;
    public reuse(e: number): void {
        this.relicId = e;
    }
    showIcon(): void {
        this.icon.node.opacity = 255;
        const e = _RelicConfig.Instance.get(this.relicId);
        this.nameLabel.string = LanMgr.Instance.getLangByID(e.name);
    }
    get touchCloseEnable(): boolean {
        return this._touchCloseEnable;
    }
    set touchCloseEnable(e: boolean) {
        this._touchCloseEnable = e;
        this.closeTip.active = e == true;
    }
}
