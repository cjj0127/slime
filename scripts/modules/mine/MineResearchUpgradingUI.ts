import LanMgr from "../common/Language";
import { E_ASSET_TYPE, DAY_SECONDS } from "../common/Const";
import MineResearchModel from "../../ccstudio/data/MineResearchModel";
import _MineResearchConfig from "../../ccstudio/config/_MineResearchConfig";
import Model from "../../ccstudio/data/Model";
import UserData from "../user/UserData";
const { ccclass, property } = cc._decorator;
const g: any = window["moment"];
@ccclass
export default class MineResearchUpgradingUI extends cc.Component {
    @property(cc.Label)
    adCdLabel: cc.Label = null;
    @property(cc.Node)
    adCdNode: cc.Node = null;
    @property(cc.Button)
    btnAdSkin: cc.Button = null;
    @property(cc.Button)
    btnFastSkin: cc.Button = null;
    @property(cc.Label)
    cdLabel: cc.Label = null;
    @property(cc.Label)
    fastValueLabel: cc.Label = null;
    repeat: number = 0;
    @property(cc.Label)
    titleLabel: cc.Label = null;
    upId: number = -1;
    complete() {
        this.upId = -1;
        this.node.active = false;
        this.unschedule(this.fixUpdate);
    }
    fixUpdate() {
        if (this.upId > 0) {
            this.refresh();
        }
    }
    onClickAdSkin() {
        if (Model.mineResearch.getAdCd() == 0) {
            Model.mineResearch.adSkip(this.upId);
            this.adCdNode.active = true;
        }
    }
    onClickFastSkin() {
        Model.mineResearch.fastSkip(this.upId);
    }
    onDisable() {
        this.unschedule(this.fixUpdate);
    }
    onEnable() {
        this.refresh();
        this.schedule(this.fixUpdate, 0.1, cc.macro.REPEAT_FOREVER);
    }
    onLoad() {
        this.btnAdSkin.node.on("click", this.onClickAdSkin, this);
        this.btnFastSkin.node.on("click", this.onClickFastSkin, this);
    }
    refresh() {
        this.repeat++;
        let e = _MineResearchConfig.Instance.get(this.upId);
        this.titleLabel.string = LanMgr.Instance.getLangByID("Researching") + " " + LanMgr.Instance.getLangByID(e.name) + new Array(Math.floor(this.repeat / 5) % 4).fill(".").join("");
        let t = Model.mineResearch.getLvupLastTime(this.upId);
        if (t >= DAY_SECONDS) {
            let n = LanMgr.Instance.getLangByID("days");
            this.cdLabel.string = "" + Math.floor(t / DAY_SECONDS) + n + " " + g.utc(1000 * t).format("HH:mm:ss");
        }
        else {
            this.cdLabel.string = g.utc(1000 * t).format("HH:mm:ss");
        }
        let o = Model.mineResearch.getAdCd();
        this.adCdNode.active = o > 0;
        if (o > 0) {
            this.adCdLabel.string = g.utc(1000 * o).format("HH:mm:ss");
        }
        this.refreshFastValue();
    }
    refreshFastValue() {
        let e = Model.mineResearch.getLvupLastTime(this.upId);
        let t = _MineResearchConfig.Instance.getCompleteNeedDiams(this.upId, e);
        let n = parseInt(UserData.Instance.getItem(E_ASSET_TYPE.Diamond));
        this.fastValueLabel.string = "" + t;
        if (n >= t) {
            this.fastValueLabel.node.color = cc.Color.WHITE;
            this.btnFastSkin.target.getComponent(cc.Sprite).setState(cc.Sprite.State.NORMAL);
        }
        else {
            this.fastValueLabel.node.color = cc.Color.RED;
            this.btnFastSkin.target.getComponent(cc.Sprite).setState(cc.Sprite.State.GRAY);
        }
    }
    startLvup(e) {
        this.upId = e;
        this.refreshFastValue();
        this.node.active = true;
    }
}
