import AssetManager from "../../modules/asset/AssetManager";
import CacheInfo, { NAMES_BUNDLE } from "../../modules/asset/AssetRes";
import LocalStorageTool from "./LocalStorage";
const u: any = window["_"];
const p = 10;
const { ccclass, property } = cc._decorator;
@ccclass
export default class SoundPlayerComp extends cc.Component {
    private _audios: Map<number, cc.AudioClip> = new Map<number, cc.AudioClip>();
    private _effectVolume: number = 1;
    private _effects: Map<string, number> = new Map<string, number>();
    private static _instance: SoundPlayerComp = null;
    private _masterVolume: number = 1;
    private _music: Map<cc.AudioClip, number> = new Map<cc.AudioClip, number>();
    private _musicSwitch: boolean = false;
    private _musicVolume: number = 1;
    private _soundSwitch: boolean = false;
    private head_: number = 0;
    private soundPending_: any[] = [];
    private tail_: number = 0;
    private addSoundToPending(e: any, t: boolean): void {
        const p: number = 10;
        if ((this.tail_ + 1) % p != this.head_) {
            for (let n = this.head_; n != this.tail_; n = (n + 1) % p) {
                if (this.soundPending_[n].audioClip == e) {
                    return;
                }
            }
            this.soundPending_[this.tail_] = {
                audioClip: e,
                loop: t
            };
            this.tail_ = (this.tail_ + 1) % p;
        }
    }
    public lateUpdate() {
        while (this.head_ != this.tail_) {
            let e = this.soundPending_[this.head_];
            let t = e.audioClip;
            let n = e.loop;
            this.startSound(t, n);
            this.head_ = (this.head_ + 1) % p;
        }
    }
    load() {
        var e = LocalStorageTool.getItemLocal("cc_game_audio_data");
        if (e) {
            var t = JSON.parse(e);
            this.setMasterVolume(t.volume_master),
                this.setMusicVolume(t.volume_music),
                this.setEffectVolume(t.volume_effect),
                this.setMusicSwitch(1 == t.switch_music),
                this.setSoundSwitch(1 == t.switch_effect);
        }
        else
            this.setMasterVolume(.6),
                this.setMusicVolume(.6),
                this.setEffectVolume(1),
                this.setMusicSwitch(!0),
                this.setSoundSwitch(!0);
    }
    public mute(): void {
        this.setMasterVolume(0);
    }
    public pauseAllMusic(): void {
        this._music.forEach((t, n) => {
            return this.pauseMusic(n);
        });
    }
    public pauseMusic(e: cc.AudioClip): void {
        if (this._music.has(e)) {
            cc.audioEngine.pause(this._music.get(e));
        }
    }
    public playAudio(e: cc.AudioClip, t: boolean = false): void {
        if (this.soundSwitch) {
            this.addSoundToPending(e, t);
        }
    }
    public playEffect(e: string, t: boolean = false, n: string = "Game"): void {
        if (this.soundSwitch) {
            AssetManager.Instance.loadAsync(n, e, cc.AudioClip).then((o: CacheInfo) => {
                let r = o.assets;
                this._audios[e] = r;
                this.addSoundToPending(r, t);
            });
        }
    }
    public async playMusic(name: string, bundleName: string = NAMES_BUNDLE.Game): Promise<void> {
        let clip: cc.AudioClip;
        if (typeof name !== "string") {
            return;
        }
        else {
            const res = await AssetManager.Instance.loadAsync(bundleName, name, cc.AudioClip);
            clip = res.assets as cc.AudioClip;
            this._audios[name] = clip;
        }
        if (this._music.has(clip)) {
            this.stopMusic(clip);
        }
        let volume = this._masterVolume * this._musicVolume;
        if (this._musicSwitch == false) {
            volume = 0;
        }
        const audioId = cc.audioEngine.play(clip, true, volume);
        this._music.set(clip, audioId);
    }
    public resumeAllMusic(): void {
        this._music.forEach((t, n) => {
            return this.resumeMusic(n);
        });
    }
    public resumeMusic(e: cc.AudioClip): void {
        if (this._music.has(e)) {
            cc.audioEngine.resume(this._music.get(e));
        }
    }
    save() {
        var e = {
            switch_effect: this.soundSwitch,
            switch_music: this.musicSwitch,
            volume_effect: this.effectVolume,
            volume_master: this.masterVolume,
            volume_music: this.musicVolume
        };
        LocalStorageTool.setItemLocal("cc_game_audio_data", JSON.stringify(e));
    }
    public setEffectVolume(e: number): void {
        e < 0 ? e = 0 : e > 1 && (e = 1);
        this._effectVolume = e;
        let t = this._masterVolume * e;
        if (this._soundSwitch == true) {
            t = 0;
        }
        this._effects.forEach((clip) => {
            cc.audioEngine.setVolume(clip, t);
        });
        this.save();
    }
    public setMasterVolume(e: number): void {
        e < 0 ? e = 0 : e > 1 && (e = 1);
        this._masterVolume = e;
        this.setMusicVolume(this._musicVolume);
        this.setEffectVolume(this._effectVolume);
        this.save();
    }
    public setMusicSwitch(e: boolean): void {
        this._musicSwitch = e;
        if (e == false) {
            this._music.forEach((clip) => {
                cc.audioEngine.setVolume(clip, 0);
            });
        }
        else {
            const t = this._masterVolume * this._musicVolume;
            this._music.forEach((clip) => {
                cc.audioEngine.setVolume(clip, t);
            });
        }
        this.save();
    }
    public setMusicVolume(e: number): void {
        e < 0 ? e = 0 : e > 1 && (e = 1);
        this._musicVolume = e;
        let t = this._masterVolume * e;
        if (this._musicSwitch == false) {
            t = 0;
        }
        this._music.forEach((clip) => {
            cc.audioEngine.setVolume(clip, t);
        });
        this.save();
    }
    public setSoundSwitch(e: boolean): void {
        this._soundSwitch = e;
        if (e == false) {
            this.stopAllEffect();
        }
        this.save();
    }
    public setVolume(e: number): void {
        this.setMusicVolume(e);
        this.setEffectVolume(e);
        this.save();
    }
    private startSound(e: cc.AudioClip, t: boolean = false): void {
        let o = this._masterVolume * this._effectVolume;
        this._soundSwitch || (o = 0);
        const r = cc.audioEngine.play(e, t, o);
        const i = e.nativeUrl;
        this._effects.set(i, r);
        if (!t) {
            cc.audioEngine.setFinishCallback(r, () => {
                this._effects.delete(i);
                cc.audioEngine.setFinishCallback(r, null);
            });
        }
    }
    public stopAllEffect(): void {
        this._effects.forEach((e) => {
            cc.audioEngine.stop(e);
        });
        this._effects.clear();
    }
    public stopAllMusic(): void {
        this._music.forEach((t, n) => {
            return this.stopMusic(n);
        });
    }
    public stopEffect(e: string | cc.AudioClip): void {
        if (typeof e == "string") {
            e = this._audios[e];
        }
        this.stopSound(e);
    }
    public stopMusic(e: string | cc.AudioClip): void {
        let t: cc.AudioClip;
        t = typeof e == "string" ? this._audios[e] : e;
        if (this._music.has(t)) {
            cc.audioEngine.stop(this._music.get(t));
            this._music.delete(t);
        }
    }
    private stopSound(e: any): void {
        let t = e.nativeUrl;
        let n = this._effects.get(t);
        if (!u.isNil(n)) {
            cc.audioEngine.stop(n);
            this._effects.delete(t);
        }
        for (let o = this.head_; o != this.tail_; o = (o + 1) % p) {
            if (this.soundPending_[o].audioClip == e) {
                this.soundPending_[o] = this.soundPending_[this.tail_];
                this.tail_ = (this.tail_ + p - 1) % p;
                break;
            }
        }
    }
    static get Instance(): SoundPlayerComp {
        if (null == this._instance) {
            let e: cc.Node = new cc.Node("SoundPlayerComp");
            cc.game.addPersistRootNode(e);
            this._instance = e.addComponent(SoundPlayerComp);
            this._instance.load();
        }
        return this._instance;
    }
    get effectVolume(): number {
        return this._effectVolume;
    }
    get masterVolume(): number {
        return this._masterVolume;
    }
    get musicSwitch(): boolean {
        return this._musicSwitch;
    }
    get musicVolume(): number {
        return this._musicVolume;
    }
    get soundSwitch(): boolean {
        return this._soundSwitch;
    }
}
