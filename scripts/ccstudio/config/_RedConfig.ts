import { GlobalEventName } from "../../modules/common/Events";
import { E_ASSET_TYPE, GameConst } from "../../modules/common/Const";
export enum E_RED_Tip {
    eRedRoot = 0,
    eQUEST_CHAIN = 1,
    eQUEST_DAILY = 2,
    eQUEST_ALL_DAILY = 3,
    eQUEST_PASS = 4,
    eCollectionItem = 5,
    eCollectionAll = 6,
    eCollectionGear = 7,
    eCollectionSkill = 8,
    eCollectionPartner = 9,
    eHeroToggle = 10,
    eSkilToggle = 11,
    eWeaponLvupCount = 12,
    eArmorLvupCount = 13,
    eSkillLvupCount = 14,
    eHeroEnhance = 15,
    eHeroMenu = 16,
    ePartnerLvupCount = 17,
    ePartnerMenu = 18,
    eRouletteCount = 19,
    ePassCount = 20,
    ePassHallMenu = 21,
    eMasteryToggle = 200,
    eRouletteFree = 201,
    eRouletteAd = 202,
    eBlessCnt = 203,
    eShopAdCnt = 204,
    eSummonAdCnt = 205,
    eSummonAdItem = 206,
    eQUEST_ALL_AD_DAILY = 207,
    eMineResearchCnt = 208,
    eMineResearchItemCnt = 209,
    eShopMenu = 1e4,
    eWeaponRedCount = 10001,
    eArmorRedCount = 10002,
    eSevenChallenge = 10003,
    eMail = 10004,
    eRingRedCount = 10005
}
export var RedDotCfg = {};
RedDotCfg[E_RED_Tip.eQUEST_CHAIN] = {
    parent: null,
    method: "calcChainCount",
    event: GlobalEventName.ChainQuestStatusChange
};
RedDotCfg[E_RED_Tip.eQUEST_DAILY] = {
    parent: null,
    method: "calcDailyEnable",
    event: [GlobalEventName.DailyQuestStatusChange, GlobalEventName.DailyQuestComplete]
};
RedDotCfg[E_RED_Tip.eQUEST_ALL_DAILY] = {
    parent: null,
    method: "calcAllDailyCount",
    event: [GlobalEventName.DailyQuestStatusChange, GlobalEventName.DailyQuestComplete]
};
RedDotCfg[E_RED_Tip.eQUEST_ALL_AD_DAILY] = {
    parent: null,
    method: "calcAllDailyAdCount",
    event: [GlobalEventName.DailyQuestStatusChange, GlobalEventName.DailyQuestComplete]
};
RedDotCfg[E_RED_Tip.eCollectionItem] = {
    parent: null,
    method: "calcCollectionEnable",
    event: [GlobalEventName.CollectionUnlock, GlobalEventName.CollectionLvup]
};
RedDotCfg[E_RED_Tip.eCollectionGear] = {
    parent: E_RED_Tip.eCollectionAll,
    method: "calcCollectionGear",
    event: [GlobalEventName.CollectionUnlock, GlobalEventName.CollectionLvup]
};
RedDotCfg[E_RED_Tip.eCollectionSkill] = {
    parent: E_RED_Tip.eCollectionAll,
    method: "calcCollectionSkill",
    event: [GlobalEventName.CollectionUnlock, GlobalEventName.CollectionLvup]
};
RedDotCfg[E_RED_Tip.eCollectionPartner] = {
    parent: E_RED_Tip.eCollectionAll,
    method: "calcCollectionPartner",
    event: [GlobalEventName.CollectionUnlock, GlobalEventName.CollectionLvup]
};
RedDotCfg[E_RED_Tip.eCollectionAll] = {
    parent: null
};
RedDotCfg[E_RED_Tip.eHeroEnhance] = {
    parent: E_RED_Tip.eHeroToggle,
    method: "calcHeroEnhanceExpCount",
    event: [GlobalEventName.AssetItemChange + E_ASSET_TYPE.SlimeExp]
};
RedDotCfg[E_RED_Tip.eWeaponLvupCount] = {
    parent: null,
    method: "calcWeaponLvupCount",
    event: [GlobalEventName.GearOwnedChange, GlobalEventName.GearLevelUp, GlobalEventName.GearLevelUpAll, GlobalEventName.GearTrans, GlobalEventName.GearTransAll]
};
RedDotCfg[E_RED_Tip.eArmorLvupCount] = {
    parent: null,
    method: "calcArmorLvupCount",
    event: [GlobalEventName.GearOwnedChange, GlobalEventName.GearLevelUp, GlobalEventName.GearLevelUpAll, GlobalEventName.GearTrans, GlobalEventName.GearTransAll]
};
RedDotCfg[E_RED_Tip.eWeaponRedCount] = {
    parent: E_RED_Tip.eHeroToggle,
    method: "calcWeaponRedCount",
    event: [GlobalEventName.GearOwnedChange, GlobalEventName.GearLevelUp, GlobalEventName.GearLevelUpAll, GlobalEventName.EquipWeaponChange, GlobalEventName.GearTrans, GlobalEventName.GearTransAll]
};
RedDotCfg[E_RED_Tip.eArmorRedCount] = {
    parent: E_RED_Tip.eHeroToggle,
    method: "calcArmorRedCount",
    event: [GlobalEventName.GearOwnedChange, GlobalEventName.GearLevelUp, GlobalEventName.GearLevelUpAll, GlobalEventName.EquipArmorChange, GlobalEventName.GearTrans, GlobalEventName.GearTransAll]
};
RedDotCfg[E_RED_Tip.eSkillLvupCount] = {
    parent: E_RED_Tip.eSkilToggle,
    method: "calcSkillCount",
    event: [GlobalEventName.SkillOwnedChange, GlobalEventName.SkillLevelUp, GlobalEventName.SkillLevelUpAll, GlobalEventName.SkillTrans, GlobalEventName.SkillTransAll]
};
RedDotCfg[E_RED_Tip.eHeroToggle] = {
    parent: E_RED_Tip.eHeroMenu
};
RedDotCfg[E_RED_Tip.eSkilToggle] = {
    parent: E_RED_Tip.eHeroMenu
};
RedDotCfg[E_RED_Tip.eHeroMenu] = {
    parent: null
};
RedDotCfg[E_RED_Tip.ePartnerLvupCount] = {
    parent: E_RED_Tip.ePartnerMenu,
    method: "calcPartnerCount",
    event: [GlobalEventName.PartnerOwnedChange, GlobalEventName.PartnerLevelUp, GlobalEventName.PartnerLevelUpAll, GlobalEventName.PartnerTrans, GlobalEventName.PartnerTransAll]
};
RedDotCfg[E_RED_Tip.ePartnerMenu] = {
    parent: null
};
RedDotCfg[E_RED_Tip.eRouletteCount] = {
    parent: null,
    method: "calcRouletteCount",
    event: [GlobalEventName.RouletteCountChange]
};
RedDotCfg[E_RED_Tip.eQUEST_PASS] = {
    parent: E_RED_Tip.ePassHallMenu,
    method: "calcQuestPassCount",
    event: [GlobalEventName.PassQuestComplete, GlobalEventName.PassQuestReceived]
};
RedDotCfg[E_RED_Tip.ePassCount] = {
    parent: E_RED_Tip.ePassHallMenu,
    method: "calcPassCount",
    event: [GlobalEventName.PassActivePremium, GlobalEventName.PassLevelChange, GlobalEventName.PassExpChange, GlobalEventName.PassExtralExpChange, GlobalEventName.PassReceivedNormal, GlobalEventName.PassReceivedPremium, GlobalEventName.PassReceivedExtral]
};
RedDotCfg[E_RED_Tip.ePassHallMenu] = {
    parent: null
};
RedDotCfg[E_RED_Tip.eShopMenu] = {
    parent: null,
    method: "calceShopCount",
    event: [GlobalEventName.ShopPurchaseSuccess + GameConst.SHOP_FREE_ID]
};
RedDotCfg[E_RED_Tip.eMasteryToggle] = {
    parent: E_RED_Tip.eHeroMenu,
    method: "calceMasteryCount",
    event: [GlobalEventName.AssetItemChange + E_ASSET_TYPE.Sp, GlobalEventName.MasteryLvChange, GlobalEventName.MasteryUnlock]
};
RedDotCfg[E_RED_Tip.eRouletteFree] = {
    parent: null,
    method: "calceRouletteFreeCount",
    event: GlobalEventName.RouletteSendReward
};
RedDotCfg[E_RED_Tip.eRouletteAd] = {
    parent: null,
    method: "calceRouletteAdCount",
    event: GlobalEventName.RouletteSendReward
};
RedDotCfg[E_RED_Tip.eBlessCnt] = {
    parent: null,
    method: "calceBlessCount",
    event: GlobalEventName.BlessTakeEffect
};
RedDotCfg[E_RED_Tip.eShopAdCnt] = {
    parent: null,
    method: "calceMenuShopAdCount",
    event: [GlobalEventName.SummonSuccess, GlobalEventName.ShopPurchaseSuccess + GameConst.SHOP_FREE_ID, GlobalEventName.UnlockShop, GlobalEventName.UnlockEquip, GlobalEventName.UnlockPartner, GlobalEventName.UnlockSkill]
};
RedDotCfg[E_RED_Tip.eSummonAdCnt] = {
    parent: null,
    method: "calceSummonAdCount",
    event: [GlobalEventName.SummonSuccess, GlobalEventName.UnlockShop, GlobalEventName.UnlockEquip, GlobalEventName.UnlockPartner, GlobalEventName.UnlockSkill]
};
RedDotCfg[E_RED_Tip.eSummonAdItem] = {
    parent: null,
    method: "calcSummonItemCount",
    event: [GlobalEventName.SummonSuccess]
};
RedDotCfg[E_RED_Tip.eMineResearchCnt] = {
    parent: null,
    method: "calcMineResearchCount",
    event: [GlobalEventName.UnlockMine, GlobalEventName.MineResearchStartUpgrading, GlobalEventName.MineResearchComplete, GlobalEventName.MineResearchDone, GlobalEventName.MineResearchUnlock, GlobalEventName.AssetItemChange + E_ASSET_TYPE.MineCube]
};
RedDotCfg[E_RED_Tip.eMineResearchItemCnt] = {
    parent: null,
    method: "calcMineResearchItemEnable",
    event: [GlobalEventName.UnlockMine, GlobalEventName.MineResearchStartUpgrading, GlobalEventName.MineResearchComplete, GlobalEventName.MineResearchDone, GlobalEventName.MineResearchUnlock, GlobalEventName.AssetItemChange + E_ASSET_TYPE.MineCube]
};
RedDotCfg[E_RED_Tip.eSevenChallenge] = {
    parent: null,
    method: "calcSevenChallengeRedDot",
    event: [GlobalEventName.UnlockSevenChallenge, GlobalEventName.SevenChallengeQuestStatusChange]
};
RedDotCfg[E_RED_Tip.eMail] = {
    parent: null,
    method: "calcMailRedDot",
    event: []
};
RedDotCfg[E_RED_Tip.eRingRedCount] = {
    parent: null,
    method: "calRingRedCount",
    event: []
};
