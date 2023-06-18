import { E_UNLOCK_STATE } from "../common/Const";
import LocalStorageTool from "../../ccstudio/utils/LocalStorage";
import ModeBase from "../../ccstudio/data/ModelBase";
const _: any = window["_"];
export default class UnlockData extends ModeBase {
    private _unlockDatas = {};
    public createData(id: number, state: E_UNLOCK_STATE = 0): {
        id: number;
        state: E_UNLOCK_STATE;
    } {
        return {
            id: id,
            state: state,
        };
    }
    public getData(id: number): {
        id: number;
        state: E_UNLOCK_STATE;
    } {
        if (_.isNil(this._unlockDatas[id])) {
            this._unlockDatas[id] = this.createData(id);
        }
        return this._unlockDatas[id];
    }
    public getLockedState(id: number): boolean {
        return this.getData(id).state == E_UNLOCK_STATE.Locked;
    }
    public getUnlockState(id: number): boolean {
        return this.getData(id).state == E_UNLOCK_STATE.Unlocked;
    }
    public getWaitUnlockState(id: number): boolean {
        return this.getData(id).state == E_UNLOCK_STATE.WaitUnlock;
    }
    public load(): void {
        const t = LocalStorageTool.getItemLocal('user-unlock-data');
        this._unlockDatas = {};
        t && _.each(t, (t) => {
            const n = t.id;
            const o = t.state;
            this._unlockDatas[n] = {
                id: n,
                state: o,
            };
        });
    }
    // private static _instance: UnlockData;
    // static get Instance(): UnlockData {
    // 	if (!this._instance) {
    // 		this._instance = new UnlockData();
    // 	}
    // 	return this._instance;
    // }
    public save(): void {
        const e: Record<string, {
            id: string;
            state: E_UNLOCK_STATE;
        }> = {};
        _.each(this._unlockDatas, (t) => {
            e[t.id] = {
                id: t.id,
                state: t.state,
            };
        });
        LocalStorageTool.setItemLocal('user-unlock-data', e);
    }
    public unlock(id: number): void {
        this.getData(id).state = E_UNLOCK_STATE.Unlocked;
        this.save();
    }
    public waitUnlock(id: number): void {
        this.getData(id).state = E_UNLOCK_STATE.WaitUnlock;
        this.save();
    }
}
