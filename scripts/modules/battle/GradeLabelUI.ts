const { ccclass, property, requireComponent } = cc._decorator;
const Grade = [
    "",
    "F",
    "E",
    "D",
    "C",
    "B",
    "A",
    "S",
    "SS"
];
const ColorMap = [
    "#ffffff",
    "#E3E1CF",
    "#E3E1CF",
    "#B2DF6D",
    "#6D85DF",
    "#DF6DD8",
    "#E68225",
    "#6DDEA2",
    "#DE4040"
];
@ccclass
@requireComponent(cc.Label)
export default class GradeLabelUI extends cc.Component {
    private _label: cc.Label | null = null;
    setEmpty(): void {
        this.gradeLabel.string = "";
    }
    setGrade(index: number): void {
        this.gradeLabel.string = Grade[index];
        this.gradeLabel.node.color = cc.Color.RED.fromHEX(ColorMap[index]);
    }
    get gradeLabel(): cc.Label {
        if (!this._label) {
            this._label = this.node.getComponent(cc.Label)!;
        }
        return this._label;
    }
}
