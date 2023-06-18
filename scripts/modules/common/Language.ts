import LangData from "./LangData";
import LanPack from "./LanPack";
export enum E_LanguageEvent {
    CHANGE = 'E_LanguageEvent.CHANGE',
    RELEASE_RES = 'E_LanguageEvent.RELEASE_RES'
}
export default class LanMgr {
    private _languagePack = new LanPack();
    private _support: string[] = ['zh', 'en', 'tr'];
    private static instance: LanMgr;
    getLangByID(id: any): string {
        return LangData.getLangByID(id);
    }
    getNextLang(): string {
        const languages = this.languages;
        const currentIndex = languages.indexOf(LangData.current);
        return languages[(currentIndex + 1) % languages.length];
    }
    isExist(language: string): boolean {
        return this.languages.indexOf(language) > -1;
    }
    loadLanguageAssets(language: string, callback: Function): void {
        language = language.toLowerCase();
        this._languagePack.loadLanguageAssets(language, callback);
    }
    releaseLanguageAssets(language: string): void {
        language = language.toLowerCase();
        this._languagePack.releaseLanguageAssets(language);
        cc.director.emit(E_LanguageEvent.RELEASE_RES, language);
    }
    setAssetsPath(path: string, extension: string): void {
        this._languagePack.setAssetsPath(path, extension);
    }
    setLanguage(language: string, callback: Function): void {
        language = language ? language.toLowerCase() : 'zh';
        if (this.languages.indexOf(language) < 0) {
            console.warn(`当前不支持该语种${language} 将自动切换到 zh 语种!`);
            language = 'zh';
        }
        if (language !== LangData.current) {
            this.loadLanguageAssets(language, (error, data) => {
                if (error) {
                    console.error('语言资源包下载失败', error);
                    callback(false);
                    return;
                }
                LangData.current = language;
                this._languagePack.updateLanguage(language);
                cc.director.emit(E_LanguageEvent.CHANGE, data);
                callback(true);
            });
        }
        else {
            callback(false);
        }
    }
    public static get Instance(): LanMgr {
        if (!LanMgr.instance) {
            LanMgr.instance = new LanMgr();
        }
        return LanMgr.instance;
    }
    get current(): string {
        return LangData.current;
    }
    get languages(): string[] {
        return this._support;
    }
    set supportLanguages(languages: string[]) {
        this._support = languages;
    }
}
