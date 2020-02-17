import { apply, MergeStrategy, mergeWith, Rule, move, SchematicContext, Tree, template, url, chain, noop, forEach, FileEntry, SchematicsException } from '@angular-devkit/schematics';
import { getWorkspace, getAppModulePath, addImportToModule } from 'schematics-utilities';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  addPackageJsonDependency,
  getProjectFromWorkspace,
  NodeDependency,
  NodeDependencyType,
} from 'schematics-utilities';
import { getProjectMainFile, getSourceFile } from 'schematics-utilities/dist/cdk';
import { normalize, join } from '@angular-devkit/core';
import { Schema as AwsOptions } from './schema';



function addGlobalToPolyfills() {
  return (tree: Tree) => {
    let polifyllsPath = 'src/polyfills.ts';
    const buffer = tree.read(polifyllsPath);
    if (buffer === null) {
      throw new SchematicsException('Could not find polifulls.ts');
    }
    const polyfil: string = JSON.parse(JSON.stringify(buffer.toString()));
    let polifyllContent = polyfil;
    polifyllContent = polyfil + '\n\n (window as any).global = window; \n\n'
    tree.overwrite(polifyllsPath, polifyllContent);
    return tree;
  }
}

export function addPackageJsonDependencies(): Rule {
  return (host: Tree) => {
    addPackageJsonDependency(host, { type: NodeDependencyType.Default, version: '~3.0.3', name: 'cap-storage-aws' });
    return host;
  };
}

export function installPackageJsonDependencies(): Rule {
  return (host: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
    context.logger.log('info', `🔍 Installing packages...`);
    return host;
  };
}

function addModuleToImports(options: AwsOptions): Rule {
  return (host: Tree) => {
    const workspace = getWorkspace(host);
    const project = getProjectFromWorkspace(
      workspace,
      // Takes the first project in case it's not provided by CLI
      options.project ? options.project : Object.keys(workspace['projects'])[0]
    );
    const modulePath = getAppModulePath(host, getProjectMainFile(project));
    const moduleName = 'CapStorageAWS';
    addToRootModule(host, modulePath, moduleName, 'cap-storage-aws', options)
    return host;
  };
}
export function addToRootModule(host: Tree, modulePath: string, moduleName: string, src: string, options?: any) {

  const moduleSource = getSourceFile(host, modulePath);

  if (!moduleSource) {
    throw new SchematicsException(`Module not found: ${modulePath}`);
  }

  const changes: any[] = addImportToModule(moduleSource as any, modulePath, moduleName, src);
  let recorder = host.beginUpdate(modulePath);

  changes.forEach((change: any) => {
    if (change.toAdd === ',\n    CapStorageAWS') {
      change.toAdd = `,\n    CapStorageAWS.forRoot({
        bucket: '${options.bucket}',
        accessKeyId: '${options.accessKeyId}',
        secretAccessKey: '${options.secretAccessKey}',
        region: '${options.region}',
        folder: '${options.folder}'
        })`;
    }
    recorder.insertLeft(change.pos, change.toAdd);
  });
  host.commitUpdate(recorder);

  return host
}

export default function (options: AwsOptions): Rule {
  return chain([
    addPackageJsonDependencies(),
    installPackageJsonDependencies(),
    addGlobalToPolyfills(),
    addModuleToImports(options),
  ]);
}
