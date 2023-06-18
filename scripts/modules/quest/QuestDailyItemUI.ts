import LanMgr from "../common/Language";
import QuestDaily from "./QuestDaily";
import { GlobalEventName } from "../common/Events";
import { E_QUEST_STATUS } from "../common/Const";
import _QuestConfig from "../../ccstudio/config/_QuestConfig";
import MyTools from "../../ccstudio/utils/MyTools";
const { ccclass, property } = cc._decorator;
@ccclass
export default class QuestDailyItemUI extends cc.Component {
    private _questId: number = -1;
    @property(cc.SpriteFrame)
    barCompleteSpriteFrame: cc.SpriteFrame = null;
    @property(cc.Button)
    btnAd: cc.Button = null;
    @property(cc.Button)
    btnReceived: cc.Button = null;
    @property(cc.Node)
    completeNode: cc.Node = null;
    public delegate: any = null;
    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;
    @property(cc.SpriteFrame)
    progressNormallSpriteFrame = null;
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
    onClickAd() {
        this.delegate.requestReceiveAd(this);
    }
    onClickReceived() {
        this.delegate.requestReceive(this);
    }
    onDisable() {
        cc.director.targetOff(this);
    }
    onEnable() {
        this.playRedDot(this.redDot);
        cc.director.on(GlobalEventName.DailyQuestProgressChange, this.onProgressChange, this);
        cc.director.on(GlobalEventName.DailyQuestStatusChange, this.onStatusChange, this);
    }
    onLoad() {
        this.progressNormallSpriteFrame = this.progressBar.barSprite.spriteFrame;
        this.btnAd.node.on("click", this.onClickAd, this);
        this.btnReceived.node.on("click", this.onClickReceived, this);
    }
    onProgressChange(e) {
        if (this.questId == e) {
            const t = QuestDaily.Instance.getData(e);
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
        cc.tween(e).to(0.2, { scale: 1.2 }).to(0.2, { scale: 1 }).union().repeatForever().start();
    }
    refresh() {
        const e = QuestDaily.Instance.getData(this.questId);
        const t = _QuestConfig.Instance.get(e.id);
        this.setRewardCnt(t.count);
    }
    refreshPorgress(e) {
        const t = _QuestConfig.Instance.get(e.id);
        const n = LanMgr.Instance.getLangByID(t.title);
        this.setProgress(e.cur, e.max);
        if (MyTools.getChLen(n) > 18) {
            this.setTitle(n + "(" + e.cur + "/" + e.max + ")");
        }
        else {
            this.setTitle(n + " (" + e.cur + "/" + e.max + ")");
        }
        if (e.status > E_QUEST_STATUS.Job && e.status < E_QUEST_STATUS.Finish) {
            this.progressText.string = LanMgr.Instance.getLangByID("Complete");
            if (this.titleLabel) {
                this.titleLabel.node.color = cc.color().fromHEX("#FBFD5F");
            }
            this.node.color = cc.color().fromHEX("#7F1992");
        }
        else {
            this.progressText.string = "";
            if (this.titleLabel) {
                this.titleLabel.node.color = cc.color().fromHEX("#FFFFFF");
            }
            this.node.color = cc.color().fromHEX("#714441");
        }
        if (e.cur >= e.max) {
            this.progressBar.barSprite.spriteFrame = this.barCompleteSpriteFrame;
        }
        else {
            this.progressBar.barSprite.spriteFrame = this.progressNormallSpriteFrame;
        }
    }
    refreshStatus() {
        const e = QuestDaily.Instance.getData(this.questId);
        const t = _QuestConfig.Instance.get(this.questId);
        this.refreshPorgress(e);
        const n = e.status;
        this.btnAd.node.active = t.ad && n <= E_QUEST_STATUS.InAD;
        if (n == E_QUEST_STATUS.InAD) {
            this.btnAd.target.getComponent(cc.Sprite).setState(cc.Sprite.State.NORMAL);
        }
        else {
            this.btnAd.target.getComponent(cc.Sprite).setState(cc.Sprite.State.GRAY);
        }
        if (n != E_QUEST_STATUS.Complete) {
            this.btnReceived.target.getComponent(cc.Sprite).setState(cc.Sprite.State.GRAY);
        }
        else {
            this.btnReceived.target.getComponent(cc.Sprite).setState(cc.Sprite.State.NORMAL);
        }
        this.btnReceived.node.active = n != E_QUEST_STATUS.InAD;
        this.redDot.active = n == E_QUEST_STATUS.Complete;
        if (n < E_QUEST_STATUS.Finish) {
            this.statusLabel.string = LanMgr.Instance.getLangByID("Claim Rewards");
        }
        else {
            this.statusLabel.string = LanMgr.Instance.getLangByID("Claimed");
        }
        this.completeNode.active = n == E_QUEST_STATUS.Finish;
    }
    setProgress(e, t) {
        this.progressBar.progress = e / t;
    }
    setRewardCnt(e) {
        this.rewardCntLabel.string = "" + e;
    }
    setTitle(e) {
        if (this.titleLabel) {
            this.titleLabel.string = e;
        }
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
