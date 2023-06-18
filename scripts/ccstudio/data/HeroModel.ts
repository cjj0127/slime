import _HeroConfig from "../config/_HeroConfig";
import HeroData from "../../modules/hero/HeroData";
import _HeroExpConfig from "../config/_HeroExpConfig";
import LanMgr from "../../modules/common/Language";
import ModeBase from "./ModelBase";
import Model from "./Model";
import MsgHint from "../../modules/common/MsgHint";
import UserData from "../../modules/user/UserData";
import { GlobalEventName } from "../../modules/common/Events";
import { E_ASSET_TYPE, GameConst } from "../../modules/common/Const";
const _ = window['_'];
export default class HeroModel extends ModeBase {
    
    enhance(e: number) {
        const heroData = HeroData.Instance.getData(e);
        const maxLv = _HeroExpConfig.Instance.getMaxLv();
        if (!(heroData.level >= maxLv)) {
            if (UserData.Instance.subItem(E_ASSET_TYPE.SlimeExp, 1)) {
                const heroExp = Model.user.calcHeroExp(GameConst.INITIAL_EXP);
                const oldLevel = heroData.level;
                HeroData.Instance.addExp(e, heroExp);
                const newLevel = heroData.level;
                if (oldLevel !== newLevel) {
                    this.reportHeroLevelUp(e, newLevel);
                }
                return true;
            }
            MsgHint.tip(LanMgr.Instance.getLangByID("Not enough Experience Shard"));
        }
        return false;
    }
    
    equip(e: number) {
        const heroData = HeroData.Instance.getData(e);
        if (_.isNil(heroData)) {
            cc.warn("未拥有该角色");
            return false;
        }
        if (HeroData.Instance.battleId !== e) {
            HeroData.Instance.battleId = e;
            cc.director.emit(GlobalEventName.ChangeBattleHero);
            Model.ui.closeAll();
            return true;
        }
        return false;
    }
    
    initLoadData() { }
    
    load() {
        HeroData.Instance.load();
    }
    
    lvupEnableHeros() {
        const expShard = parseInt(UserData.Instance.getItem(E_ASSET_TYPE.SlimeExp));
        const res: number[] = [];
        if (expShard <= 0)
            return res;
        const maxLv = _HeroExpConfig.Instance.getMaxLv();
        const allHeroData = HeroData.Instance.getAllDatas();
        _.each(allHeroData, (heroData) => {
            const id = heroData.id;
            const level = heroData.level;
            const exp = heroData.exp;
            if (level < maxLv) {
                const nextLvExp = _HeroExpConfig.Instance.get(level + 1);
                if (exp + Model.user.calcHeroExp(GameConst.INITIAL_EXP) * expShard > nextLvExp) {
                    res.push(id);
                }
            }
        });
        return res;
    }
    
    reportHeroLevelUp(e: number, t: number) {
        // const heroGrade = _HeroConfig.Instance.get(e).grade;
        // const expShardNum = UserData.Instance.getItem(E_ASSET_TYPE.SlimeExp);
        // const reportData = {
        //     HeroExp_Num: expShardNum,
        //     Hero_ID: e,
        //     Hero_Level: t,
        //     Hero_Quality: heroGrade,
        // };
    }
    
    unlock(e: number) {
        const heroData = HeroData.Instance.getData(e);
        if (heroData) {
            cc.warn("已经拥有该角色");
            return false;
        }
        else {
            HeroData.Instance.unlock(e);
            cc.director.emit(GlobalEventName.HeroUnlock, e);
            return true;
        }
    }
}
