import BaseCfg from "./BaseCfg";
export class BossRushObj {
    count: number; //
    enemy: number; //敌人
    id: number; //
    isBoss: boolean; //
    multiAttack: number; //
    multiHP: number; //
    name: string; //名称
    wave: number; //波数
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class BossRushConfigAuto extends BaseCfg<BossRushObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: BossRushObj = new BossRushObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class HeroLevelExpObj {
    exp: number; //经验
    level: number; //等级
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class HeroLevelExpConfigAuto extends BaseCfg<HeroLevelExpObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: HeroLevelExpObj = new HeroLevelExpObj();
            obj.setData(temp);
            this.map.set(temp['level'], obj);
        }
    }
}
export class BlessTypeObj {
    desc: string; //描述文本
    icon: string; //
    id: number; //
    name: string; //
    type: number; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class BlessTypeConfigAuto extends BaseCfg<BlessTypeObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: BlessTypeObj = new BlessTypeObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class BlessLevelObj {
    addition: number; //
    exp: number; //经验
    id: number; //
    idx: number; //
    type: number; //类型
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class BlessLevelConfigAuto extends BaseCfg<BlessLevelObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: BlessLevelObj = new BlessLevelObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class BuildingLevelObj {
    buildingId: number; //建筑id
    buildingLevel: number; //建筑等级
    id: number; //
    levelCost: string; //等级消耗
    maxStock: string; //
    outNum: number; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class BuildingLevelConfigAuto extends BaseCfg<BuildingLevelObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: BuildingLevelObj = new BuildingLevelObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class CaveRushObj {
    caveHP: string; //血量
    caveId: number; //
    id: number; //
    multiAttack: string; //
    multiHP: string; //
    reward: string; //奖励
    wave1: {
        id: number;
        n: number;
    }[]; //
    wave2: {
        id: number;
        n: number;
    }[]; //
    wave3: {
        id: number;
        n: number;
    }[]; //
    wave4: {
        id: number;
        n: number;
    }[]; //
    wave5: {
        id: number;
        n: number;
    }[]; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class CaveRushConfigAuto extends BaseCfg<CaveRushObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: CaveRushObj = new CaveRushObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class CollectionObj {
    addBaseValue: number; //
    id: number; //
    ids: number[]; //ids
    name: string; //
    prop: number; //概率
    type: number; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class CollectionConfigAuto extends BaseCfg<CollectionObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: CollectionObj = new CollectionObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class ConstObj {
    key: string; //
    value: number[]; //
    valueType: string; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class ConstConfigAuto extends BaseCfg<ConstObj, string> {
    setData(value) {
        for (var temp of value) {
            var obj: ConstObj = new ConstObj();
            obj.setData(temp);
            this.map.set(temp['key'], obj);
        }
    }
}
export class DwarvenKingObj {
    atkMulit: string; //
    hp: string; //
    id: number; //
    reward: {
        type: number;
        num: number;
    }[]; //
    tailt: number; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class DwarvenKingConfigAuto extends BaseCfg<DwarvenKingObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: DwarvenKingObj = new DwarvenKingObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class EnemyObj {
    bulletId: number; //子弹
    damage: number; //伤害
    fre: number; //
    gold: number; //
    hp: number; //
    hurtEffect: string; //
    id: number; //
    multi: number; //
    range: number; //
    speed: number; //速度
    type: number; //
    uiAnim: string; //
    viewUrl: string; //资源
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class EnemyConfigAuto extends BaseCfg<EnemyObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: EnemyObj = new EnemyObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class ExtraRewardObj {
    id: number; //
    number: number; //
    reward: {
        type: number;
        num: number;
    }[]; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class ExtraRewardConfigAuto extends BaseCfg<ExtraRewardObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: ExtraRewardObj = new ExtraRewardObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class GearObj {
    equip: string; //
    equipUP: string; //
    icon: string; //
    id: number; //
    name: string; //
    quality: number; //
    rate: number; //
    type: number; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class GearConfigAuto extends BaseCfg<GearObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: GearObj = new GearObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class GearLevelObj {
    cost: number; //
    id: number; //
    level: number; //
    owned: string; //
    quality: number; //
    type: number; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class GearLevelConfigAuto extends BaseCfg<GearLevelObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: GearLevelObj = new GearLevelObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class GoldRushObj {
    enemy: number; //
    id: number; //
    multiAttack: string; //
    multiHP: string; //
    reward: string; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class GoldRushConfigAuto extends BaseCfg<GoldRushObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: GoldRushObj = new GoldRushObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class GuideObj {
    command: {
        type: number;
        args: number;
    }[]; //
    conditions: {
        type: number;
        args: number;
    }[]; //
    findNodePosDelayTime: number; //
    id: number; //
    isStrict: number; //
    lockId: number; //
    parentFullPath: string; //
    postCondition: {
        type: number;
        args: number;
    }[]; //
    precondition: {
        type: number;
        args: number;
    }[]; //
    recoverStep: number; //
    stage: number; //
    step: number; //
    text: string; //
    textPos: number; //
    type: number; //
    verification: {
        type: number;
        args: number;
    }[]; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class GuideConfigAuto extends BaseCfg<GuideObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: GuideObj = new GuideObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class GuideTextObj {
    id: number; //
    text: string[]; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class GuideTextConfigAuto extends BaseCfg<GuideTextObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: GuideTextObj = new GuideTextObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class HeroObj {
    aspd: number; //
    atk: number; //
    atkUP: number; //
    bulletId: number; //
    grade: number; //
    heroType: number; //
    icon: string; //
    id: number; //
    maxLevel: number; //
    name: string; //
    propValues: number[]; //
    props: number[]; //
    range: number; //
    skillId: number; //
    skillUnlockLv: number; //
    speed: number; //
    uiAnim: string; //
    unlockCost: number; //
    unlockPropLvs: number[]; //
    unlockType: number; //
    viewUrl: string; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class HeroConfigAuto extends BaseCfg<HeroObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: HeroObj = new HeroObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class LegionHeroObj {
    id: number; //
    ringAdd: number; //
    ringAddNum: number; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class LegionHeroConfigAuto extends BaseCfg<LegionHeroObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: LegionHeroObj = new LegionHeroObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class LegionRandObj {
    bossEnemy: {
        a: number;
        b: number;
    }[]; //
    icon: string; //
    id: number; //
    legionLevelArea: number[]; //
    name: string; //
    normalEnemy: {
        a: number;
        b: number;
    }[]; //
    powerRate: number; //
    powerUpNum: {
        a: number;
        b: number;
    }[]; //
    propId: number; //
    propWeight: number; //
    upNum: {
        a: number;
        b: number;
    }[]; //
    upType: number; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class LegionRandConfigAuto extends BaseCfg<LegionRandObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: LegionRandObj = new LegionRandObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class LegionRushObj {
    id: number; //
    multiAtk: string; //
    multiAtkUP: number; //
    multiHP: string; //
    multiHPUP: number; //
    reward: {
        type: number;
        num: number;
    }[]; //
    ringLevel: number; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class LegionRushConfigAuto extends BaseCfg<LegionRushObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: LegionRushObj = new LegionRushObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class LegionWaveObj {
    id: number; //
    propNum: number; //
    waveType: number; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class LegionWaveConfigAuto extends BaseCfg<LegionWaveObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: LegionWaveObj = new LegionWaveObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class LevelObj {
    difficulty: number; //
    id: number; //
    level: string; //
    multiAttack: string; //
    multiBossAttack: number; //
    multiBossHP: number; //
    multiGold: string; //
    multiHP: string; //
    obtain: string; //
    obtainGearRate: number; //
    obtainWidget: {
        id: number;
        num: number;
    }[]; //
    scene: string; //
    wave1: {
        id: number;
        num: number;
    }[]; //
    wave2: {
        id: number;
        num: number;
    }[]; //
    wave3: {
        id: number;
        num: number;
    }[]; //
    wave4: {
        id: number;
        num: number;
    }[]; //
    wave5: {
        id: number;
        num: number;
    }[]; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class LevelConfigAuto extends BaseCfg<LevelObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: LevelObj = new LevelObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class MailboxObj {
    ad: string; //
    asset: number; //
    count: number; //
    desc: string; //
    id: number; //
    last: number; //
    receive: number; //
    receiveType: number; //
    time: string; //
    timeType: number; //
    times: number; //
    title: string; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class MailboxConfigAuto extends BaseCfg<MailboxObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: MailboxObj = new MailboxObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class MasteryObj {
    costSp: number; //
    icon: string; //
    id: number; //
    layer: number; //
    maxLevel: number; //
    pre: number[]; //
    propAdd: number; //
    propType: number; //
    resetLv: string; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class MasteryConfigAuto extends BaseCfg<MasteryObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: MasteryObj = new MasteryObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class MineObj {
    cfg1: string; //
    cfg2: string; //
    cfg3: string; //
    cfg4: string; //
    cfg5: string; //
    cfg6: string; //
    enter: string; //
    meter: number; //
    total: number; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class MineConfigAuto extends BaseCfg<MineObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: MineObj = new MineObj();
            obj.setData(temp);
            this.map.set(temp['meter'], obj);
        }
    }
}
export class MineResearchObj {
    desc: string; //
    expend: number[]; //
    icon: string; //
    id: number; //
    minFastComplete: number; //
    minuteFastComplete: number; //
    name: string; //
    pre: number[]; //
    propType: number; //
    researchTime: number; //
    value: number[]; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class MineResearchConfigAuto extends BaseCfg<MineResearchObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: MineResearchObj = new MineResearchObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class MineRewardGearObj {
    id: number; //
    quality1: number; //
    quality2: number; //
    quality3: number; //
    quality4: number; //
    quality5: number; //
    quality6: number; //
    quality7: number; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class MineRewardGearConfigAuto extends BaseCfg<MineRewardGearObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: MineRewardGearObj = new MineRewardGearObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class PartnerObj {
    aspd: number; //
    atk: number; //
    atkUP: number; //
    bulletId: number; //
    flg: number[]; //
    icon: string; //
    id: number; //
    name: string; //
    quality: number; //
    rate: number; //
    viewUrl: string; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class PartnerConfigAuto extends BaseCfg<PartnerObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: PartnerObj = new PartnerObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class PartnerLevelObj {
    cost: number; //
    id: number; //
    level: number; //
    owned: string; //
    quality: number; //
    type: number; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class PartnerLevelConfigAuto extends BaseCfg<PartnerLevelObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: PartnerLevelObj = new PartnerLevelObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class PassObj {
    extraRewardId: number; //
    id: number; //
    name: string; //
    slime: number; //
    unlockConditionId: number; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class PassConfigAuto extends BaseCfg<PassObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: PassObj = new PassObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class PlunderHeroObj {
    heroMinusLevel: number; //
    id: number; //
    outLow: number; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class PlunderHeroConfigAuto extends BaseCfg<PlunderHeroObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: PlunderHeroObj = new PlunderHeroObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class PlunderLevelObj {
    id: number; //
    needExp: number; //
    plunderAdd: number; //
    plunderLevel: number; //
    reward: {
        type: number;
        num: number;
    }[]; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class PlunderLevelConfigAuto extends BaseCfg<PlunderLevelObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: PlunderLevelObj = new PlunderLevelObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class PlunderQuestObj {
    buildingId: number; //
    coinNum: number; //
    id: number; //
    needLevel: number; //
    questType: number; //
    rewardId: number; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class PlunderQuestConfigAuto extends BaseCfg<PlunderQuestObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: PlunderQuestObj = new PlunderQuestObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class PropLevelObj {
    ASPD: string; //
    ATK: number; //
    Critical_Hit_Chance: string; //
    Critical_Hit_Damage: number; //
    Double_Shot: string; //
    HP: number; //
    HP_Recovery: number; //
    Triple_Shot: string; //
    level: number; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class PropLevelConfigAuto extends BaseCfg<PropLevelObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: PropLevelObj = new PropLevelObj();
            obj.setData(temp);
            this.map.set(temp['level'], obj);
        }
    }
}
export class QuestObj {
    activeId: number; //
    ad: number; //
    asset: number; //
    count: number; //
    id: number; //
    max: number; //
    receiveDep: number; //
    title: string; //
    type: number; //
    updateCycle: number; //
    updateType: number; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class QuestConfigAuto extends BaseCfg<QuestObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: QuestObj = new QuestObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class RelicObj {
    desc: string; //
    effect: string; //
    effectParams: number[]; //
    effectUp: number; //
    effectValue: number; //
    icon: string; //
    id: number; //
    maxLevel: number; //
    name: string; //
    owned: number; //
    ownedUP: number; //
    pre: number; //
    props: number[]; //
    rate: number; //
    skillId: number; //
    type: number; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class RelicConfigAuto extends BaseCfg<RelicObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: RelicObj = new RelicObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class RelicLevelObj {
    cost: string; //
    id: number; //
    level: number; //
    type: number; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class RelicLevelConfigAuto extends BaseCfg<RelicLevelObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: RelicLevelObj = new RelicLevelObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class RingObj {
    icon: string; //
    id: number; //
    name: string; //
    quality: number; //
    rate: number; //
    skillID: number; //
    skillUP: number; //
    skillUPLevel: number; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class RingConfigAuto extends BaseCfg<RingObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: RingObj = new RingObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class RingLevelObj {
    atkUP: number; //
    hpUP: number; //
    id: number; //
    quality: number; //
    ringLevel: number; //
    type: number; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class RingLevelConfigAuto extends BaseCfg<RingLevelObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: RingLevelObj = new RingLevelObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class RingQualityLevelObj {
    breakNum: number; //
    costNum: number; //
    id: number; //
    quality: number; //
    strengLevel: number; //
    type: number; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class RingQualityLevelConfigAuto extends BaseCfg<RingQualityLevelObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: RingQualityLevelObj = new RingQualityLevelObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class RouletteObj {
    asset: number; //
    count: number; //
    id: number; //
    widget: number; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class RouletteConfigAuto extends BaseCfg<RouletteObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: RouletteObj = new RouletteObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class SevenChallengeObj {
    day: number; //
    id: number; //
    quest: number; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class SevenChallengeConfigAuto extends BaseCfg<SevenChallengeObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: SevenChallengeObj = new SevenChallengeObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class SevenLoginObj {
    count: number; //
    id: number; //
    name: number; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class SevenLoginConfigAuto extends BaseCfg<SevenLoginObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: SevenLoginObj = new SevenLoginObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class ShopObj {
    currency: number; //
    duration: number; //
    firstDouble: number; //
    goods: {
        type: number;
        id: number;
        count: number;
    }[]; //
    icon: string; //
    id: number; //
    limitCnt: number; //
    limitCycle: number; //
    name: string; //
    price: number; //
    priority: number; //
    resPrefab: string; //
    trigger: number[]; //
    type: number; //
    worth: number; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class ShopConfigAuto extends BaseCfg<ShopObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: ShopObj = new ShopObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class SkillObj {
    HurtEffect: string; //
    baseProp: number; //
    baseValue: number; //
    bombSound: string; //
    bulletType: number; //
    cd: number; //
    desc: string; //
    duration: number; //
    expEffect: string; //
    fireId: number; //
    fireSound: string; //
    icon: string; //
    id: number; //
    name: string; //
    quality: number; //
    range: number; //
    rate: number; //
    skilPrefab: string; //
    tiggerCnt: number; //
    type: number; //
    upValue: number; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class SkillConfigAuto extends BaseCfg<SkillObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: SkillObj = new SkillObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class SkillLevelObj {
    cost: number; //
    id: number; //
    level: number; //
    owned: string; //
    quality: number; //
    type: number; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class SkillLevelConfigAuto extends BaseCfg<SkillLevelObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: SkillLevelObj = new SkillLevelObj();
            obj.setData(temp);
            this.map.set(temp['quality'], obj);
        }
    }
}
export class SummonExtraObj {
    id: number; //
    quality1: number; //
    quality2: number; //
    quality3: number; //
    quality4: number; //
    quality5: number; //
    quality6: number; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class SummonExtraConfigAuto extends BaseCfg<SummonExtraObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: SummonExtraObj = new SummonExtraObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class SummonWidgetObj {
    id: number; //
    quality1: number; //
    quality2: number; //
    quality3: number; //
    quality4: number; //
    quality5: number; //
    quality6: number; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class SummonWidgetConfigAuto extends BaseCfg<SummonWidgetObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: SummonWidgetObj = new SummonWidgetObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class TraitObj {
    id: number; //
    propAdd: number; //
    propType: number; //
    quality: number; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class TraitConfigAuto extends BaseCfg<TraitObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: TraitObj = new TraitObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class TraitCombObj {
    count: number; //
    id: number; //
    kind: number; //
    value: number; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class TraitCombConfigAuto extends BaseCfg<TraitCombObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: TraitCombObj = new TraitCombObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class TreasureObj {
    desc: string; //
    effect: string; //
    effectParams: number[]; //
    effectUp: number; //
    effectValue: number; //
    icon: string; //
    id: number; //
    maxLevel: number; //
    name: string; //
    ownedAtk: number; //
    ownedAtkUP: number; //
    ownedHp: number; //
    ownedHpUP: number; //
    skillId: number; //
    type: number; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class TreasureConfigAuto extends BaseCfg<TreasureObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: TreasureObj = new TreasureObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class TreasureCostObj {
    costNum: {
        id: number;
        num: string;
    }[]; //
    id: number; //
    treasureId: number; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class TreasureCostConfigAuto extends BaseCfg<TreasureCostObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: TreasureCostObj = new TreasureCostObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
export class TreasureLevelObj {
    cost: {
        id: number;
        num: string;
    }[]; //
    id: number; //
    level: number; //
    treasureId: number; //
    setData(obj: any) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }
}
export class TreasureLevelConfigAuto extends BaseCfg<TreasureLevelObj, number> {
    setData(value) {
        for (var temp of value) {
            var obj: TreasureLevelObj = new TreasureLevelObj();
            obj.setData(temp);
            this.map.set(temp['id'], obj);
        }
    }
}
