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

export function setupOptions(host: Tree, options: any): Tree {
  const workspace = getWorkspace(host);
  if (!options.project) {
    options.project = Object.keys(workspace.projects)[0];
  }
  const project = workspace.projects[options.project];

  options.path = join(normalize(project.root), 'src/app/modules/cap-storage-aws');
  return host;
}

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


export function capAngularSchematicStorageAws(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    setupOptions(tree, _options);
    const movePath = normalize(_options.path + '/');
    const templateSource = apply(url('./files'), [
      template({
        ..._options
      }),
      move(movePath),
      forEach((fileEntry: FileEntry) => {
        if (tree.exists(fileEntry.path)) {
          tree.overwrite(fileEntry.path, fileEntry.content);
        }
        return fileEntry;
      }),
    ]);
    const rule = mergeWith(templateSource, MergeStrategy.Overwrite);
    return rule(tree, _context);
  };
}


export function addPackageJsonDependencies(): Rule {
  return (host: Tree, context: SchematicContext) => {
    const dependencies: NodeDependency[] = [
      { type: NodeDependencyType.Default, version: '~3.0.7', name: 'cap-storage-aws' },
    ];

    dependencies.forEach(dependency => {
      addPackageJsonDependency(host, dependency);
      context.logger.log('info', `✅️ Added "${dependency.name}" into ${dependency.type}`);
    });

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

function addModuleToImports(options: any): Rule {
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

export default function (options: any): Rule {
  return chain([
    options && options.skipModuleImport ? noop() : capAngularSchematicStorageAws(options),
    options && options.skipPackageJson ? noop() : addPackageJsonDependencies(),
    options && options.skipPackageJson ? noop() : installPackageJsonDependencies(),
    options && options.skipPolifills ? noop() : addGlobalToPolyfills(),
    options && options.skipModuleImport ? noop() : addModuleToImports(options),
  ]);
}

export function addToRootModule(host: Tree, modulePath: string, moduleName: string, src: string, options?: any) {

  const moduleSource = getSourceFile(host, modulePath);

  if (!moduleSource) {
    throw new SchematicsException(`Module not found: ${modulePath}`);
  }

  const changes = addImportToModule(moduleSource as any, modulePath, moduleName, src);
  let recorder = host.beginUpdate(modulePath);

  changes.forEach((change: any) => {
    // if (change instanceof InsertChange) {
    if (change.toAdd === ',\n    CapStorageAWS') {
      change.toAdd = `,\n    CapStorageAWS.forRoot({
        bucket: '${options.bucket}',
        accessKeyId: '${options.accessKeyId}',
        secretAccessKey: '${options.secretAccessKey}',
        region: '${options.region}',
        folder: '${options.folder}',
        endpoint: '${options.endpoint}'
        })`;
    }
    recorder.insertLeft(change.pos, change.toAdd);

    // }
  });
  host.commitUpdate(recorder);

  return host
}