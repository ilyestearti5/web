import { Table } from './lib/table.js';

var tb = Table.create('dt', { name: 'unkown' });

document.body.prepend(tb.root);

await tb.methode(
  'append',
  'Anes,Akrem,Islam,Ines,Ahsen'.split(',').map(name => {
    return { name };
  }),
);
tb.addLine();
await tb.methode(
  'append',
  'Anes,Akrem,Islam,Ines,Ahsen'
    .split(',')
    .reverse()
    .map(name => {
      return { name };
    }),
);
