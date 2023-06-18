import ExtralRewardData from "../../modules/common/ExtralRewardData";
import ModeBase from "./ModelBase";
export default class MgrExtralData extends ModeBase {
    initLoadData() { }
    load() {
        ExtralRewardData.Instance.load();
    }
    onDestroy() { }
}
