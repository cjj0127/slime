import _GuideConfig from "../config/_GuideConfig";
import GuideMgr from "../../modules/guide/GuideMgr";
import LocalStorageTool from "../utils/LocalStorage";
import ModeBase from "./ModelBase";
export default class GuideModel extends ModeBase {
    private guideData: any;
    private guideDataKey: string = "guideData";
    public GetGuide() {
        this.guideData = JSON.parse(LocalStorageTool.getItemLocal(this.guideDataKey));
        return this.guideData;
    }
    public SetGuide(e) {
        this.guideData = e;
        LocalStorageTool.setItemLocal(this.guideDataKey, JSON.stringify(e));
    }
    public initLoadData() {
        const self = this;
        GuideMgr.instance.init({
            saveHandler: function (t) {
                self.SetGuide(t);
            },
            guideData: this.GetGuide(),
            config: _GuideConfig.Instance.getCfg()
        });
    }
    public load() { }
}
