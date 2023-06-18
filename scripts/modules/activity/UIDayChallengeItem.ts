import LanMgr from "../common/Language";
import QuestSevenChallenge from "../quest/QuestSevenChallenge";
import { GlobalEventName } from "../common/Events";
import { E_QUEST_STATUS } from "../common/Const";
import Model from "../../ccstudio/data/Model";
import _QuestConfig from "../../ccstudio/config/_QuestConfig";
const { ccclass, property } = cc._decorator;
@ccclass
export default class UIDayChallengeItem extends cc.Component {
    private _questId: number = -1;
    @property(cc.SpriteFrame)
    barCompleteSpriteFrame: cc.SpriteFrame = null;
    @property(cc.Button)
    btnReceived: cc.Button = null;
    @property(cc.Node)
    completeNode: cc.Node = null;
    delegate: any = null;
    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;
    progressNormallSpriteFrame: cc.SpriteFrame;
    @property(cc.Label)
    progressText: cc.Label = null;
    @property(cc.Node)
    redDot: cc.Node = null;
    @property(cc.Label)
    rewardCntLabel: cc.Label = null;
    @property(cc.Sprite)
    rewardIcon: cc.Sprite = null;
    @property(cc.Label)
    statusLabel: cc.Label = null;
    @property(cc.Label)
    titleLabel: cc.Label = null;
    getRedDotParam() {
        return this.questId;
    }
    onClickReceived() {
        this.delegate.requestReceive(this);
        cc.director.emit(GlobalEventName.SevenChallengeQuestStatusChange);
        // const e = QuestSevenChallenge.Instance.getFinishedQuestNum();
        // const t = _QuestConfig.Instance.get(this.questId);
        // const n = {
        //     SevenChallenge_ID: this.questId,
        //     SevenChallenge_Points: e,
        //     SevenChallenge_UnlockDay: Model.sevenChallenge.getSevenChallengeDay(),
        //     SevenChallenge_FinishDay: this.delegate.day
        // };
        // const o = {
        //     SevenChallenge_ID: this.questId,
        //     Reward_Type: "Task",
        //     SevenChallenge_Points: e,
        //     LoginReward: t.asset.toString() + "|" + t.count.toString()
        // };
    }
    onDisable() {
        cc.director.targetOff(this);
    }
    onEnable() {
        this.playRedDot(this.redDot);
    }
    onLoad() {
        this.progressNormallSpriteFrame = this.progressBar.barSprite.spriteFrame;
        this.btnReceived.node.on("click", this.onClickReceived, this);
    }
    onProgressChange(e) {
        if (this.questId == e) {
            const t = QuestSevenChallenge.Instance.getData(e);
            this.refreshPorgress(t);
        }
    }
    onStatusChange(e) {
        if (this.questId == e) {
            this.refreshStatus();
        }
    }
    playRedDot(e) {
        e.stopAllActions();
        e.scale = 1;
        cc.tween(e).to(0.2, {
            scale: 1.2
        }).to(0.2, {
            scale: 1
        }).union().repeatForever().start();
    }
    refresh() {
        const e = QuestSevenChallenge.Instance.getData(this.questId);
        const t = _QuestConfig.Instance.get(e.id);
        this.setRewardCnt(t.count);
    }
    refreshPorgress(e) {
        const t = _QuestConfig.Instance.get(e.id);
        this.setProgress(e.cur, e.max);
        if (t.title.length > 16) {
            this.setTitle(LanMgr.Instance.getLangByID(t.title) + "(" + e.cur + "/" + e.max + ")");
        }
        else {
            this.setTitle(LanMgr.Instance.getLangByID(t.title) + " (" + e.cur + "/" + e.max + ")");
        }
        if (e.status > E_QUEST_STATUS.Job && e.status < E_QUEST_STATUS.Finish) {
            this.progressText.string = LanMgr.Instance.getLangByID("Complete");
            this.titleLabel && (this.titleLabel.node.color = cc.color().fromHEX("#FBFD5F"));
            this.node.color = cc.color().fromHEX("#7F1992");
        }
        else {
            this.progressText.string = "";
            this.titleLabel && (this.titleLabel.node.color = cc.color().fromHEX("#FFFFFF"));
            this.node.color = cc.color().fromHEX("#714441");
        }
        e.cur >= e.max ? this.progressBar.barSprite.spriteFrame = this.barCompleteSpriteFrame : this.progressBar.barSprite.spriteFrame = this.progressNormallSpriteFrame;
    }
    refreshStatus() {
        const e = QuestSevenChallenge.Instance.getData(this.questId);
        this.refreshPorgress(e);
        const t = e.status;
        this.btnReceived.target.getComponent(cc.Sprite).setState(t != E_QUEST_STATUS.Complete ? cc.Sprite.State.GRAY : cc.Sprite.State.NORMAL);
        this.btnReceived.node.active = t !== E_QUEST_STATUS.InAD;
        this.redDot.active = t === E_QUEST_STATUS.Complete;
        this.statusLabel.string = t < E_QUEST_STATUS.Finish ? LanMgr.Instance.getLangByID("Claim Rewards") : LanMgr.Instance.getLangByID("Claimed");
        this.completeNode.active = t === E_QUEST_STATUS.Finish;
    }
    setProgress(e, t) {
        this.progressBar.progress = e / t;
    }
    setRewardCnt(e) {
        this.rewardCntLabel.string = `${e}`;
    }
    setTitle(str: string) {
        if (this.titleLabel)
            this.titleLabel.string = str;
    }
    get questId(): number {
        return this._questId;
    }
    set questId(value: number) {
        if (this._questId !== value) {
            this._questId = value;
            this.refresh();
        }
        this.refreshStatus();
    }
}
