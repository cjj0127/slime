import GuideMgr from "../guide/GuideMgr";
import { SpecialGuideEnum } from "../guide/GuideEnums";
import ListView from "../../ccstudio/display/ListView";
import ListViewAdapter from "../../ccstudio/display/ListViewAdapter";
import RobModel from "../../ccstudio/data/RobModel";
import Model from "../../ccstudio/data/Model";
import PlunderLevel from "../common/PlunderLevel";
import RobExpRewardItemUI from "./RobExpRewardItemUI";
import ViewAnimCtrl from "../../ccstudio/display/ViewAnimCtrl";
const { ccclass, property } = cc._decorator;
@ccclass
export default class RobExpRewardViewUI extends ListViewAdapter {
    @property(cc.Button)
    btnClose: cc.Button = null;
    @property(ListView)
    listView: ListView = null;
    onClickClose() {
        this.getComponent(ViewAnimCtrl).onClose();
    }
    onDisable() {
        cc.director.targetOff(this);
        GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchAchieveReward);
    }
    onEnable() {
        this.refreshList();
        this.btnClose.node.on("click", this.onClickClose, this);
        GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchCloseRewardButton);
        Model.rob.setShowRobReward();
    }
    onLoad() {
        this.listView.setAdapter(this);
    }
    async refreshList() {
        const keys = Object.keys(PlunderLevel.Instance.getAll());
        this.setDataSet(keys);
        this.listView.notifyUpdate();
        const t = Model.rob.getRobDataInfo();
        const n = t.robLevel;
        const o = keys.length;
        let r = 1 - (n - 2) / o;
        if (r < 0 || r > 1) {
            r = 1;
        }
        this.listView.getScrollView().scrollToPercentVertical(r, 0.2);
    }
    updateView(e: cc.Node, t: number, n: any) {
        const o = e.getComponent(RobExpRewardItemUI);
        o.id = n;
        o.init();
    }
}
