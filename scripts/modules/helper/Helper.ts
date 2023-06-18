import { EntityBase } from "../battle/EntityBase";
import SoundPlayerComp from "../../ccstudio/utils/SoundPlayerComp";
// import EntityBase from "EntityBase";
const { ccclass, property } = cc._decorator;
@ccclass
export default class Helper extends EntityBase {
    assistant = null;
    hurtSound = "";
    playHurtSound() {
        if (this.hurtSound == "") {
            const e = "Audios/" + this.hurtSound;
            SoundPlayerComp.Instance.playEffect(e);
        }
    }
}
