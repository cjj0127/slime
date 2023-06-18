import { GlobalEventName } from "../common/Events";
import { EntityBase, EEntityEvent } from "../battle/EntityBase";
import AiBase from "../battle/AiBase";
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("Hero/Hero")
export default class Hero extends EntityBase {
    @property
    hpRecovery: string = "0";
    @property
    hpRecoveryRage: string = "0";
    _testEditorMenu() { }
    getHurtEffect(): string {
        return "";
    }
    onActive(): void { }
    onDead_(): void { }
    onHpChanged(oldValue: number, newValue: number): void {
        cc.director.emit(GlobalEventName.HeroHpChange, this.hp, this.maxHp, newValue);
    }
    onRemove(): void { }
    reborn(): void {
        this.hp = this.maxHp;
        this.run();
        const ai = this.getComponent(AiBase);
        ai.target = null;
        ai.startup();
        this.emitEntityEvent(EEntityEvent.Reborn);
    }
}
