import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UtilService {
    private readonly storageKey: string = 'BookServiceJwtKey';

    constructor() { }

    saveJwt(jwt: string): void {
        sessionStorage.setItem(this.storageKey, jwt);
    }
    getJwt(): string{
        return sessionStorage.getItem(this.storageKey) ?? '';
    }
    resetJwt(): void{
        sessionStorage.removeItem(this.storageKey);
    }
}
