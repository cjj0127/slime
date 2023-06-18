import { WaitUI } from "../common/Const";
import AssetPool from "../asset/AssetPool";
import UiModel from "../../ccstudio/data/UiModel";
import Model from "../../ccstudio/data/Model";
const { ccclass, property } = cc._decorator;
@ccclass
export default class Wait extends cc.Component {
    @property(cc.Label)
    messageLabel: cc.Label = null;
    private static waitView: Wait = null;
    public static close(): void {
        if (this.waitView) {
            AssetPool.Instance.put(this.waitView.node);
        }
        this.waitView = null;
    }
    public static load(callback?: Function): void {
        cc.resources.load(WaitUI.path, cc.Prefab, (error: Error, prefab: cc.Prefab) => {
            if (error) {
                cc.error("load wait error", error.message);
            }
            else {
                AssetPool.Instance.addPrefab(prefab, WaitUI.path);
            }
            callback && callback();
        });
    }
    public static open(message: string = ""): void {
        if (!this.waitView) {
            const prefabNode = AssetPool.Instance.get(WaitUI.path);
            prefabNode.parent = Model.ui.root();
            this.waitView = prefabNode.getComponent(Wait);
        }
        this.waitView.setMessage(message);
    }
    public setMessage(message: string): void {
        this.messageLabel.string = message;
    }
}
