import ListViewAdapter from "./ListViewAdapter";
const { ccclass, property } = cc._decorator;
@ccclass
export default class ListView extends cc.Component {
    _filledIds = {};
    _isInited = false;
    _itemHeight = 1;
    _itemWidth = 1;
    _items = new cc.NodePool();
    _itemsVisible = 1;
    adapter: ListViewAdapter = null;
    @property
    column: number = 1;
    content: cc.Node = null;
    dataChanged = false;
    horizontal = false;
    @property(cc.Prefab)
    itemTemplate: cc.Prefab = null;
    @property(cc.Rect)
    margin: cc.Rect = cc.rect(0, 0, 0, 0);
    pullDownCallback = null;
    pullUpCallback = null;
    scrollBottomNotifyed = false;
    scrollTopNotifyed = false;
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    @property(cc.Vec2)
    spacing: cc.Vec2 = cc.v2(0, 0);
    @property
    spawnCount: number = 2;
    visibleRange = [-1, -1];
    _layoutHorizontal(e, t) {
        const n = t % (this.column || 1);
        const o = Math.floor(t / (this.column || 1));
        e.setPosition(e.width * (e.anchorX + o) + this.spacing.x * o + this.margin.x, this.column > 1 ?
            -1 * (this.margin.y + e.height * e.anchorY + (e.height + this.spacing.y) * n - this.content.height * this.content.anchorY) :
            0);
    }
    private _layoutVertical(e, t) {
        let n = t % (this.column || 1);
        let o = Math.floor(t / (this.column || 1));
        e.setPosition(this.column > 1 ? this.margin.x + e.width * e.anchorX + (e.width + this.spacing.x) * n - this.content.width * this.content.anchorX : 0, -this.margin.y - e.height * (e.anchorY + o) - this.spacing.y * o);
    }
    checkNeedUpdate(e) {
        return e && this.visibleRange && (this.visibleRange[0] !== e[0] || this.visibleRange[1] !== e[1]);
    }
    public getAdapter() {
        return this.adapter;
    }
    public getColumnWH() {
        return this.horizontal ? this._itemWidth + this.spacing.x : this._itemHeight + this.spacing.y;
    }
    public getItems() {
        return this._filledIds;
    }
    public getMatchItem(e) {
        let t = null;
        for (let n in this._filledIds) {
            if (Object.prototype.hasOwnProperty.call(this._filledIds, n)) {
                let o = this._filledIds[n];
                if (o && e(o)) {
                    t = o;
                    break;
                }
            }
        }
        return t;
    }
    public getScrollView() {
        return this.scrollView;
    }
    public getVisibleElements() {
        let e = 0;
        if (this.horizontal) {
            let t = this.content.parent.width;
            e = Math.floor(t / this.getColumnWH());
        }
        else {
            let n = this.content.parent.height;
            e = Math.floor(n / this.getColumnWH());
        }
        return e * this.column;
    }
    getVisibleRange() {
        if (this.adapter == null) {
            return null;
        }
        const e = this.scrollView.getScrollOffset();
        let t = 0;
        if (this.horizontal) {
            t = Math.floor(-e.x / (this._itemWidth + this.spacing.x));
        }
        else {
            t = Math.floor(e.y / (this._itemHeight + this.spacing.y));
        }
        if (t < 0) {
            t = 0;
            if (!this.scrollTopNotifyed) {
                this.notifyScrollToTop();
                this.scrollTopNotifyed = true;
                this.scrollBottomNotifyed = true;
            }
        }
        let n = this.column * (t + this._itemsVisible + this.spawnCount);
        if (n >= this.adapter.getCount()) {
            n = this.adapter.getCount() - 1;
            if (!this.scrollBottomNotifyed) {
                this.notifyScrollToBottom();
                this.scrollBottomNotifyed = true;
            }
        }
        return [t * this.column, n];
    }
    init() {
        if (!this._isInited) {
            this._isInited = true;
            if (this.scrollView) {
                this.content = this.scrollView.content;
                this.horizontal = this.scrollView.horizontal;
                if (this.horizontal) {
                    this.scrollView.vertical = false;
                    this.content.anchorX = 0;
                    this.content.anchorY = this.content.parent.anchorY;
                    this.content.x = 0 - this.content.parent.width * this.content.parent.anchorX;
                    this.content.y = 0;
                }
                else {
                    this.scrollView.vertical = true;
                    this.content.anchorX = this.content.parent.anchorX;
                    this.content.anchorY = 1;
                    this.content.x = 0;
                    this.content.y = this.content.parent.height * this.content.parent.anchorY;
                }
            }
            else {
                cc.error("ListView need a scrollView for showing.");
            }
            const e = this._items.get() || cc.instantiate(this.itemTemplate);
            this._items.put(e);
            this._itemHeight = e.height || 10;
            this._itemWidth = e.width || 10;
            if (this.horizontal) {
                this._itemsVisible = Math.ceil((this.content.parent.width - this.margin.x - this.margin.width) / (this._itemWidth + this.spacing.x));
            }
            else {
                this._itemsVisible = Math.ceil((this.content.parent.height - this.margin.y - this.margin.height) / (this._itemHeight + this.spacing.y));
            }
        }
    }
    public lateUpdate() {
        let e = this.getVisibleRange();
        if (this.checkNeedUpdate(e)) {
            this.recycleDirty(e);
            this.updateView(e);
        }
    }
    notifyScrollToBottom() {
        if (this.adapter == null || this.adapter.getCount() <= 0) {
            return;
        }
        if (this.pullUpCallback) {
            this.pullUpCallback();
        }
    }
    notifyScrollToTop() {
        if (this.adapter == null || this.adapter.getCount() <= 0) {
            return;
        }
        if (this.pullDownCallback) {
            this.pullDownCallback();
        }
    }
    public notifyUpdate() {
        if (this.adapter !== null) {
            if (this._isOnLoadCalled || this.init()) {
                if (this.scrollView && this.content) {
                    this.recycleAll();
                    this.visibleRange[0] = this.visibleRange[1] = -1;
                    if (this.horizontal) {
                        this.content.width = Math.ceil(this.adapter.getCount() / this.column) * (this._itemWidth + this.spacing.x) - this.spacing.x + this.margin.x + this.margin.width;
                        this.content.width = Math.max(this.content.width, this.content.parent.width);
                    }
                    else {
                        this.content.height = Math.ceil(this.adapter.getCount() / this.column) * (this._itemHeight + this.spacing.y) - this.spacing.y + this.margin.y + this.margin.height;
                        this.content.height = Math.max(this.content.height, this.content.parent.height);
                    }
                    this.dataChanged = true;
                }
            }
        }
    }
    public onDestroy() {
        this._items.clear();
        this._filledIds = {};
    }
    public onLoad() {
        this.init();
        if (this.scrollView) {
            this.scrollView.node.on("scroll-began", () => {
                this.scrollTopNotifyed = false;
                this.scrollBottomNotifyed = false;
            });
        }
    }
    public pullDown(e, t) {
        this.pullDownCallback = e.bind(t);
    }
    public pullUp(e, t) {
        this.pullUpCallback = e.bind(t);
    }
    recycleAll() {
        for (const e in this._filledIds) {
            if (this._filledIds.hasOwnProperty(e)) {
                this._items.put(this._filledIds[e]);
            }
        }
        this._filledIds = {};
    }
    recycleDirty(e) {
        if (e && !(e.length < 2)) {
            for (let t = this.visibleRange[0]; t < e[0]; t++) {
                if (t < 0 || !this._filledIds[t]) {
                    continue;
                }
                this._items.put(this._filledIds[t]);
                this._filledIds[t] = null;
            }
            for (let n = this.visibleRange[1]; n > e[1]; n--) {
                if (n < 0 || !this._filledIds[n]) {
                    continue;
                }
                this._items.put(this._filledIds[n]);
                this._filledIds[n] = null;
            }
            this.visibleRange[0] = e[0];
            this.visibleRange[1] = e[1];
        }
    }
    public scrollToPage(e, t, n) {
        if (!this.adapter || !this.scrollView) {
            return false;
        }
        if (this.horizontal) {
            let o = 0;
            let r = this.content.width;
            let i = this.getColumnWH();
            if (t) {
                o = i * t;
            }
            else {
                let a = this.content.parent.width;
                o = Math.floor(a / i) * i;
            }
            this.scrollView.scrollToOffset(cc.v2(o * e, 0), n);
            return o * (e + 1) >= r;
        }
        let s = this.content.height;
        let c = this.getColumnWH();
        let l = 0;
        if (t) {
            l = c * t;
        }
        else {
            let u = this.content.parent.height;
            l = Math.floor(u / c) * c;
        }
        this.scrollView.scrollToOffset(cc.v2(0, l * e), n);
        return l * (e + 1) >= s;
    }
    public async setAdapter(e): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.adapter == e) {
                this.notifyUpdate();
                resolve();
            }
            else {
                this.adapter = e;
                if (this.adapter == null) {
                    cc.warn("adapter 为空.");
                    resolve();
                }
                else if (this.itemTemplate == null) {
                    cc.error("Listview 未设置待显示的Item模板.");
                    resolve();
                }
                else {
                    this.visibleRange[0] = this.visibleRange[1] = -1;
                    this.notifyUpdate();
                    resolve();
                }
            }
        });
    }
    updateView(e) {
        for (let t = e[0]; t <= e[1]; t++) {
            if (this.dataChanged || !this._filledIds[t]) {
                let n = this._filledIds[t];
                if (!n) {
                    n = this._items.get() || cc.instantiate(this.itemTemplate);
                    this.content.addChild(n);
                }
                if (this.horizontal) {
                    this._layoutHorizontal(n, t);
                }
                else {
                    this._layoutVertical(n, t);
                }
                this._filledIds[t] = this.adapter._getView(n, t);
            }
        }
        this.dataChanged = false;
    }
}
