import { MapUIPrefabs, IMAGE_ICON_PATH_ } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
import UiModel from "../../ccstudio/data/UiModel";
import Model from "../../ccstudio/data/Model";
import _PropConfig from "../../ccstudio/config/_PropConfig";
const { ccclass, property } = cc._decorator;
@ccclass
export default class HeroLevelPropIconUI extends cc.Component {
    @property(cc.Sprite)
    iconSprite: cc.Sprite = null;
    @property(cc.Label)
    lvLabel: cc.Label = null;
    private oriIconWidth: number;
    // @property(cc.Sprite)
    // iconSprite: cc.Sprite = null;
    // @property(cc.Label)
    // lvLabel: cc.Label = null;
    propId: number = -1;
    propValue: any = "";
    unlockLv: number = 0;
    unlockStatus: boolean = false;
    onClick() {
        Model.ui.openViewAsync(MapUIPrefabs.HeroLevelPropPop, {
            data: {
                level: this.unlockLv,
                prop: this.propId,
                value: this.propValue,
                unlocked: this.unlockStatus,
                target: this.node
            }
        });
    }
    onLoad() {
        this.oriIconWidth = this.iconSprite.node.width;
        this.node.on("click", this.onClick, this);
    }
    refresh() {
        const e = _PropConfig.Instance.get(this.propId);
        this.setIcon(e.icon);
    }
    setIcon(e: string) {
        const t = `${IMAGE_ICON_PATH_}/${e}`;
        this.iconSprite.spriteFrame = AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, t);
        this.iconSprite.node.scale = this.oriIconWidth / this.iconSprite.node.width;
    }
    setProp(e: any, t: number, n: number) {
        if (this.propId != e) {
            this.propId = e;
            this.refresh();
        }
        this.propValue = t;
        this.unlockLv = n;
        this.setUnlockLv(n);
    }
    setStatus(e: boolean) {
        this.unlockStatus = e;
        this.lvLabel.node.active = !e;
        const n = e ? cc.Sprite.State.NORMAL : cc.Sprite.State.GRAY;
        this.iconSprite.setState(n);
        const t = this.getComponent(cc.Button)?.target.getComponent(cc.Sprite);
        t?.setState(n);
    }
    setUnlockLv(e: number) {
        this.lvLabel.string = `LV${e}`;
    }
}
