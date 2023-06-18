import { EVideoType } from "../common/ViedioType";
import { GlobalEventName } from "../common/Events";
import { GameConst, E_QUEST_ACTIVE_ID } from "../common/Const";
import AdsManager from "../ads/AdsManager";
import ObtainModel from "../../ccstudio/data/ObtainModel";
import Model from "../../ccstudio/data/Model";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import UserData, { AssetGetType } from "../user/UserData";
import ViewAnimCtrl from "../../ccstudio/display/ViewAnimCtrl";
// n.default = m
const { ccclass, property } = cc._decorator;
@ccclass
export default class ChestViewBattle extends cc.Component {
    @property(cc.Button)
    adBtn: cc.Button = null;
    @property(cc.Button)
    cancellBtn: cc.Button = null;
    private chestData;
    @property(cc.Sprite)
    chestIcon: cc.Sprite = null;
    @property(cc.Label)
    chestName: cc.Label = null;
    @property(cc.Node)
    chestNode: cc.Node = null;
    @property(cc.Sprite)
    diamondIcon: cc.Sprite = null;
    @property(cc.Sprite)
    goldIcon: cc.Sprite = null;
    @property([cc.SpriteFrame])
    icons: Array<cc.SpriteFrame> = [];
    close(): void {
        this.node.getComponent(ViewAnimCtrl)?.onClose();
    }
    obtainDiamond(): void {
        const e = this.chestIcon.node.convertToWorldSpaceAR(cc.Vec3.ZERO);
        UserData.Instance.addDiams(GameConst.CHEST_DIAMAND_AMOUNT.toString(), {
            sourcePos: e,
            type: AssetGetType.GemBox
        });
        cc.director.emit(GlobalEventName.QuestCommit, E_QUEST_ACTIVE_ID.ReceiveChest);
    }
    obtainGold(): void {
        const e = this.chestIcon.node.convertToWorldSpaceAR(cc.Vec3.ZERO);
        const t = NumberPlus.mul(Model.obtain.getCollectSpeed(), GameConst.CHEST_GOLD_AMOUNT);
        UserData.Instance.addCoin(t, {
            sourcePos: e,
            type: AssetGetType.GoldBox
        });
        cc.director.emit(GlobalEventName.QuestCommit, E_QUEST_ACTIVE_ID.ReceiveChest);
    }
    async onAd(): Promise<void> {
        const e = () => {
            if (this.chestData.type == 0) {
                this.obtainGold();
            }
            else {
                this.obtainDiamond();
            }
            this.close();
        };
        const t = this.chestData.type == 0 ? EVideoType.AdGold : EVideoType.AdDiamand;
        const n = {
            AdsType: t,
            OpenUi: t,
            onSucceed: e
        };
        await AdsManager.getInstance().showRewardedVideo(n);
    }
    onCancell(): void {
        this.close();
    }
    onDisable(): void { }
    onEnable(): void {
        this.cancellBtn.node.on("click", this.onCancell, this);
        this.adBtn.node.on("click", this.onAd, this);
        this.chestIcon.spriteFrame = this.icons[this.chestData.type];
        let t = this.goldIcon.node;
        if (this.chestData.type == 0) {
            this.chestName.string = NumberPlus.format(NumberPlus.mul(Model.obtain.getCollectSpeed(), GameConst.CHEST_GOLD_AMOUNT));
        }
        else {
            this.chestName.string = GameConst.CHEST_DIAMAND_AMOUNT.toString();
            t = this.diamondIcon.node;
        }
        setTimeout(() => {
            this.setToMid(t);
        }, 0);
        this.goldIcon.node.active = this.chestData.type == 0;
        this.diamondIcon.node.active = this.chestData.type !== 0;
    }
    reuse(e): void {
        this.chestData = e;
    }
    setToMid(e): void {
        this.chestNode.position = cc.v3(-(this.chestName.node.width - e.width) / 2, -40);
    }
}
