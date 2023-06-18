import LanMgr from "../common/Language";
import UIPool from "../common/UIPool";
import TeasureCollectionItemRelicInfoUI from "./TeasureCollectionItemRelicInfoUI";
import { _TREASURE_TYPE_NAME } from "../common/Const";
import _TeasureConfig from "../../ccstudio/config/_TeasureConfig";
// import TeasureCollectionItemRelicInfoUI from "TeasureCollectionItemRelicInfoUI";
const { ccclass, property } = cc._decorator;
@ccclass
export default class TeasureCollectionItemUI extends UIPool {
    private _typeId: number = 0;
    @property(cc.Button)
    btnOpen: cc.Button = null;
    @property
    closeHeight: number = 0;
    @property(cc.Layout)
    contentLayout: cc.Layout = null;
    private itemInfos: any[] = [];
    @property
    openHeight: number = 0;
    // private rootLayout: cc.Layout;
    // private closeHeight: number;
    // private openHeight: number;
    private openList: boolean = false;
    @property(cc.Layout)
    rootLayout: cc.Layout = null;
    @property(cc.Label)
    typeName: cc.Label = null;
    private createItems() {
        const e = _TeasureConfig.Instance.getTypeIds(this.typeId);
        for (let t = 0; t < 4; t++) {
            const n = this.get();
            const o = n.getComponent(TeasureCollectionItemRelicInfoUI);
            this.itemInfos.push(o);
            const r = e[t];
            o.teasureId = r;
            n.parent = this.contentLayout.node;
        }
    }
    // private itemInfos: Array<TeasureCollectionItemRelicInfoUI> = [];
    // @property(cc.Label)
    // private typeName: cc.Label = null;
    // @property(cc.Layout)
    // private contentLayout: cc.Layout = null;
    // @property(cc.Button)
    // private btnOpen: cc.Button = null;
    onLoad() {
        this.rootLayout = this.node.getComponent(cc.Layout);
        this.closeHeight = this.node.height;
        this.createItems();
        this.contentLayout.enabled = true;
        this.contentLayout.updateLayout();
        this.contentLayout.enabled = false;
        this.rootLayout.enabled = true;
        this.rootLayout.updateLayout();
        this.rootLayout.enabled = false;
        this.openHeight = this.node.height;
        this.btnOpen.target.angle = this.openList ? 180 : 0;
        this.btnOpen.node.on("click", this.openListView, this);
    }
    private openListView() {
        this.openList = !this.openList;
        this.btnOpen.target.angle = this.openList ? 180 : 0;
        this.contentLayout.node.active = this.openList;
        this.rootLayout.enabled = true;
        this.rootLayout.updateLayout();
        this.rootLayout.enabled = false;
        this.node.height = this.openList ? this.openHeight : this.closeHeight;
    }
    private setNameStr(e: string) {
        this.typeName.string = e;
    }
    start() {
        this.setNameStr(LanMgr.Instance.getLangByID(_TREASURE_TYPE_NAME[this.typeId] || ""));
    }
    set typeId(value) {
        this._typeId = value;
    }
    get typeId() {
        return this._typeId;
    }
}
// cc.Class.decorate([
//     property(cc.Label),
//     __metadata("design:type", cc.Label)
// ], t.prototype, "typeName", void 0);
// cc.Class.decorate([
//     property(cc.Layout),
//     __metadata("design:type", cc.Layout)
// ], t.prototype, "contentLayout", void 0);
// cc.Class.decorate([
//     property(cc.Button),
//     __metadata("design:type", cc.Button)
// ], t.prototype, "btnOpen", void 0);
// cc.Class.decorate([_decorator.ccclass], t);
// n.default = h;
