const { ccclass, property } = cc._decorator;
@ccclass
export default class FixCanvas extends cc.Component {
    onLoad() {
        const visibleSize = cc.view.getVisibleSize();
        const canvas = cc.find("Canvas").getComponent(cc.Canvas);
        const designResolution = canvas.designResolution;
        if (visibleSize.width / visibleSize.height > designResolution.width / designResolution.height) {
            canvas.fitWidth = true;
            canvas.fitHeight = true;
            cc.view.setDesignResolutionSize(designResolution.width, designResolution.height, cc.ResolutionPolicy.SHOW_ALL);
        }
    }
}
