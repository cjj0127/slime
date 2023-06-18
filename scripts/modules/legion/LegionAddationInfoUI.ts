import { GlobalEventName } from "../common/Events";
import { MapUIPrefabs } from "../common/Const";
import UiModel from "../../ccstudio/data/UiModel";
import Model from "../../ccstudio/data/Model";
const { ccclass, property } = cc._decorator;
@ccclass
export default class LegionAddationInfoUI extends cc.Component {
    @property(cc.Label)
    descLabel: cc.Label = null;
    static async addPopItem(e: any, t: any, o: boolean = true) {
        const r = cc.view.getVisibleSize();
        const i = await Model.ui.openViewAsync(MapUIPrefabs.LegionAddationInfo);
        const a = t.convertToWorldSpaceAR(cc.Vec3.ZERO);
        let l = a.y + 0.5 * t.height;
        if (o) {
            if ((l + i.height) >= r.height) {
                l = a.y - (0.5 * t.height + i.height);
            }
        }
        else {
            if (l - (0.5 * t.height + i.height) < 0) {
                l = a.y + 0.5 * t.height;
            }
            else {
                l = a.y - (0.5 * t.height + i.height);
            }
        }
        a.y = l;
        if (a.x + 0.5 * i.width >= r.width) {
            a.x = r.width - 0.5 * i.width;
        }
        if (a.x - 0.5 * i.width < 0) {
            a.x = 0.5 * i.width;
        }
        const p = i.parent.convertToNodeSpaceAR(a);
        i.position = p;
        i.getComponent(LegionAddationInfoUI).setDescStr(e);
    }
    onDisable() {
        cc.director.targetOff(this);
    }
    onEnable() {
        cc.director.on(GlobalEventName.TouchScreen, this.onTouchScreen, this);
    }
    onTouchScreen() {
        this.node.emit("remove", this);
    }
    public setDescStr(e: string) {
        this.descLabel.string = e;
    }
}
