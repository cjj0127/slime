const { ccclass, property } = cc._decorator;
@ccclass
export default class BackgroundFix extends cc.Component {
    @property
    nodeHeight: number = 0;
    @property
    nodeWidth: number = 0;
    onLoad() {
        this.nodeWidth = this.node.width;
        this.nodeHeight = this.node.height;
    }
    start() {
        const viewSize = cc.view.getVisibleSize();
        if (this.nodeWidth / this.node.height < viewSize.width / viewSize.height) {
            this.node.scale = viewSize.width / this.nodeWidth;
        }
        else {
            this.node.scale = viewSize.height / this.node.height;
        }
    }
}
