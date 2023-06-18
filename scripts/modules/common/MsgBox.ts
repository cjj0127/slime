import { MapUIPrefabs } from "./Const";
import AlertView from "./AlertView";
import UiModel from "../../ccstudio/data/UiModel";
import Model from "../../ccstudio/data/Model";
import UIPool from "./UIPool";
const { ccclass, property } = cc._decorator;
@ccclass
export default class MsgBox extends UIPool {
    @property(AlertView)
    alertView: AlertView = null;
    // @property(Const)
    // const: Const = null;
    @property(UiModel)
    mgrUi: UiModel = null;
    static open(e: string, t: string = null): AlertView {
        let n = Model.ui.openView(MapUIPrefabs.MsgBox).getComponent(AlertView);
        n.reset();
        n.setTile(t);
        n.setMessage(e);
        return n;
    }
}
