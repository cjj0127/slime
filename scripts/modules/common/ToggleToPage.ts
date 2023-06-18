export enum PAGE_EVENTS {
    PageEnter = "page-enter",
    PageExit = "page-exit",
    PageToIdx = "page-to-index"
}
;
const { ccclass, property } = cc._decorator;
@ccclass
export default class ToggleToPage extends cc.Component {
    static PAGE_EVENTS = {
        PageEnter: "page-enter",
        PageExit: "page-exit",
        PageToIdx: "page-to-index"
    };
    __customScrollToPage: any = null;
    @property({ type: cc.Integer })
    private _defaultPageIdx: number = 0;
    currIdx: number = -1;
    @property()
    enableAutoCheckPage: boolean = false;
    @property({ type: cc.PageView })
    pageView: cc.PageView = null;
    @property({ type: cc.ToggleContainer })
    toggleContainer: cc.ToggleContainer = null;
    @property()
    touchScrollPage: boolean = true;
    private _onPageTurning() {
        const e = this.pageView.getCurrentPageIndex();
        this._toggleToIdx(e);
        this._pageEventToIdx(e);
    }
    private _onToggle(e: cc.Toggle) {
        if (e.isChecked) {
            const t = this.toggleContainer.toggleItems.indexOf(e);
            if (this.currIdx !== t) {
                if (this.__customScrollToPage) {
                    this.__customScrollToPage(this.currIdx, t);
                }
                else {
                    this._scrollToPage(t);
                }
                this._pageEventToIdx(t);
            }
            else {
                this.node.emit(PAGE_EVENTS.PageToIdx, this.currIdx);
            }
        }
    }
    private _pageEventToIdx(e: number) {
        const t = this.pageView.getPages();
        const o = t[this.currIdx];
        if (o) {
            o.emit(PAGE_EVENTS.PageExit);
            o.active = false;
        }
        this.currIdx = e;
        const n = t[this.currIdx];
        if (n) {
            n.active = true;
            n.emit(PAGE_EVENTS.PageEnter);
        }
        this.node.emit(PAGE_EVENTS.PageToIdx, this.currIdx);
    }
    private _scrollToPage(e: number, t?: number) {
        t = t !== undefined ? t : this.pageView.pageTurningSpeed;
        this.pageView.scrollToPage(e, t);
    }
    private _toggleToIdx(e: number) {
        const t = this.toggleContainer.toggleItems[e];
        if (t) {
            t.check();
        }
    }
    checked(e: number, t: number) {
        if (this.currIdx !== e) {
            this._toggleToIdx(e);
            this._scrollToPage(e, t);
            this._pageEventToIdx(e);
        }
    }
    getPage(e: number) {
        return this.pageView.getPages()[e];
    }
    getPageView() {
        return this.pageView;
    }
    getPages() {
        return this.pageView.getPages();
    }
    getToggleContainer() {
        return this.toggleContainer;
    }
    onDisable() {
        const e = this.getPage(this.currIdx);
        if (e) {
            e.emit(PAGE_EVENTS.PageExit);
        }
    }
    onEnable() {
        this.scheduleOnce(() => {
            const t = this.pageView.getPages();
            t.forEach(e => {
                e.active = false;
            });
            if (!this.touchScrollPage) {
                //@ts-ignore
                this.pageView._unregisterEvent();
            }
            if (this.enableAutoCheckPage && this._defaultPageIdx >= 0) {
                this._toggleToIdx(this._defaultPageIdx);
                this._pageEventToIdx(this._defaultPageIdx);
                this._scrollToPage(this._defaultPageIdx);
            }
        });
    }
    // toggleContainer: cc.ToggleContainer = null;
    // pageView: cc.PageView = null;
    // touchScrollPage: boolean = false;
    // enableAutoCheckPage: boolean = false;
    // private __customScrollToPage: Function = null;
    // private currIdx: number = 0;
    // private _defaultPageIdx: number = 0;
    onLoad() {
        const e = this.toggleContainer.toggleItems;
        for (let t = 0; t < e.length; t++) {
            e[t].node.on("toggle", this._onToggle, this);
        }
        if (this.touchScrollPage) {
            this.pageView.node.on("page-turning", this._onPageTurning, this);
        }
    }
    setCustomScrollToPage(e: Function) {
        this.__customScrollToPage = e;
    }
    setDefaultCheckedIdx(e: number = 0) {
        this._defaultPageIdx = e;
    }
    start() {
        const e = this.toggleContainer.toggleItems;
        if (e.length != this.pageView.getPages().length) {
            cc.error("this.toggle count != pageView.pages count !!!!", e.length, this.pageView.getPages().length);
        }
    }
}
