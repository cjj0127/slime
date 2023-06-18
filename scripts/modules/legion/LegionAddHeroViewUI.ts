import { MapUIPrefabs } from "../common/Const";
import MsgBox from "../common/MsgBox";
import BattleWorld from "../battle/BattleWorld";
import _HeroConfig from "../../ccstudio/config/_HeroConfig";
import HeroData from "../hero/HeroData";
import LanMgr from "../common/Language";
import AdsModel from "../../ccstudio/data/AdsModel";
import RingModel from "../../ccstudio/data/RingModel";
import UiModel from "../../ccstudio/data/UiModel";
import Model from "../../ccstudio/data/Model";
import AddedHeroListItemUI from "../battle/AddedHeroListItemUI";
import HeroListItemUI from "../hero/HeroListItemUI";
import LegionSelectProgressItemUI from "./LegionSelectProgressItemUI";
import UIPool from "../common/UIPool";
import ViewAnimCtrl from "../../ccstudio/display/ViewAnimCtrl";
const _: any = window["_"];
const { ccclass, property } = cc._decorator;
@ccclass
export default class LegionAddHeroViewUI extends UIPool {
    @property(UIPool)
    addHeroListPool: UIPool = null;
    @property(cc.Layout)
    addedHeroListContent: cc.Layout = null;
    @property(cc.ScrollView)
    addedHeroScrollView: cc.ScrollView = null;
    @property(cc.Button)
    closeBtn: cc.Button = null;
    @property(cc.Button)
    enterBtn: cc.Button = null;
    equipHeroList = [];
    @property(cc.Layout)
    heroListContent: cc.Layout = null;
    heroListItem = [];
    @property(LegionSelectProgressItemUI)
    selectProgressItem: LegionSelectProgressItemUI = null;
    equipMember(heroId: number) {
        const members = HeroData.Instance.battleMembers;
        this.equipHeroList[members.length].setHero(heroId);
        this.scrollItem();
    }
    onClose() {
        this.node.getComponent(ViewAnimCtrl).onClose();
        BattleWorld.Instance.exitBossLevel();
    }
    onDisable() { }
    onEnable() {
        this.refreshHeroList();
        this.refreshEquipList();
        Model.ad.hideBanner();
    }
    async onEnterChooseProp() {
        if (Model.ring.isRingFull()) {
            MsgBox.open(LanMgr.Instance.getLangByID("BagFullTip")).confirm(async () => {
                await Model.ui.openViewAsync(MapUIPrefabs.RingDetailViewUI);
            });
        }
        else {
            HeroData.Instance.battleMembers = HeroData.Instance.battleMembers;
            await Model.ui.openViewAsync(MapUIPrefabs.LegionSelectPropView, {
                data: {
                    wave: 1,
                    heroNum: HeroData.Instance.battleMembers.length + 1
                }
            });
        }
    }
    onLoad() {
        this.closeBtn.node.on("click", this.onClose, this);
        this.enterBtn.node.on("click", this.onEnterChooseProp, this);
    }
    onToggle(event: any) {
        const heroId = event.getComponent(HeroListItemUI).getHeroId();
        const members = HeroData.Instance.battleMembers;
        const index = members.indexOf(heroId);
        if (index >= 0) {
            _.pullAt(members, [index]);
            this.removeMember();
        }
        else {
            members.push(heroId);
            this.equipMember(heroId);
        }
        this.selectProgressItem.showProgress(members.length + 1);
    }
    refreshEquipList() {
        const allHeroes = _HeroConfig.Instance.getAll();
        const numHeroes = _.keys(allHeroes).length;
        const members = HeroData.Instance.battleMembers;
        const battleId = HeroData.Instance.battleId;
        for (let i = 0; i < numHeroes; i++) {
            let item = this.equipHeroList[i];
            if (_.isEmpty(item)) {
                const node = this.addHeroListPool.get();
                node.parent = this.addedHeroListContent.node;
                item = this.equipHeroList[i] = node.getComponent(AddedHeroListItemUI);
            }
            if (!item) {
                debugger;
            }
            item.setCaptain(i == 0);
            if (i == 0) {
                item.setHero(battleId);
            }
            else {
                item.setHero(members[i - 1]);
            }
        }
        this.selectProgressItem.showProgress(members.length + 1);
    }
    refreshHeroList() {
        const allHeroes = _HeroConfig.Instance.getAll();
        const members = HeroData.Instance.battleMembers;
        _.each(allHeroes, (data) => {
            let item = this.heroListItem[data.id];
            if (_.isEmpty(item)) {
                const node = this.get();
                node.parent = this.heroListContent.node;
                item = this.heroListItem[data.id] = node.getComponent(HeroListItemUI);
                item.node.on("toggle", this.onToggle, this);
            }
            item.refreshStatus();
            item.setEquiped(HeroData.Instance.battleId == item.getHeroId());
            const toggle = item.getComponent(cc.Toggle);
            if (item.getHeroId() == HeroData.Instance.battleId ||
                members.indexOf(data.id) >= 0) {
                toggle.check();
            }
            else {
                toggle.uncheck();
            }
            const heroData = HeroData.Instance.getData(data.id);
            item.node.getComponent(cc.Toggle).interactable = heroData != null && data.id !== HeroData.Instance.battleId;
        });
        this.heroListItem[HeroData.Instance.battleId].getComponent(cc.Toggle).check();
    }
    removeMember() {
        const members = HeroData.Instance.battleMembers;
        for (let i = 1; i < this.equipHeroList.length; i++) {
            this.equipHeroList[i].setHero(members[i - 1] || -1);
        }
        this.scrollItem();
    }
    scrollItem() {
        const members = HeroData.Instance.battleMembers;
        const count = this.addedHeroListContent.node.childrenCount;
        const percent = Math.max(0, members.length - 3) / (count - 4);
        this.addedHeroScrollView.scrollToPercentHorizontal(percent, 0.1);
    }
}
