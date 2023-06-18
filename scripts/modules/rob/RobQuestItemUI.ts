import GuideMgr from "../guide/GuideMgr";
import { SpecialGuideEnum } from "../guide/GuideEnums";
import { GlobalEventName } from "../common/Events";
import Config from "../../ccstudio/configs/Config";
import GuideTouch from "../guide/GuideTouch";
import RobModel, { E_RobQuestState } from "../../ccstudio/data/RobModel";
import Model from "../../ccstudio/data/Model";
import PlunderQuest from "../common/PlunderQuest";
import UserData, { AssetGetType } from "../user/UserData";
const { ccclass, property } = cc._decorator;
@ccclass
export class RobQuestItemUI extends cc.Component {
    @cc._decorator.property(cc.Sprite)
    bg: cc.Sprite | null = null;
    @cc._decorator.property([cc.SpriteFrame])
    bgFrames: cc.SpriteFrame[] = [];
    @cc._decorator.property(cc.Label)
    coinNumLabel: cc.Label | null = null;
    @cc._decorator.property(cc.Sprite)
    iconCoin: cc.Sprite | null = null;
    @cc._decorator.property(cc.RichText)
    lvLabel: cc.RichText | null = null;
    @cc._decorator.property(cc.Button)
    receiveBtn: cc.Button | null = null;
    @cc._decorator.property(cc.Node)
    skinNode: cc.Node | null = null;
    onDisable() {
        cc.director.targetOff(this);
    }
    onEnable() {
        this.refresh();
        cc.director.on(GlobalEventName.FinishRoblevel, this.showComplete, this);
    }
    onLoad() {
        this.receiveBtn?.node.on("click", this.receive, this);
        if (!this.node.getComponent(GuideTouch)) {
            this.node.addComponent(GuideTouch).setId(SpecialGuideEnum.TouchAchieveReward);
        }
    }
    playReceiveAni() {
        if (this.skinNode!.active) {
            this.skinNode!.stopAllActions();
            cc.tween(this.skinNode!).by(5, {
                angle: 360,
            }).repeatForever().start();
        }
    }
    receive() {
        const e = Model.rob.getCurQuestId(), t = Model.rob.getQuestState(e), n = Config.plunderQuest.get(e);
        if (t == E_RobQuestState.S_Complete) {
            Model.rob.receiveQuest(e);
            this.refresh();
            const o = this.iconCoin!.node.convertToWorldSpaceAR(cc.Vec3.ZERO);
            UserData.Instance.addItem(n.rewardId, n.coinNum, {
                sourcePos: o,
                type: AssetGetType.Plunder
            });
            GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchQuitRobView);
            const r = {
                Plunder_Level: Model.rob.getRobDataInfo().robLevel,
                Plunder_QuestId: e,
                Plunder_QuestReward: n.rewardId + "|" + n.coinNum,
                Plunder_QuestType: n.questType.toString()
            };
        }
        else if (n && 0 != n.buildingId) {
            cc.director.emit(GlobalEventName.MoveToTargetBuild, n.buildingId);
        }
    }
    refresh() {
        // const e = Model.rob.getCurQuestId();
        // if (e > PlunderQuest.Instance.getMaxId()) {
        //     this.node.active = false;
        // } else {
        //     this.node.active = true;
        //     const t = PlunderQuest.Instance.get(e);
        //     if (t) {
        //         const n = t.rewardId,
        //             o = c.default.Instance.get(n);
        //         this.iconCoin!.spriteFrame = AssetManager.Instance.getSpriteFrame(BUNDLE_NAMES.Game, IMAGE_ICON_PATH + "/" + o.icon);
        //         this.coinNumLabel!.string = NumberPlus.format(t.coinNum);
        //         const r = l.default.Instance.get(t.buildingId);
        //         if (r) {
        //             const i = Language.Instance.getLangByID(r.name);
        //             this.lvLabel!.string = `<color=#FFFFFF>${Language.Instance.getLangByID("robquest_needlevel").replace("%{value}, "" + i)}</c><color=#FFF900>${t.needLevel}</color>`;
        //         } else {
        //             this.lvLabel!.string = `<color=#FFFFFF>${Language.Instance.getLangByID("robquest_needRoblevel")}</c><color=#FFF900>${t.needLevel}</color>`;
        //         }
        //         this.showComplete();
        //     }
        // }
    }
    showComplete() {
        const e = Model.rob.getCurQuestId();
        const t = Model.rob.getQuestState(e);
        this.bg!.spriteFrame = t == E_RobQuestState.S_Complete ? this.bgFrames[1] : this.bgFrames[0];
        this.skinNode!.active = t == E_RobQuestState.S_Complete;
        this.playReceiveAni();
    }
}
