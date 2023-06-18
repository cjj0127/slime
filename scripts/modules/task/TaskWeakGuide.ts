import GuideMgr from "../guide/GuideMgr";
import QuestChain from "../quest/QuestChain";
import UserProp from "../user/UserProp";
import WeakGuide, { WeakGuideType } from "../guide/WeakGuide";
import { GuideEvent } from "../guide/GuideEnums";
import { GlobalEventTarget } from "../common/GlobalEventTarget";
import { GlobalEventName } from "../common/Events";
import { E_ASSET_TYPE, GameConst, E_QUEST_STATUS } from "../common/Const";
// import { GuideMgr } from "GuideMgr";
const { ccclass, property } = cc._decorator;
enum TaskWeakGuideType {
    ATK = 11,
    HP = 12,
    HPRecovery = 13,
    AttackSpeed = 14,
    CriticalHitChance = 15,
    CriticalHitDamage = 16,
    DoubleShot = 17,
    TripleShot = 18
}
@ccclass
export default class TaskWeakGuide extends WeakGuide {
    @property({ type: cc.Enum(TaskWeakGuideType) })
    taskWeakType: TaskWeakGuideType = TaskWeakGuideType.ATK;
    weakGuideType = WeakGuideType.Task;
    completeGuide() {
        this.freshView();
    }
    doAction() {
        this.guideNode.getComponentInChildren(cc.Sprite).node.position = cc.v3(0, -80, 0);
        this.guideNode.angle = 90;
        cc.tween(this.guideNode).sequence(cc.scaleTo(.5, 1.2), cc.scaleTo(.5, 1)).repeatForever().start();
    }
    freshView() {
        if (GuideMgr.instance.isCompleteGuide(1)) {
            let questId = QuestChain.Instance.chainQuestId;
            if (questId > GameConst.GUIDE_END) {
                this.hide();
            }
            else {
                let type = Number(this.taskWeakType) - 10;
                let levelUpEnable = UserProp.Instance.levelUpEnable(type);
                let questData = QuestChain.Instance.getData(questId);
                if (questData && this.taskWeakType == questData.activeId
                    && questData.status == E_QUEST_STATUS.Job && levelUpEnable == 1) {
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
    setTaskType(type: TaskWeakGuideType) {
        this.taskWeakType = type;
    }
    start() {
        this.freshView(),
            cc.director.on(GlobalEventName.ChainQuestStatusChange, this.freshView, this),
            cc.director.on(GlobalEventName.AssetItemChange + E_ASSET_TYPE.Coin, this.freshView, this),
            GlobalEventTarget.on(GuideEvent.COMPLETE_NORMAL_GUIDE, this.completeGuide, this);
    }
}
export { TaskWeakGuideType };
