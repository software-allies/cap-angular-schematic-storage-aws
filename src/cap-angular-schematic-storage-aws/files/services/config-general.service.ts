import { Injectable, Optional } from '@angular/core';

export interface IConfigService{
     bucket: string;
     accessKeyId: string;
     secretAccessKey: string;
     region: string;
     folder: string;
}

@Injectable()

export class ConfigService {
    bucket: string;
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    folder: string;
    
    constructor(@Optional() config: IConfigService) {
        if (config) {
            this.bucket = '<%= bucket %>';//config.bucket;
            this.accessKeyId = '<%= accessKeyId %>';//config.accessKeyId;
            this.secretAccessKey = '<%= secretAccessKey %>';//config.secretAccessKey;
            this.region = '<%= region %>';//config.region;
            this.folder = '<%= folder %>';//config.folder;
        }
    }
}