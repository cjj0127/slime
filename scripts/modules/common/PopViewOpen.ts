import CustomEventTarget from "./CustomEventTarget";
import { GuideVerification } from "../guide/GuideVerification";
export default class PopViewOpen extends GuideVerification {
    private _name: any;
    public destroy() {
        CustomEventTarget.removeTargetAllEventTargets(this);
    }
    public onSuccess() {
        CustomEventTarget.removeTargetAllEventTargets(this);
    }
    constructor(t: any) {
        super();
        this._name = t;
    }
}
