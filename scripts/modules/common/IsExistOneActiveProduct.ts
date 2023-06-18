import GuideCondition from "../guide/GuideCondition";
export default class IsExistOneActiveProduct extends GuideCondition {
    isSuccess() {
        return true;
    }
    constructor() {
        super();
    }
}
