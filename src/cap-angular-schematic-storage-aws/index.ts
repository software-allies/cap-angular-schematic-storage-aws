import { apply, MergeStrategy, mergeWith, Rule, move, SchematicContext, Tree, template, url } from '@angular-devkit/schematics';
import { join, normalize } from 'path';
import { getWorkspace } from '@schematics/angular/utility/config';

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
    console.log('templateSource: ', templateSource);
    const rule = mergeWith(templateSource, MergeStrategy.Overwrite);
    return rule(tree, _context);
  };
}
