import { GAME_SPINE_PATH_ } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
import _HeroConfig from "../../ccstudio/config/_HeroConfig";
import HeroData from "./HeroData";
import LanMgr from "../common/Language";
import _PropConfig from "../../ccstudio/config/_PropConfig";
import _SkillConfig from "../../ccstudio/config/_SkillConfig";
import IconUI from "../common/IconUI";
const { ccclass, property } = cc._decorator;
@ccclass
export default class HeroUnlockPropUI extends cc.Component {
    @property(cc.Button)
    btnOk: cc.Button = null;
    @property(cc.Label)
    descLabel = null;
    heroId = -1;
    @property(IconUI)
    iconSprite: IconUI = null;
    @property(cc.Label)
    lvLabel: cc.Label = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(sp.Skeleton)
    spAnim: sp.Skeleton = null;
    unlock = null;
    private onClickOk() {
        this.node.emit("Close");
    }
    public onEnable() {
        const e = HeroData.Instance.getData(this.heroId);
        const t = _HeroConfig.Instance.get(this.heroId);
        if (this.setAnim(t.uiAnim), this.setNameStr(t.name), this.setLevel(e.level), typeof this.unlock == "number") {
            const n = _SkillConfig.Instance.get(this.unlock);
            this.setIcon(n.icon);
            this.setSkillName(n.name);
        }
        else {
            const o = this.unlock;
            const r = o.prop;
            const i = o.value;
            this.setProp(r, i);
            const a = _PropConfig.Instance.get(r);
            this.setIcon(a.icon);
        }
    }
    public onLoad() {
        this.btnOk.node.on("click", this.onClickOk, this);
    }
    public reuse(e: {
        heroId: number;
        unlock: any;
    }) {
        const { heroId, unlock } = e;
        this.heroId = heroId;
        this.unlock = unlock;
    }
    private async setAnim(e: string) {
        const t = GAME_SPINE_PATH_ + "/mushroom";
        const n = await AssetManager.Instance.loadSkeleton(NAMES_BUNDLE.Game, t, e);
        this.spAnim.skeletonData = n;
        this.spAnim.setAnimation(0, "standby", true);
    }
    private setIcon(e: any) {
        this.iconSprite.icon = e;
    }
    private setLevel(e: number) {
        this.lvLabel.string = `${LanMgr.Instance.getLangByID("LV")}${e}`;
    }
    private setNameStr(e: number) {
        this.nameLabel.string = LanMgr.Instance.getLangByID(e);
    }
    private setProp(e: number, t: number) {
        this.descLabel.string = _PropConfig.Instance.getDesc(e, t);
    }
    private setSkillName(e: number) {
        this.descLabel.string = LanMgr.Instance.getLangByID(e);
    }
}
