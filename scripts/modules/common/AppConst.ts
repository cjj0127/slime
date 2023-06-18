const AppConstDefine = {
    BASE_VERSION: 1,
    CHECK_NETWORK_TIME: false,
    CONSOLE_DEBUG: true,
    CUNTOM_DEBUG: false,
    DEFAULT_PACKAGE_URL: "",
    DISPLAY_DEBUG: false,
    FIXUPDATE_INTERVAL: 1 / 30,
    FRAME_RATE: 30,
    FRAME_TIME: 1 / 30,
    GAME_NAME: "cc-slime",
    LANGUAGE: {
        path: {
            json: "language/json",
            texture: "language/texture"
        }
    },
    OPEN_GM: true,
    REPORT_LOG: false,
    VERSION: "1.0.0",
    getLocalStorageVersion() {
        return cc.sys.localStorage.getItem("localVersion") || AppConstDefine.VERSION;
    },
    getVersion() {
        return cc.sys.localStorage.getItem("localVersion") || AppConstDefine.VERSION;
    },
    setVersion(e: string) {
        AppConstDefine.VERSION = e;
        cc.sys.localStorage.setItem("localVersion", e);
    }
};
export default AppConstDefine;
