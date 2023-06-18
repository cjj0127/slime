import { GAME_SPINE_PATH_ } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
import _HeroConfig from "../../ccstudio/config/_HeroConfig";
const { ccclass, property } = cc._decorator;
@ccclass
export default class AddedHeroListItemUI extends cc.Component {
    @property(cc.Node)
    captainNode: cc.Node = null;
    @property(cc.Node)
    emptyNode: cc.Node = null;
    heroId: number = 0;
    @property(cc.Node)
    iconBg: cc.Node = null;
    @property(sp.Skeleton)
    sp: sp.Skeleton = null;
    
    getHeroId() {
        return this.heroId;
    }
    
    onLoad() {
        let e = this.emptyNode.children[0];
        let t = e.y;
        cc.tween(e)
            .to(.6, { y: t + 30 }, { easing: cc.easing.sineOut })
            .to(.6, { y: t }, { easing: cc.easing.sineIn })
            .union()
            .repeatForever()
            .start();
    }
    
    refresh() {
        let e: any = _HeroConfig.Instance.get(this.heroId);
        if (e) {
            this.setNameStr(e.name);
            this.setIcon(e.uiAnim);
            this.emptyNode.active = false;
            this.iconBg.color = cc.color().fromHEX("#008C1C");
        }
        else {
            this.setNameStr("");
            this.sp.node.active = false;
            this.emptyNode.active = true;
            this.iconBg.color = cc.color().fromHEX("#FFC000");
        }
    }
    
    setCaptain(e: boolean) {
        this.captainNode.active = e;
    }
    
    setEquiped() { }
    
    setHero(e: number) {
        if (this.heroId !== e) {
            this.heroId = e;
            this.refresh();
        }
    }
    
    async setIcon(e: string) {
        this.sp.node.active = false;
        let t = GAME_SPINE_PATH_ + "/mushroom";
        let n = await AssetManager.Instance.loadSkeleton(NAMES_BUNDLE.Game, t, e) as sp.SkeletonData;
        this.sp.node.active = true;
        this.sp.skeletonData = n;
        this.sp.setAnimation(0, "standby", true);
    }
    
    setNameStr(e) { }
}
