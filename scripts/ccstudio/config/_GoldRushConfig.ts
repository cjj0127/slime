import _BaseParse from "./_BaseParse";

import NumberPlus from "../utils/NumberPlus";
// import _BaseParse from '_BaseParse';
const { ccclass, property } = cc._decorator;
const _: any = window["_"];
@ccclass
export default class _GoldRushConfig extends _BaseParse {
    private static _instance: _GoldRushConfig;
    jsonName: string = "goldRush";
    private maxLevel: number = 0;
    public get(cfgId: number): any {
        return this.cfg[cfgId];
    }
    public getMax(): number {
        return this.maxLevel;
    }
    loaded() {
        super.loaded();
        _.each(this.cfg, (cfgData: any, cfgId: number) => {
            cfgData.id = cfgId;
            cfgData.reward = NumberPlus.decode(cfgData.reward);
            cfgData.multiAttack = NumberPlus.decode(cfgData.multiAttack);
            cfgData.multiHP = NumberPlus.decode(cfgData.multiHP);
            this.maxLevel = Math.max(cfgData.id, this.maxLevel);
        });
    }
    public static get Instance(): _GoldRushConfig {
        if (!_GoldRushConfig._instance) {
            _GoldRushConfig._instance = new _GoldRushConfig();
        }
        return _GoldRushConfig._instance;
    }
}
