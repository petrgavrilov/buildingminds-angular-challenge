import { inject, Injectable } from '@angular/core';
import { STORAGE_GLOBAL_KEY } from '@app/core/tokens/storage';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private storage: Storage = localStorage;
  private globalKey: string = inject(STORAGE_GLOBAL_KEY);

  public getItem<T>(key: string): T | null;
  public getItem<T, K>(key: string, defaultValue: K): T | K;
  public getItem<T, K>(key: string, defaultValue?: K): T | K | null {
    const storageKey = `${this.globalKey}::${key}`;
    const json = this.storage.getItem(storageKey);

    if (json === null) {
      return defaultValue === undefined ? null : defaultValue;
    }

    try {
      return JSON.parse(json) as T;
    } catch (err) {
      console.error(`Error parsing localStorage["${storageKey}"]`, err);
      return defaultValue === undefined ? null : defaultValue;
    }
  }

  private getKey(key: string): string {
    return `${this.globalKey}::${key}`;
  }

  public setItem<T extends object>(key: string, value: T): void {
    const storageKey = this.getKey(key);

    try {
      const serializedValue = JSON.stringify(value);
      this.storage.setItem(storageKey, serializedValue);
    } catch (error) {
      console.error(`Error setting item in storage with key "${storageKey}":`, error);
    }
  }
}
