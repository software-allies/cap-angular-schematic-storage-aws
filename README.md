# CAP STORAGE AWS Schematic [![Generic badge](https://img.shields.io/badge/CAP-Active-<COLOR>.svg)](https://shields.io/)

**CAP STORAGE AWS Schematic** is a schematic for **Angular**, this schematic allows you to upload images using **AWS S3**.

## **Previous requirements**

**CAP STORAGE AWS** use bootstrap's classes. To be able to display the component in the right way, bootstrap should have been installed in the project. In case you don't have bootstrap installed, you can run the following command or read their [documentation](https://getbootstrap.com/docs/4.3/getting-started/download/):

``` 
npm install bootstrap
```

One's that you installed bootstrap you have to configure the `angular.json` and write into `styles` 

``` 
"styles": [
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "styles.scss"
]
```

## **`Note!`**

The schematics modify the `polifylls.ts` adding:

``` 
(window as any).global = window;
```

This allows the npm packages to fix some issues related to the global variable.

If you have some problems with the npm dependency you can also resolve these issues, either add "types": ["node"] to the project's tsconfig.app.json file, or remove the "types" field entirely.

## **Installation**

Write the following command:

``` 
ng add cap-angular-schematic-storage-aws

```

## **AWS S3 Configuration**

We recommend creating a specific folder into your bucket to save your images. Into your bucket go to **permissions'** sections, after that, go to **CORS configuration** and write the following code:

``` 
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
<CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>HEAD</AllowedMethod>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>POST</AllowedMethod>
    <ExposeHeader>ETag</ExposeHeader>
    <ExposeHeader>x-amz-meta-custom-header</ExposeHeader>
    <AllowedHeader>*</AllowedHeader>
</CORSRule>
</CORSConfiguration>
```

## **HTML tags**

## **Cap Upload**
Tag to upload images into an Amazon bucket.

**Example of implementation**

``` 
<cap-upload></cap-upload>
```

![Alt text](https://github.com/software-allies/cap-storage-aws/raw/feature/cap-aws-angular/assets/images/cap-aws.gif?raw=true "example")

## **Cap Upload Drag and Drop**

This tag use an external dependency called [ngx-file-drop](https://www.npmjs.com/package/ngx-file-drop).
Tag to upload any kind of file
**Example of implementation**

``` 
<cap-upload-drag-drop></cap-upload-drag-drop>

```

![Alt text](https://github.com/software-allies/cap-storage-aws/raw/feature/cap-aws-angular/assets/images/cap-aws-drag-drop.gif?raw=true "example")

## **Services**

The schematic contains a storage service, this services expose a method to upload images and get the images of the bucket.

**Method getFiles (example to get images)**
``` 
import { StorageService } from 'cap-storage-aws/src/services/storage.service';

constructor( private _fileUpload: StorageService ) {
        this.showFiles()
    }
    ngOnInit() {}

    getFiles(){
        this.images = this._fileUpload.getFiles();
    }
```

**Method upload**

The upload method receives 2 parameters:
A file(image) to upload and a callback, this callback it's for the event On for know when the image upload it's complete.

``` 
upload(file:any, fn:any){

}
```

