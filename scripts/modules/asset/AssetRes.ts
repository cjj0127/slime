export enum EResourceType {
    Local,
    Remote
}
export enum ECacheStatus {
    NONE,
    Loading,
    Loaded,
    WAITTING_FOR_RELEASE
}
export const NAMES_BUNDLE = {
    Game: "Game",
    Main: "Main",
};
export class ResInfo {
    bundle?: string;
    resourceType?: EResourceType;
    type: EResourceType;
    path: string;
    constructor() {
        this.type = EResourceType.Local;
    }
}
export default class CacheInfo {
    assets: any = null;
    handlers: Function[] = [];
    isLoaded: boolean = false;
    resInfo: ResInfo = new ResInfo();
    retain: boolean = false;
    status: ECacheStatus = ECacheStatus.NONE;
    doHanlder() {
        for (let i = 0; i < this.handlers.length; i++) {
            const handler = this.handlers[i];
            if (handler) {
                handler(this);
            }
        }
        this.handlers = [];
    }
    setResInfo(path: string, type?: any, bundle?: string) {
        this.resInfo.path = path;
        if (type) {
            this.resInfo.type = type;
        }
        if (bundle) {
            this.resInfo.bundle = bundle;
        }
    }
    get isInValid(): boolean {
        return this.status == ECacheStatus.Loaded && this.assets && !cc.isValid(this.assets);
    }
}
