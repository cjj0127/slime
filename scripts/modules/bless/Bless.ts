import PropAddationEventTarget from "../common/PropAddation";
// import PropAddation from "PropAddation";
const { ccclass, property } = cc._decorator;
@ccclass
export default class Bless {
    private addation: PropAddationEventTarget = null;
    public get(): PropAddationEventTarget {
        return this.addation;
    }
    public getAddtion(): number {
        return Number(this.addation.value);
    }
    public getProp(): string {
        return this.addation.prop;
    }
    public initialize(prop: string, value: any): void {
        if (!this.addation) {
            this.addation = new PropAddationEventTarget();
        }
        this.addation.setProp(prop);
        this.addation.value = value.toString();
        this.addation.active();
    }
    public setDisable(): void {
        this.addation.disable();
    }
}
