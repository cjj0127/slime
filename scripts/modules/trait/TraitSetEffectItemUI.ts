import LanMgr from "../common/Language";
import TraitKindIconUI from "./TraitKindIconUI";
import { COLOR_WHITE } from "../common/Const";
import _PropConfig from "../../ccstudio/config/_PropConfig";
const { ccclass, property } = cc._decorator;
const _ = window['_'];
const h = cc.color().fromHEX("#FFAE00");
@ccclass
export default class TraitSetEffectItemUI extends cc.Component {
    @property(TraitKindIconUI)
    icon: TraitKindIconUI = null;
    @property(cc.Label)
    levelLabel: cc.Label = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;
    private propItems: cc.Label[] = [];
    @property(cc.Label)
    propLabel: cc.Label = null;
    addProp(index: number, id: number, n: number, o: number) {
        let r = _PropConfig.Instance.get(id);
        var i = LanMgr.Instance.getLangByID(r.desc);
        var tmp = this.propItems[index];
        if (!tmp) {
            tmp = this.propItems[index] = this.createPropLabel();
        }
        tmp.string = `(${n}) ${i.replace('%{value}', `${o}`)}`;
    }
    private createPropLabel(): cc.Label {
        const e = cc.instantiate(this.propLabel.node);
        e.parent = this.propLabel.node.parent;
        const t = _.last(this.propItems);
        e.x = t.node.x;
        e.y = t.node.y - t.node.height;
        return e.getComponent(cc.Label);
    }
    onLoad() {
        this.propItems.push(this.propLabel);
    }
    setKind(e: number) {
        this.icon.setKind(e);
    }
    setLevel(e: number) {
        _.each(this.propItems, (lbl: cc.Label, index: number) => {
            if (lbl)
                lbl.node.color = e - 1 == index ? h : COLOR_WHITE;
        });
        this.levelLabel.string = `${LanMgr.Instance.getLangByID('LV')} ${e}`;
    }
    setNameStr(e: string) {
        this.nameLabel.string = e;
    }
}
