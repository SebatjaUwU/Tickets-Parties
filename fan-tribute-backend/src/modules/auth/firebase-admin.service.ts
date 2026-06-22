import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseAdminService {
  private readonly logger = new Logger(FirebaseAdminService.name);
  private app: any;

  constructor(private readonly config: ConfigService) {
    this.init();
  }

  private async init() {
    try {
      const admin = await import('firebase-admin');
      if (!admin.apps.length) {
        this.app = admin.initializeApp({
          projectId: this.config.get('FIREBASE_PROJECT_ID'),
        });
      } else {
        this.app = admin.apps[0];
      }
    } catch (e) {
      this.logger.warn('Firebase Admin SDK not initialized: ' + (e as Error).message);
    }
  }

  async verifyIdToken(idToken: string): Promise<any> {
    if (!this.app) throw new Error('Firebase not initialized');
    const admin = await import('firebase-admin');
    return admin.auth(this.app).verifyIdToken(idToken);
  }
}
