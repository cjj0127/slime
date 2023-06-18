import { IMAGE_ICON_PATH_ } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import _AssetConfig from "../../ccstudio/config/_AssetConfig";
import AssetManager from "../asset/AssetManager";
import RobModel from "../../ccstudio/data/RobModel";
import Model from "../../ccstudio/data/Model";
import PlunderLevel from "../common/PlunderLevel";
import AssetInfoUI from "../asset/AssetInfoUI";
const { ccclass, property } = cc._decorator;
@ccclass
export default class RobExpRewardItemUI extends cc.Component {
    @property(cc.Sprite)
    bg: cc.Sprite = null;
    @property(cc.Sprite)
    gou: cc.Sprite = null;
    @property(cc.Sprite)
    icon: cc.Sprite = null;
    id: number = -1;
    @property(cc.Sprite)
    lvBg: cc.Sprite = null;
    @property([cc.SpriteFrame])
    lvBgFrames: Array<cc.SpriteFrame> = [];
    @property(cc.Label)
    lvLabel: cc.Label = null;
    @property(cc.Label)
    numLabel: cc.Label = null;
    @property(cc.Button)
    rewardBtn: cc.Button = null;
    init() {
        const robLevel = Model.rob.getRobDataInfo().robLevel;
        const plunderLevel = PlunderLevel.Instance.get(this.id);
        this.lvLabel.string = plunderLevel.id.toString();
        const bgColor = this.id == robLevel ? cc.color().fromHEX('#7F1992') : cc.color().fromHEX('#714441');
        this.bg.node.color = bgColor;
        const lvBgIndex = this.id == robLevel ? 0 : 1;
        this.lvBg.spriteFrame = this.lvBgFrames[lvBgIndex];
        const isUnlocked = this.id <= robLevel;
        this.gou.node.active = isUnlocked;
        const iconState = isUnlocked ? cc.Sprite.State.GRAY : cc.Sprite.State.NORMAL;
        this.icon.setState(iconState);
        this.numLabel.string = 'x' + plunderLevel.nums[0].toString();
        const assetCfg = _AssetConfig.Instance.get(plunderLevel.ids[0]);
        const iconPath = IMAGE_ICON_PATH_ + '/' + assetCfg.icon;
        this.icon.spriteFrame = AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, iconPath);
    }
    onClick() {
        const plunderLevel = PlunderLevel.Instance.get(this.id);
        AssetInfoUI.addPopItem(plunderLevel.ids[0], this.icon.node, false);
    }
    onEnable() {
        this.rewardBtn.node.on('click', this.onClick, this);
    }
}
