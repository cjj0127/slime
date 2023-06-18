import LanMgr from "../common/Language";
import { GlobalEventName } from "../common/Events";
import { E_CYCLE_TYPE, E_QUEST_STATUS, DAY_SECONDS } from "../common/Const";
import PassModel from "../../ccstudio/data/PassModel";
import QuestModel from "../../ccstudio/data/QuestModel";
import Model from "../../ccstudio/data/Model";
import _QuestConfig from "../../ccstudio/config/_QuestConfig";
import QuestPass from "../quest/QuestPass";
import MyTools from "../../ccstudio/utils/MyTools";
const v: any = window["moment"];
const { ccclass, property } = cc._decorator;
@ccclass
export default class UIPassQuestItem extends cc.Component {
    button = null;
    @property(cc.Label)
    cdLabel = null;
    @property(cc.SpriteFrame)
    completeBarSf = null;
    @property(cc.Node)
    completeFlare = null;
    @property(cc.Node)
    completeNode = null;
    @property(cc.Label)
    descLabel = null;
    @property(cc.Node)
    finishNode = null;
    @property(cc.Node)
    lockNode = null;
    @property(cc.Label)
    nameLabel = null;
    @property(cc.SpriteFrame)
    normalBarSf = null;
    @property(cc.ProgressBar)
    progressBar = null;
    @property(cc.Label)
    progressText = null;
    questId = 0;
    @property(cc.Label)
    rewardCnt2Label = null;
    @property(cc.Label)
    rewardCntLabel = null;
    @property(cc.Sprite)
    rewardIcon: cc.Sprite = null;
    updateCycle = null;
    fixUpdate() {
        if (this.updateCycle) {
            this.refreshCdTime();
        }
    }
    onClickItem() {
        QuestPass.Instance.receive(this.questId, this.rewardIcon.node.convertToWorldSpaceAR(cc.Vec3.ZERO));
    }
    onDisable() {
        this.unschedule(this.fixUpdate);
        cc.director.targetOff(this);
    }
    onEnable() {
        this.schedule(this.fixUpdate, 1, cc.macro.REPEAT_FOREVER);
        cc.director.on(GlobalEventName.PassQuestProgress, this.onProgress, this);
        this.completeFlare.stopAllActions();
        cc.tween(this.completeFlare).by(5, {
            angle: 360
        }).repeatForever().start();
    }
    onLoad() {
        this.button = this.node.getComponent(cc.Button);
        this.node.on("click", this.onClickItem, this);
    }
    onProgress(e) {
        if (this.questId == e) {
            const t = QuestPass.Instance.getData(e);
            this.setProgress(t.cur, t.max);
        }
    }
    refresStatus(e, t) {
        this.finishNode.active = e == E_QUEST_STATUS.Finish;
        this.completeNode.active = e == E_QUEST_STATUS.Complete;
        if (t) {
            this.lockNode.active = !Model.pass.premiumActive;
            this.button.interactable = e == E_QUEST_STATUS.Complete && Model.pass.premiumActive;
        }
        else {
            this.lockNode.active = false;
            this.button.interactable = e == E_QUEST_STATUS.Complete;
        }
        this.node.color = e == E_QUEST_STATUS.Complete ? cc.color().fromHEX("#7F1992") : cc.color().fromHEX("#714441");
        this.progressBar.barSprite.spriteFrame = e == E_QUEST_STATUS.Complete ? this.completeBarSf : this.normalBarSf;
    }
    refresh(e) {
        this.questId = e.id;
        const t = _QuestConfig.Instance.get(e.id);
        this.updateCycle = t.updateCycle;
        this.setNameStr(LanMgr.Instance.getLangByID(t.updateCycle == E_CYCLE_TYPE.Daily ? "Daily Quest" : "Weekly Quest"));
        this.setDescStr(LanMgr.Instance.getLangByID(t.title));
        this.setProgress(e.cur, e.max);
        this.setReward(t.count);
        this.refresStatus(e.status, t.receiveDep);
        this.refreshCdTime();
    }
    refreshCdTime() {
        const e = v(MyTools.GetTimeNow());
        if (this.updateCycle == E_CYCLE_TYPE.Daily) {
            const t = Model.quest.resetDailyMoment.diff(e, "seconds");
            this.cdLabel.string = v.utc(1000 * t).format("HH:mm:ss");
        }
        else {
            const n = QuestPass.Instance.resetWeeklyQuestTime.diff(e, "seconds");
            if (n > DAY_SECONDS) {
                this.cdLabel.string = "" + Math.floor(n / DAY_SECONDS) + LanMgr.Instance.getLangByID("days");
            }
            else {
                this.cdLabel.string = v.utc(1000 * n).format("HH:mm:ss");
            }
        }
    }
    setDescStr(e) {
        this.descLabel.string = e;
    }
    setNameStr(e) {
        this.nameLabel.string = e;
    }
    setProgress(e, t) {
        this.progressBar.progress = e / t;
        this.progressText.string = e + "/" + t;
    }
    setReward(e) {
        this.rewardCntLabel.string = "" + e;
        this.rewardCnt2Label.string = "" + e;
    }
}
