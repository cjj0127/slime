
import UnlockData from "../../modules/unlock/UnlockData";
import Config from "../configs/Config";
import AdsModel from "./AdsModel";
import BattleChestModel from "./BattleChestModel";
import BlessModel from "./BlessModel";
import CfgModel from "./CfgModel";
import MgrCollection from "./CollectionModel";
import GearModel from "./GearModel";
import GuideModel from "./GuideModel";
import HeroModel from "./HeroModel";
import LegionRushModel from "./LegionRushModel";
import LevelModel from "./LevelModel";
import MasteryModel from "./MasteryModel";
import MineModel from "./MineModel";
import MineResearchModel from "./MineResearchModel";
import ObtainModel from "./ObtainModel";
import PartnerModel from "./PartnerModel";
import PassModel from "./PassModel";
import QuestModel from "./QuestModel";
import RedModel from "./RedModel";
import RelicModel from "./RelicModel";
import RingModel from "./RingModel";
import RobModel from "./RobModel";
import RouletteModel from "./RouletteModel";
import SevenChallengeModel from "./SevenChallengeModel";
import ShopModel from "./ShopModel";
import SkillModel from "./SkillModel";
import SummonModel from "./SummonModel";
import TeasureModel from "./TeasureModel";
import TraitModel from "./TraitModel";
import UiModel from "./UiModel";
import UserModel from "./UserModel";
export default class Model {
    public static ad: AdsModel; // = new AdsModel();
    public static ChestBattle: BattleChestModel;
    public static bless: BlessModel; // = new BlessModel();
    public static cfg: CfgModel; // = new CfgModel()
    public static collection: MgrCollection; // = new MgrCollection();
    public static gear: GearModel; // = new GearModel()
    public static guild: GuideModel;
    public static hero: HeroModel; // = new HeroModel();
    public static legionRush: LegionRushModel; // = new LegionRushModel();
    public static level: LevelModel; // = new LevelModel()
    public static mastery: MasteryModel; // = new MasteryModel()
    public static mine: MineModel; // = new MineModel();
    public static mineResearch: MineResearchModel; // = new MineResearchModel()
    public static obtain: ObtainModel; // = new ObtainModel()
    public static partner: PartnerModel; // = new PartnerModel()
    public static pass: PassModel; // = new PassModel()
    public static quest: QuestModel; // = new QuestModel();
    public static reddot: RedModel; // = new RedModel()
    public static relic: RelicModel; // = new RelicModel()
    public static ring: RingModel; // = new RingModel()
    public static rob: RobModel; // = new RobModel()
    public static roulette: RouletteModel; // = new RouletteModel()
    private static savedatatime: number = 0;
    public static sevenChallenge: SevenChallengeModel;
    public static shop: ShopModel;
    public static skill: SkillModel; // = new SkillModel()
    public static summon: SummonModel; // = new SummonModel()
    public static teasure: TeasureModel; // = new TeasureModel()
    public static trait: TraitModel; // = new TraitModel();
    public static ui: UiModel; // = new UiModel();
    public static unlock: UnlockData; // = new UnlockData()
    public static user: UserModel; // = new UserModel()
    public static getGameData() {
        // let strdata = cc.sys.localStorage.getItem(GameConst.localDataKey);
        // return strdata;
    }
    //数据提交来源
    //服务器过滤测试数据
    private static getorigin() {
        if (window['wx'] || window['tt'] || window["qq"])
            return "minigame";
        else
            return "test";
    }
    public static async load() {
        await Config.load();
        this.cfg = new CfgModel();
        this.hero = new HeroModel();
        this.bless = new BlessModel();
        this.unlock = new UnlockData();
        this.user = new UserModel();
        this.summon = new SummonModel();
        this.skill = new SkillModel();
        this.gear = new GearModel();
        this.ring = new RingModel();
        this.partner = new PartnerModel();
        this.relic = new RelicModel();
        this.level = new LevelModel();
        this.pass = new PassModel();
        this.reddot = new RedModel();
        this.ad = new AdsModel();
        this.mine = new MineModel();
        this.mineResearch = new MineResearchModel();
        this.ui = new UiModel();
        this.roulette = new RouletteModel();
        this.mastery = new MasteryModel();
        this.obtain = new ObtainModel();
        this.rob = new RobModel();
        this.teasure = new TeasureModel();
        this.trait = new TraitModel();
        this.legionRush = new LegionRushModel();
        this.quest = new QuestModel();
        this.collection = new MgrCollection();
        this.sevenChallenge = new SevenChallengeModel();
        this.ChestBattle = new BattleChestModel();
        this.shop = new ShopModel();
        this.guild = new GuideModel();
        let list = [
            this.cfg,
            this.hero,
            this.unlock,
            this.user,
            this.summon,
            this.skill,
            this.gear,
            this.ring,
            this.partner,
            this.relic,
            this.level,
            this.pass,
            this.reddot,
            this.ad,
            this.mine,
            this.mineResearch,
            this.ui,
            this.roulette,
            this.mastery,
            this.obtain,
            this.rob,
            this.teasure,
            this.trait,
            this.legionRush,
            this.quest,
            this.collection,
            this.sevenChallenge,
            this.ChestBattle,
            this.shop,
            this.guild,
            this.bless,
        ];
        for (let i = 0; i < list.length; i++) {
            await list[i].load();
        }
        for (var i = 0; i < list.length; i++) {
            list[i].initLoadData();
        }
        // Model.summon.load()
        // Model.partner.load()//dswe 
        // Model.skill.load()
        // Model.gear.load()
        // Model.ring.Init()
        // var localdata = cc.sys.localStorage.getItem(GameConst.localDataKey);
        // if (localdata) {
        //     localdata = JSON.parse(localdata);
        //     console.log('本地数据', localdata)
        //     Model.game.setData(localdata['game'])
        //     // Model.level.setData(localdata['level'])
        // }
        // else {
        //     //没有档案重置下音乐开关
        //     cc.sys.localStorage.setItem("bgmVolume", AudioMgr.DEFAULT_VOLUME);
        //     cc.sys.localStorage.setItem("sfxVolume", AudioMgr.DEFAULT_VOLUME);
        //     AudioMgr.Instance().sfxVolume = AudioMgr.DEFAULT_VOLUME;
        //     AudioMgr.Instance().bgmVolume = AudioMgr.DEFAULT_VOLUME;
        //     Model.game.setDefault()
        // }
    }
    public static save(bRemote: boolean = false) {
        var obj = {};
        // obj['game'] = Model.game.loadData()
        //  obj['level'] = Model.level.getUploadData()
        Model.savedata(obj, bRemote);
    }
    //本地存数据
    private static savedata(data, bRemote: boolean = false) {
        // cc.sys.localStorage.setItem("savedatatime", UtilsCC.getServerTime());
        // if (cc.sys.platform == cc.sys.WECHAT_GAME) {
        //     //写本地            
        //     var strdata = JSON.stringify(data);
        //     cc.sys.localStorage.setItem(GameConst.localDataKey, strdata);
        //     data.game = {}
        //     //上传服务器
        //     if (UtilsCC.getServerTime() - this.savedatatime > 60 * 3 * 1000 || bRemote) {
        //         this.savedatatime = UtilsCC.getServerTime();
        //         // WXTTUtils.Instance().dealData(WXTT_ACTION.UPLOAD, data);
        //     }
        // }
        // else {
        //     var strdata = JSON.stringify(data);
        //     cc.sys.localStorage.setItem(GameConst.localDataKey, strdata);
        //     data.game = {}
        //     if (UtilsCC.getServerTime() - this.savedatatime > 60 * 3 * 1000 || bRemote) {
        //         this.savedatatime = UtilsCC.getServerTime();
        //         // WXTTUtils.Instance().dealData(WXTT_ACTION.UPLOAD, data);
        //     }
        // }
    }
}
