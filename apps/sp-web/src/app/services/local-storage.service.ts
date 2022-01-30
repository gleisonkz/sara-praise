import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private storage: Storage;

  constructor() {
    this.storage = window.localStorage;
  }

  set(key: string, value: any): boolean {
    if (!this.storage) return false;

    const json = JSON.stringify(value);
    this.storage.setItem(key, json);
    return true;
  }

  get(key: string): any {
    if (!this.storage) return null;

    const value = this.storage.getItem(key);
    return value;
  }

  remove(key: string): boolean {
    if (!this.storage) return false;

    this.storage.removeItem(key);
    return true;
  }

  clear(): boolean {
    if (!this.storage) return false;

    this.storage.clear();
    return true;
  }
}
