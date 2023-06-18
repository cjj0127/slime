import _RouletteConfig from "../../ccstudio/config/_RouletteConfig";
import AssetInfoUI from "../asset/AssetInfoUI";
import IconUI from "../common/IconUI";
const { ccclass, property } = cc._decorator;
@ccclass
export default class UIRouletteItem extends cc.Component {
    private _rewardId: number = -1;
    @property(cc.Label)
    countLabel: cc.Label = null;
    @property(cc.Sprite)
    iconSprite: cc.Sprite = null;
    public getIconSprite(): cc.Sprite {
        return this.iconSprite;
    }
    onLoad(): void {
        this.iconSprite = this.getComponentInChildren(cc.Sprite);
        this.countLabel = this.getComponentInChildren(cc.Label);
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchIcon, this);
    }
    private onTouchIcon(): void {
        const data = _RouletteConfig.Instance.get(this.rewardId);
        AssetInfoUI.addPopItem(data.asset, this.iconSprite.node);
    }
    public setReward(count: number, icon: string): void {
        this.countLabel.string = `x${count}`;
        const it = this.iconSprite.getComponent(IconUI) || this.iconSprite.addComponent(IconUI);
        it.icon = icon;
    }
    public get rewardId(): number {
        return this._rewardId;
    }
    public set rewardId(value: number) {
        this._rewardId = value;
    }
}
