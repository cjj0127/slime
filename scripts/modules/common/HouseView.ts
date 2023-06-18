import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import EntityViewBase from "../battle/EntityViewBase";
// import EntityViewBase from "../battle/EntityViewBase";
// n.default = g
export default class HouseView extends EntityViewBase {
    houseSprites: cc.Sprite[] = [];
    
    pause() { }
    
    playAttack() { }
    
    playDead(): number {
        return 0;
    }
    
    playDisapearAction(): number {
        return 0;
    }
    
    playHit() { }
    
    playIdle() { }
    
    playMove() { }
    
    resume() { }
    
    async updateHp(e: number, t: number) {
        const n = NumberPlus.percent(e, t);
        await this.updateState(n);
    }
    
    async updateState(e: number) {
        if (0 == Math.ceil(100 * e / 20))
            return;
        for (let n = 0; n < this.houseSprites.length; n++) {
            let o = "shi" + (n + 1).toString() + "-" + (5 - e).toString();
            let r = this.houseSprites[n];
            const spriteFrame = await AssetManager.Instance.loadSpriteFrame(NAMES_BUNDLE.Game, `UI/Images/house/${o}`, () => { }) as cc.SpriteFrame;
            r.spriteFrame = spriteFrame;
        }
    }
}
// n.default = g;
// import AssetManager from "AssetManager";
// import AssetRes from "AssetRes";
// import NumberPlus from "NumberPlus";
// import EntityViewBase from "EntityViewBase";
// const { ccclass, property } = cc._decorator;
// @ccclass
// export default class MyClass extends cc.Component {
//     private houseSprites: cc.Sprite[] = [];
//     // other functions and properties can be added here
// }
