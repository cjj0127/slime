import ItemUIBase from "../common/ItemUIBase";
import LanMgr from "../common/Language";
import { Q_NAME, Q_COLOR } from "../common/Const";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
const { ccclass, property } = cc._decorator;
@ccclass
export default class DetailViewUI extends ItemUIBase {
    @property(cc.Button)
    btnEnhance: cc.Button = null;
    @property(cc.Button)
    btnEquip: cc.Button = null;
    itemId: number = null;
    @property(cc.Label)
    levelLabel: cc.Label = null;
    @property(cc.Node)
    lvupEnableNode: cc.Node = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Label)
    ownedValue: cc.Label = null;
    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;
    @property(cc.Label)
    progressText: cc.Label = null;
    @property(cc.Label)
    qualityNameLabel: cc.Label = null;
   
    getBtnEequipInteractable(): boolean {
        return false;
    }
   
    getBtnEnhanceInteractable(): boolean {
        return false;
    }
   
    getCfgData(id) {
        return null;
    }
   
    onClickEnhance() {
    }
   
    onClickEquip() {
    }
   
    onEnable(): void {
        if (this.lvupEnableNode) {
            this.playRedDot(this.lvupEnableNode);
        }
        this.refresh();
        this.refreshDetail();
        this.refreshBtnStatus();
    }
   
    onLoad(): void {
        this.btnEquip.node.on("click", this.onClickEquip, this);
        this.btnEnhance.node.on("click", this.onClickEnhance, this);
    }
   
    playRedDot(e: cc.Node): void {
        e.stopAllActions();
        e.scale = 1;
        cc.tween(e).to(.2, {
            scale: 1.2
        }).to(.2, {
            scale: 1
        }).union().repeatForever().start();
    }
   
    refresh(): void {
        let e = this.getCfgData(this.itemId);
        let t = e.icon;
        let n = e.quality;
        let o = e.name;
        this.setQualityValue(n);
        this.setQualityName(n);
        this.setNameStr(o);
        this.setIcon(t);
    }
   
    refreshBtnStatus(): void {
        this.btnEquip.interactable = this.getBtnEequipInteractable();
        let e = this.getBtnEnhanceInteractable();
        this.btnEnhance.interactable = e;
        this.setRedPoint(e);
    }
   
    refreshDetail() {
    }
    // itemId: number;
    // qualityNameLabel!: cc.Label;
    // nameLabel!: cc.Label;
    // levelLabel!: cc.Label;
    // progressBar!: cc.ProgressBar;
    // progressText!: cc.Label;
    // ownedValue!: cc.Label;
    // btnEquip!: cc.Button;
    // btnEnhance!: cc.Button;
    // lvupEnableNode!: cc.Node;
   
    reuse(e: number): void {
        this.itemId = e;
    }
   
    setLevel(e: number): void {
        this.levelLabel.string = "LV" + e;
    }
   
    setNameStr(e: string): void {
        this.nameLabel.string = LanMgr.Instance.getLangByID(e);
    }
   
    setOwnedValue(e: number): void {
        this.ownedValue.string = "+" + NumberPlus.format(e) + "%";
    }
   
    setProgress(e: number, t: number): void {
        if (t > 0) {
            this.progressBar.progress = e / t;
            this.progressText.string = e + "/" + t;
        }
        else {
            this.progressBar.progress = 1;
            this.progressText.string = LanMgr.Instance.getLangByID("Max");
        }
    }
   
    setQualityName(e: number): void {
        this.qualityNameLabel.string = LanMgr.Instance.getLangByID(Q_NAME[e]);
        this.qualityNameLabel.node.color = cc.color().fromHEX(Q_COLOR[e]);
    }
   
    setRedPoint(e: boolean = false): void {
        if (this.lvupEnableNode && this.lvupEnableNode.active != e) {
            this.lvupEnableNode.active = e;
        }
    }
}
