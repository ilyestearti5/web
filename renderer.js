import { TreeLinear } from './lib/index.js';
var tree = TreeLinear.create('Explorer', { id: ({ name }) => 'no provied for ' + name, name: ' - ', inner: true });
tree.setHiddenPropertys('inner', 'id');
tree.setTreePropertys({ property: 'inner', value: true });
tree.methodeSync(
  'insert',
  '',
  'Ahmed,Islam,Akrem,Ines,Ilyes'.split(',').map(name => {
    return {
      body: {
        name,
      },
      innerTree: 'Ahmed,Islam,Akrem,Ines,Ilyes'.split(',').map(name => {
        return {
          body: {
            name,
            inner: false,
          },
        };
      }),
    };
  }),
);

document.body.prepend(tree.root);
tree.setCallbackQuery(({ name }) => name);
tree.separator = '.';
tree.addLine(tree.convertTo('Ahmed', 'element'), 1);
tree.addLine(tree.convertTo('Islam', 'element'), 2);
tree.addLine(tree.convertTo('Islam.Ahmed', 'element'), 1);
