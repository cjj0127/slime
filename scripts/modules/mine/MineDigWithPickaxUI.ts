import { E_ASSET_TYPE } from "../common/Const";
import SoundPlayerComp from "../../ccstudio/utils/SoundPlayerComp";
import LanMgr from "../common/Language";
import MineModel, { E_MINE_TILE_TYPE, E_MINE_TILE_STATUS, E_MINE_SP_TYPE_TILE } from "../../ccstudio/data/MineModel";
import Model from "../../ccstudio/data/Model";
import MsgHint from "../common/MsgHint";
import MineDigToolUI from "./MineDigToolUI";
import UserData from "../user/UserData";
const v: any = window["_"];
// n.default = _
const { ccclass, property } = cc._decorator;
@ccclass
export default class MineDigWithPickaxUI extends MineDigToolUI {
    preItem: any = null;
    digEnable(e) {
        if (v.isNil(e)) {
            return false;
        }
        let t = this.getItemOptionEnable(e);
        e.priteInfo();
        let n = e.spType;
        if (e.tileType >= E_MINE_TILE_TYPE.eUnique1 && n > E_MINE_SP_TYPE_TILE.eNone) {
            return true;
        }
        if (parseInt(UserData.Instance.getItem(E_ASSET_TYPE.MinePickax)) <= 0) {
            t.errorInfo = LanMgr.Instance.getLangByID("Not enough Pickaxs!");
            t.success = false;
        }
        return t.success || (MsgHint.warn(t.errorInfo), false);
    }
    getItemOptionEnable(e) {
        let t = true, n = "";
        if (e.tileType == E_MINE_TILE_TYPE.eEmpty || e.received) {
            t = false;
            n = LanMgr.Instance.getLangByID("Cannot use on blank tiles");
        }
        else if (e.status == E_MINE_TILE_STATUS.EClose) {
            t = false;
            n = LanMgr.Instance.getLangByID("Cannot use in dark spaces");
        }
        return {
            success: t,
            errorInfo: n
        };
    }
    async onDigItem(e) {
        SoundPlayerComp.Instance.playEffect("Audios/mine");
        if (e.tileType < E_MINE_TILE_TYPE.eUnique1) {
            Model.mine.userPickax();
            await e.playDigEffect();
        }
        if (!Model.mine.dig(e.row, e.col)) {
            return;
        }
        this.openDigItem(e);
        let o = e.row, r = e.col;
        while (true) {
            this.trySeachAround(o, r);
            if (this.trySeachNextRow(o, r)) {
                if (++o > Model.mine.digDeep) {
                    Model.mine.digDeep = o;
                    await this.appendRows(o);
                }
            }
            else {
                break;
            }
        }
        Model.mine.saveData();
    }
    onDisable() {
        if (this.preItem) {
            this.preItem.hideSelect();
        }
    }
    onPlaySelect(e) {
        e.playSelect();
    }
    onPreEnd() {
        if (this.preItem) {
            this.preItem.hideSelect();
        }
        this.preItem = null;
    }
    onPreItem(e) {
        if (this.preItem !== e) {
            if (this.preItem) {
                this.preItem.hideSelect();
            }
            this.preItem = e;
            if (this.preItem) {
                let t = false;
                if (e.tileType == E_MINE_TILE_TYPE.eEmpty || e.received) {
                    t = true;
                }
                else if (e.status == E_MINE_TILE_STATUS.EClose) {
                    t = true;
                }
                this.preItem.showSelect(t);
            }
        }
    }
}
