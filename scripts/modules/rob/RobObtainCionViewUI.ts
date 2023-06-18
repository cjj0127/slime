import GuideMgr from "../guide/GuideMgr";
import RobLevelUpRewardItemUI from "./RobLevelUpRewardItemUI";
import { SpecialGuideEnum } from "../guide/GuideEnums";
import { GlobalEventName } from "../common/Events";
import ViewAnimCtrl from "../../ccstudio/display/ViewAnimCtrl";
const h: any = window["_"];
const { ccclass, property } = cc._decorator;
@ccclass
export default class RobObtainCionViewUI extends cc.Component {
    @property(cc.Button)
    btnClose: cc.Button = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Label)
    expLabel: cc.Label = null;
    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;
    private levelUpList: number[] = [];
    private receiveInfos: any;
    onClose() {
        this.node.getComponent(ViewAnimCtrl).onClose();
        if (this.levelUpList.length > 0) {
            cc.director.emit(GlobalEventName.RobLevelUp, this.levelUpList);
            GuideMgr.instance.removeSpecialGuide();
        }
        else {
            GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchRobLevelButton);
        }
    }
    onEnable() {
        this.refresh();
        GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchGetRobReward);
    }
    onLoad() {
        this.btnClose.node.on("click", this.onClose, this);
    }
    refresh() {
        this.levelUpList = [];
        let totalExp = 0;
        const coinNums: {
            [coinType: string]: number;
        } = {};
        h.forEach(this.receiveInfos, (info: any) => {
            if (!coinNums[info.coinType]) {
                coinNums[info.coinType] = 0;
            }
            coinNums[info.coinType] += parseInt(info.coin);
            this.levelUpList = h.concat(this.levelUpList, info.levelUpList);
            totalExp += parseInt(info.exp);
        });
        this.content.removeAllChildren();
        for (const coinType in coinNums) {
            const coinNum = coinNums[coinType];
            const itemNode = cc.instantiate(this.itemPrefab);
            itemNode.parent = this.content;
            const itemCom = itemNode.getComponent(RobLevelUpRewardItemUI);
            itemCom.setItemInfo(parseInt(coinType), coinNum);
        }
        this.levelUpList = Array.from(new Set(this.levelUpList));
        this.levelUpList.sort((a, b) => a - b);
        this.expLabel.string = totalExp.toString();
    }
    reuse(e: {
        receiveInfos: any;
    }) {
        this.receiveInfos = e.receiveInfos;
    }
}
