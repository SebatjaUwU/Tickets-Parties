import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);

  async uploadBuffer(buffer: Buffer, key: string, mimeType: string): Promise<string> {
    this.logger.log(`[TODO] Upload to S3: ${key}`);
    return `https://cdn.placeholder.com/${key}`;
  }

  async deleteFile(key: string): Promise<void> {
    this.logger.log(`[TODO] Delete from S3: ${key}`);
  }

  getPublicUrl(key: string): string {
    return `https://cdn.placeholder.com/${key}`;
  }
}
