const KeyQL = require('../module/index.js');
const expect = require('chai').expect;
const datasets = require('./datasets.json');

describe('KeyQL Setup Tests', () => {

  it ('Should query an empty dataset with no parameters provided', () => {
    let rows = KeyQL.select();
    expect(rows.length).to.equal(0);
  });

  it ('Should query an empty dataset directly', () => {
    let rows = KeyQL.select([]);
    expect(rows.length).to.equal(0);
  });

  it ('Should throw an error when a non-array dataset is provided', () => {
    let rows, error;
    try {
      rows = KeyQL.select({});
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
  });

  it ('Should throw an error when a non-array query is provided', () => {
    let rows, error;
    try {
      rows = KeyQL.select([], {});
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
  });

  it ('Should throw an error when a query is provided with an invalid operator', () => {
    let rows, error;
    try {
      rows = KeyQL.select([], [{key__NO_OP: true}]);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
  });

  it ('Should throw an error when an non-object limit is provided', () => {
    let rows, error;
    try {
      rows = KeyQL.select([], [], true);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
  });

  it ('Should throw an error when an non-object (array) limit is provided', () => {
    let rows, error;
    try {
      rows = KeyQL.select([], [], []);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
  });

  it ('Should not throw an error when an empty limit object is provided', () => {
    let rows, error;
    try {
      rows = KeyQL.select([], [], {});
    } catch (e) {
      error = e;
    }
    expect(error).to.not.exist;
  });

  it ('Should not throw an error when a limit object with only "offset" is provided', () => {
    let rows, error;
    try {
      rows = KeyQL.select([], [], {offset: 10});
    } catch (e) {
      error = e;
    }
    expect(error).to.not.exist;
  });

  it ('Should not throw an error when a limit object with only "count" is provided', () => {
    let rows, error;
    try {
      rows = KeyQL.select([], [], {count: 10});
    } catch (e) {
      error = e;
    }
    expect(error).to.not.exist;
  });

  it ('Should throw an error if limit object overloaded', () => {
    let rows, error;
    try {
      rows = KeyQL.select([], [], {INVALID: 10});
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
  });

  it ('Should throw an error if map function is not a function', () => {
    let rows, error;
    try {
      rows = KeyQL.select([], [], {}, true);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
  });

});

describe('KeyQL Operator Tests', () => {

  it('Should select query by a specific field (default)', () => {

    let rows = KeyQL.select(datasets.gameofthrones, [{last_name: 'Snow'}]);
    expect(rows.length).to.equal(2);
    expect(rows[0].last_name).to.equal('Snow');
    expect(rows[1].last_name).to.equal('Snow');

  });

  it('Should select query with "not" operator', () => {

    let rows = KeyQL.select(datasets.gameofthrones, [{last_name__not: 'Snow'}]);
    expect(rows.length).to.equal(4);
    expect(rows[0].last_name).to.equal('Stark');
    expect(rows[1].last_name).to.equal('Stark');
    expect(rows[2].last_name).to.equal('Bolton');
    expect(rows[3].last_name).to.equal('Stark');

  });

  it('Should select query with "gt" operator', () => {

    let rows = KeyQL.select(datasets.gameofthrones, [{age__gt: 33}]);
    expect(rows.length).to.equal(2);
    expect(rows[0].age).to.be.gt(33);
    expect(rows[1].age).to.be.gt(33);

  });

  it('Should select query with "gte" operator', () => {

    let rows = KeyQL.select(datasets.gameofthrones, [{age__gte: 33}]);
    expect(rows.length).to.equal(3);
    expect(rows[0].age).to.be.gte(33);
    expect(rows[1].age).to.be.gte(33);
    expect(rows[2].age).to.be.gte(33);

  });

  it('Should select query with "lt" operator', () => {

    let rows = KeyQL.select(datasets.gameofthrones, [{age__lt: 33}]);
    expect(rows.length).to.equal(3);
    expect(rows[0].age).to.be.lt(33);
    expect(rows[1].age).to.be.lt(33);
    expect(rows[2].age).to.be.lt(33);

  });

  it('Should select query with "lte" operator', () => {

    let rows = KeyQL.select(datasets.gameofthrones, [{age__lte: 33}]);
    expect(rows.length).to.equal(4);
    expect(rows[0].age).to.be.lte(33);
    expect(rows[1].age).to.be.lte(33);
    expect(rows[2].age).to.be.lte(33);
    expect(rows[3].age).to.be.lte(33);

  });

  it('Should select query with "icontains" operator', () => {

    let rows = KeyQL.select(datasets.gameofthrones, [{location__icontains: 'dread'}]);
    expect(rows.length).to.equal(2);
    expect(rows[0].location).to.equal('Dreadfort');
    expect(rows[1].location).to.equal('Dreadfort');

  });

  it('Should select query with "contains" operator', () => {

    let rows = KeyQL.select(datasets.gameofthrones, [{location__contains: 'dread'}]);
    expect(rows.length).to.equal(0);

    rows = KeyQL.select(datasets.gameofthrones, [{location__contains: 'Dread'}]);
    expect(rows.length).to.equal(2);
    expect(rows[0].location).to.equal('Dreadfort');
    expect(rows[1].location).to.equal('Dreadfort');

  });

  it('Should select query with "istartswith" operator', () => {

    let rows = KeyQL.select(datasets.gameofthrones, [{first_name__istartswith: 'c'}]);
    expect(rows.length).to.equal(1);
    expect(rows[0].first_name).to.equal('Catelyn');

  });

  it('Should select query with "startswith" operator', () => {

    let rows = KeyQL.select(datasets.gameofthrones, [{first_name__startswith: 'c'}]);
    expect(rows.length).to.equal(0);

    rows = KeyQL.select(datasets.gameofthrones, [{first_name__startswith: 'C'}]);
    expect(rows.length).to.equal(1);
    expect(rows[0].first_name).to.equal('Catelyn');

  });

  it('Should select query with "iendswith" operator', () => {

    let rows = KeyQL.select(datasets.gameofthrones, [{first_name__iendswith: 'N'}]);
    expect(rows.length).to.equal(2);
    expect(rows[0].first_name).to.equal('Jon');
    expect(rows[1].first_name).to.equal('Catelyn');

  });

  it('Should select query with "endswith" operator', () => {

    let rows = KeyQL.select(datasets.gameofthrones, [{first_name__endswith: 'N'}]);
    expect(rows.length).to.equal(0);

    rows = KeyQL.select(datasets.gameofthrones, [{first_name__endswith: 'n'}]);
    expect(rows.length).to.equal(2);
    expect(rows[0].first_name).to.equal('Jon');
    expect(rows[1].first_name).to.equal('Catelyn');

  });

  it('Should select query with "is_null" operator', () => {

    let rows = KeyQL.select(datasets.gameofthrones, [{lives_remaining__is_null: true}]);
    expect(rows.length).to.equal(1);
    expect(rows[0].lives_remaining).to.equal(null);

  });

  it('Should select query with "not_null" operator', () => {

    let rows = KeyQL.select(datasets.gameofthrones, [{lives_remaining__not_null: true}]);
    expect(rows.length).to.equal(5);
    expect(rows[0].lives_remaining).to.not.equal(null);
    expect(rows[1].lives_remaining).to.not.equal(null);
    expect(rows[2].lives_remaining).to.not.equal(null);
    expect(rows[3].lives_remaining).to.not.equal(null);
    expect(rows[4].lives_remaining).to.not.equal(null);

  });

  it('Should select query with "is_true" operator', () => {

    let rows = KeyQL.select(datasets.gameofthrones, [{is_sean_bean__is_true: true}]);
    expect(rows.length).to.equal(1);
    expect(rows[0].is_sean_bean).to.equal(true);

  });

  it('Should select query with "not_true" operator', () => {

    let rows = KeyQL.select(datasets.gameofthrones, [{is_sean_bean__not_true: true}]);
    expect(rows.length).to.equal(5);
    expect(rows[0].is_sean_bean).to.not.equal(true);
    expect(rows[1].is_sean_bean).to.not.equal(true);
    expect(rows[2].is_sean_bean).to.not.equal(true);
    expect(rows[3].is_sean_bean).to.not.equal(true);
    expect(rows[4].is_sean_bean).to.not.equal(true);

  });

  it('Should select query with "is_false" operator', () => {

    let rows = KeyQL.select(datasets.gameofthrones, [{is_sean_bean__is_false: true}]);
    expect(rows.length).to.equal(3);
    expect(rows[0].is_sean_bean).to.equal(false);
    expect(rows[1].is_sean_bean).to.equal(false);

  });

  it('Should select query with "not_false" operator', () => {

    let rows = KeyQL.select(datasets.gameofthrones, [{is_sean_bean__not_false: true}]);
    expect(rows.length).to.equal(3);
    expect(rows[0].is_sean_bean).to.not.equal(false);
    expect(rows[1].is_sean_bean).to.not.equal(false);
    expect(rows[2].is_sean_bean).to.not.equal(false);

  });

  it('Should select query with "in" operator', () => {

    let rows = KeyQL.select(datasets.gameofthrones, [{first_name__in: ['Eddard', 'Catelyn']}]);
    expect(rows.length).to.equal(2);
    expect(rows[0].first_name).to.be.oneOf(['Eddard', 'Catelyn']);
    expect(rows[1].first_name).to.be.oneOf(['Eddard', 'Catelyn']);

  });

  it('Should select query with "not_in" operator', () => {

    let rows = KeyQL.select(datasets.gameofthrones, [{first_name__not_in: ['Arya', 'Jon']}]);
    expect(rows.length).to.equal(4);
    expect(rows[0].first_name).to.not.be.oneOf(['Arya', 'Jon']);
    expect(rows[1].first_name).to.not.be.oneOf(['Arya', 'Jon']);
    expect(rows[2].first_name).to.not.be.oneOf(['Arya', 'Jon']);
    expect(rows[3].first_name).to.not.be.oneOf(['Arya', 'Jon']);

  });

});
