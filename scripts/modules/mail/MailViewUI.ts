import MailMgr from "./MailMgr";
import { MailItem } from "./MailItem";
import { MapUIPrefabs } from "../common/Const";
import AssetPool from "../asset/AssetPool";
import ViewAnimCtrl from "../../ccstudio/display/ViewAnimCtrl";
const { ccclass, property } = cc._decorator;
@ccclass
export default class MailViewUI extends cc.Component {
    @property(cc.Button)
    allReceiveBtn: cc.Button = null;
    @property(cc.Button)
    closeBtn: cc.Button = null;
    @property(cc.Button)
    deleteBtn: cc.Button = null;
    @property(cc.Node)
    emptyNode: cc.Node = null;
    @property(cc.Node)
    mailContentNode: cc.Node = null;
    close() {
        this.node.getComponent(ViewAnimCtrl).onClose();
    }
    freshMailView() {
        const showMail = MailMgr.Instance.getShowMail();
        for (let i = 0; i < showMail.length; i++) {
            const mailItem = AssetPool.Instance.createObject(MapUIPrefabs.MailItem.path);
            mailItem.parent = this.mailContentNode;
            mailItem.getComponent(MailItem).Init(showMail[i]);
        }
    }
    onAllReceiveClick() {
        MailMgr.Instance.receiveAllMail();
    }
    onDeleteClick() {
        MailMgr.Instance.deleteAllMail();
    }
    onLoad() {
        this.closeBtn.node.on("click", this.close, this);
        this.deleteBtn.node.on("click", this.onDeleteClick, this);
        this.allReceiveBtn.node.on("click", this.onAllReceiveClick, this);
        this.refreshView();
    }
    refreshView() {
        const showMail = MailMgr.Instance.getShowMail();
        this.emptyNode.active = showMail.length <= 0;
        if (showMail.length > 0) {
            this.freshMailView();
        }
    }
}
