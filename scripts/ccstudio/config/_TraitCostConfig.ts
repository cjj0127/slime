import _BaseParse from "./_BaseParse";
const { ccclass, property } = cc._decorator;
@ccclass
export default class TraitCost extends _BaseParse {
    private static _instance: TraitCost = null;
    jsonName: string = "traitCost";
    public get(e: any): any {
        return this.cfg[e];
    }
    public static get Instance(): TraitCost {
        if (TraitCost._instance == null) {
            TraitCost._instance = new TraitCost();
        }
        return TraitCost._instance;
    }
}
