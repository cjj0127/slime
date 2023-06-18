const { ccclass, property } = cc._decorator;
@ccclass
export default class RecordShare extends cc.Component {
    @property(cc.Button)
    btnClose: cc.Button = null;
    @property(cc.Button)
    btnShare: cc.Button = null;
    onClickClose() {
        // TtAdManager.ttSdk.clearVideoPath();
        // this.node.emit("Close");
        // this.node.once("removed", () => { });
    }
    onClickShare() {
        // const self = this;
        // TtAdManager.ttSdk.shareRecordVideo(
        //     function () {
        //         self.onClickClose();
        //         const pos = self.node.convertToWorldSpaceAR(cc.Vec3.ZERO);
        //         UserData.Instance.addDiams(100, {
        //             sourcePos: pos,
        //             type: UserDatAssetGetType.GemBox
        //         });
        //     },
        //     function () {
        //         self.onClickClose();
        //     }
        // );
    }
    onLoad() {
        this.btnClose.node.on("click", this.onClickClose, this);
        this.btnShare.node.on("click", this.onClickShare, this);
    }
    start() { }
}
