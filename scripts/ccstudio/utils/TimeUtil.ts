import MyTools from "./MyTools";
export default class UtilTime {
    static getDate() {
        return MyTools.GetDateNow().toLocaleDateString();
    }
    static getDateNow() {
        return MyTools.GetDateNow();
    }
    static getNowTime(e = true) {
        let t = "";
        if (e) {
            t += this.getDate() + "/";
        }
        const n = MyTools.GetDateNow();
        return t + (n.getHours() + "/") + n.getMinutes() + "/" + n.getSeconds();
    }
    static getTargetTimestamp(e = 0, t = 0, n = 0) {
        const r = new Date(MyTools.GetDateNow().toLocaleDateString()).getTime();
        return new Date(r + 1000 * (3600 * e + 60 * t + n)).getTime();
    }
    static getTimestamp() {
        return MyTools.GetTimeNow();
    }
    static isSameDay(e) {
        const t = new Date();
        const n = t.getFullYear();
        const o = t.getMonth() + 1;
        const r = t.getDate();
        const i = e.split('-');
        return parseInt(i[0]) === n && parseInt(i[1]) === o && parseInt(i[2]) === r;
    }
    static isSameUtcDate(date) {
        const d = new Date(date);
        const now = new Date();
        return (d.getUTCFullYear() === now.getUTCFullYear() &&
            d.getUTCMonth() === now.getUTCMonth() &&
            d.getUTCDate() === now.getUTCDate());
    }
    static msToHMS(e, t = ":", n = true) {
        const o = Math.floor(e / 3600000), r = Math.floor((e - 3600000 * o) / 60000), i = Math.floor((e - 3600000 * o - 60000 * r) / 1000);
        return ((o !== 0 || n) ? o.toString().padStart(2, "0") + ":" : "") + r.toString().padStart(2, "0") + t + i.toString().padStart(2, "0");
    }
}
