import { EVideoType } from "../common/ViedioType";
import { GlobalEventName } from "../common/Events";
import { IMAGE_ICON_PATH_ } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AdsManager from "../ads/AdsManager";
import _AssetConfig from "../../ccstudio/config/_AssetConfig";
import AssetManager from "../asset/AssetManager";
import LanMgr from "../common/Language";
import _MailConfig from "../../ccstudio/config/_MailConfig";
import MailMgr, { MailState } from "./MailMgr";
import UserModel from "../../ccstudio/data/UserModel";
import Model from "../../ccstudio/data/Model";
// n.default = b
const { ccclass, property } = cc._decorator;
@ccclass
export default class MailInfoViewUI extends cc.Component {
    private _mailCfg: any;
    private _mailData: any;
    @property(cc.Button)
    adReceiveBtn: cc.Button = null;
    @property(cc.Label)
    dateLabel: cc.Label = null;
    @property(cc.Label)
    descLabel: cc.Label = null;
    @property(cc.Sprite)
    iconSprite: cc.Sprite = null;
    @property([cc.SpriteFrame])
    iconSpriteFrames: cc.SpriteFrame[] = [];
    @property(cc.Button)
    receiveBtn: cc.Button = null;
    @property(cc.Node)
    rewardItem: cc.Node = null;
    @property(cc.Node)
    rewardParent: cc.Node = null;
    @property(cc.Label)
    titleLabel: cc.Label = null;
    public Init(e: any) {
        this._mailData = e;
        this._mailCfg = _MailConfig.Instance.get(this._mailData.id);
        this.InitView();
        this.freshIcon();
        this.freshBtn();
        cc.director.on(GlobalEventName.FreshMail, this.freshView, this);
    }
    private InitRewardView() {
        for (let e = 0; e < this._mailCfg.asset.length; e++) {
            const t = cc.instantiate(this.rewardItem);
            t.parent = this.rewardParent;
            const n = _AssetConfig.Instance.get(this._mailCfg.asset[e]);
            const o = IMAGE_ICON_PATH_ + "/" + n.icon;
            t.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, o);
            t.getChildByName("num").getComponent(cc.Label).string = this._mailCfg.count[e].toString();
            t.active = true;
        }
    }
    private InitView() {
        this.titleLabel.string = LanMgr.Instance.getLangByID(this._mailCfg.title);
        this.descLabel.string = LanMgr.Instance.getLangByID(this._mailCfg.desc);
        this.adReceiveBtn.node.on("click", this.onAdReceiveClick, this);
        this.receiveBtn.node.on("click", this.onReceiveClick, this);
        this.InitRewardView();
    }
    private freshBtn() {
        if (this._mailData.state == MailState.Show) {
            this.receiveBtn.node.active = !this._mailCfg.ad;
            this.adReceiveBtn.node.active = this._mailCfg.ad;
        }
        else {
            this.receiveBtn.node.active = false;
            this.adReceiveBtn.node.active = false;
        }
    }
    private freshIcon() {
        this.iconSprite.spriteFrame = this._mailData.state == MailState.Show ? this.iconSpriteFrames[0] : this.iconSpriteFrames[1];
    }
    private freshView(e: number) {
        if (this._mailData.id == e) {
            this._mailData = MailMgr.Instance.getMailData(this._mailData.id);
            this.freshBtn();
            this.freshIcon();
        }
    }
    private onAdReceiveClick() {
        const e = this;
        const t: any = {
            AdsType: EVideoType.Mail,
            OpenUi: EVideoType.Mail,
            onSucceed: function () {
                e.onReceive();
            }
        };
        AdsManager.getInstance().showRewardedVideo(t);
    }
    private onReceive() {
        MailMgr.Instance.receiveMail(this._mailData.id);
        for (let e = 0; e < this._mailCfg.asset.length; e++) {
            Model.user.addAsset(this._mailCfg.asset[e], this._mailCfg.count[e]);
        }
    }
    private onReceiveClick() {
        this.onReceive();
    }
}
