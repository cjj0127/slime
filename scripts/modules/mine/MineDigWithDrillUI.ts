import { GlobalEventName } from "../common/Events";
import { E_ASSET_TYPE, E_QUEST_ACTIVE_ID, MapUIPrefabs } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetPool from "../asset/AssetPool";
import SoundPlayerComp from "../../ccstudio/utils/SoundPlayerComp";
import HurtView from "../battle/HurtView";
import LanMgr from "../common/Language";
import MineModel, { MINE_MAX_COL_COUNT, E_MINE_TILE_STATUS, E_MINE_TILE_TYPE, MINE_TILE_SIZE } from "../../ccstudio/data/MineModel";
import Model from "../../ccstudio/data/Model";
import MsgHint from "../common/MsgHint";
import MyTools from "../../ccstudio/utils/MyTools";
import MineDigToolUI from "./MineDigToolUI";
import UserData from "../user/UserData";
const C: any = window["_"];
const { ccclass, property } = cc._decorator;
@ccclass
export default class MineDigWithDrillUI extends MineDigToolUI {
    preCol = -1;
    preItems = [];
    digEnable(e: any) {
        if (!e) {
            return false;
        }
        const t = this.getItemOptionEnable(e);
        if (parseInt(UserData.Instance.getItem(E_ASSET_TYPE.MineDrill)) <= 0) {
            t.errorInfo = LanMgr.Instance.getLangByID("Not enough Drills!");
            t.success = false;
        }
        if (!!t.success == false) {
            MsgHint.warn(t.errorInfo);
            return false;
        }
        return true;
    }
    // private async fetchData() {
    //     const data = await AssetPool.loadRes(T_COMMON_BLOCKLIST, AssetRes.LIST),
    //         list = data.json;
    //     if (!list) {
    //         return;
    //     }
    //     this.preItems = list.preItems;
    //     this.preCol = list.preCol;
    // }
    // private delayHide() {
    //     this.hideSelectItem();
    //     setTimeout(() => {
    //         this.node.active = false;
    //     }, 100);
    // }
    // private showSelectItem() {
    //     this.node.active = true;
    //     this.selectItem.active = true;
    // }
    // private hideSelectItem() {
    //     this.selectItem.active = false;
    // }
    // private onClickClose() {
    //     SoundPlayerComp.playSound(AUDIO_SOUND_CANCEL);
    //     this.delayHide();
    // }
    // private async onClickUse() {
    //     SoundPlayerComp.playSound(AUDIO_SOUND_USE);
    //     if (this.selectItem) {
    //         const data = await this.fetchData();
    //         if (data) {
    //             const type = this.selectItem.type;
    //             let needGold = 0;
    //             switch (type) {
    //                 case ConsITEM_TYPE_PRE:
    //                     needGold = data.preItems[type][this.selectItem.subType - 1].goldCost;
    //                     break;
    //                 default:
    //                     break;
    //             }
    //             if (UserData.default.getGold() < needGold) {
    //                 const str = Language.default.get(Const.T_LABEL_NOGOLD, {
    //                     num: needGold - UserData.default.getGold(),
    //                 });
    //                 MsgHint.default.show(str);
    //                 return;
    //             }
    //             UserData.default.addGold(-needGold);
    //             switch (type) {
    //                 case ConsITEM_TYPE_PRE:
    //                     MineModel.removePreItem(this.selectItem.subType);
    //                     break;
    //                 default:
    //                     break;
    //             }
    //             Events.default.emit(Events.EVENT_REFRESH_UI);
    //         }
    //     }
    //     this.delayHide();
    // }
    getBombItems(e: number) {
        const t = this.mineList.getColMines(e);
        const n = C.last(t)!.row;
        const o = this.mineList.getRowMine(n);
        const r = e - 1;
        if (r >= 0) {
            t.push(o[r]);
        }
        const i = e + 1;
        if (i < MINE_MAX_COL_COUNT) {
            t.push(o[i]);
        }
        return t;
    }
    getItemOptionEnable(e: any) {
        let t = true;
        let n = "";
        if (e.status == E_MINE_TILE_STATUS.EClose) {
            t = false;
            n = LanMgr.Instance.getLangByID("Cannot use in dark spaces");
        }
        if (e.tileType !== E_MINE_TILE_TYPE.eEmpty && e.tileType < E_MINE_TILE_TYPE.eUnique1) {
            t = false;
            n = LanMgr.Instance.getLangByID("Drills can only be placed on empty tiles");
        }
        return {
            success: t,
            errorInfo: n
        };
    }
    async onDigItem(e: any) {
        UserData.Instance.subItem(E_ASSET_TYPE.MineDrill, 1),
            cc.director.emit(GlobalEventName.QuestCommit, E_QUEST_ACTIVE_ID.MineUseDrill);
        const t = this.getBombItems(e.col);
        const n = C.first(t)!.row;
        const o = C.last(t)!.row;
        const r = this.mineList.getMine(n, e.col).node;
        const i = this.mineList.sp;
        i.enabled = true;
        i.node.position = this.mineList.node.convertToNodeSpaceAR(r.convertToWorldSpaceAR(cc.Vec3.ZERO));
        i.setAnimation(0, "bit", true);
        i.node.stopAllActions();
        const u = i.node.y - (o - n + 1) * MINE_TILE_SIZE.height;
        cc.tween(i.node).delay(0.06).to(0.12 * (o - n + 1), {
            y: u
        }).call(function () {
            i.enabled = false;
        }).start();
        let self = this;
        async function digRow(row: any) {
            const bombs = C.reduce(t, (acc: any[], n: any) => {
                if (n.row == row && n.tileType !== E_MINE_TILE_TYPE.eEmpty && n.tileType < E_MINE_TILE_TYPE.eUnique1) {
                    acc.push(n);
                }
                return acc;
            }, []);
            await Promise.all(bombs.map(async (t: any) => {
                const n = t.tileType;
                if (Model.mine.bomb(row, t.col)) {
                    self.playBomb(t, n);
                    self.openDigItem(t);
                    self.trySeachAround(row, t.col);
                }
            }));
            SoundPlayerComp.Instance.playEffect("Audios/drill");
            await MyTools.sleep(0.12);
        }
        let g = n;
        while (g <= o) {
            await digRow(g);
            g++;
        }
        const m = e.col;
        let y = n;
        while (true) {
            this.trySeachAround(y, m);
            if (this.trySeachNextRow(y, m)) {
                y++;
                if (y > Model.mine.digDeep) {
                    Model.mine.digDeep = y;
                    await this.appendRows(y);
                }
            }
            else {
                break;
            }
        }
        Model.mine.saveData();
    }
    onDisable() {
        if (this.preItems && this.preItems.length > 0) {
            C.each(this.preItems, function (e) {
                return e.hideSelect();
            });
        }
    }
    onPlaySelect(e: any) {
        const t = this.getBombItems(e.col);
        const n = this.getItemOptionEnable(e);
        C.each(t, function (e) {
            e.playSelect(n.success !== true);
        });
    }
    onPreEnd() {
        if (this.preItems && this.preItems.length > 0) {
            C.each(this.preItems, function (e) {
                return e.hideSelect();
            });
        }
        this.preItems.length = 0;
        this.preCol = -1;
    }
    onPreItem(e: any) {
        if ((C.isNil(e) || e.col !== this.preCol) && (C.each(this.preItems, function (e) {
            e.hideSelect();
        }), this.preItems.length = 0, this.preCol = -1), e) {
            const t = this.getItemOptionEnable(e);
            if (this.preItems.length == 0) {
                this.preItems = this.getBombItems(e.col);
                this.preCol = e.col;
            }
            C.each(this.preItems, function (e) {
                e.showSelect(t.success !== true);
            });
        }
    }
    async playBomb(e: any, t: E_MINE_TILE_TYPE): Promise<void> {
        return await (async () => {
            const n = e.node.convertToWorldSpaceAR(cc.Vec3.ZERO);
            const o = await AssetPool.Instance.createObjAsync(NAMES_BUNDLE.Game, MapUIPrefabs.MineBomb.path);
            o.parent = this.mineList.node;
            o.position = this.mineList.node.convertToNodeSpaceAR(n);
            const r = o.getComponent(HurtView);
            let i = "stone2";
            if (t == E_MINE_TILE_TYPE.eSoil) {
                i = "stone3";
            }
            r.play(i, () => {
                AssetPool.Instance.put(o);
            });
        })();
    }
}
