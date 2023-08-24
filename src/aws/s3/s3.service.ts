import { Injectable, Logger } from '@nestjs/common';
import { Express } from 'express';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private logger = new Logger(S3Service.name);
  private region: String;
  private s3: S3Client;
  constructor(private configService: ConfigService) {
    this.region = configService.get<string>('S3_REGION') || 'us-east-1';
    this.s3 = new S3Client({
      region: this.region as string,
    });
  }

  async uploadFile(file: Express.Multer.File, key: string) {
    const bucket = this.configService.get<string>('S3_BUCKET_NAME');

    const input: PutObjectCommandInput = {
      Body: file.buffer,
      Bucket: bucket,
      Key: key,
      ContentType: file.mimetype,
    };

    try {
      const response: PutObjectCommandOutput = await this.s3.send(
        new PutObjectCommand(input),
      );

      if (response.$metadata.httpStatusCode === 200) {
        return {
          success: true,
          message: 'File uploaded successfully',
          imageURL: `https://${bucket}.s3.${this.region}.amazonaws.com/${key}`,
        };
      }

      throw new Error('Error uploading file');
    } catch (error) {
      this.logger.error(`Cannot save file inside s3`, error);
    }
  }
}
