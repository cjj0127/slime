import GuideCondition from "../guide/GuideCondition";
import GuideMgr from "../guide/GuideMgr";
export default class NodeVisibleGuide extends GuideCondition {
    private _nodePaths: Array<number>;
    public isSuccess(): boolean {
        for (let i = 0; i < this._nodePaths.length; i++) {
            const t = GuideMgr.instance.getGuideNode(Number(this._nodePaths[i]));
            if (null == t && cc.error("node is null"), !t || !t.activeInHierarchy)
                return false;
        }
        return true;
    }
    constructor(nodePaths: Array<number>) {
        super();
        this._nodePaths = nodePaths;
    }
}
