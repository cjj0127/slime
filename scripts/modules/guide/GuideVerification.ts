import GuideMgr from "./GuideMgr";
export class GuideVerification {
    destroy() { }
    onSuccess() { }
    success() {
        this.onSuccess();
        GuideMgr.instance.nextStep();
    }
}
