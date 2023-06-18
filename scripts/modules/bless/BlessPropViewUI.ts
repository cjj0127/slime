import BlessData from "./BlessData";
import { EOpenUIType, EInsertAdType } from "../common/ViedioType";
import _BlessTypeConfig from "../../ccstudio/config/_BlessTypeConfig";
import AdsModel from "../../ccstudio/data/AdsModel";
import Model from "../../ccstudio/data/Model";
import ViewAnimCtrl from "../../ccstudio/display/ViewAnimCtrl";
const { ccclass, property } = cc._decorator;
@ccclass
export default class BlessPropViewUI extends cc.Component {
    @property(cc.Button)
    btnClose: cc.Button = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    itemPrefeb: cc.Prefab = null;
    loadBelssCfgData() {
        const cfg = _BlessTypeConfig.Instance.cfg;
        for (const key in cfg) {
            const node = cc.instantiate(this.itemPrefeb);
            node.parent = this.content;
            const component = node.getComponent("BlessPropItemUI");
            if (component) {
                const data = BlessData.Instance.getData(cfg[key].type);
                component.init(data);
            }
        }
    }
    onClickClose() {
        Model.ad.showInterstitial(EInsertAdType.UICloseAd, EOpenUIType.Bless);
        this.getComponent(ViewAnimCtrl).onClose();
    }
    onDisable() {
        cc.director.targetOff(this);
        Model.ad.hideBanner();
    }
    onEnable() {
        this.btnClose.node.on("click", this.onClickClose, this);
        Model.ad.showBanner(EOpenUIType.Bless);
    }
    start() {
        this.loadBelssCfgData();
    }
}
