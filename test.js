const KeyQL = require('./index.js');

let characters = [
  {
    id: 1,
    first_name: 'Jon',
    last_name: 'Snow',
    gender: 'm',
    age: 14,
    location: 'Winterfell'
  },
  {
    id: 2,
    first_name: 'Eddard',
    last_name: 'Stark',
    gender: 'm',
    age: 35,
    location: 'Winterfell'
  },
  {
    id: 3,
    first_name: 'Catelyn',
    last_name: 'Stark',
    gender: 'f',
    age: 33,
    location: 'Winterfell'
  },
  {
    id: 4,
    first_name: 'Roose',
    last_name: 'Bolton',
    gender: 'm',
    age: 40,
    location: 'Dreadfort'
  },
  {
    id: 5,
    first_name: 'Ramsay',
    last_name: 'Snow',
    gender: 'm',
    age: 15,
    location: 'Dreadfort'
  }
];

let result = KeyQL.query(
  characters,
  [
    {
      last_name: 'Snow'
    }
  ]
);

console.log(result);
