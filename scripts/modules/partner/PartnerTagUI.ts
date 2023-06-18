import LanMgr from "../common/Language";
// import Language from 'Language';
const { ccclass, property } = cc._decorator;
@ccclass
export default class PartnerTagUI extends cc.Component {
    @property(cc.Label)
    label = null;
    setNameStr(e) {
        this.label.string = LanMgr.Instance.getLangByID(e);
    }
}
