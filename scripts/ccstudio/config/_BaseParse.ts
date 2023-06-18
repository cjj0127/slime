import CacheInfo, { NAMES_BUNDLE } from "../../modules/asset/AssetRes";
import AssetManager from "../../modules/asset/AssetManager";



// function post(path: string, data: any, handler: Function, failhandler: Function = null) {
//     // if (cc.sys.os == cc.sys.OS_WINDOWS || cc.sys.os == cc.sys.OS_OSX) {
//     //     return;
//     // }
//     var xhr = new XMLHttpRequest();
//     var requestURL = path;
//     xhr.open("POST", requestURL);
//     // xhr.timeout = 10000;

//     xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
//     xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST');
//     xhr.setRequestHeader('Access-Control-Allow-Headers', 'x-requested-with,content-type');
//     xhr.setRequestHeader("Content-Type", "application/json");

//     xhr.onload = () => {
//         if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
//             console.log(xhr.responseText)
//             var ret = JSON.parse(xhr.responseText);
//             if (handler) handler(ret);
//         } else xhr.abort();
//     };

//     xhr.ontimeout = (e) => {
//         cc.log(e);
//         if (failhandler)
//             failhandler();
//     };

//     xhr.onabort = (e) => {
//         cc.log(e);
//         if (failhandler)
//             failhandler();
//     };

//     xhr.onerror = (e) => {
//         cc.log(e);
//         if (failhandler)
//             failhandler();
//     }
//     xhr.send(JSON.stringify(data));
//     return xhr;
// }

export default class _BaseParse {
    _cfg: any = null;
    jsonName: string = "";
    convertStrToNumberArr(e: string, t: string) {
        void 0 == t && (t = ",");
        var n = e.split(t);
        let out = [];
        for (var i = 0; i < n.length; ++i) {
            out.push(parseInt(n[i]));
        }
        return out;
    }
    getAll() {
        return this._cfg;
    }
    load() {
        var e = this;
        return new Promise((resolve) => {
            // return r(e, void 0, void 0,
            //     function () {
            //         var e = this;
            //         return i(this,
            //             function () {
            AssetManager.Instance.load(NAMES_BUNDLE.Game, "Cfgs/" + this.jsonName, CacheInfo, null, (res: CacheInfo) => {
                var o = res.assets.json;
                // var r = XXTEATools.decryptFromBase64(o, "fu03f6ck-bfbd-4d");

                // console.log(this.jsonName);

                // post("http://localhost:8080/MyTools/savejson", {
                //     filename: this.jsonName + ".json",
                //     content: r
                // }, (res) => {
                //     console.log(res)
                // })


                e._cfg = o//JSON.parse(o);
                // console.log(this.jsonName, e._cfg);
                e.loaded && e.loaded();
                // console.log(this.jsonName, "ok");
                resolve(null);
            });
            // [2]
        });
        // })
        // })
    }
    loaded() { }
    get cfg() {
        return this._cfg;
    }
}
