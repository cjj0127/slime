import { MapUIPrefabs, IMAGE_ICON_PATH_ } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
import UiModel from "../../ccstudio/data/UiModel";
import Model from "../../ccstudio/data/Model";
// import { ccclass, property } from "cc.decorator";
const { ccclass, property } = cc._decorator;
@ccclass
export default class RewardPopUI extends cc.Component {
    @property(cc.Label)
    addationLabel: cc.Label = null;
    @property(cc.Label)
    countLabel: cc.Label = null;
    @property(cc.Sprite)
    iconSprite: cc.Sprite = null;
    static async addPopItem(e: string, t: number, o: number, r: cc.Vec2) {
        const i = await Model.ui.openViewAsync(MapUIPrefabs.RewardPop);
        i.position = i.parent.convertToNodeSpaceAR(r);
        i.stopAllActions();
        i.opacity = 0;
        const a = i.getComponent(RewardPopUI);
        a.setCount(t, o);
        const l = `${IMAGE_ICON_PATH_}/${e}`;
        await a.setIcon(l);
        cc.tween(i)
            .set({ opacity: 255 })
            .parallel(cc.tween().delay(0.6).to(0.2, { opacity: 255 }), cc.tween().by(0.8, { y: 60 }, { easing: cc.easing.sineOut }))
            .delay(0.2)
            .call(() => { i.emit("remove", i); })
            .start();
    }
    setCount(e: number, t: number) {
        this.countLabel.string = `+${e}`;
        this.addationLabel.string = t > 0 ? `+${t}` : "";
    }
    //    private iconSprite: cc.Sprite;
    //    private countLabel: cc.Label;
    //    private addationLabel: cc.Label;
    async setIcon(e: string) {
        this.iconSprite.spriteFrame = await AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, e);
    }
}
