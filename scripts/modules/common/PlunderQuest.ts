import _BaseParse from "../../ccstudio/config/_BaseParse";
const { ccclass, property } = cc._decorator;
@ccclass
export default class PlunderQuest extends _BaseParse {
    private static _instance: PlunderQuest = null;
    public jsonName: string = 'plunderQuest';
    get(e: any) {
        return this.cfg[e];
    }
    getAll() {
        return this.cfg;
    }
    getMaxId() {
        let maxId = 0;
        for (let key in this.cfg) {
            if (this.cfg[key].id > maxId) {
                maxId = this.cfg[key].id;
            }
        }
        return maxId;
    }
    loaded() { }
    public static get Instance() {
        return this._instance || (this._instance = new PlunderQuest());
    }
}
