import ItemUIBase from "../common/ItemUIBase";
import LanMgr from "../common/Language";
const { ccclass, property } = cc._decorator;
@ccclass
export default class CandidateItemUI extends ItemUIBase {
    @property(cc.Label)
    levelLabel: cc.Label = null;
    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;
    @property(cc.Label)
    progressText: cc.Label = null;
    setLevel(e: number): void {
        this.levelLabel.string = "LV" + e;
    }
    setProgress(e: number, t: number, n: boolean = false): void {
        if (n) {
            this.progressText.string = LanMgr.Instance.getLangByID('Max');
            this.progressBar.progress = 1;
        }
        else {
            this.progressText.string = `${e}/${t}`;
            this.progressBar.progress = e / t;
        }
    }
}
