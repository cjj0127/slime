import MineModel, { E_MINE_TILE_STATUS, E_MINE_TILE_TYPE, MINE_MAX_COL_COUNT, MINE_BOTTOM_PREROW_COUNT, E_MINE_SP_TYPE_TILE } from "../../ccstudio/data/MineModel";
import Model from "../../ccstudio/data/Model";
const p: any = window["_"];
const { ccclass, property } = cc._decorator;
@ccclass
export default class MineDigToolUI extends cc.Component {
    appendRows = async function (e) {
        const t = Model.mine.openDataDeep - 1 - e;
        if (t >= MINE_BOTTOM_PREROW_COUNT) {
            return;
        }
        const n = MINE_BOTTOM_PREROW_COUNT - t;
        const o = p.clone(this.mineList.getLastRowMines());
        for (let r = 1; r <= n; r++) {
            const i = Model.mine.openDataDeep;
            const a = await Model.mine.addRowToBottom();
            const l = await this.mineList.addRowMines(i, a);
            o.push(...l);
        }
        p.each(o, (e) => {
            e.priteInfo();
            e.refreshTile();
            e.refreshStatus();
            e.refreshSp();
        });
        await this.mineList.moveDeep(n);
        this.mineList.removeTopMines();
        Model.mine.removeTopRow();
    };
    inDig = false;
    @property
    mineList = null;
    setMineList = function (e) {
        this.mineList = e;
        return this;
    };
    trySeachAround = function (e, t) {
        const o = [];
        const r = Model.mine.getInfo(e, t);
        if (r.status == E_MINE_TILE_STATUS.EOpen && (r.tile == E_MINE_TILE_TYPE.eEmpty || r.tile >= E_MINE_TILE_TYPE.eUnique1 || r.received)) {
            Model.mine.seachAround(e, t, o);
        }
        p.each(o, (e) => {
            const t = e.row;
            const o = e.col;
            const r = Model.mine.getInfo(t, o);
            const i = this.mineList.getMine(t, o);
            i.status = r.status;
            i.setTileType(r.tile);
            i.refreshSp();
        });
        return o;
    };
    digEnable(e) {
        return false;
    }
    async digItem(e) {
        if (this.inDig) {
            return;
        }
        if (!this.digEnable(e)) {
            return;
        }
        this.inDig = true;
        await this.onDigItem(e);
        this.inDig = false;
    }
    async onDigItem(e: any) {
        return null;
    }
    openDigItem(e: {
        row: number;
        col: number;
        digCnt: number;
        status: number;
        received: boolean;
        setTileType: any;
        refreshSp: any;
        node: cc.Node;
    }) {
        const { row, col } = e;
        const o = Model.mine.getInfo(row, col);
        e.digCnt = o.digCnt;
        e.status = o.status;
        e.received = o.received;
        e.setTileType(o.tile);
        e.refreshSp();
        if (o.received) {
            const r = e.node.convertToWorldSpaceAR(cc.Vec3.ZERO);
            if (o.sp !== E_MINE_SP_TYPE_TILE.eNone) {
                Model.mine.sendRewards(o, r);
            }
        }
    }
    trySeachNextRow(e, i) {
        const n = [];
        for (let o = 0; o < MINE_MAX_COL_COUNT; o++) {
            const r = Model.mine.getInfo(e, o);
            if (r.status == E_MINE_TILE_STATUS.EOpen && (r.tile == E_MINE_TILE_TYPE.eEmpty || r.tile >= E_MINE_TILE_TYPE.eUnique1 || r.received)) {
                Model.mine.seachNextRow(e, o, n);
            }
        }
        p.each(n, (e) => {
            const o = e.row;
            const r = e.col;
            const i = Model.mine.getInfo(o, r);
            const a = this.mineList.getMine(o, r);
            a.status = i.status;
            a.setTileType(i.tile);
            a.refreshSp();
        });
        return n.length > 0;
    }
}
