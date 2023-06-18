import _CollectionConfig from "../config/_CollectionConfig";
import ModeBase from "./ModelBase";
import Model from "./Model";
import { GlobalEventName } from "../../modules/common/Events";
import { E_COLLECTION_TYPE } from "../../modules/common/Const";
import CollectionData from "../../modules/collection/CollectionData";
const _: any = window["_"];
export default class MgrCollection extends ModeBase {
    _symbolLvup = (type: E_COLLECTION_TYPE, t: any) => {
        let collections: number[] = [];
        if (_.isArray(t)) {
            collections = _.reduce(t, (prev, curr) => {
                const collectionIds = _CollectionConfig.Instance.getSymbolCollections(type, curr.id);
                return _.union(prev, collectionIds);
            }, []);
        }
        else {
            collections = _CollectionConfig.Instance.getSymbolCollections(type, t.id);
        }
        _.each(collections, collectionId => {
            const ids = _CollectionConfig.Instance.get(collectionId).ids;
            const unlockLevel = this.calcUnlockLv(type, ids);
            CollectionData.Instance.unlock(collectionId, unlockLevel);
        });
        cc.director.emit(GlobalEventName.CollectionUnlock, collections);
    };
    calcUnlockLv = (type: E_COLLECTION_TYPE, ids: number[]): number => {
        return _.reduce(ids, (prev, curr) => {
            const level = this.getSymbolLv(type, curr);
            return prev < 0 ? level : level > prev ? prev : level;
        }, -1);
    };
    getSymbolLv = (type: E_COLLECTION_TYPE, id: number): number => {
        const symbolMethod = this.symbolLvMethods[type];
        const symbolData = symbolMethod?.getData(id);
        return _.isNil(symbolData) ? 0 : symbolData.level;
    };
    lvup = (id: number): boolean => {
        return !!CollectionData.Instance.lvup(id) && (cc.director.emit(GlobalEventName.CollectionLvup, id), true);
    };
    onGearLvupAllEvent = (e: any, t: any) => {
        this._symbolLvup(E_COLLECTION_TYPE.Gear, t);
    };
    onGearLvupEvent = (e: any) => {
        this._symbolLvup(E_COLLECTION_TYPE.Gear, e);
    };
    onPartnerLvupAllEvent = (e: any) => {
        this._symbolLvup(E_COLLECTION_TYPE.Partner, e);
    };
    onPartnerLvupEvent = (e: any) => {
        this._symbolLvup(E_COLLECTION_TYPE.Partner, e);
    };
    onSkillLlvupEvent = (e: any) => {
        this._symbolLvup(E_COLLECTION_TYPE.Skill, e);
    };
    onSkillLvupAllEvent = (e: any) => {
        this._symbolLvup(E_COLLECTION_TYPE.Skill, e);
    };
    private symbolLvMethods = {};
    initLoadData() {
        const allCollectionData = _CollectionConfig.Instance.getAll();
        _.each(allCollectionData, t => {
            const unlockLevel = this.calcUnlockLv(t.type, t.ids);
            CollectionData.Instance.unlock(t.id, unlockLevel);
        });
        CollectionData.Instance.init();
        CollectionData.Instance.activeProps();
    }
    load() {
        this.symbolLvMethods[E_COLLECTION_TYPE.Gear] = Model.gear; // GearModel.Instance
        this.symbolLvMethods[E_COLLECTION_TYPE.Skill] = Model.skill; // SkillModel.Instance
        this.symbolLvMethods[E_COLLECTION_TYPE.Partner] = Model.partner; // PartnerModel.Instance
        CollectionData.Instance.load();
        cc.director.on(GlobalEventName.GearLevelUp, this.onGearLvupEvent, this);
        cc.director.on(GlobalEventName.GearLevelUpAll, this.onGearLvupAllEvent, this);
        cc.director.on(GlobalEventName.SkillLevelUp, this.onSkillLlvupEvent, this);
        cc.director.on(GlobalEventName.SkillLevelUpAll, this.onSkillLvupAllEvent, this);
        cc.director.on(GlobalEventName.PartnerLevelUp, this.onPartnerLvupEvent, this);
        cc.director.on(GlobalEventName.PartnerLevelUpAll, this.onPartnerLvupAllEvent, this);
    }
}
