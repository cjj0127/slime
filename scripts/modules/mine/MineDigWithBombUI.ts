import { GlobalEventName } from "../common/Events";
import { E_ASSET_TYPE, E_QUEST_ACTIVE_ID, MapUIPrefabs } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetPool from "../asset/AssetPool";
import SoundPlayerComp from "../../ccstudio/utils/SoundPlayerComp";
import HurtView from "../battle/HurtView";
import LanMgr from "../common/Language";
import MineModel, { E_MINE_TILE_STATUS, E_MINE_TILE_TYPE, MINE_MAX_COL_COUNT } from "../../ccstudio/data/MineModel";
import Model from "../../ccstudio/data/Model";
import MsgHint from "../common/MsgHint";
import MineDigToolUI from "./MineDigToolUI";
import UserData from "../user/UserData";
const I: any = window["_"];
const { ccclass, property } = cc._decorator;
@ccclass
export default class MineDigWithBombUI extends MineDigToolUI {
    preCol = -1;
    preItems = [];
    preRow = -1;
    digEnable(e: any): boolean {
        if (!e)
            return false;
        let t = this.getItemOptionEnable(e);
        if (parseInt(UserData.Instance.getItem(E_ASSET_TYPE.MineBomb)) <= 0) {
            t.errorInfo = LanMgr.Instance.getLangByID("Not enough Bombs!");
            t.success = false;
        }
        if (!!t.success) {
            return true;
        }
        else {
            MsgHint.warn(t.errorInfo);
            return false;
        }
    }
    getBombItems(e: number, t: number): Array<any> {
        let n: Array<any> = [];
        let o = t - 2;
        let r = o + 5;
        for (let i = o; i < r; i++) {
            if (i >= 0 && i < MINE_MAX_COL_COUNT) {
                let a = this.mineList.getMine(e, i);
                n.push(a);
            }
        }
        r = 3 + (o = t - 1);
        let s = this.mineList.getTopRow();
        let c = this.mineList.getBottomRow();
        for (let i = o; i < r; i++) {
            if (i >= 0 && i < MINE_MAX_COL_COUNT) {
                if (e - 1 >= s) {
                    let a = this.mineList.getMine(e - 1, i);
                    n.push(a);
                }
                if (e + 1 <= c) {
                    let a = this.mineList.getMine(e + 1, i);
                    n.push(a);
                }
            }
        }
        if (e - 2 >= s) {
            let a = this.mineList.getMine(e - 2, t);
            n.push(a);
        }
        if (e + 2 <= c) {
            let a = this.mineList.getMine(e + 2, t);
            n.push(a);
        }
        return n;
    }
    getItemOptionEnable(e: any): {
        success: boolean;
        errorInfo: string;
    } {
        let t = true;
        let n = "";
        if (e.status == E_MINE_TILE_STATUS.EClose) {
            t = false;
            n = LanMgr.Instance.getLangByID("Cannot use in dark spaces");
        }
        if (e.tileType != E_MINE_TILE_TYPE.eEmpty && e.tileType < E_MINE_TILE_TYPE.eUnique1) {
            t = false;
            n = LanMgr.Instance.getLangByID("Bombs must be placed in an empty space");
        }
        return {
            success: t,
            errorInfo: n
        };
    }
    async onDigItem(e: any) {
        UserData.Instance.subItem(E_ASSET_TYPE.MineBomb, 1),
            cc.director.emit(GlobalEventName.QuestCommit, E_QUEST_ACTIVE_ID.MineUseBomb);
        let t = this.getBombItems(e.row, e.col);
        let n = -1;
        let o = -1;
        I.each(t, (e: any) => {
            let t = e.tileType;
            if (t != E_MINE_TILE_TYPE.eEmpty && t < E_MINE_TILE_TYPE.eUnique1 && Model.mine.bomb(e.row, e.col)) {
                this.openDigItem(e);
                this.playBombTile(e, t);
                this.trySeachAround(e.row, e.col);
                n = n < 0 ? e.row : Math.min(n, e.row);
                o = Math.max(o, e.row);
            }
            this.playBomb(e);
        });
        let r = n;
        let i = e.col;
        while (this.trySeachNextRow(r, i)) {
            if (++r > Model.mine.digDeep) {
                Model.mine.digDeep = r;
                await this.appendRows(r);
            }
        }
        Model.mine.saveData();
    }
    onDisable(): void {
        if (this.preItems && this.preItems.length > 0) {
            I.each(this.preItems, (e: any) => {
                return e.hideSelect();
            });
        }
    }
    onPlaySelect(e: any): void {
        let t = this.getBombItems(e.row, e.col);
        let n = this.getItemOptionEnable(e);
        I.each(t, (e: any) => {
            e.playSelect(true != n.success);
        });
    }
    onPreEnd(): void {
        if (this.preItems && this.preItems.length > 0) {
            I.each(this.preItems, (e: any) => { e.hideSelect(); });
            this.preItems.length = 0;
            this.preCol = -1;
        }
    }
    onPreItem(e: any): void {
        if ((I.isNil(e) || e.col != this.preCol || e.row != this.preRow) && (I.each(this.preItems, (e: any) => { e.hideSelect(); }), this.preItems.length = 0, this.preRow = -1, this.preCol = -1), e) {
            let t = this.getItemOptionEnable(e);
            if (0 == this.preItems.length) {
                this.preItems = this.getBombItems(e.row, e.col);
                this.preRow = e.row;
                this.preCol = e.col;
            }
            I.each(this.preItems, (e: any) => {
                e.showSelect(true != t.success);
            });
        }
    }
    async playBomb(e: any): Promise<void> {
        const t = e.node.convertToWorldSpaceAR(cc.Vec3.ZERO);
        const n = await AssetPool.Instance.createObjAsync(NAMES_BUNDLE.Game, MapUIPrefabs.MineBomb.path);
        n.parent = this.mineList.content;
        n.position = this.mineList.content.convertToNodeSpaceAR(t);
        const r = n.getComponent(HurtView);
        r.play("boom", () => {
            AssetPool.Instance.put(n);
        });
        SoundPlayerComp.Instance.playEffect("Audios/bomb");
    }
    async playBombTile(e: any, t: E_MINE_TILE_TYPE): Promise<void> {
        const n = e.node.convertToWorldSpaceAR(cc.Vec3.ZERO);
        const o = await AssetPool.Instance.createObjAsync(NAMES_BUNDLE.Game, MapUIPrefabs.MineBomb.path);
        o.parent = this.mineList.content;
        o.position = this.mineList.content.convertToNodeSpaceAR(n);
        const r = o.getComponent(HurtView);
        let i = "stone2";
        if (t == E_MINE_TILE_TYPE.eSoil) {
            i = "stone3";
        }
        r.play(i, () => {
            AssetPool.Instance.put(o);
        });
    }
}
