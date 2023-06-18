import DwarvenKingBattle from "./DwarvenKingBattle";
import { GlobalEventName } from "../common/Events";
import _DwarvenKingConfig from "../../ccstudio/config/_DwarvenKingConfig";
import BossLevelTitleComp from "./BossLevelTitleComp";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
const { ccclass, property } = cc._decorator;
const h: any = window["moment"];
@ccclass
export default class DwarvenKingTitleBattle extends BossLevelTitleComp {
    @property(cc.Label)
    private cdTimeLabel: cc.Label = null;
    @property(cc.Label)
    private damageLabel: cc.Label = null;
    @property(cc.ProgressBar)
    private hurtProgress: cc.ProgressBar = null;
    @property(cc.Label)
    private levelLabel: cc.Label = null;
    private totalHurt: string = "0";
    init(): void {
        this.totalHurt = "0";
        this.hurtProgress.progress = 1;
        this.levelLabel.string = "1";
        this.damageLabel.string = "";
    }
    onBossHurt(e: any): void {
        this.totalHurt = NumberPlus.add(this.totalHurt, e);
        this.refreshProgress();
        this.refreshTitle();
    }
    onDisable(): void {
        cc.director.targetOff(this);
        this.unschedule(this.timeUpdate);
    }
    onEnable(): void {
        this.timeUpdate();
        this.init();
        cc.director.on(GlobalEventName.DwarvenKingBossHurt, this.onBossHurt, this);
        this.schedule(this.timeUpdate, 1, cc.macro.REPEAT_FOREVER);
    }
    onLoad(): void { }
    refreshProgress(): void {
        let e: string = "0";
        const t: number = _DwarvenKingConfig.Instance.getLevel(this.totalHurt);
        const n: any = _DwarvenKingConfig.Instance.get(t);
        if (n !== null) {
            e = n.hp;
        }
        const o: any = _DwarvenKingConfig.Instance.get(t + 1);
        if (o !== null) {
            const r: number = NumberPlus.sub(this.totalHurt, e) / NumberPlus.sub(o.hp, e);
            this.hurtProgress.progress = 1 - r;
        }
    }
    refreshTitle(): void {
        this.damageLabel.string = NumberPlus.format(this.totalHurt);
        const e: number = _DwarvenKingConfig.Instance.getLevel(this.totalHurt);
        this.levelLabel.string = e.toString();
        if (e > DwarvenKingBattle.Instance.curLevel) {
            DwarvenKingBattle.Instance.curLevel = e;
            cc.director.emit(GlobalEventName.AtkChange);
        }
    }
    timeUpdate(): void {
        this.cdTimeLabel.string = h.utc(1000 * DwarvenKingBattle.Instance.battleDuration).format("mm:ss");
    }
    updateDuration(): void { }
}
