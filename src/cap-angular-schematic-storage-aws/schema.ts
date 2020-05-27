export interface SchemaI {
  bucket: string,
  accessKeyId: string,
  secretAccessKey: string,
  region: string,
  folder: string,
  name?: string;
  path?: string;
  module?: any;
  project?: any;
}