import { GlobalEventTarget } from "./GlobalEventTarget";
import CustomEventTarget from "./CustomEventTarget";
import { GuideVerification } from "../guide/GuideVerification";
export default class NetRequestSucc extends GuideVerification {
    _cmd;
    destroy() {
        CustomEventTarget.removeTargetAllEventTargets(this);
    }
    onCmd(e) {
        this._cmd == e && this.success();
    }
    onSuccess() {
        CustomEventTarget.removeTargetAllEventTargets(this);
    }
    constructor(t) {
        super();
        GlobalEventTarget.on(t, this.onCmd.bind(this), this);
        GlobalEventTarget.on(t, this.onCmd.bind(this), this);
    }
}
