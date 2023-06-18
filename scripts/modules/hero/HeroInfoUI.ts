import HeroData from "./HeroData";
import LanMgr from "../common/Language";
import { GAME_SPINE_PATH_ } from "../common/Const";
import GradeLabelUI from "../battle/GradeLabelUI";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
import _HeroConfig from "../../ccstudio/config/_HeroConfig";
const { ccclass, property } = cc._decorator;
@ccclass
export default class HeroInfoUI extends cc.Component {
    private _heroId: number = -1;
    @property(GradeLabelUI)
    gradeSprite: GradeLabelUI = null;
    @property(cc.Label)
    lvLabel: cc.Label = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(sp.Skeleton)
    spAnim: sp.Skeleton = null;
    public async refresh(): Promise<void> {
        const e = _HeroConfig.Instance.get(this.heroId);
        const t = HeroData.Instance.getData(this.heroId);
        this.setNameStr(e.name);
        this.setIcon(e.icon);
        this.setAnim(e.uiAnim);
        this.setGrade(e.grade);
        this.setLv((t?.level) || 0);
    }
    async setAnim(e: string): Promise<void> {
        const t = GAME_SPINE_PATH_ + "/mushroom";
        const n = await AssetManager.Instance.loadSkeleton(NAMES_BUNDLE.Game, t, e) as any;
        this.spAnim.skeletonData = n;
        this.spAnim.setAnimation(0, "standby", true);
    }
    setGrade(e: number): void {
        this.gradeSprite.setGrade(e);
    }
    public setHeroId(e: number): void {
        this.heroId = e;
    }
    setIcon(e): void { }
    setLv(e: number): void {
        this.lvLabel.string = `${LanMgr.Instance.getLangByID("LV")} ${e}`;
    }
    setNameStr(e: string): void {
        this.nameLabel.string = LanMgr.Instance.getLangByID(e);
    }
    get heroId() {
        return this._heroId;
    }
    set heroId(value: number) {
        if (this._heroId !== value) {
            this._heroId = value;
            this.refresh();
        }
    }
}
