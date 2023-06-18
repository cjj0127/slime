import { E_MenuPageId, getViewPageUrl } from "../common/Const";
const { ccclass, property } = cc._decorator;
@ccclass
export default class MenuItem extends cc.Component {
    @property({ type: cc.Enum(E_MenuPageId) })
    pageId = E_MenuPageId.Hero;
    getPageView() {
        return getViewPageUrl(this.pageId);
    }
}
