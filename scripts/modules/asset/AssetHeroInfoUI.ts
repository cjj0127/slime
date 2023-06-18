import ItemUIBase from "../common/ItemUIBase";
import { GlobalEventName } from "../common/Events";
import { MapUIPrefabs } from "../common/Const";
import _HeroConfig from "../../ccstudio/config/_HeroConfig";
import LanMgr from "../common/Language";
import UiModel from "../../ccstudio/data/UiModel";
import Model from "../../ccstudio/data/Model";
import GradeLabelUI from "../battle/GradeLabelUI";
const { ccclass, property } = cc._decorator;
@ccclass
export default class AssetHeroInfoUI extends ItemUIBase {
    private assetId: any;
    @property(GradeLabelUI)
    private gradeLabel: GradeLabelUI = null;
    @property(cc.Label)
    private nameLabel: cc.Label = null;
    public static async addPopItem(e: any, t: any, o: boolean = true) {
        const r: any = cc.view.getVisibleSize();
        const i: any = await Model.ui.openViewAsync(MapUIPrefabs.AssetHeroInfo);
        const a: any = t.convertToWorldSpaceAR(cc.Vec3.ZERO);
        a.y -= o ? 0.5 * t.height : 0.5 * t.height + i.height;
        if (a.x + 0.5 * i.width >= r.width) {
            a.x = r.width - 0.5 * i.width;
        }
        if (a.x - 0.5 * i.width < 0) {
            a.x = 0.5 * i.width;
        }
        const l: any = i.parent.convertToNodeSpaceAR(a);
        i.position = l;
        i.getComponent(AssetHeroInfoUI).setAsset(e);
    }
    public onDisable() {
        cc.director.targetOff(this);
    }
    public onEnable() {
        cc.director.on(GlobalEventName.TouchScreen, this.onTouchScreen, this);
    }
    public onTouchScreen() {
        this.node.emit("remove", this);
    }
    public setAsset(e: any) {
        this.assetId = e;
        const t: any = _HeroConfig.Instance.get(e);
        const n: any = t.name;
        const o: any = t.grade;
        const r: any = t.icon;
        this.setGrade(o);
        this.setNameStr(n);
        this.setIcon(r);
    }
    public setGrade(e: any) {
        this.gradeLabel.setGrade(e);
    }
    public setNameStr(e: any) {
        this.nameLabel.string = LanMgr.Instance.getLangByID(e);
    }
}
