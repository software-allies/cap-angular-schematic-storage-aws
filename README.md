# CAP STORAGE AWS Schematic [![Generic badge](https://img.shields.io/badge/CAP-Active-<COLOR>.svg)](https://shields.io/)

**CAP STORAGE AWS Schematic** is a schematic for **Angular**, this schematic allows you to upload images using **AWS S3**.

## Table of Contents

* [Requirements](#Requirements)
* [Installation](#Installation)
* [Implementation into a module](#Use)
* [Configuration AWS S3](#Configuration)
* [Tags](#Tags)
* [Inputs](#Inputs)
* [Services](#Services)

## **Requirements**

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

## **Configuration**

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

## **Tags**

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

## **Inputs**

**fields**
| Param | Description |
| --- | --- |
| name | It's the name of the field that makes reference on your DB.|
| association | It's the reference of the data exposed for the module, it could be **id**, **name** or **url**. In case that you don't want an assosiation with data exposed you could use **none**.|
| value | Value or the field that has 'none' association.|

 
*Structure*: 

``` 
[
  {
    name: string;
    association: string;
    value?: any;
  }
]
```

**Example**

app.component.html

``` 
<cap-upload [fields]="dbFields"></cap-upload>

<cap-upload-drag-drop [fields]="dbFields"></cap-upload-drag-drop>
```

app.component.ts

``` 
let aux: IDbFields[] = [
      {
        name: 'SACAP__UUID__c',
        association: 'id'
      },
      {
        name: 'SACAP__URL__c',
        association: 'url',
      },
      {
        name: 'SACAP__Name__c',
        association: 'name',
      },
      {
        name: 'SACAP__CAP_User__c__SACAP__UUID__c',
        association: 'none',
        value: '12'
      },
    ]
    this.dbFields = [...aux]
```

**token**
| Param | Description |
| --- | --- |
| token | Recives the token to make the http request.|

**Example**

app.component.html

``` 
<cap-upload [token]="token"></cap-upload>

<cap-upload-drag-drop [token]="token"></cap-upload-drag-drop>
```

**localStorageRef**
| Param | Description |
| --- | --- |
| key | Object name's that has the credentials saved into the localStorage.|
| reference | Property name's that makes reference to the token.|

 
*Structure*: 

``` 
{
  key: string;
  reference: string;
}
```

**Example**

app.component.html

``` 
<cap-upload [localStorageRef]="localStorage"></cap-upload>

<cap-upload-drag-drop [localStorageRef]="localStorage"></cap-upload-drag-drop>
```

app.component.ts

``` 
localStorage: ILocalStorage = {
    key: 'User',
    reference: 'token'
};
```


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

