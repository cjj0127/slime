import { MINE_UNIQUE_PLACE } from "./MineItemUI";
import MsgBox from "../common/MsgBox";
import MineModel, { E_MINE_TILE_TYPE, E_MINE_SP_TYPE_TILE, E_MINE_TILE_STATUS } from "../../ccstudio/data/MineModel";
import Model from "../../ccstudio/data/Model";
import MsgHint from "../common/MsgHint";
import MineEditSpItemUI from "./MineEditSpItemUI";
import MineEditTileItemUI from "./MineEditTileItemUI";
import MineListUI from "./MineListUI";
const { ccclass, property, menu } = cc._decorator;
const _: any = window["_"];
@ccclass
@menu("Custom/MineMapEditor")
export default class MineMapEditor extends cc.Component {
    private _beChange: boolean = false;
    @property(cc.Button)
    btnCreate: cc.Button = null;
    @property(cc.Button)
    btnRead: cc.Button = null;
    @property(cc.Button)
    btnSave: cc.Button = null;
    @property([MineEditSpItemUI])
    editSpItems: MineEditSpItemUI[] = [];
    @property([MineEditTileItemUI])
    editTileTypess: MineEditTileItemUI[] = [];
    @property(cc.Label)
    fileName: cc.Label = null;
    @property(MineListUI)
    mineList: MineListUI = null;
    onClickRead = async function () {
        const t = await this.pickAndReadFile();
        if (t.errMsg) {
            MsgBox(t.errMsg);
        }
        else {
            this.fileName.string = t.file;
            const n = JSON.parse(t.content);
            if (!Array.isArray(n)) {
                MsgBox("读取文件失败，此配置文件非挖矿配置");
            }
            else if (!_.every(n, (e) => Array.isArray(e) && _.every(e, (e) => Array.isArray(e) && e.length == 3))) {
                MsgBox("读取文件失败，此配置文件非挖矿配置");
            }
            else {
                this.refreshList(n);
            }
        }
    };
    onEnable = async function () {
        this.beChange = false;
        for (let e = 0; e < 7; e++) {
            for (let t = 0; t < 6; t++) {
                const n = {
                    digCnt: 0,
                    received: false,
                    sp: E_MINE_SP_TYPE_TILE.eNone,
                    status: E_MINE_TILE_STATUS.EOpen,
                    tile: E_MINE_TILE_TYPE.eEmpty,
                    unique: -1
                };
                await this.mineList.addMine(e, t, n).hideSelect();
            }
        }
        const o = _.flatten(this.mineList.mineItems);
        _.each(o, (e) => {
            e.refreshTile();
            e.refreshStatus();
            e.refreshSp();
        });
        this.refreshTileInfo();
        this.refreshSpList();
    };
    preTouchItem: any = null;
    refreshList = (e) => {
        _.each(e, (n, i) => {
            _.each(n, (o, r) => {
                const t = Model.mine.decodeInfo(o, E_MINE_TILE_STATUS.EOpen);
                const s = this.mineList.getMine(i, r);
                s.setSpType(t.sp);
                s.setTileType(t.tile);
                s.uniqueStart = t.unique;
            });
        });
    };
    @property(MineEditTileItemUI)
    selectTileTypeItem: MineEditTileItemUI = null;
    @property(cc.Label)
    tileInfo: cc.Label = null;
    writeFile = async (content, suggestedName) => {
        //     let o = "";
        //     try {
        //         const options = {
        //             suggestedName: suggestedName,
        //             types: [{
        //                 description: "保存文件",
        //                 accept: {
        //                     "application/json": [".json"]
        //                 }
        //             }]
        //         };
        //         const fileHandle = await window.showSaveFilePicker(options);
        //         const writable = await fileHandle.createWritable();
        //         await writable.write(content);
        //         await writable.close();
        //         o = `保存成功：${fileHandle.name} `;
        //         this.fileName.string = fileHandle.name;
        //         this.beChange = false;
        //         MsgBox(o);
        //     } catch (error) {
        //         console.log(error);
        //         o = `保存失败：${error.message} `;
        //         MsgBox(o);
        //     }
    };
    clear() {
        this.preTouchItem && this.preTouchItem.hideSelect();
        this.preTouchItem = null;
        const mineItems = _.flatten(this.mineList.mineItems);
        _.each(mineItems, (item) => {
            item.setTileType(E_MINE_TILE_TYPE.eEmpty);
            item.setSpType(E_MINE_SP_TYPE_TILE.eNone);
            item.uniqueStart = -1;
        });
        this.beChange = false;
        this.refreshSpList();
    }
    formatTileInfo() {
        const infoArray = [];
        _.each(this.mineList.mineItems, (items, index) => {
            const subArray = new Array(items.length);
            _.each(items, (item, i) => {
                subArray[i] = item.formatInfo();
            });
            infoArray[index] = subArray;
        });
        return JSON.stringify(infoArray);
    }
    private getSpName(e: E_MINE_SP_TYPE_TILE): string {
        switch (e) {
            case E_MINE_SP_TYPE_TILE.eNone:
                return "空";
            case E_MINE_SP_TYPE_TILE.eBomb:
                return "炸弹";
            case E_MINE_SP_TYPE_TILE.eBox:
                return "盒子";
            case E_MINE_SP_TYPE_TILE.eBronze:
                return "青铜";
            case E_MINE_SP_TYPE_TILE.eCoin:
                return "金币";
            case E_MINE_SP_TYPE_TILE.eDrill:
                return "地钻";
            case E_MINE_SP_TYPE_TILE.eExp:
                return "经验";
            case E_MINE_SP_TYPE_TILE.eGem:
                return "钻石";
            case E_MINE_SP_TYPE_TILE.eGold:
                return "金矿";
            case E_MINE_SP_TYPE_TILE.ePickax:
                return "镐头";
            case E_MINE_SP_TYPE_TILE.eSilver:
                return "银矿";
            case E_MINE_SP_TYPE_TILE.eCube:
                return "研究物";
            case E_MINE_SP_TYPE_TILE.eCubeBronze:
                return "青铜盒子";
            case E_MINE_SP_TYPE_TILE.eCubeGold:
                return "金箱子";
            case E_MINE_SP_TYPE_TILE.eCubeSilver:
                return "银箱子";
        }
    }
    getTileName(e: number): string {
        switch (e) {
            case E_MINE_TILE_TYPE.eEmpty:
                return "空";
            case E_MINE_TILE_TYPE.eSoil:
                return "土块";
            case E_MINE_TILE_TYPE.eRock:
                return "岩石";
            case E_MINE_TILE_TYPE.eUnique1:
                return "200x200";
            case E_MINE_TILE_TYPE.eUnique2:
                return "300x200";
            case E_MINE_TILE_TYPE.eUnique3:
                return "400x200";
            case E_MINE_TILE_TYPE.eUnique4:
                return "600x200";
            default:
                return "未知";
        }
    }
    onClickCreate() {
        if (this.beChange) {
            const t = MsgBox.open("当前编辑未保存，是否覆盖创建？（覆盖后原修改将丢失）");
            t.cancel(),
                t.confirm(() => {
                    const splitFileName = this.fileName.string.split(".");
                    splitFileName[0] += "-1";
                    this.fileName.string = splitFileName.join(".");
                    this.clear();
                });
        }
        else {
            const splitFileName = this.fileName.string.split(".");
            splitFileName[0] += "-1";
            this.fileName.string = splitFileName.join(".");
            this.clear();
        }
    }
    onClickEditSpItem(e: any): void {
        const t = e.getComponent(MineEditSpItemUI).spType;
        if (this.preTouchItem) {
            const n = this.preTouchItem.tileType;
            if (n == E_MINE_TILE_TYPE.eEmpty) {
                MsgHint.warn("设置了图块才能设置物品");
                return;
            }
            if (n == E_MINE_TILE_TYPE.eRock) {
                MsgHint.warn("物品不能放到岩石上");
                return;
            }
            if (n >= E_MINE_TILE_TYPE.eUnique1) {
                if (t < E_MINE_SP_TYPE_TILE.eCube) {
                    MsgHint.warn("整体物品上放置物品错误!");
                    return;
                }
            }
            else if (t >= E_MINE_SP_TYPE_TILE.eCube) {
                MsgHint.warn("图块上放置物品错误!");
                return;
            }
            if (this.preTouchItem.spType !== t) {
                this.preTouchItem.setSpType(t);
                this.beChange = true;
            }
            this.refreshTileInfo();
        }
        else {
            MsgHint.warn("先选择地块");
        }
    }
    onClickEditTileTypeItem(e: any): void {
        const t = e.getComponent(MineEditTileItemUI);
        if (t !== this.selectTileTypeItem) {
            if (this.selectTileTypeItem) {
                this.selectTileTypeItem.hideSelect();
            }
            this.selectTileTypeItem = e.getComponent(MineEditTileItemUI);
            this.selectTileTypeItem.showSelect();
        }
        const n = t.tileType;
        if (this.preTouchItem) {
            const o = this.preTouchItem.tileType;
            if (o !== n) {
                if (n >= E_MINE_TILE_TYPE.eUnique1) {
                    const r = MINE_UNIQUE_PLACE[n];
                    let i = this.preTouchItem.col;
                    let a = i + r;
                    if (a >= 6) {
                        i = (a = 6) - r;
                    }
                    for (let s = 0; s < 2; s++) {
                        const c = this.preTouchItem.row + s;
                        const f = this.mineList.getMine(c, i);
                        f.uniqueStart = s;
                        f.setTileType(n);
                        for (let d = i + 1; d < a; d++) {
                            const _ = this.mineList.getMine(c, d);
                            _.uniqueStart = -1;
                            _.setTileType(n);
                            _.setSpType(E_MINE_SP_TYPE_TILE.eNone);
                        }
                    }
                }
                else {
                    if (o >= E_MINE_TILE_TYPE.eUnique1) {
                        const g = this.preTouchItem.row - 1;
                        const y = g + 3;
                        for (let c = g; c < y; c++) {
                            for (let v = 0; v < 6; v++) {
                                const _ = this.mineList.getMine(c, v);
                                if (_ !== this.preTouchItem && _.tileType == o) {
                                    _.setTileType(E_MINE_TILE_TYPE.eEmpty);
                                    _.setSpType(E_MINE_SP_TYPE_TILE.eNone);
                                }
                            }
                        }
                    }
                    this.preTouchItem.setTileType(n);
                }
                this.beChange = true;
                this.refreshSpList();
            }
            this.refreshTileInfo();
        }
        else {
            MsgHint.warn("先选择地块");
        }
    }
    onClickSave() {
        if (this.beChange) {
            const e = this.formatTileInfo();
            this.writeFile(e, this.fileName.string);
        }
        else {
            MsgHint.warn("当前未修改，无需保存");
        }
    }
    onLoad() {
        this.btnSave.node.on("click", this.onClickSave, this);
        this.btnRead.node.on("click", this.onClickRead, this);
        this.btnCreate.node.on("click", this.onClickCreate, this);
        this.mineList.setEditMode(true);
        this.mineList.setUICount(7, 6);
        this.mineList.delegate = this;
        this.editSpItems = this.getComponentsInChildren(MineEditSpItemUI);
        _.each(this.editSpItems, (t) => {
            t.node.on("click", this.onClickEditSpItem, this);
        });
        this.editTileTypess = this.getComponentsInChildren(MineEditTileItemUI);
        _.each(this.editTileTypess, (t) => {
            t.node.on("click", this.onClickEditTileTypeItem, this);
        });
        cc.debug.setDisplayStats(false);
    }
    onTouchItem(e: any): void {
        if (this.preTouchItem !== e) {
            if (this.preTouchItem) {
                this.preTouchItem.hideSelect();
            }
            this.preTouchItem = e;
            this.preTouchItem.showSelect();
            this.refreshTileInfo();
            this.refreshSpList();
        }
    }
    onTouchMoveToItem(e: any): void {
        if (!_.isNil(e) && !_.isNil(this.selectTileTypeItem)) {
            const t = this.selectTileTypeItem.tileType;
            if (!_.isNil(t) && t > E_MINE_TILE_TYPE.eSoil && e.tileType !== t) {
                e.setTileType(t);
                e.setSpType(E_MINE_SP_TYPE_TILE.eNone);
                this.beChange = true;
            }
        }
    }
    pickAndReadFile(callback) {
        // const t: any = {};
        // window.showOpenFilePicker({
        //     multiple: false,
        //     excludeAcceptAllOption: true,
        //     types: [{
        //         description: "选择文件",
        //         accept: {
        //             "application/json": [".json"]
        //         }
        //     }]
        // }).then((n) => {
        //     const o = n[0];
        //     o.getFile().then((file) => {
        //         console.log(file);
        //         const reader = new FileReader;
        //         reader.onload = (event) => {
        //             console.log(event, o),
        //                 t.file = o.name,
        //                 t.content = event.target.result,
        //                 t.errMsg = "",
        //                 callback(t);
        //         };
        //         reader.readAsText(file);
        //     });
        // }).
        //     catch((error) => {
        //         console.log(error),
        //             t.file = "",
        //             t.content = "",
        //             t.errMsg = "选择文件失败:" + error.message,
        //             callback(t);
        //     });
    }
    refreshSpList(): void {
        if (this.preTouchItem) {
            const e = this.preTouchItem.tileType;
            if (e <= E_MINE_TILE_TYPE.eRock) {
                _.each(this.editSpItems, function (e) {
                    e.node.active = false;
                });
            }
            else if (e == E_MINE_TILE_TYPE.eSoil) {
                _.each(this.editSpItems, function (e) {
                    const t = e.spType;
                    e.node.active = t < E_MINE_SP_TYPE_TILE.eCube;
                });
            }
            else {
                _.each(this.editSpItems, function (e) {
                    const t = e.spType;
                    e.node.active = t >= E_MINE_SP_TYPE_TILE.eCube;
                });
            }
        }
        else {
            _.each(this.editSpItems, function (e) {
                e.node.active = false;
            });
        }
    }
    refreshTileInfo(): void {
        if (this.preTouchItem) {
            const e = this.preTouchItem.tileType;
            const t = this.preTouchItem.spType;
            this.tileInfo.string = this.getTileName(e) + " " + this.getSpName(t);
        }
        else {
            this.tileInfo.string = "未选择";
        }
    }
    get beChange(): boolean {
        return this._beChange;
    }
    set beChange(value: boolean) {
        this._beChange = value;
        this.btnSave.interactable = value;
    }
}
