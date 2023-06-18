import ItemUIBase from "../../modules/common/ItemUIBase";
import LanMgr from "../../modules/common/Language";
const { ccclass, property } = cc._decorator;
@ccclass
export default class UIListViewItem extends ItemUIBase {
    @property(cc.Button)
    btnEquip: cc.Button = null;
    delegate = null;
    @property(cc.Node)
    equippedFlg: cc.Node = null;
    @property({ type: cc.Integer })
    itemId: number = 0;
    @property(cc.Label)
    levelLabel: cc.Label = null;
    @property(cc.Node)
    locked: cc.Node = null;
    @property(cc.Node)
    lvupEnableNode: cc.Node = null;
    lvupNodeScale = null;
    lvupNodeY = null;
    @property(cc.Node)
    maxNode: cc.Node = null;
    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;
    @property(cc.Label)
    progressText: cc.Label = null;

    onClickEquip() {
        this.delegate.onListItemEquip(this);
    }

    onClickItem() {
        this.delegate.onListItemClick(this);
    }

    onDisable() {
        cc.director.targetOff(this);
    }
   
    onEnable() {
        this.lvupEnableNode && this.playLvup();
    }

    onLoad() {
        this.btnEquip && this.btnEquip.node.on("click", this.onClickEquip, this),
            this.node.on("click", this.onClickItem, this);
    }

    playLvup() {
        var e = this.lvupEnableNode;
        e.stopAllActions(),
            this.lvupNodeY || (this.lvupNodeY = e.y),
            e.y = this.lvupNodeY,
            this.lvupNodeScale || (this.lvupNodeScale = e.scale),
            e.scale = this.lvupNodeScale,
            cc.tween(e).parallel(cc.tween().by(.3, {
                y: 10
            }).by(.3, {
                y: -10
            }), cc.tween().by(.15, {
                scaleY: -.2,
                scaleX: .4
            }, {
                easing: cc.easing.cubicInOut
            }).by(.1, {
                scaleY: .2,
                scaleX: -.4
            }).delay(.35)).repeatForever().start();
    }

    playRedDot(e) {
        e.stopAllActions(),
            e.scale = 1,
            cc.tween(e).to(.2, {
                scale: 1.2
            }).to(.2, {
                scale: 1
            }).union().repeatForever().start();
    }

    setLevel(e) {
        this.levelLabel.string = "LV" + e;
    }

    setMaxPoint(e) {
        this.maxNode && (this.maxNode.active = e, e && this.playRedDot(this.maxNode));
    }

    setProgress(e, t, n) {
        void 0 == n && (n = !1),
            this.progressText.string = e + "/" + t,
            this.progressBar.progress = e / t,
            n && (this.progressText.string = LanMgr.Instance.getLangByID("Max"), this.progressBar.progress = 1);
    }

    setRedPoint(e) {
        void 0 == e && (e = !1),
            this.lvupEnableNode && this.lvupEnableNode.active != e && (this.lvupEnableNode.active = e);
    }

    showEquiped() {
        this.equippedFlg.active = !0,
            this.locked.active = !1,
            this.levelLabel.node.active = !0,
            this.btnEquip && (this.btnEquip.node.active = !0);
    }

    showLocked() {
        this.equippedFlg.active = !1,
            this.locked.active = !0,
            this.levelLabel.node.active = !1,
            this.btnEquip && (this.btnEquip.node.active = !1);
    }

    showNormal() {
        this.equippedFlg.active = !1,
            this.locked.active = !1,
            this.levelLabel.node.active = !0,
            this.btnEquip && (this.btnEquip.node.active = !0);
    }
}
