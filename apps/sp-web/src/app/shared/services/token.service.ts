import { Injectable } from '@angular/core';

import { LocalStorageService } from './local-storage.service';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor(private readonly storageService: LocalStorageService) {}

  signOut(): void {
    this.storageService.clear();
  }

  saveToken(token: string): void {
    this.storageService.remove(TOKEN_KEY);
    this.storageService.set(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return this.storageService.get(TOKEN_KEY);
  }

  saveUser(user: any): void {
    this.storageService.remove(USER_KEY);
    const json = JSON.stringify(user);
    this.storageService.set(USER_KEY, json);
  }

  getUser(): any {
    const user = this.storageService.get(USER_KEY);
    if (!user) return null;

    return JSON.parse(user);
  }
}
