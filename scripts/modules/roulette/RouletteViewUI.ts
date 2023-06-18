import { WheelBase, WheelState } from "./WheelBase";
import { EInsertAdType, EOpenUIType, EVideoType } from "../common/ViedioType";
import AdsManager from "../ads/AdsManager";
import _AssetConfig from "../../ccstudio/config/_AssetConfig";
import SoundPlayerComp from "../../ccstudio/utils/SoundPlayerComp";
import LanLabel from "../common/LanLabel";
import Model from "../../ccstudio/data/Model";
import _RouletteConfig from "../../ccstudio/config/_RouletteConfig";
import MyTools from "../../ccstudio/utils/MyTools";
import UIRouletteItem from "./UIRouletteItem";
import ViewAnimCtrl from "../../ccstudio/display/ViewAnimCtrl";
const { ccclass, property } = cc._decorator;
const P = window['_'];
const E = window['moment'];
@ccclass
export default class RouletteViewUI extends WheelBase {
    @property(cc.Node)
    accorNode: cc.Node = null;
    @property(cc.Node)
    adNode: cc.Node = null;
    @property(cc.Button)
    btnClose: cc.Button = null;
    @property(cc.Button)
    btnSpin: cc.Button = null;
    @property(cc.Label)
    cdLabel: cc.Label = null;
    @property(cc.Node)
    cdMask: cc.Node = null;
    @property(cc.Label)
    countLabel: cc.Label = null;
    @property(cc.Node)
    resultTag: cc.Node = null;
    @property([UIRouletteItem])
    rewardItems: UIRouletteItem[] = [];
    @property(cc.Node)
    runNode: cc.Node = null;
    private tagPosition: cc.Vec2 | cc.Vec3 = null;
    fixUpdate() {
        this.refreshCd();
    }
    onClickClose() {
        Model.ad.showInterstitial(EInsertAdType.UICloseAd, EOpenUIType.Roulette),
            this.getComponent(ViewAnimCtrl).onClose();
    }
    async onClickSpin() {
        if (this.state > WheelState.IDLE) {
            return;
        }
        if (!Model.roulette.spinEnable()) {
            return;
        }
        if (Model.roulette.freeSpinEnable()) {
            this.spin();
        }
        else {
            this.state = WheelState.Other;
            const successCallback = () => {
                this.spin();
            };
            const cancelCallback = () => {
                this.state = WheelState.IDLE;
            };
            const failCallback = () => {
                this.state = WheelState.IDLE;
            };
            const param = {
                AdsType: EVideoType.AdSpin,
                OpenUi: EVideoType.AdSpin,
                onCancel: cancelCallback,
                onFail: failCallback,
                onSucceed: successCallback
            };
            await AdsManager.getInstance().showRewardedVideo(param);
        }
    }
    onDisable() {
        this.unschedule(this.fixUpdate);
        cc.director.targetOff(this);
        Model.ad.hideBanner();
    }
    onEnable() {
        this.btnClose.node.on('click', this.onClickClose, this);
        this.resultTag.active = false;
        this.refreshCount();
        this.refreshCd();
        this.schedule(this.fixUpdate, 0.2, cc.macro.REPEAT_FOREVER);
        Model.ad.showBanner(EOpenUIType.Roulette);
    }
    onEnterBack() {
        this.accorNode.stopAllActions();
        cc.tween(this.accorNode)
            .to(0.3, { angle: 0 })
            .start();
    }
    onLoad() {
        for (let i = 0; i < this.displayCount; i++) {
            const itemNode = this.runNode.getChildByName('' + (i + 1));
            let rouletteItem = itemNode.getComponent(UIRouletteItem);
            if (P.isNil(rouletteItem)) {
                rouletteItem = itemNode.addComponent(UIRouletteItem);
            }
            this.rewardItems.push(rouletteItem);
        }
        this.tagPosition = this.resultTag.position.sub(P.first(this.rewardItems).node.position);
        this.btnSpin.node.on('click', this.onClickSpin, this);
    }
    async onRunDone(index: number, onFinish: Function): Promise<void> {
        this.accorNode.angle = 0;
        this.accorNode.stopAllActions();
        this.resultTag.opacity = 0;
        this.resultTag.active = true;
        const resultItem = this.rewardItems[index];
        if (this.resultTag.parent !== resultItem.node) {
            this.resultTag.parent = resultItem.node;
            this.resultTag.position = this.tagPosition;
            this.resultTag.angle = 0;
            this.resultTag.setSiblingIndex(0);
        }
        SoundPlayerComp.Instance.playEffect('Audios/spin_2');
        cc.tween(this.resultTag)
            .blink(1, 3)
            .set({ opacity: 255 })
            .start();
        await MyTools.sleep(1);
        const iconSprite = resultItem.getIconSprite();
        const worldPos = iconSprite.node.convertToWorldSpaceAR(cc.Vec3.ZERO);
        Model.roulette.sendReward(index, worldPos);
        this.btnClose.interactable = true;
        this.refreshCount();
        onFinish();
        if (Model.roulette.getLastSpinCount() == 0) {
            this.node.emit('Close');
        }
    }
    onStartup() {
        this.resultTag.stopAllActions();
        this.resultTag.opacity = 0;
        this.resultTag.active = false;
        this.runningAngle = -this.runNode.angle;
        this.accorNode.angle = 0;
        cc.tween(this.accorNode)
            .to(0.2, { angle: 30 })
            .call(() => {
            cc.tween(this.accorNode)
                .by(0.15, { angle: 10 })
                .by(0.15, { angle: -10 })
                .union()
                .repeatForever()
                .start();
        })
            .start();
    }
    refresh(e) {
        this.runNode.angle = -e;
    }
    refreshCd() {
        const cdTime = Model.roulette.getCdTime();
        this.cdMask.active = cdTime > 0;
        this.btnSpin.interactable = cdTime <= 0;
        this.adNode.active = !Model.roulette.freeSpinEnable();
        if (cdTime > 0) {
            this.cdLabel.string = E.utc(1000 * cdTime).format('mm:ss');
        }
    }
    refreshCount() {
        this.countLabel.getComponent(LanLabel).setVars('count', Model.roulette.getLastSpinCount().toString());
    }
    spin() {
        this.play();
        SoundPlayerComp.Instance.playEffect('Audios/spin_1');
        this.btnClose.interactable = false;
        const rewardId = Model.roulette.spin();
        const targetIndex = P.findIndex(this.rewardItems, item => item.rewardId == rewardId);
        this.setResult(targetIndex);
    }
    start() {
        const rouletteConfig = _RouletteConfig.Instance.getAll();
        P.each(this.rewardItems, (item, index) => {
            const config = rouletteConfig[index];
            const assetConfig = _AssetConfig.Instance.get(config.asset);
            item.rewardId = config.id;
            item.setReward(config.count, assetConfig.icon);
        });
    }
}
