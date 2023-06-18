import GuideCondition from "../guide/GuideCondition";
export default class UnlockSystem extends GuideCondition {
    isSuccess(): boolean {
        return true;
    }
    constructor(private _systemId: any) {
        super();
    }
}
