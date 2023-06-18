import CollectionData from "./CollectionData";
import { EOpenUIType, EInsertAdType } from "../common/ViedioType";
import { GlobalEventName } from "../common/Events";
import _CollectionConfig from "../../ccstudio/config/_CollectionConfig";
import AdsModel from "../../ccstudio/data/AdsModel";
import Model from "../../ccstudio/data/Model";
import CollectionListItemUI from "./CollectionListItemUI";
import CollectionToggleUI from "./CollectionToggleUI";
import UIPool from "../common/UIPool";
import ViewAnimCtrl from "../../ccstudio/display/ViewAnimCtrl";
const { ccclass, property } = cc._decorator;
const _: any = window["_"];
@ccclass
export default class CollectionViewUI extends UIPool {
    @property(cc.Button)
    btnClose = null;
    currType = null;
    @property(cc.Layout)
    layout = null;
    list: any = {};
    @property(cc.ScrollView)
    scrollView = null;
    @property(cc.ToggleContainer)
    toggleContainer = null;
    onClickClose() {
        Model.ad.showInterstitial(EInsertAdType.UICloseAd, EOpenUIType.Collection);
        this.getComponent(ViewAnimCtrl).onClose();
    }
    onCollectionLvup() {
        const enableItems = CollectionData.Instance.getLvupEnableItems(this.currType);
        const firstItem = _.first(enableItems);
        if (firstItem) {
            const keys = _.keys(this.list);
            const index = 1 - _.findIndex(keys, (key) => parseInt(key) == firstItem.id) / (keys.length - 1);
            this.scrollView.scrollToPercentVertical(index, 0.2);
        }
    }
    onDisable() {
        this.currType = null;
        cc.director.targetOff(this);
        Model.ad.hideBanner();
    }
    onEnable() {
        cc.director.on(GlobalEventName.CollectionLvup, this.onCollectionLvup, this);
        this.btnClose.node.on("click", this.onClickClose, this);
        Model.ad.showBanner(EOpenUIType.Collection);
    }
    onLoad() {
        const t = this.toggleContainer.toggleItems;
        _.each(t, (toggleItem) => {
            toggleItem.getComponent(CollectionToggleUI).delegate = this;
        });
    }
    onToggle(e: any) {
        this.setType(e);
    }
    refreshList() {
        this.clear();
        this.list = {};
        const collections = _CollectionConfig.Instance.getTypeCollections(this.currType);
        _.each(collections, (collection) => {
            const item = this.get();
            item.parent = this.layout.node;
            const component = item.getComponent(CollectionListItemUI);
            component.setCollectionId(collection.id);
            this.list[collection.id] = component;
        });
        const enableItems = CollectionData.Instance.getLvupEnableItems(this.currType);
        const firstItem = _.first(enableItems);
        if (firstItem) {
            const index = 1 - _.findIndex(_.keys(this.list), (key) => parseInt(key) == firstItem.id) / (collections.length - 1);
            this.scrollView.scrollToPercentVertical(index, 0.2);
        }
        else {
            this.scrollView.scrollToPercentVertical(1, 0);
        }
    }
    setType(e: any) {
        if (this.currType !== e) {
            this.currType = e;
            this.refreshList();
        }
    }
}
