import GradeLabelUI from "../battle/GradeLabelUI";
const { ccclass, property } = cc._decorator;
@ccclass
export default class TraitRuleListItemUI extends cc.Component {
    @property(cc.Label)
    descLabel: cc.Label = null;
    @property(GradeLabelUI)
    gradeLabel: GradeLabelUI = null;
    setDescStr(e) {
        this.descLabel.string = e;
    }
    setGrade(e) {
        this.gradeLabel.setGrade(e);
    }
}
