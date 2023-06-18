import { GuideVerification } from "./GuideVerification";
import GuideMgr from "./GuideMgr";
import { GuideVerifactionEvent } from "./GuideEnums";
import { GlobalEventTarget } from "../common/GlobalEventTarget";
import CustomEventTarget from "../common/CustomEventTarget";
export default class ClickInRegion extends GuideVerification {
    _node;
    public destroy(): void {
        CustomEventTarget.removeTargetAllEventTargets(this);
    }
    private onClickInRegin(e: cc.Node): void {
        if (this._node == e) {
            this.success();
        }
    }
    onSuccess(): void {
        CustomEventTarget.removeTargetAllEventTargets(this);
    }
    constructor(t: number) {
        super();
        this._node = GuideMgr.instance.getGuideNode(Number(t));
        if (this._node == null) {
            cc.error("node is null");
        }
        GlobalEventTarget.on(GuideVerifactionEvent.CLICK_IN_REGIN, this.onClickInRegin, this);
    }
}
