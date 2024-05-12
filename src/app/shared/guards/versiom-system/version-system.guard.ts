import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../../services/storage/storage.service';
import { version_system } from '../../../environments/environments';

export const versionSystemGuard: CanActivateFn = (route, state) => {

  const storageService: StorageService = new StorageService();
  const versionSystem: string | null = storageService.retrieveAndDecryptVersionSystem();

  if( versionSystem !== null ) {
    if( versionSystem !== version_system ) {
      storageService.clearAll();
    }

  } else {
    storageService.clearAll();
  }

  return true;
};
