import _AssetConfig from "../config/_AssetConfig";
import _GearConfig from "../config/_GearConfig";
import GuideMgr from "../../modules/guide/GuideMgr";
import LocalStorageTool from "../utils/LocalStorage";
import _MineConfig from "../config/_MineConfig";
import _MineRewardConfig, { E_MINE_REWARD_TYPE } from "../config/_MineRewardConfig";
import _MineRewardGearConfig from "../config/_MineRewardGearConfig";
import ModeBase from "./ModelBase";
import Model from "./Model";
import MyTools from "../utils/MyTools";
import UserData, { AssetGetType } from "../../modules/user/UserData";
import { SpecialGuideEnum } from "../../modules/guide/GuideEnums";
import { GlobalEventName } from "../../modules/common/Events";
import { E_UnlockSysType, ENUM_PROP_TYPE, GameConst, E_ASSET_TYPE, E_QUEST_ACTIVE_ID } from "../../modules/common/Const";
import RewardPopUI from "../../modules/battle/RewardPopUI";
export enum E_MINE_TILE_TYPE {
    eEmpty = 0,
    eRock,
    eSoil,
    eUnique1,
    eUnique2,
    eUnique3,
    eUnique4
}
export enum E_MINE_SP_TYPE_TILE {
    eNone = 0,
    eBomb,
    eBox,
    eBronze,
    eCoin,
    eDrill,
    eExp,
    eGem,
    eGold,
    ePickax,
    eSilver,
    eCube,
    eCubeBronze,
    eCubeGold,
    eCubeSilver
}
export enum E_MINE_TILE_STATUS {
    EClose = 0,
    EOpen
}
export const MineDigCount = {
    [E_MINE_TILE_TYPE.eSoil]: 1,
    [E_MINE_TILE_TYPE.eRock]: 2,
};
export enum E_MINE_TOOL_TYPE {
    TOOL_Pickax = 0,
    TOOL_Drill,
    TOOL_Bomb
}
export const MINE_TILE_SIZE = cc.size(105, 105);
export const MINE_MAX_ROW_COUNT = 13;
export const MINE_TOP_PREROW_COUNT = 1;
export const MINE_BOTTOM_PREROW_COUNT = 5;
export const MINE_MAX_COL_COUNT = 6;
const _: any = window['_'];
const moment: any = window['moment'];
export default class MineModel extends ModeBase {
    private _cfgMeter: number;
    private _cfgMeterIdx: number;
    private _cfgRowIdx: number;
    private _digDeep: number | null;
    private _pickaxAddStartMoment: any;
    public digTotalCnt: number;
    private tileInfos: any[] = [];

    public addRow(e: Array<any>): boolean {
        if (e.length != MINE_MAX_COL_COUNT) {
            cc.error("添加行数据数量异常", e.length);
            return false;
        }
        this.tileInfos.push(e);
        return true;
    }

    public async addRowToBottom(): Promise<any> {
        const e = await this.calcNextRowCfgData();
        const t = [];
        const n = this;
        _.each(e, function (e, o) {
            t[o] = n.decodeInfo(e, E_MINE_TILE_STATUS.EClose);
        });
        this.addRow(t);
        return t;
    }

    public bomb(e: number, t: number): boolean {
        const o = this.getInfo(e, t);
        if (o.tile != E_MINE_TILE_TYPE.eEmpty && (o.tile == E_MINE_TILE_TYPE.eRock || o.tile == E_MINE_TILE_TYPE.eSoil)) {
            o.received = true;
            o.tile = E_MINE_TILE_TYPE.eEmpty;
            this.digTotalCnt += 1;
            this.saveDigCnt();
            cc.director.emit(GlobalEventName.QuestCommit, E_QUEST_ACTIVE_ID.MineDig, this.digTotalCnt);
            return true;
        }
        return false;
    }

