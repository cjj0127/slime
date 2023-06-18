import { GameConst } from "../common/Const";
import _BlessLevelConfig from "../../ccstudio/config/_BlessLevelConfig";
import Config from "../../ccstudio/configs/Config";
import LocalStorageTool from "../../ccstudio/utils/LocalStorage";
export default class BlessData {
    private _blessDatas: {
        [type: string]: {
            type: string;
            level: number;
            exp: number;
            remainTime: number;
        };
    } = {};
    private static _instance: BlessData = null;
    public addExp(type: string, exp: number): boolean {
        let levelUp = false;
        let data = this._blessDatas[type];
        if (data) {
            data.remainTime = 60 * GameConst.BLESS_DURATION;
            data.exp += exp;
            let maxLevel = Config.blessLevel.maxLevel(Number(type));
            let levelData = Config.blessLevel.take(Number(type), data.level);
            if (data.exp >= levelData.exp && data.level < maxLevel) {
                data.exp = 0;
                data.level++;
                levelUp = true;
            }
            this.save();
        }
        return levelUp;
    }
    public createData(type: string, level: number = 1, exp: number = 0, remainTime: number = 0): {
        type: string;
        level: number;
        exp: number;
        remainTime: number;
    } {
        return {
            type: type,
            level: level,
            exp: exp,
            remainTime: remainTime
        };
    }
    public getData(type: any): {
        type: string;
        level: number;
        exp: number;
        remainTime: number;
    } {
        if (this._blessDatas[type] == null) {
            this._blessDatas[type] = this.createData(type);
        }
        return this._blessDatas[type];
    }
    public getRemainTime(type: any): number {
        if (!this._blessDatas[type])
            return 0;
        return 1000 * this._blessDatas[type].remainTime;
    }
    public load(): void {
        let self = this;
        let loadDataStr = LocalStorageTool.getItemLocal("cc_user-bless-data");
        let loadData = JSON.parse(loadDataStr);
        self._blessDatas = {};
        if (loadData) {
            for (let type in loadData) {
                let data = loadData[type];
                self._blessDatas[type] = {
                    type: data.type,
                    level: data.level,
                    exp: data.exp,
                    remainTime: data.remainTime
                };
            }
        }
    }
    public save(): void {
        let saveData: {
            [type: string]: {
                type: string;
                level: number;
                exp: number;
                remainTime: number;
            };
        } = {};
        for (let type in this._blessDatas) {
            saveData[type] = {
                type: this._blessDatas[type].type,
                level: this._blessDatas[type].level,
                exp: this._blessDatas[type].exp,
                remainTime: this._blessDatas[type].remainTime
            };
        }
        LocalStorageTool.setItemLocal("cc_user-bless-data", JSON.stringify(saveData));
    }
    public setLevel() { }
    public static get Instance(): BlessData {
        if (!this._instance) {
            this._instance = new BlessData();
        }
        return this._instance;
    }
}
