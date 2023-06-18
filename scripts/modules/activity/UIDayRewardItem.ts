import { GlobalEventName } from "../common/Events";
import { MapUIPrefabs, IMAGE_ICON_PATH_ } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import _AssetConfig from "../../ccstudio/config/_AssetConfig";
import AssetManager from "../asset/AssetManager";
import _ExtralRewardConfig from "../../ccstudio/config/_ExtralRewardConfig";
import ExtralRewardData from "../common/ExtralRewardData";
import Model from "../../ccstudio/data/Model";
import QuestSevenChallenge from "../quest/QuestSevenChallenge";
import AssetInfoUI from "../asset/AssetInfoUI";
import AssetListInfoUI from "../asset/AssetListInfoUI";
import UserData, { AssetGetType } from "../user/UserData";
const P: any = window["_"];
const { ccclass, property } = cc._decorator;
@ccclass
export default class UIDayRewardItem extends cc.Component {
    @property()
    day: number = 0;
    @property(cc.Button)
    icon: cc.Button = null;
    @property(cc.Node)
    line: cc.Node = null;
    @property(cc.Node)
    lock: cc.Node = null;
    @property(cc.Label)
    numLabel: cc.Label = null;
    @property(cc.Label)
    rewardnumLabel: cc.Label = null;
    @property(cc.Node)
    skinNode: cc.Node = null;
    @property(cc.Node)
    status: cc.Node = null;
    initUi(): void {
        const e = _ExtralRewardConfig.Instance.get(this.day);
        this.numLabel.string = e.number.toString();
        let t = IMAGE_ICON_PATH_ + "/box004";
        if (this.isSingleAssetReward()) {
            this.rewardnumLabel.node.active = e.nums[0] > 1;
            this.rewardnumLabel.string = e.nums[0].toString();
            const n = _AssetConfig.Instance.get(e.ids[0]);
            if (n !== null) {
                t = IMAGE_ICON_PATH_ + "/" + n.icon;
            }
        }
        else {
            this.rewardnumLabel.node.active = false;
        }
        this.icon.node.getComponent(cc.Sprite).spriteFrame = AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, t);
    }
    isSingleAssetReward(): boolean {
        return _ExtralRewardConfig.Instance.get(this.day).ids.length == 1;
    }
    onClick(): void {
        const e = QuestSevenChallenge.Instance.getFinishedQuestNum();
        const t = ExtralRewardData.Instance.getData(this.day).status;
        const n = _ExtralRewardConfig.Instance.get(this.day);
        if (e >= n.number && t == 0) {
            for (let o = 0; o < n.ids.length; o++) {
                const r = n.ids[o];
                const i = n.nums[o];
                const u = _AssetConfig.Instance.get(r);
                if (u !== null) {
                    if (P.isEmpty(u.useMethod)) {
                        UserData.Instance.addItem(r, i, {
                            sourcePos: this.icon.node.convertToWorldSpaceAR(cc.Vec3.ZERO),
                            type: AssetGetType.SevenChallenge,
                        });
                    }
                    else {
                        const p = Model.user.useItem(r);
                        Model.ui.openViewAsync(MapUIPrefabs.DayRewardView, {
                            data: p,
                        });
                    }
                }
            }
            this.icon.node.stopAllActions();
            ExtralRewardData.Instance.setStatus(this.day, 1);
            this.refreshUi();
            cc.director.emit(GlobalEventName.UnlockSevenChallenge);
            let b = "";
            for (let o = 0; o < n.ids.length; o++) {
                const r = n.ids[o].toString();
                b += r + "|" + n.nums[o].toString() + ";";
            }
            const I = {
                LoginReward: b,
                Reward_Type: "Progress",
                SevenChallenge_ID: 1,
                SevenChallenge_Points: e,
            };
        }
        else if (n.ids.length > 1) {
            AssetListInfoUI.showPops(n.ids, n.nums, this.icon.node);
        }
        else {
            AssetInfoUI.addPopItem(n.ids[0], this.icon.node, false);
        }
    }
    onEnable(): void {
        this.initUi();
        this.refreshUi();
        this.icon.node.on("click", this.onClick, this);
        cc.director.on(GlobalEventName.SevenChallengeQuestStatusChange, this.refreshUi, this);
    }
    playShake(e: cc.Node): void {
        e.stopAllActions();
        cc.tween(e)
            .parallel(cc.tween().to(0.1, {
            angle: 10,
        }), cc.tween().to(0.1, {
            scale: 1.1,
        }))
            .to(0.1, {
            angle: -10,
        })
            .to(0.1, {
            angle: 10,
        })
            .to(0.1, {
            angle: -10,
        })
            .parallel(cc.tween().to(0.1, {
            angle: 0,
        }), cc.tween().to(0.1, {
            scale: 1,
        }))
            .delay(0.5)
            .union()
            .repeatForever()
            .start();
    }
    playSkinAnim(): void {
        this.skinNode.stopAllActions();
        cc.tween(this.skinNode).by(5, {
            angle: 360,
        }).repeatForever().start();
    }
    refreshUi(): void {
        const e = _ExtralRewardConfig.Instance.get(this.day);
        const t = ExtralRewardData.Instance.getData(this.day);
        this.status.active = t.status == 1;
        const n = QuestSevenChallenge.Instance.getFinishedQuestNum();
        this.lock.active = n < e.number;
        this.line.active = n >= e.number;
        const o = ExtralRewardData.Instance.getData(this.day).status;
        if (o == 0) {
            this.icon.node.getComponent(cc.Sprite).setState(cc.Sprite.State.NORMAL);
        }
        else {
            this.icon.node.getComponent(cc.Sprite).setState(cc.Sprite.State.GRAY);
        }
        if (n >= e.number && o == 0) {
            this.skinNode.active = true;
            this.playSkinAnim();
            this.playShake(this.icon.node);
        }
        else {
            this.skinNode.active = false;
            this.skinNode.stopAllActions();
            this.icon.node.stopAllActions();
            this.icon.node.angle = 0;
            this.icon.node.scale = 1;
        }
    }
}
