import LanMgr from "../common/Language";
import { GlobalEventName } from "../common/Events";
import { E_MenuToggleType, MapUIPrefabs, E_ASSET_TYPE, COLOR_WHITE, COLOR_RED } from "../common/Const";
import RelicModel from "../../ccstudio/data/RelicModel";
import UiModel from "../../ccstudio/data/UiModel";
import Model from "../../ccstudio/data/Model";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import _RelicConfig from "../../ccstudio/config/_RelicConfig";
import _RelicCostConfig from "../../ccstudio/config/_RelicCostConfig";
import RelicData_, { RELIC_TOTAL_COUNT } from "./RelicData_";
import RelicTypeItemUI from "./RelicTypeItemUI";
import UserData from "../user/UserData";
const b: any = window["_"];
const { ccclass, property } = cc._decorator;
@ccclass
export default class RelicPageViewUI extends cc.Component {
    @property(cc.Button)
    btnClose: cc.Button = null;
    @property(cc.Button)
    btnCollection: cc.Button = null;
    @property(cc.Button)
    btnFindRelic: cc.Button = null;
    @property(cc.Label)
    forkCostLabel: cc.Label = null;
    @property(cc.Label)
    forkCountLabel: cc.Label = null;
    @property(cc.Label)
    foundCntLabel: cc.Label = null;
    typeItems: {
        [key: string]: RelicTypeItemUI;
    } = {};
    onChangeEquipRelic(e: number) {
        const t = _RelicConfig.Instance.getType(e);
        this.typeItems[t].refresh();
    }
    onClickClose() {
        cc.director.emit(GlobalEventName.ClosePageView, E_MenuToggleType.Hero);
    }
    onCollection() {
        Model.ui.openViewAsync(MapUIPrefabs.RelicCollectionView);
    }
    onDisable() {
        cc.director.targetOff(this);
    }
    onEnable() {
        this.refreshForkCount();
        this.refreshCostCount();
        this.refreshStatus();
        this.refreshFoundCnt();
        this.refreshRelicTypes();
        cc.director.on(GlobalEventName.AssetItemChange + E_ASSET_TYPE.Fork, this.onForkChnage, this);
        cc.director.on(GlobalEventName.RelicEquipedChange, this.onChangeEquipRelic, this);
    }
    onFindRelic() {
        if (RelicData_.Instance.getRelicCount() < RELIC_TOTAL_COUNT) {
            const e = Model.relic.findRelic();
            if (e >= 0) {
                const t = _RelicConfig.Instance.get(e);
                this.typeItems[t.type].refresh();
                this.playActiveId(e);
                this.refreshStatus();
                this.refreshFoundCnt();
                this.refreshCostCount();
            }
        }
    }
    onForkChnage() {
        this.refreshForkCount();
    }
    onLoad() {
        this.btnClose.node.on("click", this.onClickClose, this);
        this.btnCollection.node.on("click", this.onCollection, this);
        this.btnFindRelic.node.on("click", this.onFindRelic, this);
        const t = this.node.getComponentsInChildren(RelicTypeItemUI);
        t.forEach((t: RelicTypeItemUI, n: number) => {
            const o = n + 1;
            t.typeId = o;
            this.typeItems[o] = t;
        });
    }
    playActiveId(e: number) {
        Model.ui.openViewAsync(MapUIPrefabs.RelicFindResult, { data: e });
    }
    refreshCostCount() {
        const e = RelicData_.Instance.getRelicCount();
        if (e < RELIC_TOTAL_COUNT) {
            const t = _RelicCostConfig.Instance.get(e).cost;
            this.forkCostLabel.string = NumberPlus.format(t);
            const n = UserData.Instance.getItem(E_ASSET_TYPE.Fork);
            this.forkCostLabel.node.color = NumberPlus.compare(n, t) ? COLOR_WHITE : COLOR_RED;
        }
    }
    refreshForkCount() {
        const e = UserData.Instance.getItem(E_ASSET_TYPE.Fork);
        this.forkCountLabel.string = NumberPlus.format(e);
    }
    refreshFoundCnt() {
        this.foundCntLabel.string = LanMgr.Instance.getLangByID("discovered_relic") + ":" + RelicData_.Instance.getRelicCount() + "/" + RELIC_TOTAL_COUNT;
    }
    refreshRelicTypes() {
        b.each(this.typeItems, (e) => {
            e.refresh();
        });
    }
    refreshStatus() {
        const e = RelicData_.Instance.getRelicCount();
        this.btnFindRelic.node.active = e < RELIC_TOTAL_COUNT;
    }
}
