export class CCSdkCfg {
    public clientId: string = "mogu-wx";
    public clientSecret: string = ""//"f624664fa2a5ca470fab914add769e7c8ea1";
    public serverUrl: string = "";//"https://service-cn.fuqiangame.com";
    cloneFrom(e: CCSdkCfg): void {
        this.clientId = e.clientId;
        this.clientSecret = e.clientSecret;
        this.serverUrl = e.serverUrl;
    }
}
class ZtLoginParams {
    grant_type = '';
    password = '';
    provider = '';
    scope = '';
    userId = '';
    username = '';
}
export default class CCSdk {
    private _cfg: CCSdkCfg = null;
    private static _instance: CCSdk = null;
    private _token = '';
    private _tokenType = '';
    private _userId = '';
    SHA256(message: string): string {
        return message;
    }
    buidObject(data: any) {
        const obj = {};
        (function construct(obj) {
            for (const key in obj) {
                if (typeof obj[key] == "object") {
                    const child = obj[key];
                    delete obj[key];
                    construct(child);
                }
                else {
                    obj[key] = obj[key];
                }
            }
        })(data);
        return obj;
    }
    // private sign(client_id: string, client_secret: string, solt: string, requestId: string, timestamp: number, data: any): string {
    //   let str = '';
    //   Object.keys(data).sort().forEach(key => {
    //     str += `${key}=${data[key]}&`;
    //   });
    //   str = str.slice(0, -1);
    //   const rawStr = `${client_id}${solt}${requestId}${timestamp}${str}${client_secret}`;
    //   return md5(rawStr);
    // }
    getNowTime() {
        return Date.now();
        // const url = "utils/api/v1/getNowTime";
        // const request = JSON.stringify({});
        // const headers = new Map();
        // headers.set("clientId", this._cfg.clientId);
        // return new Promise((resolve, reject) => {
        //   this.xhrPost(url, headers, request, (response: string) => {
        //     try {
        //       response = JSON.parse(response);
        //     } catch (error) { }
        //     console.log("getNowTime: ", response);
        //     "ok" == response.msg && response.data ? resolve(Number(response.data)) : reject();
        //   });
        // });
    }
    getPlayerOpenId(e: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const params = new Map<string, string>();
            params.set('clientId', this._cfg.clientId);
            const requestBody = JSON.stringify({ jsCode: e });
            this.xhrPost(this.getUrlOfService('utils/api/v1/wxGetOpenID'), params, requestBody, function (responseText) {
                try {
                    const responseJson = JSON.parse(responseText);
                    if (responseJson.msg == 'ok' && responseJson.data && responseJson.data.openid && responseJson.data.openid.length > 0) {
                        console.log('openid: ', responseJson.data.openid);
                        resolve(responseJson.data.openid);
                    }
                    else {
                        reject(responseJson);
                    }
                }
                catch (error) { }
            });
        });
    }
    private getTimeStamp(): number {
        return Math.floor(Date.now() / 1000);
    }
    private getUrlOfService(e: string): string {
        return `${this._cfg.serverUrl}${e}`;
    }
    init(e: CCSdkCfg): void {
        this._cfg.cloneFrom(e);
    }
    sendSubscribeMsg(e: string, t: string, n: number) {
        // const r = Math.max(Number(36e5 * s.scrMgr.getPromissionCd(e)), Number(n));
        // s.scrMgr.saveSubscribeTime(e, r);
        // return new Promise((resolve, reject) => {
        //   const userOpenId = cc.sys.localStorage.getItem('userOpenId') || '';
        //   const params = new Map<string, string>();
        //   params.set('clientId', this._cfg.clientId);
        //   try {
        //     t = JSON.parse(t);
        //   } catch (error) { }
        //   const requestBody = JSON.stringify({
        //     req: {
        //       data: t,
        //       lang: 'zh_CN',
        //       miniprogram_state: 'formal',
        //       page: 'index',
        //       template_id: e,
        //       touser: userOpenId,
        //     },
        //     triggerTime: Math.floor(n / 1000) + 1,
        //   });
        //   console.log('sendSubscribeMsg_req: ', JSON.parse(requestBody));
        //   this.xhrPost(
        //     this.getUrlOfService('utils/api/v1/wxSendSubsMsg'),
        //     params,
        //     requestBody,
        //     function (responseText) {
        //       try {
        //         const responseJson = JSON.parse(responseText);
        //         if (responseJson.msg == 'ok' && responseJson.data) {
        //           resolve(responseJson);
        //         } else {
        //           reject(responseJson);
        //         }
        //       } catch (error) { }
        //     },
        //   );
        // });
    }
    setSystemTime(callback?: () => void) {
        const url = "utils/api/v1/getNowTime";
        const request = JSON.stringify({});
        const headers = new Map();
        headers.set("clientId", this._cfg.clientId);
        this.xhrPost(url, headers, request, (response: string) => {
            // try {
            //   response = JSON.parse(response);
            // } catch (error) {
            //   console.error("setSystemTime parse err! ");
            // }
            // console.log("getNowTime: ", response);
            // if ("ok" == response.msg && response.data) {
            //   window['systemTimeStamp'] = Number(response.data);
            // } else {
            //   console.error("setSystemTime request err! ");
            //   window['systemTimeStamp'] = Date.now() / 1e3;
            // }
            callback && callback();
        });
    }
    updateUserVersion(e: string) {
        // const n = _QuestConfig.getVersion();
        // let o = '';
        // n.split('.').forEach(function (e) {
        //   let t = e;
        //   if (Number(e) < 10) {
        //     t = '0' + e;
        //   }
        //   o += t;
        // });
        // const r = 864e5 * s.scrMgr.getPromissionCd(e);
        // s.scrMgr.saveSubscribeTime(e, r);
        // return new Promise((resolve, reject) => {
        //   const userOpenId = cc.sys.localStorage.getItem('userOpenId') || '';
        //   const requestBody = JSON.stringify({ openId: userOpenId, version: o });
        //   const timestamp = this.getTimeStamp();
        //   const requestId = '' + MyTools.GetNowTime() + Math.floor(10000 * Math.random());
        //   const sign = "";//this.sign(this._cfg.clientId, this._cfg.clientSecret, this._cfg.clientId, requestId, timestamp, { openId: userOpenId, version: o })
        //   const params = new Map<string, string>();
        //   params.set('clientId', this._cfg.clientId);
        //   params.set('timestamp', timestamp + "");
        //   params.set('requestId', requestId);
        //   params.set('solt', this._cfg.clientId);
        //   params.set('sign', sign);
        //   this.xhrPost(
        //     this.getUrlOfService('utils/api/v1/wxUpUserVersion'),
        //     params,
        //     requestBody,
        //     function (responseText) {
        //       try {
        //         const responseJson = JSON.parse(responseText);
        //         console.log('wxUpUserVersion: ', responseJson);
        //         if (responseJson.msg == 'ok' && responseJson.data) {
        //           resolve(responseJson);
        //         } else {
        //           reject(responseJson);
        //         }
        //       } catch (error) { }
        //     },
        //   );
        // });
    }
    xhrGet(url: string, headers: Map<string, string>, request: string, callback: (response: string) => void) {
        this.xhrReq("GET", url, headers, request, callback);
    }
    xhrPost(url: string, headers: Map<string, string>, request: string, callback: (response: string) => void) {
        this.xhrReq("POST", url, headers, request, callback);
    }
    xhrReq(method: string, url: string, headers?: Map<string, string>, data?: any, callback?: (response: string) => void) {
        // l.SdkBridge.getIsNetConnect().then((isConnected: boolean) => {
        //   if (!true == isConnected) {
        //     callback && callback("");
        //     return;
        //   }
        //   const xhr = new XMLHttpRequest();
        //   xhr.withCredentials = true;
        //   xhr.timeout = 4000;
        //   xhr.addEventListener("readystatechange", () => {
        //     if (xhr.readyState == 4) {
        //       if (xhr.status >= 200 && xhr.status < 300) {
        //         cc.log("xhrReq() success.", xhr.responseText);
        //         callback && callback(xhr.responseText);
        //       } else {
        //         cc.log(`xhrReq() failed. xhr.readyState=${xhr.readyState}; xhr.status=${xhr.status};xhr.responseText=${xhr.responseText}`);
        //         callback && callback("");
        //       }
        //     }
        //   });
        //   xhr.ontimeout = function () {
        //     cc.log("xhrReq() timeout.");
        //     xhr.abort();
        //     callback && callback("");
        //   };
        //   xhr.open(method, url);
        //   headers && headers.forEach((value: string, key: string) => {
        //     xhr.setRequestHeader(key, value);
        //   });
        //   cc.log("dataStr:" + data);
        //   xhr.send(data);
        // });
    }
    private constructor() {
        this._cfg = new CCSdkCfg();
    }
    static get instance(): CCSdk {
        if (!CCSdk._instance) {
            CCSdk._instance = new CCSdk();
        }
        return CCSdk._instance;
    }
}
