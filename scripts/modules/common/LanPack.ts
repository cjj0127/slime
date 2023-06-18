import LangData from "./LangData";
import LanLabel from "./LanLabel";
import LanguageSprite from "./LanguageSprite";
export default class LanPack {
    private _langTexturePath: string = "lang_texture";
    private _langjsonPath: string = "lang_json";
    public loadLanguageAssets(language: string, callback: Function): void {
        const texturePath = this._langTexturePath + "/" + language;
        const jsonPath = this._langjsonPath + "/" + language;
        cc.resources.loadDir(texturePath, (err: any) => {
            if (err) {
                cc.error(err);
                callback(err);
                return;
            }
            cc.resources.load(jsonPath, cc.JsonAsset, (err: any, jsonAsset: cc.JsonAsset) => {
                if (err) {
                    cc.error(err);
                    callback(err);
                    return;
                }
                callback(null, jsonAsset);
            });
        });
    }
    public releaseLanguageAssets(language: string): void {
        const texturePath = this._langTexturePath + "/" + language;
        cc.resources.release(texturePath);
        const jsonPath = this._langjsonPath + "/" + language;
        cc.resources.release(jsonPath);
    }
    public setAssetsPath(jsonPath?: string, texturePath?: string): void {
        if (jsonPath)
            this._langjsonPath = jsonPath;
        if (texturePath)
            this._langTexturePath = texturePath;
    }
    public updateLanguage(language: string): void {
        const textAsset = cc.resources.get(this._langjsonPath + "/" + language, cc.JsonAsset);
        if (textAsset && textAsset.json) {
            // const decryptedJSON = XXTEATools.decryptFromBase64(textAsset.text, "fu03f6ck-bfbd-4d");
            LangData.data = textAsset.json// JSON.parse(decryptedJSON);
            // console.log(decryptedJSON)
            const children = cc.director.getScene().children;
            for (let i = 0; i < children.length; i++) {
                const labelComponents = children[i].getComponentsInChildren(LanLabel);
                for (let j = 0; j < labelComponents.length; j++)
                    labelComponents[j].language();
                const spriteComponents = children[i].getComponentsInChildren(LanguageSprite);
                for (let k = 0; k < spriteComponents.length; k++)
                    spriteComponents[k].language();
            }
        }
        else {
            cc.warn("没有找到指定语言内容配置", language);
        }
    }
}
