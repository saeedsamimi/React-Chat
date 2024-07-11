export interface IUser {
    id: number;
    username: string;
    name?: string;
    profileImageSrc?: string;
}

export class User implements IUser {
    readonly id: number;
    readonly username: string;
    name!: string;
    profileImageSrc!: string;

    constructor(id: number = 0, username: string = '', name = '', profileImageSrc = '') {
        this.id = id;
        this.username = username;
        this.name = name;
        this.profileImageSrc = profileImageSrc;
    }

    isValid(): boolean {
        return this.id !== 0;
    }
}