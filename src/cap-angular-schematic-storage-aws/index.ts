import { apply, MergeStrategy, mergeWith, Rule, move, SchematicContext, Tree, template, url, chain, noop } from '@angular-devkit/schematics';
// import { join, normalize } from 'path';
// import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

// import { getWorkspace } from '@schematics/angular/utility/config';
// import {
//   addModuleImportToRootModule,
//   addPackageJsonDependency,
//   getProjectFromWorkspace,
//   getWorkspace,
//   NodeDependency,
//   NodeDependencyType
// } from 'schematics-utilities';

// import { , , , ,  } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  addModuleImportToRootModule,
  addPackageJsonDependency,
  getProjectFromWorkspace,
  getWorkspace,
  NodeDependency,
  NodeDependencyType
} from 'schematics-utilities';
import { normalize, join } from 'path';


export function setupOptions(host: Tree, options: any): Tree {
  const workspace = getWorkspace(host);
  if (!options.project) {
    options.project = Object.keys(workspace.projects)[0];
  }
  const project = workspace.projects[options.project];

  options.path = join(normalize(project.root), 'src/app/modules/cap-storage-aws');
  return host;
}

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function capAngularSchematicStorageAws(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    setupOptions(tree, _options);
    const movePath = normalize(_options.path + '/');
    const templateSource = apply(url('./files'), [
      template({ ..._options }),
      move(movePath)
    ]);
    const rule = mergeWith(templateSource, MergeStrategy.Overwrite);
    return rule(tree, _context);
  };
}


export function addPackageJsonDependencies(): Rule {
  return (host: Tree, context: SchematicContext) => {
    const dependencies: NodeDependency[] = [
      { type: NodeDependencyType.Default, version: '~2.606.0', name: 'aws-sdk' },
      { type: NodeDependencyType.Default, version: '~8.0.8', name: 'ngx-file-drop' },
      // { type: NodeDependencyType.Default, version: '~1.1.0', name: 'angular-made-with-love' }
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
  return (host: Tree, context: SchematicContext) => {
    const workspace = getWorkspace(host);
    const project = getProjectFromWorkspace(
      workspace,
      // Takes the first project in case it's not provided by CLI
      options.project ? options.project : Object.keys(workspace['projects'])[0]
      );
    const moduleName = 'CapStorageAWS';

    addModuleImportToRootModule(host, moduleName, 'AppModule', project);
    context.logger.log('info', `✅️ "${moduleName}" is imported`);

    return host;
  };
}

export default function (options: any): Rule {
  console.log('options: ', options);
  return chain([
    options && options.skipModuleImport ? noop() : capAngularSchematicStorageAws(options),
    options && options.skipPackageJson ? noop() : addPackageJsonDependencies(),
    options && options.skipPackageJson ? noop() : installPackageJsonDependencies(),
    options && options.skipModuleImport ? noop() : addModuleToImports(options),
    // options && options.skipPolyfill ? noop() : addPolyfillToScripts(options)
  ]);
}

