const _: any = window['_'];
export default class MyTools {
    public static runningTime: number = 0;
    public static serverTime: number = new Date().getTime();
    public static GetDateNow(): Date {
        return new Date(this.GetTimeNow());
    }
    public static GetTimeNow(): number {
        const currentTime = Date.now();
        return currentTime;
    }
    static formatNumberToFloatStr(e) {
        return Math.floor(100 * e + .5) / 100;
    }
    static formatNumberToInt(e, t = null, n = null) {
        n = n || 0;
        var o = e < 0 ? "-" : "", r = Math.abs(+e || 0).toFixed(n), i = parseInt(r, 10) + "", a = i.length > 3 ? i.length % 3 : 0;
        return o + (a ? i.substr(0, a) + "," : "") + i.substr(a).replace(/(\d{3})(?=\d)/g, "$1,") + (n ? "." + Math.abs(e - parseInt(i)).toFixed(n).slice(2) : "");
    }
    static getChLen(str: string) {
        return str.replace(/[\\u0391-\\uFFE5]/g, 'aa').length;
    }
    // public static isSameDay(date1: number, date2: number): boolean {
    //     return new Date(date1).setHours(0, 0, 0, 0) == new Date(date2).setHours(0, 0, 0, 0);
    // }
    // public static isSameWeek(date1: number, date2: number): boolean {
    //     // const day1: number = Math.floor(new Date(date1).getTime() / 864e5);
    //     // const day2: number = Math.floor(new Date(date2).getTime() / 864e5);
    //     // return Math.floor((day1 + 4) / 7) == Math.floor((day2 + 4) / 7);
    //     const WEEK_IN_MS = 604800000; // 一周的毫秒数
    //     const startOfWeek1 = date1 - new Date(date1).getDay() * 86400000; // 获取 date1 所在周的周日的时间戳
    //     const startOfWeek2 = date2 - new Date(date2).getDay() * 86400000; // 获取 date2 所在周的周日的时间戳
    //     return Math.abs(startOfWeek1 - startOfWeek2) < WEEK_IN_MS;
    // }
    public static sleep(time: number): Promise<void> {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    }
}
