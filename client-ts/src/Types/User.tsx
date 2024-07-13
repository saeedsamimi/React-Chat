export class User {
    readonly id: number;
    readonly username: string;
    name?: string;
    profile?: string;

    constructor(id: number = 0, username: string = '', name?: string, profile?: string) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.profile = profile;
    }

    isValid(): boolean {
        return this.id !== 0;
    }
}