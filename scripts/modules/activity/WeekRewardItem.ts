import { GlobalEventName } from "../common/Events";
import _AssetConfig from "../../ccstudio/config/_AssetConfig";
import ItemContent, { ItemContentInfo, ItemInfo } from "../common/ItemContent";
import LangData from "../common/LangData";
import UserData, { AssetGetType } from "../user/UserData";
import Utils_ from "../../ccstudio/utils/Utils";
import WeekMgr from "./WeekMgr";
const { ccclass, property } = cc._decorator;
export enum EWeekRewardState {
    ENotComplete = 0,
    EComplete = 1,
    EReceived = 2
}
@ccclass
export class WeekRewardItem extends cc.Component {
    @property({
        type: cc.Integer,
        displayName: "天数",
        max: 7,
        min: 1,
        step: 1,
        slide: true
    })
    curDay = 1;
    curState: EWeekRewardState = EWeekRewardState.ENotComplete;
    @property(cc.Node)
    maskNode: cc.Node = null;
    @property(cc.Node)
    receiveBtn: cc.Node = null;
    @property(cc.Label)
    titleText: cc.Label = null;
    GetReward() {
        let e = "";
        const t = WeekMgr.Instance.GetWeekCfg(this.curDay);
        for (let n = 0; n < t.name.length; n++) {
            const o = {
                priority: 2,
                sourcePos: this.node.parent.convertToWorldSpaceAR(this.node.position),
                type: AssetGetType.SevenLogin
            };
            const r = Number(t.name[n]);
            Number(_AssetConfig.Instance.cfg[r].type);
            UserData.Instance.addItem(Number(t.name[n]), t.count[n], o);
            e = n == 0 ? (r + "|" + t.count[n]) : ";" + r + " | " + t.count[n];
        }
        this.reportGetReward(e);
    }
    InitView() {
        this.SetTitle();
        this.SetIcon();
        this.SetState();
        this.receiveBtn.on("click", this.OnReceiveClick, this);
    }
    OnReceiveClick() {
        if (this.curState == EWeekRewardState.EComplete) {
            WeekMgr.Instance.SignToDay();
            this.GetReward();
            cc.director.emit(GlobalEventName.CloseWeekView);
        }
    }
    SetIcon() {
        const cfg = WeekMgr.Instance.GetWeekCfg(this.curDay);
        console.log(cfg, this.curDay);
        const info = new ItemContentInfo;
        info.ItemInfos = [];
        for (let n = 0; n < cfg.name.length; n++) {
            const o = new ItemInfo(Number(cfg.name[n]), cfg.count[n]);
            if (this.curState == EWeekRewardState.ENotComplete) {
                o.isGray = true;
            }
            info.ItemInfos.push(o);
        }
        const content = this.node.getChildByName("content");
        ItemContent.Init(info, content);
    }
    SetState() {
        const e = this.node.getChildByName("bg1");
        const t = this.node.getChildByName("bg2");
        const n = this.receiveBtn.getChildByName("bg").getComponent(cc.Sprite);
        const o = this.receiveBtn.getComponent(cc.Button);
        if (this.curState == EWeekRewardState.EComplete) {
            this.receiveBtn.stopAllActions();
            cc.tween(this.receiveBtn).to(.2, { scale: 1.2 }).to(.2, { scale: 1 }).union().repeatForever().start();
        }
        else if (this.curState == EWeekRewardState.ENotComplete) {
            Utils_.setGray(n);
            e.color = cc.color(111, 111, 111, 255);
            if (7 != this.curDay) {
                t.color = cc.color(85, 85, 85, 255);
            }
            else {
                e.color = cc.color(144, 57, 26, 255);
            }
            o.enabled = false;
        }
        else if (this.curState == EWeekRewardState.EReceived) {
            this.maskNode.active = true;
            Utils_.setGray(n);
            o.enabled = false;
            o.getComponentInChildren(cc.Label).string = LangData.getLangByID("Claimed");
        }
    }
    SetTitle() { }
    reportGetReward(e) {
        const t = {
            LoginReward: e,
            SevenLogin_ID: this.curDay
        };
    }
    // @property(cc.Label)
    // titleText = null;
    // @property(cc.Node)
    // maskNode = null;
    // @property(cc.Node)
    // receiveBtn = null;
    // curState = null;
    start() {
        this.curState = WeekMgr.Instance.GetReceiveState(this.curDay);
        this.InitView();
    }
}
