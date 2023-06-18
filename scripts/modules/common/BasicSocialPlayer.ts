export class BasicSocialPlayerData {
    id: string;
    name: string;
    photo: string;
}
export default class BasicSocialPlayer extends BasicSocialPlayerData {
    getID(): string {
        return this.id;
    }
    getName(): string {
        return this.name;
    }
    getPhoto(): string {
        return this.photo;
    }
    constructor() {
        super();
    }
}
