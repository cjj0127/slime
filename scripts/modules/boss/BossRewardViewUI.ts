import { SpecialGuideEnum } from "../guide/GuideEnums";
import { E_ASSET_TYPE, E_GAME_LEVEL_TYPE, IMAGE_ICON_PATH_, MapUIPrefabs } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import _AssetConfig from "../../ccstudio/config/_AssetConfig";
import AssetManager from "../asset/AssetManager";
import AssetPool from "../asset/AssetPool";
import BtnShare from "../common/BtnShare";
import ChannelManager, { eChannelType } from "../common/ChannelManager";
import GuideMgr from "../guide/GuideMgr";
import SubscribeModel from "../../ccstudio/data/SubscribeModel";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import UserData, { AssetGetType } from "../user/UserData";
// n.default = P
const { ccclass, property } = cc._decorator;
@ccclass
export default class BossRewardViewUI extends cc.Component {
    private asset: E_ASSET_TYPE;
    @property(cc.Button)
    btnReceive: cc.Button = null;
    private count: number;
    @property(cc.Label)
    countLabel: cc.Label = null;
    private gameType: E_GAME_LEVEL_TYPE;
    @property(cc.Sprite)
    icon: cc.Sprite = null;
    received: boolean = false;
    async checkPromission() {
        await SubscribeModel.Instance.checkEctypeAndVersion();
    }
    async checkShowShareBtn() {
        if (ChannelManager.getChannelType() !== eChannelType.WECHAT && ChannelManager.getChannelType() !==
            eChannelType.BYTEDANCE || GuideMgr.instance.isInGuide()) {
            return;
        }
        const e = await AssetPool.Instance.createObjAsync(NAMES_BUNDLE.Game, MapUIPrefabs.ShareBtn.path);
        const t = {
            failCallback: function () { },
            palceName: "RushShare",
            successCallback: function () { }
        };
        e.getComponent(BtnShare).showShare("boss", t);
        this.btnReceive.node.getParent().addChild(e);
    }
    onClickReceive() {
        if (!this.received) {
            const sourcePos = this.countLabel.node.convertToWorldSpaceAR(cc.Vec3.ZERO);
            if (this.asset == E_ASSET_TYPE.Coin) {
                UserData.Instance.addItem(this.asset, this.count, {
                    sourcePos,
                    type: AssetGetType.GoldRush
                });
            }
            else {
                UserData.Instance.flyAddItem(this.asset, this.count, {
                    sourcePos,
                    type: AssetGetType.BossRush
                });
            }
            this.received = true;
            this.node.emit("Close");
            if (this.gameType == E_GAME_LEVEL_TYPE.CaveRush) {
                GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchHeroButton4);
            }
        }
    }
    onEnable() {
        this.received = false;
        this.setAsset(this.asset);
        this.setCount(this.count);
        if (this.gameType == E_GAME_LEVEL_TYPE.CaveRush) {
            GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchCaveRushReward);
        }
    }
    onLoad() {
        this.btnReceive.node.on("click", this.onClickReceive, this);
        this.btnReceive.node.on(cc.Node.EventType.TOUCH_END, this.checkPromission, this);
        this.checkShowShareBtn();
    }
    // private received: boolean = false;
    reuse(e: {
        asset: E_ASSET_TYPE;
        count: number;
        type: E_GAME_LEVEL_TYPE;
    }) {
        this.asset = e.asset;
        this.count = e.count;
        this.gameType = e.type;
    }
    setAsset(asset: E_ASSET_TYPE) {
        const t = _AssetConfig.Instance.get(asset);
        const n = IMAGE_ICON_PATH_ + "/" + t.icon;
        this.icon.spriteFrame = AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, n);
    }
    setCount(count: number) {
        this.countLabel.string = NumberPlus.format(count);
    }
}
