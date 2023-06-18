import LanMgr from "../common/Language";
import TraitKindIconUI from "./TraitKindIconUI";
const { ccclass, property } = cc._decorator;
@ccclass
export default class TraitKindLevelItemUI extends cc.Component {
    @property(TraitKindIconUI)
    icon: TraitKindIconUI = null;
    @property(cc.Label)
    levelLabel: cc.Label = null;
    setKind(kind: number) {
        this.icon.setKind(kind);
    }
    setLevel(level: number) {
        this.levelLabel.string = `${LanMgr.Instance.getLangByID("LV")}${level}`;
    }
}
