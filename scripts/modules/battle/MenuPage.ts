import { GlobalEventName } from "../common/Events";
import UiModel from "../../ccstudio/data/UiModel";
import Model from "../../ccstudio/data/Model";
// import { UiModel } from "UiModel";
const { ccclass, property } = cc._decorator;
@ccclass
export class MenuPage extends cc.Component {
    private currOpenView: cc.Node = null;
    @property(cc.Node)
    userPropView: cc.Node = null;
    hide() {
        if (this.currOpenView) {
            this.currOpenView.emit("remove", this.currOpenView);
        }
        this.currOpenView = null;
        this.userPropView.active = true;
    }
    onCloseAllView() {
        this.currOpenView = null;
        this.userPropView.active = true;
    }
    onDisable() {
        cc.director.targetOff(this);
    }
    // userPropView: cc.Node;
    // currOpenView: any;
    onEnable() {
        cc.director.on(GlobalEventName.CloseAllView, this.onCloseAllView, this);
    }
    async show(e: any, t: any) {
        if (this.currOpenView) {
            this.currOpenView.emit("remove", this.currOpenView);
        }
        this.currOpenView = await Model.ui.openViewAsync(e, {
            root: this.node,
            data: t
        });
        this.userPropView.active = false;
    }
}
