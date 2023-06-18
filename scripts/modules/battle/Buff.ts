import BattleWorld from "./BattleWorld";
import BuffEffect from "./BuffEffect";
import PropAddationEventTarget from "../common/PropAddation";
import { GAME_SKILL_PATH_ } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetPool from "../asset/AssetPool";
export const BUFF_EVENT = {
    Disable: "disable",
    Enable: "enable"
};
const _: any = window["_"];
export default class Buff extends cc.EventTarget {
    private addation: PropAddationEventTarget;
    private buffEffect: BuffEffect;
    private duration: number;
    private runningTime: number;
    public clear(): void {
        if (this.buffEffect) {
            this.buffEffect.clear();
            AssetPool.Instance.put(this.buffEffect);
            this.buffEffect = null;
        }
    }
    public execute(e: number): void {
        this.runningTime += e;
    }
    public initialize(e: string, t: any, o: number, r: any): void {
        this.duration = o;
        this.runningTime = 0;
        if (_.isNil(this.addation)) {
            this.addation = new PropAddationEventTarget();
        }
        this.addation.setProp(e);
        this.addation.value = t;
        this.addation.active();
        if (!_.isEmpty(r)) {
            this.playEffect(r);
        }
        this.emit(BUFF_EVENT.Enable);
    }
    private async playEffect(e: string): Promise<void> {
        const t: string = GAME_SKILL_PATH_ + "/" + e;
        const n: cc.Node = await AssetPool.Instance.createObjAsync(NAMES_BUNDLE.Game, t);
        n.parent = BattleWorld.Instance.getLayer(2);
        const o: BuffEffect = n.getComponent(BuffEffect);
        o.init();
        o.play(() => {
            AssetPool.Instance.put(n);
        });
        this.buffEffect = o;
    }
    public setDisable(): void {
        this.addation.disable();
        this.stopEffect();
        this.emit(BUFF_EVENT.Disable);
    }

    private stopEffect(): void {
        if (this.buffEffect) {
            this.buffEffect.close();
            this.buffEffect = null;
        }
    }
    get isValid(): boolean {
        return this.runningTime < this.duration;
    }
}
