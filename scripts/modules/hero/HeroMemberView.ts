import { HeroView } from "./HeroView";
import { GAME_SPINE_PATH_ } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
const { ccclass, property } = cc._decorator;
@ccclass()
export default class HeroMemberView extends HeroView {
    async createView(e: any) {
        const t = GAME_SPINE_PATH_ + "/mushroom";
        const n = await AssetManager.Instance.getSkeleton(NAMES_BUNDLE.Game, t, e);
        this.sp.skeletonData = n;
    }
    ;
}
