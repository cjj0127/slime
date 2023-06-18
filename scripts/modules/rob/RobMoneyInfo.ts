import UserData from "../user/UserData";
import { GlobalEventName } from "../common/Events";
import { E_ASSET_TYPE } from "../common/Const";
import AddCoinLabel from "../common/AddCoinLabel";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
// import NumberPlus from "NumberPlus";
const { ccclass, property } = cc._decorator;
@ccclass
export default class RobMoneyInfo extends cc.Component {
    @property(AddCoinLabel)
    robCoin1Label: AddCoinLabel = null;
    @property(AddCoinLabel)
    robCoin2Label: AddCoinLabel = null;
    @property(AddCoinLabel)
    robCoin3Label: AddCoinLabel = null;
    onDisable() {
        cc.director.targetOff(this);
    }
    onEnable() {
        this.onRobCoin1Change();
        this.onRobCoin2Change();
        this.onRobCoin3Change();
        cc.director.on(GlobalEventName.AssetItemChange + E_ASSET_TYPE.RobCoin1, this.onRobCoin1Change, this);
        cc.director.on(GlobalEventName.AssetItemChange + E_ASSET_TYPE.RobCoin2, this.onRobCoin2Change, this);
        cc.director.on(GlobalEventName.AssetItemChange + E_ASSET_TYPE.RobCoin3, this.onRobCoin3Change, this);
    }
    onLoad() {
        this.robCoin1Label.setFormatFunc(NumberPlus.format);
        this.robCoin2Label.setFormatFunc(NumberPlus.format);
        this.robCoin3Label.setFormatFunc(NumberPlus.format);
    }
    onRobCoin1Change() {
        this.robCoin1Label.string = UserData.Instance.getItem(E_ASSET_TYPE.RobCoin1);
    }
    onRobCoin2Change() {
        this.robCoin2Label.string = UserData.Instance.getItem(E_ASSET_TYPE.RobCoin2);
    }
    onRobCoin3Change() {
        this.robCoin3Label.string = UserData.Instance.getItem(E_ASSET_TYPE.RobCoin3);
    }
}
