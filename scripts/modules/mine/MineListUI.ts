import MineItemUI from "./MineItemUI";
import { MapUIPrefabs } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetPool from "../asset/AssetPool";
import { MINE_TILE_SIZE, MINE_BOTTOM_PREROW_COUNT, MINE_MAX_ROW_COUNT } from "../../ccstudio/data/MineModel";
const v: any = window["_"];
const { ccclass, property } = cc._decorator;
@ccclass
export default class MineListUI extends cc.Component {
    _moveDeepRunning: boolean = false;
    addMine = async function (e: number, t: number, n: any) {
        const o = this.getMine(e, t);
        if (o) {
            o.setInfo(n);
            return o;
        }
        const r = await this.createMineItem();
        r.setInfo(n);
        r.hideSelect();
        let i = this.mineItems[e];
        if (!i) {
            i = this.mineItems[e] = new Array(this.colCount);
        }
        i[t] = r;
        r.node.x = this.contentLeftTop.x + (t + 0.5) * MINE_TILE_SIZE.width;
        r.node.y = this.contentLeftTop.y - (e + 0.5) * MINE_TILE_SIZE.height;
        r.row = e;
        r.col = t;
        const a = t - 1;
        const c = t + 1;
        const l = e - 1;
        const u = this.getMine(l, a);
        r.addWatch(u, 0);
        u && u.addWatch(r, 4);
        const f = this.getMine(l, t);
        r.addWatch(f, 1);
        f && f.addWatch(r, 5);
        const d = this.getMine(l, c);
        r.addWatch(d, 2);
        d && d.addWatch(r, 6);
        const h = this.getMine(e, a);
        r.addWatch(h, 7);
        h && h.addWatch(r, 3);
        return r;
    };
    addRowMines = async function (e: number, t: Array<any>) {
        for (let n = 0; n < t.length; n++) {
            await this.addMine(e, n, t[n]);
        }
        return this.getRowMine(e);
    };
    colCount: number = 6;
    @property(cc.Node)
    content: cc.Node = null;
    contentLeftTop: cc.Vec2 = null;
    createMineItem = async function () {
        const e = await AssetPool.Instance.createObjAsync(NAMES_BUNDLE.Game, MapUIPrefabs.MineItem.path);
        e.parent = this.content;
        return e.getComponent(MineItemUI);
    };
    delegate: any = null;
    dragThreshold: number = 40;
    editMode: boolean = false;
    isDragging: boolean = false;
    lastTouchMoveItem: MineItemUI = null;
    mineItems: MineItemUI[][] = [];
    rowCount: number = 7;
    @property(sp.Skeleton)
    sp: sp.Skeleton = null;
    touchStartPos: cc.Vec2 = null;
    getBottomRow() {
        return this.mineItems.length - MINE_BOTTOM_PREROW_COUNT;
    }
    getColMines(e: number, t = true) {
        const n = [];
        let o = this.mineItems.length - this.rowCount;
        let r = o + this.rowCount;
        if (t) {
            r = (o = this.getTopRow()) + 7;
        }
        for (let i = o; i < r; i++) {
            const a = this.getRowMine(i);
            if (!v.isNil(a) && a.length > 0) {
                n.push(a[e]);
            }
        }
        return n;
    }
    getLastRowMines() {
        return v.last(this.mineItems);
    }
    getLocationItem(e: cc.Vec2) {
        const t = this.node.convertToNodeSpaceAR(e);
        const n = Math.floor(this.content.y) / MINE_TILE_SIZE.height + Math.floor((this.contentLeftTop.y - t.y) / MINE_TILE_SIZE.height);
        const o = Math.floor((t.x - this.contentLeftTop.x) / MINE_TILE_SIZE.width);
        return this.getMine(n, o);
    }
    getMine(e: number, t: number) {
        if (e < 0 || t < 0) {
            return null;
        }
        if (t >= this.colCount) {
            return null;
        }
        const n = this.mineItems[e];
        return n ? n[t] : null;
    }
    getRowMine(e: number) {
        return this.mineItems[e];
    }
    getTopRow() {
        return this.mineItems.length - MINE_BOTTOM_PREROW_COUNT - 7;
    }
    isInVisible(e: any) {
        return this.mineItems.length - e.row > 3 && e.row >= this.mineItems.length - MINE_MAX_ROW_COUNT + 1;
    }
    async moveDeep(e: number) {
        this._moveDeepRunning = true;
        await new Promise((n) => {
            cc.tween(this.content).parallel(cc.tween().by(0.44, { y: MINE_TILE_SIZE.height }), cc.tween().by(0.1, { x: 8 }).by(0.1, { x: -8 }).delay(0.02).by(0.11, { x: 5 }).by(0.11, { x: -5 })).union().repeat(e).call(() => {
                n(null);
                this._moveDeepRunning = false;
            }).start();
        });
    }
    onDisable() {
        this.unregisterEvent();
    }
    onEnable() {
        this.registerEvent();
        if (this.sp) {
            this.sp.enabled = false;
        }
    }
    onTouchEndHandler() {
        this.lastTouchMoveItem = null;
        this.touchStartPos = null;
        this.isDragging = false;
    }
    onTouchMoveHandler(e: cc.Event.EventTouch) {
        if (!this._moveDeepRunning) {
            const t = e.getLocation();
            if (!this.isDragging && this.dragThreshold !== 0) {
                if (cc.Vec2.distance(this.touchStartPos, t) < this.dragThreshold) {
                    return;
                }
                this.isDragging = true;
            }
            const n = this.getLocationItem(e.getLocation());
            if (n != this.lastTouchMoveItem) {
                this.lastTouchMoveItem = n;
                if (this.delegate.onTouchMoveToItem) {
                    this.delegate.onTouchMoveToItem(n);
                }
            }
        }
    }
    onTouchStartHandler(e: cc.Event.EventTouch) {
        if (!this._moveDeepRunning) {
            this.touchStartPos = e.getLocation();
            const t = this.getLocationItem(e.getLocation());
            if (t) {
                this.delegate.onTouchItem(t);
            }
        }
    }
    registerEvent() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStartHandler, this);
        if (this.editMode) {
            this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoveHandler, this);
            this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEndHandler, this);
            this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEndHandler, this);
        }
    }
    removeTopMines() {
        for (let e = this.mineItems.length - this.rowCount; e >= 0; e--) {
            const t = this.mineItems[e];
            if (!t || 0 == t.length)
                break;
            v.each(t, e => {
                e.clear();
                AssetPool.Instance.put(e);
            });
            this.mineItems[e].length = 0;
        }
    }
    // private editMode: boolean;
    // private rowCount: number;
    // private colCount: number;
    // private contentLeftTop: cc.Vec2;
    setEditMode(e: boolean) {
        this.editMode = e;
    }
    async setMine(e: any, t: number, n: number) {
        let o = this.getMine(t, n);
        if (!o) {
            o = await this.createMineItem();
            this.mineItems[t][n] = o;
            o.node.x = this.contentLeftTop.x + (n + 0.5) * MINE_TILE_SIZE.width;
            o.node.y = this.contentLeftTop.y - (t + 0.5) * MINE_TILE_SIZE.height;
            o.row = t,
                o.col = n;
        }
        o.setTileType(e.tile);
        o.setSpType(e.sp);
        o.uniqueStart = e.unique;
        return o;
    }
    // @property(cc.Node)
    // content: cc.Node = null;
    // @property(sp.Skeleton)
    // sp: sp.Skeleton = null;
    setToDeep(e: number) {
        this.content.y = e * MINE_TILE_SIZE.height;
    }
    setUICount(e: number, t: number) {
        this.rowCount = e;
        this.colCount = t;
        let n = -MINE_TILE_SIZE.width * this.colCount * 0.5;
        let o = MINE_TILE_SIZE.height * (this.rowCount - (MINE_BOTTOM_PREROW_COUNT - 1)) * 0.5;
        if (this.editMode) {
            o = MINE_TILE_SIZE.height * this.rowCount * 0.5;
        }
        this.contentLeftTop = cc.v2(n, o);
    }
    unregisterEvent() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStartHandler, this);
        if (this.editMode) {
            this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoveHandler, this);
            this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEndHandler, this);
            this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEndHandler, this);
        }
    }
}
