import { BlessLevelConfigAuto } from "./ConfigAuto";
export default class BlessLevelConfig extends BlessLevelConfigAuto {
    maxLevel(type: number) {
        let all = this.values.filter((element) => element.type == type);
        return all.length;
    }
    take(type, lv: number) {
        return this.values.find((element) => element.type == type && element.idx == lv);
    }
}
