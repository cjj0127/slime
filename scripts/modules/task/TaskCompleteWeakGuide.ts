import GuideMgr from "../guide/GuideMgr";
import QuestChain from "../quest/QuestChain";
import WeakGuide, { WeakGuideType } from "../guide/WeakGuide";
import { GlobalEventName } from "../common/Events";
import { GameConst, E_QUEST_STATUS } from "../common/Const";
// import GuideMgr from "GuideMgr";
const { ccclass, property } = cc._decorator;
@ccclass
export default class TaskCompleteWeakGuide extends WeakGuide {
    weakGuideType = WeakGuideType.TaskComplete;
    doAction() {
        this.guideNode.getComponentInChildren(cc.Sprite).node.position = cc.v3(-45, -100, 0);
        cc.tween(this.guideNode).sequence(cc.scaleTo(.5, 1.2), cc.scaleTo(.5, 1)).repeatForever().start();
    }
    freshView() {
        if (GuideMgr.instance.isCompleteGuide(0)) {
            const questId = QuestChain.Instance.chainQuestId;
            if (questId > GameConst.GUIDE_END) {
                this.hide();
            }
            else {
                const questData = QuestChain.Instance.getData(questId);
                if (questData && questData.status == E_QUEST_STATUS.Complete) {
                    this.show();
                }
                else {
                    this.hide();
                }
            }
        }
        else {
            this.hide();
        }
    }
    start() {
        this.freshView();
        cc.director.on(GlobalEventName.ChainQuestStatusChange, this.freshView, this);
    }
}
