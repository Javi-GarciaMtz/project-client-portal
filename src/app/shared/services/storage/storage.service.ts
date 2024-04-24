import { Injectable } from '@angular/core';
import { encryption_key } from '../../../environments/environments';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private encryptionKey: string = `${encryption_key}s_s_20240424125234`;

  constructor() { }

  encryptAndStoreData(data: any, key: string) {
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptionKey).toString();
    localStorage.setItem(key, encryptedData);
  }

  retrieveAndDecryptData(key: string): any {
    const encryptedData = localStorage.getItem(key);
    if (encryptedData) {
      const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
      const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedData);
    }
    return null;
  }

  clearData(key: string) {
    localStorage.removeItem(key);
  }

}
