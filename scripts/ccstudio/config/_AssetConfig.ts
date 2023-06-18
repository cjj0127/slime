import _GearConfig from "./_GearConfig";
import _HeroConfig from "./_HeroConfig";
import _BaseParse from "./_BaseParse";
import _PartnerConfig from "./_PartnerConfig";
import _SkillConfig from "./_SkillConfig";
import { IMAGE_ICON_PATH_, E_ITEM_TYPE, QUALITY_SPRITE_PATH_, Q_SPRITE_FRAME } from "../../modules/common/Const";
import { NAMES_BUNDLE } from "../../modules/asset/AssetRes";
import AssetManager from "../../modules/asset/AssetManager";
// import _SkillConfig from '_SkillConfig';
const { ccclass, property } = cc._decorator;
@ccclass
export default class _AssetConfig extends _BaseParse {
    private static _instance: any;
    jsonName: string = "assets";
    get(e): any {
        return this.cfg[e];
    }
    getAssetQuality(e): number {
        switch (this.get(e).type) {
            case E_ITEM_TYPE.Asset:
                return -1;
            case E_ITEM_TYPE.Gear:
                return _GearConfig.Instance.get(e).quality;
            case E_ITEM_TYPE.Hero:
                return _HeroConfig.Instance.get(e).grade;
            case E_ITEM_TYPE.Partner:
                return _PartnerConfig.Instance.get(e).quality;
            case E_ITEM_TYPE.Skill:
                return _SkillConfig.Instance.get(e).quality;
        }
        return -1;
    }
    getAssetSpriteFrame(e: number): cc.SpriteFrame {
        const t: string = this.getAssetUrl(e);
        return AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, t);
    }
    getAssetUrl(e: number): string {
        const t: any = this.get(e);
        return `${IMAGE_ICON_PATH_}/${t.icon}`;
    }
    getQualitySpriteFrame(e: number): cc.SpriteFrame {
        const t: number = this.getAssetQuality(e);
        if (t >= 0) {
            const n: string = `${QUALITY_SPRITE_PATH_}/${Q_SPRITE_FRAME[t]}`;
            return AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, n);
        }
        return null;
    }
    public static get Instance(): _AssetConfig {
        if (this._instance == null) {
            this._instance = new _AssetConfig();
        }
        return this._instance;
    }
}
