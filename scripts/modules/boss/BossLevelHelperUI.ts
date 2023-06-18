import LanMgr from "../common/Language";
import { E_GAME_LEVEL_TYPE } from "../common/Const";
const { ccclass, property } = cc._decorator;
interface GameLevelType {
    title: string;
    desc: string;
}
const gameLevelTypes: {
    [key in E_GAME_LEVEL_TYPE]: GameLevelType;
} = {
    [E_GAME_LEVEL_TYPE.BossRush]: {
        title: "BOSS RUSH",
        desc: "boss_rush_desc"
    },
    [E_GAME_LEVEL_TYPE.GoldRush]: {
        title: "GOLD RUSH",
        desc: "gold_rush_desc"
    },
    [E_GAME_LEVEL_TYPE.DwarvenKing]: {
        title: "DwarvenKing",
        desc: "snow_monster_desc"
    },
    [E_GAME_LEVEL_TYPE.CaveRush]: {
        title: "cave_Rush",
        desc: "cave_Rush_desc"
    },
    [E_GAME_LEVEL_TYPE.LegionRush]: {
        title: "legion_Rush",
        desc: "legion_Rush_desc"
    },
    [E_GAME_LEVEL_TYPE.Normal]: undefined,
    [E_GAME_LEVEL_TYPE.VillageRaid]: undefined,
    [E_GAME_LEVEL_TYPE.SlimeLegion]: undefined
};
@ccclass
export default class BossLevelHelperUI extends cc.Component {
    @property(cc.Label)
    private descLabel: cc.Label = null;
    private levelType: E_GAME_LEVEL_TYPE = null;
    @property(cc.Label)
    private titleLabel: cc.Label = null;
    public onEnable(): void {
        const levelTypeInfo = gameLevelTypes[this.levelType];
        this.titleLabel.string = LanMgr.Instance.getLangByID(levelTypeInfo.title);
        this.descLabel.string = LanMgr.Instance.getLangByID(levelTypeInfo.desc);
    }
    public reuse(levelType: E_GAME_LEVEL_TYPE): void {
        this.levelType = levelType;
    }
}
