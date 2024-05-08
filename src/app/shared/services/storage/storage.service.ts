import { Injectable } from '@angular/core';
import { encryption_key, ls_user_session } from '../../../environments/environments';
import * as CryptoJS from 'crypto-js';
import { User } from '../../../auth/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private encryptionKey: string = `${encryption_key}s_s_20240424125234`;

  constructor() { }

  encryptAndStoreUser(data: User) {
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptionKey).toString();
    localStorage.setItem(ls_user_session, encryptedData);
  }

  retrieveAndDecryptUser(): User {
    const encryptedData = localStorage.getItem( ls_user_session );
    if ( encryptedData !== null ) {
      const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
      const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedData);
    }

    return { token: '', customs_rules: [], user: { id: -1, name: '', middle_name: '', last_name: '', rfc: '', phone: '', email: '', role: '', email_verified_at: '', created_at: '', updated_at: '', status: '', company_id: -1, entity_type: '' } };

  }

  clearDataUser() {
    localStorage.removeItem( ls_user_session );
  }

}
