export enum E_PROP_PRECENT_T {
    Percent = 1,
    Value = 2
}
export enum ENUM_PROP_TYPE {
    NONE = 0,
    ATK = 1,
    HP = 2,
    HPRecovery = 3,
    ASPD = 4,
    CriticalHitChance = 5,
    CriticalHitDamage = 6,
    DoubleShot = 7,
    TripleShot = 8,
    MoveSpeed = 9,
    CoinAdd = 10,
    SkillHurtAdd = 11,
    PartnerAspd = 12,
    BossDamageAmount = 13,
    SkillCd = 14,
    BlessCoins = 15,
    BlessAtk = 16,
    BlessSkill = 17,
    HeroExpAdd = 18,
    NormalAtk = 19,
    HPRecoveryRate = 20,
    PartnerAspdRelic2 = 21,
    PartnerAtkRelic3 = 22,
    PartnerAtk = 23,
    PartnerAspdRelic12 = 24,
    BaseAtk = 50,
    BaseHP = 51,
    AddAtk = 52,
    BossBattleTime = 53,
    PickaxSpeed = 100,
    PickaxMax = 101,
    CubeAdd = 102,
    ResearchSpeedAdd = 103,
    BuffAspd = 201,
    EnemyDamagePercent = 1100
}
export enum EATK_TYPE {
    Near = 1,
    Long = 2
}
export enum ESYS_ID {
    Level = 1,
    BossRush = 2,
    GoldRush = 3,
    VillageRaid = 4,
    DwarvenKing = 5,
    SlimeLegion = 6,
    Hero = 7,
    Gear = 8,
    Skill = 9,
    Partner = 10,
    Mine = 11,
    Pass = 12
}
export enum E_ITEM_TYPE {
    Asset = 1,
    Gear = 2,
    Skill = 3,
    Hero = 4,
    Partner = 5
}
export enum E_ASSET_TYPE {
    Cash = 0,
    Coin = 1,
    Diamond = 2,
    SlimeExp = 3,
    BossRushKey = 4,
    GoldRushKey = 5,
    CaveRushKey = 6,
    DwarvenKing = 7,
    HeroLegion = 8,
    Sp = 10,
    Tailt = 11,
    Fork = 12,
    RingChip = 20,
    Ad = 99,
    MineCube = 100,
    MinePickax = 101,
    MineDrill = 102,
    MineBomb = 103,
    PassExp = 1e3,
    SummonBox = 2e3,
    SummonBoxBig = 2001,
    SummonBoxSuper = 2002,
    RobCoin1 = 3001,
    RobCoin2 = 3002,
    RobCoin3 = 3003,
    RobBuild1 = 4001,
    RobBuild2 = 4002,
    RobBuild3 = 4003,
    RobBuild4 = 4004,
    RobBuild5 = 4005,
    RobBuild6 = 4006,
    RobBuild7 = 4007,
    RobBuild8 = 4008,
    Equip = 10002,
    Skill = 10003,
    Hero = 10004,
    Partner = 10005
}
export enum E_Direction {
    LEFT = 0,
    RIGHT = 1,
    TOP = 2,
    BOTTOM = 3
}
export var COLOR_RED = cc.Color.RED;
export var COLOR_WHITE = cc.Color.WHITE;
export var COLOR_GRAY = cc.Color.GRAY;
export var COLOR_GREEN = cc.Color.GREEN;
export var DAY_MINUTES = 1440;
export var HOUR_SECONDS = 3600;
export var DAY_SECONDS = 60 * DAY_MINUTES;
export var WEEK_SECONDS = 7 * HOUR_SECONDS;
export var LEVEL_DIFFICULTY_NAME = ["Normal", "Hard", "Very Hard", "Hell"];
export var LEVEL_NAME_NUM = ["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "Ⅵ", "Ⅶ", "Ⅷ", "Ⅸ", "Ⅹ"];
export var LEVEL_DIFFICULTY_COLOR = [
    cc.color().fromHEX("#A1A1A1"),
    cc.color().fromHEX("#E1A618"),
    cc.color().fromHEX("#FFF900"),
    cc.color().fromHEX("#FF0000")
];
export enum E_SKILL_TYPE {
    Hero = 1,
    Summon = 2
}
export enum E_SKILL_FIRE_TYPE {
    Bullet = 0,
    Summon = 1,
    Buff = 2,
    Script = 3
}
export enum E_SKILL_STATE {
    Idle = 0,
    Duration = 1,
    Cd = 2
}
export enum E_BULLET_TRACK {
    Line = 1,
    Jump = 2,
    Drop = 3,
    Fly = 4
}
export enum E_ENTITY_GROUP {
    HERO = 1,
    Partner = 2,
    Helper = 3,
    Enemy = 4
}
export enum E_ENEMY_TYPE {
    Normal = 1,
    Boss = 2,
    House = 3
}
export enum E_GEAR_TYPE {
    WEAPON = 1,
    ARMOR = 2
}
export enum E_MenuPageId {
    Hero = 0,
    Panter = 1,
    Boss = 2,
    Mine = 3,
    Shop = 4
}
export enum E_ToggleHeroType {
    Hero = 0,
    Skill = 1,
    Mastery = 2
}
export enum E_ToggleShopType {
    Summon = 0,
    Package = 1,
    LimitedShop = 2,
    Currency = 3
}
export enum E_MenuToggleType {
    Hero = 0,
    Partner = 1,
    Battle = 2,
    Mine = 3,
    Shop = 4
}
export var Q_NAME = ["", "Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythic", "Exotic"];
export var Q_COLOR = ["", "E3E1CF", "B2DF6D", "6D85DF", "DF6DD8", "E68225", "4fdea3", "D41010"];
export var Q_SPRITE_FRAME = ["", "item_quality_1", "item_quality_2", "item_quality_3", "item_quality_4", "item_quality_5", "item_quality_6", "item_quality_7"];
export enum E_SUMMON_TYPE {
    Skill = 1,
    Partner = 2,
    Gear = 3,
    Weapon = 4,
    Armor = 5
}
export enum E_ENHANCE_TYPE {
    Gear = 1,
    Skill = 2,
    Panter = 3
}
export var GameConst = {
    ATK_FRE: 1,
    BLESS_DURATION: 20,
    BOMB_AD_GET_NUMBER: 1,
    BOSS_AD_REPLENISHED_COUNT: 2,
    BOSS_AUTO_REPLENISHED_COUNT: 2,
    BOSS_RUSH_BASE_REWARD_COUNT: 500,
    CHAIN_QUEST_DEFAULT_ID: 1,
    CHEST_CD: 10,
    CHEST_DIAMAND_AMOUNT: 500,
    CHEST_GOLD_AMOUNT: 200,
    DEFAULT_HERO_ID: 41101,
    DRILL_AD_GET_NUMBER: 1,
    DWARVENKING_ATTACK_CD: 8,
    DWARVENKING_BOSS_ID: 11016,
    EXTRA_OBTAIN: 360,
    EXTRA_OBTAINCD: 60,
    GEARMAXLEVEL_NUM: 5,
    GUIDE_END: 20050,
    HERO_EXP_AD_GET_NUMBER: 1,
    HERO_EXP_AD_NUMBER: 2,
    HP_RECOVERY_FRE: 1,
    IDLE_REWARD_GEAR_TIME: 10,
    IDLE_REWARD_MAX_TIME: 720,
    INADS_LEVELPART_ID: [11, 32, 51],
    INADS_LEVELSTART_ID: 11,
    INADS_LEVEL_CD: [90, 90, 45],
    INADS_LEVEL_INTERVAL: [3, 2, 2],
    INADS_REWARD_CD: 90,
    INITIAL_EXP: 50,
    LEGION_AD_REFRESH_NUM: 1,
    LEGION_AD_REPLENISHED_COUNT: 2,
    LEGION_KEY_NUM: 1,
    LIMITTIME_BOSSRUSH: 60,
    LIMITTIME_CAVERUSH: 40,
    LIMITTIME_DWARVENKING: 50,
    LIMITTIME_GOLDRUSH: 40,
    LIMITTIME_STAGE: 30,
    LVUP_NEED_COUNTS: [],
    MASTERY_RESET_PRICE: 10,
    MINE_RESEARCH_AD_CD: 600,
    NEW_VERSION_UPDATE_REWERD: 2e3,
    PARTNERMAXLEVEL_NUM: 5,
    PASS_EXTRAL_REWARD_COUNT: 50,
    PASS_MAX_EXP: 20,
    PASS_MAX_LEVEL: 30,
    PASS_SHOPID: 1,
    PICKAX_AD_DAILY_COUNT: 2,
    PICKAX_AD_NUMBER: 15,
    PICKAX_DEFAULT_CD: 900,
    PICKAX_DEFAULT_MAX_CNT: 60,
    PICKAX_INITIAL_NUMBER: 100,
    PLUNDER_BUILDINGTYPE_ADD: 50,
    PLUNDER_SPEEDUP_MAXTIME: 180,
    PLUNDER_SPEEDUP_NUM: 2,
    PLUNDER_SPEEDUP_TIME: 60,
    RELIC_TIMES: 70,
    ROULETTE_SPIN_INTERVAL: 5,
    ROULETTE_SPIN_MAX_COUNT: 5,
    SCROLL_TIP_CD: 60,
    SEVENCHALLENGE_LAST_TIME: 28,
    SHARE_VIDEO_DURATION: 15,
    SHOP_FREE_ID: 2001,
    SKILLMAXLEVEL_NUM: 5,
    SUBSCRIBE_PROMISS_CHALLENGE_CD: 24,
    SUBSCRIBE_PROMISS_HANGUP_CD: 20,
    SUBSCRIBE_PROMISS_STORE_CD: 24,
    SUBSCRIBE_PROMISS_VERSION_CD: 30,
    SUBSCRIBE_REJECT_CHALLENGE_CD: 48,
    SUBSCRIBE_REJECT_HANGUP_CD: 48,
    SUBSCRIBE_REJECT_STORE_CD: 48,
    SUBSCRIBE_REJECT_VERSION_CD: 30,
    SUMMON_AD_DAILY_COUNT: 3,
    SUMMON_AD_INITIAL: 11,
    SUMMON_AD_INTERVAL: 8,
    SUMMON_AD_LIMIT: 35,
    SUMMON_LVUP_COUNTS: [],
    SUMMON_PRICE_FULL: 1500,
    SUMMON_PRICE_NORMAL: 500,
    TRAIT_AD_GET_NUMBER: 50,
    TRAIT_AD_NUMBER: 2,
    TRAIT_INITIAL: 10,
    TRAIT_MIN_NUMBER_AD: 25,
    TREASURE_TIMES: 10
};
export enum E_UNLOCK_STATE {
    Locked = 0,
    Unlocked = 1,
    WaitUnlock = 2
}
export enum E_GAME_LEVEL_TYPE {
    Normal = 0,
    BossRush = 1,
    GoldRush = 2,
    VillageRaid = 3,
    DwarvenKing = 4,
    SlimeLegion = 5,
    CaveRush = 6,
    LegionRush = 7
}
export enum E_QUEST_ACTIVE_ID {
    DefeatEnemy = 1,
    ClearStage = 2,
    ClearBoss = 3,
    ClearGold = 4,
    Summon = 5,
    SummonGear = 6,
    SummonSkill = 7,
    SummonPartner = 8,
    WatchAds = 9,
    DailyQuest = 10,
    EnhanceAtk = 11,
    EnhanceHp = 12,
    EnhanceHPRecovery = 13,
    EnhanceAspd = 14,
    EnhanceCriticalHitChance = 15,
    EnhanceCriticalHitDamage = 16,
    EnhanceDouble = 17,
    EnhanceTriple = 18,
    EnhanceSkill = 19,
    EnhanceGear = 20,
    EnhancePartner = 21,
    MineDig = 22,
    MineResearch = 23,
    UserLogin = 24,
    ObtainReceive = 25,
    ClearVillageRaid = 26,
    ClearDwarvenKing = 27,
    MineUseDrill = 28,
    MineUseBomb = 29,
    MineUsePickax = 30,
    ReceiveChest = 31,
    ReceiveBless = 32,
    HeroLvup = 33,
    ClearCaveRush = 34,
    GetRelic = 35,
    EnhanceRelic = 36,
    ClearLegionRush = 37
}
export enum E_QUEST_TYPE {
    Daily = 1,
    Chain = 2,
    Pass = 3,
    SevenChallenge = 4
}
export enum E_QUEST_VALUE_UPDATE_TYPE {
    Count = 1,
    Set = 2
}
export enum E_QUEST_STATUS {
    Close = 0,
    Job = 1,
    InAD = 2,
    Complete = 3,
    Finish = 4
}
export enum E_CYCLE_TYPE {
    None = 0,
    Daily = 1,
    Weekly = 2,
    Month = 3,
    Forever = 4
}
export enum E_COLLECTION_TYPE {
    Gear = 1,
    Skill = 2,
    Partner = 3
}
export enum E_SHOP_TYPE {
    Pass = 0,
    Package = 1,
    Daily = 2,
    Weekly = 3,
    Currency = 4
}
export enum E_SHOP_GOODS_TYPE {
    Asset = 1,
    Gear = 2,
    Skill = 3,
    Partner = 4,
    Slime = 5,
    RmAd = 6,
    AutoBlessing = 7
}
export enum E_SHOP_TRIGGER_ID {
    None = 0,
    Level = 1,
    Login = 2,
    StartDate = 3,
    CloseDate = 4,
    PayLower = 5,
    PayUpper = 6,
    Sys = 7,
    Hero = 8,
    Pass = 9,
    Interval = 10
}
export enum E_LegionUpType {
    None = 0,
    Mushroom = 1,
    Ring = 2
}
export enum E_LegionHeroRingAddType {
    None = 0,
    AddLevel = 1,
    AddQuality = 2
}
export enum E_UnlockSysType {
    None = 0,
    Level = 1,
    MineDeep = 2,
    Task = 3,
    DoubleShot = 4,
    TripleShot = 5
}
export var _RELIC_TYPE_NAME = ["", "relic_type_1", "relic_type_2", "relic_type_3", "relic_type_4", "relic_type_5", "relic_type_6", "relic_type_7"];
export var _TREASURE_TYPE_NAME = ["", "treasure_type_1", "treasure_type_2", "treasure_type_3", "treasure_type_4", "treasure_type_5", "treasure_type_6"];
export var _UNLOCKSYS_LAN_ID = ["", "LevelUnlockTip", "MineUnlockTip", "TaskUnlockTip", "DoubleShotUnlockTip", "TripleShotUnlockTip"];
export enum EUNLOCKSYS_ID {
    None = 0,
    Mine = 101,
    Rob = 102,
    BossRush = 201,
    GoldRush = 202,
    Relices = 203,
    Trait = 204,
    HeroRush = 205,
    Shop = 300,
    Equip = 301,
    Partner = 401,
    PartnerCol2 = 402,
    PartnerCol3 = 403,
    PartnerCol4 = 404,
    PartnerCol5 = 405,
    Skill = 501,
    SkillCol2 = 502,
    SkillCol3 = 503,
    SkillCol4 = 504,
    SkillCol5 = 505,
    SkillCol6 = 506,
    Hero = 601,
    Mastery = 602,
    Atlas = 701,
    Wheel = 702,
    Sign = 703,
    Pass = 704,
    Task = 705,
    Hangup = 706,
    Bless = 707,
    FlyChest = 708,
    DoubleShotAtribute = 801,
    TripleShotAtribute = 802,
    SevenChallenge = 901
}
export var GRADE_SPRITE_ = ["SS", "S", "A", "B", "C", "D", "E", "F"];
export var ROB_BUILDTYPE_ = ["", "forest", "waters", "sky", "mountain"];
export var ROB_BUILDTYPE_COLOR_ = ["", "#03B03C", "#24A5F1", "#89FAFB", "#F2A01E"];
export var GAME_SPINE_PATH_ = "Spines";
export var GAME_SKILL_PATH_ = "Skill";
export var IMAGE_ICON_PATH_ = "UI/Images/Icon";
export var QUALITY_SPRITE_PATH_ = "UI/Images/Icon";
export var MINE_IMAGE_URL_ = "UI/Images/Mine";
export var ROB_IMAGE_URL_ = "UI/Images/Rob";
export var MEMBER_PREFAB_URL_ = "Prefabs/Hero/member";
export var SPINE_DATA_PATH_ = "Spines/Effects";
export var SPINE_DATA_EFFECT_ = "effects";
export var GAME_SCENE_PATH_ = "Prefabs/Scene";
export var SHOP_ITEM_PATH_ = "Prefabs/Shop";
export var GamePrefabs_ = {
    HpBar: { path: "Prefabs/BattlePrefabs/hpBar" },
    HpBarBoss: { path: "Prefabs/BattlePrefabs/hpBarBoss" },
    HpDamage: { path: "Prefabs/BattlePrefabs/hpDamage" },
    Hurt: { path: "Prefabs/Effect/HurtView" },
    LvUp: "Prefabs/Effect/LevelUp",
    SkillBullet1004: { path: "Prefabs/Bullets/bullet1004" },
    SkillBullet1005: { path: "Prefabs/Bullets/bullet1005" },
    SkillBullet1005_1: { path: "Prefabs/Bullets/bullet1005_1" },
    SkillBullet24101: { path: "Prefabs/Bullets/bullet24101" },
    SkillBullet24103: { path: "Prefabs/Bullets/bullet24103" },
    SkillBullet25101: { path: "Prefabs/Bullets/bullet25101" },
    SkillBulletEmpty: { path: "Prefabs/Bullets/bulletEmpty" }
};
export var MapUIPrefabs = {
    MsgBox: { path: "Prefabs/AlertView", preload: true },
    Armor: { path: "Prefabs/GearArmorViewUI" },
    AssetCompensation: { path: "Prefabs/AssetCompensationUI", viewComp: "AssetCompensationUI" },
    AssetHeroInfo: { path: "Prefabs/AssetHeroInfoUI" },
    AssetInfo: { path: "Prefabs/AssetInfoUI" },
    AssetListInfo: { path: "Prefabs/AssetListInfoUI" },
    AssetReceiveView: { path: "Prefabs/UIAssetReceiveView", viewComp: "UIAssetReceiveView" },
    BlessPropView: { path: "Prefabs/BlessPropViewUI" },
    BossBattleTip: { path: "Prefabs/BossLevel/BossBattleTipUI", viewComp: "BossBattleTipUI" },
    BossLevelMask: { path: "Prefabs/BossLevel/BossLevelMaskUI", preload: true },
    BossLevelReward: { path: "Prefabs/BossLevel/BossLevelRewardViewUI", viewComp: "BossRewardViewUI" },
    CollectionView: { path: "Prefabs/CollectionViewUI" },
    DayRewardView: { path: "Prefabs/SevenChallenge/UIDayRewardView", viewComp: "UIDayRewardView" },
    DwarvenKingReward: { path: "Prefabs/BossLevel/DwarvenKingRewardUI", viewComp: "DwarvenKingReward" },
    DwarvenKingRewardItem: { path: "Prefabs/BossLevel/DwarvenKingRewardItemUI" },
    EnhanceResult: { path: "Prefabs/EnhanceResultUI", viewComp: "UIEnhanceResultView" },
    FingerGuide: { path: "Prefabs/Guide/FingerGuide", preload: true },
    Game: { path: "Prefabs/Game", preload: true },
    GameLost: { path: "Prefabs/GameLostUI" },
    GuideTextUI: { path: "Prefabs/Guide/GuideTextUI", preload: true },
    GuideUI: { path: "Prefabs/Guide/GuideUI", preload: true },
    GuideUnlock: { path: "Prefabs/Guide/GuideUnlock" },
    HeroLevelPropPop: { path: "Prefabs/HeroView/HeroLevelPropPopUI", viewComp: "HeroLevelPropPopUI" },
    HeroListView: { path: "Prefabs/HeroView/HeroListViewUI" },
    HeroUnlockProp: { path: "Prefabs/HeroView/HeroUnlockPropUI", viewComp: "HeroUnlockPropUI" },
    IdleBonusView: { path: "Prefabs/IdleChest/IdleBonusViewUI" },
    IdleChestView: { path: "Prefabs/IdleChest/UIIdleChestView" },
    ItemContent: { path: "Prefabs/ItemContent", preload: true },
    LegionAddHeroView: { path: "Prefabs/LegionRush/LegionAddHeroViewUI", viewComp: "LegionAddHeroViewUI" },
    LegionAddationInfo: { path: "Prefabs/LegionRush/LegionAddationInfoUI" },
    LegionEndView: { path: "Prefabs/LegionRush/LegionEndViewUI", viewComp: "LegionEndViewUI" },
    LegionPropDetailView: { path: "Prefabs/LegionRush/LegionPropDetailViewUI", viewComp: "LegionPropDetailViewUI" },
    LegionRushRewardView: { path: "Prefabs/BossLevel/LegionRushRewardViewUI", viewComp: "LegionRushRewardViewUI" },
    LegionSelectPropView: { path: "Prefabs/LegionRush/LegionSelectPropViewUI", viewComp: "LegionSelectPropViewUI" },
    LevelTip: { path: "Prefabs/GameLevelTipUI" },
    MailInfoView: { path: "Prefabs/Mail/MailInfoViewUI" },
    MailItem: { path: "Prefabs/Mail/MailItem" },
    MailView: { path: "Prefabs/Mail/MailViewUI" },
    MaskUI: { path: "Prefabs/MaskUI", preload: true },
    MineBomb: { path: "Prefabs/Effect/Bomb" },
    MineItem: { path: "Prefabs/MineItemUI" },
    MineResearchComplete: { path: "Prefabs/MineResearchCompleteUI", viewComp: "MineResearchCompleteUI" },
    MineResearchView: { path: "Prefabs/MineResearchViewUI" },
    MineView: { path: "Prefabs/MineViewUI" },
    PageBoss: { path: "Prefabs/BossLevel/BossViewUI", preload: true },
    PageHero: { path: "Prefabs/HeroView/HeroViewUI", viewComp: "HeroViewUI", preload: true },
    PageMine: { path: "Prefabs/MinePageViewUI", preload: true },
    PagePartner: { path: "Prefabs/PartnerViewUI", preload: true },
    PageShop: { path: "Prefabs/Shop/ShopViewUI", viewComp: "ShopViewUI", preload: true },
    PartnerDetail: { path: "Prefabs/PartnerDetailViewUI", viewComp: "PartnerDetailViewUI" },
    PassRewardView: { path: "Prefabs/PassRewardViewUI", viewComp: "PassRewardViewUI" },
    PassView: { path: "Prefabs/PassViewUI" },
    QuestDailyItem: { path: "Prefabs/DailyQuestItemUI" },
    QuestDailyView: { path: "Prefabs/DailyQuestViewUI" },
    RecordBtn: { path: "Prefabs/UIBtn/btnRecord" },
    RelicCollectionView: { path: "Prefabs/Relic/RelicCollectionViewUI" },
    RelicDetailView: { path: "Prefabs/Relic/RelicDetailViewUI", viewComp: "RelicDetailViewUI" },
    RelicFindResult: { path: "Prefabs/Relic/RelicFindResultUI", viewComp: "RelicFindResultUI" },
    RewardPop: { path: "Prefabs/RewardPopUI" },
    RouletteView: { path: "Prefabs/RouletteViewUI" },
    SevenChallenge: { path: "Prefabs/SevenChallenge/UISevenChallengeView", viewComp: "UISevenChallengeView" },
    SevenChallengeItem: { path: "Prefabs/SevenChallenge/UISevenChallengeItem" },
    ShareBtn: { path: "Prefabs/UIBtn/btnShare" },
    ShareRecordView: { path: "Prefabs/RecordShare", preload: true },
    ShopItems: [{ path: "Prefabs/Shop/ShopCurrencySymbolItemUI", preload: true },
    { path: "Prefabs/Shop/ShopItemCurrencyUI", preload: true },
    { path: "Prefabs/Shop/ShopLimitBigUI", preload: true },
    { path: "Prefabs/Shop/ShopLimitFreeUI", preload: true },
    { path: "Prefabs/Shop/ShopLimitSmallUI", preload: true },
    { path: "Prefabs/Shop/ShopPackage001UI", preload: true },
    { path: "Prefabs/Shop/ShopPackage002UI", preload: true },
    { path: "Prefabs/Shop/ShopSymbolItemCountBottomUI", preload: true },
    { path: "Prefabs/Shop/ShopSymbolItemCountRightUI", preload: true }
    ],
    SkillDetail: { path: "Prefabs/SkillDetailViewUI", viewComp: "SkillDetailViewUI" },
    SummonResult: { path: "Prefabs/Shop/SummonResultUI", viewComp: "SummonResultViewUI", preload: true },
    ToastAtk: { path: "Prefabs/ToastAtkView" },
    ToastSummonLvup: { path: "Prefabs/ToastSummonLvupUI" },
    TraitRuleView: { path: "Prefabs/Trait/TraitRuleViewUI" },
    TraitSetEffectView: { path: "Prefabs/Trait/TraitSetEffectViewUI" },
    TransResult: { path: "Prefabs/TransResultUI", viewComp: "TransResultViewUI" },
    UIBattleChest: { path: "Prefabs/BattleChestViewUI", viewComp: "ChestViewBattle" },
    RingBreakViewUI: { path: "Prefabs/Ring/RingBreakViewUI", preload: true },
    RingDetailViewUI: { path: "Prefabs/Ring/RingDetailViewUI", preload: true },
    RobAddHeroViewUI: { path: "Prefabs/Rob/RobAddHeroViewUI", viewComp: "RobAddHeroViewUI" },
    RobBuildDetailViewUI: { path: "Prefabs/Rob/RobBuildDetailViewUI", viewComp: "RobBuildDetailViewUI" },
    RobExpRewardItemUI: { path: "Prefabs/Rob/RobExpRewardItemUI", viewComp: "RobExpRewardItemUI" },
    RobExpRewardViewUI: { path: "Prefabs/Rob/RobExpRewardViewUI", viewComp: "RobExpRewardViewUI" },
    RobLevelUpRewardItemUI: { path: "Prefabs/Rob/RobLevelUpRewardItemUI", viewComp: "RobLevelUpRewardItemUI" },
    RobLevelUpViewUI: { path: "Prefabs/Rob/RobLevelUpViewUI", viewComp: "RobLevelUpViewUI" },
    RobObtainCionViewUI: { path: "Prefabs/Rob/RobObtainCionViewUI", viewComp: "RobObtainCionViewUI" },
    RobSpeedUpViewUI: { path: "Prefabs/Rob/RobSpeedUpViewUI", viewComp: "RobSpeedUpViewUI" },
    RobViewUI: { path: "Prefabs/Rob/RobViewUI", viewComp: "RobViewUI" },
    SetViewUI: { path: "Prefabs/SetViewUI" },
    SummonRateViewUI: { path: "Prefabs/SummonRateViewUI" },
    TeasureCollectionViewUI: { path: "Prefabs/Teasure/TeasureCollectionViewUI", preload: true },
    TeasureDetailViewUI: { path: "Prefabs/Teasure/TeasureDetailViewUI", viewComp: "TeasureDetailViewUI", preload: true },
    TeasureViewUI: { path: "Prefabs/Teasure/TeasureViewUI", preload: true },
    Weapon: { path: "Prefabs/GearWeaponViewUI" },
    WeekRewardView: { path: "Prefabs/WeekRewardView" }
};
export var PrefabUIMasterHelper = { path: "Mastery/MasteryHelperUI" };
export var PrefabBossLevelItemHelperUI = { path: "BossLevel/BossLevelItemHelperUI" };
export var PrefabBossKeyHelperUI = { path: "BossLevel/BossKeyHelperUI" };
export var WaitUI = { path: "Waiting" };
export function getViewPageUrl(e) {
    switch (e) {
        case E_MenuPageId.Hero:
            return MapUIPrefabs.PageHero;
        case E_MenuPageId.Panter:
            return MapUIPrefabs.PagePartner;
        case E_MenuPageId.Boss:
            return MapUIPrefabs.PageBoss;
        case E_MenuPageId.Mine:
            return MapUIPrefabs.PageMine;
        case E_MenuPageId.Shop:
            return MapUIPrefabs.PageShop;
    }
}
export var IMAGE_PATHS_ = [IMAGE_ICON_PATH_, MINE_IMAGE_URL_, ROB_IMAGE_URL_];
export var SPINE_DATAS_ = [SPINE_DATA_EFFECT_, "level_up"];
