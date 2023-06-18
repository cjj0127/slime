import SoundPlayerComp from "../../ccstudio/utils/SoundPlayerComp";
const { ccclass, property, requireComponent, disallowMultiple } = cc._decorator;
@ccclass
@requireComponent(cc.Button)
@disallowMultiple
export default class ButtonSoundComp extends cc.Component {
    @property({
        visible() {
            return this.useCustomAudio;
        },
        type: cc.AudioClip,
    })
    clickAudio: cc.AudioClip = null;
    @property()
    useCustomAudio: boolean = false;
    onClick() {
        if (this.useCustomAudio && this.clickAudio) {
            SoundPlayerComp.Instance.playAudio(this.clickAudio);
        }
        else {
            SoundPlayerComp.Instance.playEffect("Audios/button");
        }
    }
    onLoad() {
        this.node.on("click", this.onClick, this);
    }
}
