import GuideMgr from "../guide/GuideMgr";
import GuideTouch from "../guide/GuideTouch";
import QuestDailyViewUI from "../quest/QuestDailyViewUI";
import { SpecialGuideEnum } from "../guide/GuideEnums";
import { MINE_IMAGE_URL_ } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
import { E_MINE_TILE_TYPE, E_MINE_SP_TYPE_TILE, MINE_TILE_SIZE, E_MINE_TILE_STATUS } from "../../ccstudio/data/MineModel";
const P: any = window["_"];
const { ccclass, property, menu } = cc._decorator;
export const MINE_UNIQUE_PLACE = {
    [E_MINE_TILE_TYPE.eUnique1]: 2,
    [E_MINE_TILE_TYPE.eUnique2]: 3,
    [E_MINE_TILE_TYPE.eUnique3]: 4,
    [E_MINE_TILE_TYPE.eUnique4]: 6,
};
export const MINE_TILE_SPRITES = {
    [E_MINE_SP_TYPE_TILE.eBomb]: "mine_tile_sp_bomb",
    [E_MINE_SP_TYPE_TILE.eBox]: "mine_tile_sp_box",
    [E_MINE_SP_TYPE_TILE.eBronze]: "mine_tile_sp_bronze",
    [E_MINE_SP_TYPE_TILE.eCoin]: "mine_tile_sp_coin",
    [E_MINE_SP_TYPE_TILE.eDrill]: "mine_tile_sp_drill",
    [E_MINE_SP_TYPE_TILE.eExp]: "mine_tile_sp_exp",
    [E_MINE_SP_TYPE_TILE.eGem]: "mine_tile_sp_gem",
    [E_MINE_SP_TYPE_TILE.eGold]: "mine_tile_sp_gold",
    [E_MINE_SP_TYPE_TILE.ePickax]: "mine_tile_sp_pickax",
    [E_MINE_SP_TYPE_TILE.eSilver]: "mine_tile_sp_silver",
    [E_MINE_SP_TYPE_TILE.eCube]: "mine_icon_mine_reward_01",
    [E_MINE_SP_TYPE_TILE.eCubeBronze]: "mine_icon_minecube_bronze",
    [E_MINE_SP_TYPE_TILE.eCubeGold]: "mine_icon_minecube_gold",
    [E_MINE_SP_TYPE_TILE.eCubeSilver]: "mine_icon_minecube_silver",
};
export const MINE_TILE_SIZES = {
    [E_MINE_TILE_TYPE.eUnique1]: "200x200",
    [E_MINE_TILE_TYPE.eUnique2]: "300x200",
    [E_MINE_TILE_TYPE.eUnique3]: "400x200",
    [E_MINE_TILE_TYPE.eUnique4]: "600x200",
};
export const MINE_TILE_CRACK_SPRITES = ["", "mine_tile_crack_01", "mine_tile_crack_02"];
@ccclass
@menu("MineUI/MineItemUI")
export default class MineItemUI extends cc.Component {
    _col: number = 0;
    _digCnt: number = 0;
    _dirtySp: boolean = false;
    _dirtyTile: boolean = false;
    _received: boolean = false;
    _row: number = 0;
    _spType: E_MINE_SP_TYPE_TILE = null;
    _status = null;
    beUpdateTile: boolean = false;
    @property(cc.Sprite)
    crackSprite: cc.Sprite = null;
    @property(cc.Sprite)
    crackSprite2: cc.Sprite = null;
    @property(cc.Sprite)
    dimmedSprite: cc.Sprite = null;
    @property(cc.Label)
    rowLabel: cc.Label = null;
    @property(cc.Sprite)
    selectSprite: cc.Sprite = null;
    @property(cc.Sprite)
    spSprite: cc.Sprite = null;
    @property(cc.Sprite)
    tileSprite: cc.Sprite = null;
    tileType: E_MINE_TILE_TYPE = null;
    uniqueStart: number = 0;
    watchs: cc.Node[] = new Array(8);
    addWatch(e: any, t: number): void {
        let n: any = this.watchs[t];
        if (n != e) {
            P.isNil(n) || n.node.off("mine-item-change-tile", this.onWatchChangeTile, this);
            this.watchs[t] = e;
            e.node.on("mine-item-change-tile", this.onWatchChangeTile, this);
            e.node.on("mine-item-clear", this.onWatchClear, this);
        }
    }
    public bomb(): void {
        this.tileType != E_MINE_TILE_TYPE.eEmpty && this.reward();
    }
    public clear(): void {
        this.node.emit("mine-item-clear", this);
    }
    formatInfo(): Array<number> {
        return [this.spType, this.tileType, this.uniqueStart];
    }
    public hideDimmed() {
        this.dimmedSprite.node.active = false;
    }
    public hideSelect() {
        this.selectSprite.node.active = false;
    }
    public onDisable(): void {
        P.each(this.watchs, (t: any, n: string) => {
            t?.node.targetOff(this);
            this.watchs[n] = null;
        });
    }
    // refreshSp() {
    //     if (this.spSprite) {
    //         const spName = MINE_TILE_SPRITES[this.spType];
    //         const sizeStr = MINE_TILE_SIZES[this.tileType];
    //         const resPath = AssetManager.getMineTileResPath(spName, sizeStr);
    //         AssetRes.setImage(this.spSprite, resPath);
    //         this._dirtySp = false;
    //     }
    // }
    // getWatchDir(centerTile: Tile): number {
    //     let deltaX = centerTile.col - this.col;
    //     let deltaY = centerTile.row - this.row;
    //     if (deltaX > 0) {
    //         if (deltaY > 0) {
    //             return 0; // right_top
    //         } else if (deltaY == 0) {
    //             return 1; // right
    //         } else {
    //             return 2; // right_bottom
    //         }
    //     } else if (deltaX == 0) {
    //         if (deltaY > 0) {
    //             return 7; // top
    //         } else if (deltaY == 0) {
    //             return -1; // invalid
    //         } else {
    //             return 3; // bottom
    //         }
    //     } else {
    //         if (deltaY > 0) {
    //             return 6; // left_top
    //         } else if (deltaY == 0) {
    //             return 5; // left
    //         } else {
    //             return 4; // left_bottom
    //         }
    //     }
    // }
    // setCrackLevel(crackLevel: number) {
    //     const spName = MINE_TILE_SPRITES[this.spType];
    //     if (spName && crackLevel > 0) {
    //         const crackSprite = crackLevel == 1 ? this.crackSprite : this.crackSprite2;
    //         if (crackSprite) {
    //             const sizeStr = MINE_TILE_SIZES[this.tileType];
    //             const resPath = AssetManager.getMineTileResPath(`mine_tile_crack_${crackLevel}`, sizeStr);
    //             AssetRes.setImage(crackSprite, resPath);
    //         }
    //     }
    // }
    onEnable() {
        this.crackSprite.node.active = false;
        this.crackSprite2.node.active = false;
    }
    onWatchChangeTile(): void {
        let self = this;
        if (!this.beUpdateTile) {
            this.beUpdateTile = true;
            cc.director.once(cc.Director.EVENT_AFTER_DRAW, async function () {
                await self.refreshTile();
                self.beUpdateTile = false;
            });
        }
    }
    onWatchClear(e): void {
        e.node.targetOff(this);
        let t: number = P.findIndex(this.watchs, function (t) {
            return t == e;
        });
        t >= 0 && (this.watchs[t] = null);
    }
    public playCrack(e: cc.Node): Promise<void> {
        return new Promise((t) => {
            e.active = true;
            e.opacity = 0;
            e.stopAllActions();
            cc.tween(e).to(0.05, { opacity: 255 })
                .delay(0.1)
                .call(t)
                .start();
        });
    }
    public async playDigEffect(): Promise<void> {
        let e: any;
        switch (this.tileType) {
            case E_MINE_TILE_TYPE.eRock:
                if (1 !== this.digCnt + 1)
                    break;
                return await this.playCrack(this.crackSprite.node);
            default:
                if (2 == this.digCnt + 1) {
                    this.crackSprite2.node.active = false;
                    return await this.playCrack(this.crackSprite2.node);
                }
                this.crackSprite.node.active = false;
                return await this.playCrack(this.crackSprite.node);
        }
    }
    public playSelect(e: boolean) {
        this.showSelect(e);
        this.selectSprite.node.stopAllActions();
        this.selectSprite.node.opacity = 0;
        cc.tween(this.selectSprite.node).to(0.02, { opacity: 255 }).delay(0.12).to(0.02, { opacity: 0 }).call(() => {
            this.hideSelect();
        }).start();
    }
    priteInfo(): void { }
    refreshSp(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (!this._dirtySp) {
                this._dirtySp = !0;
                cc.director.once(cc.Director.EVENT_AFTER_DRAW, async () => {
                    try {
                        await this.setSpSprite(this.spType);
                        this._dirtySp = !1;
                        resolve();
                    }
                    catch (error) {
                        reject(error);
                    }
                });
            }
            else {
                resolve(); // if not dirty, directly resolve the promise
            }
        });
    }
    public refreshStatus() {
        switch (this.status) {
            case E_MINE_TILE_STATUS.EClose:
                this.showDimmed();
                break;
            case E_MINE_TILE_STATUS.EOpen:
                this.hideDimmed();
                break;
        }
    }
    async refreshTile(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this._dirtyTile || (this._dirtyTile = !0, cc.director.once(cc.Director.EVENT_AFTER_DRAW, async () => {
                try {
                    await this.setTileSprite();
                    this._dirtyTile = !1;
                    resolve();
                }
                catch (error) {
                    reject(error);
                }
            }));
        });
    }
    public reward(): void {
        this.node.emit("mine-item-change-tile");
    }
    setInfo(e): void {
        this.spType = e.sp,
            this.tileType = e.tile,
            this.uniqueStart = e.unique,
            this.digCnt = e.digCnt,
            this.uniqueStart = e.unique,
            this.status = e.status,
            this.received = e.received,
            this.tileType == E_MINE_TILE_TYPE.eRock && 1 == this.digCnt && (this.crackSprite.node.active = true);
    }
    public async setSpSprite(e: E_MINE_SP_TYPE_TILE): Promise<void> {
        if (P.isNil(e) || e == E_MINE_SP_TYPE_TILE.eNone || this.received) {
            this.spSprite.spriteFrame = null;
            return;
        }
        const t = MINE_TILE_SPRITES[e];
        const n = MINE_IMAGE_URL_ + '/' + t;
        let o = AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, n);
        if (P.isNil(o)) {
            o = await AssetManager.Instance.loadSpriteFrame(NAMES_BUNDLE.Game, n);
        }
        this.spSprite.spriteFrame = o;
    }
    setSpType(e: number): void {
        this.spType = e;
        if (this.node.active) {
            this.refreshSp();
        }
    }
    async setTileSprite() {
        switch (this.tileType) {
            case E_MINE_TILE_TYPE.eEmpty:
                this.tileSprite.spriteFrame = null;
                this.tileSprite.node.width = MINE_TILE_SIZE.width;
                this.tileSprite.node.height = MINE_TILE_SIZE.height;
                break;
            case E_MINE_TILE_TYPE.eUnique1:
            case E_MINE_TILE_TYPE.eUnique2:
            case E_MINE_TILE_TYPE.eUnique3:
            case E_MINE_TILE_TYPE.eUnique4:
                if (0 == this.uniqueStart) {
                    let e: string = MINE_IMAGE_URL_ + "/mine_tile_unique_" + MINE_TILE_SIZES[this.tileType] + "_0" + this.uniqueStart;
                    let t: cc.SpriteFrame = AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, e);
                    if (P.isNil(t)) {
                        t = await AssetManager.Instance.loadSpriteFrame(NAMES_BUNDLE.Game, e) as any;
                    }
                    this.tileSprite.spriteFrame = t;
                    this.tileSprite.node.angle = 0;
                    this.tileSprite.node.width = MINE_TILE_SIZE.width * QuestDailyViewUI[this.tileType];
                    this.tileSprite.node.height = 2 * MINE_TILE_SIZE.height;
                    this.tileSprite.node.setAnchorPoint(0, 1);
                    this.tileSprite.node.position = cc.v3(-50, 50);
                }
                else {
                    this.tileSprite.spriteFrame = null;
                }
                break;
            case E_MINE_TILE_TYPE.eSoil:
                let e: string = MINE_IMAGE_URL_ + "/mine_tile_soil";
                let t: cc.SpriteFrame = AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, e);
                if (P.isNil(t)) {
                    t = await AssetManager.Instance.loadSpriteFrame(NAMES_BUNDLE.Game, e) as any;
                }
                this.tileSprite.spriteFrame = t;
                this.tileSprite.node.setAnchorPoint(.5, .5);
                this.tileSprite.node.position = cc.Vec3.ZERO;
                this.tileSprite.node.width = MINE_TILE_SIZE.width;
                this.tileSprite.node.height = MINE_TILE_SIZE.height;
                break;
            case E_MINE_TILE_TYPE.eRock:
                this.tileSprite.spriteFrame = null;
                e = MINE_IMAGE_URL_ + "/mine_tile_rock";
                t = AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, e);
                if (P.isNil(t)) {
                    t = await AssetManager.Instance.loadSpriteFrame(NAMES_BUNDLE.Game, e) as any;
                }
                this.tileSprite.spriteFrame = t;
                this.tileSprite.node.setAnchorPoint(.5, .5);
                this.tileSprite.node.position = cc.Vec3.ZERO;
                this.tileSprite.node.width = MINE_TILE_SIZE.width;
                this.tileSprite.node.height = MINE_TILE_SIZE.height;
                break;
        }
    }
    setTileType(e: number): void {
        if (this.tileType != e) {
            this.tileType = e;
            this.node.emit("mine-item-change-tile", this);
            if (this.node.active) {
                this.refreshTile();
            }
        }
    }
    setWatchs(e): void {
        let self = this;
        P.each(e, function (e, n) {
            self.addWatch(e, n);
        });
    }
    public showDimmed() {
        this.dimmedSprite.node.active = true;
    }
    public showSelect(e: boolean = false) {
        this.selectSprite.node.stopAllActions();
        this.selectSprite.node.color = e ? cc.Color.RED : cc.Color.GREEN;
        this.selectSprite.node.active = true;
        this.selectSprite.node.opacity = 255;
    }
    start() {
        if (6 == this._row && 1 == this._col && !this.node.getComponent(GuideTouch)) {
            let component: GuideTouch = this.node.addComponent(GuideTouch);
            this.scheduleOnce(() => {
                component.setId(SpecialGuideEnum.TouchMineItem),
                    GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchMineItem);
            }, 0.2);
        }
    }
    get col(): number {
        return this._col;
    }
    set col(value: number) {
        this._col = value;
        if (this.rowLabel) {
            this.rowLabel.string = `${this.row}-${this.col}`;
        }
    }
    get digCnt(): number {
        return this._digCnt;
    }
    set digCnt(value: number) {
        if (this._digCnt != value) {
            this._digCnt = value;
        }
    }
    get received(): boolean {
        return this._received;
    }
    set received(value: boolean) {
        if (this._received != value) {
            this._received = value;
        }
    }
    get row(): number {
        return this._row;
    }
    set row(value: number) {
        this._row = value;
        if (this.rowLabel) {
            this.rowLabel.string = `${this.row}-${this.col}`;
        }
    }
    get spType(): E_MINE_SP_TYPE_TILE {
        return this._spType;
    }
    set spType(value: E_MINE_SP_TYPE_TILE) {
        if (this._spType != value) {
            this._spType = value;
        }
    }
    get status() {
        return this._status;
    }
    set status(value) {
        if (this._status != value) {
            this._status = value;
            this.refreshStatus();
        }
    }
}
