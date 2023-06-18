import LanMgr from "../common/Language";
import { DAY_SECONDS, HOUR_SECONDS, E_ASSET_TYPE } from "../common/Const";
import { E_MINE_RESEARCH_STATUS } from "../../ccstudio/data/MineResearchModel";
import _MineResearchConfig from "../../ccstudio/config/_MineResearchConfig";
import Model from "../../ccstudio/data/Model";
import _PropConfig from "../../ccstudio/config/_PropConfig";
import RedDotComponent from "../common/RedDotComponent";
import RedDotParam from "../common/RedDotParam";
import MineResearchItemUI from "./MineResearchItemUI";
import UserData from "../user/UserData";
const { ccclass, property } = cc._decorator;
const _: any = window["moment"];
@ccclass
export default class MineResearchInfoUI extends RedDotParam {
    _mineResearchId = 0;
    @property(cc.Button)
    btnEnhance: cc.Button = null;
    @property(cc.Label)
    cdLabel: cc.Label = null;
    @property(cc.Label)
    descLabel: cc.Label = null;
    @property(cc.Label)
    enhanceValueLabel: cc.Label = null;
    @property(MineResearchItemUI)
    item: MineResearchItemUI = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Label)
    nextDescLabel: cc.Label = null;
    @property(cc.Node)
    tipMax: cc.Node = null;
    @property(cc.Node)
    tipPreResearch: cc.Node = null;
    // private _mineResearchId;
    public getRedDotParam(): any {
        return this._mineResearchId;
    }
    onClickBtnEnhance() {
        // some logic here
    }
    private onClickEnhance(): void {
        Model.mineResearch.lvup(this.mineResearchId);
    }
    public onLoad(): void {
        this.btnEnhance.node.on("click", this.onClickEnhance, this);
    }
    public refresh(): void {
        this.refreshInfo();
        this.refreshEnhance();
    }
    public refreshEnhance(): void {
        const e = _MineResearchConfig.Instance.get(this.mineResearchId);
        const t = Model.mineResearch.getData(this.mineResearchId);
        this.tipPreResearch.active = t.status == E_MINE_RESEARCH_STATUS.EClose;
        this.tipMax.active = t.level == e.maxLevel;
        const n = _MineResearchConfig.Instance.getExpend(this.mineResearchId, t.level);
        this.enhanceValueLabel.string = "" + n;
        if (parseInt(UserData.Instance.getItem(E_ASSET_TYPE.MineCube)) >= n) {
            this.enhanceValueLabel.node.color = cc.Color.WHITE;
            this.btnEnhance.target.getComponent(cc.Sprite).setState(cc.Sprite.State.NORMAL);
        }
        else {
            this.enhanceValueLabel.node.color = cc.Color.RED;
            this.btnEnhance.target.getComponent(cc.Sprite).setState(cc.Sprite.State.GRAY);
        }
    }
    public refreshInfo(): void {
        const e = _MineResearchConfig.Instance.get(this.mineResearchId);
        const t = Model.mineResearch.getData(this.mineResearchId);
        let n = (t?.level) || 0;
        const o = e.maxLevel;
        const r = (t?.status) || E_MINE_RESEARCH_STATUS.EClose;
        this.item.setProgress(n, o);
        this.item.setStatus(r == E_MINE_RESEARCH_STATUS.EClose, n == o);
        this.item.setIcon(e.icon);
        this.nameLabel.string = LanMgr.Instance.getLangByID(e.name);
        const i = _PropConfig.Instance.get(e.propType);
        const u = LanMgr.Instance.getLangByID(i.desc);
        let p = 0;
        if (t) {
            switch (t.status) {
                case E_MINE_RESEARCH_STATUS.EClose:
                    n = 1;
                case E_MINE_RESEARCH_STATUS.EMaxLevel:
                    const tmpP = e.value[n];
                    p = tmpP ? tmpP : 0;
                    this.descLabel.string = u.replace("%{value}", "" + p);
                    this.nextDescLabel.node.parent.active = !1;
                    break;
                case E_MINE_RESEARCH_STATUS.EOpen:
                case E_MINE_RESEARCH_STATUS.EUpgrading:
                    this.nextDescLabel.node.parent.active = !0;
                    const curP = e.value[n];
                    const nextP = e.value[n + 1];
                    p = curP ? curP : 0;
                    const f = nextP ? nextP : 0;
                    this.descLabel.string = u.replace("%{value}", "" + p);
                    this.nextDescLabel.string = u.replace("%{value}", "" + f);
                    break;
            }
            if (t.status != E_MINE_RESEARCH_STATUS.EClose && n < o) {
                const h = Model.mineResearch.getUpgradingNeedTime(this.mineResearchId, t.level);
                if (h >= DAY_SECONDS) {
                    this.cdLabel.string = Math.floor(h / HOUR_SECONDS) + ":" + _.utc(1e3 * h).format("mm:ss");
                }
                else {
                    this.cdLabel.string = _.utc(1e3 * h).format("HH:mm:ss");
                }
            }
            else {
                this.cdLabel.string = "";
            }
        }
        else {
            const tmpP = e.value[1];
            p = tmpP ? tmpP : 0;
            this.descLabel.string = u.replace("%{value}", "" + p);
            this.nextDescLabel.node.parent.active = !1;
            this.cdLabel.string = "";
        }
    }
    setMineResearchId(t) {
        if (this._mineResearchId !== t) {
            this._mineResearchId = t;
            this.refresh();
        }
    }
    public get mineResearchId(): any {
        return this._mineResearchId;
    }
    public set mineResearchId(value: any) {
        this._mineResearchId = value;
        this.node.getComponent(RedDotComponent).refreshDot();
    }
}
