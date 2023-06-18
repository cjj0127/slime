import RelicBase from "./RelicBase";
import RelicData_ from "./RelicData_";
// import RelicBase from "RelicBase";
const { ccclass, property } = cc._decorator;
@ccclass
export default class CRelic0019 extends RelicBase {
    @property
    relicId: number;
    // @property
    // isActive: boolean;
    use(): number {
        const data = RelicData_.Instance.getData(this.relicId);
        return this.isActive ? Number(data.effectValue) : 0;
    }
}
