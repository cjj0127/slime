import UIPassLevelIcon from "./UIPassLevelIcon";
const { ccclass, property } = cc._decorator;
@ccclass
export default class UIPassLevelItem extends cc.Component {
    delegate: any = null;
    level: number = 0;
    @property(cc.Label)
    levelLabel: cc.Label = null;
    @property(UIPassLevelIcon)
    normalIcon: UIPassLevelIcon = null;
    @property(UIPassLevelIcon)
    premiumIcon: UIPassLevelIcon = null;
    getLevel() {
        return this.level;
    }
    onClickNormall() {
        this.delegate.onClickNormall(this, this.level);
    }
    onClickPremium() {
        this.delegate.onClickPremium(this, this.level);
    }
    onLoad() {
        this.premiumIcon.node.on("click", this.onClickPremium, this);
        this.normalIcon.node.on("click", this.onClickNormall, this);
    }
    setActive(active: boolean) {
        this.premiumIcon.setActive(active);
        this.normalIcon.setActive(active);
    }
    setCount(premiumCount: number, normalCount: number) {
        this.premiumIcon.setCount(premiumCount);
        this.normalIcon.setCount(normalCount);
    }
    setIcon(premiumIcon: any, normalIcon: any) {
        this.premiumIcon.setIcon(premiumIcon);
        this.normalIcon.setIcon(normalIcon);
    }
    setLevel(level: number) {
        this.level = level;
        this.levelLabel.string = `${level}`;
    }
    setLighted(premiumLight: boolean, normalLight: boolean) {
        this.premiumIcon.setLight(premiumLight);
        this.normalIcon.setLight(normalLight);
    }
    setLocked(locked: boolean) {
        this.premiumIcon.setLocked(locked);
    }
    setReceived(premiumReceived: boolean, normalReceived: boolean) {
        this.premiumIcon.setReceived(premiumReceived);
        this.normalIcon.setReceived(normalReceived);
    }
}
