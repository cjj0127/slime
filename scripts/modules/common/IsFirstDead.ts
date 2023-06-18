import GuideCondition from "../guide/GuideCondition";
export default class IsFirstDead extends GuideCondition {
    isSuccess() {
        return true;
    }
}
