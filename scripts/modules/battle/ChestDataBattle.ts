import LocalStorageTool from "../../ccstudio/utils/LocalStorage";
import MyTools from "../../ccstudio/utils/MyTools";
export default class ChestDataBattle {
    private _battleChestData: any = null;
    private static _instance: ChestDataBattle = null;
    public createData(e: number, t: number, n = 0): any {
        return {
            type: e,
            state: t,
            timePoint: n
        };
    }
    public getData(): any {
        return this._battleChestData;
    }
    public load(): void {
        const e = LocalStorageTool.getItemLocal('user-ChestBattle-data');
        if (e) {
            this._battleChestData = e;
            this._battleChestData.timePoint = MyTools.GetTimeNow();
            this._battleChestData.state = 0;
        }
        else {
            this._battleChestData = this.createData(0, 0, MyTools.GetTimeNow());
        }
        this.save();
    }
    public save(): void {
        LocalStorageTool.setItemLocal('user-ChestBattle-data', this._battleChestData);
    }
    static get Instance(): ChestDataBattle {
        if (!this._instance) {
            this._instance = new ChestDataBattle();
        }
        return this._instance;
    }
}
