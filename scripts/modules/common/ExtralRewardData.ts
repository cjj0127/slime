import LocalStorageTool from "../../ccstudio/utils/LocalStorage";
// import { Singleton } from "Singleton";
const _ = window['_'];
export default class ExtralRewardData {
    private _extralRewardData: {
        [key: string]: {
            id: string;
            status: number;
        };
    } = {};
    private static _instance: ExtralRewardData;
    createData(e: string, t: number = 0): {
        id: string;
        status: number;
    } {
        return {
            id: e,
            status: t
        };
    }
    getData(e: any): {
        id: string;
        status: number;
    } {
        if (_.isNil(this._extralRewardData[e])) {
            this._extralRewardData[e] = this.createData(e);
        }
        return this._extralRewardData[e];
    }
    load() {
        const t = LocalStorageTool.getItemLocal("cc_user-extral-reward-data");
        this._extralRewardData = {};
        if (t) {
            _.each(t, (t) => {
                const n = t.id;
                const o = t.status;
                this._extralRewardData[n] = {
                    id: n,
                    status: o
                };
            });
        }
    }
    save() {
        const e = {};
        _.each(this._extralRewardData, (t) => {
            e[t.id] = {
                id: t.id,
                status: t.status
            };
        });
        LocalStorageTool.setItemLocal("cc_user-extral-reward-data", e);
    }
    setStatus(e: any, t: number) {
        this.getData(e).status = t;
        this.save();
    }
    static get Instance(): ExtralRewardData {
        if (!ExtralRewardData._instance) {
            ExtralRewardData._instance = new ExtralRewardData();
        }
        return ExtralRewardData._instance;
    }
}
