const expect = require('chai').expect;
const moment = require('moment');

const KeyQL = require('../module/index.js');
const { isMatch, iIsMatch } = require('../module/operators/wildcard.js');

const datasets = require('./datasets.json');

describe('KeyQL Validation', () => {

  it ('Should throw an error when there\'s an invalid operator', () => {

    let err;
    try {
      KeyQL.validateQueryObject({name__err: 'hello'});
    } catch (e) {
      err = e;
    }

    expect(err).to.exist;

  });

  it ('Should not throw an error when there\'s an valid key', () => {

    let err;
    try {
      KeyQL.validateQueryObject({name__is: 'hello'}, ['name']);
    } catch (e) {
      err = e;
    }

    expect(err).to.not.exist;

  });

  it ('Should throw an error when there\'s an invalid key', () => {

    let err;
    try {
      KeyQL.validateQueryObject({name__is: 'hello'}, ['age']);
    } catch (e) {
      err = e;
    }

    expect(err).to.exist;

  });

});

describe('KeyQL Setup Tests', () => {

  it ('Should query an empty dataset with no parameters provided', () => {
    let rows = new KeyQL().query().select().values();
    expect(rows.length).to.equal(0);
  });

  it ('Should query an empty dataset directly', () => {
    let rows = new KeyQL([]).query().select().values();
    expect(rows.length).to.equal(0);
  });

  it ('Should throw an error when a non-array dataset is provided', () => {
    let keyQL, error;
    try {
      keyQL = new KeyQL({});
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
  });

  it ('Should throw an error when a non-array query is provided', () => {
    let rows, error;
    let keyQL = new KeyQL([]);
    try {
      rows = keyQL.query().select({}).values();
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
  });

  it ('Should throw an error when a query is provided with an invalid operator', () => {
    let rows, error;
    let keyQL = new KeyQL([]);
    try {
      rows = keyQL.query().select([{key__NO_OP: true}]);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
  });

  it ('Should throw an error when an non-object limit is provided', () => {
    let rows, error;
    let keyQL = new KeyQL([]);
    try {
      rows = keyQL.query().select([]).limit(true);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
  });

  it ('Should throw an error when an non-object (array) limit is provided', () => {
    let rows, error;
    let keyQL = new KeyQL([]);
    try {
      rows = keyQL.query().select([]).limit([]);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
  });

  it ('Should not throw an error when an empty limit object is provided', () => {
    let rows, error;
    let keyQL = new KeyQL([]);
    try {
      rows = keyQL.query().select([]).limit({});
    } catch (e) {
      error = e;
    }
    expect(error).to.not.exist;
  });

  it ('Should not throw an error when a limit object with only "offset" is provided', () => {
    let rows, error;
    let keyQL = new KeyQL([]);
    try {
      rows = keyQL.query().select([]).limit({offset: 10});
    } catch (e) {
      error = e;
    }
    expect(error).to.not.exist;
  });

  it ('Should not throw an error when a limit object with only "count" is provided', () => {
    let rows, error;
    let keyQL = new KeyQL([]);
    try {
      rows = keyQL.query().select([]).limit({count: 10});
    } catch (e) {
      error = e;
    }
    expect(error).to.not.exist;
  });

  it ('Should throw an error if limit object overloaded', () => {
    let rows, error;
    let keyQL = new KeyQL([]);
    try {
      rows = keyQL.query().select([]).limit({INVALID: 10});
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
  });

  it ('Should throw an error when an non-object order is provided', () => {
    let rows, error;
    let keyQL = new KeyQL([]);
    try {
      rows = keyQL.query().select([]).order(true);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
  });

  it ('Should throw an error when an object limit is provided', () => {
    let rows, error;
    let keyQL = new KeyQL([]);
    try {
      rows = keyQL.query().select([]).order({});
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
  });

  it ('Should throw an error when order field is not provided', () => {
    let rows, error;
    let keyQL = new KeyQL([]);
    try {
      rows = keyQL.query().select([]).order([{}]);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
  });

  it ('Should throw an error when an non-string order field is provided', () => {
    let rows, error;
    let keyQL = new KeyQL([]);
    try {
      rows = keyQL.query().select([]).order([{field: true}]);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
  });

  it ('Should throw an error when order sort is not ASC or DESC', () => {
    let rows, error;
    let keyQL = new KeyQL([]);
    try {
      rows = keyQL.query().select([]).order([{sort: '?'}]);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
  });

  it ('Should throw an error if order object overloaded', () => {
    let rows, error;
    let keyQL = new KeyQL([]);
    try {
      rows = keyQL.query().select([]).order([{INVALID: 10}]);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
  });

  it ('Should throw an error if map function is not a function', () => {
    let keyQL, error;
    try {
      keyQL = new KeyQL([], true);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
  });

});

describe('KeyQL Operator Tests', () => {

  let GOT;

  before(() => {
    GOT = new KeyQL(datasets.gameofthrones);
  });

  it('Should select query by a specific field (default)', () => {

    let rows = GOT.query().select([{last_name: 'Snow'}]).values();
    expect(rows.length).to.equal(2);
    expect(rows[0].last_name).to.equal('Snow');
    expect(rows[1].last_name).to.equal('Snow');

  });

  it('Should select query with "is" operator', () => {

    let rows = GOT.query().select([{last_name__is: 'Snow'}]).values();
    expect(rows.length).to.equal(2);
    expect(rows[0].last_name).to.equal('Snow');
    expect(rows[1].last_name).to.equal('Snow');

  });

  it('Should select query with "not" operator', () => {

    let rows = GOT.query().select([{last_name__not: 'Snow'}]).values();
    expect(rows.length).to.equal(5);
    expect(rows[0].last_name).to.equal('Stark');
    expect(rows[1].last_name).to.equal('Stark');
    expect(rows[2].last_name).to.equal('Bolton');
    expect(rows[3].last_name).to.equal('Stark');
    expect(rows[4].last_name).to.equal('King');

  });

  it('Should select query with "gt" operator', () => {

    let rows = GOT.query().select([{age__gt: 33}]).values();
    expect(rows.length).to.equal(3);
    expect(rows[0].age).to.be.gt(33);
    expect(rows[1].age).to.be.gt(33);
    expect(rows[2].age).to.be.gt(33);

  });

  it('Should select query with "gte" operator', () => {

    let rows = GOT.query().select([{age__gte: 33}]).values();
    expect(rows.length).to.equal(4);
    expect(rows[0].age).to.be.gte(33);
    expect(rows[1].age).to.be.gte(33);
    expect(rows[2].age).to.be.gte(33);
    expect(rows[3].age).to.be.gte(33);

  });

  it('Should select query with "lt" operator', () => {

    let rows = GOT.query().select([{age__lt: 33}]).values();
    expect(rows.length).to.equal(3);
    expect(rows[0].age).to.be.lt(33);
    expect(rows[1].age).to.be.lt(33);
    expect(rows[2].age).to.be.lt(33);

  });

  it('Should select query with "lte" operator', () => {

    let rows = GOT.query().select([{age__lte: 33}]).values();
    expect(rows.length).to.equal(4);
    expect(rows[0].age).to.be.lte(33);
    expect(rows[1].age).to.be.lte(33);
    expect(rows[2].age).to.be.lte(33);
    expect(rows[3].age).to.be.lte(33);

  });

  it('Should select query with "icontains" operator', () => {

    let rows = GOT.query().select([{location__icontains: 'dread'}]).values();
    expect(rows.length).to.equal(2);
    expect(rows[0].location).to.equal('Dreadfort');
    expect(rows[1].location).to.equal('Dreadfort');

  });

  it('Should select query with "icontains" operator from array', () => {

    let rows = GOT.query().select([{alliances__icontains: 'stark'}]).values();
    expect(rows.length).to.equal(4);
    expect(rows[0].alliances).to.contain('Stark');
    expect(rows[1].alliances).to.contain('Stark');
    expect(rows[2].alliances).to.contain('Stark');
    expect(rows[3].alliances).to.contain('Stark');

  });

  it('Should select query with "contains" operator', () => {

    let rows = GOT.query().select([{location__contains: 'dread'}]).values();
    expect(rows.length).to.equal(0);

    rows = GOT.query().select([{location__contains: 'Dread'}]).values();
    expect(rows.length).to.equal(2);
    expect(rows[0].location).to.equal('Dreadfort');
    expect(rows[1].location).to.equal('Dreadfort');

  });

  it('Should select query with "contains" operator from array', () => {

    let rows = GOT.query().select([{alliances__contains: 'stark'}]).values();
    expect(rows.length).to.equal(0);

    rows = GOT.query().select([{alliances__contains: 'Stark'}]).values();
    expect(rows.length).to.equal(4);
    expect(rows[0].alliances).to.contain('Stark');
    expect(rows[1].alliances).to.contain('Stark');
    expect(rows[2].alliances).to.contain('Stark');
    expect(rows[3].alliances).to.contain('Stark');

  });

  it('Should select query with "istartswith" operator', () => {

    let rows = GOT.query().select([{first_name__istartswith: 'c'}]).values();
    expect(rows.length).to.equal(1);
    expect(rows[0].first_name).to.equal('Catelyn');

  });

  it('Should select query with "startswith" operator', () => {

    let rows = GOT.query().select([{first_name__startswith: 'c'}]).values();
    expect(rows.length).to.equal(0);

    rows = GOT.query().select([{first_name__startswith: 'C'}]).values();
    expect(rows.length).to.equal(1);
    expect(rows[0].first_name).to.equal('Catelyn');

  });

  it('Should select query with "wordstartswith" operator', () => {

    let rows = GOT.query().select([{bio__wordstartswith: 'tar'}]).values();
    expect(rows.length).to.equal(0);

    rows = GOT.query().select([{bio__wordstartswith: 'Lor'}]).values();
    expect(rows.length).to.equal(1);
    expect(rows[0].first_name).to.equal('Roose');

    rows = GOT.query().select([{bio__wordstartswith: 'Bolton'}]).values();
    expect(rows.length).to.equal(2);
    expect(rows[0].first_name).to.equal('Roose');
    expect(rows[1].first_name).to.equal('Ramsay');

  });

  it('Should select query with "iwordstartswith" operator', () => {

    let rows = GOT.query().select([{bio__iwordstartswith: 'tar'}]).values();
    expect(rows.length).to.equal(1);
    expect(rows[0].first_name).to.equal('Jon');

    rows = GOT.query().select([{bio__iwordstartswith: 'LOR'}]).values();
    expect(rows.length).to.equal(1);
    expect(rows[0].first_name).to.equal('Roose');

    rows = GOT.query().select([{bio__iwordstartswith: 'bolton'}]).values();
    expect(rows.length).to.equal(2);
    expect(rows[0].first_name).to.equal('Roose');
    expect(rows[1].first_name).to.equal('Ramsay');

  });

  it('Should select query with "iendswith" operator', () => {

    let rows = GOT.query().select([{first_name__iendswith: 'N'}]).values();
    expect(rows.length).to.equal(2);
    expect(rows[0].first_name).to.equal('Jon');
    expect(rows[1].first_name).to.equal('Catelyn');

  });

  it('Should select query with "endswith" operator', () => {

    let rows = GOT.query().select([{first_name__endswith: 'N'}]).values();
    expect(rows.length).to.equal(0);

    rows = GOT.query().select([{first_name__endswith: 'n'}]).values();
    expect(rows.length).to.equal(2);
    expect(rows[0].first_name).to.equal('Jon');
    expect(rows[1].first_name).to.equal('Catelyn');

  });

  it('Should select query with "wordendswith" operator', () => {

    let rows = GOT.query().select([{bio__wordendswith: 'ince'}]).values();
    expect(rows.length).to.equal(1);
    expect(rows[0].first_name).to.equal('Jon');

    rows = GOT.query().select([{bio__wordendswith: 'Ark'}]).values();
    expect(rows.length).to.equal(0);

    rows = GOT.query().select([{bio__wordendswith: 'Bolton'}]).values();
    expect(rows.length).to.equal(2);
    expect(rows[0].first_name).to.equal('Roose');
    expect(rows[1].first_name).to.equal('Ramsay');

  });

  it('Should select query with "iwordendswith" operator', () => {

    let rows = GOT.query().select([{bio__iwordendswith: 'ince'}]).values();
    expect(rows.length).to.equal(1);
    expect(rows[0].first_name).to.equal('Jon');

    rows = GOT.query().select([{bio__iwordendswith: 'Ark'}]).values();
    expect(rows.length).to.equal(4);
    expect(rows[0].first_name).to.equal('Jon');
    expect(rows[1].first_name).to.equal('Eddard');
    expect(rows[2].first_name).to.equal('Catelyn');
    expect(rows[3].first_name).to.equal('Arya');

    rows = GOT.query().select([{bio__iwordendswith: 'Bolton'}]).values();
    expect(rows.length).to.equal(2);
    expect(rows[0].first_name).to.equal('Roose');
    expect(rows[1].first_name).to.equal('Ramsay');

  });

  it('Should select query with "is_null" operator', () => {

    let rows = GOT.query().select([{lives_remaining__is_null: true}]).values();
    expect(rows.length).to.equal(1);
    expect(rows[0].lives_remaining).to.equal(null);

  });

  it('Should select query with "not_null" operator', () => {

    let rows = GOT.query().select([{lives_remaining__not_null: true}]).values();
    expect(rows.length).to.equal(6);
    expect(rows[0].lives_remaining).to.not.equal(null);
    expect(rows[1].lives_remaining).to.not.equal(null);
    expect(rows[2].lives_remaining).to.not.equal(null);
    expect(rows[3].lives_remaining).to.not.equal(null);
    expect(rows[4].lives_remaining).to.not.equal(null);
    expect(rows[5].lives_remaining).to.not.equal(null);

  });

  it('Should select query with "is_true" operator', () => {

    let rows = GOT.query().select([{is_sean_bean__is_true: true}]).values();
    expect(rows.length).to.equal(1);
    expect(rows[0].is_sean_bean).to.equal(true);

  });

  it('Should select query with "not_true" operator', () => {

    let rows = GOT.query().select([{is_sean_bean__not_true: true}]).values();
    expect(rows.length).to.equal(6);
    expect(rows[0].is_sean_bean).to.not.equal(true);
    expect(rows[1].is_sean_bean).to.not.equal(true);
    expect(rows[2].is_sean_bean).to.not.equal(true);
    expect(rows[3].is_sean_bean).to.not.equal(true);
    expect(rows[4].is_sean_bean).to.not.equal(true);
    expect(rows[5].is_sean_bean).to.not.equal(true);

  });

  it('Should select query with "is_false" operator', () => {

    let rows = GOT.query().select([{is_sean_bean__is_false: true}]).values();
    expect(rows.length).to.equal(4);
    expect(rows[0].is_sean_bean).to.equal(false);
    expect(rows[1].is_sean_bean).to.equal(false);
    expect(rows[2].is_sean_bean).to.equal(false);
    expect(rows[3].is_sean_bean).to.equal(false);


  });

  it('Should select query with "not_false" operator', () => {

    let rows = GOT.query().select([{is_sean_bean__not_false: true}]).values();
    expect(rows.length).to.equal(3);
    expect(rows[0].is_sean_bean).to.not.equal(false);
    expect(rows[1].is_sean_bean).to.not.equal(false);
    expect(rows[2].is_sean_bean).to.not.equal(false);

  });

  it('Should select query with "in" operator', () => {

    let rows = GOT.query().select([{first_name__in: ['Eddard', 'Catelyn']}]).values();
    expect(rows.length).to.equal(2);
    expect(rows[0].first_name).to.be.oneOf(['Eddard', 'Catelyn']);
    expect(rows[1].first_name).to.be.oneOf(['Eddard', 'Catelyn']);

  });

  it('Should select query with "not_in" operator', () => {

    let rows = GOT.query().select([{first_name__not_in: ['Arya', 'Jon']}]).values();
    expect(rows.length).to.equal(5);
    expect(rows[0].first_name).to.not.be.oneOf(['Arya', 'Jon']);
    expect(rows[1].first_name).to.not.be.oneOf(['Arya', 'Jon']);
    expect(rows[2].first_name).to.not.be.oneOf(['Arya', 'Jon']);
    expect(rows[3].first_name).to.not.be.oneOf(['Arya', 'Jon']);
    expect(rows[4].first_name).to.not.be.oneOf(['Arya', 'Jon']);

  });

  it('Should select query with "like" operator', () => {

    let rows = GOT.query().select([{last_name__like: 'S%'}]).values();
    expect(rows.length).to.equal(5);

    let names = rows.reduce((names, row) => {
      names.add(row.last_name);
      return names;
    }, new Set());
    expect(Array.from(names)).to.deep.equal(['Snow', 'Stark']);

    rows = GOT.query().select([{last_name__like: 'S%k'}]).values();
    expect(rows.length).to.equal(3);

    names = rows.reduce((names, row) => {
      names.add(row.last_name);
      return names;
    }, new Set());
    expect(Array.from(names)).to.deep.equal(['Stark']);


    rows = GOT.query().select([{first_name__like: 'R%s_'}]).values();
    expect(rows.length).to.equal(1);

    names = rows.reduce((names, row) => {
      names.add(row.first_name);
      return names;
    }, new Set());
    expect(Array.from(names)).to.deep.equal(['Roose']);

  });

  it('Should select query with "ilike" operator', () => {

    let rows = GOT.query().select([{last_name__ilike: 's%'}]).values();
    expect(rows.length).to.equal(5);

    let names = rows.reduce((names, row) => {
      names.add(row.last_name);
      return names;
    }, new Set());
    expect(Array.from(names)).to.deep.equal(['Snow', 'Stark']);

    rows = GOT.query().select([{last_name__ilike: 's%K'}]).values();
    expect(rows.length).to.equal(3);

    names = rows.reduce((names, row) => {
      names.add(row.last_name);
      return names;
    }, new Set());
    expect(Array.from(names)).to.deep.equal(['Stark']);


    rows = GOT.query().select([{first_name__ilike: 'r%s_'}]).values();
    expect(rows.length).to.equal(1);

    names = rows.reduce((names, row) => {
      names.add(row.first_name);
      return names;
    }, new Set());
    expect(Array.from(names)).to.deep.equal(['Roose']);

  });

});

describe('KeyQL Date Operator Tests', () => {

  it('Should select query with "recency_lt", "recency_lte" operator', () => {

    let hours = [4, 3, 2, 1, 0];
    let datestrings = hours.map(h => {
      return moment.utc(moment.now() - (h * 60 * 60 * 1000))
        .format('MM/DD/YYYY HH:mm:ss', 'UTC');
    });
    let dataset = datestrings.map((ds, i) => {
      return {
        index: i,
        date: ds
      };
    });

    let rows = new KeyQL(dataset).query().select([{date__recency_lt: 2 * 60 * 60}]).values();
    expect(rows.length).to.equal(2);
    expect(rows[0].index).to.equal(3);
    expect(rows[1].index).to.equal(4);

    rows = new KeyQL(dataset).query().select([{date__recency_lte: 2 * 60 * 60}]).values();
    expect(rows.length).to.equal(2);
    expect(rows[0].index).to.equal(3);
    expect(rows[1].index).to.equal(4);

  });

  it('Should select query with "recency_gt", "recency_gte" operator', () => {

    let hours = [4, 3, 2, 1, 0];
    let datestrings = hours.map(h => {
      return moment.utc(moment.now() - (h * 60 * 60 * 1000))
        .format('MM/DD/YYYY HH:mm:ss', 'UTC');
    });
    let dataset = datestrings.map((ds, i) => {
      return {
        index: i,
        date: ds
      };
    });

    let rows = new KeyQL(dataset).query().select([{date__recency_gt: 2 * 60 * 60}]).values();
    expect(rows.length).to.equal(3);
    expect(rows[0].index).to.equal(0);
    expect(rows[1].index).to.equal(1);
    expect(rows[2].index).to.equal(2);

    rows = new KeyQL(dataset).query().select([{date__recency_gte: 2 * 60 * 60}]).values();
    expect(rows.length).to.equal(3);
    expect(rows[0].index).to.equal(0);
    expect(rows[1].index).to.equal(1);
    expect(rows[2].index).to.equal(2);

  });

  it('Should select query with "upcoming_lt", "upcoming_lte" operator', () => {

    let hours = [4, 3, 2, 1, 0];
    let datestrings = hours.map(h => {
      return moment.utc(moment.now() + (h * 60 * 60 * 1000))
        .format('MM/DD/YYYY HH:mm:ss', 'UTC');
    });
    let dataset = datestrings.map((ds, i) => {
      return {
        index: i,
        date: ds
      };
    });

    let rows = new KeyQL(dataset).query().select([{date__upcoming_lt: 2 * 60 * 60}]).values();
    expect(rows.length).to.equal(2);
    expect(rows[0].index).to.equal(2);
    expect(rows[1].index).to.equal(3);

    rows = new KeyQL(dataset).query().select([{date__upcoming_lte: 2 * 60 * 60}]).values();
    expect(rows.length).to.equal(2);
    expect(rows[0].index).to.equal(2);
    expect(rows[1].index).to.equal(3);

  });

  it('Should select query with "upcoming_gt", "upcoming_gte" operator', () => {

    let hours = [4, 3, 2, 1, 0];
    let datestrings = hours.map(h => {
      return moment.utc(moment.now() + (h * 60 * 60 * 1000))
        .format('MM/DD/YYYY HH:mm:ss', 'UTC');
    });
    let dataset = datestrings.map((ds, i) => {
      return {
        index: i,
        date: ds
      };
    });

    let rows = new KeyQL(dataset).query().select([{date__upcoming_gt: 2 * 60 * 60}]).values();
    expect(rows.length).to.equal(2);
    expect(rows[0].index).to.equal(0);
    expect(rows[1].index).to.equal(1);

    rows = new KeyQL(dataset).query().select([{date__upcoming_gte: 2 * 60 * 60}]).values();
    expect(rows.length).to.equal(2);
    expect(rows[0].index).to.equal(0);
    expect(rows[1].index).to.equal(1);

  });

  it ('Should select query with "date_lt" operator', () => {

    let dataset = [
      {index: 0, date: '11/30/1987'},
      {index: 1, date: '12/06/1988'},
      {index: 2, date: '12/13/1989'}
    ];

    rows = new KeyQL(dataset).query().select([{date__lt: '12/06/1988'}]).values();
    expect(rows.length).to.equal(1);
    expect(rows[0].index).to.equal(0);

  });

  it ('Should select query with "date_lte" operator', () => {

    let dataset = [
      {index: 0, date: '11/30/1987'},
      {index: 1, date: '12/06/1988'},
      {index: 2, date: '12/13/1989'}
    ];

    rows = new KeyQL(dataset).query().select([{date__lte: '12/06/1988'}]).values();
    expect(rows.length).to.equal(2);
    expect(rows[0].index).to.equal(0);
    expect(rows[1].index).to.equal(1);

  });

  it ('Should select query with "date_gt" operator', () => {

    let dataset = [
      {index: 0, date: '11/30/1987'},
      {index: 1, date: '12/06/1988'},
      {index: 2, date: '12/13/1989'}
    ];

    rows = new KeyQL(dataset).query().select([{date__gt: '12/06/1988'}]).values();
    expect(rows.length).to.equal(1);
    expect(rows[0].index).to.equal(2);

  });

  it ('Should select query with "date_gte" operator', () => {

    let dataset = [
      {index: 0, date: '11/30/1987'},
      {index: 1, date: '12/06/1988'},
      {index: 2, date: '12/13/1989'}
    ];

    rows = new KeyQL(dataset).query().select([{date__gte: '12/06/1988'}]).values();
    expect(rows.length).to.equal(2);
    expect(rows[0].index).to.equal(1);
    expect(rows[1].index).to.equal(2);

  });

});

describe('KeyQL Map Tests', () => {

  let SHEETS;

  before(() => {
    SHEETS = new KeyQL(datasets.spreadsheet, v => v.fields);
  });

  it('Should map to an internal fieldset properly', () => {

    let rows = SHEETS.query().select([{name: 'Isabelle'}]).values();
    expect(rows.length).to.equal(1);
    expect(rows[0].fields).to.exist;
    expect(rows[0].fields.name).to.equal('Isabelle');

  });

  it('Should map to an internal fieldset and execute OR properly', () => {

    let rows = SHEETS.query().select([{name: 'Isabelle'}, {name: 'Frank'}]).values();
    expect(rows.length).to.equal(2);
    expect(rows[0].fields).to.exist;
    expect(rows[0].fields.name).to.equal('Frank');
    expect(rows[1].fields).to.exist;
    expect(rows[1].fields.name).to.equal('Isabelle');

  });

});

describe('KeyQL Limit Tests', () => {

  let SHEETS;

  before(() => {
    SHEETS = new KeyQL(datasets.spreadsheet, v => v.fields);
  });

  it('Should run a select query without a limit set', () => {

    let rows = SHEETS.query().select([{pets: "0"}]).limit({}).values();
    expect(rows.length).to.equal(3);
    expect(rows[0].fields.pets).to.equal("0");
    expect(rows[1].fields.pets).to.equal("0");
    expect(rows[2].fields.pets).to.equal("0");
    expect(rows[0].id).to.equal(3);
    expect(rows[1].id).to.equal(8);
    expect(rows[2].id).to.equal(9);

  });

  it('Should run a select query with a limit offset', () => {

    let rows = SHEETS.query().select([{pets: "0"}]).limit({offset: 1}).values();
    expect(rows.length).to.equal(2);
    expect(rows[0].fields.pets).to.equal("0");
    expect(rows[1].fields.pets).to.equal("0");
    expect(rows[0].id).to.equal(8);
    expect(rows[1].id).to.equal(9);

  });

  it('Should run a select query with a limit count', () => {

    let rows = SHEETS.query().select([{pets: "0"}]).limit({count: 1}).values();
    expect(rows.length).to.equal(1);
    expect(rows[0].fields.pets).to.equal("0");
    expect(rows[0].id).to.equal(3);

  });

  it('Should run a select query with a limit offset and count', () => {

    let rows = SHEETS.query().select([{pets: "0"}]).limit({offset: 1, count: 1}).values();
    expect(rows.length).to.equal(1);
    expect(rows[0].fields.pets).to.equal("0");
    expect(rows[0].id).to.equal(8);

  });

  it ('Should throw an error with a negative limit offset', () => {
    let rows, error;
    try {
      rows = SHEETS.query().select([{pets: "0"}]).limit({offset: -1});
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
  });

  it ('Should throw an error with an invalid limit offset', () => {
    let rows, error;
    try {
      rows = SHEETS.query().select([{pets: "0"}]).limit({offset: 'LOL'});
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
  });

  it ('Should throw an error with a float limit offset', () => {
    let rows, error;
    try {
      rows = SHEETS.query().select([{pets: "0"}]).limit({offset: 2.2});
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
  });

  it ('Should throw an error with a negative limit count', () => {
    let rows, error;
    try {
      rows = SHEETS.query().select([{pets: "0"}]).limit({count: -1});
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
  });

  it ('Should throw an error with an invalid limit count', () => {
    let rows, error;
    try {
      rows = SHEETS.query().select([{pets: "0"}]).limit({count: 'LOL'});
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
  });

  it ('Should throw an error with a float limit count', () => {
    let rows, error;
    try {
      rows = SHEETS.query().select([{pets: "0"}]).limit({count: 2.2});
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
  });

});

describe('KeyQL Order Tests', () => {

  let SHEETS;

  before(() => {
    SHEETS = new KeyQL(datasets.spreadsheet, v => v.fields);
  });

  it('Should order by name field ASC with no value set', () => {

    let rows = SHEETS.query().order([{field: 'name'}]).values();

    expect(rows[0].fields.name).to.equal('Alice');
    expect(rows[1].fields.name).to.equal('Bernard');
    expect(rows[9].fields.name).to.equal('Jason');
    expect(rows[10].fields.name).to.equal(null);

  });

  it('Should order by name field ASC with a value set', () => {

    let rows = SHEETS.query().order([{field: 'name', sort: 'ASC'}]).values();

    expect(rows[0].fields.name).to.equal('Alice');
    expect(rows[1].fields.name).to.equal('Bernard');
    expect(rows[9].fields.name).to.equal('Jason');
    expect(rows[10].fields.name).to.equal(null);

  });

  it('Should order by name field DESC with a value set', () => {

    let rows = SHEETS.query().order([{field: 'name', sort: 'DESC'}]).values();

    expect(rows[0].fields.name).to.equal('Jason');
    expect(rows[1].fields.name).to.equal('Isabelle');
    expect(rows[9].fields.name).to.equal('Alice');
    expect(rows[10].fields.name).to.equal(null);

  });

});

describe('KeyQL Update Tests', () => {

  let SHEETS;

  before(() => {
    SHEETS = new KeyQL(datasets.spreadsheet, v => v.fields);
  });

  it('Should run an update query', () => {

    let rows = SHEETS.query().select([{pets: "0"}]).update({pets: null});
    expect(rows.length).to.equal(3);
    expect(rows[0].fields.pets).to.equal(null);
    expect(rows[1].fields.pets).to.equal(null);
    expect(rows[2].fields.pets).to.equal(null);
    expect(rows[0].id).to.equal(3);
    expect(rows[1].id).to.equal(8);
    expect(rows[2].id).to.equal(9);

    rows = SHEETS.query().select([{pets: "0"}]).values();
    expect(rows.length).to.equal(0);

  });

  it ('Should keep track of updated rows', () => {

    let rows = SHEETS.changeset();
    expect(rows.length).to.equal(3);
    expect(rows[0].fields.pets).to.equal(null);
    expect(rows[1].fields.pets).to.equal(null);
    expect(rows[2].fields.pets).to.equal(null);
    expect(rows[0].id).to.equal(3);
    expect(rows[1].id).to.equal(8);
    expect(rows[2].id).to.equal(9);

  });

  it ('Should commit updates to a cloned dataset', () => {

    let COMMIT = SHEETS.commit();
    let rows = SHEETS.changeset();
    expect(rows.length).to.equal(3);

    rows = COMMIT.changeset();
    expect(rows.length).to.equal(0);

    rows = COMMIT.query().select([{pets: "0"}]).values();
    expect(rows.length).to.equal(0);

    rows = COMMIT.query().select([{pets: null}]).values();
    expect(rows.length).to.equal(3);

  });

});

describe('Wildcard Matching Tests', () => {

  it('Should match exact strings', () => {

    expect(isMatch('hello', 'hello')).to.be.true;
    expect(iIsMatch('world', 'world')).to.be.true;

  });

  it('Should match empty pattern against empty string', () => {

    expect(isMatch('', '')).to.be.true;
    expect(iIsMatch('', '')).to.be.true;

  });

  it('Should not match empty pattern against a string', () => {

    expect(isMatch('hello', '')).to.be.false;
    expect(iIsMatch('world', '')).to.be.false;

  });

  it('Should match with wildcard pattern', () => {

    expect(isMatch('hello', 'h_llo')).to.be.true;
    expect(iIsMatch('hello', 'h_llo')).to.be.true;

  });

  it('Should match with multiple wildcard patterns', () => {

    expect(isMatch('hello', '_____')).to.be.true;
    expect(iIsMatch('hello', '_____')).to.be.true;

  });

  it('Should match with glob pattern', () => {

    expect(isMatch('banana', '%ana')).to.be.true;
    expect(iIsMatch('BaNaNa', '%ana')).to.be.true;

  });

  it('Should match with multiple glob patterns', () => {

    expect(isMatch('HeLlo', '%Ll%')).to.be.true;
    expect(iIsMatch('HeLlo', '%ll%')).to.be.true;

  });

  it('Should match with wildcard and glob patterns', () => {

    expect(isMatch('banana', '%an_')).to.be.true;
    expect(iIsMatch('BaNaNa', '%an_')).to.be.true;

  });

  it('Should not match without insensitive matching', () => {

    expect(isMatch('Hello', '%h%')).to.be.false;
    expect(iIsMatch('Hello', '%h%')).to.be.true;

  });

  it('Should match with escaped wildcard', () => {

    expect(isMatch('H_llo', 'H\\_llo')).to.be.true;
    expect(isMatch('H__lo', 'H\\_\\_lo')).to.be.true;
    expect(isMatch('H_lzo', 'H\\_l_o')).to.be.true;
    expect(iIsMatch('h_llo', 'H\\_llo')).to.be.true;
    expect(iIsMatch('h__LO', 'H\\_\\_lo')).to.be.true;
    expect(iIsMatch('H_lzo', 'h\\_l_o')).to.be.true;

  });

  it('Should not match with escaped wildcard', () => {

    expect(isMatch('Hello', 'H\\_llo')).to.be.false;
    expect(iIsMatch('hello', 'H\\_LLo')).to.be.false;

  });


  it('Should match with escaped glob', () => {

    expect(isMatch('He%o', 'He\\%o')).to.be.true;
    expect(isMatch('He%y%o', 'He\\%y\\%o')).to.be.true;
    expect(isMatch('He%y%oooo', 'He\\%y\\%%')).to.be.true;
    expect(iIsMatch('He%o', 'he\\%o')).to.be.true;
    expect(iIsMatch('He%Y%O', 'he\\%y\\%o')).to.be.true;
    expect(iIsMatch('he%Y%oOOo', 'He\\%y\\%%')).to.be.true;

  });

  it('Should not match with escaped glob', () => {

    expect(isMatch('Heyo', 'He\\%o')).to.be.false;
    expect(isMatch('Heyo', 'He\\%o')).to.be.false;

  });

  it('Should match with escaped glob and wildcard', () => {

    expect(isMatch('%_%', '\\%\\_\\%')).to.be.true;
    expect(isMatch('hello %_% world', '% \\%\\_\\% %')).to.be.true;
    expect(iIsMatch('%_%', '\\%\\_\\%')).to.be.true;
    expect(iIsMatch('HELLO %_% world', '% \\%\\_\\% %')).to.be.true;

  });

  it('Should not match with escaped glob and wildcard', () => {

    expect(isMatch('%a%', '\\%\\_\\%')).to.be.false;
    expect(isMatch('hello %_% world', '% \\%\\_\\% \\%')).to.be.false;
    expect(iIsMatch('%A%', '\\%\\_\\%')).to.be.false;
    expect(iIsMatch('HELLO %_% world', '% \\%\\_\\% \\%')).to.be.false;

  });

});

describe('KeyQL Translation Tests', () => {

  it('Should throw an error when an invalid language is provided', () => {
    let translation, error;
    try {
      translation = KeyQL.translate([], 'invalid_language');
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
  });

});

describe('KeyQL to ShopifyQL Translation Tests', () => {

  let language = 'ShopifyQL';
  let dateTimeFormat = 'YYYY-MM-DDTHH:mm:ssZ';

  const formatDateTime = (dateTime) => dateTime.format(dateTimeFormat).replace(/\+00:00/g, 'Z');

  it('Should translate query with a specific field (default)', () => {
    let translation;

    translation = KeyQL.translate([{title: 'T-Shirt'}], language);
    expect(translation).to.equal('(title:"T-Shirt")');

    translation = KeyQL.translate([{title: 'Blue T-Shirt'}], language);
    expect(translation).to.equal('(title:"Blue T-Shirt")');

    translation = KeyQL.translate([{title: 'Spe:cial : (hars ( ) \\Pro)uct'}], language);
    expect(translation).to.equal('(title:"Spe\\:cial \\: \\(hars \\( \\) \\\\Pro\\)uct")');

  });

  it('Should translate query with "is" operator', () => {

    let translation;

    translation = KeyQL.translate([{title__is: 'T-Shirt'}], language);
    expect(translation).to.equal('(title:"T-Shirt")');

    translation = KeyQL.translate([{title__is: 'Blue T-Shirt'}], language);
    expect(translation).to.equal('(title:"Blue T-Shirt")');

    translation = KeyQL.translate([{title__is: 'Spe:cial : (hars ( ) \\Pro)uct'}], language);
    expect(translation).to.equal('(title:"Spe\\:cial \\: \\(hars \\( \\) \\\\Pro\\)uct")');

  });

  it('Should translate query with "not" operator', () => {

    let translation;

    translation = KeyQL.translate([{title__not: 'T-Shirt'}], language);
    expect(translation).to.equal('(-title:"T-Shirt")');

    translation = KeyQL.translate([{title__not: 'Blue T-Shirt'}], language);
    expect(translation).to.equal('(-title:"Blue T-Shirt")');

    translation = KeyQL.translate([{title__not: 'Spe:cial : (hars ( ) \\Pro)uct'}], language);
    expect(translation).to.equal('(-title:"Spe\\:cial \\: \\(hars \\( \\) \\\\Pro\\)uct")');

  });

  it('Should translate query with "gt" operator', () => {

    let translation;

    translation = KeyQL.translate([{price__gt: '99'}], language);
    expect(translation).to.equal('(price:>"99")');

    translation = KeyQL.translate([{price__gt: 99}], language);
    expect(translation).to.equal('(price:>"99")');

    translation = KeyQL.translate([{price__gt: 99.99}], language);
    expect(translation).to.equal('(price:>"99.99")');

    translation = KeyQL.translate([{price__gt: '99.99'}], language);
    expect(translation).to.equal('(price:>"99.99")');

    translation = KeyQL.translate([{price__gt: 100.00}], language);
    expect(translation).to.equal('(price:>"100")');

    translation = KeyQL.translate([{price__gt: '100.00'}], language);
    expect(translation).to.equal('(price:>"100.00")');

    translation = KeyQL.translate([{created_at__gt: '2020-05-18T19:13:00Z'}], language);
    expect(translation).to.equal('(created_at:>"2020-05-18T19\\:13\\:00Z")');

  });

  it('Should translate query with "gte" operator', () => {

    let translation;

    translation = KeyQL.translate([{price__gte: '99'}], language);
    expect(translation).to.equal('(price:>="99")');

    translation = KeyQL.translate([{price__gte: 99}], language);
    expect(translation).to.equal('(price:>="99")');

    translation = KeyQL.translate([{price__gte: 99.99}], language);
    expect(translation).to.equal('(price:>="99.99")');

    translation = KeyQL.translate([{price__gte: '99.99'}], language);
    expect(translation).to.equal('(price:>="99.99")');

    translation = KeyQL.translate([{price__gte: 100.00}], language);
    expect(translation).to.equal('(price:>="100")');

    translation = KeyQL.translate([{price__gte: '100.00'}], language);
    expect(translation).to.equal('(price:>="100.00")');

    translation = KeyQL.translate([{created_at__gte: '2020-05-18T19:13:00Z'}], language);
    expect(translation).to.equal('(created_at:>="2020-05-18T19\\:13\\:00Z")');

  });

  it('Should translate query with "lt" operator', () => {

    let translation;

    translation = KeyQL.translate([{price__lt: '99'}], language);
    expect(translation).to.equal('(price:<"99")');

    translation = KeyQL.translate([{price__lt: 99}], language);
    expect(translation).to.equal('(price:<"99")');

    translation = KeyQL.translate([{price__lt: 99.99}], language);
    expect(translation).to.equal('(price:<"99.99")');

    translation = KeyQL.translate([{price__lt: '99.99'}], language);
    expect(translation).to.equal('(price:<"99.99")');

    translation = KeyQL.translate([{price__lt: 100.00}], language);
    expect(translation).to.equal('(price:<"100")');

    translation = KeyQL.translate([{price__lt: '100.00'}], language);
    expect(translation).to.equal('(price:<"100.00")');

    translation = KeyQL.translate([{created_at__lt: '2020-05-18T19:13:00Z'}], language);
    expect(translation).to.equal('(created_at:<"2020-05-18T19\\:13\\:00Z")');

  });

  it('Should translate query with "lte" operator', () => {

    let translation;

    translation = KeyQL.translate([{price__lte: '99'}], language);
    expect(translation).to.equal('(price:<="99")');

    translation = KeyQL.translate([{price__lte: 99}], language);
    expect(translation).to.equal('(price:<="99")');

    translation = KeyQL.translate([{price__lte: 99.99}], language);
    expect(translation).to.equal('(price:<="99.99")');

    translation = KeyQL.translate([{price__lte: '99.99'}], language);
    expect(translation).to.equal('(price:<="99.99")');

    translation = KeyQL.translate([{price__lte: 100.00}], language);
    expect(translation).to.equal('(price:<="100")');

    translation = KeyQL.translate([{price__lte: '100.00'}], language);
    expect(translation).to.equal('(price:<="100.00")');

    translation = KeyQL.translate([{created_at__lte: '2020-05-18T19:13:00Z'}], language);
    expect(translation).to.equal('(created_at:<="2020-05-18T19\\:13\\:00Z")');

  });

  it('Should translate query with "iwordstartswith" operator', () => {

    let translation;

    translation = KeyQL.translate([{title__iwordstartswith: 'T-Shirt'}], language);
    expect(translation).to.equal('(title:\\"T-Shirt\\"*)');

    translation = KeyQL.translate([{title__iwordstartswith: 'Blue T-Shirt'}], language);
    expect(translation).to.equal('(title:\\"Blue T-Shirt\\"*)');

    translation = KeyQL.translate([{title__iwordstartswith: 'Spe:cial : (hars ( ) \\Pro)uct'}], language);
    expect(translation).to.equal('(title:\\"Spe\\:cial \\: \\(hars \\( \\) \\\\Pro\\)uct\\"*)');

  });

  it('Should translate query with "is_null" operator', () => {

    let translation;

    translation = KeyQL.translate([{email__is_null: true}], language);
    expect(translation).to.equal('(-email:*)');

  });

  it('Should translate query with "not_null" operator', () => {

    let translation;

    translation = KeyQL.translate([{email__not_null: true}], language);
    expect(translation).to.equal('(email:*)');

  });

  it('Should translate query with "is_true" operator', () => {

    let translation;

    translation = KeyQL.translate([{is_price_reduced__is_true: true}], language);
    expect(translation).to.equal('(is_price_reduced:true)');

  });

  it('Should translate query with "not_true" operator', () => {

    let translation;

    translation = KeyQL.translate([{is_price_reduced__not_true: true}], language);
    expect(translation).to.equal('(-is_price_reduced:true)');

  });

  it('Should translate query with "is_false" operator', () => {

    let translation;

    translation = KeyQL.translate([{is_price_reduced__is_false: true}], language);
    expect(translation).to.equal('(is_price_reduced:false)');

  });

  it('Should translate query with "not_false" operator', () => {

    let translation;

    translation = KeyQL.translate([{is_price_reduced__not_false: true}], language);
    expect(translation).to.equal('(-is_price_reduced:false)');

  });

  it('Should translate query with "in" operator', () => {

    let translation;

    translation = KeyQL.translate([{title__in: ['T-Shirt', 'Jeans', 'Shoes']}], language);
    expect(translation).to.equal('((title:"T-Shirt" OR title:"Jeans" OR title:"Shoes"))');

    translation = KeyQL.translate([{title__in: ['T-Shirt']}], language);
    expect(translation).to.equal('((title:"T-Shirt"))');

    translation = KeyQL.translate([{title__in: []}], language);
    expect(translation).to.equal('(())');

  });

  it('Should translate query with "not_in" operator', () => {

    let translation;

    translation = KeyQL.translate([{title__not_in: ['T-Shirt', 'Jeans', 'Shoes']}], language);
    expect(translation).to.equal('((-title:"T-Shirt" AND -title:"Jeans" AND -title:"Shoes"))');

    translation = KeyQL.translate([{title__not_in: ['T-Shirt']}], language);
    expect(translation).to.equal('((-title:"T-Shirt"))');

    translation = KeyQL.translate([{title__not_in: []}], language);
    expect(translation).to.equal('(())');

  });

  it('Should translate query with "recency_lt" operator', () => {

    let translation;
    let secondsInTwoHours = 2 * 60 * 60;
    let nowUTC = moment.utc(moment.now());
    let twoHoursAgo = formatDateTime(moment(nowUTC).subtract(2, 'hours'));

    translation = KeyQL.translate([{created_at__recency_lt: secondsInTwoHours}], language);
    expect(translation).to.equal(`(created_at:>"${twoHoursAgo}" AND created_at:<="${formatDateTime(nowUTC)}")`);

  });

  it('Should translate query with "recency_lte" operator', () => {

    let translation;
    let secondsInTwoHours = 2 * 60 * 60;
    let nowUTC = moment.utc(moment.now());
    let twoHoursAgo = formatDateTime(moment(nowUTC).subtract(2, 'hours'));

    translation = KeyQL.translate([{created_at__recency_lte: secondsInTwoHours}], language);
    expect(translation).to.equal(`(created_at:>="${twoHoursAgo}" AND created_at:<="${formatDateTime(nowUTC)}")`);

  });

  it('Should translate query with "recency_gt" operator', () => {

    let translation;
    let secondsInTwoHours = 2 * 60 * 60;
    let nowUTC = moment.utc(moment.now());
    let twoHoursAgo = formatDateTime(moment(nowUTC).subtract(2, 'hours'));

    translation = KeyQL.translate([{created_at__recency_gt: secondsInTwoHours}], language);
    expect(translation).to.equal(`(created_at:<"${twoHoursAgo}")`);

  });

  it('Should translate query with "recency_gte" operator', () => {

    let translation;
    let secondsInTwoHours = 2 * 60 * 60;
    let nowUTC = moment.utc(moment.now());
    let twoHoursAgo = formatDateTime(moment(nowUTC).subtract(2, 'hours'));

    translation = KeyQL.translate([{created_at__recency_gte: secondsInTwoHours}], language);
    expect(translation).to.equal(`(created_at:<="${twoHoursAgo}")`);

  });

  it('Should translate query with "upcoming_lt" operator', () => {

    let translation;
    let secondsInTwoHours = 2 * 60 * 60;
    let nowUTC = moment.utc(moment.now());
    let twoHoursFromNow = formatDateTime(moment(nowUTC).add(2, 'hours'));

    translation = KeyQL.translate([{created_at__upcoming_lt: secondsInTwoHours}], language);
    expect(translation).to.equal(`(created_at:>="${formatDateTime(nowUTC)}" AND created_at:<"${twoHoursFromNow}")`);

  });

  it('Should translate query with "upcoming_lte" operator', () => {

    let translation;
    let secondsInTwoHours = 2 * 60 * 60;
    let nowUTC = moment.utc(moment.now());
    let twoHoursFromNow = formatDateTime(moment(nowUTC).add(2, 'hours'));

    translation = KeyQL.translate([{created_at__upcoming_lte: secondsInTwoHours}], language);
    expect(translation).to.equal(`(created_at:>="${formatDateTime(nowUTC)}" AND created_at:<="${twoHoursFromNow}")`);

  });

  it('Should translate query with "upcoming_gt" operator', () => {

    let translation;
    let secondsInTwoHours = 2 * 60 * 60;
    let nowUTC = moment.utc(moment.now());
    let twoHoursFromNow = formatDateTime(moment(nowUTC).add(2, 'hours'));

    translation = KeyQL.translate([{created_at__upcoming_gt: secondsInTwoHours}], language);
    expect(translation).to.equal(`(created_at:>"${twoHoursFromNow}")`);

  });

  it('Should translate query with "upcoming_gte" operator', () => {

    let translation;
    let secondsInTwoHours = 2 * 60 * 60;
    let nowUTC = moment.utc(moment.now());
    let twoHoursFromNow = formatDateTime(moment(nowUTC).add(2, 'hours'));

    translation = KeyQL.translate([{created_at__upcoming_gte: secondsInTwoHours}], language);
    expect(translation).to.equal(`(created_at:>="${twoHoursFromNow}")`);

  });

  it('Should translate query with "date_lt" operator', () => {

    let translation;

    translation = KeyQL.translate([{created_at__date_lt: '2020-05-18T19:13:00Z'}], language);
    expect(translation).to.equal(`(created_at:<"2020-05-18T19\\:13\\:00Z")`);

    translation = KeyQL.translate([{created_at__date_lt: '2020-04-06T10:25:49-07:00'}], language);
    expect(translation).to.equal(`(created_at:<"2020-04-06T10\\:25\\:49-07\\:00")`);

  });

  it('Should translate query with "date_lte" operator', () => {

    let translation;

    translation = KeyQL.translate([{created_at__date_lte: '2020-05-18T19:13:00Z'}], language);
    expect(translation).to.equal(`(created_at:<="2020-05-18T19\\:13\\:00Z")`);

    translation = KeyQL.translate([{created_at__date_lte: '2020-04-06T10:25:49-07:00'}], language);
    expect(translation).to.equal(`(created_at:<="2020-04-06T10\\:25\\:49-07\\:00")`);

  });

  it('Should translate query with "date_gt" operator', () => {

    let translation;

    translation = KeyQL.translate([{created_at__date_gt: '2020-05-18T19:13:00Z'}], language);
    expect(translation).to.equal(`(created_at:>"2020-05-18T19\\:13\\:00Z")`);

    translation = KeyQL.translate([{created_at__date_gt: '2020-04-06T10:25:49-07:00'}], language);
    expect(translation).to.equal(`(created_at:>"2020-04-06T10\\:25\\:49-07\\:00")`);

  });

  it('Should translate query with "date_gte" operator', () => {

    let translation;

    translation = KeyQL.translate([{created_at__date_gte: '2020-05-18T19:13:00Z'}], language);
    expect(translation).to.equal(`(created_at:>="2020-05-18T19\\:13\\:00Z")`);

    translation = KeyQL.translate([{created_at__date_gte: '2020-04-06T10:25:49-07:00'}], language);
    expect(translation).to.equal(`(created_at:>="2020-04-06T10\\:25\\:49-07\\:00")`);

  });

  it('Should translate chained operators', () => {

    let translation;
    let secondsInTwoHours = 2 * 60 * 60;
    let nowUTC = moment.utc(moment.now());
    let twoHoursAgo = formatDateTime(moment(nowUTC).subtract(2, 'hours'));

    translation = KeyQL.translate([{title: 'T-Shirt', title__not: 'Jeans'}], language);
    expect(translation).to.equal(`(title:"T-Shirt" AND -title:"Jeans")`);

    translation = KeyQL.translate([{title: 'T-Shirt', title__not: 'Jeans', price__gt: '99'}], language);
    expect(translation).to.equal(`(title:"T-Shirt" AND -title:"Jeans" AND price:>"99")`);

    translation = KeyQL.translate([{title: 'T-Shirt'}, {title__not: 'Jeans'}], language);
    expect(translation).to.equal(`(title:"T-Shirt") OR (-title:"Jeans")`);

    translation = KeyQL.translate([{title: 'T-Shirt'}, {title__not: 'Jeans'}, {title__not: 'Shoes'}], language);
    expect(translation).to.equal(`(title:"T-Shirt") OR (-title:"Jeans") OR (-title:"Shoes")`);

    translation = KeyQL.translate([{title: 'T-Shirt', price__lt: 99.99}, {title__not: 'Jeans', is_price_reduced__is_true: true}, {title__not: 'Shoes', created_at__recency_lte: secondsInTwoHours }], language);
    expect(translation).to.equal(`(title:"T-Shirt" AND price:<"99.99") OR (-title:"Jeans" AND is_price_reduced:true) OR (-title:"Shoes" AND created_at:>="${twoHoursAgo}" AND created_at:<="${formatDateTime(nowUTC)}")`);

    translation = KeyQL.translate([
      {
        title__in: ['Shoes', 'Hat', 'Jeans'],
        created_at__lte: '2020-05-18T19:13:00Z'
      },
      {
        price__gte: 99.99,
        is_price_reduced__not_true: true,
      },
      {
        inventory_total: 1000
      },
      {
        out_of_stock_somewhere__is_false: true
      }
    ], language);
    expect(translation).to.equal('((title:"Shoes" OR title:"Hat" OR title:"Jeans") AND created_at:<="2020-05-18T19\\:13\\:00Z") OR (price:>="99.99" AND -is_price_reduced:true) OR (inventory_total:"1000") OR (out_of_stock_somewhere:false)');

  });

  it('Should throw an error with translating unsupported operator "icontains"', () => {

    let translation, error;

    try {
      translation = KeyQL.translate([{title__icontains: 'T-Shirt'}], language);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(error.message).to.contain('"icontains"');

  });

  it('Should throw an error with translating unsupported operator "contains"', () => {

    let translation, error;

    try {
      translation = KeyQL.translate([{title__contains: 'T-Shirt'}], language);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(error.message).to.contain('"contains"');

  });

  it('Should throw an error with translating unsupported operator "startswith"', () => {

    let translation, error;

    try {
      translation = KeyQL.translate([{title__startswith: 'T-Shirt'}], language);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(error.message).to.contain('"startswith"');

  });

  it('Should throw an error with translating unsupported operator "istartswith"', () => {

    let translation, error;

    try {
      translation = KeyQL.translate([{title__istartswith: 'T-Shirt'}], language);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(error.message).to.contain('"istartswith"');

  });

  it('Should throw an error with translating unsupported operator "wordstartswith"', () => {

    let translation, error;

    try {
      translation = KeyQL.translate([{title__wordstartswith: 'T-Shirt'}], language);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(error.message).to.contain('"wordstartswith"');

  });

  it('Should throw an error with translating unsupported operator "wordendswith"', () => {

    let translation, error;

    try {
      translation = KeyQL.translate([{title__wordendswith: 'T-Shirt'}], language);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(error.message).to.contain('"wordendswith"');

  });

  it('Should throw an error with translating unsupported operator "iwordendswith"', () => {

    let translation, error;

    try {
      translation = KeyQL.translate([{title__iwordendswith: 'T-Shirt'}], language);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(error.message).to.contain('"iwordendswith"');

  });

  it('Should throw an error with translating unsupported operator "endswith"', () => {

    let translation, error;

    try {
      translation = KeyQL.translate([{title__endswith: 'T-Shirt'}], language);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(error.message).to.contain('"endswith"');

  });

  it('Should throw an error with translating unsupported operator "iendswith"', () => {

    let translation, error;

    try {
      translation = KeyQL.translate([{title__iendswith: 'T-Shirt'}], language);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(error.message).to.contain('"iendswith"');

  });

  it('Should throw an error with translating unsupported operator "like"', () => {

    let translation, error;

    try {
      translation = KeyQL.translate([{title__like: 'T-Shirt'}], language);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(error.message).to.contain('"like"');

  });

  it('Should throw an error with translating unsupported operator "ilike"', () => {

    let translation, error;

    try {
      translation = KeyQL.translate([{title__ilike: 'T-Shirt'}], language);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(error.message).to.contain('"ilike"');

  });

});
