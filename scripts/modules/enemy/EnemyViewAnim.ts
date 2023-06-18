import EntityViewBase from "../battle/EntityViewBase";
// import EntityViewBase from 'EntityViewBase';
const { ccclass, property } = cc._decorator;
@ccclass
export default class EnemyViewAnim extends EntityViewBase {
    public pause(): void { }
    public playAttack(): void { }
    public playDead(): number {
        return 0.1;
    }
    public playHit(): void { }
    public playIdle(): void { }
    public playMove(): void { }
    public resume(): void { }
    public updateHp(): void { }
}
