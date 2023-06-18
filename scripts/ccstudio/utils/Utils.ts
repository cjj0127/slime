const _: any = window['_'];
export default class Utils_ {

    static getItemByWeight<T>(t: T[], n: any, r?: number): T {
        if (!n) {
            n = function (e: T) {
                return e;
            };
        }
        const i = _.map(t, n);
        return t[this.getRandIndex_(i, r)];
    }

    static getRandIndex_(t: number[], n?: number): number {
        if (n == undefined) {
            n = 0;
            for (let r = 0, i = t; r < i.length; r++) {
                n += i[r];
            }
        }
        for (let a = this.random(n), s = 0, c = 0; c < t.length; c++) {
            if (a < (s += t[c])) {
                return c;
            }
        }
        return t.length - 1;
    }

    static random(e: number): number {
        return Math.random() * e;
    }

    static randomNumber(e: number): number {
        return Math.floor(90071992547400 * Math.random()) % e;
    }

    static getRandomRange(e: number, t: number): number {
        return Math.floor(Math.random() * (t - e)) + e;
    }

    static setGray(e: cc.Sprite): void {
        const t = cc.Material.createWithBuiltin(cc.Material.BUILTIN_NAME.GRAY_SPRITE + "", 0);
        e.setMaterial(0, t);
    }

    static waits(e: number): Promise<void> {
        return new Promise(function (t) {
            setTimeout(t, 1000 * e);
        });
    }
}
