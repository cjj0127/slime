import RelicBase from "./RelicBase";
import RelicData_ from "./RelicData_";
// import { RelicBase } from "RelicBase";
const { ccclass, property } = cc._decorator;
@ccclass
export default class CRelic0005 extends RelicBase {
    public use(): number {
        const e = RelicData_.Instance.getData(this.relicId);
        return this.isActive ? Number(e.effectValue) : 0;
    }
}
