import { GlobalEventName } from "./Events";
import RedModel from "../../ccstudio/data/RedModel";
import Model from "../../ccstudio/data/Model";
import RedDotParam from "./RedDotParam";
import { E_RED_Tip } from "../../ccstudio/config/_RedConfig";
const _ = window['_'];
// import * as Events from 'Events';
const { ccclass, property, menu } = cc._decorator;
@ccclass
export default class RedDotComponent extends cc.Component {
    @property(cc.Label)
    countLabel: cc.Label = null;
    paramComp: RedDotParam = null;
    @property({
        type: cc.Enum(E_RED_Tip)
    })
    redId: E_RED_Tip = E_RED_Tip.eQUEST_PASS;
    @property({
        type: [cc.Node],
        visible: function () {
            return null == this.redSprite;
        }
    })
    redNodes: cc.Node[] = [];
    @property({
        type: cc.Sprite,
        visible: function () {
            return this.redNodes.length == 0;
        }
    })
    redSprite: cc.Sprite = null;
    @property({
        type: cc.Integer,
        displayName: "刷新间隔"
    })
    refreshInterval: number = 0;
    fixedUpdate() {
        this.refreshDot();
    }
    getRedDotParam() {
        return this.paramComp && this.paramComp.getRedDotParam();
    }
    onDisable() {
        this.unscheduleAllCallbacks();
        cc.director.targetOff(this);
    }
    onEnable() {
        this.paramComp = this.node.getComponent(RedDotParam);
        this.redSprite && this.playRedDot(this.redSprite.node);
        _.each(this.redNodes, (t) => {
            this.playRedDot(t);
        });
        cc.director.once(cc.Director.EVENT_AFTER_DRAW, this.refreshDot, this);
        cc.director.on(GlobalEventName.RedDotRefresh, this.refreshDot, this);
        this.refreshInterval > 0 && this.schedule(this.fixedUpdate, this.refreshInterval, cc.macro.REPEAT_FOREVER);
    }
    playRedDot(e: cc.Node) {
        e.stopAllActions();
        e.scale = 1;
        cc.tween(e).to(0.2, { scale: 1.2 }).to(0.2, { scale: 1 }).union().repeatForever().start();
    }
    refreshDot() {
        const t = Model.reddot.getNode(this.redId);
        const n = this.getRedDotParam();
        let e = n ? t.calculate(n) : t.getResult();
        _.each(this.redNodes, (t) => {
            t.active = e > 0;
        });
        if (this.redSprite) {
            this.redSprite.node.active = e > 0;
        }
        if (this.countLabel) {
            this.countLabel.string = `${e}`;
        }
    }
}
