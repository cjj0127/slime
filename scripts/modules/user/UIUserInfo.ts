import HeroData from "../hero/HeroData";
import { GlobalEventName } from "../common/Events";
// import HeroData from "HeroData";
const { ccclass, property } = cc._decorator;
@ccclass
export default class UIUserInfo extends cc.Component {
    @property(cc.Label)
    heroLevel: cc.Label = null;
    onDisable() {
        cc.director.targetOff(this);
    }
    onEnable() {
        this.setHeroLevel(HeroData.Instance.totalLevel);
        cc.director.on(GlobalEventName.HeroTotalLevelChange, this.onLevelChange, this);
    }
    onLevelChange() {
        this.setHeroLevel(HeroData.Instance.totalLevel);
    }
    setHeroLevel(e: number) {
        this.heroLevel.string = `${e}`;
    }
}
