import LanMgr from "../common/Language";
import _SummonWidgetConfig from "../../ccstudio/config/_SummonWidgetConfig";
import SummonRateItemUI from "./SummonRateItemUI";
const { ccclass, property } = cc._decorator;
// import { ccclass, property } from cc._decorator;
@ccclass
export default class SummonRatePage extends cc.Component {
    private defaultPageIndex: number = -1;
    @property(cc.Button)
    leftBtn: cc.Button = null;
    @property(cc.Label)
    levelText: cc.Label = null;
    @property(cc.PageView)
    pageView: cc.PageView = null;
    @property(cc.Button)
    rightBtn: cc.Button = null;
    @property(cc.Prefab)
    summonRateItemPrefeb: cc.Prefab = null;
    initData(index: number) {
        this.defaultPageIndex = index - 1;
        this.refreshUi();
    }
    onLoad() {
        this.leftBtn.node.on("click", this.onPageUp, this);
        this.rightBtn.node.on("click", this.onPageDown, this);
        this.pageView.node.on("page-turning", this.onPageTurning, this);
    }
    onPageDown() {
        const currentPageIndex = this.pageView.getCurrentPageIndex();
        console.log("onPageDown=", currentPageIndex, this.pageView.getPages().length);
        const pageIndex = currentPageIndex + 1;
        if (pageIndex < this.pageView.getPages().length) {
            this.pageView.scrollToPage(pageIndex, 0.1);
            this.setLevelText(pageIndex + 1);
        }
        this.showPageBtn();
    }
    onPageTurning() {
        const currentPageIndex = this.pageView.getCurrentPageIndex();
        this.setLevelText(currentPageIndex + 1);
    }
    onPageUp() {
        const currentPageIndex = this.pageView.getCurrentPageIndex();
        console.log("onPageUp=", currentPageIndex);
        const pageIndex = currentPageIndex - 1;
        if (pageIndex >= 0) {
            this.pageView.scrollToPage(pageIndex, 0.1);
            this.setLevelText(pageIndex + 1);
        }
        this.showPageBtn();
    }
    refreshUi() {
        const maxLevel = _SummonWidgetConfig.Instance.maxLevel();
        const pages = this.pageView.getPages();
        for (let i = 0; i < maxLevel; i++) {
            if (!pages[i]) {
                const summonRateItemNode = cc.instantiate(this.summonRateItemPrefeb);
                const level = i + 1;
                summonRateItemNode.getComponent(SummonRateItemUI).init(level);
                this.pageView.insertPage(summonRateItemNode, i);
            }
        }
        this.pageView.scrollToPage(this.defaultPageIndex, 0.1);
        this.setLevelText(this.defaultPageIndex + 1);
        this.showPageBtn();
    }
    setLevelText(level: number) {
        this.levelText.string =
            LanMgr.Instance.getLangByID("Level") + level.toString();
    }
    showPageBtn() {
        const currentPageIndex = this.pageView.getCurrentPageIndex();
        this.leftBtn.node.active = currentPageIndex > 0;
        this.rightBtn.node.active =
            currentPageIndex < this.pageView.getPages().length - 1;
    }
    start() { }
}
