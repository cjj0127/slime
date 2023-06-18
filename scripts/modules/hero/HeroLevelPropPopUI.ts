import LanMgr from "../common/Language";
import { GlobalEventName } from "../common/Events";
import { COLOR_WHITE, COLOR_GRAY } from "../common/Const";
import _PropConfig from "../../ccstudio/config/_PropConfig";
// import * as Language from "Language";
const { ccclass, property } = cc._decorator;
@ccclass
export default class HeroLevelPropPopUI extends cc.Component {
    @property(cc.Node)
    arraw: cc.Node = null;
    @property(cc.Node)
    heroDesc: cc.Node = null;
    level = 0;
    @property(cc.Node)
    lockedNode: cc.Node = null;
    @property(cc.Node)
    popRoot: cc.Node = null;
    @property(cc.Label)
    propLabel: cc.Label = null;
    propType: any = null;
    propValue = "";
    target: any = null;
    @property(cc.Label)
    unlockLevelLabel: cc.Label = null;
    unlocked = false;
    onDisable() {
        cc.director.targetOff(this);
    }
    onEnable() {
        this.setProp(this.propType, this.propValue);
        this.setLevel(this.level);
        this.setStatus(this.unlocked);
        this.refreshPosition();
        cc.director.on(GlobalEventName.TouchScreen, this.onTouchScreen, this);
    }
    onTouchScreen() {
        this.node.emit("remove", this);
    }
    refreshPosition() {
        let e = this.target.parent.convertToWorldSpaceAR(cc.Vec3.ZERO);
        let t = this.popRoot.parent.convertToNodeSpaceAR(e);
        this.popRoot.x = t.x + .5 * this.target.parent.width;
        this.popRoot.y = t.y + .5 * this.target.parent.height;
        e = this.target.convertToWorldSpaceAR(cc.Vec3.ZERO);
        t = this.arraw.parent.convertToNodeSpaceAR(e),
            this.arraw.x = t.x;
    }
    // level: number;
    // propType: any;
    // propValue: any;
    // unlocked: boolean;
    // target: cc.Node;
    reuse(e: {
        level: number;
        prop: any;
        value: any;
        unlocked: boolean;
        target: cc.Node;
    }) {
        this.level = e.level;
        this.propType = e.prop;
        this.propValue = e.value;
        this.unlocked = e.unlocked;
        this.target = e.target;
    }
    setLevel(e: number) {
        this.unlockLevelLabel.string = LanMgr.Instance.getLangByID("LV") + " " + e;
    }
    setProp(e: any, t: any) {
        this.propLabel.string = _PropConfig.Instance.getDesc(e, t);
    }
    setStatus(e: boolean) {
        this.lockedNode.active = !e;
        if (e) {
            this.propLabel.node.color = COLOR_WHITE;
            this.heroDesc.color = cc.color().fromHEX("#e09f03");
        }
        else {
            this.propLabel.node.color = COLOR_GRAY;
            this.heroDesc.color = COLOR_GRAY;
        }
    }
}
