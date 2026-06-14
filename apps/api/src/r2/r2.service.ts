import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class R2Service {
  private client = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });

  private bucket = process.env.R2_BUCKET!;
  private publicUrl = process.env.R2_PUBLIC_URL!;

  async uploadPhoto(userId: string, buffer: Buffer, mimeType: string): Promise<string> {
    const key = `photos/${userId}.jpg`;
    await this.client.send(
      new PutObjectCommand({ Bucket: this.bucket, Key: key, Body: buffer, ContentType: mimeType }),
    );
    return `${this.publicUrl}/${key}`;
  }

  async deletePhoto(userId: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: `photos/${userId}.jpg` }),
    );
  }
}