    public async calcNextRowCfgData(): Promise<any> {
        const n = this;
        const e = await _MineConfig.Instance.getWith(this.digDeep);
        if (e.meter != this.cfgMeter) {
            this.cfgMeter = e.meter;
            this.cfgMeterIdx = 0;
            this.cfgRowIdx = 0;
        }
        let t = await _MineConfig.Instance.get(this.cfgMeter);
        if (_.isNil(t)) {
            t = await _MineConfig.Instance.get(this.cfgMeter);
        }
        const o = await _MineConfig.Instance.getMineCfgData(this.cfgMeter, this.cfgMeterIdx);
        if (this.cfgRowIdx + 1 >= o.length) {
            if (this.cfgMeterIdx + 1 >= t.cfgs.length) {
                this.cfgMeterIdx = 0;
            }
            else {
                this.cfgMeterIdx++;
            }
            this.cfgRowIdx = 0;
        }
        else {
            this.cfgRowIdx++;
        }
        t = await _MineConfig.Instance.getMineCfgData(this.cfgMeter, this.cfgMeterIdx);
        return t[this.cfgRowIdx];
    }

    checkGuideComplete(e: any): void {
        if (e !== E_ASSET_TYPE.MineCube) {
            if (e == E_ASSET_TYPE.SlimeExp) {
                if (!GuideMgr.instance.isCompleteSpecialGuide(SpecialGuideEnum.TouchHeroButton3) &&
                    Model.hero.lvupEnableHeros().length > 0) {
                    GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchHeroButton3);
                }
            }
        }
        else {
            if (!GuideMgr.instance.isCompleteSpecialGuide(SpecialGuideEnum.TouchSearchButton) &&
                Model.mineResearch.getLvupEnableDatas().length > 0) {
                GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchSearchButton);
            }
        }
    }

    public async createTileDatas() {
        const e = 1;
        this.tileInfos = new Array(e);
        for (let r = 0; r < 5; r++) {
            const tileInfosArray = new Array(MINE_MAX_COL_COUNT);
            _.each(tileInfosArray, function (t, n) {
                tileInfosArray[n] = {
                    tile: E_MINE_TILE_TYPE.eEmpty,
                    sp: E_MINE_SP_TYPE_TILE.eNone,
                    unique: -1,
                    digCnt: 0,
                    status: E_MINE_TILE_STATUS.EClose,
                    received: false
                };
            });
            this.tileInfos.push(tileInfosArray);
        }
        const i = _MineConfig.Instance.getWith(0);
        this.cfgMeter = i.meter;
        this.cfgMeterIdx = 0;
        this.cfgRowIdx = -1;
        while (this.tileInfos.length < MINE_MAX_ROW_COUNT + e) {
            await this.addRowToBottom();
        }
        const a = [];
        this.seachAndOpen(this.digDeep - 1, 0, a);
        for (let s = 0; s < MINE_MAX_COL_COUNT; s++) {
            this.seachNextRow(this.digDeep - 1, s, a);
        }
    }

    public decodeInfo(e: Array<any>, t: E_MINE_TILE_STATUS): any {
        return {
            sp: e[0],
            tile: e[1],
            unique: e[2],
            digCnt: 0,
            status: t,
            received: false
        };
    }

    public dig(e: number, t: number, o: number = 1): boolean {
        const r = this.getInfo(e, t);
        if (r.tile != E_MINE_TILE_TYPE.eEmpty && !r.received) {
            if (r.status == E_MINE_TILE_STATUS.EOpen && (r.tile == E_MINE_TILE_TYPE.eRock || r.tile == E_MINE_TILE_TYPE.eSoil)) {
                r.digCnt += o;
                if (r.digCnt >= MineDigCount[r.tile]) {
                    r.received = true;
                    r.tile = E_MINE_TILE_TYPE.eEmpty;
                    this.digTotalCnt += 1;
                    cc.director.emit(GlobalEventName.QuestBatchCommit, E_QUEST_ACTIVE_ID.MineDig, 1, this.digTotalCnt);
                }
                this.saveDigCnt();
                return true;
            }
            else if (r.sp > E_MINE_SP_TYPE_TILE.eNone) {
                r.received = true;
                return true;
            }
        }
        return false;
    }

    fixedUpdate(dt): void {
        if (this.pickaxCount < this.pickaxMaxCount && moment(MyTools.GetTimeNow()).diff(this.pickaxAddStartMoment, "s") >= this.pickaxCd) {
            UserData.Instance.addItem(E_ASSET_TYPE.MinePickax, 1);
            this.pickaxAddStartMoment = this.pickaxAddStartMoment.add(this.pickaxCd, "s");
        }
    }

    getCubeAddationCount(e: any): number {
        const t = Model.user.calcPropAddation(ENUM_PROP_TYPE.CubeAdd);
        return Math.floor((e * parseInt(t)) / 100);
    }
    public getInfo(e: number, t: any): any {
        const n = this.tileInfos[e];
        return n ? n[t] : null;
    }

    public getRom(e: number): Array<any> {
        return this.tileInfos[e];
    }

    public initLoadData() {
        var t = LocalStorageTool.getItemLocal("cc_start-pickax-add-moment");
        const n = moment(MyTools.GetTimeNow()).startOf("s");
        if (_.isNil(t)) {
            this.pickaxAddStartMoment = n;
        }
        else {
            t = moment(t).startOf("s");
            var o = n.diff(t, "s");
            var r = _.floor(o / this.pickaxCd);
            const i = this.pickaxCount;
            if (i + r < this.pickaxMaxCount) {
                UserData.Instance.addItem(E_ASSET_TYPE.MinePickax, r);
                o -= r * this.pickaxCd;
                this.pickaxAddStartMoment = n.subtract(o, "s");
            }
            else {
                if (i < this.pickaxMaxCount) {
                    r = this.pickaxMaxCount - i;
                    UserData.Instance.setItem(E_ASSET_TYPE.MinePickax, this.pickaxMaxCount);
                }
                this.pickaxAddStartMoment = n;
            }
        }
        let a = parseInt(UserData.Instance.getItem(E_ASSET_TYPE.MinePickax));
        if (a < 0) {
            a = 0;
            UserData.Instance.setItem(E_ASSET_TYPE.MinePickax, 0);
        }
        // this.schedule(this.upatePickaxCd, .1, cc.macro.REPEAT_FOREVER);
        // cc.game.on(cc.game.EVENT_HIDE, function () {
        //     this.unschedule(this.upatePickaxCd);
        // });
        // cc.game.on(GlobalEvent.GameResume, function () {
        //     this.schedule(this.upatePickaxCd, .1, cc.macro.REPEAT_FOREVER, Math.random());
        // });
    }

    public load() {
        const tileInfoKey = LocalStorageTool.getItemLocal("cc_mine-tile-info-key", []);
        this.digDeep = LocalStorageTool.getItemLocal("cc_mine-dig-deep-key", 6);
        this.digTotalCnt = LocalStorageTool.getItemLocal("cc_mine-dig-total-cnt-key", 0);
        this._cfgMeter = LocalStorageTool.getItemLocal("cc_mine-cfg-meter");
        this._cfgMeterIdx = LocalStorageTool.getItemLocal("cc_mine-cfg-meter-idx", 0);
        this._cfgRowIdx = LocalStorageTool.getItemLocal("cc_mine-cfg-row-idx", 0);
        if (this.cfgMeter) {
            let o = _MineConfig.Instance.get(this.cfgMeter);
            if (o) {
                this.cfgMeterIdx = LocalStorageTool.getItemLocal("cc_mine-cfg-meter-idx", 0);
                if (this.cfgMeterIdx + 1 >= o.cfgs.length) {
                    this.cfgMeterIdx = 1;
                }
            }
            else {
                const t = _MineConfig.Instance.getWith(0);
                this.cfgMeter = t.meter;
                this.cfgMeterIdx = 1;
            }
        }
        else {
            let o = _MineConfig.Instance.getWith(0);
            this.cfgMeter = o.meter;
            this.cfgMeterIdx = 0;
            UserData.Instance.setItem(E_ASSET_TYPE.MinePickax, GameConst.PICKAX_INITIAL_NUMBER);
        }
        if (tileInfoKey.length == 0) {
            this.createTileDatas();
        }
        else {
            this.tileInfos.length = 0;
            const r = this.digDeep - 6;
            const i = r + MINE_MAX_ROW_COUNT;
            let a = 0;
            for (let s = r; s < i; s++) {
                this.tileInfos[s] = tileInfoKey[a];
                a++;
            }
        }
    }

    public async removeTopRow(): Promise<void> {
        if (this.tileInfos.length > MINE_MAX_ROW_COUNT) {
            for (let e = this.tileInfos.length - MINE_MAX_ROW_COUNT; e >= 0;) {
                e--;
                const t = this.tileInfos[e];
                if (_.isNil(t) || t.length == 0) {
                    break;
                }
                this.tileInfos[e] = null;
            }
        }
    }

    public saveData() {
        this.saveTileInfo();
    }

    public saveDigCnt() {
        LocalStorageTool.setItemLocal("cc_mine-dig-total-cnt-key", this.digTotalCnt);
    }

    public saveDigDeep() {
        LocalStorageTool.setItemLocal("cc_mine-dig-deep-key", this.digDeep);
    }

    public saveTileInfo() {
        const e = [];
        for (let t = this.tileInfos.length - MINE_MAX_ROW_COUNT; t < this.tileInfos.length; t++) {
            e.push(this.tileInfos[t]);
        }
        LocalStorageTool.setItemLocal("cc_mine-tile-info-key", e);
    }

    public seachAndOpen(e: number, t: number, o: Array<any>): boolean {
        if (!(e < 0 || e >= this.tileInfos.length || t < 0 || t >= MINE_MAX_COL_COUNT || _.findIndex(o, function (n) {
            return n.row == e && n.col == t;
        }) >= 0)) {
            var r = this.getInfo(e, t);
            if (!r)
                return !1;
            if (r.tile == E_MINE_TILE_TYPE.eRock || r.tile == E_MINE_TILE_TYPE.eSoil)
                return r.status < E_MINE_TILE_STATUS.EOpen && (r.status = E_MINE_TILE_STATUS.EOpen, o.push({
                    row: e,
                    col: t
                })),
                    !1;
            if (r.tile == E_MINE_TILE_TYPE.eEmpty || r.tile >= E_MINE_TILE_TYPE.eUnique1) {
                if (!(r.status < E_MINE_TILE_STATUS.EOpen))
                    return;
                r.status = E_MINE_TILE_STATUS.EOpen,
                    o.push({
                        row: e,
                        col: t
                    });
            }
            return this.seachAround(e, t, o),
                !0;
        }
        // if (!(e < 0 || e >= this.tileInfos.length || t < 0 || t >= MINE_MAX_COL_COUNT || L.findIndex(o, function (n) {
        //     return n.row == e && n.col == t
        // }) >= 0)) {
        //     const r = this.getInfo(e, t);
        //     if (!r) {
        //         return false;
        //     }
        //     if (r.tile == MINE_TILE_TYPE.Rock || r.tile == MINE_TILE_TYPE.Soil) {
        //         if (r.status < MINE_TILE_STATUS.Open) {
        //             r.status = MINE_TILE_STATUS.Open;
        //             o.push({
        //                 row: e,
        //                 col: t
        //             });
        //         }
        //         return false;
        //     }
        //     if (r.tile == MINE_TILE_TYPE.Empty || r.tile >= MINE_TILE_TYPE.Unique1) {
        //         if (r.status < MINE_TILE_STATUS.Open) {
        //             r.status = MINE_TILE_STATUS.Open;
        //             o.push({
        //                 row: e,
        //                 col: t
        //             });
        //         }
        //     }
        //     this.seachAround(e, t, o);
        //     return true;
        // }
    }

    seachAround(e: number, t: number, n: any): void {
        let o = this.getInfo(e - 1, t);
        o && this.seachAndOpen(e - 1, t, n);
        (o = this.getInfo(e, t + 1)) && this.seachAndOpen(e, t + 1, n);
        (o = this.getInfo(e, t - 1)) && this.seachAndOpen(e, t - 1, n);
    }

    seachNextRow(e: number, t: number, n: any): void {
        this.getInfo(e + 1, t) && this.seachAndOpen(e + 1, t, n);
    }

    sendRewards(e: any, t: any): void {
        const o = _MineRewardConfig.Instance.randomReward(e.sp);
        const r = o.type;
        let i = o.id;
        const a = o.count;
        let s = "";
        let c = 0;
        if (r == E_MINE_REWARD_TYPE.eGear) {
            i = _MineRewardGearConfig.Instance.randomReward(this.digDeep);
            s = _GearConfig.Instance.get(i).icon;
            Model.gear.addGear(i, a);
        }
        else {
            s = _AssetConfig.Instance.get(i).icon;
            if (i == E_ASSET_TYPE.MineCube) {
                c = this.getCubeAddationCount(a);
            }
            UserData.Instance.addItem(i, a + c, {
                sourcePos: t,
                callback: () => {
                    this.checkGuideComplete(i);
                },
                type: AssetGetType.Mine,
            });
        }
        RewardPopUI.addPopItem(s, a, c, t);
    }

    public setDigDepp(e: number) {
        this.digDeep = e;
        this.saveDigDeep();
        cc.director.emit(GlobalEventName.SetMineDigDeep, e);
    }

    userPickax(): void {
        if (this.pickaxCount == this.pickaxMaxCount) {
            this.pickaxAddStartMoment = moment(MyTools.GetTimeNow());
        }
        UserData.Instance.subItem(E_ASSET_TYPE.MinePickax, 1);
        cc.director.emit(GlobalEventName.QuestCommit, E_QUEST_ACTIVE_ID.MineUsePickax);
    }
    public set cfgMeter(value: number) {
        if (this.cfgMeter !== value) {
            this._cfgMeter = value;
            LocalStorageTool.setItemLocal("cc_mine-cfg-meter", this._cfgMeter);
        }
    }
    public get cfgMeter(): number {
        return this._cfgMeter;
    }
    public set cfgMeterIdx(value: number) {
        if (this._cfgMeterIdx !== value) {
            this._cfgMeterIdx = value;
            LocalStorageTool.setItemLocal("cc_mine-cfg-meter-idx", this._cfgMeterIdx);
        }
    }
    public get cfgMeterIdx(): number {
        return this._cfgMeterIdx;
    }
    public set cfgRowIdx(value: number) {
        if (this._cfgRowIdx !== value) {
            this._cfgRowIdx = value;
            LocalStorageTool.setItemLocal("cc_mine-cfg-row-idx", this._cfgRowIdx);
        }
    }
    public get cfgRowIdx(): number {
        return this._cfgRowIdx;
    }
    public get cubeCount(): number {
        return parseInt(UserData.Instance.getItem(E_ASSET_TYPE.MineCube));
    }
    public set digDeep(value: number | null) {
        if (this._digDeep !== value) {
            this._digDeep = value;
            this.saveDigDeep();
            cc.director.emit(GlobalEventName.UnlockValueChange, E_UnlockSysType.MineDeep, value);
        }
    }
    public get digDeep(): number | null {
        return this._digDeep;
    }
    public get openDataDeep(): number {
        return this.tileInfos.length;
    }
    public set pickaxAddStartMoment(value: any) {
        this._pickaxAddStartMoment = value;
        let strValue: string | null = null;
        if (value !== null) {
            strValue = value.format();
        }
        LocalStorageTool.setItemLocal("cc_start-pickax-add-moment", strValue);
    }
    public get pickaxAddStartMoment(): any {
        return this._pickaxAddStartMoment;
    }
    public get pickaxCd(): number {
        const propAddition = Model.user.calcPropAddation(ENUM_PROP_TYPE.PickaxSpeed);
        return ((100 * GameConst.PICKAX_DEFAULT_CD) /
            (100 + parseInt(propAddition.toString())));
    }
    public get pickaxCount(): number {
        return parseInt(UserData.Instance.getItem(E_ASSET_TYPE.MinePickax));
    }
    public get pickaxMaxCount(): number {
        const propAddition = Model.user.calcPropAddation(ENUM_PROP_TYPE.PickaxMax);
        return (GameConst.PICKAX_DEFAULT_MAX_CNT + parseInt(propAddition.toString()));
    }
}
