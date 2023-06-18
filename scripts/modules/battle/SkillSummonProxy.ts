import BattleWorld from "./BattleWorld";
const { ccclass, property } = cc._decorator;
@ccclass
export default class SkillSummonProxy extends cc.Component {
    private _running: boolean = false;
    private currCount: number = 0;
    private damagePercent: string = "0";
    private fireId: number = 0;
    private hurtSound: string = "";
    private interval: number = 0;
    private runningTime: number = 0;
    private totalCount: number = 0;
    appendFire(e: number, t: number, n: number, o: string, r: string) {
        this.fireId = e;
        this.damagePercent = o;
        this.hurtSound = r;
        this.currCount = 0;
        this.totalCount = t;
        this.interval = n / t;
        this._running = true;
    }
    doFire() {
        this.node.position = BattleWorld.Instance.hero.node.position;
        BattleWorld.Instance.createHelper(this.fireId, this.damagePercent).hurtSound = this.hurtSound;
    }
    fixUpdate(e: number) {
        if (this._running) {
            this.runningTime += e;
            if (this.runningTime >= this.interval) {
                this.runningTime -= this.interval;
                this.doFire();
                ++this.currCount >= this.totalCount && (this._running = false);
            }
        }
    }
    stop() {
        this._running = false;
    }
}
