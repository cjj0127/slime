import App from "./App";
import AppConstDefine from "./common/AppConst";
const { ccclass, property } = cc._decorator;
@ccclass
export default class Start extends cc.Component {
    @property(cc.Label)
    version: cc.Label = null;
    onEnable() {
        this.version.string = `v:${AppConstDefine.VERSION}`;
        const e = new cc.Node("App");
        e.parent = cc.director.getScene().parent;
        e.addComponent(App);
        const t = e.addComponent(cc.Widget);
        t.isAlignTop = t.isAlignBottom = t.isAlignLeft = t.isAlignRight = true;
        t.top = t.bottom = t.left = t.right = 0;
        cc.game.addPersistRootNode(e);
    }
}
