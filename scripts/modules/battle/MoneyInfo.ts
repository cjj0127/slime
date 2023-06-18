import UserData from "../user/UserData";
import { GlobalEventName } from "../common/Events";
import { E_ASSET_TYPE } from "../common/Const";
import AddCoinLabel from "../common/AddCoinLabel";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
// import NumberPlus from "NumberPlus";
const { ccclass, property } = cc._decorator;
@ccclass
export default class MoneyInfo extends cc.Component {
    @property(AddCoinLabel)
    coinsLabel: AddCoinLabel = null;
    @property(AddCoinLabel)
    diamsLabel: AddCoinLabel = null;
    onCoinsChange() {
        this.refreshCoinsCount();
    }
    onDiamsChange() {
        this.refreshDiamsCount();
    }
    onDisable() {
        cc.director.targetOff(this);
    }
    onEnable() {
        this.refreshCoinsCount();
        this.refreshDiamsCount();
        cc.director.on(GlobalEventName.AssetItemChange + E_ASSET_TYPE.Coin, this.onCoinsChange, this);
        cc.director.on(GlobalEventName.AssetItemChange + E_ASSET_TYPE.Diamond, this.onDiamsChange, this);
    }
    onLoad() {
        this.coinsLabel.setFormatFunc(NumberPlus.format);
        this.diamsLabel.setFormatFunc((num: number) => {
            return `${Math.floor(num)}`;
        });
    }
    refreshCoinsCount() {
        this.coinsLabel.string = UserData.Instance.coins;
    }
    refreshDiamsCount() {
        this.diamsLabel.string = UserData.Instance.diams;
    }
}
