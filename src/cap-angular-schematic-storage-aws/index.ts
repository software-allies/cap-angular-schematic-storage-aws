import {
  Rule,
  Tree,
  chain,
  SchematicContext,
} from '@angular-devkit/schematics';
import { SchemaI } from './schema';
import { NodeDependencyType } from 'schematics-utilities';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import * as cap_utilities from 'cap-utilities';


function addGlobalToPolyfills() {
  return (tree: Tree) => cap_utilities.addToPolyfillsFile(tree, '(window as any).global = window;');
}


export function capAngularSchematicStorageAws(_options: SchemaI): any {
  return (tree: Tree, _context: SchematicContext) => cap_utilities.setupOptions(tree, _options);
}


export function addPackageJsonDependencies(): Rule {
  return (host: Tree) => {
    cap_utilities.addPackageToPackageJson(host, NodeDependencyType.Default, 'cap-storage-aws', '~3.0.3')
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

function addModuleToImports(options: SchemaI): Rule {
  return (host: Tree) => cap_utilities.addToNgModule(host, options,
      [{
        name: 'CapStorageAWS',
        path: `cap-storage-aws`,
        type: 'module',
        forRootValues: [
          {
            name: 'bucket',
            value: `${options.bucket}`
          },
          {
            name: 'accessKeyId',
            value: `${options.accessKeyId}`
          },
          {
            name: 'secretAccessKey',
            value: `${options.secretAccessKey}`
          },
          {
            name: 'region',
            value: `${options.region}`
          },
          {
            name: 'folder',
            value: `${options.folder}`
          }
        ]
      }]
    )
}

export default function (options: SchemaI): Rule {
  return chain([
    capAngularSchematicStorageAws(options),
    addPackageJsonDependencies(),
    installPackageJsonDependencies(),
    addGlobalToPolyfills(),
    addModuleToImports(options),
  ]);
}