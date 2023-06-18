import { LevelConfigAuto, LevelObj } from "./ConfigAuto";
import NumberPlus from "../utils/NumberPlus";
const _ = window['_'];
export default class LevelConfig extends LevelConfigAuto {
    maxLevel = 0;
    get(id): LevelObj {
        id = Number(id);
        let t = this.map.get(id);
        t.obtain = NumberPlus.decode(t.obtain);
        t.multiHP = NumberPlus.decode(t.multiHP);
        t.multiAttack = NumberPlus.decode(t.multiAttack);
        t.multiGold = NumberPlus.decode(t.multiGold);
        return t;
    }
    getIdsByLevel(id: number) {
        let cfg = this.get(id);
        let ids = [];
        for (let i = 1; i <= 5; i++) {
            let wave = cfg['wave' + i];
            for (const sub of wave) {
                ids.push(sub.id);
            }
        }
        return ids;
    }
    getMax() {
        return this.maxLevel;
    }
    getWave(e, t: number) {
        return this.get(e)['wave' + t];
    }
    onLoad(): void {
        // _.each(this.cfg, (t: any) => {
        //     t.obtain = NumberPlus.decode(t.obtain);
        //     t.multiHP = NumberPlus.decode(t.multiHP);
        //     t.multiAttack = NumberPlus.decode(t.multiAttack);
        //     t.multiGold = NumberPlus.decode(t.multiGold);
        // })
        this.maxLevel = this.values.length;
    }
}
