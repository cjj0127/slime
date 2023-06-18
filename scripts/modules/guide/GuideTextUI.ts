import { GlobalEventName } from "../common/Events";
import BattleWorld from "../battle/BattleWorld";
import GuideMgr from "./GuideMgr";
import LanMgr from "../common/Language";
import UiModel from "../../ccstudio/data/UiModel";
import Model from "../../ccstudio/data/Model";
const { ccclass, property } = cc._decorator;
@ccclass
export default class GuideTextUI extends cc.Component {
    private _cfg = null;
    _guideType;
    private _index = 0;
    private _isPre = true;
    @property(cc.Label)
    private textLabel: cc.Label = null;
    freshText() {
        if (this._index >= this._cfg.text.length) {
            this.node.active = false;
            BattleWorld.Instance.resume();
            if (this._guideType == 0) {
                this._isPre ? GuideMgr.instance.check(!0) : GuideMgr.instance.nextStep(!0);
            }
            else if (this._guideType == 1) {
                this._isPre ? GuideMgr.instance.checkSpecial(-1, !0) : GuideMgr.instance.nextStep(!0);
            }
        }
        else {
            this.textLabel.string = LanMgr.Instance.getLangByID(this._cfg.text[this._index]);
            this.textLabel.node.parent.getComponent(cc.Layout).updateLayout();
            this.node.getChildByName("textDialog").getComponent(cc.Layout).updateLayout();
            this._index++;
        }
    }
    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.freshText, this);
        cc.director.on(GlobalEventName.GuideTextShow, this.showText, this);
    }
    showText(e: any, t: number, n: any) {
        this._index = 0;
        Model.ui.closeAll();
        BattleWorld.Instance.pause();
        this._cfg = n;
        this._guideType = t;
        this._isPre = e;
        this.node.active = true;
        this.freshText();
    }
}
